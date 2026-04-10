'use client'

import { useState } from 'react'
import Link from 'next/link'

/**
 * 上部の細い告知バー（v4.0）
 * 内容: ぺいほーむ住宅ポータルサイト開設記念キャンペーン
 *      AI家づくり診断 → 会員登録 で
 *      施工事例集・間取り図集デジタルカタログをプレゼント
 */
export default function CampaignBar() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-gradient-to-r from-[#3D2200] via-[#8B4513] to-[#3D2200] text-white text-center relative">
      <Link
        href="/diagnosis"
        className="block py-2 px-8 text-xs md:text-sm font-bold hover:opacity-90 transition"
      >
        ぺいほーむ住宅ポータルサイト開設記念｜AI診断＋会員登録でデジタルカタログ無料プレゼント →
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
