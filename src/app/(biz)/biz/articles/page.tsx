'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Pagination from '@/components/ui/Pagination';

const categories = ['すべて', 'YouTube活用', 'SNS運用', 'WEB集客', 'ブランディング', '集客', 'コンテンツ戦略'];

type BizArticle = {
  id: string
  category: string
  title: string
  excerpt?: string
  status?: string
  publishDate?: string
}

const ITEMS_PER_PAGE = 6;

export default function ArticlesPage() {
  const [activeFilter, setActiveFilter] = useState('すべて');
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState<BizArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/biz-articles')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? (data as BizArticle[]) : [];
        // 公開済みのみ表示（status 未設定は公開扱い）
        setArticles(list.filter((a) => !a.status || a.status === 'published'));
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'すべて' ? articles : articles.filter((a) => a.category === activeFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-400 mb-4"><Link href="/biz" className="hover:text-white">ホーム</Link> &gt; 集客ノウハウ</p>
          <p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">KNOW-HOW</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">集客ノウハウ</h1>
          <p className="text-gray-300">住宅会社の集客・マーケティングに役立つ実践的なノウハウをお届けします。</p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button key={cat} onClick={() => { setActiveFilter(cat); setCurrentPage(1); }} className={`px-4 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${activeFilter === cat ? 'bg-[#E8740C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat}</button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-[#E8740C] border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {paged.map((article) => (
                  <Link href={`/biz/articles/${article.id}`} key={article.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition block">
                    <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm aspect-video">Photo</div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-gray-500">{article.category}</span>
                      </div>
                      <h3 className="font-bold text-sm leading-snug mb-2">{article.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{article.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {paged.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">該当する記事がありません</div>
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page)
                  document.querySelector('section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}
