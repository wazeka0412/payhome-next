import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import type { DbLead } from '@/lib/supabase'
import type { ContactPreferences } from '@/lib/contact-preferences'

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
    // Anti-Pressure Pack: contact preferences from the user
    contactPreferences,
  }
}

export async function GET(request: NextRequest) {
  const builder = request.nextUrl.searchParams.get('builder')
  const email = request.nextUrl.searchParams.get('email')

  const supabase = createServerClient()
  let query = supabase.from('leads').select('*').order('created_at', { ascending: false })

  if (builder) {
    query = query.or(`builder_name.eq.${builder},selected_companies.cs.{${builder}}`)
  }
  if (email) {
    query = query.eq('email', email)
  }

  const { data, error } = await query

  if (error) {
    console.error('Leads GET error:', error)
    return Response.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }

  return Response.json((data as DbLead[]).map(formatLead))
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
