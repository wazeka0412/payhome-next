import { properties } from '@/lib/properties';
import PropertyDetailContent from './PropertyDetailContent';

export function generateStaticParams() {
  return properties.map(p => ({ id: p.id }))
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PropertyDetailContent id={id} />;
}
