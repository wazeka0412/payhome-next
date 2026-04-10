import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createServerClient } from '@/lib/supabase';
import { localSelect } from '@/lib/local-store';

/**
 * GET /api/ai/diagnosis/me
 *
 * 現在のセッションユーザー（または匿名ID）の最新のAI診断結果を返す。
 * /mypage と /welcome から呼び出して、保存済み診断を再表示する。
 *
 * クエリ:
 *   anonymous_id?: string  会員ログインしていない場合に使用
 *
 * レスポンス:
 *   200: { found: true, session: {...} } | { found: false }
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const anonymousId = url.searchParams.get('anonymous_id');

    let userId: string | undefined;
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (token?.sub) userId = token.sub;
    } catch {
      /* ignore */
    }

    if (!userId && !anonymousId) {
      return Response.json({ found: false });
    }

    // ── Supabase 優先 ──
    const supabase = createServerClient();
    let session: Record<string, unknown> | null = null;

    try {
      let query = supabase
        .from('diagnosis_sessions')
        .select('*')
        .order('completed_at', { ascending: false })
        .limit(1);
      if (userId) {
        query = query.eq('user_id', userId);
      } else if (anonymousId) {
        query = query.eq('anonymous_id', anonymousId);
      }
      const { data, error } = await query;
      if (error) throw error;
      session = (data && data[0]) || null;
    } catch (err) {
      console.warn('[diagnosis/me] Supabase unreachable, using local fallback:', (err as Error).message);
      // ── ローカルフォールバック ──
      const where: Record<string, unknown> = userId
        ? { user_id: userId }
        : { anonymous_id: anonymousId };
      const rows = await localSelect('diagnosis_sessions', where);
      // completed_at で降順
      rows.sort((a, b) => {
        const aTime = String(a.completed_at || a.created_at || '');
        const bTime = String(b.completed_at || b.created_at || '');
        return bTime.localeCompare(aTime);
      });
      session = rows[0] || null;
    }

    if (!session) {
      return Response.json({ found: false });
    }

    return Response.json({
      found: true,
      session: {
        id: session.id,
        user_type: session.user_type,
        recommended_builders: session.recommended_builders,
        completed_at: session.completed_at,
      },
    });
  } catch (err) {
    console.error('[diagnosis/me] error:', err);
    return Response.json({ found: false }, { status: 200 });
  }
}
