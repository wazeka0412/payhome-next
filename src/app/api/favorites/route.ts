import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getToken } from 'next-auth/jwt'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const anonymousId = searchParams.get('anonymous_id')
    const contentType = searchParams.get('content_type')

    // ログインユーザーならuser_idで取得
    let userId: string | undefined
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
      if (token?.sub) userId = token.sub
    } catch {}

    let query = supabase.from('favorites').select('*').order('created_at', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
    } else if (anonymousId) {
      query = query.eq('anonymous_id', anonymousId)
    } else {
      return NextResponse.json([])
    }

    if (contentType) {
      query = query.eq('content_type', contentType)
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Favorites GET error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { anonymous_id, content_type, content_id } = body

    let userId: string | undefined
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
      if (token?.sub) userId = token.sub
    } catch {}

    const row: Record<string, unknown> = {
      content_type: content_type || 'property',
      content_id,
    }
    if (userId) row.user_id = userId
    if (anonymous_id) row.anonymous_id = anonymous_id

    const { data, error } = await supabase.from('favorites').insert(row).select().single()
    if (error) {
      // 重複エラーの場合は既存を返す
      if (error.code === '23505') {
        return NextResponse.json({ ok: true, duplicate: true })
      }
      throw error
    }

    return NextResponse.json({ ok: true, id: data?.id })
  } catch (error) {
    console.error('Favorites POST error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { anonymous_id, content_type, content_id } = body

    let userId: string | undefined
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
      if (token?.sub) userId = token.sub
    } catch {}

    let query = supabase
      .from('favorites')
      .delete()
      .eq('content_id', content_id)
      .eq('content_type', content_type || 'property')

    if (userId) {
      query = query.eq('user_id', userId)
    } else if (anonymous_id) {
      query = query.eq('anonymous_id', anonymous_id)
    }

    await query
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Favorites DELETE error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
