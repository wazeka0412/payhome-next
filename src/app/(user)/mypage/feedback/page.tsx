'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import { getOrCreateAnonymousId } from '@/lib/anonymous-id';
import { builders } from '@/lib/builders-data';

/**
 * フィードバック・ご相談ページ（Smart Match Phase 1.5）
 *
 * 会員様が工務店との体験についてぺいほーむ運営に直接フィードバックする仕組み。
 * 「営業が嫌だった」ではなく「ぺいほーむ運営にご相談」という中立フレームで設計。
 */

const CATEGORIES = [
  {
    value: 'good',
    label: '良い体験でした',
    description: '工務店との対応が良かった・印象的だった',
    icon: '👍',
    color: 'green',
  },
  {
    value: 'concern',
    label: '気になる点があった',
    description: '連絡ペースや対応に違和感があった',
    icon: '💭',
    color: 'orange',
  },
  {
    value: 'suggestion',
    label: 'ぺいほーむへのご提案',
    description: 'サービスへの要望・改善提案',
    icon: '💡',
    color: 'blue',
  },
  {
    value: 'other',
    label: 'その他のご相談',
    description: 'その他何でもお気軽に',
    icon: '✉️',
    color: 'gray',
  },
] as const;

export default function FeedbackPage() {
  const { status } = useSession();
  const [category, setCategory] = useState<string>('concern');
  const [builderId, setBuilderId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      // ログインしていなくてもフィードバックは送信可能
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const anonymousId = getOrCreateAnonymousId();
      const selectedBuilder = builders.find((b) => b.id === builderId);
      const res = await fetch('/api/me/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builder_id: builderId || null,
          builder_name: selectedBuilder?.name || null,
          category,
          message: message.trim(),
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

  if (submitted) {
    return (
      <>
        <PageHeader
          title="ご相談・フィードバック"
          breadcrumbs={[
            { label: 'ホーム', href: '/' },
            { label: 'マイページ', href: '/mypage' },
            { label: 'ご相談・フィードバック' },
          ]}
        />
        <section className="py-16 md:py-24">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="w-16 h-16 mx-auto mb-5 bg-green-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#3D2200] mb-3">
              ご相談を受け付けました
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              ぺいほーむ運営にて内容を確認し、
              <br />
              必要に応じて2〜3営業日以内にご連絡いたします。
              <br />
              いただいたお声はサービス改善に活かしてまいります。
            </p>
            <Link
              href="/mypage"
              className="inline-block bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold px-6 py-3 rounded-full text-sm transition"
            >
              マイページに戻る
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="ご相談・フィードバック"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: 'マイページ', href: '/mypage' },
          { label: 'ご相談・フィードバック' },
        ]}
        subtitle="ぺいほーむ運営が直接お伺いします"
      />

      <section className="py-10 md:py-14">
        <div className="max-w-2xl mx-auto px-4">
          {/* 案内バナー */}
          <div className="bg-gradient-to-br from-[#FFF8F0] to-white border border-[#E8740C]/20 rounded-2xl p-6 mb-6">
            <p className="text-xs font-bold text-[#E8740C] tracking-widest mb-2">
              SMART MATCH｜ぺいほーむ運営が間に入ります
            </p>
            <h2 className="text-base md:text-lg font-bold text-[#3D2200] mb-2">
              どんな小さなことでもお聞かせください
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              工務店との体験で気になる点があれば、ぺいほーむ運営に直接お知らせください。
              私たちが間に入ってお話を伺い、必要に応じて工務店様にお伝えします。
              良かった体験談も大歓迎です。いただいたお声はプラットフォーム改善に活かします。
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
          >
            {/* カテゴリ */}
            <div className="mb-5">
              <label className="block text-sm font-bold text-[#3D2200] mb-3">
                ご相談の種類 <span className="text-red-500 text-xs">必須</span>
              </label>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => {
                  const selected = category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition ${
                        selected
                          ? 'border-[#E8740C] bg-[#FFF8F0]'
                          : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">{cat.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-bold ${
                              selected ? 'text-[#E8740C]' : 'text-[#3D2200]'
                            }`}
                          >
                            {cat.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 関連する工務店（任意） */}
            <div className="mb-5">
              <label className="block text-sm font-bold text-[#3D2200] mb-2">
                関連する工務店（任意）
              </label>
              <select
                value={builderId}
                onChange={(e) => setBuilderId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
              >
                <option value="">指定しない</option>
                {builders.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}（{b.region}）
                  </option>
                ))}
              </select>
            </div>

            {/* メッセージ */}
            <div className="mb-5">
              <label className="block text-sm font-bold text-[#3D2200] mb-2">
                ご相談内容 <span className="text-red-500 text-xs">必須</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                placeholder="例：見学会の後、電話連絡を何度かいただいたのですが、もう少しペースをゆっくりにしていただけると助かります。"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] resize-y"
                maxLength={2000}
                required
              />
              <p className="text-[10px] text-gray-400 text-right mt-1">
                {message.length} / 2000
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-3 mb-4">
                {error}
              </div>
            )}

            {/* お約束 */}
            <div className="bg-[#FFF8F0] rounded-lg p-3 text-[11px] text-gray-600 leading-relaxed mb-5">
              <p className="font-bold text-[#E8740C] mb-1">ぺいほーむのお約束</p>
              <ul className="space-y-0.5">
                <li>・いただいた内容は運営チームのみが拝見します</li>
                <li>・工務店様にお伝えする際は、あなたのお名前は伏せます</li>
                <li>・ご相談後の強引な対応を防ぐため、運営が間に入ります</li>
                <li>・サービス改善のために活用させていただきます</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="w-full bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold py-3.5 rounded-full text-sm transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '送信中...' : 'ぺいほーむ運営に送信する'}
            </button>
          </form>

          <div className="mt-6 text-center">
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
