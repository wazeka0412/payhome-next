'use client';

import { useState } from 'react';
import ContentTable from '@/components/appadmin/ContentTable';
import { events, type EventData } from '@/lib/events-data';

type EditMode = 'list' | 'add' | 'edit';

export default function EventsAdmin() {
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<EventData | null>(null);
  const [items, setItems] = useState<EventData[]>(events);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'タイトル', render: (v: unknown) => <span className="font-medium text-gray-900 max-w-[200px] truncate block">{String(v)}</span> },
    { key: 'typeLabel', label: '種別', render: (v: unknown) => <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{String(v)}</span> },
    { key: 'builder', label: '工務店' },
    { key: 'startDate', label: '開始日' },
    { key: 'prefecture', label: 'エリア' },
  ];

  const handleDelete = (item: Record<string, unknown>) => {
    setItems((prev) => prev.filter((p) => p.id !== item.id));
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <EventForm
        item={editItem}
        onSave={(data) => {
          if (mode === 'edit' && editItem) {
            setItems((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
          } else {
            setItems((prev) => [data as EventData, ...prev]);
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
      title="見学会・イベント管理"
      description="見学会・イベントのコンテンツを管理します"
      columns={columns}
      data={items as unknown as Record<string, unknown>[]}
      onAdd={() => setMode('add')}
      onEdit={(item) => { setEditItem(item as unknown as EventData); setMode('edit'); }}
      onDelete={handleDelete}
    />
  );
}

function EventForm({ item, onSave, onCancel }: { item: EventData | null; onSave: (data: Partial<EventData>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    id: item?.id ?? '',
    title: item?.title ?? '',
    type: item?.type ?? 'completion',
    typeLabel: item?.typeLabel ?? '完成見学会',
    description: item?.description ?? '',
    startDate: item?.startDate ?? '',
    endDate: item?.endDate ?? '',
    location: item?.location ?? '',
    address: item?.address ?? '',
    prefecture: item?.prefecture ?? '',
    builder: item?.builder ?? '',
    capacity: String(item?.capacity ?? ''),
    images: item?.images?.join('\n') ?? '',
    highlights: item?.highlights?.join('\n') ?? '',
    features: item?.features?.map(f => `${f.label}:${f.value}`).join('\n') ?? '',
  });

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      capacity: Number(form.capacity) || 0,
      images: form.images.split('\n').filter(Boolean),
      highlights: form.highlights.split('\n').filter(Boolean),
      features: form.features.split('\n').filter(Boolean).map(line => {
        const [label, value] = line.split(':');
        return { label: label?.trim() ?? '', value: value?.trim() ?? '' };
      }),
    } as unknown as Partial<EventData>);
  };

  const TYPE_OPTIONS = [
    { value: 'completion', label: '完成見学会' },
    { value: 'model', label: 'モデルハウス' },
    { value: 'online', label: 'オンライン見学会' },
    { value: 'special', label: 'ぺいほーむ特別見学会' },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-[#E8740C] cursor-pointer">← 戻る</button>
        <h1 className="text-2xl font-bold text-gray-900">{item ? 'イベントを編集' : 'イベントを新規追加'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">基本情報</h3>
          <Field label="ID" value={form.id} onChange={(v) => set('id', v)} required />
          <Field label="タイトル" value={form.title} onChange={(v) => set('title', v)} required />
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">種別</label>
            <select value={form.type} onChange={(e) => { set('type', e.target.value); set('typeLabel', TYPE_OPTIONS.find(o => o.value === e.target.value)?.label ?? ''); }} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <Field label="説明文" value={form.description} onChange={(v) => set('description', v)} multiline rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="開始日" value={form.startDate} onChange={(v) => set('startDate', v)} placeholder="YYYY-MM-DD" required />
            <Field label="終了日" value={form.endDate} onChange={(v) => set('endDate', v)} placeholder="YYYY-MM-DD" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="場所" value={form.location} onChange={(v) => set('location', v)} />
            <Field label="都道府県" value={form.prefecture} onChange={(v) => set('prefecture', v)} />
          </div>
          <Field label="住所" value={form.address} onChange={(v) => set('address', v)} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="工務店" value={form.builder} onChange={(v) => set('builder', v)} />
            <Field label="定員" value={form.capacity} onChange={(v) => set('capacity', v)} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">コンテンツ</h3>
          <Field label="画像パス（1行1パス）" value={form.images} onChange={(v) => set('images', v)} multiline rows={3} />
          <Field label="ハイライト（1行1項目）" value={form.highlights} onChange={(v) => set('highlights', v)} multiline rows={4} />
          <Field label="特徴（1行1項目、ラベル:値）" value={form.features} onChange={(v) => set('features', v)} multiline rows={4} placeholder="延床面積:28坪" />
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
