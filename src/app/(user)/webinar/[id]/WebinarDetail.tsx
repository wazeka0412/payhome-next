'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { WebinarData } from '@/lib/webinars-data';

function ShareButtons() {
  return (
    <div className="flex items-center gap-3 py-6 border-t border-gray-200 mt-10">
      <span className="text-sm text-gray-600 font-medium">この記事をシェア：</span>
      <a href="#" className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition" aria-label="Xでシェア">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a href="#" className="w-9 h-9 rounded-full bg-[#06C755] text-white flex items-center justify-center hover:opacity-80 transition" aria-label="LINEでシェア">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
      </a>
      <button
        onClick={() => { navigator.clipboard.writeText(window.location.href); }}
        className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition"
        aria-label="リンクをコピー"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      </button>
    </div>
  );
}

function BookingForm({ webinar }: { webinar: WebinarData }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  if (submitted) {
    return (
      <div className="bg-[#FFF8F0] rounded-2xl p-8 text-center mt-10">
        <div className="text-4xl mb-4">&#127881;</div>
        <h3 className="text-xl font-bold text-[#3D2200] mb-3">お申し込みありがとうございます！</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          ご登録いただいたメールアドレスに<br />
          確認メールをお送りしました。<br />
          当日のご参加をお待ちしております。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8F0] rounded-2xl p-8 mt-10">
      <h3 className="text-lg font-bold text-[#3D2200] mb-2 text-center">ウェビナー申し込み</h3>
      <p className="text-sm text-gray-600 text-center mb-6">
        <strong>{webinar.shortTitle}</strong><br />
        {webinar.eventDetails.datetime}｜{webinar.eventDetails.format}｜{webinar.eventDetails.fee}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="space-y-4 max-w-md mx-auto"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            お名前 <span className="text-red-500 text-xs">必須</span>
          </label>
          <input
            type="text"
            required
            placeholder="例：田中 太郎"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス <span className="text-red-500 text-xs">必須</span>
          </label>
          <input
            type="email"
            required
            placeholder="例：tanaka@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            電話番号
          </label>
          <input
            type="tel"
            placeholder="例：090-1234-5678"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#E8740C] text-white font-bold py-3 rounded-full text-sm hover:bg-[#D4660A] transition mt-2"
        >
          この内容で申し込む
        </button>
      </form>
    </div>
  );
}

export default function WebinarDetail({
  webinar,
  prev,
  next,
}: {
  webinar: WebinarData;
  prev: WebinarData | null;
  next: WebinarData | null;
}) {
  return (
    <>
      {/* Page Header with Breadcrumb */}
      <section className="bg-gradient-to-r from-[#E8740C] to-[#F5A623] text-white pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm mb-4 opacity-85">
            <Link href="/" className="hover:underline">ホーム</Link>
            <span className="mx-1">&gt;</span>
            <Link href="/webinar" className="hover:underline">ウェビナー</Link>
            <span className="mx-1">&gt;</span>
            <span>{webinar.shortTitle}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold">ウェビナー</h1>
        </div>
      </section>

      {/* Article Detail */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <article>
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <time className="text-sm text-gray-500">{webinar.date}</time>
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#E8740C]/10 text-[#E8740C]">
              {webinar.category}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-[#3D2200] mb-6 leading-snug">
            {webinar.title}
          </h2>

          {/* Photo placeholder */}
          <div className="w-full aspect-video bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-lg font-medium mb-8">
            Photo
          </div>

          {/* Body content */}
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">{webinar.body}</p>

            {/* Event Details */}
            <h3 className="text-lg font-bold text-[#3D2200] mt-8 mb-4">
              {webinar.isUpcoming ? '開催概要' : 'ウェビナーの概要'}
            </h3>
            {webinar.isUpcoming ? (
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-gray-700"><strong>日時：</strong>{webinar.eventDetails.datetime}</li>
                <li className="text-sm text-gray-700"><strong>形式：</strong>{webinar.eventDetails.format}</li>
                <li className="text-sm text-gray-700"><strong>参加費：</strong>{webinar.eventDetails.fee}</li>
                <li className="text-sm text-gray-700"><strong>定員：</strong>{webinar.eventDetails.capacity}</li>
                <li className="text-sm text-gray-700"><strong>対象：</strong>{webinar.eventDetails.target}</li>
              </ul>
            ) : (
              <div className="bg-gray-50 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm text-gray-600"><strong>開催日：</strong>{webinar.eventDetails.datetime}</span>
                  {webinar.participants && (
                    <span className="inline-flex items-center text-sm text-[#E8740C] font-semibold">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      参加者{webinar.participants}名
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>形式：</strong>{webinar.eventDetails.format}｜<strong>参加費：</strong>{webinar.eventDetails.fee}
                </div>
              </div>
            )}

            {/* Recommendations (upcoming only) */}
            {webinar.isUpcoming && webinar.recommendations && (
              <>
                <h3 className="text-lg font-bold text-[#3D2200] mt-8 mb-4">こんな方におすすめ</h3>
                <ul className="space-y-2 mb-6">
                  {webinar.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-[#E8740C] mt-0.5 flex-shrink-0">&#9679;</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Schedule / Program (upcoming only) */}
            {webinar.isUpcoming && webinar.schedule && (
              <>
                <h3 className="text-lg font-bold text-[#3D2200] mt-8 mb-4">プログラム</h3>
                <div className="space-y-6 mb-6">
                  {webinar.schedule.map((item, i) => (
                    <div key={i}>
                      <h4 className="text-base font-bold text-[#3D2200] mb-1">
                        {item.title}（{item.duration}）
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Speakers (upcoming only) */}
            {webinar.isUpcoming && webinar.speakers && (
              <>
                <h3 className="text-lg font-bold text-[#3D2200] mt-8 mb-4">登壇者</h3>
                <div className="space-y-4 mb-6">
                  {webinar.speakers.map((speaker, i) => (
                    <div key={i}>
                      <h4 className="text-base font-bold text-[#3D2200] mb-1">{speaker.name}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{speaker.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Key Points (archive only) */}
            {!webinar.isUpcoming && webinar.keyPoints && (
              <>
                <h3 className="text-lg font-bold text-[#3D2200] mt-8 mb-4">主なポイント</h3>
                <div className="space-y-6 mb-6">
                  {webinar.keyPoints.map((point, i) => (
                    <div key={i}>
                      <h4 className="text-base font-bold text-[#3D2200] mb-1">{point.title}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{point.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Testimonials (archive only) */}
            {!webinar.isUpcoming && webinar.testimonials && (
              <>
                <h3 className="text-lg font-bold text-[#3D2200] mt-8 mb-4">参加者の声</h3>
                <div className="space-y-4 mb-6">
                  {webinar.testimonials.map((t, i) => (
                    <blockquote key={i} className="border-l-4 border-[#E8740C]/30 pl-4 py-2 text-sm text-gray-700 italic bg-gray-50 rounded-r-lg">
                      {t}
                    </blockquote>
                  ))}
                </div>
              </>
            )}

            {/* Notice (for webinar-03 "近日公開") */}
            {webinar.notice && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mt-6 text-sm text-gray-700">
                {webinar.notice}
              </div>
            )}
          </div>

          {/* Booking form for upcoming webinars */}
          {webinar.isUpcoming && webinar.status === '申込受付中' && (
            <BookingForm webinar={webinar} />
          )}

          {/* CTA button for upcoming (近日公開) */}
          {webinar.isUpcoming && webinar.status === '近日公開' && (
            <div className="text-center mt-10">
              <span className="inline-block bg-gray-200 text-gray-500 font-bold px-8 py-3 rounded-full text-sm cursor-not-allowed">
                申し込み開始までお待ちください
              </span>
            </div>
          )}

          {/* Share buttons */}
          <ShareButtons />

          {/* Prev/Next navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div>
              {prev ? (
                <Link
                  href={`/webinar/${prev.id}`}
                  className="text-sm text-[#E8740C] hover:underline font-medium"
                >
                  &larr; 前のウェビナー
                </Link>
              ) : (
                <span />
              )}
            </div>
            <div>
              {next ? (
                <Link
                  href={`/webinar/${next.id}`}
                  className="text-sm text-[#E8740C] hover:underline font-medium"
                >
                  次のウェビナー &rarr;
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
