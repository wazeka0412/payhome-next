import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { localSelect } from '@/lib/local-store'

type LeadRow = { type?: string | null; status?: string | null }

function buildAdminStats(allLeads: LeadRow[]) {
  const consultation = allLeads.filter(l => l.type === '無料相談' || l.type === '工務店相談').length
  const catalog = allLeads.filter(l => l.type === '資料請求').length
  const eventBooking = allLeads.filter(l => l.type === '見学会予約').length
  return {
    kpiCards: [
      { label: '相談申込', value: `${consultation}件`, change: '', up: true },
      { label: '資料請求', value: `${catalog}件`, change: '', up: true },
      { label: '見学会予約', value: `${eventBooking}件`, change: '', up: true },
      { label: '月間売上', value: '—', change: '', up: false },
    ],
    chatbot: {
      usageRate: 0,
      cvRate: 0,
      topQuestions: ['建築費用の相場は？', '住宅ローンの組み方', '工務店の選び方'],
    },
  }
}

function buildBuilderStats(builderLeads: LeadRow[]) {
  const catalog = builderLeads.filter(l => l.type === '資料請求').length
  const event = builderLeads.filter(l => l.type === '見学会予約').length
  const consultation = builderLeads.filter(l => l.type === '無料相談' || l.type === '工務店相談').length
  const converted = builderLeads.filter(l => l.status === '成約').length
  return {
    kpiCards: [
      { label: '今月の資料請求', value: `${catalog}件`, change: '', up: true },
      { label: '見学会予約', value: `${event}件`, change: '', up: true },
      { label: '無料相談', value: `${consultation}件`, change: '', up: true },
      { label: '成約', value: `${converted}件`, change: '', up: converted > 0 },
    ],
    costPerLead: builderLeads.length > 0 ? Math.round(50000 / builderLeads.length) : 0,
    industryAverage: 8500,
    chatbot: {
      usageRate: 0,
      cvRate: 0,
      topQuestions: ['建築費用の相場は？', '住宅ローンの組み方', '工務店の選び方'],
    },
  }
}

export async function GET(request: NextRequest) {
  const builder = request.nextUrl.searchParams.get('builder')

  // ── Supabase 優先 ──
  try {
    const supabase = createServerClient()
    if (builder) {
      const { data, error } = await supabase
        .from('leads')
        .select('type, status')
        .or(`builder_name.eq.${builder},selected_companies.cs.{${builder}}`)
      if (error) throw error
      return Response.json(buildBuilderStats((data ?? []) as LeadRow[]))
    }
    const { data, error } = await supabase.from('leads').select('type, status')
    if (error) throw error
    return Response.json(buildAdminStats((data ?? []) as LeadRow[]))
  } catch (err) {
    console.warn('[stats GET] Supabase unreachable, using local fallback:', (err as Error).message)
  }

  // ── ローカルフォールバック ──
  try {
    const where: Record<string, unknown> = {}
    if (builder) where.builder_name = builder
    const rows = await localSelect('leads', where)
    const leads = rows.map((r) => ({ type: r.type as string | null, status: r.status as string | null }))
    return Response.json(builder ? buildBuilderStats(leads) : buildAdminStats(leads))
  } catch (err) {
    console.error('[stats GET] local fallback failed:', err)
    return Response.json(builder ? buildBuilderStats([]) : buildAdminStats([]))
  }
}
