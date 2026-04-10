/**
 * 工務店データ（v4.0 MVP 強化版）
 *
 * 一覧ページの絞り込み検索（エリア / 価格帯 / 特徴タグ）と
 * 個別ページの詳細表示に必要なメタデータを網羅する。
 */

export type PriceBand = 'low' | 'mid' | 'high' | 'premium';

export interface BuilderData {
  id: string;
  name: string;
  /** 都道府県名（例：鹿児島県） */
  area: string;
  /** 拠点市区町村（例：鹿児島市） */
  region: string;
  /** 対応市町村（絞り込み用、例：['鹿児島市','姶良市','霧島市']） */
  serviceCities: string[];
  /** 特徴タグ（絞り込み用） */
  specialties: string[];
  /** 年間施工棟数 */
  annualBuilds: number;
  /** 価格帯区分（ローコスト / 標準 / 高級 / プレミアム） */
  priceBand: PriceBand;
  /** 坪単価の目安（万円） */
  pricePerTsubo: { min: number; max: number };
  /** 設立年 */
  established: number;
  /** キャッチコピー */
  catchphrase: string;
  /** 会社紹介 */
  description: string;
  /** 強み（3点） */
  strengths: Array<{ title: string; description: string }>;
  /** 構造・工法 */
  construction: string;
  /** 断熱等級（参考値） */
  insulationGrade: string;
  /** 耐震等級 */
  earthquakeGrade: string;
  /** 保証・アフター */
  warranty: string;
  /** 得意な家族構成 */
  suitableFor: string[];
  /** 代表的な事例の動画ID（videos-data との連携） */
  featuredVideoIds: string[];
  /** 電話番号（ダミー可） */
  phone: string;
  /** Webサイト */
  website: string;
}

export const builders: BuilderData[] = [
  {
    id: 'b01',
    name: '万代ホーム',
    area: '鹿児島県',
    region: '鹿児島市',
    serviceCities: ['鹿児島市', '姶良市', '霧島市', '日置市', '南さつま市'],
    specialties: ['平屋', 'ZEH', '自然素材', '子育て'],
    annualBuilds: 120,
    priceBand: 'mid',
    pricePerTsubo: { min: 70, max: 85 },
    established: 1976,
    catchphrase: '鹿児島で年間120棟の実績。平屋に強いエリアNo.1工務店',
    description:
      '鹿児島県内で45年以上にわたり、地域に根ざした家づくりを続けてきた実力派工務店。年間120棟の施工実績は県内トップクラスで、特に平屋住宅は累計800棟以上。ZEH住宅の補助金活用や、子育て世帯向けの家事動線設計に定評があります。',
    strengths: [
      { title: '平屋の累計800棟以上の実績', description: '鹿児島の気候・生活に合わせた平屋設計に30年以上のノウハウ' },
      { title: 'ZEH住宅 補助金最大120万円対応', description: '自社設計でZEH基準をクリア。光熱費削減シミュレーションを提示可能' },
      { title: '土地探しからワンストップ対応', description: '不動産部門と連携し、立地・方角・予算に合う土地を提案' },
    ],
    construction: '木造軸組工法',
    insulationGrade: 'UA値 0.46（等級6相当）',
    earthquakeGrade: '耐震等級3（最高等級）',
    warranty: '構造躯体30年保証 / 60年定期点検',
    suitableFor: ['子育て世帯', 'シニア夫婦', '二世帯住宅'],
    featuredVideoIds: ['11', '17', '23', '29', '32'],
    phone: '099-000-0001',
    website: 'https://example.com/bandai',
  },
  {
    id: 'b02',
    name: 'ベルハウジング',
    area: '鹿児島県',
    region: '鹿児島市',
    serviceCities: ['鹿児島市', '姶良市', '日置市', '薩摩川内市'],
    specialties: ['注文住宅', 'デザイン住宅', '女性設計士', 'リフォーム'],
    annualBuilds: 80,
    priceBand: 'mid',
    pricePerTsubo: { min: 75, max: 90 },
    established: 1988,
    catchphrase: '女性設計士が手掛ける、暮らしに寄り添うデザイン住宅',
    description:
      '女性設計士を多数擁し、女性目線での家事動線・収納計画・インテリアコーディネートに定評のある工務店。完全自由設計の注文住宅のほか、リノベーション実績も豊富です。',
    strengths: [
      { title: '女性設計士による暮らし目線の設計', description: '家事動線・収納・コンセント配置まで徹底ヒアリング' },
      { title: '完全自由設計の注文住宅', description: '規格プランに縛られず、1棟ずつオーダーメイドで設計' },
      { title: 'インテリアコーディネーター常駐', description: '素材選びから家具配置まで一貫サポート' },
    ],
    construction: '木造軸組工法 + パネル工法',
    insulationGrade: 'UA値 0.50（等級5相当）',
    earthquakeGrade: '耐震等級3',
    warranty: '構造躯体20年保証 / 30年定期点検',
    suitableFor: ['子育て世帯', '共働き夫婦', '趣味を楽しみたい方'],
    featuredVideoIds: ['12', '19', '27', '30', '37'],
    phone: '099-000-0002',
    website: 'https://example.com/bell',
  },
  {
    id: 'b03',
    name: 'タマルハウス',
    area: '福岡県',
    region: '福岡市',
    serviceCities: ['福岡市', '春日市', '大野城市', '糟屋郡', '筑紫野市'],
    specialties: ['高気密高断熱', 'デザイン住宅', 'ZEH', '輸入住宅'],
    annualBuilds: 60,
    priceBand: 'high',
    pricePerTsubo: { min: 85, max: 110 },
    established: 2005,
    catchphrase: 'UA値0.35以下。福岡No.1の高気密高断熱住宅',
    description:
      '福岡エリアで最も高い断熱性能を誇る工務店の一つ。全棟C値1.0以下を保証し、ZEHを超えるHEAT20 G2グレードの住宅を標準仕様としています。デザイン性にもこだわり、建築家との協業実績も多数。',
    strengths: [
      { title: 'UA値0.35以下 / C値0.5以下の全棟保証', description: '冬の暖房費が一般住宅の半分以下' },
      { title: '一級建築士との協業設計', description: '数多くのデザイン賞を受賞した設計事務所と連携' },
      { title: '長期優良住宅 標準対応', description: '補助金・税制優遇・金利優遇をフル活用' },
    ],
    construction: '木造軸組工法 + 付加断熱',
    insulationGrade: 'UA値 0.35（HEAT20 G2）',
    earthquakeGrade: '耐震等級3',
    warranty: '構造躯体35年保証 / 60年定期点検',
    suitableFor: ['デザイン重視', '高性能重視', '長期居住計画'],
    featuredVideoIds: ['13', '15', '21', '24', '31', '36'],
    phone: '092-000-0003',
    website: 'https://example.com/tamaru',
  },
  {
    id: 'b04',
    name: '感動ハウス',
    area: '鹿児島県',
    region: '鹿児島市',
    serviceCities: ['鹿児島市', '姶良市', '霧島市', '指宿市'],
    specialties: ['高気密高断熱', '自然素材', 'ZEH', '平屋'],
    annualBuilds: 45,
    priceBand: 'high',
    pricePerTsubo: { min: 80, max: 100 },
    established: 2000,
    catchphrase: 'C値0.3以下の超高気密。体感温度で感動を届ける',
    description:
      '鹿児島県内で圧倒的な気密性能を誇る工務店。全棟気密測定を実施し、C値0.3以下を保証。無垢材・珪藻土・漆喰など自然素材を積極的に採用し、健康住宅としての評価も高い。',
    strengths: [
      { title: 'C値0.3以下の超高気密性能', description: '冷暖房効率が一般住宅の3倍' },
      { title: '全棟気密測定+第三者検査', description: '性能は数値で証明' },
      { title: '無垢材・漆喰などの自然素材', description: 'アレルギー対応・調湿効果' },
    ],
    construction: '木造軸組工法 + 付加断熱',
    insulationGrade: 'UA値 0.40 / C値 0.3',
    earthquakeGrade: '耐震等級3',
    warranty: '構造躯体30年保証 / 50年定期点検',
    suitableFor: ['健康重視', '高性能重視', 'アレルギー世帯'],
    featuredVideoIds: ['14', '35', '08', '06'],
    phone: '099-000-0004',
    website: 'https://example.com/kando',
  },
  {
    id: 'b05',
    name: 'ヤマサハウス',
    area: '鹿児島県',
    region: '鹿児島市',
    serviceCities: ['鹿児島市', '姶良市', '霧島市', '薩摩川内市', '日置市', '南さつま市'],
    specialties: ['平屋', '二世帯', '注文住宅', '耐震'],
    annualBuilds: 150,
    priceBand: 'mid',
    pricePerTsubo: { min: 68, max: 82 },
    established: 1965,
    catchphrase: '創業60年。鹿児島で最も選ばれている地元工務店',
    description:
      '鹿児島県内で創業60年の老舗。年間150棟の施工は県内1位。地元密着ゆえの豊富な土地情報と、二世帯住宅・平屋住宅の設計ノウハウに定評があります。',
    strengths: [
      { title: '年間150棟の施工実績（県内No.1）', description: '60年の信頼と実績' },
      { title: '二世帯住宅の設計に強み', description: '完全分離型から部分共有型まで柔軟対応' },
      { title: '地元密着の土地情報網', description: '不動産仲介実績も豊富' },
    ],
    construction: '木造軸組工法',
    insulationGrade: 'UA値 0.56（等級5）',
    earthquakeGrade: '耐震等級3',
    warranty: '構造躯体30年保証 / 60年点検',
    suitableFor: ['二世帯住宅', '地元志向', '家族多人数'],
    featuredVideoIds: ['18', '34'],
    phone: '099-000-0005',
    website: 'https://example.com/yamasa',
  },
  {
    id: 'b06',
    name: '七呂建設',
    area: '鹿児島県',
    region: '鹿児島市',
    serviceCities: ['鹿児島市', '姶良市', '霧島市'],
    specialties: ['注文住宅', 'ローコスト', '平屋', '店舗併用'],
    annualBuilds: 70,
    priceBand: 'low',
    pricePerTsubo: { min: 55, max: 70 },
    established: 1987,
    catchphrase: '品質とコストのバランス最高。1,500万円台から始める平屋',
    description:
      'コストパフォーマンスに優れた注文住宅で人気。1,500万円台から建てられる規格型プランと、完全自由設計の2ラインを展開。店舗併用住宅の実績も多数。',
    strengths: [
      { title: '1,500万円台〜の規格プラン', description: '若い夫婦でも手が届く価格帯' },
      { title: '徹底した原価管理', description: '同規模他社比で15〜20%安い坪単価' },
      { title: '店舗併用住宅の豊富な実績', description: '自営業・美容室・カフェ併用OK' },
    ],
    construction: '木造軸組工法',
    insulationGrade: 'UA値 0.60（等級5）',
    earthquakeGrade: '耐震等級2〜3',
    warranty: '構造躯体20年保証',
    suitableFor: ['若い夫婦', 'コスト重視', '自営業者'],
    featuredVideoIds: ['20', '26', '39', '04'],
    phone: '099-000-0006',
    website: 'https://example.com/shichiro',
  },
  {
    id: 'b07',
    name: 'ハウスサポート',
    area: '鹿児島県',
    region: '鹿児島市',
    serviceCities: ['鹿児島市', '姶良市', '霧島市', '熊本市', '八代市'],
    specialties: ['平屋', 'ローコスト', 'コンパクト住宅', 'バリアフリー'],
    annualBuilds: 50,
    priceBand: 'low',
    pricePerTsubo: { min: 58, max: 72 },
    established: 1995,
    catchphrase: '「小さなかわいい平屋」で話題沸騰。コンパクト平屋の専門家',
    description:
      'YouTubeで再生回数99万回を記録した「小さなかわいい平屋」の施工会社。25坪以下のコンパクト平屋に特化し、シニア夫婦・おひとり様世帯から絶大な支持を得ています。',
    strengths: [
      { title: '25坪以下のコンパクト平屋に特化', description: '省スペース設計のプロフェッショナル' },
      { title: 'バリアフリー標準仕様', description: '段差ゼロ・引き戸中心・手すり下地完備' },
      { title: 'YouTube人気No.1の実績', description: '累計再生回数500万回超' },
    ],
    construction: '木造軸組工法',
    insulationGrade: 'UA値 0.58（等級5）',
    earthquakeGrade: '耐震等級3',
    warranty: '構造躯体20年保証',
    suitableFor: ['シニア夫婦', 'おひとり様', '夫婦二人'],
    featuredVideoIds: ['10', '16', '22', '33', '02'],
    phone: '099-000-0007',
    website: 'https://example.com/support',
  },
  {
    id: 'b08',
    name: '大分建設',
    area: '大分県',
    region: '大分市',
    serviceCities: ['大分市', '別府市', '臼杵市', '佐伯市'],
    specialties: ['木造住宅', '耐震', '自然素材'],
    annualBuilds: 40,
    priceBand: 'mid',
    pricePerTsubo: { min: 70, max: 85 },
    established: 1970,
    catchphrase: '大分の木と職人で建てる、伝統と技術の融合',
    description:
      '地元大分の木材を使用した木造住宅専門の工務店。県産材活用による補助金申請にも対応し、職人直営ならではの細やかな仕上げに定評があります。',
    strengths: [
      { title: '大分県産材使用で補助金対応', description: '最大100万円の補助金活用可能' },
      { title: '職人直営の高品質施工', description: '下請け任せにしない責任施工' },
      { title: '耐震等級3標準', description: '地震に強い伝統工法の進化形' },
    ],
    construction: '木造軸組工法',
    insulationGrade: 'UA値 0.56（等級5）',
    earthquakeGrade: '耐震等級3',
    warranty: '構造躯体20年保証',
    suitableFor: ['地元志向', '木造重視', '伝統工法希望'],
    featuredVideoIds: ['25', '38'],
    phone: '097-000-0008',
    website: 'https://example.com/oita',
  },
  {
    id: 'b09',
    name: '宮崎建設',
    area: '宮崎県',
    region: '宮崎市',
    serviceCities: ['宮崎市', '都城市', '日向市', '延岡市'],
    specialties: ['注文住宅', 'リノベーション', '南国対応', '耐風'],
    annualBuilds: 35,
    priceBand: 'mid',
    pricePerTsubo: { min: 72, max: 88 },
    established: 1982,
    catchphrase: '台風・強風に強い、南国宮崎の家づくり',
    description:
      '宮崎特有の強風・台風に耐える構造設計と、風通しを活かしたパッシブデザインが強み。リノベーション実績も豊富で、古民家再生も手掛けます。',
    strengths: [
      { title: '耐風等級2対応の構造設計', description: '宮崎の強風地域でも安心' },
      { title: 'パッシブデザイン採用', description: '夏涼しく冬暖かい自然の力を活用' },
      { title: 'リノベーション実績多数', description: '古民家再生・二世帯化にも対応' },
    ],
    construction: '木造軸組工法',
    insulationGrade: 'UA値 0.60（等級5）',
    earthquakeGrade: '耐震等級3 / 耐風等級2',
    warranty: '構造躯体20年保証',
    suitableFor: ['台風対策重視', 'リノベ希望', '地元志向'],
    featuredVideoIds: ['28', '41'],
    phone: '0985-00-0009',
    website: 'https://example.com/miyazaki',
  },
  {
    id: 'b10',
    name: '谷川建設',
    area: '長崎県',
    region: '長崎市',
    serviceCities: ['長崎市', '諫早市', '大村市', '佐世保市'],
    specialties: ['木造住宅', '大規模住宅', '和風住宅', '耐震'],
    annualBuilds: 100,
    priceBand: 'high',
    pricePerTsubo: { min: 85, max: 110 },
    established: 1955,
    catchphrase: '70年の信頼。九州の大規模木造住宅のパイオニア',
    description:
      '創業70年、九州全域で大規模木造住宅を多数手掛けてきた老舗。国産無垢材を使用した和モダン住宅に定評があり、邸宅クラスの注文住宅を多く扱います。',
    strengths: [
      { title: '70年の施工実績', description: '九州屈指の大型工務店' },
      { title: '国産無垢材のみ使用', description: '厳選された檜・杉の良材' },
      { title: '邸宅クラスの大型住宅が得意', description: '40〜60坪の家づくりに強み' },
    ],
    construction: '木造軸組工法（在来工法）',
    insulationGrade: 'UA値 0.50（等級5）',
    earthquakeGrade: '耐震等級3',
    warranty: '構造躯体35年保証 / 永年点検',
    suitableFor: ['大型住宅', '和風希望', '長期居住'],
    featuredVideoIds: [],
    phone: '095-000-0010',
    website: 'https://example.com/tanigawa',
  },
  {
    id: 'b11',
    name: 'ベガハウス',
    area: '鹿児島県',
    region: '鹿児島市',
    serviceCities: ['鹿児島市', '姶良市', '日置市'],
    specialties: ['デザイン住宅', '自然素材', '平屋', '建築家住宅'],
    annualBuilds: 30,
    priceBand: 'premium',
    pricePerTsubo: { min: 95, max: 130 },
    established: 2010,
    catchphrase: '建築家と創る、一点もののデザイン住宅',
    description:
      '建築家デザインを手の届く価格で提供する、鹿児島唯一のデザインビルド工務店。少数精鋭で年30棟のみ受注し、1棟1棟にこだわります。',
    strengths: [
      { title: '一級建築士3名が在籍', description: 'プラン提案から施工管理まで一貫' },
      { title: '年30棟の少数精鋭', description: '品質を最優先した受注制限' },
      { title: '建築賞の受賞多数', description: 'グッドデザイン賞・JIA九州建築大賞など' },
    ],
    construction: '木造軸組工法 + SE構法',
    insulationGrade: 'UA値 0.46（等級6）',
    earthquakeGrade: '耐震等級3',
    warranty: '構造躯体30年保証',
    suitableFor: ['デザイン重視', 'こだわり派', '建築家志向'],
    featuredVideoIds: ['03'],
    phone: '099-000-0011',
    website: 'https://example.com/vega',
  },
  {
    id: 'b12',
    name: '丸和建設',
    area: '鹿児島県',
    region: '霧島市',
    serviceCities: ['霧島市', '姶良市', '鹿児島市', '湧水町'],
    specialties: ['注文住宅', '平屋', '和モダン', '中庭のある家'],
    annualBuilds: 55,
    priceBand: 'mid',
    pricePerTsubo: { min: 72, max: 90 },
    established: 1978,
    catchphrase: '霧島の自然と調和する、中庭のある平屋',
    description:
      '霧島エリアを中心に、中庭を活かした開放的な平屋設計に強みを持つ工務店。地元の気候風土を熟知したパッシブ設計で、エアコンに頼らない暮らしを提案します。',
    strengths: [
      { title: '中庭のある平屋設計の専門家', description: '採光・通風・プライバシーを両立' },
      { title: '霧島エリアの気候に精通', description: '夏涼しく冬暖かい家づくり' },
      { title: '和モダンデザインに定評', description: '伝統と現代が融合した空間' },
    ],
    construction: '木造軸組工法',
    insulationGrade: 'UA値 0.58（等級5）',
    earthquakeGrade: '耐震等級3',
    warranty: '構造躯体25年保証',
    suitableFor: ['自然志向', '平屋希望', '和モダン好き'],
    featuredVideoIds: [],
    phone: '0995-00-0012',
    website: 'https://example.com/maruwa',
  },
];

// ───────── 絞り込み用メタ ─────────
export const PRICE_BAND_LABELS: Record<PriceBand, { label: string; description: string }> = {
  low: { label: '〜1,800万', description: 'ローコスト' },
  mid: { label: '1,800〜2,800万', description: '標準' },
  high: { label: '2,800〜4,000万', description: '高性能・高品質' },
  premium: { label: '4,000万〜', description: 'プレミアム・建築家' },
};

export const ALL_SPECIALTIES = [
  '平屋',
  'ZEH',
  '高気密高断熱',
  '自然素材',
  '注文住宅',
  'デザイン住宅',
  'ローコスト',
  'バリアフリー',
  '二世帯',
  '子育て',
  '耐震',
  '和モダン',
  '建築家住宅',
  'コンパクト住宅',
  '店舗併用',
  'リノベーション',
  '女性設計士',
  '輸入住宅',
  '木造住宅',
  '中庭のある家',
  '南国対応',
  '耐風',
  '大規模住宅',
  '和風住宅',
] as const;

export function getAllCities(): string[] {
  const set = new Set<string>();
  builders.forEach((b) => b.serviceCities.forEach((c) => set.add(c)));
  return Array.from(set).sort();
}

export function getAllPrefectures(): string[] {
  return Array.from(new Set(builders.map((b) => b.area))).sort();
}

export function getBuilderById(id: string): BuilderData | undefined {
  return builders.find((b) => b.id === id);
}
