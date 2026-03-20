'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import FilterTabs from '@/components/ui/FilterTabs';
import Pagination from '@/components/ui/Pagination';

const newsItems = [
  { id: 'news-01', date: '2026.03.18', tag: 'お知らせ', title: 'ウェビナー「九州の住宅トレンド2026」開催のお知らせ' },
  { id: 'news-02', date: '2026.03.15', tag: '業界ニュース', title: '2026年度の住宅省エネ基準改正について解説' },
  { id: 'news-03', date: '2026.03.12', tag: 'コラム', title: '「良い工務店」の見分け方 ― 10のチェックポイント' },
  { id: 'news-04', date: '2026.03.10', tag: 'お知らせ', title: '月刊ぺいほーむ 3月号を公開しました' },
  { id: 'news-05', date: '2026.03.05', tag: '業界ニュース', title: '住宅ローン金利、変動型が過去最低水準を更新' },
  { id: 'news-06', date: '2026.03.01', tag: 'コラム', title: '家づくりの第一歩｜情報収集で押さえるべき3つのポイント' },
  { id: 'news-07', date: '2026.02.25', tag: 'お知らせ', title: 'ぺいほーむYouTubeチャンネル登録者4.28万人突破' },
  { id: 'news-08', date: '2026.02.20', tag: '業界ニュース', title: '国土交通省、2026年度の住宅補助金制度の概要を発表' },
  { id: 'news-09', date: '2026.02.15', tag: 'コラム', title: '平屋 vs 二階建て｜ライフスタイル別の選び方ガイド' },
  { id: 'news-10', date: '2026.02.10', tag: 'お知らせ', title: '月刊ぺいほーむ 2月号を公開しました' },
];

const ITEMS_PER_PAGE = 5;

export default function NewsPage() {
  const [activeFilter, setActiveFilter] = useState('すべて');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = activeFilter === 'すべて'
    ? newsItems
    : newsItems.filter(item => item.tag === activeFilter);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <PageHeader
        title="ぺいほーむニュース"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: 'ニュース' },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <FilterTabs
            tabs={['すべて', 'お知らせ', '業界ニュース', 'コラム']}
            onChange={(tab) => { setActiveFilter(tab); setCurrentPage(1); }}
          />

          <div className="divide-y divide-gray-100">
            {paginatedItems.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-5 group hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors"
              >
                <span className="text-xs text-gray-400 font-mono shrink-0 w-24">{item.date}</span>
                <span className="text-xs font-semibold text-[#E8740C] bg-[#E8740C]/10 px-2 py-0.5 rounded w-fit shrink-0">
                  {item.tag}
                </span>
                <span className="text-sm font-semibold text-gray-800 group-hover:text-[#E8740C] transition-colors">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>

          {paginatedItems.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">該当するニュースがありません</div>
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
    </>
  );
}
