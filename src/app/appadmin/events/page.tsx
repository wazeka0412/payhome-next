'use client';

import { useState } from 'react';
import ContentTable from '@/components/appadmin/ContentTable';
import ImageUploader from '@/components/appadmin/ImageUploader';
import DatePicker from '@/components/appadmin/DatePicker';
import FormField from '@/components/appadmin/FormField';
import { useEvents, eventStore } from '@/lib/content-store';
import { useSettings } from '@/lib/settings-store';
import { type EventData } from '@/lib/events-data';

type EditMode = 'list' | 'add' | 'edit';

const TYPE_LABEL_TO_SLUG: Record<string, string> = {
  '完成見学会': 'completion',
  'モデルハウス': 'model',
  'オンライン見学会': 'online',
  'ぺいほーむ特別見学会': 'special',
};

export default function EventsAdmin() {
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<EventData | null>(null);
  const items = useEvents();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'タイトル', render: (v: unknown) => <span className="font-medium text-gray-900 max-w-[200px] truncate block">{String(v)}</span> },
    { key: 'typeLabel', label: '種別', render: (v: unknown) => <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{String(v)}</span> },
    { key: 'builder', label: '工務店' },
    { key: 'startDate', label: '開始日' },
    { key: 'prefecture', label: 'エリア' },
  ];

  const handleDelete = (item: Record<string, unknown>) => {
    eventStore.set((prev) => prev.filter((p) => p.id !== item.id));
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <EventForm
        item={editItem}
        onSave={(data) => {
          if (mode === 'edit' && editItem) {
            eventStore.set((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
          } else {
            const newId = (data as { id?: string }).id;
            if (newId && items.some(i => i.id === newId)) {
              alert('このIDは既に使用されています。別のIDを入力してください。');
              return;
            }
            eventStore.set((prev) => [data as EventData, ...prev]);
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
    highlights: item?.highlights?.join('\n') ?? '',
    features: item?.features?.map(f => `${f.label}:${f.value}`).join('\n') ?? '',
  });

  const [images, setImages] = useState<string[]>(item?.images ?? []);
  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      capacity: Number(form.capacity) || 0,
      images,
      highlights: form.highlights.split('\n').filter(Boolean),
      features: form.features.split('\n').filter(Boolean).map(line => {
        const [label, value] = line.split(':');
        return { label: label?.trim() ?? '', value: value?.trim() ?? '' };
      }),
    } as unknown as Partial<EventData>);
  };

  const settings = useSettings();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-[#E8740C] cursor-pointer">← 戻る</button>
        <h1 className="text-2xl font-bold text-gray-900">{item ? 'イベントを編集' : 'イベントを新規追加'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">基本情報</h3>
          <FormField label="ID" value={form.id} onChange={(v) => set('id', v)} required />
          <FormField label="タイトル" value={form.title} onChange={(v) => set('title', v)} required />
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">種別</label>
            <select value={form.typeLabel} onChange={(e) => { set('typeLabel', e.target.value); set('type', TYPE_LABEL_TO_SLUG[e.target.value] ?? e.target.value); }} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">選択してください</option>
              {settings.eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <FormField label="説明文" value={form.description} onChange={(v) => set('description', v)} multiline rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <DatePicker label="開始日" value={form.startDate} onChange={(v) => set('startDate', v)} format="iso" />
            <DatePicker label="終了日" value={form.endDate} onChange={(v) => set('endDate', v)} format="iso" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="場所" value={form.location} onChange={(v) => set('location', v)} />
            <FormField label="都道府県" value={form.prefecture} onChange={(v) => set('prefecture', v)} />
          </div>
          <FormField label="住所" value={form.address} onChange={(v) => set('address', v)} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="工務店" value={form.builder} onChange={(v) => set('builder', v)} />
            <FormField label="定員" value={form.capacity} onChange={(v) => set('capacity', v)} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">コンテンツ</h3>
          <ImageUploader label="画像" images={images} onChange={setImages} />
          <FormField label="ハイライト（1行1項目）" value={form.highlights} onChange={(v) => set('highlights', v)} multiline rows={4} />
          <FormField label="特徴（1行1項目、ラベル:値）" value={form.features} onChange={(v) => set('features', v)} multiline rows={4} placeholder="延床面積:28坪" />
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" className="bg-[#E8740C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d4680b] transition cursor-pointer">{item ? '更新する' : '追加する'}</button>
          <button type="button" onClick={onCancel} className="px-6 py-3 text-gray-600 cursor-pointer">キャンセル</button>
        </div>
      </form>
    </div>
  );
}
