import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * GET /api/reports/monthly?month=2026-04
 *
 * レポート一覧を取得する。month パラメータで月別フィルタ可能。
 */
export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get('month')

  try {
    const supabase = createServerClient()
    let query = supabase
      .from('monthly_reports')
      .select('*')
      .order('report_month', { ascending: false })

    if (month && /^\d{4}-\d{2}$/.test(month)) {
      query = query.eq('report_month', `${month}-01`)
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
    console.error('[reports/monthly GET] error:', err)
    return Response.json([], { status: 500 })
  }
}
