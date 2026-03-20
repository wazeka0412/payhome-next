'use client';

import { useState } from 'react';
import ContentTable from '@/components/appadmin/ContentTable';
import DatePicker from '@/components/appadmin/DatePicker';
import RichTextEditor from '@/components/appadmin/RichTextEditor';
import { useNews, newsStore } from '@/lib/content-store';
import { type NewsItem } from '@/lib/news-data';

type EditMode = 'list' | 'add' | 'edit';

export default function NewsAdmin() {
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<NewsItem | null>(null);
  const items = useNews();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'タイトル', render: (v: unknown) => <span className="font-medium text-gray-900 max-w-[300px] truncate block">{String(v)}</span> },
    { key: 'category', label: 'カテゴリー', render: (v: unknown) => {
      const colors: Record<string, string> = {
        'お知らせ': 'bg-blue-100 text-blue-700',
        '業界ニュース': 'bg-green-100 text-green-700',
        'コラム': 'bg-purple-100 text-purple-700',
      };
      return <span className={`text-xs px-2 py-0.5 rounded-full ${colors[String(v)] ?? 'bg-gray-100 text-gray-600'}`}>{String(v)}</span>;
    }},
    { key: 'date', label: '日付' },
  ];

  const handleDelete = (item: Record<string, unknown>) => {
    newsStore.set((prev) => prev.filter((p) => p.id !== item.id));
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <NewsForm
        item={editItem}
        onSave={(data) => {
          if (mode === 'edit' && editItem) {
            newsStore.set((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
          } else {
            newsStore.set((prev) => [data as NewsItem, ...prev]);
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
      title="ニュース管理"
      description="お知らせ・業界ニュース・コラムを管理します"
      columns={columns}
      data={items as unknown as Record<string, unknown>[]}
      onAdd={() => setMode('add')}
      onEdit={(item) => { setEditItem(item as unknown as NewsItem); setMode('edit'); }}
      onDelete={handleDelete}
    />
  );
}

function NewsForm({ item, onSave, onCancel }: { item: NewsItem | null; onSave: (data: Partial<NewsItem>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    id: item?.id ?? '',
    title: item?.title ?? '',
    date: item?.date ?? '',
    category: item?.category ?? 'お知らせ',
    description: item?.description ?? '',
    body: item?.body ?? '',
  });
  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const CATEGORIES = ['お知らせ', '業界ニュース', 'コラム'];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-[#E8740C] cursor-pointer">← 戻る</button>
        <h1 className="text-2xl font-bold text-gray-900">{item ? 'ニュースを編集' : 'ニュースを新規追加'}</h1>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">基本情報</h3>
          <Field label="ID" value={form.id} onChange={(v) => set('id', v)} required />
          <Field label="タイトル" value={form.title} onChange={(v) => set('title', v)} required />
          <div className="grid grid-cols-2 gap-4">
            <DatePicker label="日付" value={form.date} onChange={(v) => set('date', v)} format="dot" />
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">カテゴリー</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <Field label="概要" value={form.description} onChange={(v) => set('description', v)} multiline rows={3} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">本文</h3>
          <RichTextEditor label="本文" value={form.body} onChange={(v) => set('body', v)} />
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" className="bg-[#E8740C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d4680b] transition cursor-pointer">{item ? '更新する' : '追加する'}</button>
          <button type="button" onClick={onCancel} className="px-6 py-3 text-gray-600 cursor-pointer">キャンセル</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required, placeholder, multiline, rows }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; multiline?: boolean; rows?: number }) {
  const cls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]";
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {multiline ? <textarea value={value} onChange={(e) => onChange(e.target.value)} className={cls + " resize-y"} rows={rows || 3} placeholder={placeholder} /> : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} required={required} placeholder={placeholder} />}
    </div>
  );
}
