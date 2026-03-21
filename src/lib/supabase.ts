import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key (for API routes)
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, serviceRoleKey)
}

// Type definitions matching the DB schema
export interface DbLead {
  id: string
  type: string
  name: string
  email: string
  phone?: string
  company?: string
  area?: string
  budget?: string
  layout?: string
  message?: string
  video?: string
  builder_id?: string
  builder_name?: string
  selected_companies?: string[]
  selected_services?: string[]
  status: string
  score: number
  memo?: string
  user_id?: string
  source_channel?: string
  source_content_id?: string
  recent_views?: Array<{ content_type: string; content_id: string; page_path: string; created_at: string }>
  anonymous_id?: string
  chat_session_id?: string
  created_at: string
  updated_at: string
}

export interface DbBuilder {
  id: string
  name: string
  email?: string
  phone?: string
  area?: string
  address?: string
  specialties?: string[]
  description?: string
  website?: string
  logo_url?: string
  plan: string
  is_active: boolean
  // 構造化データ（AI推薦用）
  price_range?: string
  hiraya_ratio?: number
  hiraya_annual?: number
  design_taste?: string[]
  features?: string[]
  suitable_for?: string[]
  insulation_grade?: string
  earthquake_grade?: string
  construction_method?: string
  land_proposal?: boolean
  common_concerns?: string[]
  strengths?: string[]
  comparison_points?: string[]
  created_at: string
  updated_at: string
}

export interface DbEvent {
  id: string
  builder_id?: string
  builder_name: string
  title: string
  date: string
  location?: string
  type?: string
  capacity: number
  reservations: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DbUser {
  id: string
  email: string
  name?: string
  role: 'admin' | 'builder' | 'user'
  builder_id?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}
