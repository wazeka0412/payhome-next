import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const builder = request.nextUrl.searchParams.get('builder')
  const supabase = createServerClient()

  if (builder) {
    // Builder-specific stats
    const { data: leads } = await supabase
      .from('leads')
      .select('type, status')
      .or(`builder_name.eq.${builder},selected_companies.cs.{${builder}}`)

    const builderLeads = leads ?? []
    const thisMonth = new Date()
    thisMonth.setDate(1)

    const catalog = builderLeads.filter(l => l.type === '資料請求').length
    const event = builderLeads.filter(l => l.type === '見学会予約').length
    const consultation = builderLeads.filter(l => l.type === '無料相談' || l.type === '工務店相談').length
    const converted = builderLeads.filter(l => l.status === '成約').length

    return Response.json({
      kpiCards: [
        { label: '今月の資料請求', value: `${catalog}件`, change: '', up: true },
        { label: '見学会予約', value: `${event}件`, change: '', up: true },
        { label: '無料相談', value: `${consultation}件`, change: '', up: true },
        { label: '成約', value: `${converted}件`, change: '', up: converted > 0 },
      ],
      costPerLead: builderLeads.length > 0 ? Math.round(50000 / builderLeads.length) : 0,
      industryAverage: 8500,
    })
  }

  // Admin stats
  const { data: leads } = await supabase.from('leads').select('type, status')
  const allLeads = leads ?? []

  const consultation = allLeads.filter(l => l.type === '無料相談' || l.type === '工務店相談').length
  const catalog = allLeads.filter(l => l.type === '資料請求').length
  const eventBooking = allLeads.filter(l => l.type === '見学会予約').length

  return Response.json({
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
  })
}
