export interface EventData {
  id: string;
  title: string;
  type: 'completion' | 'model' | 'online' | 'special';
  typeLabel: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  location: string;
  address: string;
  prefecture: string;
  builder: string;
  capacity: number;
  images: string[];
  highlights: string[];
  features: {
    label: string;
    value: string;
  }[];
  status?: string;
  publishDate?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogpImage?: string;
}

export const EVENT_TYPE_STYLES: Record<EventData['type'], { bg: string; text: string }> = {
  completion: { bg: 'bg-[#E8740C]/10', text: 'text-[#E8740C]' },
  model: { bg: 'bg-green-50', text: 'text-green-700' },
  online: { bg: 'bg-blue-50', text: 'text-blue-700' },
  special: { bg: 'bg-orange-50', text: 'text-orange-700' },
};

export const events: EventData[] = [
  {
    id: 'ev-001',
    title: '【鹿児島市】平屋3LDK完成見学会 ─ 中庭のある暮らし',
    type: 'completion',
    typeLabel: '完成見学会',
    description:
      '鹿児島市吉野町に誕生した、中庭を囲むコの字型の平屋住宅。延床面積28坪ながら、家事動線を徹底的に追求した間取りと、リビングから眺める四季折々の中庭が魅力です。YouTubeで99万回再生を記録したルームツアーの家を、実際にご体感いただけます。',
    startDate: '2026-04-12',
    endDate: '2026-04-13',
    location: '鹿児島市吉野町',
    address: '鹿児島県鹿児島市吉野町1234-5',
    prefecture: '鹿児島県',
    builder: '万代ホーム',
    capacity: 10,
    images: [
      '/images/events/event-01-1.jpg',
      '/images/events/event-01-2.jpg',
      '/images/events/event-01-3.jpg',
    ],
    highlights: [
      '中庭を囲むコの字型設計で四季を感じる暮らし',
      '延床28坪でも広さを感じるリビング＋ロフト収納',
      '家事ラク動線：キッチン→洗面→WIC が一直線',
      'YouTubeルームツアー99万回再生の実物をご体感',
    ],
    features: [
      { label: '延床面積', value: '28坪（92.56㎡）' },
      { label: '間取り', value: '3LDK＋ロフト' },
      { label: '構造', value: '木造軸組工法' },
      { label: '本体価格帯', value: '2,200〜2,500万円' },
    ],
  },
  {
    id: 'ev-002',
    title: '【福岡市】最新ZEH平屋モデルハウス グランドオープン',
    type: 'model',
    typeLabel: 'モデルハウス',
    description:
      '福岡市東区の住宅展示場にオープンした、ZEH基準クリアの高性能平屋モデルハウス。太陽光発電＋蓄電池＋全館空調を標準装備し、年間光熱費ゼロを目指す次世代住宅です。建築家がデザインした開放的なリビングと、機能美を追求した家事空間を実際にご覧いただけます。',
    startDate: '2026-04-19',
    endDate: '2026-04-27',
    location: '福岡市東区',
    address: '福岡県福岡市東区香椎浜3-12-1 ABCハウジング内',
    prefecture: '福岡県',
    builder: 'タマルハウス',
    capacity: 15,
    images: [
      '/images/events/event-02-1.jpg',
      '/images/events/event-02-2.jpg',
      '/images/events/event-02-3.jpg',
      '/images/events/event-02-4.jpg',
    ],
    highlights: [
      'ZEH基準クリア：太陽光＋蓄電池で年間光熱費ゼロ',
      '全館空調で廊下もトイレも一年中快適温度',
      '建築家デザインの天井高3.2mリビング',
      '家事室・パントリー・ファミクロを集約した時短設計',
    ],
    features: [
      { label: '延床面積', value: '32坪（105.78㎡）' },
      { label: '間取り', value: '4LDK＋家事室' },
      { label: '断熱等級', value: '等級6（HEAT20 G2）' },
      { label: '本体価格帯', value: '2,800〜3,200万円' },
    ],
  },
  {
    id: 'ev-003',
    title: '【Zoom開催】高気密高断熱の平屋 オンライン見学会',
    type: 'online',
    typeLabel: 'オンライン見学会',
    description:
      'ご自宅から参加できるオンライン見学会。鹿児島で実際に建てられた高気密高断熱（C値0.3・UA値0.46）の平屋を、プロのカメラワークでじっくりご案内します。チャットでリアルタイム質問OK。見逃し配信あり。',
    startDate: '2026-05-10',
    endDate: '2026-05-10',
    location: 'オンライン（Zoom）',
    address: 'お申し込み後にZoomリンクをお送りします',
    prefecture: 'オンライン',
    builder: '感動ハウス',
    capacity: 50,
    images: [
      '/images/events/event-03-1.jpg',
      '/images/events/event-03-2.jpg',
    ],
    highlights: [
      '移動不要！ご自宅からスマホ・PCで気軽に参加',
      'C値0.3・UA値0.46の超高性能住宅を徹底解説',
      'チャットでリアルタイム質問OK',
      '見逃し配信ありで後からゆっくり視聴可能',
    ],
    features: [
      { label: '延床面積', value: '30坪（99.17㎡）' },
      { label: '間取り', value: '3LDK＋書斎' },
      { label: 'C値 / UA値', value: '0.3 / 0.46' },
      { label: '本体価格帯', value: '2,400〜2,700万円' },
    ],
  },
  {
    id: 'ev-004',
    title: '【熊本市】ぺいほーむ特別コラボ見学会 ─ 動画の家に会いに行こう',
    type: 'special',
    typeLabel: 'ぺいほーむ特別見学会',
    description:
      'ぺいほーむYouTubeチャンネルで大人気の「熊本の小さなかわいい平屋」を特別公開！施主様のご厚意で2日間限定の見学会を開催します。ぺいほーむ編集部も現地に同行し、動画では伝えきれなかった素材感や空気感をお伝えします。参加者にはぺいほーむオリジナル家づくりノートをプレゼント。',
    startDate: '2026-05-17',
    endDate: '2026-05-18',
    location: '熊本市南区',
    address: '熊本県熊本市南区城南町○○ ※詳細は予約後にご案内',
    prefecture: '熊本県',
    builder: 'ハウスサポート',
    capacity: 8,
    images: [
      '/images/events/event-04-1.jpg',
      '/images/events/event-04-2.jpg',
      '/images/events/event-04-3.jpg',
    ],
    highlights: [
      'YouTube人気動画の実物を2日間限定で特別公開',
      'ぺいほーむ編集部が同行して家づくりポイントを解説',
      '参加者全員にオリジナル家づくりノートをプレゼント',
      '施主様との交流タイムでリアルな住み心地を聞ける',
    ],
    features: [
      { label: '延床面積', value: '25坪（82.64㎡）' },
      { label: '間取り', value: '2LDK＋土間＋ロフト' },
      { label: '構造', value: '木造軸組工法（SE構法）' },
      { label: '本体価格帯', value: '1,900〜2,200万円' },
    ],
  },
];

export function getEventById(id: string): EventData | undefined {
  return events.find((e) => e.id === id);
}

export function formatDateJP(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function formatPeriod(start: string, end: string): string {
  if (start === end) return formatDateJP(start);
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  if (s.getMonth() === e.getMonth()) {
    return `${s.getFullYear()}年${s.getMonth() + 1}月${s.getDate()}日〜${e.getDate()}日`;
  }
  return `${formatDateJP(start)}〜${formatDateJP(end)}`;
}
