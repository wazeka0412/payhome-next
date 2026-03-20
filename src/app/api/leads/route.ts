import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const builder = request.nextUrl.searchParams.get('builder')
  const email = request.nextUrl.searchParams.get('email')

  const supabase = createServerClient()
  let query = supabase.from('leads').select('*').order('created_at', { ascending: false })

  if (builder) {
    query = query.or(`builder_name.eq.${builder},selected_companies.cs.{${builder}}`)
  }
  if (email) {
    query = query.eq('email', email)
  }

  const { data, error } = await query

  if (error) {
    console.error('Leads GET error:', error)
    return Response.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }

  return Response.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('leads')
      .insert({
        type: body.type || '無料相談',
        name: body.name || '',
        email: body.email || '',
        phone: body.tel || body.phone,
        area: body.area,
        budget: body.budget,
        message: body.summary || body.message,
        builder_name: body.builder,
        status: '新規',
        score: body.score || 50,
      })
      .select()
      .single()

    if (error) {
      console.error('Leads POST error:', error)
      return Response.json({ error: 'Failed to create lead' }, { status: 500 })
    }

    return Response.json(data, { status: 201 })
  } catch {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
}
