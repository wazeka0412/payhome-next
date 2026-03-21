'use client';

import { useState } from 'react';
import ContentTable from '@/components/appadmin/ContentTable';
import DatePicker from '@/components/appadmin/DatePicker';
import FormField from '@/components/appadmin/FormField';
import { useWebinars, webinarStore } from '@/lib/content-store';
import { type WebinarData } from '@/lib/webinars-data';

type EditMode = 'list' | 'add' | 'edit';

export default function WebinarsAdmin() {
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<WebinarData | null>(null);
  const items = useWebinars();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'タイトル', render: (v: unknown) => <span className="font-medium text-gray-900 max-w-[250px] truncate block">{String(v)}</span> },
    { key: 'category', label: 'カテゴリー', render: (v: unknown) => <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{String(v)}</span> },
    { key: 'dateFormatted', label: '開催日' },
    { key: 'status', label: 'ステータス', render: (v: unknown) => <span className={`text-xs px-2 py-0.5 rounded-full ${String(v) === '受付中' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{String(v)}</span> },
  ];

  const handleDelete = (item: Record<string, unknown>) => {
    webinarStore.set((prev) => prev.filter((p) => p.id !== item.id));
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <WebinarForm
        item={editItem}
        onSave={(data) => {
          if (mode === 'edit' && editItem) {
            webinarStore.set((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
          } else {
            const newId = (data as { id?: string }).id;
            if (newId && items.some(i => i.id === newId)) {
              alert('このIDは既に使用されています。別のIDを入力してください。');
              return;
            }
            webinarStore.set((prev) => [data as WebinarData, ...prev]);
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
      title="ウェビナー管理"
      description="ウェビナー・セミナーのコンテンツを管理します"
      columns={columns}
      data={items as unknown as Record<string, unknown>[]}
      onAdd={() => setMode('add')}
      onEdit={(item) => { setEditItem(item as unknown as WebinarData); setMode('edit'); }}
      onDelete={handleDelete}
    />
  );
}

function WebinarForm({ item, onSave, onCancel }: { item: WebinarData | null; onSave: (data: Partial<WebinarData>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    id: item?.id ?? '',
    title: item?.title ?? '',
    shortTitle: item?.shortTitle ?? '',
    date: item?.date ?? '',
    dateFormatted: item?.dateFormatted ?? '',
    month: item?.month ?? '',
    day: item?.day ?? '',
    category: item?.category ?? '',
    isUpcoming: item?.isUpcoming ?? true,
    status: item?.status ?? '受付中',
    info: item?.info ?? '',
    description: item?.description ?? '',
    body: item?.body ?? '',
    datetime: item?.eventDetails?.datetime ?? '',
    format: item?.eventDetails?.format ?? '',
    fee: item?.eventDetails?.fee ?? '',
    capacity: item?.eventDetails?.capacity ?? '',
    target: item?.eventDetails?.target ?? '',
    recommendations: item?.recommendations?.join('\n') ?? '',
    notice: item?.notice ?? '',
    publishStatus: (item as unknown as Record<string, unknown>)?.publishStatus as string ?? '下書き',
    publishDate: (item as unknown as Record<string, unknown>)?.publishDate as string ?? '',
    seoTitle: (item as unknown as Record<string, unknown>)?.seoTitle as string ?? '',
    seoDescription: (item as unknown as Record<string, unknown>)?.seoDescription as string ?? '',
    ogpImage: (item as unknown as Record<string, unknown>)?.ogpImage as string ?? '',
  });
  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-[#E8740C] cursor-pointer">← 戻る</button>
        <h1 className="text-2xl font-bold text-gray-900">{item ? 'ウェビナーを編集' : 'ウェビナーを新規追加'}</h1>
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSave({
          ...form,
          isUpcoming: form.isUpcoming,
          eventDetails: { datetime: form.datetime, format: form.format, fee: form.fee, capacity: form.capacity, target: form.target },
          recommendations: form.recommendations.split('\n').filter(Boolean),
          speakers: item?.speakers ?? [],
          schedule: item?.schedule ?? [],
          keyPoints: item?.keyPoints ?? [],
          testimonials: item?.testimonials ?? [],
        } as unknown as Partial<WebinarData>);
      }} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">公開設定</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">公開ステータス</label>
              <select value={form.publishStatus} onChange={(e) => set('publishStatus', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]">
                <option value="下書き">下書き</option>
                <option value="レビュー待ち">レビュー待ち</option>
                <option value="公開予定">公開予定</option>
                <option value="公開中">公開中</option>
                <option value="非公開">非公開</option>
              </select>
            </div>
            {form.publishStatus === '公開予定' && (
              <DatePicker label="公開予定日" value={form.publishDate} onChange={(v) => set('publishDate', v)} format="iso" />
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">基本情報</h3>
          <FormField label="ID" value={form.id} onChange={(v) => set('id', v)} required />
          <FormField label="タイトル" value={form.title} onChange={(v) => set('title', v)} required />
          <FormField label="短縮タイトル" value={form.shortTitle} onChange={(v) => set('shortTitle', v)} />
          <div className="grid grid-cols-2 gap-4">
            <DatePicker label="日付" value={form.date} onChange={(v) => set('date', v)} format="iso" />
            <FormField label="表示日付" value={form.dateFormatted} onChange={(v) => set('dateFormatted', v)} placeholder="2026年4月15日（水）" />
            <FormField label="カテゴリー" value={form.category} onChange={(v) => set('category', v)} />
            <FormField label="ステータス" value={form.status} onChange={(v) => set('status', v)} />
          </div>
          <FormField label="概要" value={form.info} onChange={(v) => set('info', v)} multiline rows={2} />
          <FormField label="説明文" value={form.description} onChange={(v) => set('description', v)} multiline rows={3} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">開催詳細</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="日時" value={form.datetime} onChange={(v) => set('datetime', v)} />
            <FormField label="形式" value={form.format} onChange={(v) => set('format', v)} />
            <FormField label="参加費" value={form.fee} onChange={(v) => set('fee', v)} />
            <FormField label="定員" value={form.capacity} onChange={(v) => set('capacity', v)} />
          </div>
          <FormField label="対象者" value={form.target} onChange={(v) => set('target', v)} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">コンテンツ</h3>
          <FormField label="本文（HTML）" value={form.body} onChange={(v) => set('body', v)} multiline rows={6} />
          <FormField label="おすすめポイント（1行1項目）" value={form.recommendations} onChange={(v) => set('recommendations', v)} multiline rows={4} />
          <FormField label="注意事項" value={form.notice} onChange={(v) => set('notice', v)} multiline rows={3} />
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
