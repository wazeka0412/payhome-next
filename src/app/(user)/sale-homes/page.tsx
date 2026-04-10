'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import {
  saleHomes,
  SALE_HOME_STATUS_LABELS,
  SALE_PRICE_BANDS,
} from '@/lib/sale-homes-data';
import { builders, getBuilderById } from '@/lib/builders-data';

const ALL_HOUSE_TYPES = ['すべて', '平屋', '2階建て', '3階建て'] as const;
const ALL_LAYOUTS = ['すべて', '1LDK', '2LDK', '3LDK', '4LDK', '5LDK'] as const;
const SORT_OPTIONS = [
  { value: 'price-asc', label: '価格が安い順' },
  { value: 'price-desc', label: '価格が高い順' },
  { value: 'tsubo-desc', label: '広い順' },
  { value: 'completion-asc', label: '完成が早い順' },
] as const;

const PREFECTURES = ['すべて', ...Array.from(new Set(saleHomes.map((s) => s.prefecture)))];

export default function SaleHomesPage() {
  const [prefecture, setPrefecture] = useState('すべて');
  const [city, setCity] = useState('すべて');
  const [priceBand, setPriceBand] = useState<(typeof SALE_PRICE_BANDS)[number]['value']>('all');
  const [houseType, setHouseType] = useState<(typeof ALL_HOUSE_TYPES)[number]>('すべて');
  const [layout, setLayout] = useState<(typeof ALL_LAYOUTS)[number]>('すべて');
  const [builderId, setBuilderId] = useState<string>('all');
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]['value']>('price-asc');
  const [showFilters, setShowFilters] = useState(false);

  // 県に応じて市を絞る
  const availableCities = useMemo(() => {
    const list = prefecture === 'すべて' ? saleHomes : saleHomes.filter((s) => s.prefecture === prefecture);
    return ['すべて', ...Array.from(new Set(list.map((s) => s.city)))];
  }, [prefecture]);

  const filtered = useMemo(() => {
    let list = saleHomes.filter((s) => {
      if (prefecture !== 'すべて' && s.prefecture !== prefecture) return false;
      if (city !== 'すべて' && s.city !== city) return false;
      if (priceBand !== 'all') {
        const band = SALE_PRICE_BANDS.find((b) => b.value === priceBand)!;
        if (s.price < band.min || s.price > band.max) return false;
      }
      if (houseType !== 'すべて' && s.houseType !== houseType) return false;
      if (layout !== 'すべて' && s.layout !== layout) return false;
      if (builderId !== 'all' && s.builderId !== builderId) return false;
      return true;
    });

    switch (sort) {
      case 'price-asc':
        list = list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = list.sort((a, b) => b.price - a.price);
        break;
      case 'tsubo-desc':
        list = list.sort((a, b) => b.tsubo - a.tsubo);
        break;
      case 'completion-asc':
        list = list.sort((a, b) => a.completionDate.localeCompare(b.completionDate));
        break;
    }
    return list;
  }, [prefecture, city, priceBand, houseType, layout, builderId, sort]);

  const activeFilterCount =
    (prefecture !== 'すべて' ? 1 : 0) +
    (city !== 'すべて' ? 1 : 0) +
    (priceBand !== 'all' ? 1 : 0) +
    (houseType !== 'すべて' ? 1 : 0) +
    (layout !== 'すべて' ? 1 : 0) +
    (builderId !== 'all' ? 1 : 0);

  const resetFilters = () => {
    setPrefecture('すべて');
    setCity('すべて');
    setPriceBand('all');
    setHouseType('すべて');
    setLayout('すべて');
    setBuilderId('all');
  };

  return (
    <>
      <PageHeader
        title="建売情報"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '建売情報' },
        ]}
        subtitle="ぺいほーむ提携工務店の販売中分譲住宅を比較検討"
      />

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          {/* ── 検索バー ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                条件を絞り込んで、あなたにぴったりの分譲住宅を見つけましょう
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
                    <Chip
                      key={p}
                      active={prefecture === p}
                      onClick={() => {
                        setPrefecture(p);
                        setCity('すべて');
                      }}
                    >
                      {p}
                    </Chip>
                  ))}
                </FilterSection>

                <FilterSection label="市町村">
                  {availableCities.map((c) => (
                    <Chip key={c} active={city === c} onClick={() => setCity(c)}>
                      {c}
                    </Chip>
                  ))}
                </FilterSection>

                <FilterSection label="価格帯">
                  {SALE_PRICE_BANDS.map((b) => (
                    <Chip
                      key={b.value}
                      active={priceBand === b.value}
                      onClick={() => setPriceBand(b.value)}
                    >
                      {b.label}
                    </Chip>
                  ))}
                </FilterSection>

                <FilterSection label="建物種別">
                  {ALL_HOUSE_TYPES.map((t) => (
                    <Chip key={t} active={houseType === t} onClick={() => setHouseType(t)}>
                      {t}
                    </Chip>
                  ))}
                </FilterSection>

                <FilterSection label="間取り">
                  {ALL_LAYOUTS.map((l) => (
                    <Chip key={l} active={layout === l} onClick={() => setLayout(l)}>
                      {l}
                    </Chip>
                  ))}
                </FilterSection>

                <FilterSection label="工務店">
                  <Chip active={builderId === 'all'} onClick={() => setBuilderId('all')}>
                    すべて
                  </Chip>
                  {builders
                    .filter((b) => saleHomes.some((s) => s.builderId === b.id))
                    .map((b) => (
                      <Chip key={b.id} active={builderId === b.id} onClick={() => setBuilderId(b.id)}>
                        {b.name}
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
              <span className="ml-1">件の分譲住宅</span>
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

          {/* ── グリッド ── */}
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
              <p className="text-gray-500 mb-4">条件に該当する分譲住宅が見つかりませんでした</p>
              <button
                onClick={resetFilters}
                className="inline-block bg-[#E8740C] text-white font-bold px-6 py-2 rounded-full text-sm hover:bg-[#D4660A] transition"
              >
                条件をリセット
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((home) => {
                const builder = getBuilderById(home.builderId);
                const status = SALE_HOME_STATUS_LABELS[home.status];
                return (
                  <Link
                    key={home.id}
                    href={`/sale-homes/${home.id}`}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#E8740C]/30 transition"
                  >
                    {/* image area */}
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-[#FFF8F0] via-[#FFF3E6] to-[#FFECD4] flex items-center justify-center">
                      <div className="text-center text-[#E8740C]/40">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <p className="text-xs">{home.houseType}</p>
                      </div>
                      <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="p-5">
                      <p className="text-[10px] text-gray-500 mb-1">{home.prefecture} {home.city}</p>
                      <h3 className="text-base font-bold text-[#3D2200] mb-2 line-clamp-2 min-h-[2.5rem]">
                        {home.title}
                      </h3>
                      <p className="text-2xl font-extrabold text-[#E8740C] mb-3">
                        {home.price.toLocaleString()}
                        <span className="text-sm ml-1">万円</span>
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-600 mb-3 border-t border-gray-100 pt-3">
                        <div>
                          <div className="text-gray-400">間取り</div>
                          <div className="font-bold text-[#3D2200]">{home.layout}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">建物</div>
                          <div className="font-bold text-[#3D2200]">{home.tsubo}坪</div>
                        </div>
                        <div>
                          <div className="text-gray-400">駐車</div>
                          <div className="font-bold text-[#3D2200]">{home.parking}台</div>
                        </div>
                      </div>
                      {builder && (
                        <p className="text-[10px] text-gray-500 border-t border-gray-100 pt-3">
                          施工：<span className="font-semibold text-[#3D2200]">{builder.name}</span>
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
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
