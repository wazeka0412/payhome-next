export const SITE_NAME = 'ぺいほーむ';
export const SITE_DESCRIPTION = '家づくりを、もっと楽しく、もっと身近に。';
export const YOUTUBE_CHANNEL = '@pei_home';
export const YOUTUBE_SUBSCRIBERS = '4.28万人';
export const LINE_URL = 'https://line.me/R/ti/p/@253gzmoh';
export const INSTAGRAM_URL = 'https://www.instagram.com/pei_home_/';
export const TWITTER_URL = 'https://x.com/pei_home_';
export const YOUTUBE_URL = 'https://www.youtube.com/@pei_home';

export const BRAND_COLORS = {
  primary: '#E8740C',
  accent: '#D4660A',
  dark: '#3D2200',
  light: '#FFF8F0',
  lightGray: '#F5F0EB',
} as const;

export const REGIONS = [
  { id: 'kyushu', name: '九州・沖縄', prefectures: ['鹿児島', '福岡', '熊本', '宮崎', '大分', '長崎', '佐賀', '沖縄'] },
  { id: 'kanto', name: '関東', prefectures: ['東京', '神奈川', '埼玉', '千葉', '茨城', '栃木', '群馬'] },
  { id: 'kansai', name: '関西', prefectures: ['大阪', '兵庫', '京都', '滋賀', '奈良', '和歌山'] },
  { id: 'chubu', name: '中部', prefectures: ['愛知', '静岡', '新潟', '長野', '岐阜', '三重', '富山', '石川', '福井', '山梨'] },
  { id: 'chugoku_shikoku', name: '中国・四国', prefectures: ['広島', '岡山', '山口', '鳥取', '島根', '香川', '愛媛', '徳島', '高知'] },
  { id: 'tohoku', name: '東北', prefectures: ['宮城', '福島', '山形', '岩手', '秋田', '青森'] },
  { id: 'hokkaido', name: '北海道', prefectures: ['北海道'] },
] as const;
