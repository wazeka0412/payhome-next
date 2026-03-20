'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CampaignBar() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white text-center relative">
      <Link
        href="/consultation"
        className="block py-2 px-8 text-xs md:text-sm font-bold hover:opacity-90 transition"
      >
        🎉 春の住宅キャンペーン実施中！総額105,000円プレゼント →
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); setDismissed(true) }}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/70 hover:text-white text-xs cursor-pointer"
        aria-label="閉じる"
      >
        ✕
      </button>
    </div>
  )
}
