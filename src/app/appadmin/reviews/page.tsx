'use client';

import { useState } from 'react';
import ContentTable from '@/components/appadmin/ContentTable';
import { reviews, type Review } from '@/lib/reviews-data';

type EditMode = 'list' | 'add' | 'edit';

export default function ReviewsAdmin() {
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<Review | null>(null);
  const [items, setItems] = useState<Review[]>(reviews);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'お名前' },
    { key: 'area', label: 'エリア' },
    { key: 'builder', label: '工務店' },
    { key: 'propertyType', label: '住宅タイプ' },
    { key: 'budget', label: '予算' },
  ];

  const handleDelete = (item: Record<string, unknown>) => {
    setItems((prev) => prev.filter((p) => p.id !== item.id));
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <ReviewForm
        item={editItem}
        onSave={(data) => {
          if (mode === 'edit' && editItem) {
            setItems((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
          } else {
            setItems((prev) => [data as Review, ...prev]);
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
      title="お客様の声管理"
      description="お客様の声・レビューを管理します"
      columns={columns}
      data={items as unknown as Record<string, unknown>[]}
      onAdd={() => setMode('add')}
      onEdit={(item) => { setEditItem(item as unknown as Review); setMode('edit'); }}
      onDelete={handleDelete}
    />
  );
}

function ReviewForm({ item, onSave, onCancel }: { item: Review | null; onSave: (data: Partial<Review>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    id: item?.id ?? '',
    name: item?.name ?? '',
    area: item?.area ?? '',
    age: item?.age ?? '',
    family: item?.family ?? '',
    text: item?.text ?? '',
    propertyType: item?.propertyType ?? '',
    builder: item?.builder ?? '',
    budget: item?.budget ?? '',
    duration: item?.duration ?? '',
    body: item?.body ?? '',
  });
  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-[#E8740C] cursor-pointer">← 戻る</button>
        <h1 className="text-2xl font-bold text-gray-900">{item ? 'レビューを編集' : 'レビューを新規追加'}</h1>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">お客様情報</h3>
          <Field label="ID" value={form.id} onChange={(v) => set('id', v)} required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="お名前" value={form.name} onChange={(v) => set('name', v)} required />
            <Field label="エリア" value={form.area} onChange={(v) => set('area', v)} />
            <Field label="年代" value={form.age} onChange={(v) => set('age', v)} />
            <Field label="家族構成" value={form.family} onChange={(v) => set('family', v)} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">住宅情報</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="住宅タイプ" value={form.propertyType} onChange={(v) => set('propertyType', v)} />
            <Field label="工務店" value={form.builder} onChange={(v) => set('builder', v)} />
            <Field label="予算" value={form.budget} onChange={(v) => set('budget', v)} />
            <Field label="建築期間" value={form.duration} onChange={(v) => set('duration', v)} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">コンテンツ</h3>
          <Field label="一言コメント" value={form.text} onChange={(v) => set('text', v)} multiline rows={2} />
          <Field label="本文（HTML）" value={form.body} onChange={(v) => set('body', v)} multiline rows={8} />
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
