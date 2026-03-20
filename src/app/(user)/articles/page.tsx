'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import FilterTabs from '@/components/ui/FilterTabs';
import Pagination from '@/components/ui/Pagination';

const articles = [
  { id: 'article-01', tag: '基礎知識', date: '2026.03.16', title: '注文住宅の相場はいくら？鹿児島県の最新データ' },
  { id: 'article-02', tag: '住宅ローン', date: '2026.03.14', title: '住宅ローン審査に通るための5つのポイント' },
  { id: 'article-03', tag: '間取り・設計', date: '2026.03.12', title: '失敗しない間取りの考え方｜プロが教える動線設計' },
  { id: 'article-04', tag: '住宅会社の選び方', date: '2026.03.08', title: '工務店とハウスメーカーの違い｜それぞれのメリット・デメリット' },
  { id: 'article-05', tag: '基礎知識', date: '2026.03.05', title: '家づくりの流れを完全解説｜土地探しから引き渡しまで' },
  { id: 'article-06', tag: '住宅ローン', date: '2026.03.01', title: '変動金利 vs 固定金利｜2026年はどちらを選ぶべき？' },
  { id: 'article-07', tag: '間取り・設計', date: '2026.02.25', title: '平屋の間取り実例集｜20坪〜35坪のプラン比較' },
  { id: 'article-08', tag: '住宅会社の選び方', date: '2026.02.20', title: '住宅展示場の賢い回り方｜見るべきポイント7選' },
  { id: 'article-09', tag: '基礎知識', date: '2026.02.15', title: '断熱等級とは？等級4〜7の違いをわかりやすく解説' },
];

const ITEMS_PER_PAGE = 6;

export default function ArticlesPage() {
  const [activeFilter, setActiveFilter] = useState('すべて');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = activeFilter === 'すべて'
    ? articles
    : articles.filter(item => item.tag === activeFilter);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <PageHeader
        title="お役立ち記事"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: 'お役立ち記事' },
        ]}
        subtitle="家づくりに役立つ知識をわかりやすく解説"
      />

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <FilterTabs
            tabs={['すべて', '基礎知識', '住宅ローン', '間取り・設計', '住宅会社の選び方']}
            onChange={(tab) => { setActiveFilter(tab); setCurrentPage(1); }}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((article) => (
              <Card
                key={article.id}
                href={`/articles/${article.id}`}
                tag={article.tag}
                meta={article.date}
                title={article.title}
                placeholder="Article Image"
              />
            ))}
          </div>

          {paginatedItems.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">該当する記事がありません</div>
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
