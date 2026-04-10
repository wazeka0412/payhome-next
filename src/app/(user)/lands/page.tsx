'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import { lands, LAND_STATUS_LABELS, LAND_PRICE_BANDS } from '@/lib/lands-data';
import { builders, getBuilderById } from '@/lib/builders-data';

const TSUBO_RANGES = [
  { value: 'all', label: 'すべて', min: 0, max: Infinity },
  { value: 'small', label: '〜40坪', min: 0, max: 40 },
  { value: 'mid', label: '40〜60坪', min: 40, max: 60 },
  { value: 'large', label: '60〜80坪', min: 60, max: 80 },
  { value: 'xlarge', label: '80坪〜', min: 80, max: Infinity },
] as const;

const SORT_OPTIONS = [
  { value: 'price-asc', label: '価格が安い順' },
  { value: 'price-desc', label: '価格が高い順' },
  { value: 'tsubo-desc', label: '広い順' },
  { value: 'pertsubo-asc', label: '坪単価が安い順' },
] as const;

const PREFECTURES = ['すべて', ...Array.from(new Set(lands.map((l) => l.prefecture)))];

export default function LandsPage() {
  const [prefecture, setPrefecture] = useState('すべて');
  const [city, setCity] = useState('すべて');
  const [priceBand, setPriceBand] = useState<(typeof LAND_PRICE_BANDS)[number]['value']>('all');
  const [tsuboRange, setTsuboRange] = useState<(typeof TSUBO_RANGES)[number]['value']>('all');
  const [builderId, setBuilderId] = useState<string>('all');
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]['value']>('price-asc');
  const [showFilters, setShowFilters] = useState(false);

  const availableCities = useMemo(() => {
    const list = prefecture === 'すべて' ? lands : lands.filter((l) => l.prefecture === prefecture);
    return ['すべて', ...Array.from(new Set(list.map((l) => l.city)))];
  }, [prefecture]);

  const filtered = useMemo(() => {
    let list = lands.filter((l) => {
      if (prefecture !== 'すべて' && l.prefecture !== prefecture) return false;
      if (city !== 'すべて' && l.city !== city) return false;
      if (priceBand !== 'all') {
        const band = LAND_PRICE_BANDS.find((b) => b.value === priceBand)!;
        if (l.price < band.min || l.price > band.max) return false;
      }
      if (tsuboRange !== 'all') {
        const r = TSUBO_RANGES.find((x) => x.value === tsuboRange)!;
        if (l.tsubo < r.min || l.tsubo > r.max) return false;
      }
      if (builderId !== 'all' && l.builderId !== builderId) return false;
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
      case 'pertsubo-asc':
        list = list.sort((a, b) => a.pricePerTsubo - b.pricePerTsubo);
        break;
    }
    return list;
  }, [prefecture, city, priceBand, tsuboRange, builderId, sort]);

  const activeFilterCount =
    (prefecture !== 'すべて' ? 1 : 0) +
    (city !== 'すべて' ? 1 : 0) +
    (priceBand !== 'all' ? 1 : 0) +
    (tsuboRange !== 'all' ? 1 : 0) +
    (builderId !== 'all' ? 1 : 0);

  const resetFilters = () => {
    setPrefecture('すべて');
    setCity('すべて');
    setPriceBand('all');
    setTsuboRange('all');
    setBuilderId('all');
  };

  return (
    <>
      <PageHeader
        title="土地情報"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '土地情報' },
        ]}
        subtitle="ぺいほーむ提携工務店が取り扱う土地情報を比較検討"
      />

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          {/* ── 検索バー ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                工務店プランと組み合わせ可能な提携土地から、希望条件に合う物件を探しましょう
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
                    <Chip key={p} active={prefecture === p} onClick={() => { setPrefecture(p); setCity('すべて'); }}>
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
                  {LAND_PRICE_BANDS.map((b) => (
                    <Chip key={b.value} active={priceBand === b.value} onClick={() => setPriceBand(b.value)}>
                      {b.label}
                    </Chip>
                  ))}
                </FilterSection>

                <FilterSection label="広さ（坪）">
                  {TSUBO_RANGES.map((r) => (
                    <Chip key={r.value} active={tsuboRange === r.value} onClick={() => setTsuboRange(r.value)}>
                      {r.label}
                    </Chip>
                  ))}
                </FilterSection>

                <FilterSection label="工務店">
                  <Chip active={builderId === 'all'} onClick={() => setBuilderId('all')}>
                    すべて
                  </Chip>
                  {builders
                    .filter((b) => lands.some((l) => l.builderId === b.id))
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
              <span className="ml-1">件の土地</span>
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
              <p className="text-gray-500 mb-4">条件に該当する土地が見つかりませんでした</p>
              <button
                onClick={resetFilters}
                className="inline-block bg-[#E8740C] text-white font-bold px-6 py-2 rounded-full text-sm hover:bg-[#D4660A] transition"
              >
                条件をリセット
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((land) => {
                const builder = getBuilderById(land.builderId);
                const status = LAND_STATUS_LABELS[land.status];
                return (
                  <Link
                    key={land.id}
                    href={`/lands/${land.id}`}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#E8740C]/30 transition"
                  >
                    {/* image area */}
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 flex items-center justify-center">
                      <div className="text-center text-emerald-700/40">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8l6-6 6 6M5 8v12a1 1 0 001 1h12a1 1 0 001-1V8M5 8h14" />
                        </svg>
                        <p className="text-xs font-semibold">{land.tsubo}坪</p>
                      </div>
                      <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="p-5">
                      <p className="text-[10px] text-gray-500 mb-1">{land.prefecture} {land.city}</p>
                      <h3 className="text-base font-bold text-[#3D2200] mb-2 line-clamp-2 min-h-[2.5rem]">
                        {land.title}
                      </h3>
                      <p className="text-2xl font-extrabold text-[#E8740C] mb-1">
                        {land.price.toLocaleString()}
                        <span className="text-sm ml-1">万円</span>
                      </p>
                      <p className="text-[10px] text-gray-500 mb-3">坪単価 {land.pricePerTsubo}万円</p>

                      <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-600 mb-3 border-t border-gray-100 pt-3">
                        <div>
                          <div className="text-gray-400">面積</div>
                          <div className="font-bold text-[#3D2200]">{land.tsubo}坪</div>
                        </div>
                        <div>
                          <div className="text-gray-400">建ぺい率</div>
                          <div className="font-bold text-[#3D2200]">{land.buildingCoverage}%</div>
                        </div>
                        <div>
                          <div className="text-gray-400">容積率</div>
                          <div className="font-bold text-[#3D2200]">{land.floorAreaRatio}%</div>
                        </div>
                      </div>
                      {builder && (
                        <p className="text-[10px] text-gray-500 border-t border-gray-100 pt-3">
                          取扱：<span className="font-semibold text-[#3D2200]">{builder.name}</span>
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
