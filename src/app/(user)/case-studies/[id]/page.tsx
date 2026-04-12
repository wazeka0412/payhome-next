'use client';

import { use, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import {
  caseStudies,
  getCaseStudyById,
  FREE_VIEW_LIMIT,
  type CaseStudy,
} from '@/lib/case-studies-data';
import { getBuilderById } from '@/lib/builders-data';
import FavoriteButton from '@/components/ui/FavoriteButton';

/**
 * 完成事例詳細ページ
 *
 * v4.0 会員ゲート: 非会員は上位5件までは閲覧可。
 * 6件目以降の詳細にアクセスした場合は会員登録CTAを表示。
 */
export default function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { status } = useSession();
  const caseStudy = getCaseStudyById(id);
  const isMember = status === 'authenticated';

  // 新しい順でソートした配列内でのランクを計算（非会員5件の判定用）
  const sortedByNewest = [...caseStudies].sort((a, b) =>
    b.completedAt.localeCompare(a.completedAt)
  );
  const rank = sortedByNewest.findIndex((c) => c.id === id);
  const isGated = !isMember && rank >= FREE_VIEW_LIMIT;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!caseStudy) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-gray-500">事例が見つかりません</p>
      </div>
    );
  }

  // ハイドレーション前は仮のスケルトンを返してCLS防止
  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-gray-500">読み込み中...</div>
      </div>
    );
  }

  // ── 会員限定ゲート ──
  if (isGated) {
    return (
      <>
        <PageHeader
          title="平屋事例ライブラリ"
          breadcrumbs={[
            { label: 'ホーム', href: '/' },
            { label: '平屋事例ライブラリ', href: '/case-studies' },
            { label: caseStudy.title },
          ]}
        />
        <section className="py-16 md:py-24">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="w-16 h-16 mx-auto mb-5 bg-[#FFF8F0] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#E8740C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-[10px] font-bold text-[#E8740C] tracking-widest mb-2">MEMBER REGISTRATION</p>
            <h1 className="text-2xl font-extrabold text-[#3D2200] mb-3 leading-tight">
              会員登録で、家づくりが一気に進みます
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              事例ライブラリ全件閲覧・間取り図フル解像度・お気に入り保存・AI診断結果の保存まで全て無料です。
              (非会員は新着{FREE_VIEW_LIMIT}件まで閲覧可)
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href={`/signup?redirect=/case-studies/${id}`}
                className="bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold px-6 py-3 rounded-full text-sm transition shadow-md"
              >
                無料会員登録して見る →
              </Link>
              <Link
                href={`/login?redirect=/case-studies/${id}`}
                className="text-xs text-gray-500 hover:text-[#E8740C]"
              >
                すでに会員の方はログイン →
              </Link>
              <Link href="/case-studies" className="text-xs text-gray-400 hover:text-[#E8740C] mt-2">
                ← 事例一覧に戻る
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return <CaseStudyContent caseStudy={caseStudy} />;
}

function CaseStudyContent({ caseStudy }: { caseStudy: CaseStudy }) {
  const { status } = useSession();
  const isMember = status === 'authenticated';
  const builder = getBuilderById(caseStudy.builderId);

  // 同工務店の他事例（最大3件）
  const relatedCases = caseStudies
    .filter((c) => c.builderId === caseStudy.builderId && c.id !== caseStudy.id)
    .slice(0, 3);

  return (
    <>
      <PageHeader
        title={caseStudy.title}
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '平屋事例ライブラリ', href: '/case-studies' },
          { label: caseStudy.title },
        ]}
        subtitle={caseStudy.catchphrase}
      />

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#FFF8F0] via-[#FFF3E6] to-[#FFECD4]">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-[#E8740C] text-white text-[10px] font-bold px-3 py-1 rounded-full">
              完成事例
            </span>
            <span className="text-xs text-gray-600">
              {caseStudy.prefecture} {caseStudy.city} / {caseStudy.completedAt} 完成 / {caseStudy.familyStructure}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#3D2200] mb-3 leading-tight">
            {caseStudy.title}
          </h1>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-6 max-w-3xl">
            {caseStudy.description}
          </p>

          <div className="flex items-center gap-3 mb-6">
            <FavoriteButton contentType="case_study" contentId={caseStudy.id} />
          </div>

          {/* 総額 + KPI */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6">
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">総額（本体 + 土地 + 諸費用）</p>
              <p className="text-4xl md:text-5xl font-extrabold text-[#E8740C] leading-none">
                {caseStudy.totalPrice.toLocaleString()}
                <span className="text-xl ml-2 text-[#3D2200]">万円</span>
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              <Stat label="間取り" value={caseStudy.layout} />
              <Stat label="建物" value={`${caseStudy.tsubo}坪（${caseStudy.buildingArea}㎡）`} />
              <Stat label="敷地" value={`${caseStudy.landArea}㎡`} />
              <Stat label="本体価格" value={`${caseStudy.buildingPrice.toLocaleString()}万円`} />
            </div>
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          {/* ── 外観・内観写真ギャラリー ── */}
          <PhotoGallery photos={caseStudy.photos} title={caseStudy.title} />

          {/* ── 設計のポイント ── */}
          <div>
            <SectionTitle>設計のポイント</SectionTitle>
            <div className="grid md:grid-cols-3 gap-4">
              {caseStudy.designPoints.map((p, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6">
                  <div className="w-10 h-10 bg-[#E8740C] text-white rounded-full flex items-center justify-center font-extrabold mb-3">
                    {idx + 1}
                  </div>
                  <p className="text-sm font-bold text-[#3D2200] leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── 間取り図 (会員限定) ── */}
          <div>
            <SectionTitle>間取り図</SectionTitle>
            <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {/* 間取り図 SVG (非会員はブラー) */}
              <div
                className={`relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300 ${
                  isMember ? '' : 'blur-md scale-105'
                }`}
              >
                <svg
                  viewBox="0 0 600 450"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* 外壁 */}
                  <rect x="40" y="40" width="520" height="370" fill="none" stroke="#3D2200" strokeWidth="3" />
                  {/* LDK */}
                  <rect x="40" y="40" width="300" height="220" fill="#FFF8F0" stroke="#3D2200" strokeWidth="1.5" />
                  <text x="190" y="160" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#3D2200">LDK</text>
                  <text x="190" y="180" textAnchor="middle" fontSize="10" fill="#6B7280">{Math.round(caseStudy.buildingArea * 0.4)}㎡</text>
                  {/* 主寝室 */}
                  <rect x="340" y="40" width="220" height="150" fill="#FFECD4" stroke="#3D2200" strokeWidth="1.5" />
                  <text x="450" y="120" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#3D2200">主寝室</text>
                  <text x="450" y="140" textAnchor="middle" fontSize="10" fill="#6B7280">{Math.round(caseStudy.buildingArea * 0.15)}㎡</text>
                  {/* 子ども部屋 / 洋室 */}
                  <rect x="340" y="190" width="110" height="120" fill="#FFF3E6" stroke="#3D2200" strokeWidth="1.5" />
                  <text x="395" y="255" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#3D2200">洋室1</text>
                  <rect x="450" y="190" width="110" height="120" fill="#FFF3E6" stroke="#3D2200" strokeWidth="1.5" />
                  <text x="505" y="255" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#3D2200">洋室2</text>
                  {/* 水回り */}
                  <rect x="40" y="260" width="150" height="150" fill="#E8F4FD" stroke="#3D2200" strokeWidth="1.5" />
                  <text x="115" y="340" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#3D2200">水回り</text>
                  {/* 玄関 */}
                  <rect x="190" y="260" width="150" height="150" fill="#F0FDF4" stroke="#3D2200" strokeWidth="1.5" />
                  <text x="265" y="340" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#3D2200">玄関</text>
                  {/* WIC */}
                  <rect x="340" y="310" width="220" height="100" fill="#FAF5FF" stroke="#3D2200" strokeWidth="1.5" />
                  <text x="450" y="365" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#3D2200">WIC・収納</text>
                  {/* ラベル */}
                  <text x="300" y="430" textAnchor="middle" fontSize="11" fill="#6B7280">
                    {caseStudy.layout} / {caseStudy.tsubo}坪（{caseStudy.buildingArea}㎡）
                  </text>
                </svg>
              </div>

              {/* 非会員向けロックオーバーレイ */}
              {!isMember && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-white/80 via-white/70 to-white/80 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-xl border border-[#E8740C]/20 p-6 md:p-8 max-w-sm mx-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-[#FFF8F0] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#E8740C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-[#3D2200] mb-2">
                      会員登録で間取り図を閲覧
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-5">
                      間取り図の詳細は、無料会員登録でご覧いただけます。
                      寸法・収納配置・動線まで確認して、家づくりの参考にしましょう。
                    </p>
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/signup?redirect=/case-studies/${caseStudy.id}`}
                        className="bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold px-6 py-2.5 rounded-full text-sm transition shadow-md"
                      >
                        無料会員登録して見る →
                      </Link>
                      <Link
                        href={`/login?redirect=/case-studies/${caseStudy.id}`}
                        className="text-xs text-gray-500 hover:text-[#E8740C] transition"
                      >
                        すでに会員の方はログイン →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 会員向け表示ラベル */}
              {isMember && (
                <div className="absolute bottom-3 left-3 bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full">
                  ✓ 会員限定：間取り図を閲覧中
                </div>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              ※ 間取り図はイメージです。実際の設計と異なる場合があります。
            </p>
          </div>

          {/* ── 費用内訳 ── */}
          <div>
            <SectionTitle>費用の内訳</SectionTitle>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <Row label="建物本体価格" value={`${caseStudy.buildingPrice.toLocaleString()} 万円`} />
                  <Row
                    label="土地価格"
                    value={caseStudy.landPrice ? `${caseStudy.landPrice.toLocaleString()} 万円` : '（土地あり）'}
                  />
                  <Row
                    label="諸費用（目安）"
                    value={`${Math.round(caseStudy.buildingPrice * 0.08).toLocaleString()} 万円`}
                  />
                  <Row
                    label="総額"
                    value={`${caseStudy.totalPrice.toLocaleString()} 万円`}
                    highlight
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* ── 物件情報 ── */}
          <div>
            <SectionTitle>物件情報</SectionTitle>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <Row label="所在地" value={`${caseStudy.prefecture} ${caseStudy.city}`} />
                  <Row label="家族構成" value={caseStudy.familyStructure} />
                  <Row label="間取り" value={caseStudy.layout} />
                  <Row label="建物面積" value={`${caseStudy.buildingArea} ㎡（${caseStudy.tsubo}坪）`} />
                  <Row label="敷地面積" value={`${caseStudy.landArea} ㎡`} />
                  <Row label="完成時期" value={caseStudy.completedAt} />
                  {builder && <Row label="施工会社" value={builder.name} />}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── 施主コメント ── */}
          <div>
            <SectionTitle>施主様の声</SectionTitle>
            <div className="bg-[#FFF8F0] border border-[#E8740C]/20 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#E8740C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#E8740C]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm md:text-base text-[#3D2200] leading-relaxed mb-3">
                    {caseStudy.ownerComment}
                  </p>
                  <p className="text-xs text-gray-500">— {caseStudy.familyStructure}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── タグ ── */}
          <div>
            <SectionTitle>特徴タグ</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {caseStudy.tags.map((t) => (
                <span
                  key={t}
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs font-semibold"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* ── 施工会社 ── */}
          {builder && (
            <div>
              <SectionTitle>施工会社</SectionTitle>
              <Link
                href={`/builders/${builder.id}`}
                className="block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-[#E8740C]/30 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#FFF8F0] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] text-gray-400">LOGO</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-[#3D2200] mb-1">{builder.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {builder.area} / 創業{builder.established}年 / 年間{builder.annualBuilds}棟
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2">{builder.catchphrase}</p>
                  </div>
                  <span className="text-xs font-bold text-[#E8740C] self-center">詳しく見る →</span>
                </div>
              </Link>
            </div>
          )}

          {/* ── 大型CTA ── */}
          <div className="relative overflow-hidden rounded-2xl bg-[#E8740C] text-white p-8 md:p-12 shadow-xl">
            <p className="text-xs font-bold tracking-wider mb-2 opacity-90">NEXT STEP</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
              あなたもこんな家を建てませんか？
            </h2>
            <p className="text-sm md:text-base text-white/95 mb-6 leading-relaxed max-w-2xl">
              AI家づくり診断で相性を確認したり、見学会で実物を体感できます。
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/diagnosis"
                className="inline-flex items-center justify-center bg-white text-[#E8740C] font-bold px-8 py-3.5 rounded-full text-sm hover:bg-gray-50 transition shadow-lg"
              >
                AI家づくり診断を受ける
              </Link>
              {builder && (
                <Link
                  href={`/event?builder=${encodeURIComponent(builder.name)}`}
                  className="inline-flex items-center justify-center bg-white/15 backdrop-blur-sm border border-white/40 text-white font-bold px-8 py-3.5 rounded-full text-sm hover:bg-white/25 transition"
                >
                  {builder.name}の見学会を予約
                </Link>
              )}
            </div>
          </div>

          {/* ── 同じ工務店の他の事例 ── */}
          {relatedCases.length > 0 && builder && (
            <div>
              <SectionTitle>{builder.name}の他の完成事例</SectionTitle>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedCases.map((cs) => (
                  <Link
                    key={cs.id}
                    href={`/case-studies/${cs.id}`}
                    className="block bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-[#E8740C]/30 transition"
                  >
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 bg-[#E8740C] text-white">
                      {cs.completedAt} 完成
                    </span>
                    <h3 className="text-sm font-bold text-[#3D2200] line-clamp-2 mb-2 min-h-[2rem]">
                      {cs.title}
                    </h3>
                    <p className="text-xl font-extrabold text-[#E8740C] mb-2">
                      {cs.totalPrice.toLocaleString()}
                      <span className="text-xs ml-1">万円</span>
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {cs.layout} / {cs.tsubo}坪 / {cs.city}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl md:text-2xl font-bold text-[#3D2200] mb-5 flex items-center gap-3">
      <span className="w-1 h-6 bg-[#E8740C] rounded-full" />
      {children}
    </h2>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-gray-500 mb-1">{label}</div>
      <div className="text-sm md:text-base font-bold text-[#3D2200]">{value}</div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <tr className={`border-b border-gray-100 last:border-b-0 ${highlight ? 'bg-[#FFF8F0]' : ''}`}>
      <th className="text-left font-bold text-[#3D2200] bg-[#FFF8F0] px-5 py-3 w-32 md:w-40 align-top text-xs md:text-sm">
        {label}
      </th>
      <td className={`px-5 py-3 text-xs md:text-sm ${highlight ? 'text-[#E8740C] font-extrabold text-lg' : 'text-gray-700'}`}>
        {value}
      </td>
    </tr>
  );
}

/**
 * 外観・内観写真ギャラリー (約20枚)
 *
 * 外観タブ / 内観タブで切り替え可能。
 * メイン画像 + サムネイルリストの構成。
 */
function PhotoGallery({
  photos,
  title,
}: {
  photos: import('@/lib/case-studies-data').CaseStudyPhoto[];
  title: string;
}) {
  const [tab, setTab] = useState<'exterior' | 'interior'>('exterior');
  const filtered = photos.filter((p) => p.category === tab);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = filtered[selectedIndex] || filtered[0];

  // タブ切り替え時にインデックスをリセット
  const handleTabChange = (newTab: 'exterior' | 'interior') => {
    setTab(newTab);
    setSelectedIndex(0);
  };

  if (!photos || photos.length === 0) return null;

  const exteriorCount = photos.filter((p) => p.category === 'exterior').length;
  const interiorCount = photos.filter((p) => p.category === 'interior').length;

  return (
    <div>
      <SectionTitle>外観・内観写真</SectionTitle>

      {/* タブ */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleTabChange('exterior')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition cursor-pointer ${
            tab === 'exterior'
              ? 'bg-[#E8740C] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          外観 ({exteriorCount})
        </button>
        <button
          onClick={() => handleTabChange('interior')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition cursor-pointer ${
            tab === 'interior'
              ? 'bg-[#E8740C] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          内観 ({interiorCount})
        </button>
      </div>

      {/* メイン画像 */}
      {selected && (
        <div className="bg-gray-100 rounded-2xl overflow-hidden mb-3 aspect-[4/3] flex items-center justify-center">
          {/* MVP: プレースホルダ (実運用では <Image> で実写真を表示) */}
          <div className="w-full h-full bg-gradient-to-br from-[#FFF8F0] via-[#FFF3E6] to-[#FFECD4] flex flex-col items-center justify-center p-8 text-center">
            <div className="text-4xl mb-3">
              {tab === 'exterior' ? '🏠' : '🛋️'}
            </div>
            <p className="text-base font-bold text-[#3D2200] mb-1">
              {selected.alt}
            </p>
            <p className="text-xs text-gray-500">
              {selectedIndex + 1} / {filtered.length} 枚
            </p>
            <p className="text-[10px] text-gray-400 mt-3">
              ※ 実際の施工写真は準備中です
            </p>
          </div>
        </div>
      )}

      {/* サムネイルリスト */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filtered.map((photo, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
              idx === selectedIndex
                ? 'border-[#E8740C] shadow-md'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <div className={`w-full h-full flex items-center justify-center text-[10px] font-bold ${
              tab === 'exterior'
                ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700'
                : 'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700'
            }`}>
              {idx + 1}
            </div>
          </button>
        ))}
      </div>

      <p className="text-[10px] text-gray-400 mt-2">
        {tab === 'exterior' ? '外観' : '内観'}写真 {filtered.length} 枚 — {title}
      </p>
    </div>
  );
}
