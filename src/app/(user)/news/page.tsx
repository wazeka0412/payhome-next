'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import FilterTabs from '@/components/ui/FilterTabs';
import Pagination from '@/components/ui/Pagination';
import { useNews } from '@/lib/content-store';

const ITEMS_PER_PAGE = 5;

export default function NewsPage() {
  const newsItems = useNews().map(n => ({ id: n.id, date: n.date, tag: n.category, title: n.title }));
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
