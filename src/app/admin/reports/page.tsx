'use client'

import { useState, useEffect, useCallback } from 'react'
import type { PlatformMetrics, BuilderMetrics } from '@/types'

interface ReportRow {
  id: string
  reportMonth: string
  reportType: 'platform' | 'builder'
  builderId?: string
  metrics: PlatformMetrics | BuilderMetrics
  generatedAt: string
}

function KpiCard({ label, value, change }: { label: string; value: string | number; change?: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {change !== undefined && (
        <div className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '+' : ''}{change}% 前月比
        </div>
      )}
    </div>
  )
}

export default function AdminReportsPage() {
  const now = new Date()
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const [month, setMonth] = useState(defaultMonth)
  const [platform, setPlatform] = useState<PlatformMetrics | null>(null)
  const [builderReports, setBuilderReports] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/reports/monthly?month=${month}`)
      const data: ReportRow[] = await res.json()

      const pf = data.find((r) => r.reportType === 'platform')
      if (pf) setPlatform(pf.metrics as PlatformMetrics)
      else setPlatform(null)

      setBuilderReports(data.filter((r) => r.reportType === 'builder'))
    } catch (err) {
      console.error('Failed to fetch reports:', err)
    } finally {
      setLoading(false)
    }
  }, [month])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/reports/monthly/generate?month=${month}`, { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        await fetchReports()
      } else {
        alert('レポート生成に失敗しました: ' + (data.error || 'unknown error'))
      }
    } catch (err) {
      console.error('Failed to generate:', err)
      alert('レポート生成に失敗しました')
    } finally {
      setGenerating(false)
    }
  }

  // 月選択オプション (過去12ヶ月)
  const monthOptions: string[] = []
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthOptions.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">月次レポート</h1>
          <p className="text-sm text-gray-500 mt-1">プラットフォーム全体 + 工務店別の月次統計</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>{m.replace('-', '年') + '月'}</option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-[#E8740C] hover:bg-[#d06a0a] text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {generating ? '生成中...' : 'レポート生成'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">読み込み中...</div>
      ) : !platform ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">📈</div>
          <div className="text-lg font-medium text-gray-700 mb-2">{month.replace('-', '年') + '月'}のレポートがありません</div>
          <p className="text-sm text-gray-500 mb-6">「レポート生成」ボタンをクリックして、集計データを作成してください。</p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-[#E8740C] hover:bg-[#d06a0a] text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {generating ? '生成中...' : 'レポート生成'}
          </button>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard
              label="ユニーク訪問者数"
              value={platform.visitors.unique.toLocaleString()}
              change={platform.monthOverMonth.visitorsChange}
            />
            <KpiCard
              label="リード数"
              value={platform.leads.total}
              change={platform.monthOverMonth.leadsChange}
            />
            <KpiCard
              label="チャットセッション数"
              value={platform.chat.sessionsStarted}
              change={platform.monthOverMonth.chatChange}
            />
            <KpiCard
              label="リード転換率"
              value={`${platform.leads.conversionRate}%`}
            />
          </div>

          {/* Detail panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Engagement */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">エンゲージメント</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">物件閲覧数</span><span className="font-medium">{platform.content.propertyViews}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">動画視聴数</span><span className="font-medium">{platform.content.videoViews}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">お気に入り追加数</span><span className="font-medium">{platform.engagement.favoritesAdded}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">LINE クリック</span><span className="font-medium">{platform.engagement.lineClicks}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">電話クリック</span><span className="font-medium">{platform.engagement.telClicks}</span></div>
              </div>
            </div>

            {/* Chat */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">AI チャット</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">セッション開始</span><span className="font-medium">{platform.chat.sessionsStarted}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">完了 (5メッセージ以上)</span><span className="font-medium">{platform.chat.sessionsCompleted}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">完了率</span><span className="font-medium">{platform.chat.completionRate}%</span></div>
                <div className="flex justify-between"><span className="text-gray-500">リード転換数</span><span className="font-medium">{platform.chat.toLeadConversions}</span></div>
              </div>
            </div>
          </div>

          {/* Leads by type */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">リード種別</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(platform.leads.byType).map(([type, count]) => (
                <div key={type} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500 mt-1">{type}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Builder reports table */}
          {builderReports.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">工務店別レポート</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">工務店名</th>
                      <th className="text-right px-6 py-3 text-gray-500 font-medium">閲覧数</th>
                      <th className="text-right px-6 py-3 text-gray-500 font-medium">リード数</th>
                      <th className="text-right px-6 py-3 text-gray-500 font-medium">チャット言及</th>
                      <th className="text-right px-6 py-3 text-gray-500 font-medium">お気に入り</th>
                      <th className="text-right px-6 py-3 text-gray-500 font-medium">閲覧前月比</th>
                      <th className="text-right px-6 py-3 text-gray-500 font-medium">リード前月比</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {builderReports.map((r) => {
                      const m = r.metrics as BuilderMetrics
                      return (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 font-medium text-gray-900">{m.builderName}</td>
                          <td className="px-6 py-3 text-right">{m.propertyViews}</td>
                          <td className="px-6 py-3 text-right">{m.leads.total}</td>
                          <td className="px-6 py-3 text-right">{m.chatMentions}</td>
                          <td className="px-6 py-3 text-right">{m.favoritesCount}</td>
                          <td className={`px-6 py-3 text-right ${m.monthOverMonth.viewsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {m.monthOverMonth.viewsChange >= 0 ? '+' : ''}{m.monthOverMonth.viewsChange}%
                          </td>
                          <td className={`px-6 py-3 text-right ${m.monthOverMonth.leadsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {m.monthOverMonth.leadsChange >= 0 ? '+' : ''}{m.monthOverMonth.leadsChange}%
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
