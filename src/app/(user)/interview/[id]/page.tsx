import { interviews } from '@/lib/interviews';
import InterviewDetailContent from './InterviewDetailContent';

export function generateStaticParams() {
  return interviews.map((item) => ({ id: item.id }));
}

export default async function InterviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InterviewDetailContent id={id} />;
}
