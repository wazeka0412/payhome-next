import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createServerClient } from '@/lib/supabase';
import { localInsert, localSelect } from '@/lib/local-store';

/**
 * POST /api/builders/questions
 *
 * Smart Match Phase 1.5: AI 仲介質問機能
 *
 * 会員様が工務店に対して匿名で質問できる仕組み。
 * 初期段階では連絡先を渡さず、ぺいほーむが仲介してやり取りする。
 * 会員様が「この工務店と直接話したい」と判断したタイミングで
 * 実名開示に切り替える（Phase 2）。
 *
 * Body:
 *   - builder_id: string (required)
 *   - question: string (required)
 *   - anonymous_id?: string
 *   - category?: 'pricing' | 'design' | 'quality' | 'process' | 'other'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { builder_id, question, anonymous_id, category } = body as {
      builder_id?: string;
      question?: string;
      anonymous_id?: string;
      category?: string;
    };

    if (!builder_id || !question || !question.trim()) {
      return Response.json({ error: 'missing_required_fields' }, { status: 400 });
    }
    if (question.length > 1000) {
      return Response.json({ error: 'question_too_long' }, { status: 400 });
    }

    // Resolve user
    let userId: string | undefined;
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (token?.sub) userId = token.sub;
    } catch {
      /* ignore */
    }

    const record = {
      builder_id,
      question: question.trim(),
      category: category || 'other',
      status: 'pending', // pending → answered → resolved
      user_id: userId || null,
      anonymous_id: anonymous_id || null,
      answered_at: null,
      answer: null,
      created_at: new Date().toISOString(),
    };

    // Supabase 優先 → ローカル
    let saved: Record<string, unknown> | null = null;
    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('builder_questions')
        .insert(record)
        .select()
        .single();
      if (error) throw error;
      saved = data as Record<string, unknown>;
    } catch (err) {
      console.warn('[builder-questions POST] Supabase unreachable, using local:', (err as Error).message);
      saved = await localInsert('builder_questions', record);
    }

    return Response.json({ ok: true, id: saved?.id });
  } catch (err) {
    console.error('[builder-questions POST] error:', err);
    return Response.json({ error: 'internal_error' }, { status: 500 });
  }
}

/**
 * GET /api/builders/questions?builder_id=xxx
 * 工務店ごとの過去の質問履歴を返す（Phase 2 で FAQ 化）
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const builderId = url.searchParams.get('builder_id');
    if (!builderId) return Response.json({ questions: [] });

    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('builder_questions')
        .select('*')
        .eq('builder_id', builderId)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return Response.json({ questions: data || [] });
    } catch {
      const rows = await localSelect('builder_questions', { builder_id: builderId });
      rows.sort((a, b) =>
        String(b.created_at || '').localeCompare(String(a.created_at || ''))
      );
      return Response.json({ questions: rows.slice(0, 20) });
    }
  } catch {
    return Response.json({ questions: [] });
  }
}
