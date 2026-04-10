/**
 * 建売分譲物件データ
 *
 * 各工務店が販売中の分譲戸建情報。物件は builder_id で工務店と紐付き、
 * /sale-homes 一覧、/sale-homes/[id] 詳細、/builders/[id] 個別ページの
 * 「販売中の分譲戸建」セクションから参照される。
 *
 * v4.0 では mock データだが、構造は将来 Supabase の sale_homes テーブルに
 * そのまま移行できるよう設計している。
 */

export type SaleHomeStatus = 'available' | 'reserved' | 'sold';

export interface SaleHome {
  id: string;
  builderId: string;
  title: string;
  city: string; // 鹿児島市など
  prefecture: string; // 鹿児島県など
  /** 本体価格（万円） */
  price: number;
  /** 土地面積（㎡） */
  landArea: number;
  /** 建物面積（㎡） */
  buildingArea: number;
  /** 坪数換算 */
  tsubo: number;
  layout: string; // 3LDK など
  /** 平屋 or 2階建て */
  houseType: '平屋' | '2階建て' | '3階建て';
  /** 駐車場台数 */
  parking: number;
  /** 完成時期（YYYY-MM） */
  completionDate: string;
  /** ステータス */
  status: SaleHomeStatus;
  /** タグ（中庭/南向き/2階建て等） */
  tags: string[];
  /** ヘッドラインキャッチ */
  catchphrase: string;
  /** 物件説明 */
  description: string;
  /** ハイライト3点 */
  highlights: string[];
  /** 設備仕様 */
  facilities: string[];
}

export const saleHomes: SaleHome[] = [
  {
    id: 'sh-001',
    builderId: 'b01',
    title: '【吉野町】中庭のある平屋 3LDK',
    city: '鹿児島市',
    prefecture: '鹿児島県',
    price: 3280,
    landArea: 198.5,
    buildingArea: 92.7,
    tsubo: 28,
    layout: '3LDK',
    houseType: '平屋',
    parking: 2,
    completionDate: '2026-06',
    status: 'available',
    tags: ['平屋', '中庭', '南向き', 'ZEH', '駐車2台'],
    catchphrase: '中庭から光が差し込む、家事動線最短の平屋',
    description:
      '万代ホームが手掛ける吉野町エリアの新築分譲平屋。中庭を中心としたコの字型の間取りで、リビング・ダイニング・キッチンに自然光がたっぷり入ります。家事動線を徹底的に追求し、洗濯〜物干し〜収納が3歩で完結。',
    highlights: [
      'リビングから眺める中庭デッキ',
      'パントリー＋ファミリークローゼット完備',
      'ZEH補助金最大100万円対象',
    ],
    facilities: ['食洗機', '床暖房', '太陽光5kW', 'EV充電コンセント', '宅配ボックス'],
  },
  {
    id: 'sh-002',
    builderId: 'b01',
    title: '【姶良市】子育て家族の2階建て 4LDK',
    city: '姶良市',
    prefecture: '鹿児島県',
    price: 3680,
    landArea: 165.3,
    buildingArea: 105.2,
    tsubo: 32,
    layout: '4LDK',
    houseType: '2階建て',
    parking: 2,
    completionDate: '2026-05',
    status: 'available',
    tags: ['2階建て', '子育て', '対面キッチン', 'ZEH'],
    catchphrase: '小学校徒歩5分。子育てしやすい立地と間取り',
    description:
      '姶良市の閑静な住宅地に建つ4LDKの分譲住宅。小学校・公園が徒歩圏内で、子育て世帯に最適な立地。リビング階段+対面キッチンで家族の気配を感じられる設計です。',
    highlights: ['小学校徒歩5分・公園隣接', 'リビング階段+対面キッチン', '6帖大の主寝室にWIC'],
    facilities: ['食洗機', '浴室乾燥機', '太陽光4kW', 'カウンターキッチン'],
  },
  {
    id: 'sh-003',
    builderId: 'b04',
    title: '【鹿児島市】超高気密C値0.3の高性能平屋',
    city: '鹿児島市',
    prefecture: '鹿児島県',
    price: 3980,
    landArea: 210.8,
    buildingArea: 99.4,
    tsubo: 30,
    layout: '3LDK',
    houseType: '平屋',
    parking: 2,
    completionDate: '2026-07',
    status: 'available',
    tags: ['平屋', '高気密高断熱', '自然素材', 'C値0.3'],
    catchphrase: 'C値0.3、UA値0.40。冷暖房費は半分以下',
    description:
      '感動ハウスの代表作とも言える超高気密住宅。全棟気密測定実施でC値0.3を保証。無垢材・漆喰・珪藻土を採用した健康住宅でもあります。',
    highlights: ['全棟気密測定でC値0.3保証', '無垢材・漆喰・珪藻土の自然素材', '冷暖房費が一般住宅の半分以下'],
    facilities: ['全館空調', '床暖房', '太陽光6kW', '蓄電池', '24時間換気'],
  },
  {
    id: 'sh-004',
    builderId: 'b05',
    title: '【霧島市】二世帯向け 5LDK大型平屋',
    city: '霧島市',
    prefecture: '鹿児島県',
    price: 4580,
    landArea: 280.4,
    buildingArea: 142.3,
    tsubo: 43,
    layout: '5LDK',
    houseType: '平屋',
    parking: 4,
    completionDate: '2026-08',
    status: 'available',
    tags: ['平屋', '二世帯', '大型', 'バリアフリー'],
    catchphrase: '親世帯と子世帯がほどよく繋がる、大型平屋',
    description:
      'ヤマサハウスの二世帯設計ノウハウを活かした大型平屋。玄関は共有しつつ、リビング・水回りは分離。バリアフリー設計で親世帯も安心です。',
    highlights: ['玄関共有・LDK分離の半二世帯型', '全室バリアフリー設計', '駐車場4台分'],
    facilities: ['ホームエレベーター', '床暖房', '太陽光6kW', '手すり完備'],
  },
  {
    id: 'sh-005',
    builderId: 'b06',
    title: '【鹿児島市】1,580万円のコンパクト平屋 2LDK',
    city: '鹿児島市',
    prefecture: '鹿児島県',
    price: 1580,
    landArea: 135.6,
    buildingArea: 56.2,
    tsubo: 17,
    layout: '2LDK',
    houseType: '平屋',
    parking: 1,
    completionDate: '2026-05',
    status: 'available',
    tags: ['平屋', 'ローコスト', 'コンパクト', '夫婦二人'],
    catchphrase: '夫婦二人にちょうどいい。1,580万円〜の平屋',
    description:
      '七呂建設のコンパクトプラン。夫婦二人やシニア世帯向けに、必要な要素を全て詰め込んだ17坪の小さな平屋。光熱費も最小限で、暮らしのランニングコストも抑えられます。',
    highlights: ['本体価格1,580万円〜', '掃除しやすい17坪設計', 'シンプルで使いやすい間取り'],
    facilities: ['IH', '浴室乾燥機', 'LED照明標準', '宅配ボックス'],
  },
  {
    id: 'sh-006',
    builderId: 'b07',
    title: '【熊本市南区】コンパクト平屋 1LDK＋土間',
    city: '熊本市',
    prefecture: '熊本県',
    price: 1980,
    landArea: 145.0,
    buildingArea: 62.5,
    tsubo: 19,
    layout: '1LDK＋土間',
    houseType: '平屋',
    parking: 2,
    completionDate: '2026-06',
    status: 'reserved',
    tags: ['平屋', 'コンパクト', '土間', 'バリアフリー'],
    catchphrase: '土間のあるシニア向けバリアフリー平屋',
    description:
      'YouTubeで話題の「小さなかわいい平屋」の派生プラン。広い土間スペースで趣味や家事、ペットと暮らせる多目的空間。段差ゼロのバリアフリー設計。',
    highlights: ['広い土間スペース', '段差ゼロのフルバリアフリー', '掃除しやすい19坪'],
    facilities: ['IH', '浴室手すり', '引き戸中心', 'スロープ標準'],
  },
  {
    id: 'sh-007',
    builderId: 'b03',
    title: '【福岡市東区】UA値0.32 高性能2階建て 4LDK',
    city: '福岡市',
    prefecture: '福岡県',
    price: 4880,
    landArea: 168.4,
    buildingArea: 115.7,
    tsubo: 35,
    layout: '4LDK',
    houseType: '2階建て',
    parking: 2,
    completionDate: '2026-07',
    status: 'available',
    tags: ['2階建て', '高気密高断熱', 'デザイン住宅', 'HEAT20 G2'],
    catchphrase: 'HEAT20 G2グレードの最高性能住宅',
    description:
      'タマルハウスの高性能ラインの代表作。UA値0.32、C値0.5以下を保証する省エネ住宅。冬の暖房費は一般住宅の40%以下を実現。一級建築士のデザイン監修。',
    highlights: ['UA値0.32 / C値0.5以下', 'デザイン賞受賞建築家の監修', '長期優良住宅認定'],
    facilities: ['全館空調', '太陽光7kW', '蓄電池', '床暖房', '電気自動車充電'],
  },
  {
    id: 'sh-008',
    builderId: 'b03',
    title: '【春日市】輸入住宅風2階建て 3LDK',
    city: '春日市',
    prefecture: '福岡県',
    price: 4280,
    landArea: 152.0,
    buildingArea: 108.5,
    tsubo: 33,
    layout: '3LDK',
    houseType: '2階建て',
    parking: 2,
    completionDate: '2026-08',
    status: 'available',
    tags: ['2階建て', '輸入住宅', 'デザイン住宅', '高気密高断熱'],
    catchphrase: 'カリフォルニア風の輸入住宅。海辺のような暮らし',
    description:
      '白い壁と青いドアが印象的な輸入住宅風の分譲住宅。高い断熱性能と西海岸風のリラックス感のある内装デザインで、毎日が休日のような暮らしを実現。',
    highlights: ['カリフォルニア風の外観', 'タンクレストイレ・カウンター洗面', '無垢フローリング'],
    facilities: ['食洗機', '浴室乾燥', '太陽光5kW', 'シーリングファン'],
  },
  {
    id: 'sh-009',
    builderId: 'b12',
    title: '【霧島市】中庭のある和モダン平屋 3LDK',
    city: '霧島市',
    prefecture: '鹿児島県',
    price: 3480,
    landArea: 220.0,
    buildingArea: 95.8,
    tsubo: 29,
    layout: '3LDK',
    houseType: '平屋',
    parking: 2,
    completionDate: '2026-06',
    status: 'available',
    tags: ['平屋', '中庭', '和モダン', '自然素材'],
    catchphrase: '霧島の自然と一体化する、中庭のある和モダン平屋',
    description:
      '丸和建設の真骨頂。霧島連山を借景にした中庭のある平屋。和モダンの落ち着いた雰囲気と、パッシブ設計による自然な温熱環境が魅力です。',
    highlights: ['霧島連山を望む大開口窓', '中庭を中心としたコの字型設計', 'パッシブ設計でエアコン依存少'],
    facilities: ['薪ストーブ標準', '無垢床', '太陽光4kW', '雨水タンク'],
  },
  {
    id: 'sh-010',
    builderId: 'b02',
    title: '【鹿児島市】女性設計士の家事ラク平屋 3LDK',
    city: '鹿児島市',
    prefecture: '鹿児島県',
    price: 3380,
    landArea: 175.2,
    buildingArea: 88.6,
    tsubo: 27,
    layout: '3LDK',
    houseType: '平屋',
    parking: 2,
    completionDate: '2026-07',
    status: 'available',
    tags: ['平屋', '女性設計士', '家事動線', '収納豊富'],
    catchphrase: '女性設計士が考えた、家事動線最短の平屋',
    description:
      'ベルハウジングの女性設計士が手がけた、共働き世帯のための平屋。洗濯〜物干し〜収納が直線で完結する家事動線と、玄関〜パントリー〜キッチンの買い物動線を両立。',
    highlights: ['家事動線最短の回遊型LDK', 'ファミリークローゼット6帖', 'シューズクローク完備'],
    facilities: ['食洗機', 'タッチレス水栓', '浴室乾燥', '玄関ベンチ'],
  },
];

// ────── ヘルパー関数 ──────
export function getSaleHomeById(id: string): SaleHome | undefined {
  return saleHomes.find((s) => s.id === id);
}

export function getSaleHomesByBuilderId(builderId: string): SaleHome[] {
  return saleHomes.filter((s) => s.builderId === builderId);
}

export const SALE_HOME_STATUS_LABELS: Record<SaleHomeStatus, { label: string; color: string }> = {
  available: { label: '販売中', color: 'bg-[#E8740C] text-white' },
  reserved: { label: '商談中', color: 'bg-amber-500 text-white' },
  sold: { label: '成約済み', color: 'bg-gray-400 text-white' },
};

export const SALE_PRICE_BANDS = [
  { value: 'all', label: 'すべて', min: 0, max: Infinity },
  { value: 'low', label: '〜2,000万円', min: 0, max: 2000 },
  { value: 'mid', label: '2,000〜3,500万円', min: 2000, max: 3500 },
  { value: 'high', label: '3,500〜5,000万円', min: 3500, max: 5000 },
  { value: 'premium', label: '5,000万円〜', min: 5000, max: Infinity },
] as const;
