import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getToken } from 'next-auth/jwt'
import { localInsert, localSelect, localUpdate } from '@/lib/local-store'

/**
 * /api/favorites — お気に入り CRUD
 *
 * v4.0: Supabase 優先、到達不可時は .local-data/favorites.json にフォールバック。
 * 会員（user_id）と非会員（anonymous_id）の両方をサポート。
 * 会員は無制限保存、非会員はブラウザ単位で同じく無制限。
 */

async function resolveUserId(request: NextRequest): Promise<string | undefined> {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    return token?.sub
  } catch {
    return undefined
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const anonymousId = searchParams.get('anonymous_id')
    const contentType = searchParams.get('content_type')
    const userId = await resolveUserId(request)

    if (!userId && !anonymousId) {
      return NextResponse.json([])
    }

    // ── Supabase 優先 ──
    try {
      const supabase = createServerClient()
      let query = supabase.from('favorites').select('*').order('created_at', { ascending: false })

      if (userId) {
        query = query.eq('user_id', userId)
      } else if (anonymousId) {
        query = query.eq('anonymous_id', anonymousId)
      }
      if (contentType) {
        query = query.eq('content_type', contentType)
      }

      const { data, error } = await query
      if (error) throw error
      return NextResponse.json(data || [])
    } catch (err) {
      console.warn('[favorites GET] Supabase unreachable, using local fallback:', (err as Error).message)
    }

    // ── ローカル ──
    const where: Record<string, unknown> = userId
      ? { user_id: userId }
      : { anonymous_id: anonymousId }
    if (contentType) where.content_type = contentType
    const rows = await localSelect('favorites', where)
    rows.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Favorites GET error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { anonymous_id, content_type, content_id } = body
    const userId = await resolveUserId(request)

    const row: Record<string, unknown> = {
      content_type: content_type || 'property',
      content_id,
    }
    if (userId) row.user_id = userId
    if (anonymous_id) row.anonymous_id = anonymous_id

    // ── Supabase 優先 ──
    try {
      const supabase = createServerClient()
      const { data, error } = await supabase.from('favorites').insert(row).select().single()
      if (error) {
        if (error.code === '23505') {
          return NextResponse.json({ ok: true, duplicate: true })
        }
        throw error
      }
      return NextResponse.json({ ok: true, id: data?.id, mode: 'supabase' })
    } catch (err) {
      console.warn('[favorites POST] Supabase unreachable, using local fallback:', (err as Error).message)
    }

    // ── ローカル ──
    // 重複チェック
    const where: Record<string, unknown> = {
      content_id,
      content_type: row.content_type,
    }
    if (userId) where.user_id = userId
    else if (anonymous_id) where.anonymous_id = anonymous_id
    const existing = await localSelect('favorites', where)
    if (existing.length > 0) {
      return NextResponse.json({ ok: true, duplicate: true, mode: 'local' })
    }

    const inserted = await localInsert('favorites', row)
    return NextResponse.json({ ok: true, id: inserted.id, mode: 'local' })
  } catch (error) {
    console.error('Favorites POST error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { anonymous_id, content_type, content_id } = body
    const userId = await resolveUserId(request)
    const ct = content_type || 'property'

    // ── Supabase 優先 ──
    try {
      const supabase = createServerClient()
      let query = supabase
        .from('favorites')
        .delete()
        .eq('content_id', content_id)
        .eq('content_type', ct)
      if (userId) {
        query = query.eq('user_id', userId)
      } else if (anonymous_id) {
        query = query.eq('anonymous_id', anonymous_id)
      }
      const { error } = await query
      if (error) throw error
      return NextResponse.json({ ok: true, mode: 'supabase' })
    } catch (err) {
      console.warn('[favorites DELETE] Supabase unreachable, using local fallback:', (err as Error).message)
    }

    // ── ローカル：マッチング行を削除（updateで deleted=true 印を付ける代わりに、
    //    本来は localDelete だが既存 helper にないため filter で書き戻す） ──
    const where: Record<string, unknown> = { content_id, content_type: ct }
    if (userId) where.user_id = userId
    else if (anonymous_id) where.anonymous_id = anonymous_id
    // 既存ヘルパーで擬似削除：updateで匿名idを破壊することはできないので、
    // ここでは localStore 全行読み込み→フィルタ→上書きが必要だが、
    // helper を増やさず単純化のため、 anonymous_id を非該当値に書き換えて非表示化する
    await localUpdate(
      'favorites',
      { anonymous_id: '__deleted__', user_id: null },
      where
    )
    return NextResponse.json({ ok: true, mode: 'local' })
  } catch (error) {
    console.error('Favorites DELETE error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
