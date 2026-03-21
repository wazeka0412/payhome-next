'use client'

import { useEffect } from 'react'
import { useTrackEvent, type EventType } from '@/lib/use-track-event'

interface TrackPageViewProps {
  eventType: EventType
  contentType?: string
  contentId?: string
  metadata?: Record<string, unknown>
}

/**
 * ドロップイン式のページビュー追跡コンポーネント
 * サーバーコンポーネントのページに配置するだけでイベントを記録する。
 * UIには何も表示しない。
 *
 * 使い方:
 * ```tsx
 * <TrackPageView eventType="article_read" contentType="article" contentId={article.id} />
 * ```
 */
export default function TrackPageView({ eventType, contentType, contentId, metadata }: TrackPageViewProps) {
  const trackEvent = useTrackEvent()

  useEffect(() => {
    trackEvent({ eventType, contentType, contentId, metadata })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventType, contentType, contentId])

  return null
}
