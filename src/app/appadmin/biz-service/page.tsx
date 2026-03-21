'use client';

import { useState } from 'react';
import FormField from '@/components/appadmin/FormField';

interface PlanItem { id: string; name: string; price: string; description: string; features: string; recommended: boolean }
interface CaseStudy { id: string; company: string; category: string; beforeMetric: string; afterMetric: string; description: string; image: string }
interface FAQItem { id: string; question: string; answer: string; order: number }
interface PriceRow { id: string; service: string; unit: string; price: string }
interface CompareRow { id: string; feature: string; ours: string; competitorA: string; competitorB: string }

const INITIAL_PLANS: PlanItem[] = [
  { id: 'p1', name: 'ライトプラン', price: '月額 30,000円', description: '小規模工務店向けの基本プラン', features: 'SNS投稿代行（月8本）\n基本レポート（月次）\nメール・チャットサポート', recommended: false },
  { id: 'p2', name: 'スタンダードプラン', price: '月額 80,000円', description: '成長中の工務店に最適なプラン', features: 'SNS投稿代行（月16本）\n動画制作（月2本）\n詳細レポート（月次）\n専任担当者\n電話サポート', recommended: true },
  { id: 'p3', name: 'プレミアムプラン', price: '月額 150,000円', description: '本格的なマーケティング支援', features: 'SNS投稿代行（無制限）\n動画制作（月4本）\nWEB広告運用\n戦略コンサルティング\n専任チーム体制', recommended: false },
  { id: 'p4', name: 'エンタープライズ', price: '要相談', description: '大手ハウスメーカー向けカスタムプラン', features: '全サービス利用可能\nカスタム開発\n専任プロジェクトマネージャー\n月次戦略会議\nSLA保証', recommended: false },
];

const INITIAL_CASES: CaseStudy[] = [
  { id: 'cs1', company: 'D工務店', category: 'SNS運用', beforeMetric: 'Instagram フォロワー 200人', afterMetric: 'Instagram フォロワー 5,800人', description: '6ヶ月間のSNS運用代行で、地域での認知度が大幅に向上しました。', image: '/images/case1.jpg' },
  { id: 'cs2', company: 'E建設', category: '動画制作', beforeMetric: 'YouTube チャンネル登録者 0人', afterMetric: 'YouTube チャンネル登録者 3,200人', description: '月4本のルームツアー動画で、問い合わせ経路に変化が。', image: '/images/case2.jpg' },
  { id: 'cs3', company: 'Fホーム', category: 'WEB制作', beforeMetric: '月間サイト訪問者 500人', afterMetric: '月間サイト訪問者 8,000人', description: 'サイトリニューアルとSEO施策で検索流入が16倍に。', image: '/images/case3.jpg' },
];

const INITIAL_FAQS: FAQItem[] = [
  { id: 'f1', question: '最低契約期間はありますか？', answer: 'ライトプランは3ヶ月、スタンダード以上は6ヶ月の最低契約期間がございます。', order: 1 },
  { id: 'f2', question: '途中でプラン変更はできますか？', answer: 'はい、月単位でのプランアップグレードが可能です。ダウングレードは契約更新時に承ります。', order: 2 },
  { id: 'f3', question: '動画の撮影エリアに制限はありますか？', answer: '関東・関西エリアは追加費用なし、その他のエリアは交通費実費をいただいております。', order: 3 },
  { id: 'f4', question: '成果が出るまでどのくらいかかりますか？', answer: 'SNS運用は3〜6ヶ月、WEB施策は2〜4ヶ月程度で効果が見え始めるケースが多いです。', order: 4 },
  { id: 'f5', question: '解約時の違約金はありますか？', answer: '最低契約期間内の解約の場合、残月分の50%を解約金としていただきます。期間満了後は違約金なしで解約可能です。', order: 5 },
];

const INITIAL_PRICES: PriceRow[] = [
  { id: 'pr1', service: '動画撮影', unit: '1本', price: '50,000円' },
  { id: 'pr2', service: '動画編集', unit: '1本', price: '30,000円' },
  { id: 'pr3', service: 'SNS投稿作成', unit: '1投稿', price: '5,000円' },
  { id: 'pr4', service: 'WEBサイト制作', unit: '1サイト', price: '300,000円〜' },
  { id: 'pr5', service: '広告運用手数料', unit: '月額', price: '広告費の20%' },
];

const INITIAL_COMPARE: CompareRow[] = [
  { id: 'cm1', feature: '住宅業界特化', ours: '◎', competitorA: '△', competitorB: '×' },
  { id: 'cm2', feature: '動画制作', ours: '◎', competitorA: '○', competitorB: '×' },
  { id: 'cm3', feature: 'SNS運用', ours: '◎', competitorA: '○', competitorB: '○' },
  { id: 'cm4', feature: 'WEB制作', ours: '◎', competitorA: '△', competitorB: '◎' },
  { id: 'cm5', feature: '専任担当者', ours: '○', competitorA: '×', competitorB: '○' },
];

export default function BizServiceAdmin() {
  const [plans, setPlans] = useState<PlanItem[]>(INITIAL_PLANS);
  const [cases, setCases] = useState<CaseStudy[]>(INITIAL_CASES);
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [prices, setPrices] = useState<PriceRow[]>(INITIAL_PRICES);
  const [compare, setCompare] = useState<CompareRow[]>(INITIAL_COMPARE);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  // Plans
  const updatePlan = (id: string, field: keyof PlanItem, v: string | boolean) => setPlans(prev => prev.map(p => p.id === id ? { ...p, [field]: v } : p));

  // Cases
  const updateCaseField = (id: string, field: keyof CaseStudy, v: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, [field]: v } : c));
  const removeCase = (id: string) => setCases(prev => prev.filter(c => c.id !== id));
  const addCase = () => setCases(prev => [...prev, { id: `cs${Date.now()}`, company: '', category: '', beforeMetric: '', afterMetric: '', description: '', image: '' }]);

  // FAQs
  const updateFaq = (id: string, field: keyof FAQItem, v: string | number) => setFaqs(prev => prev.map(f => f.id === id ? { ...f, [field]: v } : f));
  const removeFaq = (id: string) => setFaqs(prev => prev.filter(f => f.id !== id));
  const addFaq = () => setFaqs(prev => [...prev, { id: `f${Date.now()}`, question: '', answer: '', order: prev.length + 1 }]);
  const moveFaq = (idx: number, dir: -1 | 1) => {
    const sorted = [...faqs].sort((a, b) => a.order - b.order);
    const t = idx + dir;
    if (t < 0 || t >= sorted.length) return;
    const tmp = sorted[idx].order;
    sorted[idx] = { ...sorted[idx], order: sorted[t].order };
    sorted[t] = { ...sorted[t], order: tmp };
    setFaqs(sorted);
  };

  // Prices
  const updatePrice = (id: string, field: keyof PriceRow, v: string) => setPrices(prev => prev.map(p => p.id === id ? { ...p, [field]: v } : p));
  const removePrice = (id: string) => setPrices(prev => prev.filter(p => p.id !== id));
  const addPrice = () => setPrices(prev => [...prev, { id: `pr${Date.now()}`, service: '', unit: '', price: '' }]);

  // Compare
  const updateCompare = (id: string, field: keyof CompareRow, v: string) => setCompare(prev => prev.map(c => c.id === id ? { ...c, [field]: v } : c));
  const removeCompare = (id: string) => setCompare(prev => prev.filter(c => c.id !== id));
  const addCompare = () => setCompare(prev => [...prev, { id: `cm${Date.now()}`, feature: '', ours: '', competitorA: '', competitorB: '' }]);

  const sortedFaqs = [...faqs].sort((a, b) => a.order - b.order);
  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]";

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">サービスページ管理</h1>
          <p className="text-sm text-gray-500 mt-1">法人向けサービスページのコンテンツを管理します</p>
        </div>
        <button onClick={handleSave} className="px-6 py-2.5 bg-[#E8740C] text-white rounded-lg text-sm font-semibold hover:bg-[#d06a0b] transition cursor-pointer">
          {saved ? '保存しました' : '変更を保存'}
        </button>
      </div>

      {/* プラン管理 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">プラン管理</h2>
        <div className="space-y-4">
          {plans.map((p, idx) => (
            <div key={p.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-[#E8740C] bg-[#E8740C]/10 px-2 py-0.5 rounded">プラン {idx + 1}</span>
                {p.recommended && <span className="text-xs font-bold text-white bg-[#E8740C] px-2 py-0.5 rounded">おすすめ</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <FormField label="プラン名" value={p.name} onChange={v => updatePlan(p.id, 'name', v)} required />
                <FormField label="価格" value={p.price} onChange={v => updatePlan(p.id, 'price', v)} />
                <FormField label="説明" value={p.description} onChange={v => updatePlan(p.id, 'description', v)} />
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

      {/* 事例紹介 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">事例紹介</h2>
          <button onClick={addCase} className="px-4 py-1.5 text-sm text-[#E8740C] border border-[#E8740C] rounded-lg hover:bg-[#E8740C]/5 transition cursor-pointer">+ 追加</button>
        </div>
        <div className="space-y-4">
          {cases.map(c => (
            <div key={c.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <FormField label="企業名" value={c.company} onChange={v => updateCaseField(c.id, 'company', v)} />
                <FormField label="カテゴリー" value={c.category} onChange={v => updateCaseField(c.id, 'category', v)} />
                <FormField label="画像パス" value={c.image} onChange={v => updateCaseField(c.id, 'image', v)} placeholder="/images/case.jpg" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <FormField label="Before指標" value={c.beforeMetric} onChange={v => updateCaseField(c.id, 'beforeMetric', v)} />
                <FormField label="After指標" value={c.afterMetric} onChange={v => updateCaseField(c.id, 'afterMetric', v)} />
              </div>
              <div className="flex items-end gap-3">
                <div className="flex-1"><FormField label="説明" value={c.description} onChange={v => updateCaseField(c.id, 'description', v)} multiline rows={2} /></div>
                <button onClick={() => removeCase(c.id)} className="px-3 py-2 text-xs text-red-500 hover:text-red-700 cursor-pointer mb-0.5">削除</button>
              </div>
            </div>
          ))}
          {cases.length === 0 && <p className="text-sm text-gray-400 py-2">事例がありません</p>}
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

      {/* 料金表 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">料金表</h2>
          <button onClick={addPrice} className="px-4 py-1.5 text-sm text-[#E8740C] border border-[#E8740C] rounded-lg hover:bg-[#E8740C]/5 transition cursor-pointer">+ 追加</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">サービス名</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-32">単位</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-40">価格</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-16">操作</th>
              </tr>
            </thead>
            <tbody>
              {prices.map(p => (
                <tr key={p.id} className="border-b border-gray-50">
                  <td className="px-4 py-2"><input type="text" value={p.service} onChange={e => updatePrice(p.id, 'service', e.target.value)} className={inputCls} /></td>
                  <td className="px-4 py-2"><input type="text" value={p.unit} onChange={e => updatePrice(p.id, 'unit', e.target.value)} className={inputCls} /></td>
                  <td className="px-4 py-2"><input type="text" value={p.price} onChange={e => updatePrice(p.id, 'price', e.target.value)} className={inputCls} /></td>
                  <td className="px-4 py-2"><button onClick={() => removePrice(p.id)} className="text-xs text-red-500 hover:text-red-700 cursor-pointer">削除</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {prices.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">料金項目がありません</div>}
        </div>
      </div>

      {/* 比較表設定 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">比較表設定</h2>
          <button onClick={addCompare} className="px-4 py-1.5 text-sm text-[#E8740C] border border-[#E8740C] rounded-lg hover:bg-[#E8740C]/5 transition cursor-pointer">+ 追加</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">機能</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-28">自社</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-28">競合A</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-28">競合B</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-16">操作</th>
              </tr>
            </thead>
            <tbody>
              {compare.map(c => (
                <tr key={c.id} className="border-b border-gray-50">
                  <td className="px-4 py-2"><input type="text" value={c.feature} onChange={e => updateCompare(c.id, 'feature', e.target.value)} className={inputCls} /></td>
                  <td className="px-4 py-2"><input type="text" value={c.ours} onChange={e => updateCompare(c.id, 'ours', e.target.value)} className={inputCls} /></td>
                  <td className="px-4 py-2"><input type="text" value={c.competitorA} onChange={e => updateCompare(c.id, 'competitorA', e.target.value)} className={inputCls} /></td>
                  <td className="px-4 py-2"><input type="text" value={c.competitorB} onChange={e => updateCompare(c.id, 'competitorB', e.target.value)} className={inputCls} /></td>
                  <td className="px-4 py-2"><button onClick={() => removeCompare(c.id)} className="text-xs text-red-500 hover:text-red-700 cursor-pointer">削除</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {compare.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">比較項目がありません</div>}
        </div>
      </div>
    </div>
  );
}
