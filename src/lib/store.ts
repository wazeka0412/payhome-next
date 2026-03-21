// Supabase-backed data store
import { createServerClient } from './supabase'
import type { DbLead, DbBuilder, DbEvent } from './supabase'

// Frontend-facing interfaces (camelCase)
export interface Lead {
  id: string
  type: '無料相談' | '資料請求' | '見学会予約' | '工務店相談' | 'B2Bお問い合わせ' | 'パートナー申込' | 'セミナー申込'
  name: string
  email: string
  phone?: string
  company?: string
  area?: string
  budget?: string
  layout?: string
  message?: string
  video?: string
  builderName?: string
  selectedServices?: string[]
  selectedCompanies?: string[]
  status: '新規' | '対応中' | '紹介済' | '面談済' | '成約' | '失注'
  score: number
  memo?: string
  sourceChannel?: string
  sourceContentId?: string
  recentViews?: Array<{ content_type: string; content_id: string; page_path: string; created_at: string }>
  anonymousId?: string
  createdAt: string
  updatedAt: string
}

export interface BuilderProfile {
  id: string
  name: string
  email: string
  area: string
  address: string
  specialties: string[]
  description: string
  website: string
  plan: 'フリー' | 'グロース' | 'プレミアム'
  logoUrl?: string
  isActive: boolean
  // 構造化データ（AI推薦用）
  priceRange?: string
  hirayaRatio?: number
  hirayaAnnual?: number
  designTaste?: string[]
  features?: string[]
  suitableFor?: string[]
  insulationGrade?: string
  earthquakeGrade?: string
  constructionMethod?: string
  landProposal?: boolean
  commonConcerns?: string[]
  strengths?: string[]
  comparisonPoints?: string[]
}

export interface Event {
  id: string
  builderId: string
  builderName: string
  title: string
  date: string
  location: string
  type: '完成見学会' | 'モデルハウス' | 'ぺいほーむ特別見学会' | 'オンライン見学会'
  capacity: number
  reservations: number
  isActive: boolean
}

// DB → Frontend converters
function dbLeadToLead(db: DbLead): Lead {
  return {
    id: db.id,
    type: db.type as Lead['type'],
    name: db.name,
    email: db.email,
    phone: db.phone ?? undefined,
    company: db.company ?? undefined,
    area: db.area ?? undefined,
    budget: db.budget ?? undefined,
    layout: db.layout ?? undefined,
    message: db.message ?? undefined,
    video: db.video ?? undefined,
    builderName: db.builder_name ?? undefined,
    selectedServices: db.selected_services ?? undefined,
    selectedCompanies: db.selected_companies ?? undefined,
    status: db.status as Lead['status'],
    score: db.score,
    memo: db.memo ?? undefined,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  }
}

function dbBuilderToBuilder(db: DbBuilder): BuilderProfile {
  return {
    id: db.id,
    name: db.name,
    email: db.email ?? '',
    area: db.area ?? '',
    address: db.address ?? '',
    specialties: db.specialties ?? [],
    description: db.description ?? '',
    website: db.website ?? '',
    plan: db.plan as BuilderProfile['plan'],
    logoUrl: db.logo_url ?? undefined,
    isActive: db.is_active,
    priceRange: db.price_range ?? undefined,
    hirayaRatio: db.hiraya_ratio ?? undefined,
    hirayaAnnual: db.hiraya_annual ?? undefined,
    designTaste: db.design_taste ?? [],
    features: db.features ?? [],
    suitableFor: db.suitable_for ?? [],
    insulationGrade: db.insulation_grade ?? undefined,
    earthquakeGrade: db.earthquake_grade ?? undefined,
    constructionMethod: db.construction_method ?? undefined,
    landProposal: db.land_proposal ?? false,
    commonConcerns: db.common_concerns ?? [],
    strengths: db.strengths ?? [],
    comparisonPoints: db.comparison_points ?? [],
  }
}

function dbEventToEvent(db: DbEvent): Event {
  return {
    id: db.id,
    builderId: db.builder_id ?? '',
    builderName: db.builder_name,
    title: db.title,
    date: db.date,
    location: db.location ?? '',
    type: db.type as Event['type'],
    capacity: db.capacity,
    reservations: db.reservations,
    isActive: db.is_active,
  }
}

// CRUD operations using Supabase
export const store = {
  // Leads
  getLeads: async (): Promise<Lead[]> => {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) { console.error('getLeads error:', error); return [] }
    return (data as DbLead[]).map(dbLeadToLead)
  },

  getLeadById: async (id: string): Promise<Lead | null> => {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()
    if (error || !data) return null
    return dbLeadToLead(data as DbLead)
  },

  getLeadsByBuilder: async (builderName: string): Promise<Lead[]> => {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .or(`builder_name.eq.${builderName},selected_companies.cs.{${builderName}}`)
      .order('created_at', { ascending: false })
    if (error) { console.error('getLeadsByBuilder error:', error); return [] }
    return (data as DbLead[]).map(dbLeadToLead)
  },

  addLead: async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'score'>): Promise<Lead> => {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('leads')
      .insert({
        type: lead.type,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        area: lead.area,
        budget: lead.budget,
        layout: lead.layout,
        message: lead.message,
        video: lead.video,
        builder_name: lead.builderName,
        selected_services: lead.selectedServices,
        selected_companies: lead.selectedCompanies,
        status: '新規',
        score: 50,
        source_channel: lead.sourceChannel,
        source_content_id: lead.sourceContentId,
        recent_views: lead.recentViews || [],
        anonymous_id: lead.anonymousId,
      })
      .select()
      .single()
    if (error) { console.error('addLead error:', error); throw error }
    return dbLeadToLead(data as DbLead)
  },

  updateLeadStatus: async (id: string, status: Lead['status']): Promise<Lead | null> => {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error || !data) return null
    return dbLeadToLead(data as DbLead)
  },

  // Builders
  getBuilders: async (): Promise<BuilderProfile[]> => {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('builders')
      .select('*')
      .eq('is_active', true)
      .order('name')
    if (error) { console.error('getBuilders error:', error); return [] }
    return (data as DbBuilder[]).map(dbBuilderToBuilder)
  },

  getBuilderById: async (id: string): Promise<BuilderProfile | null> => {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('builders')
      .select('*')
      .eq('id', id)
      .single()
    if (error || !data) return null
    return dbBuilderToBuilder(data as DbBuilder)
  },

  getBuilderByEmail: async (email: string): Promise<BuilderProfile | null> => {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('builders')
      .select('*')
      .eq('email', email)
      .single()
    if (error || !data) return null
    return dbBuilderToBuilder(data as DbBuilder)
  },

  updateBuilder: async (id: string, updates: Partial<BuilderProfile>): Promise<BuilderProfile | null> => {
    const supabase = createServerClient()
    const dbUpdates: Record<string, unknown> = {}
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.email !== undefined) dbUpdates.email = updates.email
    if (updates.area !== undefined) dbUpdates.area = updates.area
    if (updates.address !== undefined) dbUpdates.address = updates.address
    if (updates.specialties !== undefined) dbUpdates.specialties = updates.specialties
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.website !== undefined) dbUpdates.website = updates.website
    if (updates.plan !== undefined) dbUpdates.plan = updates.plan
    if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl

    const { data, error } = await supabase
      .from('builders')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()
    if (error || !data) return null
    return dbBuilderToBuilder(data as DbBuilder)
  },

  // Events
  getEvents: async (): Promise<Event[]> => {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    if (error) { console.error('getEvents error:', error); return [] }
    return (data as DbEvent[]).map(dbEventToEvent)
  },

  getActiveEvents: async (): Promise<Event[]> => {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('date', { ascending: true })
    if (error) { console.error('getActiveEvents error:', error); return [] }
    return (data as DbEvent[]).map(dbEventToEvent)
  },

  getEventsByBuilder: async (builderId: string): Promise<Event[]> => {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('builder_id', builderId)
      .order('date', { ascending: true })
    if (error) { console.error('getEventsByBuilder error:', error); return [] }
    return (data as DbEvent[]).map(dbEventToEvent)
  },

  addEvent: async (event: Omit<Event, 'id' | 'reservations'>): Promise<Event> => {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('events')
      .insert({
        builder_id: event.builderId || null,
        builder_name: event.builderName,
        title: event.title,
        date: event.date,
        location: event.location,
        type: event.type,
        capacity: event.capacity,
        is_active: event.isActive,
        reservations: 0,
      })
      .select()
      .single()
    if (error) { console.error('addEvent error:', error); throw error }
    return dbEventToEvent(data as DbEvent)
  },

  // Stats
  getStats: async () => {
    const supabase = createServerClient()
    const [leadsRes, buildersRes, eventsRes] = await Promise.all([
      supabase.from('leads').select('status', { count: 'exact' }),
      supabase.from('builders').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('events').select('is_active', { count: 'exact' }),
    ])

    const leads = leadsRes.data ?? []
    return {
      totalLeads: leadsRes.count ?? 0,
      newLeads: leads.filter((l: { status: string }) => l.status === '新規').length,
      activeLeads: leads.filter((l: { status: string }) => l.status === '対応中').length,
      convertedLeads: leads.filter((l: { status: string }) => l.status === '成約').length,
      totalBuilders: buildersRes.count ?? 0,
      totalEvents: eventsRes.count ?? 0,
      activeEvents: (eventsRes.data ?? []).filter((e: { is_active: boolean }) => e.is_active).length,
    }
  },

  getBuilderStats: async (builderName: string) => {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('leads')
      .select('type, status')
      .or(`builder_name.eq.${builderName},selected_companies.cs.{${builderName}}`)

    const builderLeads = data ?? []
    return {
      totalLeads: builderLeads.length,
      catalog: builderLeads.filter((l: { type: string }) => l.type === '資料請求').length,
      event: builderLeads.filter((l: { type: string }) => l.type === '見学会予約').length,
      consultation: builderLeads.filter((l: { type: string }) => l.type === '無料相談' || l.type === '工務店相談').length,
      converted: builderLeads.filter((l: { status: string }) => l.status === '成約').length,
    }
  },
}
