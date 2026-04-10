import { properties } from '@/lib/properties';
import PropertyDetailContent from '../../property/[id]/PropertyDetailContent';

/**
 * v4.0 MVP 7画面のうち「動画コンテンツ詳細」
 * 仕様：YouTube埋込 + 物件スペック + モデルハウス時は見学会予約セクション + 関連動画
 *
 * 動画コンテンツは物件データと1対1対応しているため、既存の PropertyDetailContent を
 * そのまま流用する。/property/[id] と同じコンテンツが /videos/[id] からも
 * 辿れるようになり、MVP画面構成どおりの URL が提供される。
 */
export function generateStaticParams() {
  return properties.map((p) => ({ id: p.id }));
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PropertyDetailContent id={id} />;
}
