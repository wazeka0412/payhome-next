'use client'

import { useState } from 'react'
import Link from 'next/link'

/**
 * ぺいほーむ住宅ポータルサイト開設記念キャンペーン（v4.0）
 *
 * 流れ：AI家づくり診断 → 会員登録 → デジタルカタログ無料プレゼント
 *
 * デジタルカタログの中身：
 *  - ぺいほーむ厳選 施工事例集（ルームツアー累計1,000万再生から厳選した30事例）
 *  - 平屋間取り図集（17坪〜50坪まで30プラン）
 *
 * 旧: 春の住宅キャンペーン（PayPay総額10万円） → 廃止
 */
export default function CampaignSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="py-10 md:py-14 bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF3E6]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E8740C]/20 shadow-xl">
          {/* バッジ */}
          <div className="absolute top-0 left-0 z-10">
            <div className="bg-[#E8740C] text-white text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-br-2xl tracking-wider">
              OPENING CAMPAIGN
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-0">
            {/* ── 左：訴求コンテンツ ── */}
            <div className="p-8 md:p-10 lg:p-12">
              <p className="text-[10px] md:text-xs font-bold tracking-widest text-[#E8740C] mb-3">
                ぺいほーむ住宅ポータルサイト開設記念
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-[2rem] font-extrabold text-[#3D2200] leading-tight mb-4">
                AI診断と会員登録で
                <br />
                <span className="text-[#E8740C]">デジタルカタログ</span>を
                <br />
                無料プレゼント
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                YouTube累計1,000万再生のぺいほーむが厳選した
                <br className="hidden md:block" />
                <span className="font-bold text-[#3D2200]">施工事例集 30邸</span>
                ＆
                <span className="font-bold text-[#3D2200]">平屋間取り図集 30プラン</span>
                を、
                <br className="hidden md:block" />
                AI家づくり診断と会員登録で全員にお渡しします。
              </p>

              {/* ステップ（クリック可能） */}
              <div className="space-y-3 mb-6">
                <StepLink
                  num={1}
                  href="/diagnosis"
                  title="AI家づくり診断（約2分）"
                  desc="10問の質問に答えるだけ"
                  cta="診断をはじめる →"
                />
                <StepLink
                  num={2}
                  href="/signup?redirect=/catalog"
                  title="無料会員登録"
                  desc="メール / Google で登録"
                  cta="登録する →"
                />
                <StepLink
                  num={3}
                  href="/catalog"
                  title="デジタルカタログを受け取る"
                  desc="会員登録後すぐに閲覧いただけます"
                  cta="カタログ一覧へ →"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/diagnosis"
                  className="flex-1 text-center bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold px-6 py-3.5 rounded-full text-sm transition shadow-[0_4px_12px_rgba(232,116,12,0.3)]"
                >
                  ① AI診断からはじめる
                </Link>
              </div>
            </div>

            {/* ── 右：プレゼント内容のビジュアル ── */}
            <div className="bg-gradient-to-br from-[#FFF8F0] via-[#FFF3E6] to-[#FFECD4] p-8 md:p-10 lg:p-12 flex flex-col justify-center">
              <p className="text-[10px] font-bold tracking-widest text-[#E8740C] mb-4 text-center">
                プレゼント内容
              </p>

              {/* カタログ① */}
              <div className="bg-white rounded-2xl p-5 mb-3 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-16 bg-gradient-to-br from-[#3D2200] to-[#8B4513] rounded-md flex-shrink-0 flex items-center justify-center text-white text-[8px] font-bold tracking-wider text-center leading-tight">
                    施工<br/>事例<br/>集
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#E8740C] font-bold mb-1">CATALOG 01</p>
                    <h3 className="text-sm font-bold text-[#3D2200] mb-1">
                      ぺいほーむ厳選 施工事例集
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      累計1,000万再生から厳選した
                      <br />
                      九州の名作平屋 30邸を収録
                    </p>
                  </div>
                </div>
              </div>

              {/* カタログ② */}
              <div className="bg-white rounded-2xl p-5 mb-3 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-16 bg-gradient-to-br from-[#E8740C] to-[#F5A623] rounded-md flex-shrink-0 flex items-center justify-center text-white text-[8px] font-bold tracking-wider text-center leading-tight">
                    間取<br/>図<br/>集
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#E8740C] font-bold mb-1">CATALOG 02</p>
                    <h3 className="text-sm font-bold text-[#3D2200] mb-1">
                      平屋間取り図集 30プラン
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      17坪のコンパクト平屋から
                      <br />
                      50坪の大型平屋まで網羅
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-center text-[10px] text-gray-400 mt-2">
                ※ デジタル版（PDF）をマイページから即時ダウンロード
              </p>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="border-t border-gray-100 px-8 py-4 text-center bg-gray-50/50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer transition"
            >
              {isOpen ? '▲ 注意事項を閉じる' : '▼ 注意事項を見る'}
            </button>
            {isOpen && (
              <div className="mt-3 text-left bg-white border border-gray-100 rounded-xl p-4">
                <ul className="text-[11px] text-gray-500 space-y-1">
                  <li>※ ぺいほーむ住宅ポータルサイト開設記念キャンペーンとして実施しています</li>
                  <li>※ デジタルカタログ受け取りには、AI家づくり診断（10問・約2分）の完了および無料会員登録が必要です</li>
                  <li>※ カタログはマイページからPDF形式でダウンロードできます（A4換算で約60ページ）</li>
                  <li>※ 会員1名につき1回までのお渡しとなります</li>
                  <li>※ 内容は予告なく更新・改訂される場合があります</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function StepLink({
  num,
  href,
  title,
  desc,
  cta,
}: {
  num: number
  href: string
  title: string
  desc: string
  cta: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 -mx-2 px-2 py-1.5 rounded-lg hover:bg-[#FFF8F0] transition"
    >
      <div className="w-8 h-8 bg-[#FFF8F0] border-2 border-[#E8740C] text-[#E8740C] rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0">
        {num}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#3D2200] group-hover:text-[#E8740C] transition">
          {title}
        </p>
        <p className="text-[11px] text-gray-500">{desc}</p>
      </div>
      <span className="text-[10px] font-bold text-[#E8740C] opacity-0 group-hover:opacity-100 transition shrink-0 hidden sm:inline">
        {cta}
      </span>
    </Link>
  )
}
