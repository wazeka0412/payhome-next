import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get('month')
  const builderId = request.nextUrl.searchParams.get('builder_id')
  const supabase = createServerClient()

  let query = supabase
    .from('monthly_reports')
    .select('*')
    .eq('report_type', 'builder')
    .order('report_month', { ascending: false })

  if (month && /^\d{4}-\d{2}$/.test(month)) {
    query = query.eq('report_month', `${month}-01`)
  }

  if (builderId) {
    query = query.eq('builder_id', builderId)
  }

  const { data, error } = await query.limit(50)

  if (error) {
    console.error('Builder reports fetch error:', error)
    return Response.json({ error: 'Failed to fetch builder reports' }, { status: 500 })
  }

  const reports = (data ?? []).map(r => ({
    id: r.id,
    reportMonth: r.report_month,
    reportType: r.report_type,
    builderId: r.builder_id,
    metrics: r.metrics,
    generatedAt: r.generated_at,
  }))

  return Response.json(reports, { status: 200 })
}
