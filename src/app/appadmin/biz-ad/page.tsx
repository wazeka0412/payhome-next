'use client';

import { useState } from 'react';
import FormField from '@/components/appadmin/FormField';

interface StatItem { id: string; label: string; value: string }
interface MenuItem { id: string; title: string; price: string; description: string; features: string; image: string }
interface CaseItem { id: string; company: string; category: string; title: string; result: string; detail: string }
interface MediaKit { url: string; fileSize: string; lastUpdated: string }

const INITIAL_STATS: StatItem[] = [
  { id: 'ms1', label: 'YouTube登録者数', value: '4.28万人' },
  { id: 'ms2', label: '月間再生数', value: '150万回+' },
  { id: 'ms3', label: 'SNS総フォロワー', value: '8.5万人+' },
  { id: 'ms4', label: '月間PV数', value: '30万PV' },
];

const INITIAL_MENUS: MenuItem[] = [
  { id: 'm1', title: '動画タイアップ', price: '300,000円〜', description: 'YouTubeチャンネルでの商品・サービス紹介動画を制作します。', features: '企画・構成\n撮影・編集\nサムネイル制作\nSNS拡散サポート', image: '/images/tieup-video.jpg' },
  { id: 'm2', title: '記事タイアップ', price: '150,000円〜', description: 'ぺいほーむメディアでのタイアップ記事を掲載します。', features: '取材・ライティング\n写真撮影\nSEO最適化\nSNSシェア', image: '/images/tieup-article.jpg' },
  { id: 'm3', title: '月刊誌タイアップ', price: '200,000円〜', description: 'ぺいほーむ月刊誌での広告・記事タイアップです。', features: '見開き広告\n編集タイアップ記事\nデジタル版同時掲載\n読者プレゼント企画', image: '/images/tieup-magazine.jpg' },
  { id: 'm4', title: 'イベントタイアップ', price: '500,000円〜', description: 'オンライン・オフラインイベントでのスポンサーシップです。', features: 'ブース出展\nセミナー登壇枠\nリード情報共有\nアフターレポート', image: '/images/tieup-event.jpg' },
];

const INITIAL_CASES: CaseItem[] = [
  { id: 'ac1', company: 'G建材', category: '動画タイアップ', title: '新商品プロモーション動画', result: '再生回数 12万回、問い合わせ 48件', detail: '住宅用建材の新商品紹介動画を制作。ターゲット層へのリーチに成功しました。' },
  { id: 'ac2', company: 'Hリフォーム', category: '記事タイアップ', title: 'リフォーム事例特集記事', result: 'PV 8,500、CV率 3.2%', detail: 'ビフォーアフター形式の記事で、リフォーム検討層への訴求を実現。' },
  { id: 'ac3', company: 'I設備', category: 'イベントタイアップ', title: '住宅設備オンラインセミナー', result: '参加者 320名、商談化率 15%', detail: 'オンラインセミナーへの協賛で、質の高いリード獲得に貢献しました。' },
];

export default function BizAdAdmin() {
  const [stats, setStats] = useState<StatItem[]>(INITIAL_STATS);
  const [menus, setMenus] = useState<MenuItem[]>(INITIAL_MENUS);
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
  const [mediaKit, setMediaKit] = useState<MediaKit>({ url: '/downloads/payhome-mediakit-2026.pdf', fileSize: '4.2MB', lastUpdated: '2026-03-01' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]";

  // Stats
  const updateStat = (id: string, field: keyof StatItem, v: string) => setStats(prev => prev.map(s => s.id === id ? { ...s, [field]: v } : s));

  // Menus
  const updateMenu = (id: string, field: keyof MenuItem, v: string) => setMenus(prev => prev.map(m => m.id === id ? { ...m, [field]: v } : m));
  const removeMenu = (id: string) => setMenus(prev => prev.filter(m => m.id !== id));
  const addMenu = () => setMenus(prev => [...prev, { id: `m${Date.now()}`, title: '', price: '', description: '', features: '', image: '' }]);

  // Cases
  const updateCase = (id: string, field: keyof CaseItem, v: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, [field]: v } : c));
  const removeCase = (id: string) => setCases(prev => prev.filter(c => c.id !== id));
  const addCase = () => setCases(prev => [...prev, { id: `ac${Date.now()}`, company: '', category: '', title: '', result: '', detail: '' }]);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">広告・タイアップ管理</h1>
          <p className="text-sm text-gray-500 mt-1">広告・タイアップページのコンテンツを管理します</p>
        </div>
        <button onClick={handleSave} className="px-6 py-2.5 bg-[#E8740C] text-white rounded-lg text-sm font-semibold hover:bg-[#d06a0b] transition cursor-pointer">
          {saved ? '保存しました' : '変更を保存'}
        </button>
      </div>

      {/* メディア実績数値 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">メディア実績数値</h2>
        <div className="space-y-3">
          {stats.map(s => (
            <div key={s.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <input type="text" value={s.label} onChange={e => updateStat(s.id, 'label', e.target.value)} placeholder="ラベル" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" />
              <input type="text" value={s.value} onChange={e => updateStat(s.id, 'value', e.target.value)} placeholder="値" className="w-40 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" />
            </div>
          ))}
        </div>
      </div>

      {/* タイアップメニュー */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">タイアップメニュー</h2>
          <button onClick={addMenu} className="px-4 py-1.5 text-sm text-[#E8740C] border border-[#E8740C] rounded-lg hover:bg-[#E8740C]/5 transition cursor-pointer">+ 追加</button>
        </div>
        <div className="space-y-4">
          {menus.map((m, idx) => (
            <div key={m.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#E8740C] bg-[#E8740C]/10 px-2 py-0.5 rounded">メニュー {idx + 1}</span>
                <button onClick={() => removeMenu(m.id)} className="text-xs text-red-500 hover:text-red-700 cursor-pointer">削除</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <FormField label="タイトル" value={m.title} onChange={v => updateMenu(m.id, 'title', v)} required />
                <FormField label="価格" value={m.price} onChange={v => updateMenu(m.id, 'price', v)} />
                <FormField label="画像パス" value={m.image} onChange={v => updateMenu(m.id, 'image', v)} placeholder="/images/tieup.jpg" />
              </div>
              <div className="mb-3">
                <FormField label="説明" value={m.description} onChange={v => updateMenu(m.id, 'description', v)} multiline rows={2} />
              </div>
              <FormField label="特徴（1行1項目）" value={m.features} onChange={v => updateMenu(m.id, 'features', v)} multiline rows={3} />
            </div>
          ))}
          {menus.length === 0 && <p className="text-sm text-gray-400 py-2">メニューがありません</p>}
        </div>
      </div>

      {/* タイアップ事例 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">タイアップ事例</h2>
          <button onClick={addCase} className="px-4 py-1.5 text-sm text-[#E8740C] border border-[#E8740C] rounded-lg hover:bg-[#E8740C]/5 transition cursor-pointer">+ 追加</button>
        </div>
        <div className="space-y-4">
          {cases.map(c => (
            <div key={c.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <FormField label="企業名" value={c.company} onChange={v => updateCase(c.id, 'company', v)} />
                <FormField label="カテゴリー" value={c.category} onChange={v => updateCase(c.id, 'category', v)} />
                <FormField label="タイトル" value={c.title} onChange={v => updateCase(c.id, 'title', v)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <FormField label="成果" value={c.result} onChange={v => updateCase(c.id, 'result', v)} />
                <div className="flex items-end">
                  <button onClick={() => removeCase(c.id)} className="px-3 py-2 text-xs text-red-500 hover:text-red-700 cursor-pointer">削除</button>
                </div>
              </div>
              <FormField label="詳細" value={c.detail} onChange={v => updateCase(c.id, 'detail', v)} multiline rows={2} />
            </div>
          ))}
          {cases.length === 0 && <p className="text-sm text-gray-400 py-2">事例がありません</p>}
        </div>
      </div>

      {/* メディアキット */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">メディアキット</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="ダウンロードURL" value={mediaKit.url} onChange={v => setMediaKit(prev => ({ ...prev, url: v }))} />
          <FormField label="ファイルサイズ" value={mediaKit.fileSize} onChange={v => setMediaKit(prev => ({ ...prev, fileSize: v }))} placeholder="例: 4.2MB" />
          <FormField label="最終更新日" value={mediaKit.lastUpdated} onChange={v => setMediaKit(prev => ({ ...prev, lastUpdated: v }))} type="date" />
        </div>
      </div>
    </div>
  );
}
