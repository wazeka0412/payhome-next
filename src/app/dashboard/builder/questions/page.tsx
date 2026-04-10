'use client'

import { useEffect, useState } from 'react'
import { getBuilderById } from '@/lib/builders-data'

/**
 * 工務店ダッシュボード：匿名質問への回答ページ（Smart Match Phase 1.5）
 *
 * 会員様から匿名で送られてきた質問を一覧表示し、工務店側が
 * 回答を入力する画面。連絡先は開示されず、回答はぺいほーむ経由で
 * 会員様のマイページに届く。
 */

interface Question {
  id: string
  builder_id: string
  question: string
  category: 'pricing' | 'design' | 'quality' | 'process' | 'other'
  status: 'pending' | 'answered' | 'resolved'
  answer: string | null
  answered_at: string | null
  created_at: string
}

const CATEGORY_LABELS: Record<Question['category'], string> = {
  pricing: '価格・予算',
  design: 'デザイン・間取り',
  quality: '性能・品質',
  process: '家づくりの進め方',
  other: 'その他',
}

const STATUS_LABELS: Record<Question['status'], { label: string; color: string }> = {
  pending: { label: '未回答', color: 'bg-orange-100 text-orange-700' },
  answered: { label: '回答済み', color: 'bg-green-100 text-green-700' },
  resolved: { label: '解決済み', color: 'bg-gray-100 text-gray-500' },
}

// MVP: demo builder hard-coded (same pattern as /dashboard/builder/leads)
const DEMO_BUILDER_ID = 'b01'

export default function BuilderQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [tab, setTab] = useState<'all' | Question['status']>('pending')

  const builder = getBuilderById(DEMO_BUILDER_ID)

  useEffect(() => {
    fetch(`/api/builders/questions?builder_id=${DEMO_BUILDER_ID}`)
      .then((r) => r.json())
      .then((res) => setQuestions(res.questions || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleAnswer = async (questionId: string) => {
    const answer = answerInputs[questionId]?.trim()
    if (!answer) return
    setSaving(questionId)
    try {
      const res = await fetch(`/api/builders/questions/${questionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer }),
      })
      if (!res.ok) throw new Error('save failed')
      const data = await res.json()
      setQuestions((prev) => prev.map((q) => (q.id === questionId ? data.question : q)))
      setAnswerInputs((prev) => ({ ...prev, [questionId]: '' }))
      setExpandedId(null)
    } catch (err) {
      console.error(err)
      alert('回答の送信に失敗しました')
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-[#E8740C] border-t-transparent rounded-full" />
      </div>
    )
  }

  const filtered = tab === 'all' ? questions : questions.filter((q) => q.status === tab)
  const counts = {
    all: questions.length,
    pending: questions.filter((q) => q.status === 'pending').length,
    answered: questions.filter((q) => q.status === 'answered').length,
    resolved: questions.filter((q) => q.status === 'resolved').length,
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">匿名質問への回答</h1>
          <p className="text-xs text-gray-500 mt-1">
            {builder?.name} 宛に届いた匿名質問に回答すると、ぺいほーむ経由でお客様のマイページに届きます
          </p>
        </div>
        <span className="text-sm text-gray-500">{filtered.length}件</span>
      </div>

      {/* Smart Match 説明バナー */}
      <div className="bg-[#FFF8F0] border border-[#E8740C]/30 rounded-2xl p-4 mb-6">
        <p className="text-[10px] font-bold tracking-widest text-[#E8740C] mb-1">
          SMART MATCH｜AI 仲介質問
        </p>
        <p className="text-xs text-[#3D2200] leading-relaxed">
          お客様は連絡先を開示せずに質問を送ることができます。丁寧な回答で信頼関係を築いていただくと、
          お客様が「この工務店と直接話したい」と判断したタイミングで連絡先が開示されます。
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(['all', 'pending', 'answered', 'resolved'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
              tab === t
                ? 'bg-[#E8740C] text-white font-bold'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t === 'all' ? 'すべて' : STATUS_LABELS[t].label}
            <span className="ml-1 text-xs opacity-70">({counts[t]})</span>
          </button>
        ))}
      </div>

      {/* Question cards */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <p className="text-gray-500">
            {tab === 'pending' ? '未回答の質問はありません' : '該当する質問はありません'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => {
            const status = STATUS_LABELS[q.status]
            const isExpanded = expandedId === q.id
            const showAnswerForm = q.status === 'pending' || isExpanded
            return (
              <div
                key={q.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-xs bg-[#FFF8F0] text-[#E8740C] px-2 py-0.5 rounded-full font-semibold">
                        {CATEGORY_LABELS[q.category]}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(q.created_at).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <p className="text-xs text-gray-500 mb-1 font-bold">お客様からのご質問</p>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{q.question}</p>
                  </div>

                  {q.answer && (
                    <div className="bg-[#FFF8F0] border border-[#E8740C]/20 rounded-lg p-4 mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-[#E8740C] font-bold">あなたの回答</p>
                        {q.answered_at && (
                          <p className="text-[10px] text-gray-400">
                            {new Date(q.answered_at).toLocaleString('ja-JP')}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-[#3D2200] whitespace-pre-wrap">{q.answer}</p>
                    </div>
                  )}

                  {showAnswerForm && (
                    <div>
                      {q.status !== 'pending' && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : q.id)}
                          className="text-xs text-[#E8740C] font-bold mb-2 hover:underline"
                        >
                          {isExpanded ? '閉じる' : '再回答する'}
                        </button>
                      )}
                      {(q.status === 'pending' || isExpanded) && (
                        <div className="space-y-2">
                          <textarea
                            value={answerInputs[q.id] || ''}
                            onChange={(e) =>
                              setAnswerInputs((prev) => ({ ...prev, [q.id]: e.target.value }))
                            }
                            placeholder="お客様への回答を入力..."
                            rows={5}
                            maxLength={3000}
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] resize-y"
                          />
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] text-gray-400">
                              {(answerInputs[q.id] || '').length} / 3000
                            </p>
                            <button
                              onClick={() => handleAnswer(q.id)}
                              disabled={saving === q.id || !(answerInputs[q.id]?.trim())}
                              className="bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold px-5 py-2 rounded-full text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {saving === q.id ? '送信中...' : '回答を送信'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
