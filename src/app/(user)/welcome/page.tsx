'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';

/**
 * 会員登録完了後のウェルカム画面
 * REQUIREMENTS.md §F-07-new に従い「登録完了後、診断結果に基づく工務店3社を提示」
 * を実現するための着地点。
 *
 * 動作:
 *  1. ログイン済みであることを前提とする
 *  2. localStorage の最新診断結果（diagnosis_result）を確認
 *  3. ある場合 → 推薦工務店3社をハイライト + 次のアクション
 *  4. ない場合 → AI診断を促す + 主要動線を提示
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
  }, []);

  // 未ログインなら /signup へ誘導
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
            <p className="text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
              ぺいほーむでは「動画でしっかり比較 → 実物を体感 → 工務店と直接相談」の流れで、
              あなたの理想の家づくりをサポートします。
            </p>
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          {/* ── 診断結果がある場合：推薦工務店3社 ── */}
          {diagnosis && diagnosis.recommended_builders?.length > 0 ? (
            <div>
              <SectionTitle>あなたにおすすめの工務店</SectionTitle>
              <p className="text-sm text-gray-600 mb-6">
                先ほどの診断結果に基づき、{diagnosis.recommended_builders.length}社をご提案します。マイページに保存済みです。
              </p>
              <div className="space-y-4">
                {diagnosis.recommended_builders.map((b, idx) => (
                  <div
                    key={b.id}
                    className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E8740C] text-white rounded-full flex items-center justify-center font-extrabold">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#3D2200] text-lg">{b.name}</h3>
                          <p className="text-xs text-gray-500">{b.area}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-extrabold text-[#E8740C]">{b.score}</div>
                        <div className="text-[10px] text-gray-500">マッチ度</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 bg-[#FFF8F0] rounded-lg p-3 mb-3">{b.reason}</p>
                    <div className="flex gap-2">
                      <Link
                        href={`/builders/${b.id}`}
                        className="flex-1 bg-[#E8740C] text-white text-center text-xs font-bold py-2.5 rounded-full hover:bg-[#D4660A] transition"
                      >
                        工務店ページへ
                      </Link>
                      <Link
                        href={`/event?builder=${encodeURIComponent(b.name)}`}
                        className="flex-1 border border-[#E8740C] text-[#E8740C] text-center text-xs font-bold py-2.5 rounded-full hover:bg-[#FFF8F0] transition"
                      >
                        見学会予約
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ── 診断未実施：診断を促す ── */
            <div className="bg-[#E8740C] text-white rounded-2xl p-8 md:p-12 shadow-xl text-center">
              <p className="text-xs font-bold tracking-wider mb-2 opacity-90">FIRST STEP</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                まずはAI家づくり診断（約2分）
              </h2>
              <p className="text-sm md:text-base text-white/95 mb-6 max-w-xl mx-auto">
                10問に答えるだけで、あなたの家づくりタイプを判定し、相性の良い工務店3社をご提案します。
              </p>
              <Link
                href="/diagnosis"
                className="inline-block bg-white text-[#E8740C] font-bold px-8 py-3.5 rounded-full text-sm hover:bg-gray-50 transition shadow-lg"
              >
                AI家づくり診断をはじめる →
              </Link>
            </div>
          )}

          {/* ── 主要動線：4枚カード ── */}
          <div>
            <SectionTitle>会員でできること</SectionTitle>
            <div className="grid md:grid-cols-2 gap-4">
              <NextStepCard
                title="動画コンテンツを見る"
                description="ぺいほーむが取材した平屋ルームツアー42本"
                href="/videos"
                cta="動画を見る"
              />
              <NextStepCard
                title="工務店を比較する"
                description="エリア・価格帯・特徴で12社を絞り込み検索"
                href="/builders"
                cta="工務店一覧へ"
              />
              <NextStepCard
                title="販売中の建売を見る"
                description="提携工務店の分譲戸建を価格・間取りで検索"
                href="/sale-homes"
                cta="建売情報へ"
              />
              <NextStepCard
                title="土地情報を見る"
                description="工務店プランと組み合わせ可能な提携土地"
                href="/lands"
                cta="土地情報へ"
              />
            </div>
          </div>

          {/* ── マイページへの導線 ── */}
          <div className="text-center pt-4">
            <Link
              href="/mypage"
              className="inline-flex items-center gap-2 text-sm text-[#E8740C] font-bold hover:underline"
            >
              マイページへ →
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
  title,
  description,
  href,
  cta,
}: {
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
      <h3 className="text-base font-bold text-[#3D2200] mb-2">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-4">{description}</p>
      <span className="text-xs font-bold text-[#E8740C]">{cta} →</span>
    </Link>
  );
}
