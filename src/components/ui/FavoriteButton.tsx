'use client'

import { useState, useEffect } from 'react'
import { getOrCreateAnonymousId } from '@/lib/anonymous-id'
import { useTrackEvent } from '@/lib/use-track-event'

interface FavoriteButtonProps {
  contentType: 'property' | 'builder' | 'article' | 'event'
  contentId: string
  className?: string
}

export default function FavoriteButton({ contentType, contentId, className = '' }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const trackEvent = useTrackEvent()

  useEffect(() => {
    const anonymousId = getOrCreateAnonymousId()
    fetch(`/api/favorites?anonymous_id=${anonymousId}&content_type=${contentType}`)
      .then(res => res.json())
      .then((favorites: Array<{ content_id: string }>) => {
        setIsFavorited(favorites.some(f => f.content_id === contentId))
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [contentType, contentId])

  const toggle = async () => {
    const anonymousId = getOrCreateAnonymousId()
    const newState = !isFavorited
    setIsFavorited(newState) // 楽観的更新

    try {
      if (newState) {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ anonymous_id: anonymousId, content_type: contentType, content_id: contentId }),
        })
        trackEvent({ eventType: 'favorite_add', contentType, contentId })
      } else {
        await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ anonymous_id: anonymousId, content_type: contentType, content_id: contentId }),
        })
        trackEvent({ eventType: 'favorite_remove', contentType, contentId })
      }
    } catch {
      setIsFavorited(!newState) // ロールバック
    }
  }

  if (isLoading) {
    return (
      <button className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-gray-300 ${className}`} disabled>
        <HeartIcon filled={false} />
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all cursor-pointer ${
        isFavorited
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      } ${className}`}
      aria-label={isFavorited ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      <HeartIcon filled={isFavorited} />
      <span>{isFavorited ? 'お気に入り済み' : 'お気に入り'}</span>
    </button>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
