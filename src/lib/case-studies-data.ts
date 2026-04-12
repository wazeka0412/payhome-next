/**
 * 平屋事例ライブラリ — 完成事例データ（v4.0 MVP）
 *
 * 要件: 完成事例を間取り / 費用 / 工務店 / タグで検索可能
 * 会員特典: 非会員は5件まで閲覧可、6件目以降は会員登録必須
 *
 * videos-data.ts / properties.ts との違い:
 *  - videos は動画の側面、properties は販売可能物件の側面
 *  - case-studies は「実際に建った完成事例」としての記録。施主レビューと
 *    完成後評価、総額（土地+建物+諸費用）を持つ。
 */

import { videos } from './videos-data';
import { builders } from './builders-data';

export type LayoutType = '1LDK' | '2LDK' | '3LDK' | '4LDK' | '5LDK+';

export interface CaseStudyPhoto {
  src: string;
  alt: string;
  category: 'exterior' | 'interior';
}

export interface CaseStudy {
  id: string;
  builderId: string;
  title: string;
  /** 完成年月 YYYY-MM */
  completedAt: string;
  /** 所在地 */
  city: string;
  prefecture: string;
  /** 間取り */
  layout: LayoutType;
  /** 建物坪数 */
  tsubo: number;
  /** 建物面積㎡ */
  buildingArea: number;
  /** 敷地面積㎡ */
  landArea: number;
  /** 建物本体価格（万円） */
  buildingPrice: number;
  /** 土地価格（万円、土地あり時のみ） */
  landPrice: number | null;
  /** 総額（建物 + 土地 + 諸費用、万円） */
  totalPrice: number;
  /** 家族構成 */
  familyStructure: string;
  /** サムネ用 YouTube ID（実写真がない間の代替） */
  youtubeId: string;
  /** 外観・内観写真（約20枚） */
  photos: CaseStudyPhoto[];
  /** タグ（絞り込み用） */
  tags: string[];
  /** キャッチコピー */
  catchphrase: string;
  /** 事例の説明 */
  description: string;
  /** 設計のポイント 3点 */
  designPoints: string[];
  /** 施主のコメント */
  ownerComment: string;
}

// ── 事例は videos-data の上位を元に "完成事例化" する ──
// 実運用では Supabase の case_studies テーブルから引くが、v4.0 は mock。

const sourceVideos = [...videos]
  .filter((v) => v.tsubo > 0 && v.viewCount > 0)
  .sort((a, b) => b.viewCount - a.viewCount)
  .slice(0, 25);

function inferLayout(tsubo: number): LayoutType {
  if (tsubo <= 18) return '1LDK';
  if (tsubo <= 25) return '2LDK';
  if (tsubo <= 32) return '3LDK';
  if (tsubo <= 40) return '4LDK';
  return '5LDK+';
}

function inferFamily(tsubo: number, seed: number): string {
  const families = [
    '夫婦2人',
    '夫婦 + 子ども1人',
    '夫婦 + 子ども2人',
    '夫婦 + 子ども2人 + 愛犬',
    'シニア夫婦（60代）',
    '単身（30代）',
    '3世代（6人）',
  ];
  if (tsubo <= 20) return families[(seed + 5) % 3 === 0 ? 5 : 0];
  if (tsubo <= 28) return families[seed % 2 + 1];
  if (tsubo <= 38) return families[(seed % 2) + 2];
  return families[6];
}

function inferBuildingPrice(tsubo: number, builderId: string): number {
  const b = builders.find((x) => x.id === builderId);
  if (!b) return Math.round(tsubo * 75);
  const perTsubo = (b.pricePerTsubo.min + b.pricePerTsubo.max) / 2;
  return Math.round(tsubo * perTsubo);
}

function inferLandPrice(tsubo: number, hasLand: boolean, seed: number): number | null {
  if (!hasLand) return null;
  const landTsubo = Math.round(tsubo * 2); // おおよそ建坪の2倍
  const perTsubo = 14 + (seed % 6); // 14〜19万/坪
  return landTsubo * perTsubo;
}

function inferDesignPoints(tsubo: number, tags: string[]): string[] {
  const base = [
    '家事動線を最短化したコの字型LDK',
    '全居室に自然光が入る南面大開口',
    '収納たっぷりのファミリークローゼット',
    '土間収納・パントリーで玄関まわりスッキリ',
    '回遊動線で子どもが走り回れる平屋',
    '高気密高断熱で冷暖房費を削減',
    '玄関から水回りまで段差ゼロのバリアフリー',
    '吹き抜け＋シーリングファンで空気循環',
  ];
  const picks: string[] = [];
  const used = new Set<number>();
  const seed = tsubo + tags.length * 3;
  for (let i = 0; i < 3; i++) {
    let idx = (seed + i * 7) % base.length;
    while (used.has(idx)) idx = (idx + 1) % base.length;
    used.add(idx);
    picks.push(base[idx]);
  }
  return picks;
}

function inferTags(tsubo: number, builderSpecs: string[]): string[] {
  const tags: string[] = ['平屋'];
  if (tsubo <= 22) tags.push('コンパクト', '25坪以下');
  else if (tsubo <= 32) tags.push('ミドル', '30坪前後');
  else tags.push('大型', '35坪以上');
  builderSpecs.slice(0, 3).forEach((s) => {
    if (!tags.includes(s)) tags.push(s);
  });
  return tags;
}

function inferCatchphrase(tsubo: number, family: string): string {
  if (tsubo <= 20) return `${family}の理想を叶えた、${tsubo}坪のコンパクト平屋`;
  if (tsubo <= 30) return `家族の暮らしに寄り添う、${tsubo}坪の3LDK平屋`;
  return `ゆとりの${tsubo}坪。${family}が暮らす大型平屋`;
}

function inferOwnerComment(family: string, tsubo: number): string {
  const comments = [
    `想像以上に暮らしやすい家になりました。${tsubo}坪とは思えない広さを感じます。`,
    `家事動線が本当にラクで、共働きの私たちには最適でした。`,
    `子どもが走り回れる平屋を選んで正解でした。毎日楽しく過ごせています。`,
    `シニアになっても安心して暮らせるよう設計してもらい、満足しています。`,
    `光の入り方と風通しが素晴らしく、エアコンがほぼ不要な季節もあります。`,
  ];
  const seed = tsubo + family.length;
  return comments[seed % comments.length];
}

function inferCompletedAt(i: number): string {
  // 2025年1月〜2026年3月の範囲に分散させる
  const months = 15;
  const monthOffset = (i * 7) % months;
  const year = monthOffset < 12 ? 2025 : 2026;
  const month = (monthOffset % 12) + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
}

export const caseStudies: CaseStudy[] = sourceVideos.map((v, i) => {
  const builder = builders.find((b) => b.name === v.builder);
  const builderId = builder?.id || 'b01';
  const layout = inferLayout(v.tsubo);
  const family = inferFamily(v.tsubo, i);
  const hasLand = i % 3 !== 0; // 2/3は土地込み
  const buildingPrice = inferBuildingPrice(v.tsubo, builderId);
  const landPrice = inferLandPrice(v.tsubo, hasLand, i);
  const totalPrice = buildingPrice + (landPrice || 0) + Math.round(buildingPrice * 0.08);
  const tags = inferTags(v.tsubo, builder?.specialties || []);

  return {
    id: `cs-${v.id}`,
    builderId,
    title: v.title,
    completedAt: inferCompletedAt(i),
    city: v.prefecture.replace('県', '市'),
    prefecture: v.prefecture,
    layout,
    tsubo: v.tsubo,
    buildingArea: Math.round(v.tsubo * 3.31 * 10) / 10,
    landArea: Math.round(v.tsubo * 6.6 * 10) / 10,
    buildingPrice,
    landPrice,
    totalPrice,
    familyStructure: family,
    youtubeId: v.youtubeId,
    photos: generatePhotos(v.title, v.tsubo, layout),
    tags,
    catchphrase: inferCatchphrase(v.tsubo, family),
    description: `${v.builder}が手掛けた${v.tsubo}坪の${layout}。${family}のための平屋として、動線・収納・採光にこだわって設計されました。YouTube累計${v.views}を記録した、ぺいほーむ注目の完成事例です。`,
    designPoints: inferDesignPoints(v.tsubo, tags),
    ownerComment: inferOwnerComment(family, v.tsubo),
  };
});

/**
 * 事例写真データを生成する（MVP はプレースホルダ画像）
 *
 * 実運用では Supabase Storage に実写真をアップロードし、URLを参照する。
 * 現在は SVG プレースホルダを利用。外観 8 枚 + 内観 12 枚 = 20 枚構成。
 */
function generatePhotos(title: string, tsubo: number, layout: string): CaseStudyPhoto[] {
  const exteriorLabels = [
    '外観正面', '外観全体', '外観 玄関アプローチ', '外観 庭側',
    '外観 夕景', '外観 駐車場側', '外観 屋根', '外観 植栽',
  ];
  const interiorLabels = [
    'LDK 全体', 'キッチン', 'ダイニング', 'リビング',
    '主寝室', '洋室', 'WIC・収納', '洗面脱衣室',
    '浴室', 'トイレ', '玄関ホール', 'ウッドデッキ',
  ];

  const photos: CaseStudyPhoto[] = [];

  for (const label of exteriorLabels) {
    photos.push({
      src: `/api/placeholder/800/600?text=${encodeURIComponent(label + ' ' + tsubo + '坪 ' + layout)}`,
      alt: `${title} ${label}`,
      category: 'exterior',
    });
  }
  for (const label of interiorLabels) {
    photos.push({
      src: `/api/placeholder/800/600?text=${encodeURIComponent(label + ' ' + tsubo + '坪 ' + layout)}`,
      alt: `${title} ${label}`,
      category: 'interior',
    });
  }

  return photos;
}

// ── ヘルパー ──
export function getCaseStudyById(id: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.id === id);
}

export function getCaseStudiesByBuilderId(builderId: string): CaseStudy[] {
  return caseStudies.filter((c) => c.builderId === builderId);
}

export const LAYOUT_OPTIONS: Array<{ value: LayoutType | 'all'; label: string }> = [
  { value: 'all', label: 'すべて' },
  { value: '1LDK', label: '1LDK' },
  { value: '2LDK', label: '2LDK' },
  { value: '3LDK', label: '3LDK' },
  { value: '4LDK', label: '4LDK' },
  { value: '5LDK+', label: '5LDK以上' },
];

export const TOTAL_PRICE_BANDS = [
  { value: 'all', label: 'すべて', min: 0, max: Infinity },
  { value: 'u2000', label: '〜2,000万円', min: 0, max: 2000 },
  { value: 'u3000', label: '2,000〜3,000万円', min: 2000, max: 3000 },
  { value: 'u4000', label: '3,000〜4,000万円', min: 3000, max: 4000 },
  { value: 'o4000', label: '4,000万円〜', min: 4000, max: Infinity },
] as const;

export const ALL_TAGS = Array.from(
  new Set(caseStudies.flatMap((c) => c.tags))
).sort();

/** 非会員の閲覧上限 */
export const FREE_VIEW_LIMIT = 5;
