export interface WebinarSpeaker {
  name: string;
  description: string;
}

export interface WebinarScheduleItem {
  title: string;
  duration: string;
  description: string;
}

export interface WebinarData {
  id: string;
  title: string;
  shortTitle: string;
  date: string;
  dateFormatted: string;
  month: string;
  day: string;
  category: string;
  isUpcoming: boolean;
  status: string;
  info: string;
  description: string;
  body: string;
  eventDetails: {
    datetime: string;
    format: string;
    fee: string;
    capacity: string;
    target: string;
  };
  recommendations?: string[];
  schedule?: WebinarScheduleItem[];
  speakers?: WebinarSpeaker[];
  participants?: number;
  keyPoints?: { title: string; description: string }[];
  testimonials?: string[];
  notice?: string;
  publishDate?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogpImage?: string;
}

export const webinars: WebinarData[] = [
  {
    id: 'webinar-01',
    title: '九州の住宅トレンド2026 ― 断熱等級と補助金の最新動向',
    shortTitle: '九州の住宅トレンド2026',
    date: '2026.04.12',
    dateFormatted: '2026年4月12日（土）14:00〜15:30',
    month: 'Apr',
    day: '12',
    category: 'ウェビナー',
    isUpcoming: true,
    status: '申込受付中',
    info: '2026年4月12日（土）14:00〜15:30｜オンライン開催｜参加無料',
    description: '九州エリアの住宅トレンドを徹底解説。2026年度の断熱等級改正と最新の補助金制度について、実例を交えてお伝えします。参加は無料です。',
    body: '2026年、住宅業界は断熱性能の基準強化や補助金制度の拡充など、大きな変革期を迎えています。本ウェビナーでは、九州エリアに特化した最新の住宅トレンドを徹底解説いたします。',
    eventDetails: {
      datetime: '2026年4月12日（土）14:00〜15:30',
      format: 'オンライン開催（Zoom）',
      fee: '無料',
      capacity: '先着200名',
      target: '住宅会社経営者・営業担当者・設計担当者',
    },
    recommendations: [
      '2026年の断熱等級改正の影響を正しく理解したい方',
      '九州エリアで活用できる補助金制度を把握したい方',
      'お客様への提案力を強化したい住宅会社の方',
      'ZEH・省エネ住宅の最新トレンドを知りたい方',
    ],
    schedule: [
      {
        title: '第1部：断熱等級の最新基準と実務への影響',
        duration: '30分',
        description: '2026年度に改正された断熱等級の新基準について、九州の気候特性を踏まえた実務レベルでの対応策を解説します。等級5・6・7それぞれの要件と、コストパフォーマンスの最適解をお伝えします。',
      },
      {
        title: '第2部：活用できる補助金・助成金の最新情報',
        duration: '30分',
        description: '子育てエコホーム支援事業、地域型住宅グリーン化事業など、2026年度に利用可能な補助金制度を網羅的に紹介。申請のポイントや注意点も具体的にお伝えします。',
      },
      {
        title: '第3部：質疑応答',
        duration: '30分',
        description: '参加者の皆さまからのご質問にリアルタイムでお答えします。事前質問も受け付けております。',
      },
    ],
    speakers: [
      {
        name: '田中 誠一（たなか せいいち）',
        description: '住宅省エネルギー技術コンサルタント。九州を拠点に20年以上にわたり住宅の断熱性能向上に携わる。年間50社以上の住宅会社に省エネ基準対応のアドバイスを行っている。',
      },
      {
        name: '山本 美咲（やまもと みさき）',
        description: '住宅補助金アドバイザー。自治体の補助金制度に精通し、住宅会社向けの補助金活用セミナーを多数開催。累計相談実績500件以上。',
      },
    ],
  },
  {
    id: 'webinar-02',
    title: '住宅会社のためのYouTube集客入門 ― ルームツアー動画の作り方',
    shortTitle: 'YouTube集客入門',
    date: '2026.04.26',
    dateFormatted: '2026年4月26日（土）13:00〜14:30',
    month: 'Apr',
    day: '26',
    category: 'ウェビナー',
    isUpcoming: true,
    status: '申込受付中',
    info: '2026年4月26日（土）13:00〜14:30｜オンライン開催｜参加無料',
    description: '住宅会社がYouTubeで集客するためのノウハウを伝授。ルームツアー動画の企画から撮影、編集までのポイントをお教えします。',
    body: 'YouTubeを活用した集客は、住宅業界でもはや欠かせない手法となっています。中でもルームツアー動画は、見込み客の関心を引き、来場予約につなげる強力なコンテンツです。本ウェビナーでは、撮影の基本から編集テクニック、チャンネル運営のコツまで実践的にお伝えします。',
    eventDetails: {
      datetime: '2026年4月26日（土）13:00〜14:30',
      format: 'オンライン開催（Zoom）',
      fee: '無料',
      capacity: '先着150名',
      target: '住宅会社の広報・マーケティング担当者、経営者',
    },
    recommendations: [
      'YouTubeチャンネルを始めたいが何から手をつければよいかわからない方',
      'ルームツアー動画を作りたいが撮影・編集に自信がない方',
      'すでにYouTubeを始めているが再生数が伸び悩んでいる方',
      '動画制作を外注すべきか内製すべきか迷っている方',
    ],
    schedule: [
      {
        title: '第1部：住宅会社がYouTubeで成果を出すための基本戦略',
        duration: '25分',
        description: 'チャンネルのコンセプト設計、ターゲット設定、投稿頻度の目安など、YouTube運用の全体像をお伝えします。成功している住宅会社チャンネルの共通点も分析します。',
      },
      {
        title: '第2部：ルームツアー動画の撮影テクニック',
        duration: '25分',
        description: 'スマートフォンでも撮影可能な実践的テクニックを紹介。カメラの動かし方、照明の工夫、ナレーションの入れ方など、視聴者を惹きつける撮影のコツをお伝えします。',
      },
      {
        title: '第3部：編集・サムネイル・タイトルの最適化',
        duration: '20分',
        description: '無料編集ソフトを使った効率的な編集フロー、クリックされるサムネイルの作り方、SEOを意識したタイトル付けのポイントを解説します。',
      },
      {
        title: '第4部：質疑応答',
        duration: '20分',
        description: '参加者の皆さまからのご質問にお答えします。具体的なお悩みもぜひお寄せください。',
      },
    ],
    speakers: [
      {
        name: 'ぺいほーむ編集部',
        description: 'YouTube登録者4.28万人の住宅メディア「ぺいほーむ」運営チーム。累計300本以上のルームツアー動画を制作し、住宅会社のYouTube支援実績も多数。動画マーケティングの最前線から、現場で使えるノウハウをお届けします。',
      },
    ],
  },
  {
    id: 'webinar-03',
    title: '工務店経営者向け ― SNS運用で反響を3倍にする方法',
    shortTitle: 'SNS運用で反響を3倍にする方法',
    date: '2026.05.10',
    dateFormatted: '2026年5月10日（土）14:00〜15:30',
    month: 'May',
    day: '10',
    category: 'ウェビナー',
    isUpcoming: true,
    status: '近日公開',
    info: '2026年5月10日（土）14:00〜15:30｜オンライン開催｜参加無料',
    description: 'SNS運用で住宅会社の反響を3倍にした実例をもとに、具体的な運用方法をお伝えします。',
    body: 'Instagram、YouTube、LINE公式アカウント――SNSを活用した集客は、工務店にとって大きな武器になります。しかし、何を投稿すればよいのか、どのSNSに注力すべきか、迷っている経営者の方も多いのではないでしょうか。本ウェビナーでは、限られたリソースで最大の効果を出すSNS運用術をお伝えします。',
    eventDetails: {
      datetime: '2026年5月10日（土）14:00〜15:30',
      format: 'オンライン開催（Zoom）',
      fee: '無料',
      capacity: '先着150名',
      target: '工務店経営者、住宅会社のマーケティング担当者',
    },
    recommendations: [
      'SNSを始めたものの成果が実感できていない工務店経営者の方',
      '少人数でも効率的にSNS運用を回したい方',
      'Instagram・YouTube・LINEのどれに注力すべきか判断したい方',
      'SNS経由の問い合わせ・来場予約を増やしたい方',
    ],
    schedule: [
      {
        title: '第1部：工務店のSNS戦略 ― どのSNSに注力すべきか',
        duration: '25分',
        description: '各SNSプラットフォームの特性と、工務店のターゲット層との相性を解説。自社のリソースに合った最適なSNS選定の考え方をお伝えします。',
      },
      {
        title: '第2部：反響が3倍になった実例紹介',
        duration: '25分',
        description: '実際にSNS運用で反響数を大幅に伸ばした工務店の事例を複数紹介。何を変えたのか、どんな投稿が効果的だったのかを具体的に分析します。',
      },
      {
        title: '第3部：明日から使えるSNS運用テンプレート',
        duration: '20分',
        description: '投稿カレンダーの作り方、コンテンツのネタ出し方法、効果測定の仕方など、すぐに実践できるテンプレートと運用フローをご提供します。',
      },
      {
        title: '第4部：質疑応答',
        duration: '20分',
        description: '参加者の皆さまからのご質問にお答えします。事前質問も受け付けております。',
      },
    ],
    notice: '本ウェビナーは近日公開予定です。申し込み開始まで今しばらくお待ちください。最新情報はぺいほーむのSNSでお知らせいたします。',
  },
  {
    id: 'webinar-04',
    title: '2026年版・住宅ローン金利の見通しと選び方',
    shortTitle: '住宅ローン金利の見通しと選び方',
    date: '2026.03.08',
    dateFormatted: '2026年3月8日（土）',
    month: 'Mar',
    day: '08',
    category: 'ウェビナー',
    isUpcoming: false,
    status: 'アーカイブ視聴可',
    info: '2026年3月8日開催｜参加者128名',
    description: '2026年の住宅ローン金利の見通しについて、変動金利と固定金利の選び方を解説しました。128名にご参加いただきました。',
    body: '2026年3月8日に開催された本ウェビナーには128名の方にご参加いただきました。住宅ローン金利の最新動向と、お客様への最適な提案方法について、ファイナンシャルプランナーが詳しく解説しました。',
    eventDetails: {
      datetime: '2026年3月8日（土）',
      format: 'オンライン開催（Zoom）',
      fee: '無料',
      capacity: '200名',
      target: '住宅会社経営者・営業担当者',
    },
    participants: 128,
    keyPoints: [
      {
        title: '2026年の金利環境',
        description: '日銀の政策金利引き上げに伴い、変動金利型住宅ローンの基準金利は上昇傾向にあります。一方、長期固定金利は市場の織り込みが進んでおり、今後の動きは限定的との見方が示されました。住宅会社として押さえるべき金利動向のポイントを整理しました。',
      },
      {
        title: '固定vs変動 ― どちらを提案すべきか',
        description: '施主の家計状況やリスク許容度に応じた金利タイプの選び方を解説。年収倍率、返済比率、将来の収入見通しなど、具体的な判断基準を示しました。住宅会社としてお客様に寄り添った提案ができるフレームワークを紹介しました。',
      },
      {
        title: '住宅ローン減税の最新制度',
        description: '2026年度の住宅ローン減税制度について、対象要件や控除額の計算方法を確認。省エネ基準適合住宅の優遇措置や、子育て世帯向けの特例措置についても取り上げました。',
      },
    ],
    testimonials: [
      '金利の見通しだけでなく、お客様への具体的な提案方法まで学べたのが良かったです。明日からの営業トークに活かします。',
      '固定と変動の選び方について、判断基準が明確になりました。お客様の不安を解消できる自信がつきました。',
    ],
  },
  {
    id: 'webinar-05',
    title: '鹿児島の気候に合った高断熱住宅のつくり方',
    shortTitle: '鹿児島の気候に合った高断熱住宅のつくり方',
    date: '2026.02.15',
    dateFormatted: '2026年2月15日（土）',
    month: 'Feb',
    day: '15',
    category: 'ウェビナー',
    isUpcoming: false,
    status: 'アーカイブ視聴可',
    info: '2026年2月15日開催｜参加者96名',
    description: '鹿児島の気候特性を踏まえた高断熱住宅の設計・施工のポイントを解説しました。',
    body: '2026年2月15日に開催された本ウェビナーには96名の方にご参加いただきました。鹿児島の温暖な気候だからこそ注意すべき断熱設計のポイントと、コストを抑えながら高断熱住宅を実現する方法について解説しました。',
    eventDetails: {
      datetime: '2026年2月15日（土）',
      format: 'オンライン開催（Zoom）',
      fee: '無料',
      capacity: '200名',
      target: '住宅会社設計担当者・経営者',
    },
    participants: 96,
    keyPoints: [
      {
        title: '温暖地域における断熱の重要性',
        description: '鹿児島は6地域（一部7地域）に分類されますが、夏の猛暑と冬の底冷えの両方に対応する必要があります。UA値だけでなく、日射取得係数や遮蔽係数にも注目した設計手法を紹介しました。エアコンの効率を最大化し、年間光熱費を大幅に削減できる仕様を具体的に解説しました。',
      },
      {
        title: 'コストパフォーマンスの最適解',
        description: '断熱等級5から7まで、それぞれのコスト増と光熱費削減効果のバランスを数値で示しました。鹿児島の気候では等級6が費用対効果に優れているという分析結果や、部位別の断熱仕様の優先順位についても解説しました。',
      },
      {
        title: '湿気対策と結露防止',
        description: '鹿児島の高湿度環境で高断熱住宅を建てる際に必須となる防湿層の設計、通気工法の重要性、そして適切な換気計画について詳しく取り上げました。実際の施工事例をもとに、失敗しない湿気対策のポイントをお伝えしました。',
      },
    ],
    testimonials: [
      '鹿児島に特化した断熱の話は初めてで、非常に参考になりました。お客様への説明にも説得力が増します。',
      'コストと性能のバランスを数値で示してもらえたので、社内での仕様決定に役立ちます。',
    ],
  },
  {
    id: 'webinar-06',
    title: '施主が本当に求めている情報とは ― アンケート調査から見る家づくり',
    shortTitle: '施主が本当に求めている情報とは',
    date: '2026.01.25',
    dateFormatted: '2026年1月25日（土）',
    month: 'Jan',
    day: '25',
    category: 'ウェビナー',
    isUpcoming: false,
    status: 'アーカイブ視聴可',
    info: '2026年1月25日開催｜参加者84名',
    description: '施主へのアンケート調査結果をもとに、家づくりで本当に求められている情報を分析・解説しました。',
    body: '2026年1月25日に開催された本ウェビナーには84名の方にご参加いただきました。ぺいほーむが実施した施主500人アンケートの結果をもとに、家づくりにおいて施主が本当に知りたい情報と、住宅会社が発信すべきコンテンツについて掘り下げました。',
    eventDetails: {
      datetime: '2026年1月25日（土）',
      format: 'オンライン開催（Zoom）',
      fee: '無料',
      capacity: '200名',
      target: '住宅会社マーケティング・広報担当者',
    },
    participants: 84,
    keyPoints: [
      {
        title: '施主が最も知りたい情報ランキング',
        description: 'アンケート調査の結果、施主が最も知りたい情報は「実際にかかった総費用」が1位でした。続いて「住んでからの光熱費」「間取りの工夫と後悔ポイント」がランクイン。スペックや性能値よりも、実生活に直結する情報が求められていることが明らかになりました。',
      },
      {
        title: '住宅会社の発信とのギャップ',
        description: '住宅会社がSNSやウェブサイトで発信しているコンテンツを分析したところ、外観写真やイベント告知が多数を占めており、施主が求める情報との乖離が見られました。このギャップを埋めることが、効果的な集客につながるという分析結果を紹介しました。',
      },
      {
        title: '効果的な情報発信の実践方法',
        description: 'アンケート結果をもとに、施主の関心に応える具体的なコンテンツ企画を提案しました。施工事例の紹介方法、価格情報の出し方、口コミ・レビューの活用法など、すぐに実践できるノウハウをお伝えしました。',
      },
    ],
    testimonials: [
      '自社の情報発信がいかにずれていたか気づかされました。施主目線のコンテンツ作りに早速取り組みます。',
      'アンケートデータに基づいた内容なので説得力がありました。社内の情報発信方針を見直すきっかけになりました。',
    ],
  },
  {
    id: 'webinar-07',
    title: '住宅会社のInstagram活用術 ― フォロワー1万人達成の秘訣',
    shortTitle: '住宅会社のInstagram活用術',
    date: '2025.12.14',
    dateFormatted: '2025年12月14日（土）',
    month: 'Dec',
    day: '14',
    category: 'ウェビナー',
    isUpcoming: false,
    status: 'アーカイブ視聴可',
    info: '2025年12月14日開催｜参加者112名',
    description: 'Instagramでフォロワー1万人を達成するための具体的な運用術と成功事例を紹介しました。',
    body: '2025年12月14日に開催された本ウェビナーには112名の方にご参加いただきました。Instagramで1万人以上のフォロワーを獲得している住宅会社の運用戦略を分析し、実践的な活用ノウハウを共有しました。',
    eventDetails: {
      datetime: '2025年12月14日（土）',
      format: 'オンライン開催（Zoom）',
      fee: '無料',
      capacity: '200名',
      target: '住宅会社広報・マーケティング担当者',
    },
    participants: 112,
    keyPoints: [
      {
        title: 'アカウント設計の基本',
        description: 'プロフィールの最適化、ハイライトの活用、投稿の世界観統一など、フォローされるアカウントになるための基盤づくりを解説しました。フォロワーが増えている住宅会社アカウントに共通する特徴を具体的に分析し、自社アカウントの改善ポイントを明確にしました。',
      },
      {
        title: '投稿コンテンツの作り方',
        description: 'フィード投稿、リール、ストーリーズの使い分けと、それぞれの効果的な作り方を解説しました。施工写真の撮り方、キャプションの書き方、ハッシュタグの選び方など、エンゲージメントを高める具体的なテクニックを紹介しました。特にリール動画の活用が新規フォロワー獲得に効果的であることをデータで示しました。',
      },
      {
        title: 'フォロワーを顧客に変える導線設計',
        description: 'Instagramのフォロワーを実際の問い合わせや来場予約につなげるための導線設計を解説しました。プロフィールリンクの活用、ストーリーズでの誘導、DMの対応方法など、集客につながる実践的なノウハウをお伝えしました。',
      },
      {
        title: '投稿スケジュールと分析の仕方',
        description: '最適な投稿頻度と時間帯、インサイトの読み方と改善サイクルの回し方について解説しました。少人数の体制でも継続可能な運用フローのテンプレートも提供しました。',
      },
    ],
    testimonials: [
      'リールの重要性は感じていましたが、具体的な作り方まで教えていただけて非常に助かりました。',
      'フォロワーを増やすだけでなく、問い合わせにつなげる導線設計の話が特に参考になりました。',
    ],
  },
];

export function getWebinarById(id: string): WebinarData | undefined {
  return webinars.find((w) => w.id === id);
}

export function getAdjacentWebinars(id: string): { prev: WebinarData | null; next: WebinarData | null } {
  const index = webinars.findIndex((w) => w.id === id);
  return {
    prev: index > 0 ? webinars[index - 1] : null,
    next: index < webinars.length - 1 ? webinars[index + 1] : null,
  };
}

export function getUpcomingWebinars(): WebinarData[] {
  return webinars.filter((w) => w.isUpcoming);
}

export function getArchiveWebinars(): WebinarData[] {
  return webinars.filter((w) => !w.isUpcoming);
}
