'use client';

import { useState, useEffect } from 'react';

type Builder = {
  id: string
  name: string
  area: string
  plan: string
  leads: number
  contracts: number
  billing: string
  startDate: string
}

const planBadge: Record<string, string> = {
  'フリー': 'bg-gray-100 text-gray-600',
  'スタンダード': 'bg-blue-100 text-blue-700',
  'グロース': 'bg-orange-100 text-[#E8740C]',
  'プレミアム': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
};

const PLANS = ['フリー', 'スタンダード', 'グロース', 'プレミアム'];

export default function BuildersPage() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [planChangeId, setPlanChangeId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/builders')
      .then(r => r.json())
      .then(data => setBuilders(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, []);

  const handlePlanChange = (builderId: string, newPlan: string) => {
    setBuilders(prev => prev.map(b => b.id === builderId ? { ...b, plan: newPlan } : b));
    setPlanChangeId(null);
  };

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

  const planCounts = builders.reduce((acc, b) => {
    acc[b.plan] = (acc[b.plan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { label: '提携工務店', value: `${builders.length}社`, color: 'text-gray-900' },
    { label: 'フリープラン', value: `${planCounts['フリー'] || 0}社`, color: 'text-gray-500' },
    { label: 'グロース', value: `${planCounts['グロース'] || 0}社`, color: 'text-[#E8740C]' },
    { label: 'プレミアム', value: `${planCounts['プレミアム'] || 0}社`, color: 'text-purple-600' },
  ];

  const filtered = search
    ? builders.filter(b => b.name.includes(search) || b.area.includes(search))
    : builders;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">工務店管理</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="社名・エリアで検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] w-52"
          />
          <button className="px-4 py-2 bg-[#E8740C] text-white rounded-lg text-sm font-medium hover:bg-[#D4660A] transition cursor-pointer">
            新規登録
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 text-gray-500 font-medium w-8"></th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">社名</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">エリア</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">プラン</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">累計送客</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">成約数</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">月間請求額</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">契約開始日</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <>
                  <tr
                    key={b.id}
                    onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                    className="border-b border-gray-50 hover:bg-orange-50/50 cursor-pointer transition"
                  >
                    <td className="py-3 px-4 text-gray-400">
                      <span className={`inline-block transition-transform ${expandedId === b.id ? 'rotate-90' : ''}`}>&#9654;</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{b.name}</td>
                    <td className="py-3 px-4 text-gray-600">{b.area}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${planBadge[b.plan] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {b.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{b.leads}件</td>
                    <td className="py-3 px-4 text-gray-600">{b.contracts}件</td>
                    <td className="py-3 px-4 text-gray-600">{b.billing}</td>
                    <td className="py-3 px-4 text-gray-500">{b.startDate}</td>
                  </tr>
                  {expandedId === b.id && (
                    <tr key={`${b.id}-detail`} className="bg-orange-50/30">
                      <td colSpan={8} className="px-8 py-4">
                        <div className="flex items-center justify-between">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm flex-1">
                            <div>
                              <span className="text-gray-400 text-xs block">成約率</span>
                              <span className="text-gray-800 font-bold">{b.leads > 0 ? Math.round((b.contracts / b.leads) * 100) : 0}%</span>
                            </div>
                            <div>
                              <span className="text-gray-400 text-xs block">現在のプラン</span>
                              <span className="text-gray-800 font-bold">{b.plan}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 text-xs block">契約期間</span>
                              <span className="text-gray-800 font-medium">{b.startDate} 〜</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            {planChangeId === b.id ? (
                              <div className="flex gap-1">
                                {PLANS.map(p => (
                                  <button
                                    key={p}
                                    onClick={(e) => { e.stopPropagation(); handlePlanChange(b.id, p); }}
                                    className={`text-xs px-3 py-1.5 rounded-lg transition cursor-pointer ${
                                      b.plan === p
                                        ? 'bg-[#E8740C] text-white'
                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                    {p}
                                  </button>
                                ))}
                                <button
                                  onClick={(e) => { e.stopPropagation(); setPlanChangeId(null); }}
                                  className="text-xs px-2 py-1.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                  &#10005;
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => { e.stopPropagation(); setPlanChangeId(b.id); }}
                                className="text-xs px-3 py-1.5 rounded-lg border border-[#E8740C] text-[#E8740C] hover:bg-[#E8740C] hover:text-white transition cursor-pointer"
                              >
                                プラン変更
                              </button>
                            )}
                          </div>
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
