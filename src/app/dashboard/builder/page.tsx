'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCurrentBuilder } from '@/lib/use-current-builder'

type KpiCard = { label: string; value: string; change: string; up: boolean }
type Lead = { id: string; name: string; area: string; budget: string; score: number; createdAt: string }
type BuilderStats = {
  kpiCards: KpiCard[]
  costPerLead: number
  industryAverage: number
  monthlyData?: { months: string[]; values: number[] }
}

const kpiLinks: Record<string, string> = {
  '今月の資料請求': '/dashboard/builder/leads',
  '成約': '/dashboard/builder/leads',
  '無料相談': '/dashboard/builder/leads',
  '見学会予約': '/dashboard/builder/events',
}

function timeAgo(dateStr: string) {
  if (!dateStr) return ''
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffH = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffH < 1) return 'たった今'
  if (diffH < 24) return `${diffH}時間前`
  return `${Math.floor(diffH / 24)}日前`
}

function scoreIcon(score: number) {
  if (score >= 70) return '\u{1F525}'
  if (score >= 40) return '\u26A1'
  return '\u{1F4A7}'
}

export default function BuilderDashboard() {
  const builder = useCurrentBuilder()
  const [stats, setStats] = useState<BuilderStats | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!builder.name) return
    const q = encodeURIComponent(builder.name)
    Promise.all([
      fetch(`/api/stats?builder=${q}`).then(r => r.json()).catch(() => null),
      fetch(`/api/leads?builder=${q}`).then(r => r.json()).catch(() => []),
    ])
      .then(([statsData, leadsData]) => {
        setStats(statsData)
        setLeads(Array.isArray(leadsData) ? leadsData.slice(0, 5) : [])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [builder.name])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-[#E8740C] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 rounded-xl p-6 text-center">
        <p className="font-medium">データの取得に失敗しました</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    )
  }

  const bd = builder.data
  const completeness = (() => {
    if (!bd) return 0
    const fields = [bd.name, bd.description, bd.area, bd.phone, bd.website, bd.priceBand, bd.specialties?.length, bd.strengths?.length]
    const filled = fields.filter((v) => v && (typeof v !== 'number' ? true : v > 0)).length
    return Math.round((filled / fields.length) * 100)
  })()

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-xs text-gray-500 mt-1">{builder.name}（ID: {builder.id}）</p>
        </div>
      </div>

      {/* プロフィール完成度 */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-bold text-gray-900">掲載情報の完成度</p>
            <p className="text-xs text-gray-500 mt-0.5">情報を充実させるとAI診断のレコメンド順位が上がります</p>
          </div>
          <Link href="/dashboard/builder/profile" className="text-xs text-[#E8740C] font-bold hover:underline">編集 →</Link>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E8740C] to-[#F5A623] transition-all"
            style={{ width: `${completeness}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{completeness}% 完成</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats?.kpiCards?.map((k) => {
          const href = kpiLinks[k.label] || '/dashboard/builder/leads'
          return (
            <Link
              key={k.label}
              href={href}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:border-[#E8740C] hover:shadow-md transition group"
            >
              <p className="text-xs text-gray-500 mb-1 group-hover:text-[#E8740C] transition">{k.label}</p>
              <p className="text-2xl font-bold text-gray-900">{k.value}</p>
              <p className={`text-xs mt-1 ${k.up ? 'text-green-500' : 'text-gray-400'}`}>{k.change || '—'} 先月比</p>
            </Link>
          )
        })}
      </div>

      {/* Cost per lead */}
      {stats?.costPerLead !== undefined && (
        <div className="bg-[#FFF8F0] rounded-xl border border-[#E8740C]/20 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">反響単価</p>
              <p className="text-2xl font-bold text-[#E8740C]">
                &yen;{stats.costPerLead?.toLocaleString()}
                <span className="text-sm font-normal text-gray-500">/件</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">業界平均</p>
              <p className="text-lg text-gray-400 line-through">&yen;{stats.industryAverage?.toLocaleString()}/件</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* 新着リード */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">新着リード</h2>
            <Link href="/dashboard/builder/leads" className="text-xs text-[#E8740C] font-bold hover:underline">すべて見る →</Link>
          </div>
          <div className="space-y-3">
            {leads.length === 0 && <p className="text-xs text-gray-400">リードはまだありません</p>}
            {leads.map((l) => (
              <Link
                key={l.id}
                href="/dashboard/builder/leads"
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-orange-50/50 -mx-2 px-2 rounded-lg transition block"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{l.name}</p>
                  <p className="text-xs text-gray-500">
                    {l.area || '—'} / {l.budget || '—'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    {scoreIcon(l.score)}
                    {l.score}
                  </span>
                  <span className="text-xs text-gray-400">{timeAgo(l.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* コンテンツ管理ショートカット */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">コンテンツ管理</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: '/dashboard/builder/case-studies', label: '施工事例', icon: '🖼' },
              { href: '/dashboard/builder/sale-homes', label: '建売物件', icon: '🏡' },
              { href: '/dashboard/builder/lands', label: '土地情報', icon: '🗺' },
              { href: '/dashboard/builder/videos', label: 'ルームツアー', icon: '🎬' },
              { href: '/dashboard/builder/reviews', label: 'お客様の声', icon: '⭐' },
              { href: '/dashboard/builder/questions', label: 'AI質問', icon: '💬' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 hover:border-[#E8740C] hover:bg-orange-50/50 transition"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-semibold text-gray-700">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Match Insight */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 p-5">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🎯</div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-gray-900 mb-1">Smart Match 連携</h2>
            <p className="text-xs text-gray-600 mb-3">
              ユーザーが事前に設定した連絡希望（時間・頻度・手段）と見学会モード（体感 / 相談 / 契約検討）がリード詳細に表示されます。
              ユーザーの意向に合わせた対応で成約率UP。
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard/builder/leads"
                className="inline-block bg-white border border-[#E8740C] text-[#E8740C] text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#E8740C] hover:text-white transition"
              >
                リード一覧へ →
              </Link>
              <Link
                href="/dashboard/builder/questions"
                className="inline-block bg-white border border-[#E8740C] text-[#E8740C] text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#E8740C] hover:text-white transition"
              >
                匿名AI質問に回答 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
