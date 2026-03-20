'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import FilterTabs from '@/components/ui/FilterTabs';
import Pagination from '@/components/ui/Pagination';

const interviews = [
  { id: 'interview-01', category: '工務店取材', company: '○○工務店（鹿児島市）', title: '「住む人の暮らし」から逆算する家づくりとは', excerpt: '地元の素材を活かし、住む人のライフスタイルに寄り添う設計哲学を聞きました。創業25年、地域に根ざした家づくりの想いとは。' },
  { id: 'interview-02', category: 'ハウスメーカー取材', company: '△△ハウス（福岡市）', title: '年間200棟を手がけるハウスメーカーの品質管理', excerpt: '大量供給と品質を両立させる仕組みの裏側に迫ります。独自の検査体制と職人教育の取り組みについて。' },
  { id: 'interview-03', category: '施主インタビュー', company: '施主Aさんご家族（霧島市）', title: '建てて1年、住んでわかった「本当に良かったこと」', excerpt: '注文住宅を建てて1年が経過したAさんご家族に、実際の住み心地や満足ポイント、後悔ポイントを率直に聞きました。' },
  { id: 'interview-04', category: '工務店取材', company: '□□建設（熊本市）', title: '耐震等級3が標準仕様。熊本地震から学んだ家づくり', excerpt: '熊本地震を経験した工務店が、地震に強い家づくりをどのように標準化しているのか。具体的な構造の工夫を取材。' },
  { id: 'interview-05', category: 'トレンドレポート', company: 'トレンドレポート', title: '2026年九州エリアの住宅市場動向レポート', excerpt: '九州エリアの着工数推移、資材価格の変動、人気の間取りトレンドなど、最新の住宅市場データをまとめました。' },
  { id: 'interview-06', category: '工務店取材', company: '◇◇ホーム（大分市）', title: 'ZEH率95%を実現する地方工務店の挑戦', excerpt: '省エネ住宅の最前線を走る地方工務店。ZEH（ネット・ゼロ・エネルギー・ハウス）をどのように普及させているのか。' },
];

const ITEMS_PER_PAGE = 6;

export default function InterviewPage() {
  const [activeFilter, setActiveFilter] = useState('すべて');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = activeFilter === 'すべて'
    ? interviews
    : interviews.filter(item => item.category === activeFilter);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <PageHeader
        title="取材・レポート"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '取材・レポート' },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <FilterTabs
            tabs={['すべて', '工務店取材', 'ハウスメーカー取材', '施主インタビュー', 'トレンドレポート']}
            onChange={(tab) => { setActiveFilter(tab); setCurrentPage(1); }}
          />

          <div className="grid md:grid-cols-2 gap-6">
            {paginatedItems.map((item) => (
              <Link
                key={item.id}
                href={`/interview/${item.id}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Photo
                </div>
                <div className="p-5">
                  <p className="text-xs text-[#E8740C] font-semibold mb-1">{item.company}</p>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-[#E8740C] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.excerpt}</p>
                </div>
              </Link>
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
