'use client';

import { useState } from 'react';
import ContentTable from '@/components/appadmin/ContentTable';
import DatePicker from '@/components/appadmin/DatePicker';
import { useArticles, articleStore } from '@/lib/content-store';
import { type ArticleData } from '@/lib/articles-data';

type EditMode = 'list' | 'add' | 'edit';

export default function ArticlesAdmin() {
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<ArticleData | null>(null);
  const items = useArticles();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'タイトル', render: (v: unknown) => <span className="font-medium text-gray-900 max-w-[300px] truncate block">{String(v)}</span> },
    { key: 'tag', label: 'タグ', render: (v: unknown) => <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">{String(v)}</span> },
    { key: 'date', label: '日付' },
  ];

  const handleDelete = (item: Record<string, unknown>) => {
    articleStore.set(prev => prev.filter(p => p.id !== item.id));
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <ArticleForm
        item={editItem}
        onSave={(data) => {
          if (mode === 'edit' && editItem) {
            articleStore.set(prev => prev.map(p => p.id === editItem.id ? { ...p, ...data } : p));
          } else {
            articleStore.set(prev => [data as ArticleData, ...prev]);
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
      onEdit={(item) => { setEditItem(item as unknown as ArticleData); setMode('edit'); }}
      onDelete={handleDelete}
    />
  );
}

function ArticleForm({ item, onSave, onCancel }: { item: ArticleData | null; onSave: (data: Partial<ArticleData>) => void; onCancel: () => void }) {
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
          <DatePicker label="日付" value={form.date} onChange={(v) => set('date', v)} format="dot" />
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" className="bg-[#E8740C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d4680b] transition cursor-pointer">{item ? '更新する' : '追加する'}</button>
          <button type="button" onClick={onCancel} className="px-6 py-3 text-gray-600 cursor-pointer">キャンセル</button>
        </div>
      </form>
    </div>
  );
}
