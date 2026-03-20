import { notFound } from 'next/navigation';
import { webinars, getWebinarById, getAdjacentWebinars } from '@/lib/webinars-data';
import WebinarDetail from './WebinarDetail';

export function generateStaticParams() {
  return webinars.map((w) => ({ id: w.id }));
}

export default async function WebinarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const webinar = getWebinarById(id);

  if (!webinar) {
    notFound();
  }

  const { prev, next } = getAdjacentWebinars(id);

  return <WebinarDetail webinar={webinar} prev={prev} next={next} />;
}
