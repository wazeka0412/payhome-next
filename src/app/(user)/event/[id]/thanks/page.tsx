'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getEventById, formatDateJP } from '@/lib/events-data';

interface ReservationSummary {
  eventTitle: string;
  selectedDate: string;
  name: string;
}

export default function EventThanksPage() {
  const params = useParams();
  const id = params.id as string;
  const event = getEventById(id);
  const [summary, setSummary] = useState<ReservationSummary | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`event-reservation-${id}`);
      if (raw) {
        setSummary(JSON.parse(raw));
      }
    } catch {
      /* ignore */
    }
  }, [id]);

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3">
        <div className="max-w-7xl mx-auto px-4 text-xs text-gray-500">
          <Link href="/" className="hover:underline">ホーム</Link>
          <span className="mx-1">&gt;</span>
          <Link href="/event" className="hover:underline">見学会・イベント</Link>
          <span className="mx-1">&gt;</span>
          <span>予約完了</span>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 text-center relative">
            {/* Character */}
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="w-full h-full bg-[#FFF8F0] rounded-full flex items-center justify-center">
                <Image
                  src="/images/pei_wink.png"
                  alt="ペイくん"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 font-bold text-sm px-4 py-2 rounded-full mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              予約完了
            </div>

            {/* Title */}
            <h1 className="text-2xl font-extrabold text-[#3D2200] mb-4 leading-relaxed">
              予約が完了しました!
            </h1>

            {/* Event summary */}
            {(event || summary) && (
              <div className="bg-[#FFF8F0] rounded-xl p-5 mb-6 text-left">
                <div className="flex items-center gap-2 text-sm font-bold text-[#3D2200] mb-3">
                  <svg className="w-5 h-5 text-[#E8740C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={1.5} />
                    <path strokeWidth={1.5} d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  ご予約内容
                </div>
                <dl className="space-y-2 text-sm">
                  {summary?.name && (
                    <div className="flex gap-3">
                      <dt className="font-bold text-[#3D2200] shrink-0 w-20">お名前</dt>
                      <dd className="text-gray-600">{summary.name} 様</dd>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <dt className="font-bold text-[#3D2200] shrink-0 w-20">イベント</dt>
                    <dd className="text-gray-600">{event?.title || summary?.eventTitle}</dd>
                  </div>
                  {summary?.selectedDate && (
                    <div className="flex gap-3">
                      <dt className="font-bold text-[#3D2200] shrink-0 w-20">ご希望日</dt>
                      <dd className="text-gray-600">{formatDateJP(summary.selectedDate)}</dd>
                    </div>
                  )}
                  {event && (
                    <div className="flex gap-3">
                      <dt className="font-bold text-[#3D2200] shrink-0 w-20">会場</dt>
                      <dd className="text-gray-600">{event.location}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              ご入力いただいたメールアドレスに確認メールをお送りしました。<br />
              当日のご来場をお待ちしております。
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center bg-[#E8740C] text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-[#D4660A] transition"
              >
                トップページへ戻る
              </Link>
              <Link
                href="/videos"
                className="inline-flex items-center justify-center bg-white border-2 border-[#E8740C] text-[#E8740C] font-bold px-8 py-3 rounded-full text-sm hover:bg-[#FFF8F0] transition"
              >
                動画を見る
              </Link>
            </div>

            {/* LINE CTA */}
            <div className="mt-8 p-5 bg-[#06C755]/10 rounded-xl">
              <p className="text-sm font-semibold text-[#06C755] mb-3">
                LINEで最新イベント情報を受け取る
              </p>
              <a
                href="https://line.me/R/ti/p/@253gzmoh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#06C755] text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-[#05a648] transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596a.629.629 0 0 1-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595a.63.63 0 0 1 .495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
                友だち追加
              </a>
            </div>

            {/* Footer character */}
            <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-gray-100">
              <Image
                src="/images/pei_smile.png"
                alt="ペイくん"
                width={40}
                height={40}
                className="object-contain"
              />
              <p className="text-xs text-gray-400 text-left">
                当日お会いできるのを楽しみにしてるよ！<br />
                ぺいほーむの動画もチェックしてね！
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
