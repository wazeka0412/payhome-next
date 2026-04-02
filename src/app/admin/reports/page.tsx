'use client'

import { useState, useEffect } from 'react'

interface PlatformMetrics {
  visitors: { total: number; unique: number; byDevice: Record<string, number>; bySource: Record<string, number> }
  content: { propertyViews: number; articleReads: number; videoViews: number; topProperties: { id: string; title: string; views: number }[] }
  engagement: { favoritesAdded: number; comparisonsCreated: number; simulatorUses: number; lineClicks: number; telClicks: number }
  chat: { sessionsStarted: number; sessionsCompleted: number; completionRate: number; toLeadConversions: number }
  leads: { total: number; byType: Record<string, number>; byStatus: Record<string, number>; conversionRate: number }
  monthOverMonth: { visitorsChange: number; leadsChange: number; chatChange: number }
}

interface BuilderReport {
  id: string
  builderId: string
  metrics: {
    builderName: string
    propertyViews: number
    leads: { total: number; byType: Record<string, number> }
    chatMentions: number
    favoritesCount: number
    monthOverMonth: { viewsChange: number; leadsChange: number }
  }
}

interface ReportData {
  id: string
  reportMonth: string
  metrics: PlatformMetrics
  generatedAt: string
}

function formatChange(val: number): string {
  if (val === 0) return '±0%'
  const sign = val > 0 ? '+' : ''
  return `${sign}${Math.round(val * 100)}%`
}

function ChangeIndicator({ value }: { value: number }) {
  if (value === 0) return <span className="text-gray-400 text-sm">±0%</span>
  return (
    <span className={`text-sm font-medium ${value > 0 ? 'text-green-600' : 'text-red-500'}`}>
      {value > 0 ? '↑' : '↓'} {formatChange(value)}
    </span>
  )
}

export default function MonthlyReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [report, setReport] = useState<ReportData | null>(null)
  const [builderReports, setBuilderReports] = useState<BuilderReport[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  const fetchReports = () => {
    setLoading(true)
    setError('')
    Promise.all([
      fetch(`/api/reports/monthly?month=${selectedMonth}`).then(r => r.json()),
      fetch(`/api/reports/monthly/builder?month=${selectedMonth}`).then(r => r.json()),
    ])
      .then(([platformData, builderData]) => {
        if (Array.isArray(platformData) && platformData.length > 0) {
          setReport(platformData[0])
        } else {
          setReport(null)
        }
        setBuilderReports(Array.isArray(builderData) ? builderData : [])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchReports() }, [selectedMonth])

  const handleGenerate = async () => {
    setGenerating(true)
    setError('')
    try {
      const res = await fetch(`/api/reports/monthly/generate?month=${selectedMonth}`, { method: 'POST' })
      if (!res.ok) throw new Error('レポート生成に失敗しました')
      fetchReports()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setGenerating(false)
    }
  }

  // Generate month options (past 12 months)
  const monthOptions: string[] = []
  for (let i = 0; i < 12; i++) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    monthOptions.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  const m = report?.metrics

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📈 月次レポート</h1>
          <p className="text-gray-500 mt-1">データ収集基盤の月次統計を確認できます</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30"
          >
            {monthOptions.map(mo => (
              <option key={mo} value={mo}>{mo.replace('-', '年')}月</option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-[#E8740C] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#D06800] disabled:opacity-50 transition"
          >
            {generating ? '生成中...' : 'レポート生成'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-6 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">読み込み中...</div>
      ) : !report ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">
            {selectedMonth.replace('-', '年')}月のレポートはまだ生成されていません
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-[#E8740C] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#D06800] disabled:opacity-50 transition"
          >
            {generating ? '生成中...' : 'レポートを生成する'}
          </button>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'ユニーク訪問者', value: m!.visitors.unique.toLocaleString(), change: m!.monthOverMonth.visitorsChange, icon: '👥' },
              { label: '総リード数', value: `${m!.leads.total}件`, change: m!.monthOverMonth.leadsChange, icon: '📋' },
              { label: 'チャットセッション', value: `${m!.chat.sessionsStarted}件`, change: m!.monthOverMonth.chatChange, icon: '💬' },
              { label: 'リード転換率', value: `${(m!.leads.conversionRate * 100).toFixed(1)}%`, change: 0, icon: '🎯' },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{card.icon}</span>
                  <ChangeIndicator value={card.change} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500 mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Content Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">コンテンツパフォーマンス</h2>
              <div className="space-y-3">
                {[
                  { label: '物件閲覧', value: m!.content.propertyViews, max: Math.max(m!.content.propertyViews, m!.content.articleReads, m!.content.videoViews, 1) },
                  { label: '記事閲覧', value: m!.content.articleReads, max: Math.max(m!.content.propertyViews, m!.content.articleReads, m!.content.videoViews, 1) },
                  { label: '動画視聴', value: m!.content.videoViews, max: Math.max(m!.content.propertyViews, m!.content.articleReads, m!.content.videoViews, 1) },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-medium">{item.value.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-[#E8740C] h-2 rounded-full transition-all"
                        style={{ width: `${(item.value / item.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat & Engagement */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">チャット & エンゲージメント</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'チャット完了率', value: `${Math.round(m!.chat.completionRate * 100)}%` },
                  { label: 'チャット→リード', value: `${m!.chat.toLeadConversions}件` },
                  { label: 'お気に入り登録', value: `${m!.engagement.favoritesAdded}件` },
                  { label: 'シミュレーター利用', value: `${m!.engagement.simulatorUses}回` },
                  { label: 'LINE クリック', value: `${m!.engagement.lineClicks}回` },
                  { label: '電話クリック', value: `${m!.engagement.telClicks}回` },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-lg font-bold text-gray-900">{item.value}</p>
                    <p className="text-xs text-gray-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leads by Type */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">リード内訳（タイプ別）</h2>
              <div className="space-y-2">
                {Object.entries(m!.leads.byType).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-700">{type}</span>
                    <span className="bg-[#E8740C]/10 text-[#E8740C] px-3 py-1 rounded-full text-sm font-medium">{count}件</span>
                  </div>
                ))}
                {Object.keys(m!.leads.byType).length === 0 && (
                  <p className="text-gray-400 text-sm">データなし</p>
                )}
              </div>
            </div>

            {/* Device & Source */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">デバイス & 流入元</h2>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">デバイス別</p>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(m!.visitors.byDevice).map(([device, count]) => (
                    <span key={device} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      {device}: {count.toLocaleString()}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">流入元別</p>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(m!.visitors.bySource).map(([source, count]) => (
                    <span key={source} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      {source}: {count.toLocaleString()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Properties */}
          {m!.content.topProperties.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">人気物件 TOP5</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-500">順位</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-500">物件ID</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500">閲覧数</th>
                  </tr>
                </thead>
                <tbody>
                  {m!.content.topProperties.map((prop, i) => (
                    <tr key={prop.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 text-sm font-bold text-[#E8740C]">{i + 1}</td>
                      <td className="py-3 text-sm text-gray-700">{prop.title}</td>
                      <td className="py-3 text-sm text-right font-medium">{prop.views.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Builder Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">工務店別レポート</h2>
            {builderReports.length === 0 ? (
              <p className="text-gray-400 text-sm">工務店別レポートはまだ生成されていません</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-500">工務店名</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500">物件閲覧</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500">リード数</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500">閲覧前月比</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500">リード前月比</th>
                  </tr>
                </thead>
                <tbody>
                  {builderReports.map(br => (
                    <tr key={br.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 text-sm font-medium text-gray-900">{br.metrics.builderName}</td>
                      <td className="py-3 text-sm text-right">{br.metrics.propertyViews.toLocaleString()}</td>
                      <td className="py-3 text-sm text-right">{br.metrics.leads.total}</td>
                      <td className="py-3 text-right"><ChangeIndicator value={br.metrics.monthOverMonth.viewsChange} /></td>
                      <td className="py-3 text-right"><ChangeIndicator value={br.metrics.monthOverMonth.leadsChange} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Generation Info */}
          <p className="text-xs text-gray-400 mt-4 text-right">
            最終生成: {new Date(report.generatedAt).toLocaleString('ja-JP')}
          </p>
        </>
      )}
    </div>
  )
}
