'use client'

import { useState, useEffect } from 'react'

type Lead = {
  id: string
  date: string
  type?: string
  status: string
  builder?: string
  summary?: string
}

const STATUS_STYLES: Record<string, string> = {
  '新規': 'bg-yellow-100 text-yellow-700',
  '対応中': 'bg-blue-100 text-blue-700',
  '紹介済': 'bg-purple-100 text-purple-700',
  '面談済': 'bg-green-100 text-green-700',
  '成約': 'bg-green-100 text-green-700',
}

function statusToTimeline(status: string) {
  const steps = ['相談申込', 'ヒアリング完了', '工務店紹介', '面談']
  const statusOrder: Record<string, number> = {
    '新規': 1,
    '対応中': 2,
    '紹介済': 3,
    '面談済': 4,
    '成約': 4,
  }
  const completedCount = statusOrder[status] || 0
  return steps.map((label, i) => ({
    label,
    done: i < completedCount,
  }))
}

export default function ConsultationsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // In production, filter by logged-in user's email
    fetch('/api/leads?email=tanaka@example.com')
      .then(r => r.json())
      .then(data => setLeads(data))
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
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-gray-900">相談履歴（{leads.length}件）</h1>

      {leads.length === 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center text-gray-400">
          相談履歴はありません
        </div>
      )}

      {leads.map(c => {
        const timeline = statusToTimeline(c.status)
        const displayStatus = c.status === '対応中' ? 'ヒアリング済' : c.status === '面談済' ? '面談完了' : c.status
        return (
          <div key={c.id} className="bg-white rounded-2xl p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[c.status] || 'bg-gray-100 text-gray-500'}`}>
                    {displayStatus}
                  </span>
                  <span className="text-xs text-gray-400">{c.date}</span>
                </div>
                <h3 className="font-bold text-gray-900">{c.type || '相談'}</h3>
              </div>
              {c.builder && (
                <div className="text-right">
                  <div className="text-xs text-gray-400">担当工務店</div>
                  <div className="text-sm font-medium text-gray-700">{c.builder}</div>
                </div>
              )}
            </div>

            {/* Summary */}
            {c.summary && (
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 mb-4">{c.summary}</p>
            )}

            {/* Timeline */}
            <div className="flex items-center gap-0">
              {timeline.map((step, i) => (
                <div key={i} className="flex-1 flex flex-col items-center relative">
                  {/* Connector line */}
                  {i < timeline.length - 1 && (
                    <div className={`absolute top-3 left-1/2 w-full h-0.5 ${step.done ? 'bg-[#E8740C]' : 'bg-gray-200'}`} />
                  )}
                  {/* Dot */}
                  <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.done ? 'bg-[#E8740C] text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step.done ? '✓' : i + 1}
                  </div>
                  <div className={`text-[10px] mt-1 text-center ${step.done ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
