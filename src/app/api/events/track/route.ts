import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getToken } from 'next-auth/jwt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const events: Array<{
      anonymous_id: string
      event_type: string
      content_type?: string
      content_id?: string
      page_path?: string
      referrer?: string
      utm_source?: string
      utm_medium?: string
      utm_campaign?: string
      device_type?: string
      metadata?: Record<string, unknown>
    }> = body.events || [body]

    if (events.length === 0) {
      return new Response(null, { status: 204 })
    }

    // ログインユーザーならuser_idを自動付与
    let userId: string | undefined
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
      if (token?.sub) userId = token.sub
    } catch {
      // 未ログインの場合は無視
    }

    const supabase = createServerClient()

    const rows = events
      .filter(e => e.anonymous_id && e.event_type)
      .map(e => ({
        anonymous_id: e.anonymous_id,
        user_id: userId || null,
        event_type: e.event_type,
        content_type: e.content_type || null,
        content_id: e.content_id || null,
        page_path: e.page_path || null,
        referrer: e.referrer || null,
        utm_source: e.utm_source || null,
        utm_medium: e.utm_medium || null,
        utm_campaign: e.utm_campaign || null,
        device_type: e.device_type || null,
        metadata: e.metadata || {},
      }))

    if (rows.length > 0) {
      await supabase.from('user_events').insert(rows)
    }

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Event tracking error:', error)
    // エラーでも200を返す（追跡失敗でUXに影響を与えない）
    return new Response(null, { status: 204 })
  }
}
