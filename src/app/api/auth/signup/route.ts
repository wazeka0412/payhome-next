import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { localFindOne, localInsert, localUpdate } from '@/lib/local-store'

/**
 * POST /api/auth/signup
 *
 * 会員登録エンドポイント（v4.0 新規）
 *
 * Body:
 *   - email: string (required)
 *   - name?: string
 *   - password?: string (min 8 chars; defaults to email if omitted)
 *   - anonymous_id?: string (to merge existing anonymous activity)
 *
 * Response:
 *   201: { ok: true, user: { id, email, name, role } }
 *   400: { error: 'invalid_email' | 'missing_email' | 'password_too_short' }
 *   409: { error: 'email_already_registered' }
 *   500: { error: 'internal_error' }
 *
 * 動作モード:
 *   - Supabase が到達可能ならそちらに書き込み
 *   - 到達不可（ネットワーク／DNSエラー／プロジェクト未設定）なら
 *     .local-data/users.json にフォールバック
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { email, name, password, anonymous_id } = body as {
      email?: string
      name?: string
      password?: string
      anonymous_id?: string
    }

    if (!email || typeof email !== 'string') {
      return Response.json({ error: 'missing_email' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'invalid_email' }, { status: 400 })
    }

    const effectivePassword = password || email.split('@')[0]
    if (effectivePassword.length < 8) {
      return Response.json({ error: 'password_too_short' }, { status: 400 })
    }

    // ── Supabase 優先、失敗したらローカル ──
    const supabase = createServerClient()
    let usedLocalFallback = false
    let existing: { id: string } | null = null

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle()
      if (error) throw error
      existing = data as { id: string } | null
    } catch (err) {
      console.warn('[signup] Supabase unreachable, using local fallback:', (err as Error).message)
      usedLocalFallback = true
    }

    // ローカルフォールバック時は必ずローカルも確認
    if (usedLocalFallback) {
      const local = await localFindOne('users', { email })
      if (local) existing = local as { id: string }
    }

    if (existing) {
      return Response.json({ error: 'email_already_registered' }, { status: 409 })
    }

    let newUser: { id: string; email: string; name: string; role: string } | null = null

    if (!usedLocalFallback) {
      try {
        const { data, error } = await supabase
          .from('users')
          .insert({
            email,
            name: name || email.split('@')[0],
            role: 'user',
          })
          .select('id, email, name, role')
          .single()
        if (error) throw error
        newUser = data as { id: string; email: string; name: string; role: string }
      } catch (err) {
        console.warn('[signup] Supabase insert failed, falling back to local:', (err as Error).message)
        usedLocalFallback = true
      }
    }

    if (usedLocalFallback) {
      const inserted = await localInsert('users', {
        email,
        name: name || email.split('@')[0],
        role: 'user',
      })
      newUser = {
        id: inserted.id,
        email: inserted.email as string,
        name: inserted.name as string,
        role: inserted.role as string,
      }
      // 空の user_profile を作成
      await localInsert('user_profiles', { user_id: newUser.id })
    }

    if (!newUser) {
      return Response.json({ error: 'internal_error' }, { status: 500 })
    }

    // 非ローカル経路での user_profile 作成
    if (!usedLocalFallback) {
      try {
        await supabase.from('user_profiles').insert({ user_id: newUser.id }).select()
      } catch {
        /* 非致命的 */
      }
    }

    // 匿名アクティビティのマージ
    if (anonymous_id) {
      if (!usedLocalFallback) {
        await Promise.all([
          supabase.from('user_events').update({ user_id: newUser.id }).is('user_id', null).eq('anonymous_id', anonymous_id),
          supabase.from('favorites').update({ user_id: newUser.id }).is('user_id', null).eq('anonymous_id', anonymous_id),
          supabase.from('chat_sessions').update({ user_id: newUser.id }).is('user_id', null).eq('anonymous_id', anonymous_id),
          supabase.from('diagnosis_sessions').update({ user_id: newUser.id }).is('user_id', null).eq('anonymous_id', anonymous_id),
        ]).catch((err) => console.error('anonymous merge error (non-fatal):', err))
      } else {
        await Promise.all([
          localUpdate('user_events', { user_id: newUser.id }, { anonymous_id }),
          localUpdate('favorites', { user_id: newUser.id }, { anonymous_id }),
          localUpdate('chat_sessions', { user_id: newUser.id }, { anonymous_id }),
          localUpdate('diagnosis_sessions', { user_id: newUser.id }, { anonymous_id }),
        ]).catch(() => {})
      }
    }

    return Response.json(
      { ok: true, user: newUser, mode: usedLocalFallback ? 'local' : 'supabase' },
      { status: 201 }
    )
  } catch (err) {
    console.error('signup error:', err)
    return Response.json({ error: 'internal_error' }, { status: 500 })
  }
}
