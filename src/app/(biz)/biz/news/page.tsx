'use client';

import Link from 'next/link';
import { useState } from 'react';
import Pagination from '@/components/ui/Pagination';

const categories = ['すべて', '市場動向', '法改正・制度', 'テクノロジー', '経営戦略'];

const articles = [
  { id: 'biz-news-01', category: '市場動向', date: '2026.03.18', title: '2026年度 九州エリア新築着工件数、前年比8%増の見通し', excerpt: '九州エリアの新築着工件数が前年比8%増加する見通しとなりました。市場の回復基調と今後の展望を解説します。' },
  { id: 'biz-news-02', category: '法改正・制度', date: '2026.03.15', title: '省エネ基準適合義務化の完全施行へ｜工務店が今すべき準備', excerpt: '省エネ基準の適合義務化が完全施行を迎えます。工務店が今から準備すべきポイントをまとめました。' },
  { id: 'biz-news-03', category: 'テクノロジー', date: '2026.03.12', title: 'AI活用で住宅営業はどう変わる？最新ツール5選', excerpt: '住宅営業にAIを活用する動きが加速しています。注目の最新ツール5つを紹介します。' },
  { id: 'biz-news-04', category: '経営戦略', date: '2026.03.08', title: '年間30棟の工務店が実践するYouTube集客の全貌', excerpt: '年間30棟を安定受注する工務店のYouTube活用戦略を詳しく取材しました。' },
  { id: 'biz-news-05', category: '市場動向', date: '2026.03.05', title: '木材価格が安定傾向に｜2026年の建築コスト見通し', excerpt: '木材価格の安定化が進み、建築コストの見通しが改善しています。最新の市場データを解説します。' },
  { id: 'biz-news-06', category: '法改正・制度', date: '2026.03.01', title: '住宅ローン減税 2026年度の変更点まとめ', excerpt: '2026年度の住宅ローン減税の変更点を分かりやすくまとめました。営業トークにも活用できます。' },
  { id: 'biz-news-07', category: 'テクノロジー', date: '2026.02.25', title: 'VRモデルハウスの導入事例｜来場率+40%の住宅会社も', excerpt: 'VRモデルハウスを導入した住宅会社の成功事例を紹介。来場率が40%向上した事例もあります。' },
  { id: 'biz-news-08', category: '経営戦略', date: '2026.02.20', title: '施主の口コミを集客に活かす｜レビューマーケティング入門', excerpt: '施主の口コミを効果的に集客に活かすレビューマーケティングの基本を解説します。' },
];

const ITEMS_PER_PAGE = 6;

export default function NewsPage() {
  const [activeFilter, setActiveFilter] = useState('すべて');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = activeFilter === 'すべて' ? articles : articles.filter((a) => a.category === activeFilter);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-400 mb-4"><Link href="/biz" className="hover:text-white">ホーム</Link> &gt; 業界ニュース</p>
          <p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">INDUSTRY NEWS</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">業界ニュース</h1>
          <p className="text-gray-300">住宅業界の最新動向、法改正、市場トレンドをお届けします。</p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button key={cat} onClick={() => { setActiveFilter(cat); setCurrentPage(1); }} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeFilter === cat ? 'bg-[#E8740C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat}</button>
            ))}
          </div>

          {/* Articles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paged.map((article) => (
              <Link href={`/biz/news/${article.id}`} key={article.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition block">
                <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm aspect-video">Photo</div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-gray-500">{article.category}</span>
                    <time className="text-xs text-gray-400">{article.date}</time>
                  </div>
                  <h3 className="font-bold text-sm leading-snug mb-2">{article.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>

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
