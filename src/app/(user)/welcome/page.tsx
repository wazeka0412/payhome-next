'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import { getOrCreateAnonymousId } from '@/lib/anonymous-id';

/**
 * /welcome — 会員登録完了直後の最重要ページ (MVP v2 - 2026-05-01)
 *
 * 役割:
 *   1. 登録完了を歓迎する
 *   2. 診断結果 3 社を目立たせる (診断済みの場合)
 *   3. 次の行動を 1 つだけ明示する (見学会予約 or 無料相談 or AI診断)
 *   4. カタログは補助特典として折りたたみ
 *
 * 設計思想:
 *   /welcome は「ここから家づくりが始まる」起点。
 *   ユーザー状態に応じて主CTA を出し分ける。
 *
 *   - 診断済み + 推薦あり → 主CTA = 見学会予約 (/event?builder=...)
 *   - 診断未実施         → 主CTA = AI診断 (/diagnosis)
 */
type Recommendation = {
  id: string;
  name: string;
  area: string;
  score: number;
  reason: string;
};
type DiagnosisCache = {
  user_type: string;
  recommended_builders: Recommendation[];
  cached_at: number;
};

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [diagnosis, setDiagnosis] = useState<DiagnosisCache | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('payhome_diagnosis_result');
      if (raw) setDiagnosis(JSON.parse(raw) as DiagnosisCache);
    } catch {
      /* ignore */
    }
    const anonymousId = getOrCreateAnonymousId();
    fetch(`/api/ai/diagnosis/me?anonymous_id=${anonymousId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.found && res.session) {
          setDiagnosis({
            user_type: res.session.user_type,
            recommended_builders: res.session.recommended_builders || [],
            cached_at: Date.now(),
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signup');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-gray-500">読み込み中...</div>
      </div>
    );
  }

  const userName =
    (session?.user as { name?: string | null } | undefined)?.name ||
    (session?.user as { email?: string | null } | undefined)?.email?.split('@')[0] ||
    'ゲスト';

  const hasRecommendations = !!(
    diagnosis && diagnosis.recommended_builders && diagnosis.recommended_builders.length > 0
  );

  return (
    <>
      <PageHeader
        title="ようこそ、ぺいほーむへ"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: 'ようこそ' },
        ]}
        subtitle={`${userName} さん、登録ありがとうございます`}
      />

      {/* ── Hero: 登録完了 + 次の1歩 ── */}
      <div className="bg-gradient-to-br from-[#FFF8F0] via-[#FFF3E6] to-[#FFECD4]">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 font-bold text-xs px-4 py-2 rounded-full mb-4">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              会員登録が完了しました
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#3D2200] mb-3 leading-relaxed">
              ようこそ、{userName} さん
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xl mx-auto mb-2">
              これからぺいほーむで、
              <span className="font-bold text-[#3D2200]">動画で比較 → 工務店を知る → 実物を体感</span>
              の順で、あなたの家づくりを一緒に進めていきます。
            </p>
            <p className="text-xs text-gray-500">
              登録前の閲覧履歴・お気に入り・AI診断結果はすべてこのアカウントに引き継がれています。
            </p>
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          {/* ═══════════════════════════════════════ */}
          {/* 主ブロック: 診断結果3社 または 診断促進 */}
          {/* ═══════════════════════════════════════ */}
          {hasRecommendations ? (
            <div>
              <SectionTitle>あなたにおすすめの工務店 3社</SectionTitle>
              <p className="text-sm text-gray-600 mb-6">
                先ほどの診断結果に基づき、相性の良い工務店を
                {diagnosis!.recommended_builders.length}社ご提案します。診断結果はマイページに保存済みです。
              </p>
              <div className="space-y-4">
                {diagnosis!.recommended_builders.map((b, idx) => (
                  <div
                    key={b.id}
                    className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-[#E8740C] text-white rounded-full flex items-center justify-center font-extrabold shrink-0">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-[#3D2200] text-lg truncate">{b.name}</h3>
                          <p className="text-xs text-gray-500">{b.area}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xl font-extrabold text-[#E8740C]">{b.score}</div>
                        <div className="text-[10px] text-gray-500">マッチ度</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 bg-[#FFF8F0] rounded-lg p-3 mb-3">
                      {b.reason}
                    </p>
                    {/* MVP v2: 次の 1 歩を絞る — 主CTA=見学会予約、副CTA=詳細 */}
                    <div className="grid grid-cols-3 gap-2">
                      <Link
                        href={`/event?builder=${encodeURIComponent(b.name)}`}
                        className="col-span-2 text-center bg-[#E8740C] text-white text-sm font-bold py-3 rounded-full hover:bg-[#D4660A] transition shadow-[0_2px_8px_rgba(232,116,12,0.3)]"
                      >
                        見学会を予約する
                      </Link>
                      <Link
                        href={`/builders/${b.id}`}
                        className="text-center border border-[#E8740C] text-[#E8740C] text-xs font-bold py-3 rounded-full hover:bg-[#FFF8F0] transition"
                      >
                        工務店を見る
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {/* 迷っている人への副導線 */}
              <div className="mt-8 bg-[#FFF8F0] border border-[#E8740C]/20 rounded-2xl p-6 text-center">
                <p className="text-sm font-bold text-[#3D2200] mb-2">
                  まだ決められない時は
                </p>
                <p className="text-xs text-gray-600 mb-4">
                  ぺいほーむの専門スタッフが、診断結果を踏まえてご相談を承ります。連絡条件も事前にお伝えできます。
                </p>
                <Link
                  href="/consultation"
                  className="inline-block border-2 border-[#E8740C] text-[#E8740C] font-bold px-6 py-2.5 rounded-full text-xs hover:bg-white transition"
                >
                  無料住宅相談を申し込む →
                </Link>
              </div>
            </div>
          ) : (
            /* ── 診断未実施: 主CTA = 診断開始 ── */
            <div className="bg-[#E8740C] text-white rounded-3xl p-8 md:p-12 shadow-xl text-center">
              <p className="text-xs font-bold tracking-wider mb-2 opacity-90">FIRST STEP</p>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight">
                まずはAI家づくり診断
                <span className="block text-base md:text-lg font-bold opacity-90 mt-2">
                  (約2分・10問)
                </span>
              </h2>
              <p className="text-sm md:text-base text-white/95 mb-6 max-w-xl mx-auto leading-relaxed">
                10問に答えるだけで、あなたの家づくりタイプを判定し、
                <br className="hidden md:block" />
                相性の良い工務店3社をご提案します。結果は自動で保存されます。
              </p>
              <Link
                href="/diagnosis"
                className="inline-block bg-white text-[#E8740C] font-extrabold px-10 py-4 rounded-full text-sm hover:bg-gray-50 transition shadow-lg"
              >
                AI家づくり診断をはじめる →
              </Link>
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* 副ブロック: 会員で使える主機能 3 つ    */}
          {/* ═══════════════════════════════════════ */}
          <div>
            <SectionTitle>会員機能で家づくりを進める</SectionTitle>
            <div className="grid md:grid-cols-2 gap-4">
              <NextStepCard
                emoji="🎬"
                title="動画で比較"
                description="平屋ルームツアー42本から、気になる家を見つけてお気に入り保存"
                href="/videos"
                cta="動画一覧へ"
              />
              <NextStepCard
                emoji="🏠"
                title="事例を全件閲覧"
                description="非会員は5件までの事例ライブラリが全件閲覧可能に"
                href="/case-studies"
                cta="事例一覧へ"
              />
              <NextStepCard
                emoji="📝"
                title="家づくり理解度をチェック"
                description="10問のクイズで知識レベルを判定。苦手カテゴリも分かります"
                href="/quiz"
                cta="クイズを受ける"
              />
              <NextStepCard
                emoji="💬"
                title="連絡条件を設定"
                description="連絡頻度・時間帯・手段を事前に登録し、Smart Match で工務店とつながる"
                href="/mypage/contact-preferences"
                cta="連絡条件を設定"
              />
            </div>
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* 補助特典: デジタルカタログ (折りたたみ) */}
          {/* ═══════════════════════════════════════ */}
          <details className="bg-white border border-[#E8740C]/20 rounded-2xl p-6 group">
            <summary className="cursor-pointer flex items-center justify-between text-sm font-bold text-[#3D2200] list-none">
              <span className="flex items-center gap-2">
                <span className="text-xs bg-[#E8740C] text-white font-bold px-2 py-0.5 rounded-full">
                  BONUS
                </span>
                開設記念: デジタルカタログ2冊を進呈
              </span>
              <span className="text-[#E8740C] group-open:rotate-180 transition">▼</span>
            </summary>
            <div className="mt-4 text-xs text-gray-600 leading-relaxed">
              <p className="mb-3">
                ぺいほーむ住宅ポータルサイト開設記念として、AI家づくり診断を完了された会員様に
                デジタルカタログを進呈しています。
              </p>
              <ul className="space-y-1.5 text-[#3D2200] font-semibold mb-4">
                <li>・施工事例集 30邸 (累計1,000万再生から厳選)</li>
                <li>・平屋間取り図集 30プラン (17坪〜50坪)</li>
              </ul>
              <Link
                href={diagnosis ? '/mypage/catalog' : '/diagnosis'}
                className="inline-block bg-[#E8740C] text-white font-bold px-5 py-2 rounded-full text-xs hover:bg-[#D4660A] transition"
              >
                {diagnosis ? 'カタログを受け取る →' : 'AI診断をはじめる →'}
              </Link>
            </div>
          </details>

          {/* ── マイページへの導線 ── */}
          <div className="text-center pt-4">
            <Link
              href="/mypage"
              className="inline-flex items-center gap-2 text-sm text-[#E8740C] font-bold hover:underline"
            >
              マイページを開く →
            </Link>
          </div>
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

function NextStepCard({
  emoji,
  title,
  description,
  href,
  cta,
}: {
  emoji: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-[#E8740C]/30 transition"
    >
      <div className="text-3xl mb-3" aria-hidden>
        {emoji}
      </div>
      <h3 className="text-base font-bold text-[#3D2200] mb-2">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-4">{description}</p>
      <span className="text-xs font-bold text-[#E8740C]">{cta} →</span>
    </Link>
  );
}
