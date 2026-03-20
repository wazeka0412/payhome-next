import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const builder = request.nextUrl.searchParams.get('builder')
  const supabase = createServerClient()

  let query = supabase.from('events').select('*').order('date', { ascending: true })

  if (builder) {
    query = query.eq('builder_name', builder)
  }

  const { data, error } = await query

  if (error) {
    console.error('Events GET error:', error)
    return Response.json({ error: 'Failed to fetch events' }, { status: 500 })
  }

  return Response.json(data)
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
