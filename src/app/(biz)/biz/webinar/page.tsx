'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';

type BizWebinar = {
  id: string
  title: string
  dateLabel?: string
  year?: string
  category: string
  excerpt?: string
  participants?: string
  status?: string
}

export default function WebinarPage() {
  const [webinars, setWebinars] = useState<BizWebinar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/biz-webinars')
      .then((r) => r.json())
      .then((data) => setWebinars(Array.isArray(data) ? (data as BizWebinar[]) : []))
      .catch(() => setWebinars([]))
      .finally(() => setLoading(false));
  }, []);

  const upcomingSeminars = webinars.filter((w) => w.category === '開催予定');
  const archiveSeminars = webinars.filter((w) => w.category === 'アーカイブ');

  return (
    <>
      {/* Page Header */}
      <div className="bg-gray-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-3">Seminar</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">セミナー・勉強会</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl">住宅会社の集客・経営に役立つセミナーを定期開催しています</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#E8740C] border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* Upcoming */}
          <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4">
              <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">Upcoming</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">開催予定のセミナー</h2>
              {upcomingSeminars.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {upcomingSeminars.map((s) => (
                    <Link key={s.id} href={`/biz/webinar/${s.id}`} className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex">
                        <div className="w-24 flex-shrink-0 bg-gradient-to-br from-[#E8740C] to-[#F5A623] flex flex-col items-center justify-center text-white p-4">
                          <span className="text-2xl font-extrabold leading-none">{s.dateLabel}</span>
                          <span className="text-xs mt-1 opacity-80">{s.year}</span>
                        </div>
                        <div className="p-5 flex-1">
                          <span className="inline-block text-xs font-semibold bg-orange-50 text-[#E8740C] px-2.5 py-0.5 rounded mb-2">{s.category}</span>
                          <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-[#E8740C] transition-colors line-clamp-2">{s.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2">{s.excerpt}</p>
                          <span className="inline-block mt-3 text-xs font-semibold text-[#E8740C]">詳細を見る →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">開催予定のセミナーはありません</p>
              )}
            </div>
          </section>

          {/* Archive */}
          {archiveSeminars.length > 0 && (
            <section className="py-16 md:py-20 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4">
                <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">Archive</p>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">過去のセミナー</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {archiveSeminars.map((s) => (
                    <Link key={s.id} href={`/biz/webinar/${s.id}`} className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex">
                        <div className="w-24 flex-shrink-0 bg-gray-200 flex flex-col items-center justify-center text-gray-600 p-4">
                          <span className="text-2xl font-extrabold leading-none">{s.dateLabel}</span>
                          <span className="text-xs mt-1 opacity-60">{s.year}</span>
                        </div>
                        <div className="p-5 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-block text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded">アーカイブ</span>
                            {s.participants && <span className="text-xs text-gray-400">{s.participants}</span>}
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-[#E8740C] transition-colors line-clamp-2">{s.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2">{s.excerpt}</p>
                          <span className="inline-block mt-3 text-xs font-semibold text-[#E8740C]">レポートを見る →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">セミナーの共催・協賛をお考えの方</h2>
          <p className="text-sm text-gray-500 mb-6">ぺいほーむとの共催セミナーや協賛にご興味がある方はお気軽にお問い合わせください。</p>
          <Link href="/biz/contact" className="inline-block bg-[#E8740C] text-white font-bold px-8 py-3.5 rounded-full text-sm hover:bg-[#D4660A] transition-colors shadow-md">
            お問い合わせ
          </Link>
        </div>
      </section>
    </>
  );
}
