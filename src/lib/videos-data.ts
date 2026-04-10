/**
 * 動画コンテンツデータ
 *
 * /videos (一覧) と /videos/[id] (詳細) と /features/[id] (特集詳細) の
 * 3ヶ所から参照される、YouTube動画 + 物件のメタデータ。
 *
 * 物件詳細の完全情報は src/lib/properties.ts を使う。このファイルは
 * 一覧・特集で使う軽量なメタデータに絞っている。
 */

export interface VideoData {
  id: string;
  youtubeId: string;
  title: string;
  views: string;
  viewCount: number;
  category: 'ルームツアー' | '取材' | '解説' | 'トレンド';
  prefecture: string;
  builder: string;
  tsubo: number;
}

export const videos: VideoData[] = [
  { id: '10', youtubeId: '0gxkNh2BC0A', title: '小さなかわいい平屋。。', views: '99万回再生', viewCount: 990000, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ハウスサポート', tsubo: 25 },
  { id: '11', youtubeId: 'm_ndZJfV8a0', title: '老後も安心して過ごせる最先端の平屋', views: '91万回再生', viewCount: 910000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 30 },
  { id: '12', youtubeId: 'YhgQSfYYUJ0', title: '完璧な間取りのお洒落で超かわいい平屋', views: '78万回再生', viewCount: 780000, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ベルハウジング', tsubo: 28 },
  { id: '13', youtubeId: 'rTceXJ2NoP4', title: '超有名な一級建築家の作る天才的な平屋', views: '59万回再生', viewCount: 590000, category: 'ルームツアー', prefecture: '福岡県', builder: 'タマルハウス', tsubo: 35 },
  { id: '14', youtubeId: 'Oz3mV-uGTH8', title: 'お値段大公開！20坪の小さな高性能平屋', views: '59万回再生', viewCount: 590000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '感動ハウス', tsubo: 20 },
  { id: '15', youtubeId: 'ocRVUPEcx90', title: '完全に大人の女性に似合う平屋！', views: '50万回再生', viewCount: 500000, category: 'ルームツアー', prefecture: '福岡県', builder: 'タマルハウス', tsubo: 32 },
  { id: '16', youtubeId: 'WzSTo2M9Mug', title: '嘘だろ...これが平屋はヤバすぎる！', views: '47万回再生', viewCount: 470000, category: 'ルームツアー', prefecture: '熊本県', builder: 'ハウスサポート', tsubo: 40 },
  { id: '17', youtubeId: '2KAwhfOO3uI', title: '令和時代に超人気な間取りの平屋', views: '47万回再生', viewCount: 470000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 28 },
  { id: '18', youtubeId: 'P3walOjt0uE', title: 'えっヤバすぎ！これはもはや平屋ではない。', views: '47万回再生', viewCount: 470000, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ヤマサハウス', tsubo: 45 },
  { id: '19', youtubeId: 'npGkmEaOaI0', title: '女性設計士の作るボーホーインテリアのかわいい平屋', views: '44万回再生', viewCount: 440000, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ベルハウジング', tsubo: 26 },
  { id: '20', youtubeId: 'crfgrlvsaWY', title: 'シンプルおしゃれの小さく可愛い平屋', views: '40万回再生', viewCount: 400000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '七呂建設', tsubo: 22 },
  { id: '21', youtubeId: 'An1aJxhWjgg', title: '大人仕様のおしゃれな平屋', views: '39万回再生', viewCount: 390000, category: 'ルームツアー', prefecture: '福岡県', builder: 'タマルハウス', tsubo: 30 },
  { id: '22', youtubeId: 'isKYL1WKaRI', title: '完全に騙された！全てがヤバ過ぎる平屋', views: '28万回再生', viewCount: 280000, category: 'ルームツアー', prefecture: '熊本県', builder: 'ハウスサポート', tsubo: 35 },
  { id: '23', youtubeId: 'do6aZ23Gv0U', title: 'ここ海外？セレブにお洒落な奥様必見の平屋', views: '26万回再生', viewCount: 260000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 38 },
  { id: '24', youtubeId: 'gbUaUWPT9dQ', title: 'IoTのハイテクすぎるおしゃれな平屋', views: '25万回再生', viewCount: 250000, category: 'ルームツアー', prefecture: '福岡県', builder: 'タマルハウス', tsubo: 33 },
  { id: '25', youtubeId: 'AvieNcvE3rc', title: '一級建築士の作る超大豪邸の平屋', views: '25万回再生', viewCount: 250000, category: 'ルームツアー', prefecture: '大分県', builder: '大分建設', tsubo: 50 },
  { id: '26', youtubeId: 'C3Ovhi472uk', title: '白基調でかわいい！風通しのいいLDKが最高な24坪の平屋', views: '24万回再生', viewCount: 240000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '七呂建設', tsubo: 24 },
  { id: '27', youtubeId: '4WMf8_JMS58', title: 'アメリカンカントリー調の高性能なかわいい平屋', views: '23万回再生', viewCount: 230000, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ベルハウジング', tsubo: 27 },
  { id: '28', youtubeId: '7iBoXBebyZM', title: '旅館？別荘？これぞ和の漂う最高級の平屋', views: '22万回再生', viewCount: 220000, category: 'ルームツアー', prefecture: '宮崎県', builder: '宮崎建設', tsubo: 42 },
  { id: '29', youtubeId: 'bgQbK9Oe15E', title: 'お家でカフェ気分！人を呼びたくなる平屋', views: '20万回再生', viewCount: 200000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 29 },
  { id: '30', youtubeId: 'dEpBZBmsXlk', title: '女性設計士さんが考えた家族温まるかわいい平屋', views: '19万回再生', viewCount: 190000, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ベルハウジング', tsubo: 26 },
  { id: '31', youtubeId: 'nmKWWxKGrCc', title: 'ドストライクを貫く広くてかわいい平屋', views: '18万回再生', viewCount: 180000, category: 'ルームツアー', prefecture: '福岡県', builder: 'タマルハウス', tsubo: 30 },
  { id: '32', youtubeId: 'gX-7VytEPZc', title: 'これぞ理想的！完璧な家事動線の平屋', views: '17万回再生', viewCount: 170000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 28 },
  { id: '33', youtubeId: 'vUhExXZ8TLE', title: 'やっぱりコンパクト！シンプルに住みやすい平屋', views: '16万回再生', viewCount: 160000, category: 'ルームツアー', prefecture: '熊本県', builder: 'ハウスサポート', tsubo: 22 },
  { id: '34', youtubeId: 'MIUreMvCvUU', title: 'これが風呂？色々と企画外な広々平屋', views: '16万回再生', viewCount: 160000, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ヤマサハウス', tsubo: 36 },
  { id: '01', youtubeId: 'lPIxPVV2jm4', title: 'おひとり様の理想を叶えた平家', views: '15万回再生', viewCount: 150000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 18 },
  { id: '35', youtubeId: 'yFGUF3Ldan4', title: 'これなら老後も安心安全の間取りの平屋', views: '15万回再生', viewCount: 150000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '感動ハウス', tsubo: 25 },
  { id: '36', youtubeId: 'AAOiIYhL2y8', title: '一級建築家の作る扉のない2LDK平屋', views: '14万回再生', viewCount: 140000, category: 'ルームツアー', prefecture: '福岡県', builder: 'タマルハウス', tsubo: 24 },
  { id: '37', youtubeId: '7EQp2_-aq6M', title: '色気漂う男の極上の平屋', views: '14万回再生', viewCount: 140000, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ベルハウジング', tsubo: 32 },
  { id: '38', youtubeId: 'yPgUC3wftA0', title: '完全に惚れてしまうシックにカッコイイ平屋', views: '14万回再生', viewCount: 140000, category: 'ルームツアー', prefecture: '大分県', builder: '大分建設', tsubo: 30 },
  { id: '39', youtubeId: 'uzy-qm-GkJ4', title: '色々とおかしい15坪1LDKの極小平屋', views: '13万回再生', viewCount: 130000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '七呂建設', tsubo: 15 },
  { id: '40', youtubeId: 'sboD9U6jgns', title: 'おしゃれなキッチンとコンパクトでも抜かりない平屋', views: '12万回再生', viewCount: 120000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 23 },
  { id: '41', youtubeId: 'AZfUPSWLIhE', title: '温もりある木に包まれた心落ち着く平屋', views: '12万回再生', viewCount: 120000, category: 'ルームツアー', prefecture: '宮崎県', builder: '宮崎建設', tsubo: 27 },
  { id: '08', youtubeId: '4CeIIZ2qMWs', title: '26坪4LDKでコスパ最強なスーパー平屋', views: '2.6万回再生', viewCount: 26000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '感動ハウス', tsubo: 26 },
  { id: '03', youtubeId: 'TESbCN-am3k', title: '令和時代に爆発的人気な間取りの平屋', views: '1.8万回再生', viewCount: 18000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 28 },
  { id: '06', youtubeId: 'IPM8xygYlhU', title: '空調のこだわりと最強の気密性を備えた平屋', views: '1.7万回再生', viewCount: 17000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '感動ハウス', tsubo: 30 },
  { id: '07', youtubeId: 'B0u0UPkB89U', title: 'こりゃかわいい！好みのデザインで埋め尽くした平屋', views: '1.7万回再生', viewCount: 17000, category: 'ルームツアー', prefecture: '福岡県', builder: 'タマルハウス', tsubo: 25 },
  { id: '02', youtubeId: 'eWbyhRr-K1w', title: 'まるで"高級ホテル"豪華すぎるシンプルな平屋', views: '1万回再生', viewCount: 10000, category: 'ルームツアー', prefecture: '熊本県', builder: 'ハウスサポート', tsubo: 35 },
  { id: '04', youtubeId: 'fZMmHqHXtMI', title: '27坪なのに4LDKで収納たっぷりの平屋', views: '7,909回再生', viewCount: 7909, category: 'ルームツアー', prefecture: '鹿児島県', builder: '七呂建設', tsubo: 27 },
  { id: '05', youtubeId: 'UkCuPCS7eWs', title: '家づくりの参考になる素敵な間取りの平屋まとめ', views: '7,160回再生', viewCount: 7160, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 0 },
  { id: '09', youtubeId: '1V4Ok8iftTY', title: '広く感じるLDKなのに28坪で3LDKの間取りな平屋', views: '3,920回再生', viewCount: 3920, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ベルハウジング', tsubo: 28 },
];
