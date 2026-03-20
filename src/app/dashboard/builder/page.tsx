'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type KpiCard = { label: string; value: string; change: string; up: boolean }
type Lead = { id: string; name: string; area: string; budget: string; score: number; date: string }
type BuilderStats = {
  kpiCards: KpiCard[]
  costPerLead: number
  industryAverage: number
  monthlyData: { months: string[]; values: number[] }
}

const kpiLinks: Record<string, string> = {
  '今月の反響': '/dashboard/builder/leads',
  '成約数': '/dashboard/builder/leads',
  '見学会予約': '/dashboard/builder/events',
  '掲載スコア': '/dashboard/builder/profile',
}

function timeAgo(dateStr: string) {
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
  const [stats, setStats] = useState<BuilderStats | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/stats?builder=万代ホーム').then(r => r.json()),
      fetch('/api/leads?builder=万代ホーム').then(r => r.json()),
    ])
      .then(([statsData, leadsData]) => {
        setStats(statsData)
        setLeads(leadsData.slice(0, 3))
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

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

  const monthlyData = stats?.monthlyData
  const maxVal = monthlyData ? Math.max(...monthlyData.values) : 1

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-6">ダッシュボード</h1>

      {/* KPI Cards - Clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats?.kpiCards.map(k => {
          const href = kpiLinks[k.label] || '/dashboard/builder/leads';
          return (
            <Link key={k.label} href={href} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-[#E8740C] hover:shadow-md transition group">
              <p className="text-xs text-gray-500 mb-1 group-hover:text-[#E8740C] transition">{k.label}</p>
              <p className="text-2xl font-bold text-gray-900">{k.value}</p>
              <p className={`text-xs mt-1 ${k.up ? 'text-green-500' : 'text-gray-400'}`}>{k.change} 先月比</p>
            </Link>
          )
        })}
      </div>

      {/* Cost per lead */}
      <div className="bg-[#FFF8F0] rounded-xl border border-[#E8740C]/20 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">反響単価</p>
            <p className="text-2xl font-bold text-[#E8740C]">&yen;{stats?.costPerLead?.toLocaleString()}<span className="text-sm font-normal text-gray-500">/件</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">業界平均</p>
            <p className="text-lg text-gray-400 line-through">&yen;{stats?.industryAverage?.toLocaleString()}/件</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent leads - Clickable */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">新着リード</h2>
            <Link href="/dashboard/builder/leads" className="text-xs text-[#E8740C] font-bold hover:underline">すべて見る →</Link>
          </div>
          <div className="space-y-3">
            {leads.map(l => (
              <Link key={l.id} href="/dashboard/builder/leads" className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-orange-50/50 -mx-2 px-2 rounded-lg transition block">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{l.name}</p>
                  <p className="text-xs text-gray-500">{l.area} / {l.budget}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{scoreIcon(l.score)}{l.score}</span>
                  <span className="text-xs text-gray-400">{timeAgo(l.date)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Monthly chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">月間反響推移</h2>
          <div className="flex items-end justify-between h-40 px-2">
            {monthlyData?.values.map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-xs text-gray-600 font-semibold">{v}</span>
                <div className="w-8 rounded-t-md bg-[#E8740C]" style={{ height: `${(v / maxVal) * 100}%`, opacity: i === monthlyData.values.length - 1 ? 1 : 0.5 }} />
                <span className="text-[10px] text-gray-400">{monthlyData.months[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
