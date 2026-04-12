import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * POST /api/reports/monthly/generate?month=2026-04
 *
 * 指定月のデータを user_events / chat_sessions / leads / favorites から集計し、
 * platform 全体 + builder 別の 2 種レポートを monthly_reports に UPSERT する。
 */
export async function POST(request: NextRequest) {
  const month = request.nextUrl.searchParams.get('month')
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return Response.json({ error: 'month parameter required (YYYY-MM)' }, { status: 400 })
  }

  const monthStart = `${month}-01T00:00:00+09:00`
  const [y, m] = month.split('-').map(Number)
  const nextMonth = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`
  const monthEnd = `${nextMonth}-01T00:00:00+09:00`
  const reportMonth = `${month}-01`

  try {
    const supabase = createServerClient()

    // 1. user_events 集計
    const { data: events } = await supabase
      .from('user_events')
      .select('*')
      .gte('created_at', monthStart)
      .lt('created_at', monthEnd)

    const allEvents = events || []
    const uniqueVisitors = new Set(allEvents.map((e) => e.anonymous_id)).size
    const byDevice: Record<string, number> = {}
    const bySource: Record<string, number> = {}
    const byContent: Record<string, number> = {}
    for (const e of allEvents) {
      const device = e.device_type || 'unknown'
      byDevice[device] = (byDevice[device] || 0) + 1
      const source = e.source || 'direct'
      bySource[source] = (bySource[source] || 0) + 1
      if (e.event_type === 'property_view' || e.event_type === 'video_view') {
        const contentId = e.content_id || 'unknown'
        byContent[contentId] = (byContent[contentId] || 0) + 1
      }
    }

    // 2. chat_sessions 集計
    const { data: chats } = await supabase
      .from('chat_sessions')
      .select('*')
      .gte('created_at', monthStart)
      .lt('created_at', monthEnd)

    const allChats = chats || []
    const completedChats = allChats.filter((c) => (c.message_count || 0) >= 5)
    const chatToLead = allChats.filter((c) => c.lead_id).length

    // 3. leads 集計
    const { data: leads } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', monthStart)
      .lt('created_at', monthEnd)

    const allLeads = leads || []
    const leadsByType: Record<string, number> = {}
    const leadsByStatus: Record<string, number> = {}
    for (const l of allLeads) {
      const t = l.type || 'other'
      leadsByType[t] = (leadsByType[t] || 0) + 1
      const s = l.status || 'unknown'
      leadsByStatus[s] = (leadsByStatus[s] || 0) + 1
    }

    // 4. favorites 集計
    const { data: favs } = await supabase
      .from('favorites')
      .select('*')
      .gte('created_at', monthStart)
      .lt('created_at', monthEnd)

    const favoritesAdded = favs?.length || 0

    // 5. 前月比
    const prevMonth = m === 1 ? `${y - 1}-12-01` : `${y}-${String(m - 1).padStart(2, '0')}-01`
    const { data: prevReport } = await supabase
      .from('monthly_reports')
      .select('metrics')
      .eq('report_month', prevMonth)
      .eq('report_type', 'platform')
      .maybeSingle()

    const prev = prevReport?.metrics as Record<string, Record<string, number>> | null
    const prevVisitors = prev?.visitors?.unique || 0
    const prevLeads = prev?.leads?.total || 0
    const prevChats = prev?.chat?.sessionsStarted || 0

    function pctChange(current: number, previous: number): number {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    const sortedContent = Object.entries(byContent)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([id, views]) => ({ id, title: id, views }))

    // Platform metrics
    const platformMetrics = {
      visitors: { total: allEvents.length, unique: uniqueVisitors, byDevice, bySource },
      content: {
        propertyViews: allEvents.filter((e) => e.event_type === 'property_view').length,
        articleReads: allEvents.filter((e) => e.event_type === 'article_read').length,
        videoViews: allEvents.filter((e) => e.event_type === 'video_view').length,
        topProperties: sortedContent,
      },
      engagement: {
        favoritesAdded,
        comparisonsCreated: 0,
        simulatorUses: allEvents.filter((e) => e.event_type === 'simulator_use').length,
        lineClicks: allEvents.filter((e) => e.event_type === 'line_click').length,
        telClicks: allEvents.filter((e) => e.event_type === 'tel_click').length,
      },
      chat: {
        sessionsStarted: allChats.length,
        sessionsCompleted: completedChats.length,
        completionRate: allChats.length > 0 ? Math.round((completedChats.length / allChats.length) * 100) : 0,
        toLeadConversions: chatToLead,
      },
      leads: {
        total: allLeads.length,
        byType: leadsByType,
        byStatus: leadsByStatus,
        conversionRate: uniqueVisitors > 0 ? Math.round((allLeads.length / uniqueVisitors) * 10000) / 100 : 0,
      },
      monthOverMonth: {
        visitorsChange: pctChange(uniqueVisitors, prevVisitors),
        leadsChange: pctChange(allLeads.length, prevLeads),
        chatChange: pctChange(allChats.length, prevChats),
      },
    }

    // UPSERT platform report
    const { error: platformError } = await supabase
      .from('monthly_reports')
      .upsert(
        {
          report_month: reportMonth,
          report_type: 'platform',
          builder_id: null,
          metrics: platformMetrics,
          generated_at: new Date().toISOString(),
        },
        { onConflict: 'report_month,report_type,builder_id' }
      )

    if (platformError) throw platformError

    // Builder reports
    const { data: builders } = await supabase.from('builders').select('id, name')
    const builderList = builders || []
    let builderCount = 0

    for (const builder of builderList) {
      const builderEvents = allEvents.filter(
        (e) => e.builder_id === builder.id || e.content_id?.includes(builder.name)
      )
      const builderLeads = allLeads.filter(
        (l) => l.builder_id === builder.id || l.builder_name === builder.name
      )
      const builderChats = allChats.filter((c) => c.builder_id === builder.id)
      const builderFavs = (favs || []).filter((f) => f.builder_id === builder.id)

      const { data: prevBuilderReport } = await supabase
        .from('monthly_reports')
        .select('metrics')
        .eq('report_month', prevMonth)
        .eq('report_type', 'builder')
        .eq('builder_id', builder.id)
        .maybeSingle()

      const prevB = prevBuilderReport?.metrics as Record<string, number> | null
      const prevBViews = prevB?.propertyViews || 0
      const prevBLeads = (prevB as Record<string, Record<string, number>> | null)?.leads?.total || 0

      const bViews = builderEvents.filter((e) => e.event_type === 'property_view').length

      const builderMetrics = {
        builderName: builder.name,
        propertyViews: bViews,
        topProperties: [] as { id: string; title: string; views: number }[],
        leads: {
          total: builderLeads.length,
          byType: builderLeads.reduce((acc, l) => {
            const t = l.type || 'other'
            acc[t] = (acc[t] || 0) + 1
            return acc
          }, {} as Record<string, number>),
        },
        chatMentions: builderChats.length,
        favoritesCount: builderFavs.length,
        monthOverMonth: {
          viewsChange: pctChange(bViews, prevBViews),
          leadsChange: pctChange(builderLeads.length, prevBLeads),
        },
      }

      const { error: builderError } = await supabase
        .from('monthly_reports')
        .upsert(
          {
            report_month: reportMonth,
            report_type: 'builder',
            builder_id: builder.id,
            metrics: builderMetrics,
            generated_at: new Date().toISOString(),
          },
          { onConflict: 'report_month,report_type,builder_id' }
        )

      if (builderError) {
        console.error(`[reports/generate] builder ${builder.name} error:`, builderError)
      } else {
        builderCount++
      }
    }

    return Response.json({ success: true, month, platformReport: true, builderReports: builderCount })
  } catch (err) {
    console.error('[reports/generate] error:', err)
    return Response.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
