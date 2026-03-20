'use client';

import Link from 'next/link';
import { useState } from 'react';
import Pagination from '@/components/ui/Pagination';

const categories = ['すべて', 'YouTube活用', 'SNS運用', 'WEB集客', 'ブランディング'];

const articles = [
  { id: 'biz-article-01', category: 'YouTube活用', title: 'ルームツアー動画の再生数を伸ばす7つのテクニック', excerpt: '再生数が伸び悩むルームツアー動画を改善するための実践的なテクニックを7つ紹介します。' },
  { id: 'biz-article-02', category: 'SNS運用', title: 'Instagram運用で月100件の反響を生む住宅会社の共通点', excerpt: '月100件以上の反響を獲得している住宅会社のInstagram運用に共通するポイントを分析しました。' },
  { id: 'biz-article-03', category: 'WEB集客', title: '工務店のSEO対策｜「地域名+注文住宅」で1位を獲る方法', excerpt: 'ローカルSEOで検索上位を獲得するための具体的な施策を解説します。' },
  { id: 'biz-article-04', category: 'ブランディング', title: '選ばれる工務店になるためのブランド戦略入門', excerpt: '価格競争から脱却し、ブランドで選ばれる工務店になるための戦略を基礎から解説します。' },
  { id: 'biz-article-05', category: 'YouTube活用', title: 'サムネイルで再生数が3倍変わる｜住宅動画のデザイン術', excerpt: 'クリック率を劇的に高めるサムネイルデザインのコツを住宅動画に特化して解説します。' },
  { id: 'biz-article-06', category: 'SNS運用', title: 'TikTokで住宅会社が成功するための投稿戦略', excerpt: 'TikTokを活用して若年層にリーチする住宅会社の投稿戦略を成功事例とともに紹介します。' },
  { id: 'biz-article-07', category: 'WEB集客', title: 'MEO対策の基本｜Googleマップで上位表示する方法', excerpt: 'Googleマップでの上位表示を目指すMEO対策の基本と実践ステップを解説します。' },
  { id: 'biz-article-08', category: 'ブランディング', title: '住宅会社のロゴ・ビジュアル統一が集客に与える影響', excerpt: 'ロゴやビジュアルの統一がブランド認知と集客にどのような影響を与えるかをデータで解説します。' },
  { id: 'biz-article-09', category: 'YouTube活用', title: '動画の「最初の10秒」で離脱を防ぐ編集テクニック', excerpt: '視聴者の離脱を防ぎ、最後まで見てもらうための冒頭10秒の編集テクニックを紹介します。' },
];

const ITEMS_PER_PAGE = 6;

export default function ArticlesPage() {
  const [activeFilter, setActiveFilter] = useState('すべて');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = activeFilter === 'すべて' ? articles : articles.filter((a) => a.category === activeFilter);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
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
              <button key={cat} onClick={() => { setActiveFilter(cat); setCurrentPage(1); }} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeFilter === cat ? 'bg-[#E8740C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat}</button>
            ))}
          </div>

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
