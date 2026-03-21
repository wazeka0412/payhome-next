/**
 * イベント送信キュー
 * - 5件溜まるか2秒経過でバッチ送信
 * - sendBeacon使用（非ブロッキング、ページ離脱時も確実に送信）
 */

interface QueuedEvent {
  anonymous_id: string
  event_type: string
  content_type?: string
  content_id?: string
  page_path?: string
  referrer?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  device_type?: string
  metadata?: Record<string, unknown>
}

const BATCH_SIZE = 5
const FLUSH_INTERVAL = 2000 // 2秒

let queue: QueuedEvent[] = []
let timer: ReturnType<typeof setTimeout> | null = null
let initialized = false

function flush(): void {
  if (queue.length === 0) return

  const batch = [...queue]
  queue = []

  if (timer) {
    clearTimeout(timer)
    timer = null
  }

  const payload = JSON.stringify({ events: batch })

  // sendBeacon がページ離脱時でも確実に送信
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const sent = navigator.sendBeacon('/api/events/track', new Blob([payload], { type: 'application/json' }))
    if (!sent) {
      // sendBeaconが失敗した場合はfetchでフォールバック
      fetch('/api/events/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {})
    }
  } else {
    fetch('/api/events/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  }
}

function startTimer(): void {
  if (timer) return
  timer = setTimeout(flush, FLUSH_INTERVAL)
}

function initVisibilityListener(): void {
  if (initialized || typeof document === 'undefined') return
  initialized = true
  // ページ離脱時にキューをフラッシュ
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flush()
    }
  })
}

export function enqueueEvent(event: QueuedEvent): void {
  initVisibilityListener()
  queue.push(event)

  if (queue.length >= BATCH_SIZE) {
    flush()
  } else {
    startTimer()
  }
}
