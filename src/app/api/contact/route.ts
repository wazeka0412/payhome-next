import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'
import { createServerClient } from '@/lib/supabase'

const FORM_META_DELIMITER = '\n---FORM_META---\n'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const builderName = data.builderName || data.builder || undefined
    const selectedCompanies = data.selectedCompanies || data.selected || undefined

    // Collect form-specific metadata that doesn't have dedicated DB columns
    const meta: Record<string, string> = {}
    if (data.build_area) meta.buildArea = data.build_area
    if (data.postal) meta.postal = data.postal
    if (data.address) meta.address = data.address
    if (data.eventDate) meta.eventDate = data.eventDate
    if (data.event) meta.eventTitle = data.event
    if (data.participants) meta.participants = String(data.participants)

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

    const lead = await store.addLead({
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
    })
    console.log('=== NEW LEAD ===', lead.id)
    return NextResponse.json({ success: true, leadId: lead.id })
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
