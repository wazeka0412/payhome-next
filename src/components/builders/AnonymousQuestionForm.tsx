'use client';

import { useState } from 'react';
import { getOrCreateAnonymousId } from '@/lib/anonymous-id';

interface AnonymousQuestionFormProps {
  builderId: string;
  builderName: string;
}

const CATEGORIES = [
  { value: 'pricing', label: '価格・予算について' },
  { value: 'design', label: 'デザイン・間取りについて' },
  { value: 'quality', label: '性能・品質について' },
  { value: 'process', label: '家づくりの進め方について' },
  { value: 'other', label: 'その他' },
] as const;

/**
 * 匿名で質問するフォーム（Smart Match Phase 1.5）
 *
 * 会員様が工務店に連絡先を渡さずに質問できる仕組み。
 * ぺいほーむが仲介し、回答を整形してマイページに届ける。
 * Phase 1 では質問の受け付けと保存のみ（回答は Phase 2 で AI化）。
 */
export default function AnonymousQuestionForm({
  builderId,
  builderName,
}: AnonymousQuestionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<string>('other');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const anonymousId = getOrCreateAnonymousId();
      const res = await fetch('/api/builders/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builder_id: builderId,
          question: question.trim(),
          category,
          anonymous_id: anonymousId,
        }),
      });
      if (!res.ok) throw new Error('送信に失敗しました');
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setQuestion('');
    setCategory('other');
    setSubmitted(false);
    setError(null);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 border-2 border-[#E8740C] text-[#E8740C] hover:bg-[#FFF8F0] font-bold px-6 py-3 rounded-full text-sm transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        匿名で質問する
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center px-4"
          onClick={() => {
            if (!submitting) {
              setIsOpen(false);
              if (submitted) reset();
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              // ── 送信完了画面 ──
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#3D2200] mb-2">ご質問を受け付けました</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  ぺいほーむ編集部が{builderName}様に確認し、<br />
                  2〜3営業日以内に回答をマイページに掲載いたします。
                </p>
                <p className="text-xs text-gray-500 mb-6">
                  連絡先は工務店様に開示されていませんので、
                  営業連絡の心配なくお待ちいただけます。
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                  }}
                  className="bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold px-8 py-3 rounded-full text-sm transition"
                >
                  閉じる
                </button>
              </div>
            ) : (
              // ── 入力画面 ──
              <form onSubmit={handleSubmit}>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-[#E8740C] mb-1">
                        SMART MATCH｜AI仲介質問
                      </p>
                      <h3 className="text-lg font-bold text-[#3D2200]">
                        {builderName}に匿名で質問
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      disabled={submitting}
                      className="text-gray-400 hover:text-gray-600 text-xl"
                      aria-label="閉じる"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    ぺいほーむが仲介します。あなたの連絡先は工務店様に渡りません。
                    回答はマイページにお届けします。
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#3D2200] mb-2">
                      質問カテゴリ
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map((cat) => {
                        const selected = category === cat.value;
                        return (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => setCategory(cat.value)}
                            className={`text-left p-3 rounded-xl border-2 text-xs transition ${
                              selected
                                ? 'border-[#E8740C] bg-[#FFF8F0] text-[#E8740C] font-bold'
                                : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                            }`}
                          >
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#3D2200] mb-2">
                      ご質問内容 <span className="text-red-500 text-xs">必須</span>
                    </label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      rows={6}
                      placeholder={`例：${builderName}様で平屋を検討しています。標準仕様の断熱性能（UA値）について教えてください。`}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] resize-y"
                      maxLength={1000}
                      required
                    />
                    <p className="text-[10px] text-gray-400 text-right mt-1">
                      {question.length} / 1000
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-3">
                      {error}
                    </div>
                  )}

                  <div className="bg-[#FFF8F0] rounded-lg p-3 text-[11px] text-gray-600 leading-relaxed">
                    <p className="font-bold text-[#E8740C] mb-1">ぺいほーむのお約束</p>
                    <ul className="space-y-0.5">
                      <li>・あなたの連絡先は工務店様に開示しません</li>
                      <li>・回答はマイページにお届けします（2〜3営業日）</li>
                      <li>・「この工務店と直接話したい」と思った時だけ、実名開示できます</li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={submitting}
                    className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-full text-sm hover:bg-gray-50 transition"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !question.trim()}
                    className="flex-1 bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold py-3 rounded-full text-sm transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? '送信中...' : '質問を送信する'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
