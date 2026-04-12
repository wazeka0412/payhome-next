import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import type { DbLead } from '@/lib/supabase'
import { localSelect } from '@/lib/local-store'
import type { ContactPreferences } from '@/lib/contact-preferences'
import type { ViewingMode } from '@/lib/event-viewing-mode'

const FORM_META_DELIMITER = '\n---FORM_META---\n'

function parseMessageAndMeta(raw: string | undefined): { message: string; meta: Record<string, unknown> } {
  if (!raw) return { message: '', meta: {} }
  const idx = raw.indexOf(FORM_META_DELIMITER)
  if (idx === -1) return { message: raw, meta: {} }
  const message = raw.slice(0, idx)
  try {
    const meta = JSON.parse(raw.slice(idx + FORM_META_DELIMITER.length))
    return { message, meta }
  } catch {
    return { message: raw, meta: {} }
  }
}

function formatLead(db: DbLead) {
  const { message, meta } = parseMessageAndMeta(db.message)
  const contactPreferences =
    meta.contact_preferences && typeof meta.contact_preferences === 'object'
      ? (meta.contact_preferences as ContactPreferences)
      : null
  const viewingMode =
    typeof meta.viewing_mode === 'string' ? (meta.viewing_mode as ViewingMode) : null
  return {
    id: db.id,
    type: db.type,
    name: db.name,
    email: db.email,
    phone: db.phone ?? '',
    company: db.company ?? '',
    area: db.area ?? '',
    budget: db.budget ?? '',
    layout: db.layout ?? '',
    message,
    video: db.video ?? '',
    builderName: db.builder_name ?? '',
    selectedCompanies: db.selected_companies ?? [],
    selectedServices: db.selected_services ?? [],
    status: db.status,
    score: db.score,
    memo: db.memo ?? '',
    createdAt: db.created_at,
    // Form-specific metadata
    buildArea: (meta.buildArea as string) ?? '',
    postal: (meta.postal as string) ?? '',
    address: (meta.address as string) ?? '',
    eventDate: (meta.eventDate as string) ?? '',
    eventTitle: (meta.eventTitle as string) ?? '',
    participants: (meta.participants as string) ?? '',
    // Smart Match: contact preferences and viewing mode from the user
    contactPreferences,
    viewingMode,
  }
}

export async function GET(request: NextRequest) {
  const builder = request.nextUrl.searchParams.get('builder')
  const email = request.nextUrl.searchParams.get('email')

  // ── Supabase 優先 ──
  try {
    const supabase = createServerClient()
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false })

    if (builder) {
      query = query.or(`builder_name.eq.${builder},selected_companies.cs.{${builder}}`)
    }
    if (email) {
      query = query.eq('email', email)
    }

    const { data, error } = await query
    if (error) throw error
    return Response.json((data as DbLead[]).map(formatLead))
  } catch (err) {
    console.warn('[leads GET] Supabase unreachable, using local fallback:', (err as Error).message)
  }

  // ── ローカルフォールバック ──
  // localStore に保存された raw lead 行を読み出して formatLead 形式で返す
  try {
    const where: Record<string, unknown> = {}
    if (builder) where.builder_name = builder
    if (email) where.email = email
    const rows = await localSelect('leads', where)
    rows.sort((a, b) =>
      String(b.created_at || '').localeCompare(String(a.created_at || ''))
    )
    // localStore の行を DbLead 互換にマップして formatLead に渡す
    const formatted = rows.map((r) => {
      const dbLike = {
        id: r.id,
        type: r.type,
        name: r.name,
        email: r.email,
        phone: r.phone ?? null,
        company: r.company ?? null,
        area: r.area ?? null,
        budget: r.budget ?? null,
        layout: r.layout ?? null,
        message: r.message ?? null,
        video: r.video ?? null,
        builder_id: r.builder_id ?? null,
        builder_name: r.builder_name ?? null,
        selected_companies: r.selected_companies ?? null,
        selected_services: r.selected_services ?? null,
        status: r.status ?? '新規',
        score: r.score ?? 50,
        memo: r.memo ?? null,
        user_id: r.user_id ?? null,
        source_channel: r.source_channel ?? null,
        source_content_id: r.source_content_id ?? null,
        recent_views: r.recent_views ?? null,
        anonymous_id: r.anonymous_id ?? null,
        chat_session_id: r.chat_session_id ?? null,
        created_at: r.created_at ?? new Date().toISOString(),
        updated_at: r.updated_at ?? new Date().toISOString(),
      } as DbLead
      return formatLead(dbLike)
    })
    return Response.json(formatted)
  } catch (err) {
    console.error('[leads GET] local fallback failed:', err)
    return Response.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('leads')
      .insert({
        type: body.type || '無料相談',
        name: body.name || '',
        email: body.email || '',
        phone: body.tel || body.phone,
        area: body.area,
        budget: body.budget,
        message: body.summary || body.message,
        builder_name: body.builder,
        status: '新規',
        score: body.score || 50,
      })
      .select()
      .single()

    if (error) {
      console.error('Leads POST error:', error)
      return Response.json({ error: 'Failed to create lead' }, { status: 500 })
    }

    return Response.json(data, { status: 201 })
  } catch {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
}
