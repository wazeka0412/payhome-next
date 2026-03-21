'use client';

import { useState } from 'react';
import ContentTable from '@/components/appadmin/ContentTable';
import DatePicker from '@/components/appadmin/DatePicker';
import FormField from '@/components/appadmin/FormField';
import RichTextEditor from '@/components/appadmin/RichTextEditor';
import { useBizWebinars, bizWebinarStore } from '@/lib/content-store';
import { type BizWebinar } from '@/lib/biz-webinars-data';

type EditMode = 'list' | 'add' | 'edit';

export default function BizWebinarsAdmin() {
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<BizWebinar | null>(null);
  const items = useBizWebinars();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'タイトル', render: (v: unknown) => <span className="font-medium text-gray-900 max-w-[250px] truncate block">{String(v)}</span> },
    { key: 'category', label: 'カテゴリー', render: (v: unknown) => {
      const color = String(v) === '開催予定' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500';
      return <span className={`text-xs px-2 py-0.5 rounded-full ${color}`}>{String(v)}</span>;
    }},
    { key: 'date', label: '開催日' },
  ];

  const handleDelete = (item: Record<string, unknown>) => {
    bizWebinarStore.set((prev) => prev.filter((p) => p.id !== item.id));
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <BizWebinarForm
        item={editItem}
        onSave={(data) => {
          if (mode === 'edit' && editItem) {
            bizWebinarStore.set((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
          } else {
            const newId = (data as { id?: string }).id;
            if (newId && items.some(i => i.id === newId)) {
              alert('このIDは既に使用されています。別のIDを入力してください。');
              return;
            }
            bizWebinarStore.set((prev) => [data as BizWebinar, ...prev]);
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
      title="Bizセミナー管理"
      description="工務店・ハウスメーカー向けセミナーを管理します"
      columns={columns}
      data={items as unknown as Record<string, unknown>[]}
      onAdd={() => setMode('add')}
      onEdit={(item) => { setEditItem(item as unknown as BizWebinar); setMode('edit'); }}
      onDelete={handleDelete}
    />
  );
}

function BizWebinarForm({ item, onSave, onCancel }: { item: BizWebinar | null; onSave: (data: Partial<BizWebinar>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    id: item?.id ?? '',
    title: item?.title ?? '',
    date: item?.date ?? '',
    dateLabel: item?.dateLabel ?? '',
    year: item?.year ?? '',
    category: item?.category ?? '開催予定' as '開催予定' | 'アーカイブ',
    excerpt: item?.excerpt ?? '',
    info: item?.info ?? '',
    body: item?.body ?? '',
    speakers: item?.speakers?.map(s => `${s.name}:${s.role}`).join('\n') ?? '',
    keyPoints: item?.keyPoints?.join('\n') ?? '',
    participants: item?.participants ?? '',
    schedule: item?.schedule?.join('\n') ?? '',
    status: '下書き',
    publishDate: '',
    seoTitle: item?.seoTitle ?? '',
    seoDescription: item?.seoDescription ?? '',
    ogpImage: item?.ogpImage ?? '',
  });
  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-[#E8740C] cursor-pointer">← 戻る</button>
        <h1 className="text-2xl font-bold text-gray-900">{item ? 'Bizセミナーを編集' : 'Bizセミナーを新規追加'}</h1>
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        const speakers = form.speakers.split('\n').filter(Boolean).map(line => {
          const [name, role] = line.split(':');
          return { name: name?.trim() ?? '', role: role?.trim() ?? '' };
        });
        const keyPoints = form.keyPoints.split('\n').filter(Boolean);
        const schedule = form.schedule.split('\n').filter(Boolean);
        onSave({
          ...form,
          category: form.category as '開催予定' | 'アーカイブ',
          speakers,
          keyPoints,
          schedule,
        } as unknown as Partial<BizWebinar>);
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
              <DatePicker label="公開予定日" value={form.publishDate} onChange={(v) => set('publishDate', v)} format="iso" />
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">基本情報</h3>
          <FormField label="ID" value={form.id} onChange={(v) => set('id', v)} required />
          <FormField label="タイトル" value={form.title} onChange={(v) => set('title', v)} required />
          <div className="grid grid-cols-2 gap-4">
            <DatePicker label="日付" value={form.date} onChange={(v) => set('date', v)} format="iso" />
            <FormField label="日付ラベル" value={form.dateLabel} onChange={(v) => set('dateLabel', v)} placeholder="04.15" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="年" value={form.year} onChange={(v) => set('year', v)} placeholder="2026" />
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">カテゴリー</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]">
                <option value="開催予定">開催予定</option>
                <option value="アーカイブ">アーカイブ</option>
              </select>
            </div>
          </div>
          <FormField label="概要" value={form.excerpt} onChange={(v) => set('excerpt', v)} multiline rows={3} />
          <FormField label="開催情報" value={form.info} onChange={(v) => set('info', v)} multiline rows={4} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">本文</h3>
          <RichTextEditor label="本文" value={form.body} onChange={(v) => set('body', v)} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">詳細情報</h3>
          <FormField label="登壇者（1行1人、名前:役職）" value={form.speakers} onChange={(v) => set('speakers', v)} multiline rows={3} placeholder="村田 峻之介:ぺいほーむ編集長" />
          <FormField label="キーポイント（1行1項目）" value={form.keyPoints} onChange={(v) => set('keyPoints', v)} multiline rows={3} />
          <FormField label="参加者数" value={form.participants} onChange={(v) => set('participants', v)} placeholder="参加者96名" />
          <FormField label="スケジュール（1行1項目）" value={form.schedule} onChange={(v) => set('schedule', v)} multiline rows={4} />
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
