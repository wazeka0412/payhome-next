'use client';

import { useState } from 'react';
import FormField from '@/components/appadmin/FormField';

interface StatItem { id: string; label: string; value: string }
interface ServiceItem { id: string; icon: string; title: string; description: string; link: string }
interface CaseItem { id: string; company: string; result: string; detail: string }
interface NewsRef { id: string; title: string }

const ICONS = ['🎥', '📱', '🌐', '📊', '📝', '💡', '🏠', '📈'] as const;

const INITIAL_STATS: StatItem[] = [
  { id: 's1', label: 'YouTube登録者数', value: '4.28万人+' },
  { id: 's2', label: '動画制作実績', value: '500本+' },
  { id: 's3', label: '取引企業数', value: '120社+' },
];

const INITIAL_SERVICES: ServiceItem[] = [
  { id: 'sv1', icon: '🎥', title: 'ルームツアー動画制作', description: '住宅の魅力を最大限に伝えるプロ品質のルームツアー動画を制作します。', link: '/biz/service#roomtour' },
  { id: 'sv2', icon: '📱', title: 'SNS運用代行', description: 'Instagram・YouTube・TikTokの運用を一括でサポートします。', link: '/biz/service#sns' },
  { id: 'sv3', icon: '🌐', title: 'WEB制作・集客', description: '工務店・ハウスメーカー向けのWEBサイト制作と集客支援を行います。', link: '/biz/service#web' },
  { id: 'sv4', icon: '📊', title: 'ポータルサイト掲載', description: 'ぺいほーむポータルサイトへの掲載で新規リードを獲得できます。', link: '/biz/service#portal' },
];

const INITIAL_CASES: CaseItem[] = [
  { id: 'c1', company: 'A工務店', result: '問い合わせ数 月3件→月15件', detail: '動画制作とSNS運用の組み合わせにより、認知度が大幅に向上しました。' },
  { id: 'c2', company: 'B住建', result: 'YouTube登録者 0→5,000人', detail: 'ルームツアー動画を定期的に配信し、ブランド力を構築しました。' },
  { id: 'c3', company: 'Cハウス', result: '成約率 8%→18%', detail: 'WEBサイトのリニューアルとSEO対策で質の高いリードを獲得。' },
];

const NEWS_POOL: NewsRef[] = [
  { id: 'bn1', title: 'ぺいほーむBiz サービスアップデートのお知らせ' },
  { id: 'bn2', title: '動画制作プランに新オプション追加' },
  { id: 'bn3', title: '2026年春の住宅業界向けセミナー開催' },
  { id: 'bn4', title: 'パートナー企業様向け新機能リリース' },
  { id: 'bn5', title: '導入事例インタビュー記事を公開しました' },
];

export default function BizHomepageAdmin() {
  const [stats, setStats] = useState<StatItem[]>(INITIAL_STATS);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
  const [selectedNews, setSelectedNews] = useState<NewsRef[]>(NEWS_POOL.slice(0, 3));
  const [heroYoutubeId, setHeroYoutubeId] = useState('dQw4w9WgXcQ');
  const [heroTitle, setHeroTitle] = useState('住宅業界の集客を、動画で変える。');
  const [heroSubTitle, setHeroSubTitle] = useState('工務店・ハウスメーカーのマーケティングパートナー');
  const [heroCta, setHeroCta] = useState('無料相談はこちら');
  const [heroCtaLink, setHeroCtaLink] = useState('/biz/contact');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  // Stats
  const updateStat = (id: string, field: keyof StatItem, v: string) => setStats(prev => prev.map(s => s.id === id ? { ...s, [field]: v } : s));
  const removeStat = (id: string) => setStats(prev => prev.filter(s => s.id !== id));
  const addStat = () => setStats(prev => [...prev, { id: `s${Date.now()}`, label: '', value: '' }]);

  // Services
  const updateService = (id: string, field: keyof ServiceItem, v: string) => setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: v } : s));
  const moveService = (idx: number, dir: -1 | 1) => {
    const t = idx + dir;
    if (t < 0 || t >= services.length) return;
    setServices(prev => { const a = [...prev]; [a[idx], a[t]] = [a[t], a[idx]]; return a; });
  };

  // Cases
  const updateCase = (id: string, field: keyof CaseItem, v: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, [field]: v } : c));
  const removeCase = (id: string) => setCases(prev => prev.filter(c => c.id !== id));
  const addCase = () => setCases(prev => [...prev, { id: `c${Date.now()}`, company: '', result: '', detail: '' }]);

  // News
  const removeNews = (id: string) => setSelectedNews(prev => prev.filter(n => n.id !== id));
  const addNews = (id: string) => {
    if (selectedNews.length >= 3) return;
    const item = NEWS_POOL.find(n => n.id === id);
    if (item && !selectedNews.some(n => n.id === id)) setSelectedNews(prev => [...prev, item]);
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bizトップページ管理</h1>
          <p className="text-sm text-gray-500 mt-1">法人向けトップページのコンテンツを管理します</p>
        </div>
        <button onClick={handleSave} className="px-6 py-2.5 bg-[#E8740C] text-white rounded-lg text-sm font-semibold hover:bg-[#d06a0b] transition cursor-pointer">
          {saved ? '保存しました' : '変更を保存'}
        </button>
      </div>

      {/* ヒーロー設定 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">ヒーロー設定</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="YouTube動画ID" value={heroYoutubeId} onChange={setHeroYoutubeId} placeholder="例: dQw4w9WgXcQ" />
          <FormField label="メインタイトル" value={heroTitle} onChange={setHeroTitle} required />
          <FormField label="サブタイトル" value={heroSubTitle} onChange={setHeroSubTitle} />
          <FormField label="CTAテキスト" value={heroCta} onChange={setHeroCta} />
          <FormField label="CTAリンク先" value={heroCtaLink} onChange={setHeroCtaLink} />
        </div>
      </div>

      {/* 実績数値 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">実績数値</h2>
          <button onClick={addStat} className="px-4 py-1.5 text-sm text-[#E8740C] border border-[#E8740C] rounded-lg hover:bg-[#E8740C]/5 transition cursor-pointer">+ 追加</button>
        </div>
        <div className="space-y-3">
          {stats.map(s => (
            <div key={s.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <input type="text" value={s.label} onChange={e => updateStat(s.id, 'label', e.target.value)} placeholder="ラベル" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" />
              <input type="text" value={s.value} onChange={e => updateStat(s.id, 'value', e.target.value)} placeholder="値" className="w-40 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" />
              <button onClick={() => removeStat(s.id)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer" title="削除">×</button>
            </div>
          ))}
          {stats.length === 0 && <p className="text-sm text-gray-400 py-2">実績数値がありません</p>}
        </div>
      </div>

      {/* サービス紹介 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">サービス紹介</h2>
        <div className="space-y-3">
          {services.map((sv, idx) => (
            <div key={sv.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#E8740C] bg-[#E8740C]/10 px-2 py-0.5 rounded">サービス {idx + 1}</span>
                <div className="flex gap-1">
                  <button onClick={() => moveService(idx, -1)} disabled={idx === 0} className="w-7 h-7 flex items-center justify-center text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded disabled:opacity-30 cursor-pointer disabled:cursor-default">▲</button>
                  <button onClick={() => moveService(idx, 1)} disabled={idx === services.length - 1} className="w-7 h-7 flex items-center justify-center text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded disabled:opacity-30 cursor-pointer disabled:cursor-default">▼</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">アイコン</label>
                  <select value={sv.icon} onChange={e => updateService(sv.id, 'icon', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] bg-white">
                    {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
                <div>
                  <FormField label="タイトル" value={sv.title} onChange={v => updateService(sv.id, 'title', v)} />
                </div>
                <div>
                  <FormField label="説明" value={sv.description} onChange={v => updateService(sv.id, 'description', v)} />
                </div>
                <div>
                  <FormField label="リンク" value={sv.link} onChange={v => updateService(sv.id, 'link', v)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 導入事例 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">導入事例</h2>
          <button onClick={addCase} className="px-4 py-1.5 text-sm text-[#E8740C] border border-[#E8740C] rounded-lg hover:bg-[#E8740C]/5 transition cursor-pointer">+ 追加</button>
        </div>
        <div className="space-y-3">
          {cases.map(c => (
            <div key={c.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <FormField label="企業名" value={c.company} onChange={v => updateCase(c.id, 'company', v)} />
                <FormField label="成果" value={c.result} onChange={v => updateCase(c.id, 'result', v)} />
                <div className="flex items-end">
                  <button onClick={() => removeCase(c.id)} className="px-3 py-2 text-xs text-red-500 hover:text-red-700 cursor-pointer">削除</button>
                </div>
              </div>
              <FormField label="詳細" value={c.detail} onChange={v => updateCase(c.id, 'detail', v)} multiline rows={2} />
            </div>
          ))}
          {cases.length === 0 && <p className="text-sm text-gray-400 py-2">導入事例がありません</p>}
        </div>
      </div>

      {/* 最新情報表示設定 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">最新情報表示設定</h2>
        <p className="text-xs text-gray-400 mb-3">トップページに表示するニュースを最大3件選択</p>
        <div className="space-y-2 mb-4">
          {selectedNews.map(n => (
            <div key={n.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <span className="flex-1 text-sm text-gray-800 truncate">{n.title}</span>
              <button onClick={() => removeNews(n.id)} className="w-6 h-6 flex items-center justify-center text-xs text-red-400 hover:text-red-600 cursor-pointer">×</button>
            </div>
          ))}
          {selectedNews.length === 0 && <p className="text-sm text-gray-400 py-2">ニュースが選択されていません</p>}
        </div>
        {selectedNews.length < 3 && (
          <select defaultValue="" onChange={e => { if (e.target.value) { addNews(e.target.value); e.target.value = ''; } }} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] bg-white">
            <option value="" disabled>ニュースを選択...</option>
            {NEWS_POOL.filter(n => !selectedNews.some(s => s.id === n.id)).map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
          </select>
        )}
      </div>
    </div>
  );
}
