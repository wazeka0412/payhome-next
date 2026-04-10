import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { localSelect, localUpdate } from '@/lib/local-store'

/**
 * GET /api/builders/questions/[id]
 * 単一の質問を取得（ユーザーの質問詳細ページ用）
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('builder_questions')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return Response.json({ question: data })
  } catch {
    const rows = await localSelect('builder_questions', { id })
    return Response.json({ question: rows[0] || null })
  }
}

/**
 * PATCH /api/builders/questions/[id]
 *
 * Smart Match Phase 1.5: 工務店が質問に回答する API。
 * 回答が登録されると status を 'answered' に変更し、answered_at を記録する。
 *
 * Body:
 *   - answer: string (required)
 *   - answered_by?: string (builder staff identifier)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const { answer, answered_by } = body as { answer?: string; answered_by?: string }

    if (!answer || !answer.trim()) {
      return Response.json({ error: 'answer_required' }, { status: 400 })
    }
    if (answer.length > 3000) {
      return Response.json({ error: 'answer_too_long' }, { status: 400 })
    }

    const patch = {
      answer: answer.trim(),
      answered_by: answered_by || 'builder',
      answered_at: new Date().toISOString(),
      status: 'answered',
    }

    // Supabase 優先
    try {
      const supabase = createServerClient()
      const { data, error } = await supabase
        .from('builder_questions')
        .update(patch)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return Response.json({ ok: true, question: data })
    } catch (err) {
      console.warn('[question PATCH] Supabase unreachable, using local:', (err as Error).message)
    }

    // Local fallback
    const updated = await localUpdate('builder_questions', patch, { id })
    if (updated === 0) {
      return Response.json({ error: 'not_found' }, { status: 404 })
    }
    const rows = await localSelect('builder_questions', { id })
    return Response.json({ ok: true, question: rows[0] || null })
  } catch (err) {
    console.error('[question PATCH] error:', err)
    return Response.json({ error: 'internal_error' }, { status: 500 })
  }
}
