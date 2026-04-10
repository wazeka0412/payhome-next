import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createServerClient } from '@/lib/supabase';
import { localFindOne, localUpsert } from '@/lib/local-store';
import {
  DEFAULT_CONTACT_PREFERENCES,
  type ContactPreferences,
} from '@/lib/contact-preferences';

/**
 * GET /api/me/contact-preferences
 * 現在のユーザーの連絡条件設定を返す。未設定ならデフォルト値を返す。
 *
 * クエリ:
 *   anonymous_id?: string (未ログイン時用)
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
      return Response.json({ preferences: DEFAULT_CONTACT_PREFERENCES });
    }

    // ── Supabase 優先 ──
    const supabase = createServerClient();
    let row: Record<string, unknown> | null = null;

    try {
      let query = supabase
        .from('contact_preferences')
        .select('*')
        .limit(1)
        .order('updated_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      } else if (anonymousId) {
        query = query.eq('anonymous_id', anonymousId);
      }
      const { data, error } = await query;
      if (error) throw error;
      row = (data && data[0]) || null;
    } catch (err) {
      console.warn(
        '[contact-preferences GET] Supabase unreachable, using local fallback:',
        (err as Error).message
      );
      const where: Record<string, unknown> = userId
        ? { user_id: userId }
        : { anonymous_id: anonymousId };
      row = await localFindOne('contact_preferences', where);
    }

    if (!row) {
      return Response.json({ preferences: DEFAULT_CONTACT_PREFERENCES });
    }

    return Response.json({ preferences: row });
  } catch (err) {
    console.error('[contact-preferences GET] error:', err);
    return Response.json(
      { preferences: DEFAULT_CONTACT_PREFERENCES },
      { status: 200 }
    );
  }
}

/**
 * POST /api/me/contact-preferences
 * ユーザーの連絡条件設定を保存（upsert）する。
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Partial<
      ContactPreferences & { anonymous_id?: string }
    >;

    let userId: string | undefined;
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (token?.sub) userId = token.sub;
    } catch {
      /* ignore */
    }

    if (!userId && !body.anonymous_id) {
      return Response.json(
        { error: 'authentication_required' },
        { status: 401 }
      );
    }

    const record: ContactPreferences & { anonymous_id?: string; user_id?: string } = {
      frequency: body.frequency || DEFAULT_CONTACT_PREFERENCES.frequency,
      channels:
        Array.isArray(body.channels) && body.channels.length > 0
          ? body.channels
          : DEFAULT_CONTACT_PREFERENCES.channels,
      timeslots:
        Array.isArray(body.timeslots) && body.timeslots.length > 0
          ? body.timeslots
          : DEFAULT_CONTACT_PREFERENCES.timeslots,
      purpose: body.purpose || DEFAULT_CONTACT_PREFERENCES.purpose,
      consideration_phase:
        body.consideration_phase || DEFAULT_CONTACT_PREFERENCES.consideration_phase,
      memo: body.memo || '',
      updated_at: new Date().toISOString(),
    };
    if (userId) record.user_id = userId;
    else if (body.anonymous_id) record.anonymous_id = body.anonymous_id;

    // ── Supabase 優先 ──
    const supabase = createServerClient();
    let savedRecord: Record<string, unknown> | null = null;
    const recordAny = record as unknown as Record<string, unknown>;

    try {
      const conflictKey = userId ? 'user_id' : 'anonymous_id';
      const { data, error } = await supabase
        .from('contact_preferences')
        .upsert(recordAny, { onConflict: conflictKey })
        .select()
        .single();
      if (error) throw error;
      savedRecord = data as Record<string, unknown>;
    } catch (err) {
      console.warn(
        '[contact-preferences POST] Supabase unreachable, using local fallback:',
        (err as Error).message
      );
      const conflictKey = userId ? 'user_id' : 'anonymous_id';
      savedRecord = await localUpsert(
        'contact_preferences',
        recordAny,
        conflictKey
      );
    }

    return Response.json({ ok: true, preferences: savedRecord });
  } catch (err) {
    console.error('[contact-preferences POST] error:', err);
    return Response.json({ error: 'internal_error' }, { status: 500 });
  }
}
