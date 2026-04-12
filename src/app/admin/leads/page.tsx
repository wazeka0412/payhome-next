'use client';

import { useState, useEffect, Fragment, useRef } from 'react';

type Lead = {
  id: string
  type: string
  name: string
  email: string
  phone: string
  company: string
  area: string
  budget: string
  layout: string
  message: string
  video: string
  builderName: string
  selectedCompanies: string[]
  selectedServices: string[]
  status: string
  score: number
  memo: string
  createdAt: string
  // Form-specific metadata
  buildArea: string
  postal: string
  address: string
  eventDate: string
  eventTitle: string
  participants: string
}

const statusFilters = ['すべて', '新規', '対応中', '紹介済', '面談済', '成約', '失注'] as const;
const typeLabels: Record<string, { label: string; color: string }> = {
  '無料相談': { label: '無料相談', color: 'bg-blue-100 text-blue-700' },
  '資料請求': { label: '資料請求', color: 'bg-green-100 text-green-700' },
  '見学会予約': { label: '見学会予約', color: 'bg-purple-100 text-purple-700' },
  '工務店相談': { label: '工務店相談', color: 'bg-orange-100 text-orange-700' },
  'B2Bお問い合わせ': { label: 'B2B', color: 'bg-gray-100 text-gray-700' },
  'パートナー申込': { label: 'パートナー', color: 'bg-yellow-100 text-yellow-700' },
  'セミナー申込': { label: 'セミナー', color: 'bg-indigo-100 text-indigo-700' },
};

const statusColors: Record<string, string> = {
  '新規': 'bg-blue-100 text-blue-700',
  '対応中': 'bg-yellow-100 text-yellow-700',
  '紹介済': 'bg-orange-100 text-orange-700',
  '面談済': 'bg-purple-100 text-purple-700',
  '成約': 'bg-green-100 text-green-700',
  '失注': 'bg-gray-100 text-gray-500',
};

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getTargetBuilder(lead: Lead): string {
  if (lead.builderName) return lead.builderName;
  if (lead.selectedCompanies.length > 0) return lead.selectedCompanies.join(', ');
  return '';
}

export default function LeadsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('すべて');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('すべて');

  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.json())
      .then(data => setLeads(Array.isArray(data) ? data : []))
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

  const handleMemoUpdate = async (leadId: string, memo: string) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memo }),
      })
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, memo } : l))
    } catch (err) {
      console.error('Memo update failed:', err)
    }
  }

  const filtered = (() => {
    let result = leads;
    if (activeFilter !== 'すべて') result = result.filter(l => l.status === activeFilter);
    if (typeFilter !== 'すべて') result = result.filter(l => l.type === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.area.toLowerCase().includes(q) ||
        l.builderName.toLowerCase().includes(q) ||
        l.selectedCompanies.some(c => c.toLowerCase().includes(q)) ||
        l.phone.includes(q)
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

  const uniqueTypes = ['すべて', ...Array.from(new Set(leads.map(l => l.type)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">リード管理</h1>
          <p className="text-sm text-gray-500 mt-1">全 {leads.length} 件のリード（表示中: {filtered.length} 件）</p>
        </div>
        <input
          type="text"
          placeholder="名前・メール・電話・エリア・工務店で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] w-72"
        />
      </div>

      {/* Status Filter Tabs */}
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

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-400 self-center mr-1">種別:</span>
        {uniqueTypes.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              typeFilter === t
                ? 'bg-[#3D2200] text-white'
                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-[#3D2200]'
            }`}
          >
            {t}
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
                <th className="text-left py-3 px-4 text-gray-500 font-medium">種別</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">対象工務店</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">ステータス</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">スコア</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">日時</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const typeMeta = typeLabels[lead.type] ?? { label: lead.type, color: 'bg-gray-100 text-gray-600' };
                const targetBuilder = getTargetBuilder(lead);

                return (
                  <Fragment key={lead.id}>
                    <tr
                      onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                      className="border-b border-gray-50 hover:bg-orange-50/50 cursor-pointer transition"
                    >
                      <td className="py-3 px-4 text-gray-400">
                        <span className={`inline-block transition-transform ${expandedId === lead.id ? 'rotate-90' : ''}`}>&#9654;</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{lead.name}</td>
                      <td className="py-3 px-4 text-gray-600 text-xs">{lead.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${typeMeta.color}`}>
                          {typeMeta.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs max-w-[160px] truncate" title={targetBuilder}>
                        {lead.type === '無料相談' ? <span className="text-gray-300">—</span> : (targetBuilder || <span className="text-gray-300">—</span>)}
                      </td>
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
                      <td className="py-3 px-4 text-gray-600 text-xs font-medium">{lead.score}点</td>
                      <td className="py-3 px-4 text-gray-400 text-xs whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                    </tr>

                    {/* Expanded Detail */}
                    {expandedId === lead.id && (
                      <tr className="bg-orange-50/30">
                        <td colSpan={8} className="px-6 py-5">
                          <div className="space-y-4">
                            {/* 基本情報 (common) */}
                            <div>
                              <h4 className="text-xs font-bold text-[#E8740C] uppercase tracking-wider mb-2">基本情報</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <DetailItem label="お名前" value={lead.name} />
                                <DetailItem label="メールアドレス" value={lead.email} />
                                <DetailItem label="電話番号" value={lead.phone} />
                                <DetailItem label="種別" value={lead.type} />
                                <DetailItem label="スコア">
                                  <ScoreBadge score={lead.score} />
                                </DetailItem>
                              </div>
                            </div>

                            {/* Type-specific detail sections */}
                            {lead.type === '無料相談' && (
                              <div>
                                <h4 className="text-xs font-bold text-[#E8740C] uppercase tracking-wider mb-2">相談内容</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <DetailItem label="お住まいのエリア" value={lead.area} />
                                  <DetailItem label="建築予定エリア" value={lead.buildArea} />
                                  <DetailItem label="ご予算" value={lead.budget} />
                                  <DetailItem label="希望の間取り" value={lead.layout} />
                                  <DetailItem label="気になった動画" value={lead.video} />
                                </div>
                                {lead.message && (
                                  <div className="mt-3">
                                    <span className="text-gray-400 text-xs block mb-1">ご相談内容</span>
                                    <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-100 whitespace-pre-wrap">{lead.message}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {lead.type === '資料請求' && (
                              <div>
                                <h4 className="text-xs font-bold text-[#E8740C] uppercase tracking-wider mb-2">送付先情報</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <DetailItem label="郵便番号" value={lead.postal} />
                                  <DetailItem label="ご住所" value={lead.address} />
                                </div>
                                {lead.selectedCompanies.length > 0 && (
                                  <div className="mt-3">
                                    <span className="text-gray-400 text-xs block mb-1">資料請求先の工務店</span>
                                    <div className="flex flex-wrap gap-2">
                                      {lead.selectedCompanies.map((c) => (
                                        <span key={c} className="inline-block bg-white border border-[#E8740C]/30 text-[#3D2200] text-xs font-medium px-3 py-1.5 rounded-full">
                                          {c}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {lead.type === '見学会予約' && (
                              <div>
                                <h4 className="text-xs font-bold text-[#E8740C] uppercase tracking-wider mb-2">予約内容</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <DetailItem label="イベント名" value={lead.eventTitle} />
                                  <DetailItem label="参加希望日" value={lead.eventDate} />
                                  <DetailItem label="参加人数" value={lead.participants ? `${lead.participants}名` : ''} />
                                  <DetailItem label="担当工務店" value={lead.builderName} />
                                </div>
                                {lead.message && (
                                  <div className="mt-3">
                                    <span className="text-gray-400 text-xs block mb-1">ご質問・ご要望</span>
                                    <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-100 whitespace-pre-wrap">{lead.message}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {lead.type === '工務店相談' && (
                              <div>
                                <h4 className="text-xs font-bold text-[#E8740C] uppercase tracking-wider mb-2">相談内容</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <DetailItem label="担当工務店" value={lead.builderName} />
                                  <DetailItem label="建築予定エリア" value={lead.area} />
                                  <DetailItem label="ご予算" value={lead.budget} />
                                  <DetailItem label="希望の間取り" value={lead.layout} />
                                </div>
                                {lead.message && (
                                  <div className="mt-3">
                                    <span className="text-gray-400 text-xs block mb-1">ご相談内容</span>
                                    <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-100 whitespace-pre-wrap">{lead.message}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Fallback for other types (B2B, パートナー, セミナー) */}
                            {!['無料相談', '資料請求', '見学会予約', '工務店相談'].includes(lead.type) && (
                              <>
                                {(lead.area || lead.budget || lead.layout || lead.video) && (
                                  <div>
                                    <h4 className="text-xs font-bold text-[#E8740C] uppercase tracking-wider mb-2">詳細情報</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                      {lead.area && <DetailItem label="エリア" value={lead.area} />}
                                      {lead.budget && <DetailItem label="予算" value={lead.budget} />}
                                      {lead.layout && <DetailItem label="間取り" value={lead.layout} />}
                                      {lead.video && <DetailItem label="参考動画" value={lead.video} />}
                                      {lead.builderName && <DetailItem label="担当工務店" value={lead.builderName} />}
                                    </div>
                                  </div>
                                )}
                                {lead.selectedCompanies.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-bold text-[#E8740C] uppercase tracking-wider mb-2">選択工務店</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {lead.selectedCompanies.map((c) => (
                                        <span key={c} className="inline-block bg-white border border-[#E8740C]/30 text-[#3D2200] text-xs font-medium px-3 py-1.5 rounded-full">{c}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {lead.selectedServices.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-bold text-[#E8740C] uppercase tracking-wider mb-2">選択サービス</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {lead.selectedServices.map((s) => (
                                        <span key={s} className="inline-block bg-white border border-blue-200 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">{s}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {lead.company && (
                                  <div>
                                    <h4 className="text-xs font-bold text-[#E8740C] uppercase tracking-wider mb-2">会社情報</h4>
                                    <DetailItem label="会社名" value={lead.company} />
                                  </div>
                                )}
                                {lead.message && (
                                  <div>
                                    <h4 className="text-xs font-bold text-[#E8740C] uppercase tracking-wider mb-2">メッセージ</h4>
                                    <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-100 whitespace-pre-wrap">{lead.message}</p>
                                  </div>
                                )}
                              </>
                            )}

                            {/* 管理メモ (common) */}
                            <div>
                              <h4 className="text-xs font-bold text-[#E8740C] uppercase tracking-wider mb-2">管理メモ</h4>
                              <textarea
                                defaultValue={lead.memo}
                                placeholder="社内メモを入力..."
                                rows={2}
                                onClick={(e) => e.stopPropagation()}
                                onBlur={(e) => handleMemoUpdate(lead.id, e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#E8740C] focus:border-[#E8740C] resize-y"
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            該当するリードがありません
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div>
      <span className="text-gray-400 text-xs block mb-0.5">{label}</span>
      {children ?? <span className="text-gray-800 font-medium text-sm">{value || '未登録'}</span>}
    </div>
  );
}

const SCORE_RULES = [
  { min: 80, label: 'S', color: 'bg-red-100 text-red-700', desc: '即対応（複数条件一致・高予算・具体的な要望あり）' },
  { min: 60, label: 'A', color: 'bg-orange-100 text-orange-700', desc: '優先対応（予算・間取り記入あり）' },
  { min: 40, label: 'B', color: 'bg-yellow-100 text-yellow-700', desc: '通常対応（基本情報のみ）' },
  { min: 0, label: 'C', color: 'bg-gray-100 text-gray-500', desc: '情報不足（名前・メールのみ）' },
];

function ScoreBadge({ score }: { score: number }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showTooltip) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowTooltip(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showTooltip]);

  const rule = SCORE_RULES.find(r => score >= r.min) ?? SCORE_RULES[SCORE_RULES.length - 1];

  return (
    <div className="relative inline-block" ref={ref}>
      <span className="text-sm font-bold text-gray-800">{score}点</span>
      <span className={`inline-block ml-1.5 px-1.5 py-0.5 rounded text-[0.65rem] font-bold ${rule.color}`}>{rule.label}</span>
      <button
        onClick={(e) => { e.stopPropagation(); setShowTooltip(!showTooltip); }}
        className="ml-1 w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-[0.6rem] font-bold inline-flex items-center justify-center hover:bg-gray-300 transition cursor-pointer"
        aria-label="スコア条件を表示"
      >
        ?
      </button>
      {showTooltip && (
        <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50" onClick={(e) => e.stopPropagation()}>
          <p className="text-xs font-bold text-gray-700 mb-2">スコア判定基準</p>
          <div className="space-y-1.5">
            {SCORE_RULES.map((r) => (
              <div key={r.label} className="flex items-start gap-2">
                <span className={`shrink-0 px-1.5 py-0.5 rounded text-[0.6rem] font-bold ${r.color}`}>{r.label}</span>
                <div>
                  <span className="text-xs text-gray-500">{r.min}点以上</span>
                  <p className="text-xs text-gray-600">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
