'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import {
  caseStudies,
  LAYOUT_OPTIONS,
  TOTAL_PRICE_BANDS,
  ALL_TAGS,
  FREE_VIEW_LIMIT,
  type LayoutType,
} from '@/lib/case-studies-data';
import { builders, getBuilderById } from '@/lib/builders-data';

const PREFECTURES = ['すべて', ...Array.from(new Set(caseStudies.map((c) => c.prefecture)))];

const SORT_OPTIONS = [
  { value: 'newest', label: '完成が新しい順' },
  { value: 'price-asc', label: '総額が安い順' },
  { value: 'price-desc', label: '総額が高い順' },
  { value: 'tsubo-desc', label: '広い順' },
] as const;

export default function CaseStudiesPage() {
  const { status } = useSession();
  const isMember = status === 'authenticated';

  const [prefecture, setPrefecture] = useState('すべて');
  const [layout, setLayout] = useState<LayoutType | 'all'>('all');
  const [priceBand, setPriceBand] = useState<(typeof TOTAL_PRICE_BANDS)[number]['value']>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [builderId, setBuilderId] = useState<string>('all');
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]['value']>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = caseStudies.filter((c) => {
      if (prefecture !== 'すべて' && c.prefecture !== prefecture) return false;
      if (layout !== 'all' && c.layout !== layout) return false;
      if (priceBand !== 'all') {
        const b = TOTAL_PRICE_BANDS.find((x) => x.value === priceBand)!;
        if (c.totalPrice < b.min || c.totalPrice > b.max) return false;
      }
      if (selectedTags.length > 0) {
        const hasAll = selectedTags.every((t) => c.tags.includes(t));
        if (!hasAll) return false;
      }
      if (builderId !== 'all' && c.builderId !== builderId) return false;
      return true;
    });

    switch (sort) {
      case 'newest':
        list = list.sort((a, b) => b.completedAt.localeCompare(a.completedAt));
        break;
      case 'price-asc':
        list = list.sort((a, b) => a.totalPrice - b.totalPrice);
        break;
      case 'price-desc':
        list = list.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      case 'tsubo-desc':
        list = list.sort((a, b) => b.tsubo - a.tsubo);
        break;
    }
    return list;
  }, [prefecture, layout, priceBand, selectedTags, builderId, sort]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const resetFilters = () => {
    setPrefecture('すべて');
    setLayout('all');
    setPriceBand('all');
    setSelectedTags([]);
    setBuilderId('all');
  };

  const activeFilterCount =
    (prefecture !== 'すべて' ? 1 : 0) +
    (layout !== 'all' ? 1 : 0) +
    (priceBand !== 'all' ? 1 : 0) +
    selectedTags.length +
    (builderId !== 'all' ? 1 : 0);

  // 非会員は5件まで、6件目以降は会員登録CTAをオーバーレイ
  const visibleItems = isMember ? filtered : filtered.slice(0, FREE_VIEW_LIMIT);
  const gatedCount = isMember ? 0 : Math.max(0, filtered.length - FREE_VIEW_LIMIT);

  return (
    <>
      <PageHeader
        title="平屋事例ライブラリ"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '平屋事例ライブラリ' },
        ]}
        subtitle="完成事例を間取り・費用・工務店・タグで検索"
      />

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          {/* ── 非会員向け案内バナー ── */}
          {!isMember && (
            <div className="bg-gradient-to-r from-[#FFF8F0] to-white border border-[#E8740C]/20 rounded-2xl p-4 md:p-5 mb-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#E8740C] rounded-full flex items-center justify-center text-white flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#3D2200] mb-0.5">
                  会員登録で、家づくりが一気に進みます
                </p>
                <p className="text-xs text-gray-600">
                  事例ライブラリ全件閲覧・間取り図フル解像度・お気に入り保存・AI診断結果の保存まで全て無料。検討状況を整理して、迷わず次のステップへ進めます (非会員は{FREE_VIEW_LIMIT}件まで閲覧可)。
                </p>
              </div>
              <Link
                href="/signup?redirect=/case-studies"
                className="hidden md:inline-block bg-[#E8740C] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#D4660A] transition flex-shrink-0"
              >
                無料会員登録 →
              </Link>
            </div>
          )}

          {/* ── 検索バー ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                完成事例を条件で絞り込んで、あなたの家づくりの参考に
              </p>
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-[#E8740C] text-white border-[#E8740C]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#E8740C]'
                }`}
              >
                絞り込み
                {activeFilterCount > 0 && (
                  <span className="bg-white text-[#E8740C] text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[18px] text-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-5">
                <FilterSection label="エリア（県）">
                  {PREFECTURES.map((p) => (
                    <Chip key={p} active={prefecture === p} onClick={() => setPrefecture(p)}>
                      {p}
                    </Chip>
                  ))}
                </FilterSection>

                <FilterSection label="間取り">
                  {LAYOUT_OPTIONS.map((l) => (
                    <Chip key={l.value} active={layout === l.value} onClick={() => setLayout(l.value)}>
                      {l.label}
                    </Chip>
                  ))}
                </FilterSection>

                <FilterSection label="総額（本体+土地+諸費用）">
                  {TOTAL_PRICE_BANDS.map((b) => (
                    <Chip key={b.value} active={priceBand === b.value} onClick={() => setPriceBand(b.value)}>
                      {b.label}
                    </Chip>
                  ))}
                </FilterSection>

                <FilterSection label="工務店">
                  <Chip active={builderId === 'all'} onClick={() => setBuilderId('all')}>
                    すべて
                  </Chip>
                  {builders
                    .filter((b) => caseStudies.some((c) => c.builderId === b.id))
                    .map((b) => (
                      <Chip key={b.id} active={builderId === b.id} onClick={() => setBuilderId(b.id)}>
                        {b.name}
                      </Chip>
                    ))}
                </FilterSection>

                <FilterSection label="タグ（複数選択可 / AND検索）">
                  {ALL_TAGS.map((t) => (
                    <Chip key={t} active={selectedTags.includes(t)} onClick={() => toggleTag(t)}>
                      {t}
                    </Chip>
                  ))}
                </FilterSection>

                {activeFilterCount > 0 && (
                  <div className="flex justify-end">
                    <button
                      onClick={resetFilters}
                      className="text-xs text-gray-500 hover:text-[#E8740C] underline"
                    >
                      条件をリセット
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── 件数 + ソート ── */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-[#3D2200] text-lg">{filtered.length}</span>
              <span className="ml-1">件の完成事例</span>
              {!isMember && gatedCount > 0 && (
                <span className="ml-2 text-xs text-[#E8740C]">（うち{gatedCount}件は会員限定）</span>
              )}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as (typeof SORT_OPTIONS)[number]['value'])}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
              <p className="text-gray-500 mb-4">条件に該当する完成事例が見つかりませんでした</p>
              <button
                onClick={resetFilters}
                className="inline-block bg-[#E8740C] text-white font-bold px-6 py-2 rounded-full text-sm hover:bg-[#D4660A] transition"
              >
                条件をリセット
              </button>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleItems.map((cs) => (
                  <CaseStudyCard key={cs.id} caseStudy={cs} />
                ))}
              </div>

              {/* 会員限定ゲート */}
              {!isMember && gatedCount > 0 && (
                <div className="mt-8 relative">
                  {/* ぼかしプレビュー */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-40 blur-sm pointer-events-none select-none">
                    {filtered.slice(FREE_VIEW_LIMIT, FREE_VIEW_LIMIT + 3).map((cs) => (
                      <CaseStudyCard key={cs.id} caseStudy={cs} />
                    ))}
                  </div>

                  {/* 会員登録CTAオーバーレイ */}
                  <div className="absolute inset-0 flex items-center justify-center px-4">
                    <div className="bg-white border-2 border-[#E8740C] rounded-3xl shadow-2xl p-8 md:p-10 max-w-md w-full text-center">
                      <div className="w-14 h-14 mx-auto mb-4 bg-[#FFF8F0] rounded-full flex items-center justify-center">
                        <svg className="w-7 h-7 text-[#E8740C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <p className="text-[10px] font-bold text-[#E8740C] tracking-widest mb-2">
                        MEMBERS ONLY
                      </p>
                      <h3 className="text-xl font-extrabold text-[#3D2200] mb-2 leading-tight">
                        残り {gatedCount} 件は会員限定
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed mb-6">
                        無料会員登録ですべての完成事例（間取り・費用・施主コメント含む）をご覧いただけます。
                        さらに間取り図フル解像度閲覧、お気に入り無制限、工務店比較機能など多数の特典が解放されます。
                      </p>
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/signup?redirect=/case-studies"
                          className="bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold px-6 py-3 rounded-full text-sm transition shadow-md"
                        >
                          無料会員登録して全件見る →
                        </Link>
                        <Link
                          href="/login?redirect=/case-studies"
                          className="text-xs text-gray-500 hover:text-[#E8740C]"
                        >
                          すでに会員の方はログイン →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function CaseStudyCard({ caseStudy }: { caseStudy: typeof caseStudies[0] }) {
  const builder = getBuilderById(caseStudy.builderId);
  return (
    <Link
      href={`/case-studies/${caseStudy.id}`}
      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#E8740C]/30 transition"
    >
      <div className="relative aspect-video bg-gray-200">
        <img
          src={`https://img.youtube.com/vi/${caseStudy.youtubeId}/mqdefault.jpg`}
          alt={caseStudy.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 bg-[#E8740C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          完成事例
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          {caseStudy.completedAt} 完成
        </div>
      </div>
      <div className="p-5">
        <p className="text-[10px] text-gray-500 mb-1">
          {caseStudy.prefecture} {caseStudy.city} / {caseStudy.familyStructure}
        </p>
        <h3 className="text-sm font-bold text-[#3D2200] mb-2 line-clamp-2 min-h-[2.5rem]">
          {caseStudy.title}
        </h3>
        <div className="flex items-baseline gap-2 mb-3">
          <p className="text-xl font-extrabold text-[#E8740C]">
            {caseStudy.totalPrice.toLocaleString()}
            <span className="text-[10px] ml-1">万円</span>
          </p>
          <span className="text-[9px] text-gray-400">総額</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-[10px] text-gray-600 border-t border-gray-100 pt-3 mb-3">
          <div>
            <div className="text-gray-400">間取り</div>
            <div className="font-bold text-[#3D2200]">{caseStudy.layout}</div>
          </div>
          <div>
            <div className="text-gray-400">坪数</div>
            <div className="font-bold text-[#3D2200]">{caseStudy.tsubo}坪</div>
          </div>
          <div>
            <div className="text-gray-400">本体</div>
            <div className="font-bold text-[#3D2200]">{caseStudy.buildingPrice}万</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {caseStudy.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[9px] bg-[#FFF8F0] text-[#E8740C] px-1.5 py-0.5 rounded font-semibold"
            >
              {t}
            </span>
          ))}
        </div>
        {builder && <p className="text-[10px] text-gray-500">施工：{builder.name}</p>}
      </div>
    </Link>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-2 tracking-wide">{label}</label>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
        active
          ? 'bg-[#E8740C] text-white border-[#E8740C]'
          : 'bg-white text-gray-600 border-gray-200 hover:border-[#E8740C] hover:text-[#E8740C]'
      }`}
    >
      {children}
    </button>
  );
}
