'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import { getOrCreateAnonymousId } from '@/lib/anonymous-id';
import { getBuilderById } from '@/lib/builders-data';

/**
 * 匿名で送った質問の一覧と回答の閲覧（Smart Match Phase 1.5）
 *
 * 会員様が /builders/[id] から送った匿名質問の履歴と、
 * 工務店様からの回答を確認できる。連絡先は開示されていない状態で
 * やり取りが成立する。
 */

interface Question {
  id: string;
  builder_id: string;
  question: string;
  category: 'pricing' | 'design' | 'quality' | 'process' | 'other';
  status: 'pending' | 'answered' | 'resolved';
  answer: string | null;
  answered_at: string | null;
  created_at: string;
}

const CATEGORY_LABELS: Record<Question['category'], string> = {
  pricing: '価格・予算',
  design: 'デザイン・間取り',
  quality: '性能・品質',
  process: '家づくりの進め方',
  other: 'その他',
};

const STATUS_STYLES: Record<Question['status'], { label: string; color: string }> = {
  pending: { label: '回答待ち', color: 'bg-orange-100 text-orange-700' },
  answered: { label: '回答あり', color: 'bg-green-100 text-green-700' },
  resolved: { label: '解決済み', color: 'bg-gray-100 text-gray-500' },
};

export default function MyQuestionsPage() {
  const { status } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    const anonymousId = getOrCreateAnonymousId();
    // Fetch all builders' questions and filter client-side by anonymous_id
    // (future: dedicated /api/me/questions endpoint)
    const fetchAll = async () => {
      try {
        // Since the GET /api/builders/questions endpoint filters by builder_id,
        // we need a different approach. For now, fetch all builders we have
        // and aggregate. Simpler: add ?anonymous_id filter to a new endpoint.
        // TODO: add /api/me/questions endpoint. Using client-side filter as
        // a stopgap — fetch from user_feedback-like endpoint.
        const res = await fetch(`/api/me/questions?anonymous_id=${anonymousId}`);
        if (res.ok) {
          const data = await res.json();
          setQuestions(data.questions || []);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <>
        <PageHeader
          title="質問履歴"
          breadcrumbs={[
            { label: 'ホーム', href: '/' },
            { label: 'マイページ', href: '/mypage' },
            { label: '質問履歴' },
          ]}
        />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <h2 className="text-lg font-bold text-[#3D2200] mb-3">会員限定機能です</h2>
          <p className="text-sm text-gray-500 mb-6">
            無料会員登録すると、工務店に匿名で質問を送れます。<br />
            連絡先は開示されずに、ぺいほーむ経由で回答をお届けします。
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/signup?redirect=/mypage/questions"
              className="bg-[#E8740C] text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-[#D4660A] transition"
            >
              無料会員登録する
            </Link>
            <Link
              href="/login?redirect=/mypage/questions"
              className="text-xs text-gray-500 hover:text-[#E8740C]"
            >
              すでに会員の方はログイン →
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="質問履歴"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: 'マイページ', href: '/mypage' },
          { label: '質問履歴' },
        ]}
        subtitle="工務店に送った匿名質問と回答"
      />

      <section className="py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-4">
          {/* 説明バナー */}
          <div className="bg-gradient-to-br from-[#FFF8F0] to-white border border-[#E8740C]/20 rounded-2xl p-5 mb-6">
            <p className="text-[10px] font-bold text-[#E8740C] tracking-widest mb-1">
              SMART MATCH｜AI 仲介質問
            </p>
            <p className="text-sm font-bold text-[#3D2200] mb-1">
              連絡先を開示せずに、工務店と話せる仕組み
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              ここに表示される質問は、あなたの連絡先を工務店に開示せずに送られたものです。
              回答を読んで「この工務店と直接話したい」と思ったら、見学会予約や会員プロフィール
              経由で実名開示できます。
            </p>
          </div>

          {questions.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
              <p className="text-gray-500 mb-4">まだ質問を送っていません</p>
              <p className="text-xs text-gray-400 mb-6">
                気になる工務店の個別ページから「匿名で質問する」ボタンで送信できます
              </p>
              <Link
                href="/builders"
                className="inline-block bg-[#E8740C] text-white font-bold px-6 py-2.5 rounded-full text-sm hover:bg-[#D4660A] transition"
              >
                工務店一覧を見る
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => {
                const builder = getBuilderById(q.builder_id);
                const s = STATUS_STYLES[q.status];
                return (
                  <div
                    key={q.id}
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${s.color}`}>
                          {s.label}
                        </span>
                        <span className="text-[10px] bg-[#FFF8F0] text-[#E8740C] px-2 py-0.5 rounded-full font-semibold">
                          {CATEGORY_LABELS[q.category]}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(q.created_at).toLocaleDateString('ja-JP')}
                        </span>
                      </div>

                      {builder && (
                        <Link
                          href={`/builders/${builder.id}`}
                          className="text-sm font-bold text-[#3D2200] hover:text-[#E8740C] transition mb-2 inline-block"
                        >
                          {builder.name} →
                        </Link>
                      )}

                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-[10px] font-bold text-gray-500 mb-1">あなたの質問</p>
                        <p className="text-sm text-[#3D2200] whitespace-pre-wrap">{q.question}</p>
                      </div>

                      {q.answer ? (
                        <div className="bg-[#FFF8F0] border border-[#E8740C]/20 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[10px] font-bold text-[#E8740C]">
                              {builder?.name}からの回答
                            </p>
                            {q.answered_at && (
                              <p className="text-[9px] text-gray-400">
                                {new Date(q.answered_at).toLocaleDateString('ja-JP')}
                              </p>
                            )}
                          </div>
                          <p className="text-sm text-[#3D2200] whitespace-pre-wrap">{q.answer}</p>
                          {builder && (
                            <div className="mt-3 pt-3 border-t border-[#E8740C]/20 flex gap-2">
                              <Link
                                href={`/event?builder=${encodeURIComponent(builder.name)}`}
                                className="flex-1 text-center bg-[#E8740C] text-white text-xs font-bold py-2 rounded-full hover:bg-[#D4660A] transition"
                              >
                                見学会を予約する
                              </Link>
                              <Link
                                href={`/builders/${builder.id}`}
                                className="flex-1 text-center border border-[#E8740C] text-[#E8740C] text-xs font-bold py-2 rounded-full hover:bg-[#FFF8F0] transition"
                              >
                                工務店ページへ
                              </Link>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-orange-700">
                            工務店からの回答をお待ちください（2〜3営業日）
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center">
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
