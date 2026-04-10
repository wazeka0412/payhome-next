'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import { getOrCreateAnonymousId } from '@/lib/anonymous-id';
import { getCompareCount } from '@/lib/comparison-store';

/**
 * マイページ（v4.0 MVP）
 * REQUIREMENTS.md 5.0 / 6.2 準拠。
 *
 * 表示項目（実データ接続済み）：
 *  - プロフィール概要
 *  - お気に入り件数（API live）
 *  - AI診断結果（API live + user_type 表示）
 *  - 比較リスト件数（localStorage live）
 */

interface FavoriteRow {
  id: string;
  content_type: string;
  content_id: string;
}
interface DiagnosisSession {
  id: string;
  user_type: string;
  recommended_builders: Array<{ name?: string; builder_id?: string }>;
}

export default function MyPage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [diagnosis, setDiagnosis] = useState<DiagnosisSession | null>(null);
  const [compareCount, setCompareCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (status !== 'authenticated') {
      setDataLoading(false);
      return;
    }
    const anonymousId = getOrCreateAnonymousId();
    Promise.allSettled([
      fetch(`/api/favorites?anonymous_id=${anonymousId}`).then((r) => r.json()),
      fetch(`/api/ai/diagnosis/me?anonymous_id=${anonymousId}`).then((r) => r.json()),
    ])
      .then(([favRes, diagRes]) => {
        if (favRes.status === 'fulfilled' && Array.isArray(favRes.value)) {
          setFavorites(favRes.value.filter((f: FavoriteRow) => f.content_id));
        }
        if (diagRes.status === 'fulfilled' && diagRes.value?.found && diagRes.value.session) {
          setDiagnosis(diagRes.value.session);
        }
      })
      .finally(() => setDataLoading(false));

    setCompareCount(getCompareCount());
    const handler = () => setCompareCount(getCompareCount());
    window.addEventListener('payhome:compare-changed', handler);
    return () => window.removeEventListener('payhome:compare-changed', handler);
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-3">ログインが必要です</h1>
          <p className="text-sm text-gray-500 mb-6">
            マイページを利用するには会員登録またはログインが必要です。
          </p>
          <div className="space-y-3">
            <Link
              href="/login?redirect=/mypage"
              className="block w-full bg-[#E8740C] text-white font-bold py-3 rounded-xl hover:bg-[#D4660A] transition text-sm"
            >
              ログイン
            </Link>
            <Link
              href="/signup?redirect=/mypage"
              className="block w-full border border-[#E8740C] text-[#E8740C] font-bold py-3 rounded-xl hover:bg-[#FFF8F0] transition text-sm"
            >
              新規会員登録
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const user = session.user as { name?: string | null; email?: string | null };

  // 集計
  const favCount = favorites.length;
  const propertyFavCount = favorites.filter((f) => f.content_type === 'property').length;
  const builderFavCount = favorites.filter((f) => f.content_type === 'builder').length;
  const saleHomeFavCount = favorites.filter((f) => f.content_type === 'sale_home').length;
  const landFavCount = favorites.filter((f) => f.content_type === 'land').length;

  return (
    <>
      <PageHeader
        title="マイページ"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: 'マイページ' },
        ]}
        subtitle={`${user.name || user.email} さん`}
      />

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* プロフィール概要 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E8740C] to-[#F5A623] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {(user.name || user.email || '?')[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-[#3D2200] mb-1 truncate">
                  {user.name || 'ユーザー'}
                </h2>
                <p className="text-sm text-gray-500 mb-3 truncate">{user.email}</p>
                <Link
                  href="/diagnosis"
                  className="inline-block bg-[#E8740C] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#D4660A] transition"
                >
                  AI家づくり診断を受ける
                </Link>
              </div>
            </div>
          </div>

          {/* Smart Match プロモ：連絡の相性設定 */}
          <div className="bg-white border-2 border-[#E8740C]/40 rounded-2xl p-5 md:p-6 mb-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex w-12 h-12 bg-[#FFF8F0] rounded-full flex-shrink-0 items-center justify-center">
                <svg className="w-6 h-6 text-[#E8740C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold tracking-widest text-[#E8740C] mb-1">
                  SMART MATCH｜連絡の相性設計
                </p>
                <h2 className="text-base md:text-lg font-bold text-[#3D2200] mb-1 leading-tight">
                  お互いのペースで、ベストな家づくりを
                </h2>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  ご希望の連絡手段・時間帯を事前にお伝えすることで、工務店様はより最適なご提案を準備できます。お互いの時間を大切にする仕組みです。
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/mypage/contact-preferences"
                    className="inline-flex items-center gap-2 bg-[#E8740C] hover:bg-[#D4660A] text-white text-xs font-bold px-5 py-2 rounded-full transition"
                  >
                    連絡の相性を設定する →
                  </Link>
                  <Link
                    href="/mypage/feedback"
                    className="inline-flex items-center gap-1.5 text-xs text-[#E8740C] font-bold hover:underline"
                  >
                    ぺいほーむ運営にご相談 →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* デジタルカタログ受け取り（最上部にプロモ） */}
          <div className="bg-gradient-to-br from-[#3D2200] via-[#8B4513] to-[#3D2200] text-white rounded-2xl p-6 md:p-7 mb-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex w-14 h-16 bg-gradient-to-br from-[#E8740C] to-[#F5A623] rounded-md flex-shrink-0 items-center justify-center text-white text-[8px] font-bold tracking-wider text-center leading-tight shadow-md">
                CATA<br/>LOG
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold tracking-widest text-yellow-300 mb-1">
                  ぺいほーむ住宅ポータルサイト開設記念
                </p>
                <h2 className="text-base md:text-lg font-extrabold mb-1 leading-tight">
                  デジタルカタログを受け取る
                </h2>
                <p className="text-xs text-white/90 mb-3">
                  施工事例集 30邸 + 平屋間取り図集 30プラン
                </p>
                <Link
                  href="/mypage/catalog"
                  className="inline-flex items-center gap-2 bg-[#E8740C] hover:bg-[#D4660A] text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-md"
                >
                  {diagnosis ? '受け取り画面へ →' : 'AI診断 → 受け取り →'}
                </Link>
              </div>
            </div>
          </div>

          {/* 機能カード */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <MyPageCard
              title="お気に入り"
              description={
                favCount > 0
                  ? `物件${propertyFavCount} / 工務店${builderFavCount} / 建売${saleHomeFavCount} / 土地${landFavCount}`
                  : '気になる物件・工務店を無制限に保存できます'
              }
              href="/mypage/favorites"
              linkLabel={favCount > 0 ? '一覧を見る' : '工務店を探す'}
              stat={dataLoading ? '...' : `${favCount} 件`}
              statHighlight={favCount > 0}
            />
            <MyPageCard
              title="閲覧履歴"
              description="最近見た物件・記事の履歴"
              href="/videos"
              linkLabel="動画を見る"
              stat={`Phase 2`}
              disabled
            />
            <MyPageCard
              title="AI診断結果"
              description={
                diagnosis
                  ? `タイプ: ${diagnosis.user_type} / 推薦${diagnosis.recommended_builders?.length || 0}社`
                  : '家づくりタイプと推薦工務店を診断します'
              }
              href={diagnosis ? '/welcome' : '/diagnosis'}
              linkLabel={diagnosis ? '結果を見る' : '診断を受ける'}
              stat={dataLoading ? '...' : diagnosis ? '診断済み' : '未実施'}
              statHighlight={!!diagnosis}
            />
            <MyPageCard
              title="比較リスト"
              description="2〜3社を並べて比較（最大3社）"
              href="/builders/compare"
              linkLabel={compareCount > 0 ? '比較を見る' : '工務店を選ぶ'}
              stat={`${compareCount} / 3 社`}
              statHighlight={compareCount > 0}
            />
            <MyPageCard
              title="匿名質問履歴"
              description="工務店に送った匿名質問と回答を確認"
              href="/mypage/questions"
              linkLabel="質問履歴を見る"
              stat="SMART MATCH"
              statHighlight
            />
            <MyPageCard
              title="ご相談・フィードバック"
              description="ぺいほーむ運営に直接ご相談"
              href="/mypage/feedback"
              linkLabel="相談する"
              stat="いつでも"
              statHighlight
            />
            <MyPageCard
              title="予約履歴"
              description="見学会予約の一覧"
              href="/event"
              linkLabel="見学会を予約"
              stat="Phase 2"
              disabled
            />
          </div>

          {/* 次のステップCTA */}
          <div className="bg-gradient-to-br from-[#FFF8F0] to-white border border-[#E8740C]/20 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="text-lg md:text-xl font-bold text-[#3D2200] mb-2">
              {diagnosis ? '次のステップは見学会の予約です' : '次のステップはAI家づくり診断です'}
            </h3>
            <p className="text-sm text-gray-600 mb-5">
              {diagnosis
                ? '推薦された工務店の家を実際に見に行きませんか？'
                : '10問に答えるだけで、あなたに合う工務店3社をご紹介します（約2分）'}
            </p>
            <Link
              href={diagnosis ? '/event' : '/diagnosis'}
              className="inline-flex items-center gap-2 bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold px-8 py-3 rounded-full text-sm transition shadow-md"
            >
              {diagnosis ? '見学会の日程を見る →' : '診断をはじめる →'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function MyPageCard({
  title,
  description,
  href,
  linkLabel,
  stat,
  statHighlight,
  disabled,
}: {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  stat: string;
  statHighlight?: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={`bg-white border rounded-xl p-5 ${
        disabled ? 'border-gray-100 opacity-60' : 'border-gray-100 hover:shadow-md transition'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-bold text-[#3D2200]">{title}</h3>
        <span
          className={`text-xs font-bold ${
            disabled
              ? 'text-gray-400'
              : statHighlight
                ? 'text-[#E8740C]'
                : 'text-gray-400'
          }`}
        >
          {stat}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-3 leading-relaxed min-h-[2.5rem]">{description}</p>
      {disabled ? (
        <span className="text-xs text-gray-400 font-medium">準備中</span>
      ) : (
        <Link
          href={href}
          className="text-xs font-bold text-[#E8740C] hover:underline"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
