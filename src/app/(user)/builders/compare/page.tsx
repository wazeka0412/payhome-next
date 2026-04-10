'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import {
  builders as allBuilders,
  PRICE_BAND_LABELS,
  type BuilderData,
} from '@/lib/builders-data';
import {
  getCompareList,
  removeFromCompareList,
  clearCompareList,
  COMPARE_LIMIT,
} from '@/lib/comparison-store';

/**
 * 工務店比較ページ（最大3社）
 * v4.0 会員限定機能。クライアントサイドの localStorage shortlist から
 * builders-data.ts を引いて並べて比較表を表示する。
 */
export default function CompareBuildersPage() {
  const [items, setItems] = useState<BuilderData[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const list = getCompareList();
      const matched = list
        .map((e) => allBuilders.find((b) => b.id === e.id))
        .filter((b): b is BuilderData => Boolean(b));
      setItems(matched);
    };
    refresh();
    setHydrated(true);
    window.addEventListener('payhome:compare-changed', refresh);
    return () => window.removeEventListener('payhome:compare-changed', refresh);
  }, []);

  const handleRemove = (id: string) => {
    removeFromCompareList(id);
  };

  const handleClear = () => {
    if (confirm('比較リストをすべて空にしますか？')) {
      clearCompareList();
    }
  };

  if (!hydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="工務店比較"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '工務店一覧', href: '/builders' },
          { label: '比較' },
        ]}
        subtitle={`最大${COMPARE_LIMIT}社まで並べて比較できます`}
      />

      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4">
          {items.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
              <h2 className="text-lg font-bold text-[#3D2200] mb-3">
                比較リストは空です
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                工務店一覧で「比較に追加」を押すと、ここで並べて比較できます。
                <br />
                最大{COMPARE_LIMIT}社まで追加可能です。
              </p>
              <Link
                href="/builders"
                className="inline-block bg-[#E8740C] text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-[#D4660A] transition"
              >
                工務店一覧へ
              </Link>
            </div>
          ) : (
            <>
              {/* 操作バー */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-[#3D2200] text-lg">{items.length}</span>
                  <span className="ml-1">/ {COMPARE_LIMIT} 社を比較中</span>
                </p>
                <div className="flex gap-2">
                  <Link
                    href="/builders"
                    className="text-xs border border-gray-200 hover:border-[#E8740C] text-gray-700 hover:text-[#E8740C] px-4 py-2 rounded-full font-bold transition"
                  >
                    工務店を追加
                  </Link>
                  <button
                    onClick={handleClear}
                    className="text-xs text-gray-500 hover:text-red-500 px-3 py-2"
                  >
                    すべてクリア
                  </button>
                </div>
              </div>

              {/* 比較表 */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-x-auto shadow-sm">
                <table className="w-full text-sm" style={{ minWidth: items.length * 220 + 160 }}>
                  <thead>
                    <tr>
                      <th className="text-left px-4 py-4 bg-[#FFF8F0] border-b border-gray-100 w-32">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">項目</span>
                      </th>
                      {items.map((b) => (
                        <th key={b.id} className="text-left px-4 py-4 bg-white border-b border-gray-100 align-top">
                          <button
                            onClick={() => handleRemove(b.id)}
                            className="float-right text-gray-300 hover:text-red-500 text-xs"
                            aria-label="削除"
                          >
                            ✕
                          </button>
                          <Link href={`/builders/${b.id}`} className="block">
                            <p className="text-[10px] font-bold text-[#E8740C] mb-1">
                              {PRICE_BAND_LABELS[b.priceBand].description}
                            </p>
                            <p className="text-base font-extrabold text-[#3D2200] hover:underline mb-1">
                              {b.name}
                            </p>
                            <p className="text-[10px] text-gray-500">{b.region}</p>
                          </Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <Row label="キャッチコピー">
                      {items.map((b) => (
                        <td key={b.id} className="px-4 py-3 text-xs text-gray-700 align-top">
                          {b.catchphrase}
                        </td>
                      ))}
                    </Row>
                    <Row label="坪単価">
                      {items.map((b) => (
                        <td key={b.id} className="px-4 py-3 text-xs font-bold text-[#3D2200]">
                          {b.pricePerTsubo.min}〜{b.pricePerTsubo.max}万円
                        </td>
                      ))}
                    </Row>
                    <Row label="価格帯">
                      {items.map((b) => (
                        <td key={b.id} className="px-4 py-3 text-xs text-gray-700">
                          {PRICE_BAND_LABELS[b.priceBand].label}
                        </td>
                      ))}
                    </Row>
                    <Row label="年間施工棟数">
                      {items.map((b) => (
                        <td key={b.id} className="px-4 py-3 text-xs font-bold text-[#3D2200]">
                          約{b.annualBuilds}棟
                        </td>
                      ))}
                    </Row>
                    <Row label="創業">
                      {items.map((b) => (
                        <td key={b.id} className="px-4 py-3 text-xs text-gray-700">
                          {b.established}年
                        </td>
                      ))}
                    </Row>
                    <Row label="対応エリア">
                      {items.map((b) => (
                        <td key={b.id} className="px-4 py-3 text-[11px] text-gray-700">
                          {b.serviceCities.slice(0, 4).join(' / ')}
                          {b.serviceCities.length > 4 && ` 他${b.serviceCities.length - 4}市`}
                        </td>
                      ))}
                    </Row>
                    <Row label="得意分野">
                      {items.map((b) => (
                        <td key={b.id} className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {b.specialties.slice(0, 4).map((s) => (
                              <span
                                key={s}
                                className="text-[10px] bg-[#FFF8F0] text-[#E8740C] px-1.5 py-0.5 rounded font-semibold"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </Row>
                    <Row label="構造・工法">
                      {items.map((b) => (
                        <td key={b.id} className="px-4 py-3 text-xs text-gray-700">
                          {b.construction}
                        </td>
                      ))}
                    </Row>
                    <Row label="断熱性能">
                      {items.map((b) => (
                        <td key={b.id} className="px-4 py-3 text-xs text-gray-700">
                          {b.insulationGrade}
                        </td>
                      ))}
                    </Row>
                    <Row label="耐震等級">
                      {items.map((b) => (
                        <td key={b.id} className="px-4 py-3 text-xs text-gray-700">
                          {b.earthquakeGrade}
                        </td>
                      ))}
                    </Row>
                    <Row label="保証・アフター">
                      {items.map((b) => (
                        <td key={b.id} className="px-4 py-3 text-[11px] text-gray-700">
                          {b.warranty}
                        </td>
                      ))}
                    </Row>
                    <Row label="向いている方">
                      {items.map((b) => (
                        <td key={b.id} className="px-4 py-3 text-[11px] text-gray-700">
                          {b.suitableFor.join(' / ')}
                        </td>
                      ))}
                    </Row>
                    <tr>
                      <th className="text-left font-bold text-[#3D2200] bg-[#FFF8F0] px-4 py-4 align-top text-xs">
                        次のアクション
                      </th>
                      {items.map((b) => (
                        <td key={b.id} className="px-4 py-4 align-top">
                          <div className="space-y-2">
                            <Link
                              href={`/event?builder=${encodeURIComponent(b.name)}`}
                              className="block text-center bg-[#E8740C] text-white text-xs font-bold py-2 rounded-full hover:bg-[#D4660A] transition"
                            >
                              見学会予約
                            </Link>
                            <Link
                              href={`/builders/${b.id}`}
                              className="block text-center border border-[#E8740C] text-[#E8740C] text-xs font-bold py-2 rounded-full hover:bg-[#FFF8F0] transition"
                            >
                              詳しく見る
                            </Link>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 大型CTA */}
              <div className="mt-10 bg-[#E8740C] text-white rounded-2xl p-8 text-center">
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  気になる工務店が見つかりましたか？
                </h3>
                <p className="text-sm text-white/95 mb-5">
                  比較した中から選んで、見学会で実物を体感しましょう
                </p>
                <Link
                  href="/event"
                  className="inline-block bg-white text-[#E8740C] font-bold px-8 py-3 rounded-full text-sm hover:bg-gray-50 transition"
                >
                  見学会の日程一覧へ
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <th className="text-left font-bold text-[#3D2200] bg-[#FFF8F0] px-4 py-3 align-top text-xs">
        {label}
      </th>
      {children}
    </tr>
  );
}
