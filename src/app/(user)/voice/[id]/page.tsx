import { reviews, getReviewById } from '@/lib/reviews-data'
import VoiceDetailContent from './VoiceDetailContent'

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
  return <VoiceDetailContent id={id} />
}
