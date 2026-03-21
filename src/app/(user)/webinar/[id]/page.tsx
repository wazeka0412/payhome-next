import { webinars, getWebinarById } from '@/lib/webinars-data';
import WebinarDetailContent from './WebinarDetailContent';
import TrackPageView from '@/components/tracking/TrackPageView';

export function generateStaticParams() {
  return webinars.map((w) => ({ id: w.id }));
}

export default async function WebinarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <TrackPageView eventType="event_detail_view" contentType="webinar" contentId={id} />
      <WebinarDetailContent id={id} />
    </>
  );
}
