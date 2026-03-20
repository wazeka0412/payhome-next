'use client';

import { useState, useEffect } from 'react';

type Lead = {
  id: string
  name: string
  email: string
  source: string
  area: string
  budget: string
  status: string
  date: string
  tel: string
  builder?: string
  type?: string
  summary?: string
  score: number
}

const statusFilters = ['すべて', '新規', '対応中', '紹介済', '面談済', '成約', '失注'] as const;

const statusColors: Record<string, string> = {
  '新規': 'bg-blue-100 text-blue-700',
  '対応中': 'bg-yellow-100 text-yellow-700',
  '紹介済': 'bg-orange-100 text-orange-700',
  '面談済': 'bg-purple-100 text-purple-700',
  '成約': 'bg-green-100 text-green-700',
  '失注': 'bg-gray-100 text-gray-500',
};

export default function LeadsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('すべて');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.json())
      .then(data => setLeads(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, []);

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

  const filtered = (() => {
    let result = activeFilter === 'すべて' ? leads : leads.filter((l) => l.status === activeFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.area.toLowerCase().includes(q) ||
        (l.builder || '').toLowerCase().includes(q)
      );
    }
    return result;
  })();

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">リード管理</h1>
        <input
          type="text"
          placeholder="名前・メール・エリア・工務店で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] w-64"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer ${
              activeFilter === filter
                ? 'bg-[#E8740C] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#E8740C] hover:text-[#E8740C]'
            }`}
          >
            {filter}
            <span className="ml-1 text-xs opacity-70">
              ({filter === 'すべて' ? leads.length : leads.filter(l => l.status === filter).length})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 text-gray-500 font-medium w-8"></th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">名前</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">メール</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">流入元</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">希望エリア</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">予算</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">ステータス</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">日付</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <>
                  <tr
                    key={lead.id}
                    onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                    className="border-b border-gray-50 hover:bg-orange-50/50 cursor-pointer transition"
                  >
                    <td className="py-3 px-4 text-gray-400">
                      <span className={`inline-block transition-transform ${expandedId === lead.id ? 'rotate-90' : ''}`}>&#9654;</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{lead.name}</td>
                    <td className="py-3 px-4 text-gray-600">{lead.email}</td>
                    <td className="py-3 px-4 text-gray-600">{lead.source}</td>
                    <td className="py-3 px-4 text-gray-600">{lead.area}</td>
                    <td className="py-3 px-4 text-gray-600">{lead.budget}</td>
                    <td className="py-3 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => { e.stopPropagation(); handleStatusUpdate(lead.id, e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[lead.status] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {['新規', '対応中', '紹介済', '面談済', '成約', '失注'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{lead.date}</td>
                  </tr>
                  {expandedId === lead.id && (
                    <tr key={`${lead.id}-detail`} className="bg-orange-50/30">
                      <td colSpan={8} className="px-8 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400 text-xs block">電話番号</span>
                            <span className="text-gray-800 font-medium">{lead.tel || '未登録'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs block">種別</span>
                            <span className="text-gray-800 font-medium">{lead.type || '未分類'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs block">担当工務店</span>
                            <span className="text-gray-800 font-medium">{lead.builder || '未割当'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs block">スコア</span>
                            <span className="text-gray-800 font-medium">{lead.score}点</span>
                          </div>
                          {lead.summary && (
                            <div className="col-span-2 md:col-span-4">
                              <span className="text-gray-400 text-xs block">メモ・概要</span>
                              <span className="text-gray-800">{lead.summary}</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
