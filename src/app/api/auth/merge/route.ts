import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getToken } from 'next-auth/jwt'

/**
 * POST /api/auth/merge
 * ログイン後に呼ばれ、anonymous_idに紐付いた行動データをuser_idにマージする。
 * Body: { anonymous_id: string }
 */
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = token.sub
    const { anonymous_id } = await request.json()

    if (!anonymous_id) {
      return NextResponse.json({ error: 'anonymous_id required' }, { status: 400 })
    }

    const supabase = createServerClient()

    // 並列でマージ実行
    await Promise.all([
      // user_events: anonymous_idのデータにuser_idを設定
      supabase
        .from('user_events')
        .update({ user_id: userId })
        .eq('anonymous_id', anonymous_id)
        .is('user_id', null),

      // favorites: anonymous_idのデータにuser_idを設定
      supabase
        .from('favorites')
        .update({ user_id: userId })
        .eq('anonymous_id', anonymous_id)
        .is('user_id', null),

      // chat_sessions: anonymous_idのデータにuser_idを設定
      supabase
        .from('chat_sessions')
        .update({ user_id: userId })
        .eq('anonymous_id', anonymous_id)
        .is('user_id', null),
    ])

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Merge error:', error)
    return NextResponse.json({ error: 'Merge failed' }, { status: 500 })
  }
}
