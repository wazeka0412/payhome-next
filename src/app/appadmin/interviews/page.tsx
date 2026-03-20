'use client';

import { useState } from 'react';
import ContentTable from '@/components/appadmin/ContentTable';
import DatePicker from '@/components/appadmin/DatePicker';
import { useInterviews, interviewStore } from '@/lib/content-store';
import { type Interview } from '@/lib/interviews';

type EditMode = 'list' | 'add' | 'edit';

export default function InterviewsAdmin() {
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<Interview | null>(null);
  const items = useInterviews();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'タイトル', render: (v: unknown) => <span className="font-medium text-gray-900 max-w-[250px] truncate block">{String(v)}</span> },
    { key: 'category', label: 'カテゴリー', render: (v: unknown) => <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{String(v)}</span> },
    { key: 'company', label: '会社名' },
    { key: 'date', label: '日付' },
  ];

  const handleDelete = (item: Record<string, unknown>) => {
    interviewStore.set((prev) => prev.filter((p) => p.id !== item.id));
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <InterviewForm
        item={editItem}
        onSave={(data) => {
          if (mode === 'edit' && editItem) {
            interviewStore.set((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
          } else {
            interviewStore.set((prev) => [data as Interview, ...prev]);
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
      title="取材・レポート管理"
      description="取材記事・レポートのコンテンツを管理します"
      columns={columns}
      data={items as unknown as Record<string, unknown>[]}
      onAdd={() => setMode('add')}
      onEdit={(item) => { setEditItem(item as unknown as Interview); setMode('edit'); }}
      onDelete={handleDelete}
    />
  );
}

function InterviewForm({ item, onSave, onCancel }: { item: Interview | null; onSave: (data: Partial<Interview>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    id: item?.id ?? '',
    title: item?.title ?? '',
    date: item?.date ?? '',
    category: item?.category ?? '工務店取材',
    company: item?.company ?? '',
    location: item?.location ?? '',
    excerpt: item?.excerpt ?? '',
  });
  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const CATEGORIES = ['工務店取材', 'ハウスメーカー取材', '施主インタビュー', 'トレンドレポート'];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-[#E8740C] cursor-pointer">← 戻る</button>
        <h1 className="text-2xl font-bold text-gray-900">{item ? '記事を編集' : '記事を新規追加'}</h1>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, body: item?.body ?? [] }); }} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <Field label="ID" value={form.id} onChange={(v) => set('id', v)} required />
          <Field label="タイトル" value={form.title} onChange={(v) => set('title', v)} required />
          <DatePicker label="日付" value={form.date} onChange={(v) => set('date', v)} format="iso" />
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">カテゴリー</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Field label="会社名" value={form.company} onChange={(v) => set('company', v)} />
          <Field label="所在地" value={form.location} onChange={(v) => set('location', v)} />
          <Field label="概要" value={form.excerpt} onChange={(v) => set('excerpt', v)} multiline rows={3} />
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
