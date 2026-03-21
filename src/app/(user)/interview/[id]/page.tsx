import { interviews } from '@/lib/interviews';
import InterviewDetailContent from './InterviewDetailContent';
import TrackPageView from '@/components/tracking/TrackPageView';

export function generateStaticParams() {
  return interviews.map((item) => ({ id: item.id }));
}

export default async function InterviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <TrackPageView eventType="article_read" contentType="interview" contentId={id} />
      <InterviewDetailContent id={id} />
    </>
  );
}
