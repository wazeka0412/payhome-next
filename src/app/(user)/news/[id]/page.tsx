import { newsItems, getNewsItem } from '@/lib/news-data';
import NewsDetailContent from './NewsDetailContent';
import TrackPageView from '@/components/tracking/TrackPageView';

export function generateStaticParams() {
  return newsItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getNewsItem(id);
  if (!item) return { title: 'ニュース | ぺいほーむ' };
  return {
    title: `${item.title} | ぺいほーむ`,
    description: item.description,
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <TrackPageView eventType="article_read" contentType="news" contentId={id} />
      <NewsDetailContent id={id} />
    </>
  );
}
