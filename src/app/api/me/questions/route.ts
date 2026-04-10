import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { localSelect } from '@/lib/local-store'

/**
 * GET /api/me/questions
 *
 * 現在のユーザー（またはanonymous_id）が送った匿名質問の一覧を返す。
 * /mypage/questions から呼ばれる。
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const anonymousId = url.searchParams.get('anonymous_id')

    let userId: string | undefined
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
      if (token?.sub) userId = token.sub
    } catch {
      /* ignore */
    }

    if (!userId && !anonymousId) {
      return Response.json({ questions: [] })
    }

    // Supabase 優先
    try {
      const supabase = createServerClient()
      let query = supabase
        .from('builder_questions')
        .select('*')
        .order('created_at', { ascending: false })
      if (userId) {
        query = query.eq('user_id', userId)
      } else if (anonymousId) {
        query = query.eq('anonymous_id', anonymousId)
      }
      const { data, error } = await query
      if (error) throw error
      return Response.json({ questions: data || [] })
    } catch {
      const where: Record<string, unknown> = userId
        ? { user_id: userId }
        : { anonymous_id: anonymousId }
      const rows = await localSelect('builder_questions', where)
      rows.sort((a, b) =>
        String(b.created_at || '').localeCompare(String(a.created_at || ''))
      )
      return Response.json({ questions: rows })
    }
  } catch {
    return Response.json({ questions: [] })
  }
}
