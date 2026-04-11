import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { events as staticEvents } from '@/lib/events-data'

export async function GET(request: NextRequest) {
  const builder = request.nextUrl.searchParams.get('builder')

  // ── Supabase 優先 ──
  try {
    const supabase = createServerClient()
    let query = supabase.from('events').select('*').order('date', { ascending: true })
    if (builder) {
      query = query.eq('builder_name', builder)
    }
    const { data, error } = await query
    if (error) throw error
    return Response.json(data || [])
  } catch (err) {
    console.warn('[events GET] Supabase unreachable, using local fallback:', (err as Error).message)
  }

  // ── ローカルフォールバック：events-data.ts を Supabase 互換形式で返す ──
  try {
    const filtered = builder
      ? staticEvents.filter((e) => e.builder === builder)
      : staticEvents
    const formatted = filtered.map((e) => ({
      id: e.id,
      builder_id: null,
      builder_name: e.builder,
      title: e.title,
      date: e.startDate,
      location: e.location,
      type: e.typeLabel,
      capacity: e.capacity,
      reservations: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
    return Response.json(formatted)
  } catch (err) {
    console.error('[events GET] local fallback failed:', err)
    return Response.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('events')
      .insert({
        builder_id: body.builder_id || null,
        builder_name: body.builder || body.builder_name || '',
        title: body.title || '',
        date: body.date || new Date().toISOString().split('T')[0],
        location: body.location || '',
        type: body.type,
        capacity: body.capacity || 20,
        reservations: 0,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Events POST error:', error)
      return Response.json({ error: 'Failed to create event' }, { status: 500 })
    }

    return Response.json(data, { status: 201 })
  } catch {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
}
