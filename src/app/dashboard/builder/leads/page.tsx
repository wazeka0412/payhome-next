'use client'

import { useState, useEffect } from 'react'
import {
  CONTACT_FREQUENCY_LABELS,
  CONTACT_CHANNEL_LABELS,
  CONTACT_TIMESLOT_LABELS,
  CONTACT_PURPOSE_LABELS,
  CONSIDERATION_PHASE_LABELS,
  type ContactPreferences,
} from '@/lib/contact-preferences'
import { VIEWING_MODE_INFO, type ViewingMode } from '@/lib/event-viewing-mode'

const TABS = ['すべて', '新規', '対応中', '紹介済', '成約', '失注'] as const

type Lead = {
  id: string
  name: string
  area: string
  budget: string
  source: string
  score: number
  status: string
  date: string
  email: string
  tel: string
  type?: string
  summary?: string
  contactPreferences?: ContactPreferences | null
  viewingMode?: ViewingMode | null
}

function scoreBadge(score: number) {
  if (score >= 70) return { icon: '\u{1F525}', color: 'bg-red-50 text-red-600' }
  if (score >= 40) return { icon: '\u26A1', color: 'bg-yellow-50 text-yellow-600' }
  return { icon: '\u{1F4A7}', color: 'bg-blue-50 text-blue-600' }
}

function statusColor(status: string) {
  const map: Record<string, string> = {
    '新規': 'bg-green-100 text-green-700',
    '対応中': 'bg-blue-100 text-blue-700',
    '紹介済': 'bg-purple-100 text-purple-700',
    '成約': 'bg-[#FFF8F0] text-[#E8740C]',
    '失注': 'bg-gray-100 text-gray-500',
  }
  return map[status] || 'bg-gray-100 text-gray-500'
}

export default function LeadsPage() {
  const [tab, setTab] = useState<string>('すべて')
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [memos, setMemos] = useState<Record<string, string[]>>({})
  const [memoInput, setMemoInput] = useState<Record<string, string>>({})
  const [showMemoInput, setShowMemoInput] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/leads?builder=万代ホーム')
      .then(r => r.json())
      .then(data => setLeads(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
      }
    } catch (err) {
      console.error('Status update failed:', err)
    }
  }

  const addMemo = (leadId: string) => {
    const text = memoInput[leadId]?.trim()
    if (!text) return
    setMemos(prev => ({
      ...prev,
      [leadId]: [...(prev[leadId] || []), text],
    }))
    setMemoInput(prev => ({ ...prev, [leadId]: '' }))
    setShowMemoInput(null)
  }

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

  const filtered = tab === 'すべて' ? leads : leads.filter(l => l.status === tab)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">リード管理</h1>
        <span className="text-sm text-gray-500">{filtered.length}件</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition cursor-pointer ${
              tab === t ? 'bg-[#E8740C] text-white font-bold' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {t}
            <span className="ml-1 text-xs opacity-70">
              ({t === 'すべて' ? leads.length : leads.filter(l => l.status === t).length})
            </span>
          </button>
        ))}
      </div>

      {/* Lead cards */}
      <div className="space-y-3">
        {filtered.map((lead) => {
          const badge = scoreBadge(lead.score)
          const isExpanded = expandedId === lead.id
          const leadMemos = memos[lead.id] || []
          return (
            <div key={lead.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Card header - clickable to expand */}
              <div
                className="p-4 cursor-pointer hover:bg-orange-50/30 transition"
                onClick={() => setExpandedId(isExpanded ? null : lead.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900">{lead.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(lead.status)}`}>{lead.status}</span>
                      <span className={`inline-block transition-transform text-gray-400 text-xs ${isExpanded ? 'rotate-90' : ''}`}>&#9654;</span>
                    </div>
                    <p className="text-xs text-gray-500">{lead.area} / 予算 {lead.budget} / {lead.source}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${badge.color}`}>{badge.icon}{lead.score}</span>
                    <span className="text-xs text-gray-400">{lead.date}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400 space-x-3">
                    <span>{lead.email}</span>
                    <span>{lead.tel}</span>
                  </div>
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    {lead.status === '新規' && (
                      <button
                        onClick={() => handleStatusUpdate(lead.id, '対応中')}
                        className="text-xs px-3 py-1.5 rounded-lg bg-[#E8740C] text-white font-bold hover:bg-[#D4660A] transition cursor-pointer"
                      >
                        対応する
                      </button>
                    )}
                    {lead.status === '対応中' && (
                      <button
                        onClick={() => handleStatusUpdate(lead.id, '紹介済')}
                        className="text-xs px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 transition cursor-pointer"
                      >
                        紹介済にする
                      </button>
                    )}
                    <button
                      onClick={() => setShowMemoInput(showMemoInput === lead.id ? null : lead.id)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                    >
                      メモ追加
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-gray-100 px-4 py-4 bg-orange-50/20 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs block">メール</span>
                      <a href={`mailto:${lead.email}`} className="text-[#E8740C] font-medium hover:underline">{lead.email}</a>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">電話</span>
                      <a href={`tel:${lead.tel}`} className="text-[#E8740C] font-medium hover:underline">{lead.tel}</a>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">予算</span>
                      <span className="text-gray-800 font-medium">{lead.budget}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">種別</span>
                      <span className="text-gray-800 font-medium">{lead.type || '未分類'}</span>
                    </div>
                  </div>

                  {/* ─── Smart Match: user's preferences and mode ─── */}
                  {(lead.contactPreferences || lead.viewingMode) && (
                    <div className="border-2 border-[#E8740C] bg-[#FFF8F0] rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 bg-[#E8740C] rounded-full flex-shrink-0 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold tracking-widest text-[#E8740C] mb-0.5">
                            SMART MATCH｜お客様の希望
                          </p>
                          <p className="text-sm font-bold text-[#3D2200]">
                            お客様との相性の良いコミュニケーション設計
                          </p>
                          <p className="text-[11px] text-gray-600 leading-relaxed mt-1">
                            お客様が事前にお知らせくださった情報です。最適なタイミング・手段でご対応いただくことで、より質の高い商談をご提供いただけます。
                          </p>
                        </div>
                      </div>

                      {/* 見学会モード */}
                      {lead.viewingMode && (
                        <div className="bg-white rounded-lg p-3 mb-3 border border-[#E8740C]/20">
                          <div className="flex items-start gap-3">
                            <div
                              className="text-2xl flex-shrink-0"
                              aria-hidden="true"
                            >
                              {VIEWING_MODE_INFO[lead.viewingMode].icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold text-gray-500 mb-0.5">見学会当日の目的</p>
                              <p className="text-sm font-bold text-[#3D2200]">
                                {VIEWING_MODE_INFO[lead.viewingMode].label}
                              </p>
                              <p className="text-[11px] text-gray-600 mt-1">
                                {VIEWING_MODE_INFO[lead.viewingMode].description}
                              </p>
                              <p className="text-[11px] text-[#E8740C] mt-2 font-medium">
                                おすすめ対応：{VIEWING_MODE_INFO[lead.viewingMode].builderNote}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 連絡の相性 */}
                      {lead.contactPreferences && (
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-[10px] font-bold text-gray-500 mb-2">連絡の相性設定</p>
                          <dl className="space-y-2 text-xs">
                            <div className="flex gap-3">
                              <dt className="font-bold text-[#E8740C] w-24 flex-shrink-0">検討フェーズ</dt>
                              <dd className="text-gray-800 font-medium">
                                {CONSIDERATION_PHASE_LABELS[lead.contactPreferences.consideration_phase].label}
                                <span className="text-gray-500 ml-2">
                                  ({CONSIDERATION_PHASE_LABELS[lead.contactPreferences.consideration_phase].description})
                                </span>
                              </dd>
                            </div>
                            <div className="flex gap-3">
                              <dt className="font-bold text-[#E8740C] w-24 flex-shrink-0">ご希望の頻度</dt>
                              <dd className="text-gray-800 font-medium">
                                {CONTACT_FREQUENCY_LABELS[lead.contactPreferences.frequency]}
                              </dd>
                            </div>
                            <div className="flex gap-3">
                              <dt className="font-bold text-[#E8740C] w-24 flex-shrink-0">ご希望の手段</dt>
                              <dd className="text-gray-800 font-medium">
                                {lead.contactPreferences.channels
                                  .map((c) => CONTACT_CHANNEL_LABELS[c])
                                  .join(' / ')}
                              </dd>
                            </div>
                            <div className="flex gap-3">
                              <dt className="font-bold text-[#E8740C] w-24 flex-shrink-0">ご都合の良い時間</dt>
                              <dd className="text-gray-800 font-medium">
                                {lead.contactPreferences.timeslots
                                  .map((t) => CONTACT_TIMESLOT_LABELS[t])
                                  .join(' / ')}
                              </dd>
                            </div>
                            <div className="flex gap-3">
                              <dt className="font-bold text-[#E8740C] w-24 flex-shrink-0">連絡目的</dt>
                              <dd className="text-gray-800 font-medium">
                                {CONTACT_PURPOSE_LABELS[lead.contactPreferences.purpose]}
                              </dd>
                            </div>
                            {lead.contactPreferences.memo && (
                              <div className="flex gap-3 pt-2 border-t border-gray-100">
                                <dt className="font-bold text-[#E8740C] w-24 flex-shrink-0">お客様メモ</dt>
                                <dd className="text-gray-800 italic">「{lead.contactPreferences.memo}」</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      )}
                    </div>
                  )}

                  {lead.summary && (
                    <div>
                      <span className="text-gray-400 text-xs block mb-1">概要</span>
                      <p className="text-sm text-gray-700 bg-white rounded-lg p-3">{lead.summary}</p>
                    </div>
                  )}

                  {/* Memos */}
                  {leadMemos.length > 0 && (
                    <div>
                      <span className="text-gray-400 text-xs block mb-1">メモ</span>
                      <div className="space-y-1">
                        {leadMemos.map((memo, i) => (
                          <div key={i} className="text-sm text-gray-700 bg-yellow-50 rounded-lg p-2 flex items-start gap-2">
                            <span className="text-yellow-500 text-xs mt-0.5">&#9679;</span>
                            {memo}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Memo input inline */}
                  {showMemoInput === lead.id && (
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        placeholder="メモを入力..."
                        value={memoInput[lead.id] || ''}
                        onChange={e => setMemoInput(prev => ({ ...prev, [lead.id]: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter') addMemo(lead.id) }}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#E8740C]"
                        autoFocus
                      />
                      <button
                        onClick={() => addMemo(lead.id)}
                        className="px-4 py-2 bg-[#E8740C] text-white text-xs font-bold rounded-lg hover:bg-[#D4660A] transition cursor-pointer"
                      >
                        追加
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
