'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageHeader from '@/components/ui/PageHeader';
import PrefectureFilter from '@/components/ui/PrefectureFilter';
import { EVENT_TYPE_STYLES, formatPeriod } from '@/lib/events-data';
import { useEvents } from '@/lib/content-store';

const reports = [
  { title: '【レポート】鹿児島市・平屋完成見学会を開催しました', date: '2026.03.08', participants: '24名' },
  { title: '【レポート】ぺいほーむ特別見学会 in 福岡', date: '2026.02.22', participants: '18名' },
  { title: '【レポート】オンライン見学会・高性能住宅のすべて', date: '2026.02.08', participants: '42名' },
];

const EVENT_TYPES = ['すべて', '完成見学会', 'モデルハウス', 'オンライン見学会', 'ぺいほーむ特別見学会'] as const;

export default function EventPage() {
  const events = useEvents();
  const [prefecture, setPrefecture] = useState('all');
  const [typeFilter, setTypeFilter] = useState('すべて');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [builderFilter, setBuilderFilter] = useState('all');

  const builders = ['all', ...Array.from(new Set(events.map(e => e.builder)))];

  const filteredEvents = events.filter(event => {
    if (prefecture !== 'all' && event.prefecture !== prefecture) return false;
    if (typeFilter !== 'すべて' && event.typeLabel !== typeFilter) return false;
    if (builderFilter !== 'all' && event.builder !== builderFilter) return false;
    if (keyword) {
      const q = keyword.toLowerCase();
      if (!event.title.toLowerCase().includes(q) && !event.builder.toLowerCase().includes(q) && !event.location.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const resetFilters = () => {
    setPrefecture('all');
    setTypeFilter('すべて');
    setKeyword('');
    setBuilderFilter('all');
  };

  return (
    <>
      <PageHeader
        title="見学会・イベント予約"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '見学会・イベント予約' },
        ]}
        subtitle="動画で見た家を実際に体感できるチャンスです"
      />

      {/* Upcoming Events */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">UPCOMING</p>
          <h2 className="text-2xl font-bold text-center text-[#3D2200] mb-10">開催予定の見学会・イベント</h2>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {EVENT_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                  typeFilter === t
                    ? 'bg-[#E8740C] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <PrefectureFilter value={prefecture} onChange={setPrefecture} showOnline />

          {/* Advanced Search */}
          <div className="mb-8">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#E8740C] transition cursor-pointer"
            >
              <svg className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              詳細検索
            </button>

            {showAdvanced && (
              <div className="mt-3 bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">キーワード</label>
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="イベント名・工務店名・エリア..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">施工会社</label>
                    <select
                      value={builderFilter}
                      onChange={(e) => setBuilderFilter(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                    >
                      {builders.map(b => (
                        <option key={b} value={b}>{b === 'all' ? 'すべて' : b}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-xs text-gray-400 hover:text-[#E8740C] transition cursor-pointer"
                >
                  フィルターをリセット
                </button>
              </div>
            )}
          </div>

          {/* Results count */}
          <p className="text-xs text-gray-400 mb-4">{filteredEvents.length} 件のイベント</p>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => {
              const style = EVENT_TYPE_STYLES[event.type];
              return (
                <Link
                  key={event.id}
                  href={`/event/${event.id}`}
                  className="group bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-[#E8740C] hover:shadow-lg transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                    <Image
                      src={event.images[0]}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2-2H10L8 7H5a2 2 0 00-2 2z" />
                        <circle cx="12" cy="13" r="3" strokeWidth={1} />
                      </svg>
                    </div>
                    <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${style.bg} ${style.text} backdrop-blur-sm`}>
                      {event.typeLabel}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    <h3 className="text-sm md:text-base font-bold text-[#3D2200] leading-snug mb-3 group-hover:text-[#E8740C] transition-colors">
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                      <svg className="w-4 h-4 text-[#E8740C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={1.5} />
                        <path strokeWidth={1.5} d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                      <span className="font-semibold text-[#3D2200]">
                        {formatPeriod(event.startDate, event.endDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                      <span className="text-[0.65rem] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{event.prefecture === 'オンライン' ? 'オンライン' : event.prefecture.replace('県', '')}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{event.builder}</span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end">
                      <span className="text-xs font-bold text-[#E8740C] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        詳細を見る
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">該当するイベントがありません</div>
          )}
        </div>
      </section>

      {/* Event Reports */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">REPORT</p>
          <h2 className="text-2xl font-bold text-center text-[#3D2200] mb-10">イベントレポート</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Photo
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-bold text-[#3D2200] mb-2 leading-snug">{report.title}</h4>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{report.date}</span>
                    <span>参加者数：{report.participants}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
