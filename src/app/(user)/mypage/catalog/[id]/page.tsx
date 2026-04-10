'use client';

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import { getCatalogById, type DigitalCatalog, type CatalogPage } from '@/lib/catalogs-data';
import { getOrCreateAnonymousId } from '@/lib/anonymous-id';

/**
 * デジタルカタログ詳細・ビューア（v4.0 開設記念キャンペーン）
 *
 * 受け取り条件達成済みの会員のみ閲覧可能。
 * 各カタログの全ページを縦スクロール + フィルタで表示。
 */
export default function CatalogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { status } = useSession();
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [activeTsubo, setActiveTsubo] = useState<'all' | 'small' | 'mid' | 'large'>('all');

  const catalog = getCatalogById(id);

  useEffect(() => {
    if (status !== 'authenticated') {
      setEligible(false);
      return;
    }
    const anonymousId = getOrCreateAnonymousId();
    fetch(`/api/ai/diagnosis/me?anonymous_id=${anonymousId}`)
      .then((r) => r.json())
      .then((res) => setEligible(Boolean(res?.found)))
      .catch(() => setEligible(false));
  }, [status]);

  if (!catalog) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-gray-500">カタログが見つかりません</p>
      </div>
    );
  }

  if (status === 'loading' || eligible === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!eligible) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h2 className="text-lg font-bold text-[#3D2200] mb-3">
            受け取り条件を満たしていません
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            デジタルカタログは、会員登録 + AI家づくり診断完了が必要です。
          </p>
          <Link
            href="/mypage/catalog"
            className="inline-block bg-[#E8740C] text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-[#D4660A] transition"
          >
            条件を確認する
          </Link>
        </div>
      </div>
    );
  }

  // フィルタ
  const filteredPages = catalog.pages.filter((p) => {
    if (activeTsubo === 'all') return true;
    if (activeTsubo === 'small') return p.tsubo > 0 && p.tsubo <= 25;
    if (activeTsubo === 'mid') return p.tsubo > 25 && p.tsubo <= 35;
    if (activeTsubo === 'large') return p.tsubo > 35;
    return true;
  });

  return (
    <>
      <PageHeader
        title={catalog.title}
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: 'マイページ', href: '/mypage' },
          { label: 'デジタルカタログ', href: '/mypage/catalog' },
          { label: catalog.title },
        ]}
        subtitle={catalog.subtitle}
      />

      {/* ── カバー ── */}
      <CatalogHero catalog={catalog} />

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* 説明 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">{catalog.description}</p>
          </div>

          {/* フィルタタブ */}
          <div className="bg-white border border-gray-100 rounded-2xl p-3 mb-6 inline-flex flex-wrap gap-1 shadow-sm">
            {[
              { value: 'all', label: 'すべて' },
              { value: 'small', label: '〜25坪（コンパクト）' },
              { value: 'mid', label: '26〜35坪（家族の平屋）' },
              { value: 'large', label: '36坪〜（大型平屋）' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTsubo(tab.value as typeof activeTsubo)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTsubo === tab.value
                    ? 'bg-[#E8740C] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ページ数 */}
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-bold text-[#3D2200] text-lg">{filteredPages.length}</span>
            <span className="ml-1">/ 全 {catalog.totalPages} ページ</span>
          </p>

          {/* ページグリッド */}
          {filteredPages.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
              <p className="text-gray-500">該当するページが見つかりませんでした</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPages.map((page) => (
                <PageCard key={page.id} page={page} />
              ))}
            </div>
          )}

          {/* 下部CTA */}
          <div className="mt-12 bg-[#E8740C] text-white rounded-2xl p-8 text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              気になる事例が見つかりましたか？
            </h2>
            <p className="text-sm text-white/95 mb-5">
              工務店ページから詳細を確認したり、見学会で実物を体感できます
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/builders"
                className="inline-block bg-white text-[#E8740C] font-bold px-8 py-3 rounded-full text-sm hover:bg-gray-50 transition"
              >
                工務店一覧へ
              </Link>
              <Link
                href="/event"
                className="inline-block bg-white/15 backdrop-blur-sm border border-white/40 text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-white/25 transition"
              >
                見学会の日程を見る
              </Link>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/mypage/catalog"
              className="text-sm text-gray-500 hover:text-[#E8740C] font-bold"
            >
              ← カタログ一覧に戻る
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function CatalogHero({ catalog }: { catalog: DigitalCatalog }) {
  return (
    <div className={`bg-gradient-to-br ${catalog.coverGradient} text-white`}>
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="bg-white/95 text-[#E8740C] text-[10px] font-bold px-3 py-1 rounded-full tracking-wider">
            {catalog.code}
          </span>
          <span className="bg-yellow-400 text-[#3D2200] text-[10px] font-bold px-3 py-1 rounded-full">
            {catalog.badge}
          </span>
          <span className="text-xs opacity-90">全 {catalog.totalPages} ページ</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
          {catalog.title}
        </h1>
        <p className="text-sm md:text-base opacity-95">{catalog.subtitle}</p>
      </div>
    </div>
  );
}

function PageCard({ page }: { page: CatalogPage }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition">
      {/* サムネ */}
      <div className="relative aspect-video bg-gray-200">
        {page.thumbnailVideoId && (
          <img
            src={`https://img.youtube.com/vi/${page.thumbnailVideoId}/mqdefault.jpg`}
            alt={page.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        <div className="absolute top-2 left-2 bg-[#E8740C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          P. {page.pageNumber}
        </div>
      </div>

      {/* 内容 */}
      <div className="p-5">
        <h3 className="text-sm font-bold text-[#3D2200] mb-2 line-clamp-2 min-h-[2.5rem]">
          {page.title}
        </h3>
        <p className="text-[10px] text-gray-500 mb-3">{page.subtitle}</p>

        <div className="grid grid-cols-3 gap-1.5 mb-3 text-[10px] text-gray-600 border-t border-gray-100 pt-3">
          <div>
            <div className="text-gray-400">間取り</div>
            <div className="font-bold text-[#3D2200]">{page.layout}</div>
          </div>
          <div>
            <div className="text-gray-400">坪数</div>
            <div className="font-bold text-[#3D2200]">{page.tsubo}坪</div>
          </div>
          <div>
            <div className="text-gray-400">エリア</div>
            <div className="font-bold text-[#3D2200] truncate">{page.area.replace('県', '')}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {page.features.slice(0, 3).map((f) => (
            <span
              key={f}
              className="text-[9px] bg-[#FFF8F0] text-[#E8740C] px-1.5 py-0.5 rounded font-semibold"
            >
              {f}
            </span>
          ))}
        </div>

        <p className="text-[10px] text-gray-500 line-clamp-2">{page.description}</p>
      </div>
    </div>
  );
}
