import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import ShareButtons from '@/components/ui/ShareButtons'
import { reviews, getReviewById, getAdjacentReviews } from '@/lib/reviews-data'

export function generateStaticParams() {
  return reviews.map((r) => ({ id: r.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const review = getReviewById(id)
  return { title: review ? `${review.name}の声 | お客様の声` : 'お客様の声' }
}

export default async function VoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const review = getReviewById(id)
  if (!review) notFound()

  const { prev, next } = getAdjacentReviews(id)

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: 'お客様の声', href: '/voice' },
          { label: review.name },
        ]}
        title={`${review.name}の声`}
      />

      <article className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* プロフィール */}
          <div className="bg-[#FFF8F0] rounded-2xl p-6 md:p-8 mb-10">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-2xl text-[#E8740C] font-bold shadow-sm flex-shrink-0">
                {review.name[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{review.name}</h2>
                <p className="text-sm text-gray-500">{review.area} / {review.age} / {review.family}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* 物件情報 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">建てた家</p>
                <p className="text-sm font-bold text-gray-800">{review.propertyType}</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">施工会社</p>
                <p className="text-sm font-bold text-gray-800">{review.builder}</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">総予算</p>
                <p className="text-sm font-bold text-[#E8740C]">{review.budget}</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">期間</p>
                <p className="text-sm font-bold text-gray-800">{review.duration}</p>
              </div>
            </div>
          </div>

          {/* 本文 */}
          <div
            className="prose prose-gray max-w-none mb-12
              [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:pl-4 [&>h2]:border-l-4 [&>h2]:border-[#E8740C]
              [&>p]:text-gray-600 [&>p]:leading-relaxed [&>p]:mb-4
              [&>blockquote]:border-l-4 [&>blockquote]:border-[#E8740C] [&>blockquote]:bg-[#FFF8F0] [&>blockquote]:rounded-r-xl [&>blockquote]:px-5 [&>blockquote]:py-4 [&>blockquote]:my-6 [&>blockquote]:text-gray-700 [&>blockquote]:italic [&>blockquote]:not-italic [&>blockquote]:font-medium"
            dangerouslySetInnerHTML={{ __html: review.body }}
          />

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#E8740C] to-[#F5A623] rounded-2xl p-8 text-center text-white mb-10">
            <h3 className="text-xl font-bold mb-2">あなたも家づくりを始めませんか？</h3>
            <p className="text-sm opacity-90 mb-5">{review.name}のように、ぺいほーむがサポートします</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/consultation" className="bg-white text-[#E8740C] font-bold px-8 py-3 rounded-full hover:bg-gray-50 transition text-sm">
                無料で相談する →
              </Link>
              <a href="https://line.me/R/ti/p/@253gzmoh" target="_blank" rel="noopener" className="bg-[#06C755] text-white font-bold px-8 py-3 rounded-full hover:bg-[#05a648] transition text-sm">
                LINEで相談
              </a>
            </div>
          </div>

          {/* シェア */}
          <div className="mb-10">
            <ShareButtons />
          </div>

          {/* 前後ナビ */}
          <div className="flex justify-between items-center border-t border-gray-100 pt-6">
            {prev ? (
              <Link href={`/voice/${prev.id}`} className="text-sm text-[#E8740C] hover:underline">
                ← {prev.name}
              </Link>
            ) : <span />}
            <Link href="/voice" className="text-sm text-gray-400 hover:text-gray-600">
              一覧に戻る
            </Link>
            {next ? (
              <Link href={`/voice/${next.id}`} className="text-sm text-[#E8740C] hover:underline">
                {next.name} →
              </Link>
            ) : <span />}
          </div>
        </div>
      </article>
    </>
  )
}
