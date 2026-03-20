'use client';

import { useState } from 'react';
import ContentTable from '@/components/appadmin/ContentTable';
import { useBuilders, builderStore } from '@/lib/content-store';
import { type BuilderData } from '@/lib/builders-data';

type EditMode = 'list' | 'add' | 'edit';

export default function BuildersAdmin() {
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<BuilderData | null>(null);
  const items = useBuilders();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '工務店名', render: (v: unknown) => <span className="font-medium text-gray-900">{String(v)}</span> },
    { key: 'area', label: '都道府県' },
    { key: 'region', label: '地域' },
    { key: 'specialties', label: '得意分野', render: (v: unknown) => (
      <div className="flex flex-wrap gap-1">
        {(v as string[])?.map((s) => <span key={s} className="text-[0.65rem] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">{s}</span>)}
      </div>
    )},
    { key: 'annualBuilds', label: '年間棟数', render: (v: unknown) => <span>{String(v)}棟</span> },
  ];

  const handleDelete = (item: Record<string, unknown>) => {
    builderStore.set(prev => prev.filter(p => p.id !== item.id));
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <BuilderForm
        item={editItem}
        onSave={(data) => {
          if (mode === 'edit' && editItem) {
            builderStore.set(prev => prev.map(p => p.id === editItem.id ? { ...p, ...data } : p));
          } else {
            builderStore.set(prev => [data as BuilderData, ...prev]);
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
      title="工務店一覧管理"
      description="工務店の情報を管理します"
      columns={columns}
      data={items as unknown as Record<string, unknown>[]}
      onAdd={() => setMode('add')}
      onEdit={(item) => { setEditItem(item as unknown as BuilderData); setMode('edit'); }}
      onDelete={handleDelete}
    />
  );
}

function BuilderForm({ item, onSave, onCancel }: { item: BuilderData | null; onSave: (data: Partial<BuilderData>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    id: item?.id ?? '',
    name: item?.name ?? '',
    area: item?.area ?? '',
    region: item?.region ?? '',
    specialties: item?.specialties?.join(', ') ?? '',
    annualBuilds: String(item?.annualBuilds ?? ''),
  });
  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-[#E8740C] cursor-pointer">← 戻る</button>
        <h1 className="text-2xl font-bold text-gray-900">{item ? '工務店を編集' : '工務店を新規追加'}</h1>
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...form, specialties: form.specialties.split(',').map(s => s.trim()).filter(Boolean), annualBuilds: Number(form.annualBuilds) || 0 });
      }} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <Field label="ID" value={form.id} onChange={(v) => set('id', v)} required />
          <Field label="工務店名" value={form.name} onChange={(v) => set('name', v)} required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="都道府県" value={form.area} onChange={(v) => set('area', v)} />
            <Field label="地域" value={form.region} onChange={(v) => set('region', v)} />
          </div>
          <Field label="得意分野（カンマ区切り）" value={form.specialties} onChange={(v) => set('specialties', v)} placeholder="平屋, ZEH, デザイン" />
          <Field label="年間施工棟数" value={form.annualBuilds} onChange={(v) => set('annualBuilds', v)} />
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" className="bg-[#E8740C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d4680b] transition cursor-pointer">{item ? '更新する' : '追加する'}</button>
          <button type="button" onClick={onCancel} className="px-6 py-3 text-gray-600 cursor-pointer">キャンセル</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required, placeholder }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" required={required} placeholder={placeholder} />
    </div>
  );
}
