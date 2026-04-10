'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';

/**
 * マイページ（v4.0 MVP）
 * REQUIREMENTS.md 5.0 および 6.2 に準拠。
 *
 * 表示項目:
 *  - プロフィール概要
 *  - お気に入り（Phase 1）
 *  - 閲覧履歴（Phase 1）
 *  - 診断結果（Phase 1、F-25 と接続）
 *  - 比較リスト（Phase 2 プレースホルダ）
 *  - 相談履歴（Phase 2 プレースホルダ）
 */
export default function MyPage() {
  const { data: session, status } = useSession();

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
                  🤖 AI家づくり診断を受ける
                </Link>
              </div>
            </div>
          </div>

          {/* 機能カード */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <MyPageCard
              icon="❤️"
              title="お気に入り"
              description="気になる物件・工務店を保存しましょう"
              href="/builders"
              linkLabel="工務店を探す"
              stat="0 件"
            />
            <MyPageCard
              icon="🕐"
              title="閲覧履歴"
              description="最近見た物件・記事の履歴"
              href="/videos"
              linkLabel="動画を見る"
              stat="0 件"
            />
            <MyPageCard
              icon="🤖"
              title="AI診断結果"
              description="家づくりタイプと推薦工務店"
              href="/diagnosis"
              linkLabel="診断を受ける"
              stat="未実施"
            />
            <MyPageCard
              icon="⚖️"
              title="比較リスト"
              description="2〜3社を並べて比較"
              href="/builders"
              linkLabel="工務店一覧へ"
              stat="Phase 2"
              disabled
            />
            <MyPageCard
              icon="💬"
              title="相談履歴"
              description="AIチャットの会話履歴"
              href="/"
              linkLabel="チャットする"
              stat="Phase 2"
              disabled
            />
            <MyPageCard
              icon="📅"
              title="予約履歴"
              description="見学会予約の一覧"
              href="/event"
              linkLabel="見学会を予約"
              stat="0 件"
            />
          </div>

          {/* 次のステップCTA */}
          <div className="bg-gradient-to-br from-[#FFF8F0] to-white border border-[#E8740C]/20 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="text-lg md:text-xl font-bold text-[#3D2200] mb-2">
              次のステップはAI家づくり診断です
            </h3>
            <p className="text-sm text-gray-600 mb-5">
              10問に答えるだけで、あなたに合う工務店3社をご紹介します（約2分）
            </p>
            <Link
              href="/diagnosis"
              className="inline-flex items-center gap-2 bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold px-8 py-3 rounded-full text-sm transition shadow-md"
            >
              🤖 診断をはじめる →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function MyPageCard({
  icon,
  title,
  description,
  href,
  linkLabel,
  stat,
  disabled,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  stat: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={`bg-white border rounded-xl p-5 ${
        disabled ? 'border-gray-100 opacity-60' : 'border-gray-100 hover:shadow-md transition'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{icon}</div>
        <span className={`text-xs font-bold ${disabled ? 'text-gray-400' : 'text-[#E8740C]'}`}>
          {stat}
        </span>
      </div>
      <h3 className="text-base font-bold text-[#3D2200] mb-1">{title}</h3>
      <p className="text-xs text-gray-500 mb-3 leading-relaxed">{description}</p>
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
