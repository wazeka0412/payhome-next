/**
 * 土地情報データ
 *
 * 各工務店が販売中・取り扱い中の土地情報。土地は builder_id で工務店と紐付き、
 * /lands 一覧、/lands/[id] 詳細、/builders/[id] 個別ページの
 * 「販売中の土地情報」セクションから参照される。
 */

export type LandStatus = 'available' | 'reserved' | 'sold';

export interface Land {
  id: string;
  builderId: string;
  title: string;
  city: string;
  prefecture: string;
  /** 価格（万円） */
  price: number;
  /** 面積（㎡） */
  area: number;
  /** 坪数 */
  tsubo: number;
  /** 坪単価（万円） */
  pricePerTsubo: number;
  /** 用途地域 */
  zoning: string;
  /** 建ぺい率（%） */
  buildingCoverage: number;
  /** 容積率（%） */
  floorAreaRatio: number;
  /** 接道（東西南北 + 幅員） */
  roadAccess: string;
  /** 地目 */
  landCategory: string;
  /** 都市計画 */
  urbanPlan: string;
  /** ステータス */
  status: LandStatus;
  /** タグ */
  tags: string[];
  /** ヘッドラインキャッチ */
  catchphrase: string;
  /** 物件説明 */
  description: string;
  /** ハイライト */
  highlights: string[];
  /** 周辺環境（学校・スーパー等までの距離） */
  surroundings: Array<{ name: string; distance: string }>;
}

export const lands: Land[] = [
  {
    id: 'ld-001',
    builderId: 'b01',
    title: '【吉野町】南向き整形地 60坪',
    city: '鹿児島市',
    prefecture: '鹿児島県',
    price: 1280,
    area: 198.5,
    tsubo: 60,
    pricePerTsubo: 21.3,
    zoning: '第一種低層住居専用地域',
    buildingCoverage: 60,
    floorAreaRatio: 100,
    roadAccess: '南側公道6m',
    landCategory: '宅地',
    urbanPlan: '市街化区域',
    status: 'available',
    tags: ['南向き', '整形地', '閑静な住宅街', '小学校近い'],
    catchphrase: '南向き60坪の整形地。平屋にも2階建てにも◎',
    description:
      '吉野町の閑静な住宅街にある60坪の整形地。南側に幅6mの公道があり、日当たりは抜群。万代ホームでの建築相談・プラン提案無料です。',
    highlights: ['南向き整形地で日当たり良好', '幅6m公道で駐車もしやすい', '上下水道・電気・ガス引込済み'],
    surroundings: [
      { name: '吉野小学校', distance: '徒歩7分' },
      { name: 'スーパーAコープ', distance: '徒歩9分' },
      { name: '吉野中学校', distance: '徒歩12分' },
      { name: '公園', distance: '徒歩3分' },
    ],
  },
  {
    id: 'ld-002',
    builderId: 'b01',
    title: '【姶良市】角地50坪 整形地',
    city: '姶良市',
    prefecture: '鹿児島県',
    price: 980,
    area: 165.3,
    tsubo: 50,
    pricePerTsubo: 19.6,
    zoning: '第一種中高層住居専用地域',
    buildingCoverage: 60,
    floorAreaRatio: 200,
    roadAccess: '南東角地 6m+4m',
    landCategory: '宅地',
    urbanPlan: '市街化区域',
    status: 'available',
    tags: ['角地', '整形地', '南東角', '広い駐車場可'],
    catchphrase: '南東角地50坪。広い庭と駐車スペース確保',
    description: '姶良市の角地物件。南東2方向道路で日当たりと風通し良好。庭+駐車3台分のゆとりある敷地計画が可能です。',
    highlights: ['南東角地で日当たり最高', '幅6m+4mの2方向道路', '駐車3台＋庭スペース確保'],
    surroundings: [
      { name: '姶良小学校', distance: '徒歩8分' },
      { name: 'イオンタウン姶良', distance: '車5分' },
      { name: '姶良駅', distance: '徒歩15分' },
    ],
  },
  {
    id: 'ld-003',
    builderId: 'b04',
    title: '【鹿児島市】高台の見晴らし60坪',
    city: '鹿児島市',
    prefecture: '鹿児島県',
    price: 1450,
    area: 198.0,
    tsubo: 60,
    pricePerTsubo: 24.2,
    zoning: '第一種低層住居専用地域',
    buildingCoverage: 50,
    floorAreaRatio: 80,
    roadAccess: '北側公道6m',
    landCategory: '宅地',
    urbanPlan: '市街化区域',
    status: 'available',
    tags: ['高台', '見晴らし', '桜島ビュー', '閑静'],
    catchphrase: '桜島を一望できる高台の60坪。眺望抜群',
    description:
      '鹿児島市の高台に位置し、桜島を一望できる希少な土地。感動ハウスの高性能住宅と組み合わせて、眺望と快適性の両方を実現できます。',
    highlights: ['桜島ビューの特等席', '高台で水害リスク低', '閑静な住環境'],
    surroundings: [
      { name: '伊敷小学校', distance: '徒歩10分' },
      { name: 'プラッセだいわ', distance: '車5分' },
    ],
  },
  {
    id: 'ld-004',
    builderId: 'b05',
    title: '【霧島市】広々100坪 二世帯向け',
    city: '霧島市',
    prefecture: '鹿児島県',
    price: 1680,
    area: 330.5,
    tsubo: 100,
    pricePerTsubo: 16.8,
    zoning: '第一種低層住居専用地域',
    buildingCoverage: 60,
    floorAreaRatio: 100,
    roadAccess: '東側公道6m',
    landCategory: '宅地',
    urbanPlan: '市街化区域',
    status: 'available',
    tags: ['100坪', '広い', '二世帯', '駐車場4台以上'],
    catchphrase: '100坪のゆとり。二世帯住宅・駐車4台対応可',
    description:
      '霧島市の広々100坪の整形地。ヤマサハウスの二世帯住宅プランと組み合わせて、ゆとりある二世帯生活が実現できます。',
    highlights: ['100坪のゆとり', '二世帯住宅+駐車4台可', '上水道・下水道完備'],
    surroundings: [
      { name: '霧島小学校', distance: '徒歩6分' },
      { name: '霧島温泉', distance: '車8分' },
    ],
  },
  {
    id: 'ld-005',
    builderId: 'b06',
    title: '【鹿児島市】コンパクト40坪 ローコスト',
    city: '鹿児島市',
    prefecture: '鹿児島県',
    price: 580,
    area: 132.0,
    tsubo: 40,
    pricePerTsubo: 14.5,
    zoning: '第一種住居地域',
    buildingCoverage: 60,
    floorAreaRatio: 200,
    roadAccess: '西側公道4m',
    landCategory: '宅地',
    urbanPlan: '市街化区域',
    status: 'available',
    tags: ['コンパクト', 'ローコスト', '駅近', '若年層向け'],
    catchphrase: '580万円の40坪。コンパクト平屋にちょうどいい',
    description:
      '七呂建設の17坪コンパクト平屋プランと組み合わせると、土地+建物で2,160万円〜の家づくりが可能。若いご夫婦の初めての家づくりに最適です。',
    highlights: ['580万円の手の届く価格', 'コンパクト平屋にぴったり', '駅徒歩圏内'],
    surroundings: [
      { name: '鹿児島中央駅', distance: '徒歩18分' },
      { name: '武小学校', distance: '徒歩11分' },
    ],
  },
  {
    id: 'ld-006',
    builderId: 'b07',
    title: '【熊本市南区】平屋向け55坪',
    city: '熊本市',
    prefecture: '熊本県',
    price: 920,
    area: 181.5,
    tsubo: 55,
    pricePerTsubo: 16.7,
    zoning: '第一種低層住居専用地域',
    buildingCoverage: 50,
    floorAreaRatio: 100,
    roadAccess: '南側公道5m',
    landCategory: '宅地',
    urbanPlan: '市街化区域',
    status: 'available',
    tags: ['平屋向け', '南向き', 'バリアフリー'],
    catchphrase: '平屋に最適な55坪。南向き整形地',
    description:
      'ハウスサポートのコンパクト平屋プランに最適な55坪の整形地。シニア世帯の終の住処として、バリアフリーの平屋を建てる方におすすめ。',
    highlights: ['平屋設計に最適な広さ', '南向きで日当たり良好', '段差ゼロ計画可'],
    surroundings: [
      { name: '城南小学校', distance: '徒歩9分' },
      { name: 'ゆめタウン', distance: '車8分' },
    ],
  },
  {
    id: 'ld-007',
    builderId: 'b03',
    title: '【福岡市東区】高級住宅地 70坪',
    city: '福岡市',
    prefecture: '福岡県',
    price: 3280,
    area: 231.0,
    tsubo: 70,
    pricePerTsubo: 46.9,
    zoning: '第一種低層住居専用地域',
    buildingCoverage: 50,
    floorAreaRatio: 100,
    roadAccess: '南東角地 6m+4m',
    landCategory: '宅地',
    urbanPlan: '市街化区域',
    status: 'available',
    tags: ['角地', '高級住宅地', '70坪', '南東角'],
    catchphrase: '高級住宅地の角地70坪。タマルハウスの高性能住宅向け',
    description:
      '福岡市東区の人気高級住宅地。南東角地の希少物件で、タマルハウスのHEAT20 G2グレード住宅と組み合わせれば最高の住環境が実現できます。',
    highlights: ['人気エリアの希少角地', '南東2方向道路', '70坪のゆとり'],
    surroundings: [
      { name: '香椎小学校', distance: '徒歩7分' },
      { name: '香椎駅', distance: '徒歩12分' },
      { name: 'イオン香椎浜', distance: '車7分' },
    ],
  },
  {
    id: 'ld-008',
    builderId: 'b12',
    title: '【霧島市】霧島連山ビュー 80坪',
    city: '霧島市',
    prefecture: '鹿児島県',
    price: 1280,
    area: 264.5,
    tsubo: 80,
    pricePerTsubo: 16.0,
    zoning: '第一種低層住居専用地域',
    buildingCoverage: 50,
    floorAreaRatio: 80,
    roadAccess: '東側公道5m',
    landCategory: '宅地',
    urbanPlan: '市街化区域',
    status: 'available',
    tags: ['80坪', '景観良好', '霧島連山', '中庭可'],
    catchphrase: '霧島連山を借景にできる80坪。中庭のある家に',
    description:
      '丸和建設の中庭のある平屋プランに最適な80坪。霧島連山の眺望を活かした借景設計で、自然と一体化する暮らしを実現できます。',
    highlights: ['霧島連山ビュー', '80坪のゆとりで中庭設計可', '自然豊かな環境'],
    surroundings: [
      { name: '霧島小学校', distance: '徒歩9分' },
      { name: '霧島温泉郷', distance: '車12分' },
    ],
  },
  {
    id: 'ld-009',
    builderId: 'b02',
    title: '【姶良市】整形地55坪 子育てエリア',
    city: '姶良市',
    prefecture: '鹿児島県',
    price: 880,
    area: 181.5,
    tsubo: 55,
    pricePerTsubo: 16.0,
    zoning: '第一種住居地域',
    buildingCoverage: 60,
    floorAreaRatio: 200,
    roadAccess: '南側公道5m',
    landCategory: '宅地',
    urbanPlan: '市街化区域',
    status: 'available',
    tags: ['整形地', '子育て', '小学校近い', '公園あり'],
    catchphrase: '小学校・公園が徒歩圏内。子育て世帯向け55坪',
    description:
      'ベルハウジングの女性設計士が監修する子育て世帯向け土地。小学校・公園・スーパーが徒歩圏内で、安心・便利な子育てライフを実現できます。',
    highlights: ['小学校徒歩5分', '公園隣接', '生活施設徒歩圏'],
    surroundings: [
      { name: '姶良小学校', distance: '徒歩5分' },
      { name: '中央公園', distance: '徒歩3分' },
      { name: 'マックスバリュ', distance: '徒歩10分' },
    ],
  },
];

// ────── ヘルパー ──────
export function getLandById(id: string): Land | undefined {
  return lands.find((l) => l.id === id);
}

export function getLandsByBuilderId(builderId: string): Land[] {
  return lands.filter((l) => l.builderId === builderId);
}

export const LAND_STATUS_LABELS: Record<LandStatus, { label: string; color: string }> = {
  available: { label: '販売中', color: 'bg-[#E8740C] text-white' },
  reserved: { label: '商談中', color: 'bg-amber-500 text-white' },
  sold: { label: '成約済み', color: 'bg-gray-400 text-white' },
};

export const LAND_PRICE_BANDS = [
  { value: 'all', label: 'すべて', min: 0, max: Infinity },
  { value: 'low', label: '〜800万円', min: 0, max: 800 },
  { value: 'mid', label: '800〜1,500万円', min: 800, max: 1500 },
  { value: 'high', label: '1,500〜2,500万円', min: 1500, max: 2500 },
  { value: 'premium', label: '2,500万円〜', min: 2500, max: Infinity },
] as const;
