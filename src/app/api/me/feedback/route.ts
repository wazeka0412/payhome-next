import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createServerClient } from '@/lib/supabase';
import { localInsert, localSelect } from '@/lib/local-store';

/**
 * POST /api/me/feedback
 *
 * Smart Match Phase 1.5: フィードバック・相談フォーム
 *
 * 会員様が工務店との体験（良かった点・改善してほしい点）を
 * ぺいほーむ運営に直接フィードバックできる仕組み。
 *
 * 「しつこい営業を報告する」とは表現せず、
 * 「ぺいほーむ運営にご相談」という中立的な位置づけとする。
 *
 * Body:
 *   - builder_id?: string
 *   - builder_name?: string
 *   - category: 'good' | 'concern' | 'suggestion' | 'other'
 *   - message: string
 *   - anonymous_id?: string
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { builder_id, builder_name, category, message, anonymous_id } = body as {
      builder_id?: string;
      builder_name?: string;
      category?: string;
      message?: string;
      anonymous_id?: string;
    };

    if (!category || !message || !message.trim()) {
      return Response.json({ error: 'missing_required_fields' }, { status: 400 });
    }
    if (message.length > 2000) {
      return Response.json({ error: 'message_too_long' }, { status: 400 });
    }

    let userId: string | undefined;
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (token?.sub) userId = token.sub;
    } catch {
      /* ignore */
    }

    const record = {
      user_id: userId || null,
      anonymous_id: anonymous_id || null,
      builder_id: builder_id || null,
      builder_name: builder_name || null,
      category,
      message: message.trim(),
      status: 'received', // received → reviewing → resolved
      created_at: new Date().toISOString(),
    };

    // Supabase 優先 → ローカル
    let saved: Record<string, unknown> | null = null;
    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('user_feedback')
        .insert(record)
        .select()
        .single();
      if (error) throw error;
      saved = data as Record<string, unknown>;
    } catch (err) {
      console.warn('[feedback POST] Supabase unreachable, using local:', (err as Error).message);
      saved = await localInsert('user_feedback', record);
    }

    return Response.json({ ok: true, id: saved?.id });
  } catch (err) {
    console.error('[feedback POST] error:', err);
    return Response.json({ error: 'internal_error' }, { status: 500 });
  }
}

/**
 * GET /api/me/feedback
 * 現在のユーザーの過去のフィードバック履歴
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
      return Response.json({ feedback: [] });
    }

    try {
      const supabase = createServerClient();
      let query = supabase.from('user_feedback').select('*').order('created_at', { ascending: false });
      if (userId) query = query.eq('user_id', userId);
      else if (anonymousId) query = query.eq('anonymous_id', anonymousId);
      const { data, error } = await query;
      if (error) throw error;
      return Response.json({ feedback: data || [] });
    } catch {
      const where: Record<string, unknown> = userId
        ? { user_id: userId }
        : { anonymous_id: anonymousId };
      const rows = await localSelect('user_feedback', where);
      rows.sort((a, b) =>
        String(b.created_at || '').localeCompare(String(a.created_at || ''))
      );
      return Response.json({ feedback: rows });
    }
  } catch {
    return Response.json({ feedback: [] });
  }
}
