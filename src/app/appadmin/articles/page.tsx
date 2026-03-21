'use client';

import { useState } from 'react';
import ContentTable from '@/components/appadmin/ContentTable';
import DatePicker from '@/components/appadmin/DatePicker';
import FormField from '@/components/appadmin/FormField';
import ImageUploader from '@/components/appadmin/ImageUploader';
import RichTextEditor from '@/components/appadmin/RichTextEditor';
import { useArticles, articleStore } from '@/lib/content-store';
import { useSettings } from '@/lib/settings-store';
import { type ArticleData } from '@/lib/articles-data';

type EditMode = 'list' | 'add' | 'edit';

export default function ArticlesAdmin() {
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<ArticleData | null>(null);
  const items = useArticles();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'タイトル', render: (v: unknown) => <span className="font-medium text-gray-900 max-w-[300px] truncate block">{String(v)}</span> },
    { key: 'tag', label: 'タグ', render: (v: unknown) => <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">{String(v)}</span> },
    { key: 'date', label: '日付' },
  ];

  const handleDelete = (item: Record<string, unknown>) => {
    articleStore.set(prev => prev.filter(p => p.id !== item.id));
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <ArticleForm
        item={editItem}
        onSave={(data) => {
          if (mode === 'edit' && editItem) {
            articleStore.set(prev => prev.map(p => p.id === editItem.id ? { ...p, ...data } : p));
          } else {
            const newId = (data as { id?: string }).id;
            if (newId && items.some(i => i.id === newId)) {
              alert('このIDは既に使用されています。別のIDを入力してください。');
              return;
            }
            articleStore.set(prev => [data as ArticleData, ...prev]);
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
      title="お役立ち記事管理"
      description="お役立ち記事のコンテンツを管理します"
      columns={columns}
      data={items as unknown as Record<string, unknown>[]}
      onAdd={() => setMode('add')}
      onEdit={(item) => { setEditItem(item as unknown as ArticleData); setMode('edit'); }}
      onDelete={handleDelete}
    />
  );
}

function ArticleForm({ item, onSave, onCancel }: { item: ArticleData | null; onSave: (data: Partial<ArticleData>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    id: item?.id ?? '',
    title: item?.title ?? '',
    tag: item?.tag ?? '',
    date: item?.date ?? '',
    description: item?.description ?? '',
    body: item?.body ?? '',
    status: (item as unknown as Record<string, unknown>)?.status as string ?? '下書き',
    publishDate: (item as unknown as Record<string, unknown>)?.publishDate as string ?? '',
    seoTitle: (item as unknown as Record<string, unknown>)?.seoTitle as string ?? '',
    seoDescription: (item as unknown as Record<string, unknown>)?.seoDescription as string ?? '',
    ogpImage: (item as unknown as Record<string, unknown>)?.ogpImage as string ?? '',
  });
  const [thumbnail, setThumbnail] = useState<string[]>(item?.thumbnail ? [item.thumbnail] : []);
  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const settings = useSettings();
  const cls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]";

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-[#E8740C] cursor-pointer">← 戻る</button>
        <h1 className="text-2xl font-bold text-gray-900">{item ? '記事を編集' : '記事を新規追加'}</h1>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, thumbnail: thumbnail[0] || '' }); }} className="space-y-6 max-w-3xl">
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
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">ID<span className="text-red-500 ml-0.5">*</span></label>
            <input type="text" value={form.id} onChange={(e) => set('id', e.target.value)} className={cls} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">タイトル<span className="text-red-500 ml-0.5">*</span></label>
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} className={cls} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">タグ</label>
            <select value={form.tag} onChange={(e) => set('tag', e.target.value)} className={cls}>
              <option value="">選択してください</option>
              {settings.articleTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <DatePicker label="日付" value={form.date} onChange={(v) => set('date', v)} format="iso" />
          <ImageUploader label="サムネイル画像" images={thumbnail} onChange={setThumbnail} multiple={false} />
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">概要</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} className={cls + " resize-y"} rows={3} placeholder="記事の概要を入力" />
          </div>
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
