import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id')
  if (!userId) return Response.json({ error: 'user_id required' }, { status: 400 })

  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('home_building_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error
    return Response.json(data || { exists: false })
  } catch (err) {
    console.error('[home-building GET]', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServerClient()

    // Calculate completion rate
    const fields = [
      body.consideration_start, body.family_summary, body.has_land,
      body.total_budget, body.floor_area_tsubo, body.ldk_count,
      body.exterior_style, body.performance_priorities,
      body.comparing_companies, body.sales_priorities, body.current_temperature
    ]
    const filled = fields.filter(f => f !== null && f !== undefined && f !== '' && f !== '[]').length
    const completionRate = Math.round((filled / fields.length) * 100)

    const { data, error } = await supabase
      .from('home_building_profiles')
      .upsert({
        ...body,
        completion_rate: completionRate,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) throw error
    return Response.json(data, { status: 201 })
  } catch (err) {
    console.error('[home-building POST]', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
