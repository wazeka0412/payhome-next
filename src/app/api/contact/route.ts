import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'
import { createServerClient } from '@/lib/supabase'
import { localInsert } from '@/lib/local-store'
import { sendLeadNotification } from '@/lib/email'
import type { ContactPreferences } from '@/lib/contact-preferences'
import type { ViewingMode } from '@/lib/event-viewing-mode'

const FORM_META_DELIMITER = '\n---FORM_META---\n'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const builderName = data.builderName || data.builder || undefined
    const selectedCompanies = data.selectedCompanies || data.selected || undefined

    // Collect form-specific metadata that doesn't have dedicated DB columns
    const meta: Record<string, unknown> = {}
    if (data.build_area) meta.buildArea = data.build_area
    if (data.postal) meta.postal = data.postal
    if (data.address) meta.address = data.address
    if (data.eventDate) meta.eventDate = data.eventDate
    if (data.event) meta.eventTitle = data.event
    if (data.participants) meta.participants = String(data.participants)

    // Smart Match: persist the user's contact preferences
    // to the lead record so the builder can prepare the right approach.
    if (data.contact_preferences && typeof data.contact_preferences === 'object') {
      meta.contact_preferences = data.contact_preferences
    }
    // Phase 1.5: persist the viewing mode (体感/相談/契約検討)
    if (typeof data.viewing_mode === 'string') {
      meta.viewing_mode = data.viewing_mode
    }

    // Store user message + metadata JSON in message field
    const userMessage = data.message || ''
    const message = Object.keys(meta).length > 0
      ? userMessage + FORM_META_DELIMITER + JSON.stringify(meta)
      : userMessage || undefined

    // --- リード拡充: 直前閲覧履歴を取得 ---
    let recentViews: Array<{ content_type: string; content_id: string; page_path: string; created_at: string }> = []
    const anonymousId = data.anonymous_id
    if (anonymousId) {
      try {
        const supabase = createServerClient()
        const { data: views } = await supabase
          .from('user_events')
          .select('content_type, content_id, page_path, created_at')
          .eq('anonymous_id', anonymousId)
          .not('content_type', 'is', null)
          .order('created_at', { ascending: false })
          .limit(5)
        if (views) recentViews = views
      } catch {
        // 取得失敗でもリード作成は継続
      }
    }

    // --- 流入チャネルの判定 ---
    const sourceChannel = data.source_channel || data.utm_source || inferChannel(req.headers.get('referer'))

    const leadPayload = {
      type: data.type || '無料相談',
      name: data.name || data.company || '',
      email: data.email || '',
      phone: data.phone,
      company: data.company,
      area: data.area || data.builder_area,
      budget: data.budget,
      layout: data.layout,
      message,
      video: data.video,
      builderName,
      selectedServices: data.selectedServices,
      selectedCompanies,
      sourceChannel,
      sourceContentId: data.source_content_id,
      recentViews,
      anonymousId,
    }

    // Smart Match payload for email body (not stored in DB columns)
    const contactPrefsForEmail = (data.contact_preferences &&
      typeof data.contact_preferences === 'object'
        ? (data.contact_preferences as ContactPreferences)
        : null)
    const viewingModeForEmail = (typeof data.viewing_mode === 'string'
      ? (data.viewing_mode as ViewingMode)
      : null)
    const eventTitleForEmail = typeof data.event === 'string' ? data.event : undefined
    const eventDateForEmail = typeof data.eventDate === 'string' ? data.eventDate : undefined

    try {
      const lead = await store.addLead(leadPayload)
      console.log('=== NEW LEAD ===', lead.id)
      // Fire-and-forget: send notification email with SMART MATCH block
      if (builderName) {
        try {
          const builder = await store.getBuilders().then((list) =>
            list.find((b) => b.name === builderName)
          )
          if (builder?.email) {
            await sendLeadNotification(
              {
                leadId: lead.id,
                type: lead.type,
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                area: lead.area,
                budget: lead.budget,
                layout: lead.layout,
                message: lead.message,
                sourceChannel: lead.sourceChannel,
                contactPreferences: contactPrefsForEmail,
                viewingMode: viewingModeForEmail,
                eventTitle: eventTitleForEmail,
                eventDate: eventDateForEmail,
              },
              builder.email,
              builderName
            )
          }
        } catch (notifyErr) {
          console.warn('[contact] notification failed (non-fatal):', (notifyErr as Error).message)
        }
      }
      return NextResponse.json({ success: true, leadId: lead.id, mode: 'supabase' })
    } catch (err) {
      console.warn('[contact] Supabase unreachable, using local fallback:', (err as Error).message)
      const localLead = await localInsert('leads', {
        type: leadPayload.type,
        name: leadPayload.name,
        email: leadPayload.email,
        phone: leadPayload.phone,
        company: leadPayload.company,
        area: leadPayload.area,
        budget: leadPayload.budget,
        layout: leadPayload.layout,
        message: leadPayload.message,
        video: leadPayload.video,
        builder_name: leadPayload.builderName,
        selected_services: leadPayload.selectedServices,
        selected_companies: leadPayload.selectedCompanies,
        source_channel: leadPayload.sourceChannel,
        source_content_id: leadPayload.sourceContentId,
        recent_views: leadPayload.recentViews,
        anonymous_id: leadPayload.anonymousId,
        status: '新規',
        score: 50,
      })
      console.log('=== NEW LOCAL LEAD ===', localLead.id)
      return NextResponse.json({ success: true, leadId: localLead.id, mode: 'local' })
    }
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

/** Refererヘッダからチャネルを推定 */
function inferChannel(referer: string | null): string {
  if (!referer) return 'direct'
  if (referer.includes('youtube.com') || referer.includes('youtu.be')) return 'youtube'
  if (referer.includes('google.') || referer.includes('yahoo.co.jp') || referer.includes('bing.com')) return 'seo'
  if (referer.includes('instagram.com') || referer.includes('threads.net') || referer.includes('facebook.com') || referer.includes('twitter.com') || referer.includes('x.com') || referer.includes('tiktok.com')) return 'sns'
  if (referer.includes('line.me') || referer.includes('line.naver.jp')) return 'line'
  return 'referral'
}
