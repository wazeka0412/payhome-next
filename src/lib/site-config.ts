/**
 * Server-safe site configuration.
 *
 * This mirrors the defaults in settings-store.ts so both server components
 * (/biz pages, /dashboard/builder pages) and client components can reach
 * the same single source of truth without importing the client-only
 * useSyncExternalStore helper.
 *
 * When a real settings backend lands (CMS or Supabase), this module will
 * become a thin async fetch with in-memory cache.
 */

export const SITE_STATS = {
  youtubeSubscribers: '4.28万+',
  videoCount: '42本',
  partnerCount: '12社',
  /** B2B-specific derived metrics */
  monthlyViews: '150万回+',
  averageWatchTime: '3.2万回',
  totalInterviews: '100社+',
  totalCaseStudies: '30邸+',
  totalFloorPlans: '30プラン+',
  prefectureCoverage: '九州8県',
} as const

export const SNS_LINKS = {
  youtube: 'https://www.youtube.com/@pei_home',
  instagram: 'https://www.instagram.com/pei_home_/',
  twitter: 'https://x.com/pei_home_',
  line: 'https://line.me/R/ti/p/@253gzmoh',
} as const

export const CAMPAIGN = {
  enabled: true,
  title: 'ぺいほーむ住宅ポータルサイト 開設記念キャンペーン',
  description: 'AI診断と無料会員登録で、デジタルカタログ2冊を無料プレゼント',
  deadline: '2026-06-30',
  linkUrl: '/diagnosis',
  benefit1Label: 'ぺいほーむ厳選 施工事例集',
  benefit1Amount: '30邸',
  benefit2Label: '平屋間取り図集',
  benefit2Amount: '30プラン',
  benefit3Label: 'AI工務店レコメンド',
  benefit3Amount: '相性3社',
} as const

export const PREFECTURES = [
  '福岡',
  '佐賀',
  '長崎',
  '熊本',
  '大分',
  '宮崎',
  '鹿児島',
  '沖縄',
] as const

/**
 * A short summary of user-side features for B2B marketing — used on /biz
 * pages to showcase what the portal offers builders' prospective customers.
 */
export const USER_SIDE_FEATURES = [
  {
    title: 'AI家づくり診断',
    description: '10問・約2分で相性の良い工務店3社を提案。診断結果は工務店ダッシュボードへ即連携。',
    href: '/diagnosis',
    icon: '🤖',
  },
  {
    title: 'Smart Match 訪問モード',
    description: '見学会予約時にユーザーが「体感 / 相談 / 契約検討」を選択。工務店は目的に合わせた対応ができる。',
    href: '/event',
    icon: '🎯',
  },
  {
    title: '連絡希望プロファイル',
    description: 'ユーザーが連絡時間・頻度・手段を事前登録。しつこい営業ゼロで成約率UP。',
    href: '/mypage/contact-preferences',
    icon: '📞',
  },
  {
    title: 'デジタルカタログ',
    description: '施工事例集30邸＋平屋間取り図集30プランを会員に無料配布。ダウンロード履歴を分析可能。',
    href: '/catalog',
    icon: '📚',
  },
] as const

/**
 * Content type catalog — drives /biz/service content showcase and the
 * admin/builder dashboard nav.
 */
export const CONTENT_TYPES = [
  { key: 'videos', label: 'ルームツアー動画', count: 41, icon: '🎬', userHref: '/videos' },
  { key: 'articles', label: '記事', count: 9, icon: '📰', userHref: '/articles' },
  { key: 'news', label: 'ニュース', count: 10, icon: '📣', userHref: '/news' },
  { key: 'interviews', label: '工務店インタビュー', count: 6, icon: '🎙', userHref: '/interview' },
  { key: 'webinars', label: 'ウェビナー', count: 7, icon: '🎥', userHref: '/webinar' },
  { key: 'events', label: '見学会・イベント', count: 20, icon: '📅', userHref: '/event' },
  { key: 'caseStudies', label: '平屋施工事例', count: 25, icon: '🏠', userHref: '/case-studies' },
  { key: 'saleHomes', label: '建売物件', count: 10, icon: '🏡', userHref: '/sale-homes' },
  { key: 'lands', label: '土地情報', count: 9, icon: '🏞', userHref: '/lands' },
  { key: 'magazine', label: 'マガジン', count: 7, icon: '📚', userHref: '/magazine' },
  { key: 'features', label: '特集', count: 8, icon: '✨', userHref: '/features' },
  { key: 'voice', label: 'お客様の声', count: 5, icon: '⭐', userHref: '/voice' },
] as const
