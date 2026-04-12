import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('surveys')
      .insert({
        user_id: body.userId || null,
        anonymous_id: body.anonymousId || null,
        email: body.email || null,
        survey_type: body.surveyType,
        event_id: body.eventId || null,
        builder_id: body.builderId || null,
        builder_name: body.builderName || null,
        booking_date: body.bookingDate || null,
        responses: body.responses || {},
        conversion_date: body.conversionDate || null,
        conversion_company: body.conversionCompany || null,
        evidence_submitted: body.evidenceSubmitted || false,
        gift_requested: body.giftRequested || false,
      })
      .select()
      .single()

    if (error) {
      console.error('Survey POST error:', error)
      return Response.json({ error: 'Failed to save survey' }, { status: 500 })
    }

    return Response.json(data, { status: 201 })
  } catch {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type')
  const eventId = request.nextUrl.searchParams.get('event_id')

  try {
    const supabase = createServerClient()
    let query = supabase.from('surveys').select('*').order('created_at', { ascending: false })

    if (type) query = query.eq('survey_type', type)
    if (eventId) query = query.eq('event_id', eventId)

    const { data, error } = await query.limit(100)
    if (error) throw error

    return Response.json(data || [])
  } catch (err) {
    console.error('Survey GET error:', err)
    return Response.json([])
  }
}
