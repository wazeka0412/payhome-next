/**
 * 会員限定デジタルカタログ（v4.0 開設記念キャンペーン）
 *
 * - CATALOG 01: ぺいほーむ厳選 施工事例集（30邸）
 * - CATALOG 02: 平屋間取り図集（30プラン）
 *
 * 受け取り条件: 会員ログイン中 + AI家づくり診断完了
 * 受け取り画面: /mypage/catalog
 *
 * v4.0 mock データ。Phase 1 では既存の videos/properties/builders を
 * 再利用して "事例" を構成する。Phase 1.5 で実図面PDFに差し替え予定。
 */

import { videos } from './videos-data';
import { builders, getBuilderById } from './builders-data';

export interface CatalogPage {
  id: string;
  pageNumber: number;
  title: string;
  subtitle: string;
  builderName: string;
  area: string;
  layout: string;
  tsubo: number;
  features: string[];
  thumbnailVideoId?: string; // YouTube サムネイル
  description: string;
}

export interface DigitalCatalog {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  coverGradient: string;
  totalPages: number;
  badge: string;
  pages: CatalogPage[];
}

// ── CATALOG 01: 施工事例集 ─────────────────────────
// 視聴数上位30本から事例を構成
const topVideos = [...videos]
  .filter((v) => v.tsubo > 0 && v.viewCount > 0)
  .sort((a, b) => b.viewCount - a.viewCount)
  .slice(0, 30);

const caseStudyPages: CatalogPage[] = topVideos.map((v, idx) => {
  // 工務店名から builders-data の builder を引く
  const builder = builders.find((b) => b.name === v.builder);
  const features: string[] = [];
  if (v.tsubo <= 25) features.push('コンパクト平屋');
  if (v.tsubo > 25 && v.tsubo <= 35) features.push('家族の平屋');
  if (v.tsubo > 35) features.push('大型平屋');
  if (builder) {
    features.push(...builder.specialties.slice(0, 2));
  }
  return {
    id: `cs-${v.id}`,
    pageNumber: idx + 1,
    title: v.title,
    subtitle: `${v.prefecture} / ${v.builder}`,
    builderName: v.builder,
    area: v.prefecture,
    layout: v.tsubo > 35 ? '4LDK' : v.tsubo > 25 ? '3LDK' : '2LDK',
    tsubo: v.tsubo,
    features,
    thumbnailVideoId: v.youtubeId,
    description: `${v.builder}が手掛けた${v.tsubo}坪の平屋。YouTube 累計${v.views}を記録した名作ルームツアーです。`,
  };
});

// ── CATALOG 02: 間取り図集 ─────────────────────────
// 17坪〜50坪まで30プラン (10〜34 + extras = 35件 → 30件に絞る)
const floorPlanPages: CatalogPage[] = [
  ...topVideos.slice(0, 30).map((v, idx) => ({
    id: `fp-${v.id}`,
    pageNumber: idx + 1,
    title: `${v.tsubo}坪の${v.tsubo <= 25 ? 'コンパクト' : v.tsubo > 35 ? '大型' : ''}平屋プラン`,
    subtitle: `${v.builder} / ${v.prefecture}`,
    builderName: v.builder,
    area: v.prefecture,
    layout: v.tsubo > 35 ? '4LDK' : v.tsubo > 25 ? '3LDK' : '2LDK',
    tsubo: v.tsubo,
    features: ['平屋', `${v.tsubo}坪`],
    thumbnailVideoId: v.youtubeId,
    description: `${v.tsubo}坪の平屋間取り例。LDK + ${v.tsubo > 35 ? '主寝室+洋室2部屋' : v.tsubo > 25 ? '主寝室+洋室1部屋' : '寝室1部屋'}の構成。`,
  })),
];

export const catalogs: DigitalCatalog[] = [
  {
    id: 'case-studies-30',
    code: 'CATALOG 01',
    title: 'ぺいほーむ厳選 施工事例集',
    subtitle: '九州の名作平屋 30邸',
    description:
      'ぺいほーむがYouTubeで取材・撮影した平屋ルームツアー（累計1,000万再生）から、特に人気の高かった30邸を厳選。各邸の坪数・間取り・工務店・特徴を一覧形式でまとめたデジタルカタログです。',
    coverGradient: 'from-[#3D2200] via-[#8B4513] to-[#3D2200]',
    totalPages: caseStudyPages.length,
    badge: '人気No.1',
    pages: caseStudyPages,
  },
  {
    id: 'floor-plans-30',
    code: 'CATALOG 02',
    title: '平屋間取り図集 30プラン',
    subtitle: '17坪〜50坪までを網羅',
    description:
      '夫婦二人向けのコンパクト平屋（17坪）から、二世帯対応の大型平屋（50坪）まで、ぺいほーむ取材実績から30の間取りプランをまとめました。坪数・間取り・特徴別に検索可能です。',
    coverGradient: 'from-[#E8740C] via-[#F5A623] to-[#E8740C]',
    totalPages: floorPlanPages.length,
    badge: '会員限定',
    pages: floorPlanPages,
  },
];

export function getCatalogById(id: string): DigitalCatalog | undefined {
  return catalogs.find((c) => c.id === id);
}

// 受け取り条件
export const CATALOG_REQUIREMENTS = [
  '無料会員登録（メール / Google）',
  'AI家づくり診断（10問・約2分）の完了',
] as const;
