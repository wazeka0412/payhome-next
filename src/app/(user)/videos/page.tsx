'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import FilterTabs from '@/components/ui/FilterTabs';
import PrefectureFilter from '@/components/ui/PrefectureFilter';
import Pagination from '@/components/ui/Pagination';
import { videos } from '@/lib/videos-data';


const ITEMS_PER_PAGE = 6;
const FILTER_TABS = ['すべて', 'ルームツアー', '取材', '解説', 'トレンド'];
const SORT_OPTIONS = [
  { value: 'popular', label: '人気順' },
  { value: 'newest', label: '新着順' },
  { value: 'tsubo-asc', label: '坪数：小さい順' },
  { value: 'tsubo-desc', label: '坪数：大きい順' },
] as const;

export default function VideosPage() {
  const [activeFilter, setActiveFilter] = useState('すべて');
  const [prefecture, setPrefecture] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<string>('popular');
  const [tsuboMin, setTsuboMin] = useState('');
  const [tsuboMax, setTsuboMax] = useState('');
  const [selectedBuilder, setSelectedBuilder] = useState('all');

  const builders = ['all', ...Array.from(new Set(videos.map(v => v.builder)))];

  let filteredItems = videos.filter(item => {
    if (activeFilter !== 'すべて' && item.category !== activeFilter) return false;
    if (prefecture !== 'all' && item.prefecture !== prefecture) return false;
    if (selectedBuilder !== 'all' && item.builder !== selectedBuilder) return false;
    if (keyword) {
      const q = keyword.toLowerCase();
      if (!item.title.toLowerCase().includes(q) && !item.builder.toLowerCase().includes(q)) return false;
    }
    if (tsuboMin && item.tsubo > 0 && item.tsubo < Number(tsuboMin)) return false;
    if (tsuboMax && item.tsubo > 0 && item.tsubo > Number(tsuboMax)) return false;
    return true;
  });

  // Sort
  if (sort === 'popular') filteredItems.sort((a, b) => b.viewCount - a.viewCount);
  else if (sort === 'tsubo-asc') filteredItems.sort((a, b) => a.tsubo - b.tsubo);
  else if (sort === 'tsubo-desc') filteredItems.sort((a, b) => b.tsubo - a.tsubo);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setActiveFilter('すべて');
    setPrefecture('all');
    setKeyword('');
    setSort('popular');
    setTsuboMin('');
    setTsuboMax('');
    setSelectedBuilder('all');
    setCurrentPage(1);
  };

  return (
    <>
      <PageHeader
        title="動画コンテンツ"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '動画コンテンツ' },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <FilterTabs
            tabs={FILTER_TABS}
            onChange={(tab) => { setActiveFilter(tab); setCurrentPage(1); }}
          />

          <PrefectureFilter value={prefecture} onChange={(v) => { setPrefecture(v); setCurrentPage(1); }} />

          {/* Advanced Search Toggle */}
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">キーワード</label>
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1); }}
                      placeholder="タイトル・工務店名..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">工務店</label>
                    <select
                      value={selectedBuilder}
                      onChange={(e) => { setSelectedBuilder(e.target.value); setCurrentPage(1); }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                    >
                      {builders.map(b => (
                        <option key={b} value={b}>{b === 'all' ? 'すべて' : b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">坪数</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={tsuboMin}
                        onChange={(e) => { setTsuboMin(e.target.value); setCurrentPage(1); }}
                        placeholder="下限"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                      />
                      <span className="text-gray-400 text-xs">〜</span>
                      <input
                        type="number"
                        value={tsuboMax}
                        onChange={(e) => { setTsuboMax(e.target.value); setCurrentPage(1); }}
                        placeholder="上限"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">並び替え</label>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                    >
                      {SORT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
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
          <p className="text-xs text-gray-400 mb-4">{filteredItems.length} 件の動画</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((video) => (
              <Card
                key={video.id}
                href={`/videos/${video.id}`}
                imageSrc={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                imageAlt={video.title}
                tag={video.category}
                meta={video.views}
                title={video.title}
                showPlay
              />
            ))}
          </div>

          {paginatedItems.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">該当する動画がありません</div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page)
              document.querySelector('section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-br from-[#3D2200] to-[#E8740C] text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest uppercase opacity-80 mb-3">For Housing Companies</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">住宅会社の集客を、動画とWEBで変える。</h2>
          <p className="text-sm opacity-90 leading-relaxed mb-6">
            ルームツアー撮影・SNS運用・WEB制作をパッケージでご提供。<br />まずはお気軽にご相談ください。
          </p>
          <Link
            href="/consultation"
            className="inline-block bg-white text-[#3D2200] font-bold px-8 py-3.5 rounded-full text-sm hover:bg-gray-100 transition"
          >
            サービス詳細を見る
          </Link>
        </div>
      </section>
    </>
  );
}
