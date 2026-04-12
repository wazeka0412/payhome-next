'use client'

import { useState } from 'react'
import Link from 'next/link'

/**
 * ぺいほーむ 会員登録セクション (MVP v2 - 2026-05-01 リリース版)
 *
 * 方針転換 (2026-04-12):
 *   旧: カタログ無料プレゼントを主訴求
 *   新: 家づくりの意思決定が進むことを主訴求 (カタログは補助特典)
 *
 * 主訴求:
 *   - AI診断結果の保存と何度でも見返し
 *   - お気に入り工務店の整理と比較
 *   - 平屋事例ライブラリの全件閲覧
 *   - 間取り図フル解像度の閲覧
 *   - 連絡希望条件の設定 (Smart Match)
 *
 * 補助特典 (折りたたみ):
 *   - デジタルカタログ 2冊 (開設記念)
 */
export default function CampaignSection() {
  const [showBonus, setShowBonus] = useState(false)

  return (
    <section className="py-10 md:py-14 bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF3E6]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E8740C]/20 shadow-xl">
          {/* バッジ */}
          <div className="absolute top-0 left-0 z-10">
            <div className="bg-[#E8740C] text-white text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-br-2xl tracking-wider">
              MEMBER REGISTRATION
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-0">
            {/* ── 左：主訴求 = 家づくりが進む ── */}
            <div className="p-8 md:p-10 lg:p-12">
              <p className="text-[10px] md:text-xs font-bold tracking-widest text-[#E8740C] mb-3">
                無料会員登録
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-[2rem] font-extrabold text-[#3D2200] leading-tight mb-4">
                会員登録で、
                <br />
                あなたの<span className="text-[#E8740C]">家づくり</span>が
                <br />
                一気に進みます。
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                ぺいほーむは「平屋づくりの意思決定プラットフォーム」です。
                会員登録すると、<span className="font-bold text-[#3D2200]">診断結果の保存・工務店の比較・お気に入りの整理</span>まで、
                迷わず家づくりを進められます。
              </p>

              {/* 会員主価値 5 項目 */}
              <div className="space-y-2.5 mb-6">
                <Benefit icon="🎯" title="AI診断結果を保存し、何度でも見返し" />
                <Benefit icon="❤️" title="気になる工務店をお気に入りで整理・比較" />
                <Benefit icon="🏠" title="平屋事例ライブラリを全件閲覧" />
                <Benefit icon="📐" title="間取り図のフル解像度表示" />
                <Benefit icon="💬" title="連絡希望条件を事前設定 (Smart Match)" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/signup?redirect=/welcome"
                  className="flex-1 text-center bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold px-6 py-3.5 rounded-full text-sm transition shadow-[0_4px_12px_rgba(232,116,12,0.3)]"
                >
                  無料会員登録する →
                </Link>
                <Link
                  href="/diagnosis"
                  className="flex-1 text-center border-2 border-[#E8740C] text-[#E8740C] font-bold px-6 py-3 rounded-full text-sm transition hover:bg-[#FFF8F0]"
                >
                  まずAI診断を受ける
                </Link>
              </div>
            </div>

            {/* ── 右：登録後のフロー ── */}
            <div className="bg-gradient-to-br from-[#FFF8F0] via-[#FFF3E6] to-[#FFECD4] p-8 md:p-10 lg:p-12 flex flex-col justify-center">
              <p className="text-[10px] font-bold tracking-widest text-[#E8740C] mb-4 text-center">
                登録後のステップ
              </p>

              <StepCard
                num={1}
                title="AI家づくり診断 (約3分)"
                desc="15問で、あなたの家づくりタイプと相性の良い工務店3社を提案"
              />
              <StepCard
                num={2}
                title="工務店を比較・お気に入り登録"
                desc="動画・事例・間取りで納得できる工務店を整理"
              />
              <StepCard
                num={3}
                title="見学会予約 or 無料相談"
                desc="準備が整ったタイミングで、自分のペースで次へ"
              />

              <p className="text-center text-[10px] text-gray-400 mt-2">
                ※ 会員登録は無料・約1分で完了します
              </p>
            </div>
          </div>

          {/* ── 補助特典: デジタルカタログ (折りたたみ) ── */}
          <div className="border-t border-gray-100 px-8 py-4 text-center bg-gray-50/50">
            <button
              onClick={() => setShowBonus(!showBonus)}
              className="text-[11px] text-[#E8740C] font-bold hover:underline cursor-pointer transition"
            >
              {showBonus ? '▲ 開設記念特典を閉じる' : '▼ 開設記念特典も進呈中 (デジタルカタログ2冊)'}
            </button>
            {showBonus && (
              <div className="mt-3 text-left bg-white border border-[#E8740C]/20 rounded-xl p-4">
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  ポータルサイト開設記念として、AI診断を完了した会員様に以下のデジタルカタログを進呈:
                </p>
                <ul className="text-xs text-[#3D2200] space-y-1.5 font-semibold">
                  <li>・ぺいほーむ厳選 施工事例集 30邸 (累計1,000万再生から選定)</li>
                  <li>・平屋間取り図集 30プラン (17坪〜50坪まで網羅)</li>
                </ul>
                <p className="mt-3 text-[10px] text-gray-400">
                  ※ デジタル版 (PDF) をマイページから即時ダウンロード・会員1名につき1回まで
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Benefit({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-base shrink-0" aria-hidden>
        {icon}
      </span>
      <p className="text-sm text-[#3D2200] font-semibold leading-snug">{title}</p>
    </div>
  )
}

function StepCard({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-[#E8740C] text-white rounded-full flex-shrink-0 flex items-center justify-center text-sm font-extrabold">
          {num}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-[#3D2200] mb-0.5 leading-snug">
            {title}
          </h3>
          <p className="text-[11px] text-gray-500 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  )
}
