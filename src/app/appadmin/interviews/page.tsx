'use client';

import { useState } from 'react';
import ContentTable from '@/components/appadmin/ContentTable';
import DatePicker from '@/components/appadmin/DatePicker';
import RichTextEditor from '@/components/appadmin/RichTextEditor';
import { useInterviews, interviewStore } from '@/lib/content-store';
import { useSettings } from '@/lib/settings-store';
import { type Interview, type InterviewBodyItem } from '@/lib/interviews';

type EditMode = 'list' | 'add' | 'edit';

export default function InterviewsAdmin() {
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<Interview | null>(null);
  const items = useInterviews();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'タイトル', render: (v: unknown) => <span className="font-medium text-gray-900 max-w-[250px] truncate block">{String(v)}</span> },
    { key: 'category', label: 'カテゴリー', render: (v: unknown) => <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{String(v)}</span> },
    { key: 'company', label: '会社名' },
    { key: 'date', label: '日付' },
  ];

  const handleDelete = (item: Record<string, unknown>) => {
    interviewStore.set((prev) => prev.filter((p) => p.id !== item.id));
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <InterviewForm
        item={editItem}
        onSave={(data) => {
          if (mode === 'edit' && editItem) {
            interviewStore.set((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
          } else {
            interviewStore.set((prev) => [data as Interview, ...prev]);
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
      title="取材・レポート管理"
      description="取材記事・レポートのコンテンツを管理します"
      columns={columns}
      data={items as unknown as Record<string, unknown>[]}
      onAdd={() => setMode('add')}
      onEdit={(item) => { setEditItem(item as unknown as Interview); setMode('edit'); }}
      onDelete={handleDelete}
    />
  );
}

// Convert InterviewBodyItem[] to HTML for the editor
function bodyToHtml(body: InterviewBodyItem[]): string {
  return body.map((item) => {
    switch (item.type) {
      case 'p': return `<p>${item.text}</p>`;
      case 'h2': return `<h2>${item.text}</h2>`;
      case 'h3': return `<h3>${item.text}</h3>`;
      case 'blockquote': return `<blockquote>${item.text}</blockquote>`;
      case 'ul': return `<ul>${item.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
      case 'ol': return `<ol>${item.items.map(i => `<li>${i}</li>`).join('')}</ol>`;
      case 'img': return `<p>[画像: ${item.alt}]</p>`;
      default: return '';
    }
  }).join('');
}

// Convert HTML back to InterviewBodyItem[]
function htmlToBody(html: string): InterviewBodyItem[] {
  if (typeof window === 'undefined' || !html.trim()) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const items: InterviewBodyItem[] = [];
  doc.body.childNodes.forEach((node) => {
    if (node.nodeType !== 1) {
      const text = node.textContent?.trim();
      if (text) items.push({ type: 'p', text });
      return;
    }
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const text = el.textContent?.trim() ?? '';
    if (tag === 'h2') items.push({ type: 'h2', text });
    else if (tag === 'h3') items.push({ type: 'h3', text });
    else if (tag === 'blockquote') items.push({ type: 'blockquote', text });
    else if (tag === 'ul') items.push({ type: 'ul', items: Array.from(el.querySelectorAll('li')).map(li => li.textContent?.trim() ?? '') });
    else if (tag === 'ol') items.push({ type: 'ol', items: Array.from(el.querySelectorAll('li')).map(li => li.textContent?.trim() ?? '') });
    else if (text) items.push({ type: 'p', text });
  });
  return items;
}

function InterviewForm({ item, onSave, onCancel }: { item: Interview | null; onSave: (data: Partial<Interview>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    id: item?.id ?? '',
    title: item?.title ?? '',
    date: item?.date ?? '',
    category: item?.category ?? '工務店取材',
    company: item?.company ?? '',
    location: item?.location ?? '',
    excerpt: item?.excerpt ?? '',
    bodyHtml: item?.body ? bodyToHtml(item.body) : '',
  });
  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const settings = useSettings();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-[#E8740C] cursor-pointer">← 戻る</button>
        <h1 className="text-2xl font-bold text-gray-900">{item ? '記事を編集' : '記事を新規追加'}</h1>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); const { bodyHtml, ...rest } = form; onSave({ ...rest, body: htmlToBody(bodyHtml) }); }} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">基本情報</h3>
          <Field label="ID" value={form.id} onChange={(v) => set('id', v)} required />
          <Field label="タイトル" value={form.title} onChange={(v) => set('title', v)} required />
          <DatePicker label="日付" value={form.date} onChange={(v) => set('date', v)} format="iso" />
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">カテゴリー</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              {settings.interviewCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Field label="会社名" value={form.company} onChange={(v) => set('company', v)} />
          <Field label="所在地" value={form.location} onChange={(v) => set('location', v)} />
          <Field label="概要" value={form.excerpt} onChange={(v) => set('excerpt', v)} multiline rows={3} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">本文</h3>
          <RichTextEditor label="本文" value={form.bodyHtml} onChange={(v) => set('bodyHtml', v)} />
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
