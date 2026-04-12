import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { classifyUserType } from '@/lib/diagnosis-questions'
import { builders as buildersData } from '@/lib/builders-data'
import { localInsert, localUpsert } from '@/lib/local-store'

/**
 * POST /api/ai/diagnosis
 *
 * AI家づくり診断の結果を保存し、推薦工務店を返す。
 *
 * Body:
 *   - anonymous_id: string
 *   - answers: Record<string, string | string[]>
 *
 * Response:
 *   200: { user_type, user_type_info, recommended_builders: Builder[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { anonymous_id, answers } = body as {
      anonymous_id?: string
      answers?: Record<string, string | string[]>
    }

    if (!answers || typeof answers !== 'object') {
      return Response.json({ error: 'missing_answers' }, { status: 400 })
    }

    // 1. Classify user type
    const userType = classifyUserType(answers)

    // 2. Recommend builders (MVP: simple rule-based matching)
    const recommendedBuilders = recommendBuilders(userType, answers)

    // 3. Persist session
    const supabase = createServerClient()
    let userId: string | undefined
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
      if (token?.sub) userId = token.sub
    } catch {}

    const sessionRecord = {
      anonymous_id: anonymous_id || null,
      user_id: userId || null,
      answers,
      user_type: userType,
      recommended_builders: recommendedBuilders.map(b => ({
        builder_id: b.id,
        score: b.score,
        reason: b.reason,
      })),
      completed_at: new Date().toISOString(),
    }

    let session: { id: string } | null = null
    let usedLocalFallback = false

    try {
      const { data, error } = await supabase
        .from('diagnosis_sessions')
        .insert(sessionRecord)
        .select()
        .single()
      if (error) throw error
      session = data as { id: string }
    } catch (err) {
      console.warn('[diagnosis] Supabase unreachable, using local fallback:', (err as Error).message)
      usedLocalFallback = true
      const inserted = await localInsert('diagnosis_sessions', sessionRecord)
      session = { id: inserted.id }
    }

    // 4. Update user_profiles if logged in
    if (userId) {
      const profileUpdate: Record<string, unknown> = {
        user_id: userId,
        family_structure: answers.family_structure,
        age_range: answers.age_range,
        building_trigger: answers.building_trigger,
        budget_range: answers.budget_range,
        monthly_payment: answers.monthly_payment,
        preferred_area: answers.preferred_area,
        has_land: answers.has_land === 'yes',
        floor_area: answers.floor_area,
        parking_needs: answers.parking_needs,
        planned_timing: answers.planned_timing,
        design_orientation: answers.design_orientation,
        performance_orientation: answers.performance_orientation,
        lifestyle_priorities: answers.lifestyle_priorities,
        sales_preference: answers.sales_preference,
        consideration_phase: answers.consideration_phase,
        user_type: userType,
        updated_at: new Date().toISOString(),
      }

      if (!usedLocalFallback) {
        try {
          await supabase
            .from('user_profiles')
            .upsert(profileUpdate, { onConflict: 'user_id' })
        } catch {
          await localUpsert('user_profiles', profileUpdate, 'user_id')
        }
      } else {
        await localUpsert('user_profiles', profileUpdate, 'user_id')
      }
    }

    return Response.json(
      {
        session_id: session?.id,
        user_type: userType,
        recommended_builders: recommendedBuilders,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('diagnosis error:', err)
    return Response.json({ error: 'internal_error' }, { status: 500 })
  }
}

/**
 * ユーザータイプと回答をもとに、推薦工務店を算出する（MVP版・ルールベース）
 */
function recommendBuilders(
  userType: string,
  answers: Record<string, string | string[]>
): Array<{ id: string; name: string; area: string; score: number; reason: string }> {
  const preferredArea = answers.preferred_area as string

  // 工務店をエリアでフィルタ（希望エリアがその他/未定なら全件）
  // 注: BuilderData では area=県、region=市
  let candidates = buildersData
  if (preferredArea && preferredArea !== 'その他') {
    const areaFiltered = buildersData.filter(
      b => b.region.includes(preferredArea) || b.area.includes(preferredArea)
    )
    candidates = areaFiltered.length >= 3 ? areaFiltered : buildersData.filter(b => b.area === '鹿児島県')
    if (candidates.length < 3) candidates = buildersData
  }

  // 新規質問データ
  const monthlyPayment = answers.monthly_payment as string
  const floorArea = answers.floor_area as string
  const parkingNeeds = answers.parking_needs as string
  const salesPref = (answers.sales_preference as string[]) || []
  const trigger = answers.building_trigger as string

  // スコア計算（v5.0 拡張版）
  const scored = candidates.map(b => {
    let score = 50
    const reasons: string[] = []

    // 平屋施工数が多いほど高スコア
    if (b.annualBuilds >= 100) {
      score += 10
      reasons.push(`年間${b.annualBuilds}棟の豊富な施工実績`)
    } else if (b.annualBuilds >= 50) {
      score += 5
      reasons.push(`年間${b.annualBuilds}棟の確かな施工実績`)
    }

    // specialties によるマッチング
    if (userType === 'design_focused' && b.specialties.some(s => s.includes('デザイン') || s.includes('モダン'))) {
      score += 15
      reasons.push('デザイン重視の施工が得意')
    }
    if (userType === 'performance_focused' && b.specialties.some(s => s.includes('高性能') || s.includes('ZEH') || s.includes('断熱'))) {
      score += 15
      reasons.push('高性能住宅に強み')
    }
    if (userType === 'cost_focused' && b.specialties.some(s => s.includes('ローコスト') || s.includes('コスパ'))) {
      score += 15
      reasons.push('コストパフォーマンスの高い家づくり')
    }
    if (userType === 'natural_focused' && b.specialties.some(s => s.includes('自然素材') || s.includes('木'))) {
      score += 15
      reasons.push('自然素材を活かした家づくり')
    }
    if (userType === 'senior_friendly' && b.specialties.some(s => s.includes('平屋') || s.includes('バリアフリー'))) {
      score += 15
      reasons.push('平屋・バリアフリーの設計に強み')
    }
    if (userType === 'family_focused' && b.specialties.some(s => s.includes('子育て') || s.includes('家族'))) {
      score += 10
      reasons.push('子育て世帯向けの提案が豊富')
    }

    // 平屋特化（全ての工務店にボーナス。ぺいほーむ前提）
    if (b.specialties.some(s => s.includes('平屋'))) {
      score += 5
      reasons.push('平屋の施工経験あり')
    }

    // ── 新規: 予算帯マッチング（坪単価ベース） ──
    if (b.pricePerTsubo && monthlyPayment) {
      const avgTsubo = typeof b.pricePerTsubo === 'object'
        ? (b.pricePerTsubo.min + b.pricePerTsubo.max) / 2
        : b.pricePerTsubo
      // 月返済6万以下 = ローコスト志向、13万+ = ハイグレード志向
      if (monthlyPayment === '~6' && avgTsubo <= 55) {
        score += 8
        reasons.push('予算に合った提案が得意')
      }
      if (monthlyPayment === '13+' && avgTsubo >= 65) {
        score += 5
      }
    }

    // ── 新規: 土地探し対応 ──
    const hasLandVal = answers.has_land as string
    if ((hasLandVal === 'searching' || hasLandVal === 'need_help') &&
        b.specialties.some(s => s.includes('土地'))) {
      score += 8
      reasons.push('土地探しもサポート')
    }

    // ── 新規: 結婚きっかけ → 若年層向け提案力 ──
    if (trigger === 'marriage' && b.specialties.some(s => s.includes('若い') || s.includes('初めて'))) {
      score += 5
    }

    return {
      id: b.id,
      name: b.name,
      area: b.region || b.area,
      score,
      reason: reasons.slice(0, 2).join('・') || '平屋の相談にご対応可能',
    }
  })

  // 上位3社を返す
  return scored.sort((a, b) => b.score - a.score).slice(0, 3)
}
