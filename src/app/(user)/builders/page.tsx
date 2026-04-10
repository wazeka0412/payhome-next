'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import {
  builders,
  ALL_SPECIALTIES,
  PRICE_BAND_LABELS,
  getAllCities,
  getAllPrefectures,
  type PriceBand,
} from '@/lib/builders-data';
import CompareToggleButton from '@/components/builders/CompareToggleButton';

const PREFECTURES = ['すべて', ...getAllPrefectures().map((p) => p.replace('県', ''))];
const CITIES = getAllCities();
const PRICE_BANDS: { value: PriceBand | 'all'; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'low', label: PRICE_BAND_LABELS.low.label },
  { value: 'mid', label: PRICE_BAND_LABELS.mid.label },
  { value: 'high', label: PRICE_BAND_LABELS.high.label },
  { value: 'premium', label: PRICE_BAND_LABELS.premium.label },
];
const SORT_OPTIONS = [
  { value: 'builds-desc', label: '施工棟数が多い順' },
  { value: 'price-asc', label: '価格が安い順' },
  { value: 'established-asc', label: '創業が古い順' },
] as const;

export default function BuildersPage() {
  const [prefecture, setPrefecture] = useState('すべて');
  const [city, setCity] = useState('all');
  const [priceBand, setPriceBand] = useState<PriceBand | 'all'>('all');
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]['value']>('builds-desc');
  const [showFilters, setShowFilters] = useState(false);

  // ── フィルタ + ソート ──
  const filtered = useMemo(() => {
    let list = builders.filter((b) => {
      // 県フィルタ
      if (prefecture !== 'すべて' && !b.area.includes(prefecture)) return false;
      // 市フィルタ
      if (city !== 'all' && !b.serviceCities.includes(city)) return false;
      // 価格帯
      if (priceBand !== 'all' && b.priceBand !== priceBand) return false;
      // 特徴タグ（AND検索）
      if (selectedSpecs.length > 0) {
        const hasAll = selectedSpecs.every((s) => b.specialties.includes(s));
        if (!hasAll) return false;
      }
      // キーワード
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        const hay = `${b.name} ${b.catchphrase} ${b.description} ${b.specialties.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    // ソート
    switch (sort) {
      case 'builds-desc':
        list = list.sort((a, b) => b.annualBuilds - a.annualBuilds);
        break;
      case 'price-asc':
        list = list.sort((a, b) => a.pricePerTsubo.min - b.pricePerTsubo.min);
        break;
      case 'established-asc':
        list = list.sort((a, b) => a.established - b.established);
        break;
    }
    return list;
  }, [prefecture, city, priceBand, selectedSpecs, keyword, sort]);

  const toggleSpec = (spec: string) => {
    setSelectedSpecs((prev) => (prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]));
  };

  const resetFilters = () => {
    setPrefecture('すべて');
    setCity('all');
    setPriceBand('all');
    setSelectedSpecs([]);
    setKeyword('');
  };

  const activeFilterCount =
    (prefecture !== 'すべて' ? 1 : 0) +
    (city !== 'all' ? 1 : 0) +
    (priceBand !== 'all' ? 1 : 0) +
    selectedSpecs.length +
    (keyword.trim() ? 1 : 0);

  // 県に応じて市を絞る
  const availableCities = useMemo(() => {
    if (prefecture === 'すべて') return CITIES;
    return CITIES.filter((c) =>
      builders.some((b) => b.area.includes(prefecture) && b.serviceCities.includes(c))
    );
  }, [prefecture]);

  return (
    <>
      <PageHeader
        title="工務店一覧"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '工務店一覧' },
        ]}
        subtitle="ぺいほーむが取材した提携工務店を条件で比較検討"
      />

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          {/* ── 検索バー（キーワード + フィルタートグル） ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="工務店名・特徴でキーワード検索"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M9 17a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </div>
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border transition ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-[#E8740C] text-white border-[#E8740C]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#E8740C]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                絞り込み
                {activeFilterCount > 0 && (
                  <span className="bg-white text-[#E8740C] text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[18px] text-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* ── 展開されるフィルタパネル ── */}
            {showFilters && (
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-5">
                {/* 県 */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 tracking-wide">エリア（県）</label>
                  <div className="flex flex-wrap gap-2">
                    {PREFECTURES.map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setPrefecture(p);
                          setCity('all');
                        }}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                          prefecture === p
                            ? 'bg-[#E8740C] text-white border-[#E8740C]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-[#E8740C] hover:text-[#E8740C]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 市 */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 tracking-wide">
                    対応市町村
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setCity('all')}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                        city === 'all'
                          ? 'bg-[#E8740C] text-white border-[#E8740C]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#E8740C] hover:text-[#E8740C]'
                      }`}
                    >
                      すべて
                    </button>
                    {availableCities.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCity(c)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                          city === c
                            ? 'bg-[#E8740C] text-white border-[#E8740C]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-[#E8740C] hover:text-[#E8740C]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 価格帯 */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 tracking-wide">価格帯（本体価格の目安）</label>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_BANDS.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setPriceBand(p.value)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                          priceBand === p.value
                            ? 'bg-[#E8740C] text-white border-[#E8740C]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-[#E8740C] hover:text-[#E8740C]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* タグ */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 tracking-wide">
                    特徴タグ（複数選択可 / AND検索）
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SPECIALTIES.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleSpec(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                          selectedSpecs.includes(s)
                            ? 'bg-[#E8740C] text-white border-[#E8740C]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-[#E8740C] hover:text-[#E8740C]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* リセット */}
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

          {/* ── 結果件数 + ソート ── */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-[#3D2200] text-lg">{filtered.length}</span>
              <span className="ml-1">社の工務店</span>
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

          {/* ── 工務店グリッド ── */}
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
              <p className="text-gray-500 mb-4">条件に該当する工務店が見つかりませんでした</p>
              <button
                onClick={resetFilters}
                className="inline-block bg-[#E8740C] text-white font-bold px-6 py-2 rounded-full text-sm hover:bg-[#D4660A] transition"
              >
                条件をリセット
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((builder) => (
                <div
                  key={builder.id}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#E8740C]/30 transition"
                >
                  {/* カードヘッダ */}
                  <div className="relative h-28 bg-gradient-to-br from-[#FFF8F0] via-[#FFF3E6] to-[#FFECD4] p-5 flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-[#E8740C] mb-1 tracking-wider">
                        {PRICE_BAND_LABELS[builder.priceBand].description.toUpperCase()}
                      </p>
                      <h3 className="text-lg font-extrabold text-[#3D2200] truncate">
                        {builder.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">{builder.region}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-[10px] text-gray-500 mb-0.5">年間施工</p>
                      <p className="text-xl font-extrabold text-[#E8740C] leading-none">
                        {builder.annualBuilds}
                        <span className="text-xs ml-0.5">棟</span>
                      </p>
                    </div>
                  </div>

                  {/* ボディ */}
                  <div className="p-5">
                    <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2 min-h-[2.5rem]">
                      {builder.catchphrase}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {builder.specialties.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="text-[10px] bg-[#FFF8F0] text-[#E8740C] px-2 py-0.5 rounded font-semibold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-1.5 mb-4 text-[11px] text-gray-500 border-t border-gray-100 pt-3">
                      <div className="flex justify-between">
                        <span>坪単価</span>
                        <span className="font-bold text-[#3D2200]">
                          {builder.pricePerTsubo.min}〜{builder.pricePerTsubo.max}万円
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>創業</span>
                        <span className="font-bold text-[#3D2200]">{builder.established}年</span>
                      </div>
                      <div className="flex justify-between">
                        <span>耐震</span>
                        <span className="font-bold text-[#3D2200]">{builder.earthquakeGrade}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-2">
                      <Link
                        href={`/builders/${builder.id}`}
                        className="flex-1 text-center bg-[#E8740C] text-white text-xs font-bold py-2.5 rounded-full hover:bg-[#D4660A] transition"
                      >
                        詳しく見る
                      </Link>
                      <Link
                        href={`/event?builder=${encodeURIComponent(builder.name)}`}
                        className="flex-1 text-center border border-[#E8740C] text-[#E8740C] text-xs font-bold py-2.5 rounded-full hover:bg-[#FFF8F0] transition"
                      >
                        見学会予約
                      </Link>
                    </div>
                    <CompareToggleButton builderId={builder.id} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 比較ページへのフッターナビ */}
          <div className="mt-10 text-center">
            <Link
              href="/builders/compare"
              className="inline-flex items-center gap-2 text-sm text-[#E8740C] font-bold hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              比較リストを見る（最大3社まで）
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
