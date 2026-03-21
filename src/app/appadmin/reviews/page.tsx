'use client';

import { useState } from 'react';
import ContentTable from '@/components/appadmin/ContentTable';
import DatePicker from '@/components/appadmin/DatePicker';
import RichTextEditor from '@/components/appadmin/RichTextEditor';
import FormField from '@/components/appadmin/FormField';
import { useReviews, reviewStore, useBuilders } from '@/lib/content-store';
import { type Review } from '@/lib/reviews-data';

type EditMode = 'list' | 'add' | 'edit';

export default function ReviewsAdmin() {
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<Review | null>(null);
  const items = useReviews();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'お名前' },
    { key: 'area', label: 'エリア' },
    { key: 'builder', label: '工務店' },
    { key: 'propertyType', label: '住宅タイプ' },
    { key: 'budget', label: '予算' },
  ];

  const handleDelete = (item: Record<string, unknown>) => {
    reviewStore.set((prev) => prev.filter((p) => p.id !== item.id));
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <ReviewForm
        item={editItem}
        onSave={(data) => {
          if (mode === 'edit' && editItem) {
            reviewStore.set((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
          } else {
            const newId = (data as { id?: string }).id;
            if (newId && items.some(i => i.id === newId)) {
              alert('このIDは既に使用されています。別のIDを入力してください。');
              return;
            }
            reviewStore.set((prev) => [data as Review, ...prev]);
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
    status: (item as unknown as Record<string, unknown>)?.status as string ?? '下書き',
    publishDate: (item as unknown as Record<string, unknown>)?.publishDate as string ?? '',
    seoTitle: (item as unknown as Record<string, unknown>)?.seoTitle as string ?? '',
    seoDescription: (item as unknown as Record<string, unknown>)?.seoDescription as string ?? '',
    ogpImage: (item as unknown as Record<string, unknown>)?.ogpImage as string ?? '',
  });
  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));
  const builders = useBuilders();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-[#E8740C] cursor-pointer">← 戻る</button>
        <h1 className="text-2xl font-bold text-gray-900">{item ? 'レビューを編集' : 'レビューを新規追加'}</h1>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">公開設定</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">ステータス</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]">
                <option value="下書き">下書き</option>
                <option value="レビュー待ち">レビュー待ち</option>
                <option value="公開予定">公開予定</option>
                <option value="公開中">公開中</option>
                <option value="非公開">非公開</option>
              </select>
            </div>
            {form.status === '公開予定' && (
              <DatePicker label="公開予定日" value={form.publishDate} onChange={(v) => set('publishDate', v)} format="iso" />
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">お客様情報</h3>
          <FormField label="ID" value={form.id} onChange={(v) => set('id', v)} required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="お名前" value={form.name} onChange={(v) => set('name', v)} required />
            <FormField label="エリア" value={form.area} onChange={(v) => set('area', v)} />
            <FormField label="年代" value={form.age} onChange={(v) => set('age', v)} />
            <FormField label="家族構成" value={form.family} onChange={(v) => set('family', v)} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">住宅情報</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="住宅タイプ" value={form.propertyType} onChange={(v) => set('propertyType', v)} />
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">工務店</label>
              <select value={form.builder} onChange={(e) => set('builder', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]">
                <option value="">選択してください</option>
                {builders.map(b => <option key={b.id} value={b.name}>{b.name}（{b.area}）</option>)}
              </select>
            </div>
            <FormField label="予算" value={form.budget} onChange={(v) => set('budget', v)} />
            <FormField label="建築期間" value={form.duration} onChange={(v) => set('duration', v)} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">コンテンツ</h3>
          <FormField label="一言コメント" value={form.text} onChange={(v) => set('text', v)} multiline rows={2} />
          <RichTextEditor label="本文" value={form.body} onChange={(v) => set('body', v)} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">SEO設定</h3>
          <FormField label="SEOタイトル" value={form.seoTitle} onChange={(v) => set('seoTitle', v)} placeholder="ページタイトル（空欄時は記事タイトルを使用）" />
          <FormField label="メタディスクリプション" value={form.seoDescription} onChange={(v) => set('seoDescription', v)} multiline rows={2} placeholder="メタディスクリプション（空欄時は概要を使用）" />
          <FormField label="OGP画像URL" value={form.ogpImage} onChange={(v) => set('ogpImage', v)} placeholder="OGP画像URL（空欄時はサムネイルを使用）" />
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" className="bg-[#E8740C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d4680b] transition cursor-pointer">{item ? '更新する' : '追加する'}</button>
          <button type="button" onClick={onCancel} className="px-6 py-3 text-gray-600 cursor-pointer">キャンセル</button>
        </div>
      </form>
    </div>
  );
}
