'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type KpiCard = { label: string; value: string; change: string; up: boolean }
type Lead = { id: string; name: string; source: string; status: string; date: string }
type StatsData = {
  kpiCards: KpiCard[]
  chatbot: { usageRate: number; cvRate: number; topQuestions: string[] }
}

const statusColors: Record<string, string> = {
  '新規': 'bg-blue-100 text-blue-700',
  '対応中': 'bg-yellow-100 text-yellow-700',
  '紹介済': 'bg-orange-100 text-orange-700',
  '面談済': 'bg-purple-100 text-purple-700',
  '成約': 'bg-green-100 text-green-700',
};

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then(r => r.json()).catch(() => null),
      fetch('/api/leads').then(r => r.json()).catch(() => []),
    ])
      .then(([statsData, leadsData]) => {
        setStats(statsData)
        setLeads(Array.isArray(leadsData) ? leadsData.slice(0, 5) : [])
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-sm text-gray-500 mt-1">{today}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.kpiCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
            <p className={`text-sm mt-2 ${card.up ? 'text-green-600' : 'text-red-600'}`}>
              {card.change} <span className="text-gray-400">前月比</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">月間推移</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="flex items-end justify-center gap-2 mb-3">
                {[40, 65, 50, 80, 60, 90, 75, 85, 70, 95, 88, 100].map((h, i) => (
                  <div
                    key={i}
                    className="w-6 bg-[#E8740C]/30 rounded-t"
                    style={{ height: `${h * 2}px` }}
                  />
                ))}
              </div>
              <p className="text-sm">チャートエリア（実装予定）</p>
            </div>
          </div>
        </div>

        {/* AI Chatbot Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AIチャットボット</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">利用率</p>
              <p className="text-2xl font-bold text-[#E8740C]">{stats?.chatbot.usageRate}%</p>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                <div className="bg-[#E8740C] h-2 rounded-full" style={{ width: `${stats?.chatbot.usageRate}%` }} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">CV転換率</p>
              <p className="text-2xl font-bold text-[#E8740C]">{stats?.chatbot.cvRate}%</p>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                <div className="bg-[#E8740C] h-2 rounded-full" style={{ width: `${stats?.chatbot.cvRate}%` }} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">よくある質問 TOP3</p>
              <ol className="text-sm text-gray-700 space-y-1.5">
                {stats?.chatbot.topQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#E8740C] font-bold">{i + 1}.</span>
                    {q}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">最近のリード</h2>
          <Link href="/admin/leads" className="text-sm text-[#E8740C] font-bold hover:underline">すべて見る →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">名前</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">流入元</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">ステータス</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">日付</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-50 hover:bg-orange-50/50 cursor-pointer transition" onClick={() => window.location.href = '/admin/leads'}>
                  <td className="py-3 px-4 font-medium text-gray-900">{lead.name}</td>
                  <td className="py-3 px-4 text-gray-600">{lead.source}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{lead.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
