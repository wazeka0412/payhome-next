import { bizWebinars, getBizWebinarById } from '@/lib/biz-webinars-data';
import WebinarDetailClient from './WebinarDetailClient';

export function generateStaticParams() {
  return bizWebinars.map((w) => ({ id: w.id }));
}

export default async function BizWebinarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const webinar = getBizWebinarById(id);
  if (!webinar) return <div className="py-20 text-center text-gray-500">セミナーが見つかりません</div>;

  return <WebinarDetailClient webinar={webinar} webinarId={id} />;
}
