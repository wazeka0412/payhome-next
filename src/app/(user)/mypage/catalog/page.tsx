'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import { catalogs, CATALOG_REQUIREMENTS } from '@/lib/catalogs-data';
import { getOrCreateAnonymousId } from '@/lib/anonymous-id';

/**
 * デジタルカタログ受け取り画面（v4.0 開設記念キャンペーン）
 *
 * 受け取り条件:
 *  - 会員ログイン中
 *  - AI家づくり診断完了済み
 *
 * 未達の場合は条件未達画面を表示し、診断・登録への導線を見せる。
 * 達成済みの場合は2つのカタログカードを表示し、各カタログ詳細画面へ。
 */
export default function CatalogPage() {
  const { data: session, status } = useSession();
  const [diagnosisDone, setDiagnosisDone] = useState<boolean | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') {
      setDiagnosisDone(false);
      return;
    }
    const anonymousId = getOrCreateAnonymousId();
    fetch(`/api/ai/diagnosis/me?anonymous_id=${anonymousId}`)
      .then((r) => r.json())
      .then((res) => setDiagnosisDone(Boolean(res?.found)))
      .catch(() => setDiagnosisDone(false));
  }, [status]);

  if (status === 'loading' || diagnosisDone === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-gray-500">読み込み中...</div>
      </div>
    );
  }

  // ── 未ログイン ──
  if (status !== 'authenticated') {
    return (
      <Gate
        step={1}
        title="まずは無料会員登録"
        description="デジタルカタログの受け取りには無料会員登録が必要です。"
        primaryHref="/signup?redirect=/mypage/catalog"
        primaryLabel="無料会員登録する"
        secondaryHref="/login?redirect=/mypage/catalog"
        secondaryLabel="すでに会員の方はログイン"
      />
    );
  }

  // ── 会員だが診断未完了 ──
  if (!diagnosisDone) {
    return (
      <Gate
        step={2}
        title="あと1ステップ｜AI家づくり診断"
        description="10問・約2分のAI家づくり診断を完了すると、デジタルカタログを受け取れます。"
        primaryHref="/diagnosis"
        primaryLabel="AI家づくり診断をはじめる"
        secondaryHref="/mypage"
        secondaryLabel="マイページに戻る"
      />
    );
  }

  // ── 受け取り画面 ──
  return (
    <>
      <PageHeader
        title="デジタルカタログ"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: 'マイページ', href: '/mypage' },
          { label: 'デジタルカタログ' },
        ]}
        subtitle="ぺいほーむ住宅ポータルサイト開設記念プレゼント"
      />

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* 完了バッジ */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-green-900">受け取り条件をクリア！</p>
              <p className="text-xs text-green-700 mt-0.5">
                以下のデジタルカタログをご覧いただけます。
              </p>
            </div>
          </div>

          {/* カタロググリッド */}
          <div className="grid md:grid-cols-2 gap-6">
            {catalogs.map((cat) => (
              <Link
                key={cat.id}
                href={`/mypage/catalog/${cat.id}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-[#E8740C]/30 transition-all"
              >
                {/* カバー */}
                <div className={`relative aspect-[3/2] bg-gradient-to-br ${cat.coverGradient} flex items-center justify-center p-8`}>
                  <div className="absolute top-4 left-4 bg-white/95 text-[#E8740C] text-[10px] font-bold px-3 py-1 rounded-full tracking-wider">
                    {cat.code}
                  </div>
                  <div className="absolute top-4 right-4 bg-yellow-400 text-[#3D2200] text-[10px] font-bold px-3 py-1 rounded-full">
                    {cat.badge}
                  </div>
                  <div className="text-center text-white">
                    <h2 className="text-xl md:text-2xl font-extrabold leading-tight mb-2">
                      {cat.title}
                    </h2>
                    <p className="text-xs opacity-90">{cat.subtitle}</p>
                    <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm text-xs px-3 py-1 rounded-full">
                      全 {cat.totalPages} ページ
                    </div>
                  </div>
                </div>

                {/* 内容 */}
                <div className="p-6">
                  <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3 min-h-[3.5rem]">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-[#E8740C] group-hover:underline">
                    カタログを開く →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* 戻るリンク */}
          <div className="mt-10 text-center">
            <Link
              href="/mypage"
              className="text-sm text-gray-500 hover:text-[#E8740C] font-bold"
            >
              ← マイページに戻る
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * 受け取り条件未達時のゲート画面（共通）
 */
function Gate({
  step,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  step: 1 | 2;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <>
      <PageHeader
        title="デジタルカタログ"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: 'デジタルカタログ' },
        ]}
        subtitle="ぺいほーむ住宅ポータルサイト開設記念プレゼント"
      />

      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* ステップインジケータ */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {CATALOG_REQUIREMENTS.map((req, i) => {
              const stepNum = i + 1;
              const completed = stepNum < step;
              const active = stepNum === step;
              return (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold ${
                      completed
                        ? 'bg-green-500 text-white'
                        : active
                          ? 'bg-[#E8740C] text-white'
                          : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {completed ? '✓' : stepNum}
                  </div>
                  <span
                    className={`ml-2 text-xs hidden sm:inline ${
                      completed
                        ? 'text-green-700 font-bold'
                        : active
                          ? 'text-[#3D2200] font-bold'
                          : 'text-gray-400'
                    }`}
                  >
                    {req}
                  </span>
                  {i < CATALOG_REQUIREMENTS.length - 1 && (
                    <span className="mx-3 text-gray-300">→</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* メインカード */}
          <div className="bg-white rounded-3xl border border-[#E8740C]/20 shadow-xl p-8 md:p-12 text-center">
            <div className="inline-flex items-center gap-2 bg-[#FFF8F0] text-[#E8740C] text-xs font-bold px-4 py-2 rounded-full mb-4">
              ぺいほーむ住宅ポータルサイト開設記念
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#3D2200] mb-4 leading-tight">
              {title}
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto">
              {description}
            </p>

            {/* プレビュー */}
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
              {catalogs.map((cat) => (
                <div
                  key={cat.id}
                  className={`relative bg-gradient-to-br ${cat.coverGradient} rounded-2xl p-5 text-white aspect-[3/4] flex flex-col justify-end opacity-70`}
                >
                  <div className="absolute top-2 left-2 bg-white/95 text-[#E8740C] text-[8px] font-bold px-2 py-0.5 rounded-full tracking-wider">
                    {cat.code}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="relative">
                    <p className="text-[10px] font-bold leading-tight">{cat.title}</p>
                    <p className="text-[8px] opacity-80 mt-0.5">{cat.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={primaryHref}
                className="bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold px-8 py-3.5 rounded-full text-sm transition shadow-[0_4px_12px_rgba(232,116,12,0.3)]"
              >
                {primaryLabel} →
              </Link>
              <Link
                href={secondaryHref}
                className="border border-gray-200 hover:border-[#E8740C] text-gray-700 hover:text-[#E8740C] font-bold px-8 py-3.5 rounded-full text-sm transition"
              >
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
