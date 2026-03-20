'use client'

import { useEffect, useRef, useState } from 'react'

interface MobileMarqueeProps {
  children: React.ReactNode[]
  className?: string
  desktopGridClass?: string
}

export default function MobileMarquee({ children, className = '', desktopGridClass = 'grid md:grid-cols-3 gap-6' }: MobileMarqueeProps) {
  const [isMobile, setIsMobile] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!isMobile || !trackRef.current) return

    const track = trackRef.current
    const handleTouchStart = () => { track.classList.add('paused') }
    const handleTouchEnd = () => {
      setTimeout(() => track.classList.remove('paused'), 1000)
    }

    track.addEventListener('touchstart', handleTouchStart, { passive: true })
    track.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      track.removeEventListener('touchstart', handleTouchStart)
      track.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isMobile])

  if (!isMobile) {
    return <div className={`${desktopGridClass} ${className}`}>{children}</div>
  }

  // モバイル: カードを複製してシームレスループ
  return (
    <div className="pei-marquee">
      <div className="pei-marquee__track" ref={trackRef}>
        {children.map((child, i) => (
          <div key={`original-${i}`} className="marquee-card">{child}</div>
        ))}
        {/* 複製（シームレスループ用） */}
        {children.map((child, i) => (
          <div key={`clone-${i}`} className="marquee-card" aria-hidden="true">{child}</div>
        ))}
      </div>
    </div>
  )
}
