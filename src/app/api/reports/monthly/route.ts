import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get('month')
  const supabase = createServerClient()

  let query = supabase
    .from('monthly_reports')
    .select('*')
    .eq('report_type', 'platform')
    .order('report_month', { ascending: false })

  if (month && /^\d{4}-\d{2}$/.test(month)) {
    query = query.eq('report_month', `${month}-01`)
  }

  const { data, error } = await query.limit(12)

  if (error) {
    console.error('Monthly reports fetch error:', error)
    return Response.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }

  const reports = (data ?? []).map(r => ({
    id: r.id,
    reportMonth: r.report_month,
    reportType: r.report_type,
    metrics: r.metrics,
    generatedAt: r.generated_at,
  }))

  return Response.json(reports, { status: 200 })
}
