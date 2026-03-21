'use client';

import { useState } from 'react';
import RichTextEditor from '@/components/appadmin/RichTextEditor';
import FormField from '@/components/appadmin/FormField';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  visible: boolean;
}

const CATEGORIES = ['一般', '家づくり', '資金', '手続き'] as const;

const INITIAL_FAQS: FAQItem[] = [
  { id: 'faq-1', question: '家づくりは何から始めればいいですか？', answer: '<p>まずは家族で「どんな暮らしがしたいか」を話し合うことから始めましょう。予算の目安を把握し、住みたいエリアを絞り込むことで、具体的な計画が立てやすくなります。</p>', category: '家づくり', order: 1, visible: true },
  { id: 'faq-2', question: '住宅ローンの事前審査はいつ頃受けるべきですか？', answer: '<p>土地や物件を本格的に探し始める前に事前審査を受けることをお勧めします。借入可能額を把握しておくことで、無理のない資金計画が立てられます。</p>', category: '資金', order: 2, visible: true },
  { id: 'faq-3', question: '注文住宅と建売住宅の違いは何ですか？', answer: '<p>注文住宅は間取りや設備を自由に選べる一方、建売住宅は完成済みまたは設計済みの住宅を購入します。注文住宅は自由度が高い分、打ち合わせに時間がかかります。</p>', category: '家づくり', order: 3, visible: true },
  { id: 'faq-4', question: '頭金はどのくらい用意すべきですか？', answer: '<p>一般的には物件価格の10〜20%が目安とされていますが、最近は頭金なしでもローンを組める場合もあります。ただし、諸費用（物件価格の5〜8%程度）は別途必要です。</p>', category: '資金', order: 4, visible: true },
  { id: 'faq-5', question: '建築確認申請とは何ですか？', answer: '<p>建物を建てる前に、その建物が建築基準法に適合しているかを確認するための申請です。工務店やハウスメーカーが代行して行うのが一般的です。</p>', category: '手続き', order: 5, visible: true },
  { id: 'faq-6', question: 'ぺいほーむのサービスは無料ですか？', answer: '<p>はい、ぺいほーむの動画コンテンツや記事の閲覧はすべて無料でご利用いただけます。住宅相談サービスについては別途ご案内しております。</p>', category: '一般', order: 6, visible: true },
  { id: 'faq-7', question: '工務店とハウスメーカーの違いは？', answer: '<p>ハウスメーカーは全国展開で規格化された住宅を提供する大手企業です。工務店は地域密着で、より柔軟なカスタマイズに対応できることが多いです。</p>', category: '家づくり', order: 7, visible: true },
  { id: 'faq-8', question: '住宅ローン控除（減税）について教えてください', answer: '<p>住宅ローン控除は、住宅ローンの年末残高に応じて所得税・住民税が控除される制度です。新築・中古、省エネ性能によって控除率や期間が異なります。</p>', category: '資金', order: 8, visible: true },
  { id: 'faq-9', question: '引き渡しまでの流れを教えてください', answer: '<p>一般的な流れは、①相談・プランニング → ②見積もり・契約 → ③詳細設計 → ④着工 → ⑤上棟 → ⑥内装工事 → ⑦完成検査 → ⑧引き渡し です。注文住宅の場合、着工から引き渡しまで4〜6ヶ月が目安です。</p>', category: '手続き', order: 9, visible: true },
  { id: 'faq-10', question: '動画の出演依頼はできますか？', answer: '<p>工務店・ハウスメーカー様からの取材・出演のご依頼を受け付けております。詳細はお問い合わせフォームよりご連絡ください。</p>', category: '一般', order: 10, visible: false },
];

type EditMode = 'list' | 'add' | 'edit';

export default function FAQAdmin() {
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<FAQItem | null>(null);
  const [saved, setSaved] = useState(false);

  // Form state
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formCategory, setFormCategory] = useState<string>(CATEGORIES[0]);
  const [formOrder, setFormOrder] = useState('');

  const openAdd = () => {
    setFormQuestion('');
    setFormAnswer('');
    setFormCategory(CATEGORIES[0]);
    setFormOrder(String(faqs.length + 1));
    setEditItem(null);
    setMode('add');
  };

  const openEdit = (item: FAQItem) => {
    setFormQuestion(item.question);
    setFormAnswer(item.answer);
    setFormCategory(item.category);
    setFormOrder(String(item.order));
    setEditItem(item);
    setMode('edit');
  };

  const handleSave = () => {
    if (!formQuestion.trim()) return;
    const data: FAQItem = {
      id: editItem?.id || `faq-${Date.now()}`,
      question: formQuestion,
      answer: formAnswer,
      category: formCategory,
      order: parseInt(formOrder) || faqs.length + 1,
      visible: editItem?.visible ?? true,
    };
    if (mode === 'edit' && editItem) {
      setFaqs((prev) => prev.map((f) => (f.id === editItem.id ? data : f)));
    } else {
      setFaqs((prev) => [...prev, data]);
    }
    setMode('list');
  };

  const handleDelete = (id: string) => {
    if (!confirm('このFAQを削除しますか？')) return;
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const toggleVisible = (id: string) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f)));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const sorted = [...faqs].sort((a, b) => a.order - b.order);
    const target = index + direction;
    if (target < 0 || target >= sorted.length) return;
    const tempOrder = sorted[index].order;
    sorted[index] = { ...sorted[index], order: sorted[target].order };
    sorted[target] = { ...sorted[target], order: tempOrder };
    setFaqs(sorted);
  };

  const handleBulkSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sortedFaqs = [...faqs].sort((a, b) => a.order - b.order);

  if (mode === 'add' || mode === 'edit') {
    return (
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setMode('list')} className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
            ← 一覧に戻る
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'add' ? 'FAQ追加' : 'FAQ編集'}
          </h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <FormField label="質問" value={formQuestion} onChange={setFormQuestion} required placeholder="よくある質問を入力..." />

          <RichTextEditor label="回答" value={formAnswer} onChange={setFormAnswer} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">カテゴリー<span className="text-red-500 ml-0.5">*</span></label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <FormField label="表示順" value={formOrder} onChange={setFormOrder} type="number" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setMode('list')}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#E8740C] text-white rounded-lg text-sm font-semibold hover:bg-[#d06a0b] transition cursor-pointer"
            >
              {mode === 'add' ? '追加する' : '更新する'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ管理</h1>
          <p className="text-sm text-gray-500 mt-1">よくある質問の追加・編集・並び替えができます</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleBulkSave}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
          >
            {saved ? '保存しました' : '変更を保存'}
          </button>
          <button
            onClick={openAdd}
            className="px-5 py-2 bg-[#E8740C] text-white rounded-lg text-sm font-semibold hover:bg-[#d06a0b] transition cursor-pointer"
          >
            + 新規追加
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-10">順序</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">質問</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-24">カテゴリー</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-20">状態</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-28">並び替え</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-24">操作</th>
            </tr>
          </thead>
          <tbody>
            {sortedFaqs.map((faq, idx) => {
              const catColors: Record<string, string> = {
                '一般': 'bg-blue-100 text-blue-700',
                '家づくり': 'bg-green-100 text-green-700',
                '資金': 'bg-amber-100 text-amber-700',
                '手続き': 'bg-purple-100 text-purple-700',
              };
              return (
                <tr key={faq.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 text-xs text-gray-400">{faq.order}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900 block max-w-[400px] truncate">{faq.question}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${catColors[faq.category] || 'bg-gray-100 text-gray-600'}`}>
                      {faq.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleVisible(faq.id)}
                      className={`text-xs px-2 py-1 rounded-full cursor-pointer transition ${
                        faq.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {faq.visible ? '表示' : '非表示'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => moveItem(idx, -1)}
                        disabled={idx === 0}
                        className="w-7 h-7 flex items-center justify-center text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded disabled:opacity-30 cursor-pointer disabled:cursor-default"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveItem(idx, 1)}
                        disabled={idx === sortedFaqs.length - 1}
                        className="w-7 h-7 flex items-center justify-center text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded disabled:opacity-30 cursor-pointer disabled:cursor-default"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(faq)}
                        className="text-xs text-[#E8740C] hover:text-[#d06a0b] font-medium cursor-pointer"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer"
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sortedFaqs.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">FAQがありません</div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-400 text-right">全 {faqs.length} 件</div>
    </div>
  );
}
