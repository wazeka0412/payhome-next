'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CampaignSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-1">
          <div className="bg-white rounded-[22px] p-6 md:p-8">
            {/* ヘッダー */}
            <div className="text-center mb-6">
              <div className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                4/30まで
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
                🎉 春の住宅キャンペーン
              </h3>
              <p className="text-sm text-gray-500">
                家づくりを始める方を応援！
                <span className="text-red-500 font-bold text-base md:text-lg"> 総額105,000円</span>
                プレゼント
              </p>
            </div>

            {/* 3つの特典 */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* 特典① */}
              <div className="relative bg-gradient-to-b from-orange-50 to-white border-2 border-orange-200 rounded-2xl p-5 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8740C] text-white text-xs font-bold px-3 py-1 rounded-full">
                  特典①
                </div>
                <div className="mt-2 mb-3">
                  <span className="text-2xl md:text-3xl font-extrabold text-[#E8740C]">1,000</span>
                  <span className="text-sm font-bold text-[#E8740C]">円分</span>
                </div>
                <p className="text-xs text-gray-600 font-semibold mb-2">PayPayポイント進呈</p>
                <p className="text-xs text-gray-400">無料相談をするだけ！</p>
                <Link
                  href="/consultation"
                  className="mt-3 block w-full bg-[#E8740C] text-white text-xs font-bold py-2.5 rounded-full hover:bg-[#D4660A] transition"
                >
                  無料相談する →
                </Link>
              </div>

              {/* 特典② */}
              <div className="relative bg-gradient-to-b from-orange-50 to-white border-2 border-orange-200 rounded-2xl p-5 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8740C] text-white text-xs font-bold px-3 py-1 rounded-full">
                  特典②
                </div>
                <div className="mt-2 mb-3">
                  <span className="text-2xl md:text-3xl font-extrabold text-[#E8740C]">4,000</span>
                  <span className="text-sm font-bold text-[#E8740C]">円分</span>
                </div>
                <p className="text-xs text-gray-600 font-semibold mb-2">PayPayポイント進呈</p>
                <p className="text-xs text-gray-400">見学会に参加するだけ！</p>
                <Link
                  href="/event"
                  className="mt-3 block w-full bg-[#E8740C] text-white text-xs font-bold py-2.5 rounded-full hover:bg-[#D4660A] transition"
                >
                  見学会を予約する →
                </Link>
              </div>

              {/* 特典③ */}
              <div className="relative bg-gradient-to-b from-yellow-50 to-white border-2 border-yellow-400 rounded-2xl p-5 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  特典③
                </div>
                <div className="mt-2 mb-3">
                  <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">100,000</span>
                  <span className="text-sm font-bold text-orange-500">円分</span>
                </div>
                <p className="text-xs text-gray-600 font-semibold mb-2">ギフトカード or 現金</p>
                <p className="text-xs text-gray-400">ぺいほーむ経由で契約！</p>
                <Link
                  href="/consultation"
                  className="mt-3 block w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold py-2.5 rounded-full hover:from-yellow-600 hover:to-orange-600 transition"
                >
                  詳しく見る →
                </Link>
              </div>
            </div>

            {/* 注意事項（トグル） */}
            <div className="text-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition"
              >
                {isOpen ? '▲ 注意事項を閉じる' : '▼ 注意事項を見る'}
              </button>
              {isOpen && (
                <div className="mt-3 text-left bg-gray-50 rounded-xl p-4">
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>※ キャンペーン期間：2026年4月1日〜4月30日</li>
                    <li>※ 特典①：無料相談完了後、1週間以内にPayPayギフトカードを送付</li>
                    <li>※ 特典②：見学会参加後、1週間以内にPayPayギフトカードを送付</li>
                    <li>※ 特典③：ぺいほーむ経由で住宅契約が成立した場合に適用。契約確認後30日以内に送付</li>
                    <li>※ 各特典は初回利用の方に限ります</li>
                    <li>※ 特典の内容は予告なく変更される場合があります</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
