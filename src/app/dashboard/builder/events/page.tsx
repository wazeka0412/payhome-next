'use client'

import { useState, useEffect } from 'react'

type Event = {
  id: string
  title: string
  date: string
  location: string
  reservations: number
  capacity?: number
  attendance?: number
  status: 'upcoming' | 'past'
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', date: '', location: '', capacity: '' })
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ title: '', date: '', location: '' })

  useEffect(() => {
    fetch('/api/events?builder=万代ホーム')
      .then(r => r.json())
      .then(data => setEvents(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleCreateEvent = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          date: formData.date,
          location: formData.location,
          capacity: Number(formData.capacity) || 10,
          reservations: 0,
          status: 'upcoming',
          builder: '万代ホーム',
        }),
      })
      if (res.ok) {
        const newEvent = await res.json()
        setEvents(prev => [newEvent, ...prev])
        setShowForm(false)
        setFormData({ title: '', date: '', location: '', capacity: '' })
        setSuccessMessage('イベントを登録しました')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (err) {
      console.error('Event creation failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveEdit = (eventId: string) => {
    setEvents(prev => prev.map(e =>
      e.id === eventId
        ? { ...e, title: editData.title || e.title, date: editData.date || e.date, location: editData.location || e.location }
        : e
    ))
    setEditId(null)
    setSuccessMessage('イベントを更新しました')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const startEdit = (ev: Event) => {
    setEditId(ev.id)
    setEditData({ title: ev.title, date: ev.date, location: ev.location })
    setExpandedId(null)
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

  const upcoming = events.filter(e => e.status === 'upcoming')
  const past = events.filter(e => e.status === 'past')

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">見学会管理</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-[#E8740C] text-white text-sm font-bold hover:bg-[#D4660A] transition cursor-pointer"
        >
          イベントを登録
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-sm text-green-700 font-medium">
          <span className="text-green-500">&#10003;</span>
          {successMessage}
        </div>
      )}

      {/* Create Event Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-900">新規イベント登録</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="イベント名"
              value={formData.title}
              onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="日時（例: 2026/05/10 (土) 10:00〜17:00）"
              value={formData.date}
              onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="場所"
              value={formData.location}
              onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="定員"
              value={formData.capacity}
              onChange={e => setFormData(p => ({ ...p, capacity: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateEvent}
              disabled={submitting || !formData.title}
              className="px-4 py-2 rounded-lg bg-[#E8740C] text-white text-sm font-bold hover:bg-[#D4660A] transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? '登録中...' : '登録する'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition cursor-pointer"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* Upcoming */}
      <h2 className="text-sm font-bold text-gray-700 mb-3">開催予定</h2>
      <div className="space-y-3 mb-8">
        {upcoming.length === 0 && (
          <p className="text-sm text-gray-400 py-4 text-center">予定されているイベントはありません</p>
        )}
        {upcoming.map((ev) => (
          <div key={ev.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {editId === ev.id ? (
              /* Edit inline form */
              <div className="p-5 space-y-3">
                <h3 className="text-sm font-bold text-gray-900">イベント編集</h3>
                <input type="text" value={editData.title} onChange={e => setEditData(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="イベント名" />
                <input type="text" value={editData.date} onChange={e => setEditData(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="日時" />
                <input type="text" value={editData.location} onChange={e => setEditData(p => ({ ...p, location: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="場所" />
                <div className="flex gap-2">
                  <button onClick={() => handleSaveEdit(ev.id)} className="px-4 py-2 rounded-lg bg-[#E8740C] text-white text-sm font-bold hover:bg-[#D4660A] transition cursor-pointer">保存</button>
                  <button onClick={() => setEditId(null)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition cursor-pointer">キャンセル</button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-gray-900 mb-1">{ev.title}</p>
                      <p className="text-sm text-gray-500">{ev.date}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{ev.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#E8740C]">{ev.reservations}<span className="text-sm font-normal text-gray-400">/{ev.capacity}</span></p>
                      <p className="text-xs text-gray-400">予約</p>
                    </div>
                  </div>
                  {ev.capacity && (
                    <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-[#E8740C] h-2 rounded-full" style={{ width: `${(ev.reservations / ev.capacity) * 100}%` }} />
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setExpandedId(expandedId === ev.id ? null : ev.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#E8740C] text-white font-bold hover:bg-[#D4660A] transition cursor-pointer"
                    >
                      {expandedId === ev.id ? '閉じる' : '詳細を見る'}
                    </button>
                    <button
                      onClick={() => startEdit(ev)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                    >
                      編集
                    </button>
                  </div>
                </div>
                {expandedId === ev.id && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-orange-50/20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-400 text-xs block">予約数</span>
                        <span className="text-gray-800 font-bold">{ev.reservations}件</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs block">定員</span>
                        <span className="text-gray-800 font-bold">{ev.capacity || '未設定'}名</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs block">予約率</span>
                        <span className="text-gray-800 font-bold">{ev.capacity ? Math.round((ev.reservations / ev.capacity) * 100) : 0}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs block">残り枠</span>
                        <span className="text-gray-800 font-bold">{ev.capacity ? ev.capacity - ev.reservations : '?'}名</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Past */}
      <h2 className="text-sm font-bold text-gray-700 mb-3">過去のイベント</h2>
      <div className="space-y-3">
        {past.map((ev) => (
          <div key={ev.id} className="bg-white rounded-xl border border-gray-100 p-5 opacity-80">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-700 mb-1">{ev.title}</p>
                <p className="text-sm text-gray-500">{ev.date}</p>
                <p className="text-xs text-gray-400 mt-0.5">{ev.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">予約 <span className="font-bold">{ev.reservations}件</span></p>
                {ev.attendance !== undefined && (
                  <>
                    <p className="text-sm text-gray-600">参加 <span className="font-bold">{ev.attendance}名</span></p>
                    <p className="text-xs text-gray-400 mt-1">参加率 {Math.round((ev.attendance / ev.reservations) * 100)}%</p>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
