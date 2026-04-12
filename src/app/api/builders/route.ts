import { createServerClient } from '@/lib/supabase'
import { builders as staticBuilders } from '@/lib/builders-data'

export async function GET() {
  // ── Supabase 優先 ──
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('builders')
      .select('*')
      .eq('is_active', true)
      .order('name')
    if (error) throw error
    return Response.json(data || [])
  } catch (err) {
    console.warn('[builders GET] Supabase unreachable, using local fallback:', (err as Error).message)
  }

  // ── ローカルフォールバック：builders-data.ts の静的データを Supabase 互換形式で返す ──
  try {
    const formatted = staticBuilders.map((b) => ({
      id: b.id,
      name: b.name,
      email: `info@${b.id}.example.com`,
      phone: b.phone,
      area: b.area,
      address: `${b.area} ${b.region}`,
      specialties: b.specialties,
      description: b.description,
      website: b.website,
      logo_url: null,
      plan: 'フリー',
      is_active: true,
      // 構造化データ
      price_range: `${b.pricePerTsubo.min}-${b.pricePerTsubo.max}万円/坪`,
      hiraya_ratio: 80,
      hiraya_annual: Math.round(b.annualBuilds * 0.8),
      design_taste: b.specialties,
      features: b.specialties,
      suitable_for: b.suitableFor,
      insulation_grade: b.insulationGrade,
      earthquake_grade: b.earthquakeGrade,
      construction_method: b.construction,
      land_proposal: true,
      common_concerns: [],
      strengths: b.strengths.map((s) => s.title),
      comparison_points: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
    return Response.json(formatted)
  } catch (err) {
    console.error('[builders GET] local fallback failed:', err)
    return Response.json([])
  }
}
