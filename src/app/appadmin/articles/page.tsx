'use client';

import { useState } from 'react';
import ContentTable from '@/components/appadmin/ContentTable';

interface Article {
  id: string;
  tag: string;
  date: string;
  title: string;
}

const INITIAL_ARTICLES: Article[] = [
  { id: 'article-01', tag: '家づくりの基本', date: '2026.03.10', title: '注文住宅 vs 建売住宅 ─ あなたに合うのはどっち？' },
  { id: 'article-02', tag: '資金計画', date: '2026.03.05', title: '住宅ローンの基本：固定金利と変動金利の選び方' },
  { id: 'article-03', tag: '間取り', date: '2026.02.28', title: '平屋の間取り完全ガイド ─ 人気の3LDKプラン10選' },
  { id: 'article-04', tag: '設備', date: '2026.02.20', title: 'キッチン選びで後悔しないための5つのポイント' },
  { id: 'article-05', tag: '断熱・省エネ', date: '2026.02.15', title: 'ZEH住宅とは？メリット・デメリットを徹底解説' },
  { id: 'article-06', tag: '土地探し', date: '2026.02.10', title: '鹿児島の土地探し完全ガイド ─ エリア別相場と選び方' },
  { id: 'article-07', tag: '家づくりの基本', date: '2026.02.05', title: '工務店とハウスメーカーの違いを比較してみた' },
  { id: 'article-08', tag: '資金計画', date: '2026.01.28', title: '家づくりの総費用を徹底解説 ─ 見落としがちな諸費用とは' },
  { id: 'article-09', tag: 'メンテナンス', date: '2026.01.20', title: '新築住宅のメンテナンスカレンダー ─ いつ何をすべき？' },
];

type EditMode = 'list' | 'add' | 'edit';

export default function ArticlesAdmin() {
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<Article | null>(null);
  const [items, setItems] = useState<Article[]>(INITIAL_ARTICLES);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'タイトル', render: (v: unknown) => <span className="font-medium text-gray-900 max-w-[300px] truncate block">{String(v)}</span> },
    { key: 'tag', label: 'タグ', render: (v: unknown) => <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">{String(v)}</span> },
    { key: 'date', label: '日付' },
  ];

  const handleDelete = (item: Record<string, unknown>) => {
    setItems((prev) => prev.filter((p) => p.id !== item.id));
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <ArticleForm
        item={editItem}
        onSave={(data) => {
          if (mode === 'edit' && editItem) {
            setItems((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
          } else {
            setItems((prev) => [data as Article, ...prev]);
          }
          setMode('list');
          setEditItem(null);
        }}
        onCancel={() => { setMode('list'); setEditItem(null); }}
      />
    );
  }

  return (
    <ContentTable
      title="お役立ち記事管理"
      description="お役立ち記事のコンテンツを管理します"
      columns={columns}
      data={items as unknown as Record<string, unknown>[]}
      onAdd={() => setMode('add')}
      onEdit={(item) => { setEditItem(item as unknown as Article); setMode('edit'); }}
      onDelete={handleDelete}
    />
  );
}

function ArticleForm({ item, onSave, onCancel }: { item: Article | null; onSave: (data: Partial<Article>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    id: item?.id ?? '',
    title: item?.title ?? '',
    tag: item?.tag ?? '',
    date: item?.date ?? '',
  });
  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const TAGS = ['家づくりの基本', '資金計画', '間取り', '設備', '断熱・省エネ', '土地探し', 'メンテナンス'];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-[#E8740C] cursor-pointer">← 戻る</button>
        <h1 className="text-2xl font-bold text-gray-900">{item ? '記事を編集' : '記事を新規追加'}</h1>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">ID<span className="text-red-500 ml-0.5">*</span></label>
            <input type="text" value={form.id} onChange={(e) => set('id', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">タイトル<span className="text-red-500 ml-0.5">*</span></label>
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">タグ</label>
            <select value={form.tag} onChange={(e) => set('tag', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">選択してください</option>
              {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">日付</label>
            <input type="text" value={form.date} onChange={(e) => set('date', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" placeholder="2026.03.15" />
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" className="bg-[#E8740C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d4680b] transition cursor-pointer">{item ? '更新する' : '追加する'}</button>
          <button type="button" onClick={onCancel} className="px-6 py-3 text-gray-600 cursor-pointer">キャンセル</button>
        </div>
      </form>
    </div>
  );
}
