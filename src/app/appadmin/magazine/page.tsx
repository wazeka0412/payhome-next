'use client';

import { useState } from 'react';
import ContentTable from '@/components/appadmin/ContentTable';
import ImageUploader from '@/components/appadmin/ImageUploader';
import DatePicker from '@/components/appadmin/DatePicker';
import FormField from '@/components/appadmin/FormField';
import { useMagazine, magazineStore } from '@/lib/content-store';
import { type MagazineIssue } from '@/lib/magazine-data';

type EditMode = 'list' | 'add' | 'edit';

export default function MagazineAdmin() {
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<MagazineIssue | null>(null);
  const items = useMagazine();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'issue', label: '号', render: (v: unknown) => <span className="font-medium text-gray-900">{String(v)}</span> },
    { key: 'title', label: 'タイトル', render: (v: unknown) => <span className="max-w-[250px] truncate block">{String(v)}</span> },
    { key: 'publishDate', label: '発行日' },
    { key: 'isLatest', label: 'ステータス', render: (v: unknown) => v ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">最新号</span> : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">バックナンバー</span> },
  ];

  const handleDelete = (item: Record<string, unknown>) => {
    magazineStore.set(prev => prev.filter(p => p.id !== item.id));
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <MagazineForm
        item={editItem}
        onSave={(data) => {
          if (mode === 'edit' && editItem) {
            magazineStore.set(prev => prev.map(p => p.id === editItem.id ? { ...p, ...data } : p));
          } else {
            const newId = (data as { id?: string }).id;
            if (newId && items.some(i => i.id === newId)) {
              alert('このIDは既に使用されています。別のIDを入力してください。');
              return;
            }
            magazineStore.set(prev => [data as MagazineIssue, ...prev]);
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
      title="月刊ぺいほーむ管理"
      description="月刊ぺいほーむの発行号を管理します"
      columns={columns}
      data={items as unknown as Record<string, unknown>[]}
      onAdd={() => setMode('add')}
      onEdit={(item) => { setEditItem(item as unknown as MagazineIssue); setMode('edit'); }}
      onDelete={handleDelete}
    />
  );
}

function MagazineForm({ item, onSave, onCancel }: { item: MagazineIssue | null; onSave: (data: Partial<MagazineIssue>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    id: item?.id ?? '',
    issue: item?.issue ?? '',
    title: item?.title ?? '',
    description: item?.description ?? '',
    publishDate: item?.publishDate ?? '',
    contents: item?.contents?.join('\n') ?? '',
    isLatest: item?.isLatest ?? false,
    status: (item as unknown as Record<string, unknown>)?.status as string ?? '下書き',
    scheduledPublishDate: (item as unknown as Record<string, unknown>)?.scheduledPublishDate as string ?? '',
    seoTitle: (item as unknown as Record<string, unknown>)?.seoTitle as string ?? '',
    seoDescription: (item as unknown as Record<string, unknown>)?.seoDescription as string ?? '',
    ogpImage: (item as unknown as Record<string, unknown>)?.ogpImage as string ?? '',
  });
  const [coverImages, setCoverImages] = useState<string[]>(item?.coverImage ? [item.coverImage] : []);
  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-[#E8740C] cursor-pointer">← 戻る</button>
        <h1 className="text-2xl font-bold text-gray-900">{item ? '号を編集' : '新しい号を追加'}</h1>
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSave({
          ...form,
          coverImage: coverImages[0] ?? '',
          contents: (form.contents || '').split('\n').filter(Boolean),
        });
      }} className="space-y-6 max-w-3xl">
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
              <DatePicker label="公開予定日" value={form.scheduledPublishDate} onChange={(v) => set('scheduledPublishDate', v)} format="iso" />
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">基本情報</h3>
          <FormField label="ID" value={form.id} onChange={(v) => set('id', v)} required placeholder="mag-2026-04" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="号" value={form.issue} onChange={(v) => set('issue', v)} required placeholder="2026年4月号" />
            <DatePicker label="発行日" value={form.publishDate} onChange={(v) => set('publishDate', v)} format="dot" />
          </div>
          <FormField label="特集タイトル" value={form.title} onChange={(v) => set('title', v)} required />
          <FormField label="概要" value={form.description} onChange={(v) => set('description', v)} multiline rows={2} />
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isLatest}
                onChange={(e) => setForm((p) => ({ ...p, isLatest: e.target.checked }))}
                className="rounded border-gray-300 text-[#E8740C] focus:ring-[#E8740C]"
              />
              <span className="text-sm text-gray-700">最新号として表示</span>
            </label>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">表紙画像</h3>
          <ImageUploader
            label="表紙画像"
            images={coverImages}
            onChange={setCoverImages}
            multiple={false}
          />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">目次</h3>
          <FormField label="掲載内容（1行1項目）" value={form.contents} onChange={(v) => set('contents', v)} multiline rows={6} />
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
