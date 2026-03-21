'use client';

import { useState } from 'react';
import FormField from '@/components/appadmin/FormField';

interface StatItem { id: string; label: string; value: string }
interface PlanItem { id: string; name: string; price: string; features: string; recommended: boolean }
interface FlowStep { id: string; number: number; title: string; description: string }
interface FAQItem { id: string; question: string; answer: string; order: number }
interface BenefitItem { id: string; title: string; description: string }

const INITIAL_STATS: StatItem[] = [
  { id: 'ps1', label: 'パートナー企業数', value: '50+' },
  { id: 'ps2', label: '平均リード獲得数', value: '月15件' },
  { id: 'ps3', label: '成約率向上', value: '平均23%' },
];

const INITIAL_PLANS: PlanItem[] = [
  { id: 'pp1', name: 'フリー', price: '無料', features: 'ポータルサイト基本掲載\n企業プロフィールページ\n月次レポート（簡易版）', recommended: false },
  { id: 'pp2', name: 'グロース', price: '月額 50,000円', features: 'ポータルサイト優先掲載\n動画コンテンツ連携\n詳細アナリティクス\nリード情報共有\nチャットサポート', recommended: true },
  { id: 'pp3', name: 'プレミアム', price: '月額 100,000円', features: 'ポータルサイト最上位掲載\n専用LP制作\n動画制作（月1本）\n専任担当者\n戦略ミーティング（月1回）\n広告運用サポート', recommended: false },
];

const INITIAL_FLOW: FlowStep[] = [
  { id: 'fl1', number: 1, title: 'お問い合わせ', description: 'フォームまたはお電話にてお気軽にご連絡ください。' },
  { id: 'fl2', number: 2, title: 'ヒアリング', description: '現状の課題や目標をヒアリングし、最適なプランをご提案します。' },
  { id: 'fl3', number: 3, title: 'プラン決定', description: 'ご要望に合わせたプランを決定し、契約手続きを行います。' },
  { id: 'fl4', number: 4, title: '運用開始', description: 'アカウント設定後、すぐにサービスをご利用いただけます。' },
];

const INITIAL_FAQS: FAQItem[] = [
  { id: 'pf1', question: 'パートナー登録に審査はありますか？', answer: 'はい、住宅関連事業者であることを確認する簡単な審査がございます。通常3営業日以内に結果をご連絡します。', order: 1 },
  { id: 'pf2', question: 'フリープランから有料プランへの切り替えは可能ですか？', answer: 'はい、いつでもアップグレードが可能です。管理画面からお手続きいただけます。', order: 2 },
  { id: 'pf3', question: 'リード情報はどのように共有されますか？', answer: '管理画面上でリアルタイムに確認いただけるほか、メール通知も設定可能です。', order: 3 },
  { id: 'pf4', question: '掲載エリアに制限はありますか？', answer: '全国対応しております。エリアごとの表示優先度は管理画面から設定できます。', order: 4 },
  { id: 'pf5', question: '解約手続きについて教えてください', answer: '管理画面から解約申請が可能です。月末締めで翌月から解約が反映されます。フリープランへのダウングレードも可能です。', order: 5 },
];

const INITIAL_BENEFITS: BenefitItem[] = [
  { id: 'b1', title: '動画コンテンツ連携', description: 'ぺいほーむYouTubeチャンネルとの連携で、自社の魅力を動画でアピールできます。' },
  { id: 'b2', title: '専用分析ダッシュボード', description: 'アクセス数・問い合わせ数・コンバージョン率をリアルタイムで確認できます。' },
  { id: 'b3', title: 'セミナー・イベント優先参加', description: 'ぺいほーむ主催のセミナーやイベントに優先的にご参加いただけます。' },
  { id: 'b4', title: 'マーケティング資料提供', description: '住宅業界のトレンドレポートやマーケティングテンプレートを無料でご利用いただけます。' },
];

export default function BizPartnerAdmin() {
  const [stats, setStats] = useState<StatItem[]>(INITIAL_STATS);
  const [plans, setPlans] = useState<PlanItem[]>(INITIAL_PLANS);
  const [flow, setFlow] = useState<FlowStep[]>(INITIAL_FLOW);
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [benefits, setBenefits] = useState<BenefitItem[]>(INITIAL_BENEFITS);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]";

  // Stats
  const updateStat = (id: string, field: keyof StatItem, v: string) => setStats(prev => prev.map(s => s.id === id ? { ...s, [field]: v } : s));

  // Plans
  const updatePlan = (id: string, field: keyof PlanItem, v: string | boolean) => setPlans(prev => prev.map(p => p.id === id ? { ...p, [field]: v } : p));

  // Flow
  const updateFlow = (id: string, field: keyof FlowStep, v: string | number) => setFlow(prev => prev.map(f => f.id === id ? { ...f, [field]: v } : f));
  const moveFlow = (idx: number, dir: -1 | 1) => {
    const t = idx + dir;
    if (t < 0 || t >= flow.length) return;
    setFlow(prev => {
      const a = [...prev];
      [a[idx], a[t]] = [a[t], a[idx]];
      return a.map((item, i) => ({ ...item, number: i + 1 }));
    });
  };

  // FAQs
  const updateFaq = (id: string, field: keyof FAQItem, v: string | number) => setFaqs(prev => prev.map(f => f.id === id ? { ...f, [field]: v } : f));
  const removeFaq = (id: string) => setFaqs(prev => prev.filter(f => f.id !== id));
  const addFaq = () => setFaqs(prev => [...prev, { id: `pf${Date.now()}`, question: '', answer: '', order: prev.length + 1 }]);
  const moveFaq = (idx: number, dir: -1 | 1) => {
    const sorted = [...faqs].sort((a, b) => a.order - b.order);
    const t = idx + dir;
    if (t < 0 || t >= sorted.length) return;
    const tmp = sorted[idx].order;
    sorted[idx] = { ...sorted[idx], order: sorted[t].order };
    sorted[t] = { ...sorted[t], order: tmp };
    setFaqs(sorted);
  };

  // Benefits
  const updateBenefit = (id: string, field: keyof BenefitItem, v: string) => setBenefits(prev => prev.map(b => b.id === id ? { ...b, [field]: v } : b));
  const removeBenefit = (id: string) => setBenefits(prev => prev.filter(b => b.id !== id));
  const addBenefit = () => setBenefits(prev => [...prev, { id: `b${Date.now()}`, title: '', description: '' }]);

  const sortedFaqs = [...faqs].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">パートナー管理ページ</h1>
          <p className="text-sm text-gray-500 mt-1">パートナーページのコンテンツを管理します</p>
        </div>
        <button onClick={handleSave} className="px-6 py-2.5 bg-[#E8740C] text-white rounded-lg text-sm font-semibold hover:bg-[#d06a0b] transition cursor-pointer">
          {saved ? '保存しました' : '変更を保存'}
        </button>
      </div>

      {/* 実績数値 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">実績数値</h2>
        <div className="space-y-3">
          {stats.map(s => (
            <div key={s.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <input type="text" value={s.label} onChange={e => updateStat(s.id, 'label', e.target.value)} placeholder="ラベル" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" />
              <input type="text" value={s.value} onChange={e => updateStat(s.id, 'value', e.target.value)} placeholder="値" className="w-40 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" />
            </div>
          ))}
        </div>
      </div>

      {/* プラン紹介 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">プラン紹介</h2>
        <div className="space-y-4">
          {plans.map((p, idx) => (
            <div key={p.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-[#E8740C] bg-[#E8740C]/10 px-2 py-0.5 rounded">プラン {idx + 1}</span>
                {p.recommended && <span className="text-xs font-bold text-white bg-[#E8740C] px-2 py-0.5 rounded">おすすめ</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <FormField label="プラン名" value={p.name} onChange={v => updatePlan(p.id, 'name', v)} required />
                <FormField label="価格" value={p.price} onChange={v => updatePlan(p.id, 'price', v)} />
              </div>
              <div className="mb-3">
                <FormField label="特徴（1行1項目）" value={p.features} onChange={v => updatePlan(p.id, 'features', v)} multiline rows={4} />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={p.recommended} onChange={e => updatePlan(p.id, 'recommended', e.target.checked)} className="rounded border-gray-300 text-[#E8740C] focus:ring-[#E8740C]" />
                おすすめバッジを表示
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 導入フロー */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">導入フロー</h2>
        <div className="space-y-3">
          {flow.map((f, idx) => (
            <div key={f.id} className="flex items-start gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <div className="flex flex-col gap-1 pt-1">
                <button onClick={() => moveFlow(idx, -1)} disabled={idx === 0} className="w-6 h-6 flex items-center justify-center text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer disabled:cursor-default">▲</button>
                <button onClick={() => moveFlow(idx, 1)} disabled={idx === flow.length - 1} className="w-6 h-6 flex items-center justify-center text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer disabled:cursor-default">▼</button>
              </div>
              <div className="w-10 h-10 bg-[#E8740C] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                {f.number}
              </div>
              <div className="flex-1 space-y-2">
                <input type="text" value={f.title} onChange={e => updateFlow(f.id, 'title', e.target.value)} placeholder="ステップタイトル" className={inputCls} />
                <textarea value={f.description} onChange={e => updateFlow(f.id, 'description', e.target.value)} placeholder="説明" rows={2} className={inputCls + " resize-y"} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ管理 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">FAQ管理</h2>
          <button onClick={addFaq} className="px-4 py-1.5 text-sm text-[#E8740C] border border-[#E8740C] rounded-lg hover:bg-[#E8740C]/5 transition cursor-pointer">+ 追加</button>
        </div>
        <div className="space-y-3">
          {sortedFaqs.map((f, idx) => (
            <div key={f.id} className="flex items-start gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <div className="flex flex-col gap-1 pt-1">
                <button onClick={() => moveFaq(idx, -1)} disabled={idx === 0} className="w-6 h-6 flex items-center justify-center text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer disabled:cursor-default">▲</button>
                <button onClick={() => moveFaq(idx, 1)} disabled={idx === sortedFaqs.length - 1} className="w-6 h-6 flex items-center justify-center text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer disabled:cursor-default">▼</button>
              </div>
              <div className="flex-1 space-y-2">
                <input type="text" value={f.question} onChange={e => updateFaq(f.id, 'question', e.target.value)} placeholder="質問" className={inputCls} />
                <textarea value={f.answer} onChange={e => updateFaq(f.id, 'answer', e.target.value)} placeholder="回答" rows={2} className={inputCls + " resize-y"} />
              </div>
              <button onClick={() => removeFaq(f.id)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer mt-1">×</button>
            </div>
          ))}
          {faqs.length === 0 && <p className="text-sm text-gray-400 py-2">FAQがありません</p>}
        </div>
      </div>

      {/* パートナー特典 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">パートナー特典</h2>
          <button onClick={addBenefit} className="px-4 py-1.5 text-sm text-[#E8740C] border border-[#E8740C] rounded-lg hover:bg-[#E8740C]/5 transition cursor-pointer">+ 追加</button>
        </div>
        <div className="space-y-3">
          {benefits.map(b => (
            <div key={b.id} className="flex items-start gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <div className="flex-1 space-y-2">
                <input type="text" value={b.title} onChange={e => updateBenefit(b.id, 'title', e.target.value)} placeholder="特典タイトル" className={inputCls} />
                <textarea value={b.description} onChange={e => updateBenefit(b.id, 'description', e.target.value)} placeholder="説明" rows={2} className={inputCls + " resize-y"} />
              </div>
              <button onClick={() => removeBenefit(b.id)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer mt-1">×</button>
            </div>
          ))}
          {benefits.length === 0 && <p className="text-sm text-gray-400 py-2">特典がありません</p>}
        </div>
      </div>
    </div>
  );
}
