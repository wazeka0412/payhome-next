import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * POST /api/auth/signup
 *
 * 会員登録エンドポイント（v4.0 新規）
 *
 * Body:
 *   - email: string (required)
 *   - name?: string
 *   - password?: string (min 4 chars; defaults to email if omitted)
 *   - anonymous_id?: string (to merge existing anonymous activity)
 *
 * Response:
 *   201: { ok: true, user: { id, email, name, role } }
 *   400: { error: 'invalid_email' | 'missing_email' | 'password_too_short' }
 *   409: { error: 'email_already_registered' }
 *   500: { error: 'internal_error' }
 *
 * Note: This is a simplified MVP signup. Production should:
 *   - Use bcrypt/argon2 for password hashing
 *   - Require email verification via magic link (Resend)
 *   - Implement rate limiting
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

    // Validate email
    if (!email || typeof email !== 'string') {
      return Response.json({ error: 'missing_email' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'invalid_email' }, { status: 400 })
    }

    // Validate password (min 4 chars for MVP, matching CredentialsProvider)
    const effectivePassword = password || email.split('@')[0]
    if (effectivePassword.length < 4) {
      return Response.json({ error: 'password_too_short' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check for existing user
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      return Response.json({ error: 'email_already_registered' }, { status: 409 })
    }

    // Create user with role='user'
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        name: name || email.split('@')[0],
        role: 'user',
      })
      .select('id, email, name, role')
      .single()

    if (insertError || !newUser) {
      console.error('signup insert error:', insertError)
      return Response.json({ error: 'internal_error' }, { status: 500 })
    }

    // Create empty user_profile row so diagnosis results can be attached later
    await supabase.from('user_profiles').insert({ user_id: newUser.id }).select()

    // Merge anonymous activity if provided
    if (anonymous_id) {
      await Promise.all([
        supabase
          .from('user_events')
          .update({ user_id: newUser.id })
          .is('user_id', null)
          .eq('anonymous_id', anonymous_id),
        supabase
          .from('favorites')
          .update({ user_id: newUser.id })
          .is('user_id', null)
          .eq('anonymous_id', anonymous_id),
        supabase
          .from('chat_sessions')
          .update({ user_id: newUser.id })
          .is('user_id', null)
          .eq('anonymous_id', anonymous_id),
        supabase
          .from('diagnosis_sessions')
          .update({ user_id: newUser.id })
          .is('user_id', null)
          .eq('anonymous_id', anonymous_id),
      ]).catch(err => {
        console.error('anonymous merge error (non-fatal):', err)
      })
    }

    return Response.json({ ok: true, user: newUser }, { status: 201 })
  } catch (err) {
    console.error('signup error:', err)
    return Response.json({ error: 'internal_error' }, { status: 500 })
  }
}
