import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getToken } from 'next-auth/jwt'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const anonymousId = searchParams.get('anonymous_id')
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    let userId: string | undefined
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
      if (token?.sub) userId = token.sub
    } catch {}

    let query = supabase
      .from('user_events')
      .select('event_type, content_type, content_id, page_path, created_at, metadata')
      .in('event_type', ['property_detail_view', 'article_read', 'builder_detail_view', 'event_detail_view'])
      .order('created_at', { ascending: false })
      .limit(limit)

    if (userId) {
      query = query.eq('user_id', userId)
    } else if (anonymousId) {
      query = query.eq('anonymous_id', anonymousId)
    } else {
      return NextResponse.json([])
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('History GET error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
