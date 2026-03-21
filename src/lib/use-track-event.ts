'use client'

import { useCallback } from 'react'
import { getOrCreateAnonymousId, getUtmParams, getDeviceType } from './anonymous-id'
import { enqueueEvent } from './tracking-queue'

export type EventType =
  | 'page_view'
  | 'top_view'
  | 'article_read'
  | 'video_view'
  | 'property_detail_view'
  | 'builder_detail_view'
  | 'event_detail_view'
  | 'favorite_add'
  | 'favorite_remove'
  | 'comparison_add'
  | 'chat_start'
  | 'chat_complete'
  | 'chat_to_lead'
  | 'consultation_start'
  | 'consultation_request'
  | 'catalog_request'
  | 'reservation_submit'
  | 'simulator_use'
  | 'line_click'
  | 'tel_click'

interface TrackEventPayload {
  eventType: EventType
  contentType?: string
  contentId?: string
  metadata?: Record<string, unknown>
}

/**
 * イベント追跡フック
 * fire-and-forget でイベントをキューに追加。UIをブロックしない。
 *
 * 使い方:
 * ```
 * const trackEvent = useTrackEvent()
 * useEffect(() => {
 *   trackEvent({ eventType: 'property_detail_view', contentType: 'property', contentId: id })
 * }, [id])
 * ```
 */
export function useTrackEvent() {
  return useCallback((payload: TrackEventPayload) => {
    if (typeof window === 'undefined') return

    const utm = getUtmParams()

    enqueueEvent({
      anonymous_id: getOrCreateAnonymousId(),
      event_type: payload.eventType,
      content_type: payload.contentType,
      content_id: payload.contentId,
      page_path: window.location.pathname,
      referrer: document.referrer || undefined,
      utm_source: utm.source,
      utm_medium: utm.medium,
      utm_campaign: utm.campaign,
      device_type: getDeviceType(),
      metadata: payload.metadata,
    })
  }, [])
}
