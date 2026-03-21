'use client'

const ANON_ID_KEY = 'payhome_anon_id'
const UTM_KEY = 'payhome_utm'

/** localStorage から anonymous_id を取得。なければ生成して保存 */
export function getOrCreateAnonymousId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(ANON_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(ANON_ID_KEY, id)
  }
  return id
}

/** anonymous_id を取得（なければ空文字） */
export function getAnonymousId(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(ANON_ID_KEY) || ''
}

interface UtmParams {
  source?: string
  medium?: string
  campaign?: string
}

/** URLからUTMパラメータを取得し、sessionStorageにキャッシュ */
export function getUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {}

  // sessionStorage にキャッシュがあればそれを返す
  const cached = sessionStorage.getItem(UTM_KEY)
  if (cached) {
    try { return JSON.parse(cached) } catch { /* fall through */ }
  }

  const params = new URLSearchParams(window.location.search)
  const utm: UtmParams = {}
  if (params.get('utm_source')) utm.source = params.get('utm_source')!
  if (params.get('utm_medium')) utm.medium = params.get('utm_medium')!
  if (params.get('utm_campaign')) utm.campaign = params.get('utm_campaign')!

  if (Object.keys(utm).length > 0) {
    sessionStorage.setItem(UTM_KEY, JSON.stringify(utm))
  }

  return utm
}

/** デバイス種別を判定 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  const w = window.innerWidth
  if (w < 768) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}
