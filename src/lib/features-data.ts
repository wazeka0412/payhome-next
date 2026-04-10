/**
 * v4.0 MVP 特集データ
 *
 * 特集は3種類に絞る：
 * 1. 県別特集（prefecture）：鹿児島 / 福岡 / 熊本 / 宮崎 / 大分 / 長崎 / 佐賀
 * 2. 平屋特集（hiraya）：小さな平屋 / コンパクト平屋 / 大きな平屋 / 中庭のある平屋
 * 3. 工務店特集（builder）：年間施工棟数上位の工務店ピックアップ
 *
 * 特集詳細は動的にフィルタリングした物件・工務店を並べるだけのシンプル構成。
 */

export type FeatureType = 'prefecture' | 'hiraya' | 'builder';

export interface Feature {
  id: string;
  type: FeatureType;
  title: string;
  subtitle: string;
  description: string;
  heroColor: string; // Tailwind gradient
  filter: {
    prefecture?: string;
    tsuboMin?: number;
    tsuboMax?: number;
    builder?: string;
  };
}

export const features: Feature[] = [
  // ── 県別特集 ──
  {
    id: 'kagoshima',
    type: 'prefecture',
    title: '鹿児島の平屋特集',
    subtitle: '鹿児島で平屋を建てる',
    description: '南九州ならではの開放的な平屋ルームツアーを集めました。鹿児島の気候・風土に合った間取りと、地元工務店の強みをぺいほーむ編集部が取材した完全ガイドです。',
    heroColor: 'from-[#E8740C] via-[#F5A623] to-[#E8740C]',
    filter: { prefecture: '鹿児島県' },
  },
  {
    id: 'fukuoka',
    type: 'prefecture',
    title: '福岡の平屋特集',
    subtitle: '福岡で平屋を建てる',
    description: '都市近郊でも実現できるゆとりある平屋の実例を集めました。福岡エリアの人気工務店のこだわりと、土地選びから資金計画まで丁寧に紹介します。',
    heroColor: 'from-[#3D2200] via-[#8B4513] to-[#3D2200]',
    filter: { prefecture: '福岡県' },
  },
  {
    id: 'kumamoto',
    type: 'prefecture',
    title: '熊本の平屋特集',
    subtitle: '熊本で平屋を建てる',
    description: '熊本ならではの自然素材・木の温もりを活かした平屋の魅力を紹介します。',
    heroColor: 'from-emerald-700 via-emerald-500 to-emerald-700',
    filter: { prefecture: '熊本県' },
  },
  {
    id: 'miyazaki',
    type: 'prefecture',
    title: '宮崎の平屋特集',
    subtitle: '宮崎で平屋を建てる',
    description: '南国・宮崎の開放感あふれる平屋ライフスタイルをお届けします。',
    heroColor: 'from-sky-700 via-sky-500 to-sky-700',
    filter: { prefecture: '宮崎県' },
  },

  // ── 平屋特集 ──
  {
    id: 'small-hiraya',
    type: 'hiraya',
    title: '小さな平屋特集',
    subtitle: '25坪以下のコンパクト平屋',
    description: '夫婦二人・シニア世帯におすすめの、必要最小限で豊かに暮らせる小さな平屋。ローコスト・家事動線・老後の安心を兼ね備えた厳選ルームツアー集です。',
    heroColor: 'from-[#E8740C] via-[#FFC670] to-[#E8740C]',
    filter: { tsuboMax: 25 },
  },
  {
    id: 'medium-hiraya',
    type: 'hiraya',
    title: '家族のための平屋特集',
    subtitle: '26〜35坪の子育て平屋',
    description: '子育て世帯に人気の中規模平屋。家族4人がのびのび暮らせる間取りと、動線の工夫を紹介します。',
    heroColor: 'from-rose-700 via-pink-500 to-rose-700',
    filter: { tsuboMin: 26, tsuboMax: 35 },
  },
  {
    id: 'large-hiraya',
    type: 'hiraya',
    title: '大きな平屋特集',
    subtitle: '36坪以上の贅沢平屋',
    description: '二世帯・大家族・在宅ワーク対応の大型平屋。回遊動線・中庭・ビルトインガレージなど、ぺいほーむ厳選の大型ルームツアーをまとめました。',
    heroColor: 'from-indigo-700 via-purple-600 to-indigo-700',
    filter: { tsuboMin: 36 },
  },

  // ── 工務店特集 ──
  {
    id: 'builder-kagoshima-top',
    type: 'builder',
    title: '鹿児島の実力派工務店特集',
    subtitle: '年間施工棟数100棟以上の信頼',
    description: '鹿児島県内で年間100棟以上の施工実績を持つ実力派工務店をぺいほーむが厳選。万代ホーム・ヤマサハウスの強みと最新動画をご紹介します。',
    heroColor: 'from-amber-700 via-yellow-600 to-amber-700',
    filter: { prefecture: '鹿児島県' },
  },
];

export function getFeatureById(id: string): Feature | undefined {
  return features.find((f) => f.id === id);
}
