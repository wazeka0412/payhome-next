'use client'

import Link from 'next/link'
import PageHeader from '@/components/ui/PageHeader'
import { useReviews } from '@/lib/content-store'

export default function VoicePage() {
  const reviews = useReviews()

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'ホーム', href: '/' }, { label: 'お客様の声' }]}
        title="お客様の声"
        subtitle="ぺいほーむを利用して家を建てたお客様の体験談をご紹介します"
      />

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="space-y-6">
            {reviews.map((review) => (
              <Link
                key={review.id}
                href={`/voice/${review.id}`}
                className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                  {/* 左側: アバターと基本情報 */}
                  <div className="flex md:flex-col items-center gap-4 md:gap-2 md:min-w-[120px]">
                    <div className="w-16 h-16 rounded-full bg-[#FFF8F0] flex items-center justify-center text-xl text-[#E8740C] font-bold flex-shrink-0">
                      {review.name[0]}
                    </div>
                    <div className="md:text-center">
                      <p className="font-bold text-gray-900">{review.name}</p>
                      <p className="text-xs text-gray-400">{review.area} / {review.age}</p>
                      <p className="text-xs text-gray-400">{review.family}</p>
                    </div>
                  </div>

                  {/* 右側: レビュー内容 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">{review.text}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-[#FFF8F0] text-[#E8740C] px-3 py-1 rounded-full font-semibold">{review.propertyType}</span>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{review.builder}</span>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{review.budget}</span>
                    </div>
                  </div>

                  {/* 矢印 */}
                  <div className="hidden md:flex items-center text-gray-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">あなたも家づくりを始めませんか？</p>
            <Link href="/consultation" className="inline-block bg-[#E8740C] text-white font-bold px-8 py-4 rounded-full hover:bg-[#D4660A] transition text-sm">
              無料で相談する →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
