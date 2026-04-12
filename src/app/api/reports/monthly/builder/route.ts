import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * GET /api/reports/monthly/builder?month=2026-04&builder_id=xxx
 *
 * 工務店別レポートを取得する。
 */
export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get('month')
  const builderId = request.nextUrl.searchParams.get('builder_id')

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return Response.json({ error: 'month parameter required (YYYY-MM)' }, { status: 400 })
  }

  try {
    const supabase = createServerClient()
    let query = supabase
      .from('monthly_reports')
      .select('*')
      .eq('report_month', `${month}-01`)
      .eq('report_type', 'builder')

    if (builderId) {
      query = query.eq('builder_id', builderId)
    }

    const { data, error } = await query
    if (error) throw error

    const reports = (data || []).map((r) => ({
      id: r.id,
      reportMonth: r.report_month,
      reportType: r.report_type,
      builderId: r.builder_id,
      metrics: r.metrics,
      generatedAt: r.generated_at,
    }))

    return Response.json(reports)
  } catch (err) {
    console.error('[reports/monthly/builder GET] error:', err)
    return Response.json([], { status: 500 })
  }
}
