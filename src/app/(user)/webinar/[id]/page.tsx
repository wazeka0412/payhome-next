import { webinars, getWebinarById } from '@/lib/webinars-data';
import WebinarDetailContent from './WebinarDetailContent';

export function generateStaticParams() {
  return webinars.map((w) => ({ id: w.id }));
}

export default async function WebinarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WebinarDetailContent id={id} />;
}
