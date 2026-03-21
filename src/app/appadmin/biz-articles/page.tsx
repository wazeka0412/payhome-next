'use client';

import { useState } from 'react';
import ContentTable from '@/components/appadmin/ContentTable';
import FormField from '@/components/appadmin/FormField';
import RichTextEditor from '@/components/appadmin/RichTextEditor';
import DatePicker from '@/components/appadmin/DatePicker';
import { useBizArticles, bizArticleStore } from '@/lib/content-store';
import { type BizArticleItem } from '@/lib/biz-articles-data';

type EditMode = 'list' | 'add' | 'edit';

export default function BizArticlesAdmin() {
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<BizArticleItem | null>(null);
  const items = useBizArticles();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'タイトル', render: (v: unknown) => <span className="font-medium text-gray-900 max-w-[300px] truncate block">{String(v)}</span> },
    { key: 'category', label: 'カテゴリー', render: (v: unknown) => {
      const colors: Record<string, string> = {
        'YouTube活用': 'bg-red-100 text-red-700',
        'SNS運用': 'bg-blue-100 text-blue-700',
        'WEB集客': 'bg-green-100 text-green-700',
        'ブランディング': 'bg-purple-100 text-purple-700',
      };
      return <span className={`text-xs px-2 py-0.5 rounded-full ${colors[String(v)] ?? 'bg-gray-100 text-gray-600'}`}>{String(v)}</span>;
    }},
  ];

  const handleDelete = (item: Record<string, unknown>) => {
    bizArticleStore.set((prev) => prev.filter((p) => p.id !== item.id));
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <BizArticleForm
        item={editItem}
        onSave={(data) => {
          if (mode === 'edit' && editItem) {
            bizArticleStore.set((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
          } else {
            const newId = (data as { id?: string }).id;
            if (newId && items.some(i => i.id === newId)) {
              alert('このIDは既に使用されています。別のIDを入力してください。');
              return;
            }
            bizArticleStore.set((prev) => [data as BizArticleItem, ...prev]);
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
      title="Bizお役立ち記事管理"
      description="工務店・ハウスメーカー向けお役立ち記事を管理します"
      columns={columns}
      data={items as unknown as Record<string, unknown>[]}
      onAdd={() => setMode('add')}
      onEdit={(item) => { setEditItem(item as unknown as BizArticleItem); setMode('edit'); }}
      onDelete={handleDelete}
    />
  );
}

function BizArticleForm({ item, onSave, onCancel }: { item: BizArticleItem | null; onSave: (data: Partial<BizArticleItem>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    id: item?.id ?? '',
    title: item?.title ?? '',
    category: item?.category ?? 'YouTube活用',
    excerpt: item?.excerpt ?? '',
    body: item?.body ?? '',
    status: item?.status ?? '下書き',
    publishDate: item?.publishDate ?? '',
    seoTitle: item?.seoTitle ?? '',
    seoDescription: item?.seoDescription ?? '',
    ogpImage: item?.ogpImage ?? '',
  });
  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const categories = ['YouTube活用', 'SNS運用', 'WEB集客', 'ブランディング'];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-[#E8740C] cursor-pointer">← 戻る</button>
        <h1 className="text-2xl font-bold text-gray-900">{item ? 'Biz記事を編集' : 'Biz記事を新規追加'}</h1>
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
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">基本情報</h3>
          <FormField label="ID" value={form.id} onChange={(v) => set('id', v)} required />
          <FormField label="タイトル" value={form.title} onChange={(v) => set('title', v)} required />
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">カテゴリー</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <FormField label="概要" value={form.excerpt} onChange={(v) => set('excerpt', v)} multiline rows={3} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">本文</h3>
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
