export interface BuilderData {
  id: string;
  name: string;
  area: string;
  region: string;
  specialties: string[];
  annualBuilds: number;
}

export const builders: BuilderData[] = [
  { id: 'b01', name: '万代ホーム', area: '鹿児島県', region: '鹿児島市', specialties: ['平屋', 'ZEH'], annualBuilds: 120 },
  { id: 'b02', name: 'ベルハウジング', area: '鹿児島県', region: '鹿児島市', specialties: ['注文住宅', 'リフォーム'], annualBuilds: 80 },
  { id: 'b03', name: 'タマルハウス', area: '福岡県', region: '福岡市', specialties: ['高性能住宅', 'デザイン'], annualBuilds: 60 },
  { id: 'b04', name: '感動ハウス', area: '鹿児島県', region: '鹿児島市', specialties: ['高気密高断熱', '自然素材'], annualBuilds: 45 },
  { id: 'b05', name: 'ヤマサハウス', area: '鹿児島県', region: '鹿児島市', specialties: ['平屋', '二世帯'], annualBuilds: 150 },
  { id: 'b06', name: '七呂建設', area: '鹿児島県', region: '鹿児島市', specialties: ['注文住宅', '店舗'], annualBuilds: 70 },
  { id: 'b07', name: 'ハウスサポート', area: '鹿児島県', region: '鹿児島市', specialties: ['平屋', 'ローコスト'], annualBuilds: 50 },
  { id: 'b08', name: '大分建設', area: '大分県', region: '大分市', specialties: ['木造住宅', '耐震'], annualBuilds: 40 },
  { id: 'b09', name: '宮崎建設', area: '宮崎県', region: '宮崎市', specialties: ['注文住宅', 'リノベ'], annualBuilds: 35 },
  { id: 'b10', name: '谷川建設', area: '長崎県', region: '長崎市', specialties: ['木造住宅', '大規模'], annualBuilds: 100 },
  { id: 'b11', name: 'ベガハウス', area: '鹿児島県', region: '鹿児島市', specialties: ['デザイン住宅', '自然素材'], annualBuilds: 30 },
  { id: 'b12', name: '丸和建設', area: '鹿児島県', region: '霧島市', specialties: ['注文住宅', '平屋'], annualBuilds: 55 },
];
