import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const month = request.nextUrl.searchParams.get('month')
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return Response.json({ error: 'month parameter required (YYYY-MM format)' }, { status: 400 })
  }

  const supabase = createServerClient()
  const monthStart = `${month}-01T00:00:00+09:00`
  const nextMonth = new Date(`${month}-01`)
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  const monthEnd = `${nextMonth.toISOString().slice(0, 7)}-01T00:00:00+09:00`
  const reportMonth = `${month}-01`

  // Previous month for MoM calculation
  const prevMonth = new Date(`${month}-01`)
  prevMonth.setMonth(prevMonth.getMonth() - 1)
  const prevMonthStr = prevMonth.toISOString().slice(0, 7)

  try {
    // ── 1. Aggregate user_events ──
    const { data: events } = await supabase
      .from('user_events')
      .select('event_type, anonymous_id, device_type, utm_source, content_type, content_id, metadata')
      .gte('created_at', monthStart)
      .lt('created_at', monthEnd)

    const allEvents = events ?? []
    const uniqueVisitors = new Set(allEvents.map(e => e.anonymous_id)).size
    const totalEvents = allEvents.length

    // Device breakdown
    const byDevice: Record<string, number> = {}
    allEvents.forEach(e => {
      const d = e.device_type || 'unknown'
      byDevice[d] = (byDevice[d] || 0) + 1
    })

    // Source breakdown (utm_source)
    const bySource: Record<string, number> = {}
    allEvents.forEach(e => {
      const s = e.utm_source || 'direct'
      bySource[s] = (bySource[s] || 0) + 1
    })

    // Content metrics
    const propertyViews = allEvents.filter(e => e.event_type === 'property_detail_view').length
    const articleReads = allEvents.filter(e => e.event_type === 'article_read').length
    const videoViews = allEvents.filter(e => e.event_type === 'video_view').length
    const favoritesAdded = allEvents.filter(e => e.event_type === 'favorite_add').length
    const comparisonsCreated = allEvents.filter(e => e.event_type === 'comparison_add').length
    const simulatorUses = allEvents.filter(e => e.event_type === 'simulator_use').length
    const lineClicks = allEvents.filter(e => e.event_type === 'line_click').length
    const telClicks = allEvents.filter(e => e.event_type === 'tel_click').length

    // Top properties
    const propViewCounts: Record<string, number> = {}
    allEvents
      .filter(e => e.event_type === 'property_detail_view' && e.content_id)
      .forEach(e => {
        propViewCounts[e.content_id!] = (propViewCounts[e.content_id!] || 0) + 1
      })
    const topProperties = Object.entries(propViewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, views]) => ({ id, title: id, views }))

    // ── 2. Aggregate chat_sessions ──
    const { data: chatSessions } = await supabase
      .from('chat_sessions')
      .select('id, message_count, lead_conversion')
      .gte('created_at', monthStart)
      .lt('created_at', monthEnd)

    const allChats = chatSessions ?? []
    const sessionsStarted = allChats.length
    const sessionsCompleted = allChats.filter(s => (s.message_count ?? 0) >= 5).length
    const completionRate = sessionsStarted > 0 ? sessionsCompleted / sessionsStarted : 0
    const toLeadConversions = allChats.filter(s => s.lead_conversion).length

    // ── 3. Aggregate leads ──
    const { data: leads } = await supabase
      .from('leads')
      .select('type, status, builder_name, selected_companies')
      .gte('created_at', monthStart)
      .lt('created_at', monthEnd)

    const allLeads = leads ?? []
    const leadsByType: Record<string, number> = {}
    allLeads.forEach(l => {
      const t = l.type || 'other'
      leadsByType[t] = (leadsByType[t] || 0) + 1
    })
    const leadsByStatus: Record<string, number> = {}
    allLeads.forEach(l => {
      const s = l.status || 'unknown'
      leadsByStatus[s] = (leadsByStatus[s] || 0) + 1
    })
    const conversionRate = uniqueVisitors > 0 ? allLeads.length / uniqueVisitors : 0

    // ── 4. Get previous month for MoM ──
    const { data: prevReport } = await supabase
      .from('monthly_reports')
      .select('metrics')
      .eq('report_month', `${prevMonthStr}-01`)
      .eq('report_type', 'platform')
      .maybeSingle()

    const prevMetrics = prevReport?.metrics as Record<string, unknown> | null
    const prevVisitors = (prevMetrics?.visitors as Record<string, number>)?.unique ?? 0
    const prevLeadsTotal = (prevMetrics?.leads as Record<string, number>)?.total ?? 0
    const prevChatStarted = (prevMetrics?.chat as Record<string, number>)?.sessionsStarted ?? 0

    const visitorsChange = prevVisitors > 0 ? (uniqueVisitors - prevVisitors) / prevVisitors : 0
    const leadsChange = prevLeadsTotal > 0 ? (allLeads.length - prevLeadsTotal) / prevLeadsTotal : 0
    const chatChange = prevChatStarted > 0 ? (sessionsStarted - prevChatStarted) / prevChatStarted : 0

    // ── 5. Build platform metrics ──
    const platformMetrics = {
      visitors: { total: totalEvents, unique: uniqueVisitors, byDevice, bySource },
      content: { propertyViews, articleReads, videoViews, topProperties },
      engagement: { favoritesAdded, comparisonsCreated, simulatorUses, lineClicks, telClicks },
      chat: { sessionsStarted, sessionsCompleted, completionRate: Math.round(completionRate * 100) / 100, toLeadConversions },
      leads: { total: allLeads.length, byType: leadsByType, byStatus: leadsByStatus, conversionRate: Math.round(conversionRate * 1000) / 1000 },
      monthOverMonth: {
        visitorsChange: Math.round(visitorsChange * 100) / 100,
        leadsChange: Math.round(leadsChange * 100) / 100,
        chatChange: Math.round(chatChange * 100) / 100,
      },
    }

    // ── 6. Upsert platform report ──
    const { error: platformError } = await supabase
      .from('monthly_reports')
      .upsert({
        report_month: reportMonth,
        report_type: 'platform',
        builder_id: null,
        metrics: platformMetrics,
        generated_at: new Date().toISOString(),
      }, { onConflict: 'report_month,report_type,builder_id' })

    if (platformError) {
      console.error('Platform report upsert error:', platformError)
    }

    // ── 7. Generate builder-specific reports ──
    const { data: builders } = await supabase
      .from('builders')
      .select('id, name')

    const allBuilders = builders ?? []
    let builderReportsCount = 0

    for (const builder of allBuilders) {
      // Builder-specific property views
      const builderPropViews = allEvents.filter(
        e => e.event_type === 'property_detail_view' && e.metadata &&
          (e.metadata as Record<string, string>).builder_id === builder.id
      ).length

      // Builder-specific leads
      const builderLeads = allLeads.filter(
        l => l.builder_name === builder.name ||
          (l.selected_companies && (l.selected_companies as string[]).includes(builder.name))
      )
      const builderLeadsByType: Record<string, number> = {}
      builderLeads.forEach(l => {
        const t = l.type || 'other'
        builderLeadsByType[t] = (builderLeadsByType[t] || 0) + 1
      })

      // Builder top properties
      const builderTopProps = allEvents
        .filter(e => e.event_type === 'property_detail_view' &&
          e.metadata && (e.metadata as Record<string, string>).builder_id === builder.id &&
          e.content_id)
        .reduce((acc: Record<string, number>, e) => {
          acc[e.content_id!] = (acc[e.content_id!] || 0) + 1
          return acc
        }, {})
      const builderTopProperties = Object.entries(builderTopProps)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id, views]) => ({ id, title: id, views }))

      // Previous month builder data
      const { data: prevBuilderReport } = await supabase
        .from('monthly_reports')
        .select('metrics')
        .eq('report_month', `${prevMonthStr}-01`)
        .eq('report_type', 'builder')
        .eq('builder_id', builder.id)
        .maybeSingle()

      const prevBM = prevBuilderReport?.metrics as Record<string, number> | null
      const prevBViews = prevBM?.propertyViews ?? 0
      const prevBLeads = (prevBM?.leads as unknown as Record<string, number>)?.total ?? 0

      const builderMetrics = {
        builderName: builder.name,
        propertyViews: builderPropViews,
        topProperties: builderTopProperties,
        leads: { total: builderLeads.length, byType: builderLeadsByType },
        chatMentions: 0,
        favoritesCount: 0,
        monthOverMonth: {
          viewsChange: prevBViews > 0 ? Math.round(((builderPropViews - prevBViews) / prevBViews) * 100) / 100 : 0,
          leadsChange: prevBLeads > 0 ? Math.round(((builderLeads.length - prevBLeads) / prevBLeads) * 100) / 100 : 0,
        },
      }

      const { error: builderError } = await supabase
        .from('monthly_reports')
        .upsert({
          report_month: reportMonth,
          report_type: 'builder',
          builder_id: builder.id,
          metrics: builderMetrics,
          generated_at: new Date().toISOString(),
        }, { onConflict: 'report_month,report_type,builder_id' })

      if (!builderError) builderReportsCount++
    }

    return Response.json({
      success: true,
      month: reportMonth,
      platformReport: platformMetrics,
      builderReportsGenerated: builderReportsCount,
    }, { status: 200 })

  } catch (err) {
    console.error('Report generation error:', err)
    return Response.json({ error: 'Failed to generate monthly report' }, { status: 500 })
  }
}
