export interface MagazineIssue {
  id: string;
  issue: string;
  title: string;
  description: string;
  coverImage: string;
  publishDate: string;
  contents: string[];
  isLatest: boolean;
}

export const magazineIssues: MagazineIssue[] = [
  { id: 'mag-2026-03', issue: '2026年3月号', title: '特集：鹿児島・九州の注目工務店10選', description: '地元の気候風土を知り尽くした工務店が提案する、次世代の家づくり。', coverImage: '', publishDate: '2026.03.10', contents: ['鹿児島の注目工務店10選', '住宅ローン金利の最新トレンド', '施主インタビュー：建てて1年後のリアル', 'ぺいほーむ取材の裏側'], isLatest: true },
  { id: 'mag-2026-02', issue: '2026年2月号', title: '特集：断熱等級7の家づくり最前線', description: '断熱等級7を実現する最新技術と施工事例を徹底解説。', coverImage: '', publishDate: '2026.02.10', contents: ['断熱等級7の最新技術', '冬の断熱リフォーム事例', '読者Q&A'], isLatest: false },
  { id: 'mag-2026-01', issue: '2026年1月号', title: '特集：2026年の住宅トレンド予測', description: '業界専門家が語る2026年の住宅トレンド。', coverImage: '', publishDate: '2026.01.10', contents: ['2026年住宅トレンド予測', '補助金最新情報', '工務店インタビュー'], isLatest: false },
  { id: 'mag-2025-12', issue: '2025年12月号', title: '特集：施主100人に聞いた「建てて良かったこと」', description: '実際に家を建てた施主100人へのアンケート結果を大公開。', coverImage: '', publishDate: '2025.12.10', contents: ['施主100人アンケート', '年末特別企画', 'ベストバイ設備'], isLatest: false },
  { id: 'mag-2025-11', issue: '2025年11月号', title: '特集：平屋ブームの本当の理由', description: '平屋人気の背景を徹底分析。', coverImage: '', publishDate: '2025.11.10', contents: ['平屋ブーム分析', '平屋施工事例5選', '土地探しガイド'], isLatest: false },
  { id: 'mag-2025-10', issue: '2025年10月号', title: '特集：住宅ローン減税 最新ガイド', description: '最新の住宅ローン減税制度をわかりやすく解説。', coverImage: '', publishDate: '2025.10.10', contents: ['住宅ローン減税ガイド', '金利比較', 'FP相談事例'], isLatest: false },
  { id: 'mag-2025-09', issue: '2025年9月号', title: '特集：九州の木造住宅と地産地消', description: '九州産木材を使った家づくりの魅力に迫る。', coverImage: '', publishDate: '2025.09.10', contents: ['九州産木材の魅力', '地産地消の家づくり', '木造住宅の耐震性'], isLatest: false },
];
