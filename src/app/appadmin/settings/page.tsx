'use client';

import { useState, useRef } from 'react';
import { useSettings, settingsStore, type SnsLinks, type CampaignSettings, type SiteStats, type PaginationSettings } from '@/lib/settings-store';

const CLS = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]';

// ---------------------------------------------------------------------------
// List option editor (tags, categories, types, prefectures)
// ---------------------------------------------------------------------------
function OptionSection({ title, description, storeKey, options }: {
  title: string; description: string;
  storeKey: 'articleTags' | 'newsCategories' | 'interviewCategories' | 'eventTypes' | 'prefectures';
  options: string[];
}) {
  const [newValue, setNewValue] = useState('');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const add = () => {
    const trimmed = newValue.trim();
    if (!trimmed || options.includes(trimmed)) return;
    settingsStore.update(storeKey, [...options, trimmed]);
    setNewValue('');
    inputRef.current?.focus();
  };
  const remove = (idx: number) => settingsStore.update(storeKey, options.filter((_, i) => i !== idx));
  const startEdit = (idx: number) => { setEditIdx(idx); setEditValue(options[idx]); };
  const saveEdit = (idx: number) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    settingsStore.update(storeKey, options.map((o, i) => i === idx ? trimmed : o));
    setEditIdx(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-400 mb-4">{description}</p>
      <div className="flex gap-2 mb-4">
        <input ref={inputRef} type="text" value={newValue} onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="新しい項目を入力..." className={CLS + ' flex-1'} />
        <button type="button" onClick={add}
          className="bg-[#E8740C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#d4680b] transition cursor-pointer">追加</button>
      </div>
      <div className="space-y-1.5">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2 group">
            {editIdx === idx ? (
              <>
                <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); saveEdit(idx); } if (e.key === 'Escape') setEditIdx(null); }}
                  className="flex-1 border border-[#E8740C] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30" autoFocus />
                <button type="button" onClick={() => saveEdit(idx)} className="text-green-600 hover:text-green-800 text-sm cursor-pointer px-2">保存</button>
                <button type="button" onClick={() => setEditIdx(null)} className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer px-2">取消</button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-1.5">{opt}</span>
                <button type="button" onClick={() => startEdit(idx)}
                  className="text-gray-300 hover:text-[#E8740C] text-sm cursor-pointer opacity-0 group-hover:opacity-100 transition px-1">編集</button>
                <button type="button" onClick={() => remove(idx)}
                  className="text-gray-300 hover:text-red-500 text-sm cursor-pointer opacity-0 group-hover:opacity-100 transition px-1">削除</button>
              </>
            )}
          </div>
        ))}
        {options.length === 0 && <p className="text-xs text-gray-400 py-2">項目がありません</p>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Key-value field editor
// ---------------------------------------------------------------------------
function FieldRow({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={CLS} placeholder={placeholder} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// SNS Links Section
// ---------------------------------------------------------------------------
function SnsSection({ snsLinks }: { snsLinks: SnsLinks }) {
  const update = (key: keyof SnsLinks, value: string) => {
    settingsStore.update('snsLinks', { ...snsLinks, [key]: value });
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
      <h3 className="text-sm font-bold text-gray-900 mb-1">SNSリンク</h3>
      <p className="text-xs text-gray-400 mb-4">サイト全体で使用するSNSアカウントのURLを設定します</p>
      <FieldRow label="YouTube" value={snsLinks.youtube} onChange={(v) => update('youtube', v)} placeholder="https://www.youtube.com/@..." />
      <FieldRow label="Instagram" value={snsLinks.instagram} onChange={(v) => update('instagram', v)} placeholder="https://www.instagram.com/..." />
      <FieldRow label="X (Twitter)" value={snsLinks.twitter} onChange={(v) => update('twitter', v)} placeholder="https://x.com/..." />
      <FieldRow label="LINE" value={snsLinks.line} onChange={(v) => update('line', v)} placeholder="https://line.me/R/ti/p/..." />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Campaign Section
// ---------------------------------------------------------------------------
function CampaignSection({ campaign }: { campaign: CampaignSettings }) {
  const update = (key: keyof CampaignSettings, value: string | boolean) => {
    settingsStore.update('campaign', { ...campaign, [key]: value });
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-gray-900">キャンペーン設定</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={campaign.enabled} onChange={(e) => update('enabled', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#E8740C] focus:ring-[#E8740C]" />
          <span className="text-xs text-gray-500">{campaign.enabled ? '有効' : '無効'}</span>
        </label>
      </div>
      <p className="text-xs text-gray-400 mb-4">トップページのキャンペーンバナーとセクションの設定</p>
      <FieldRow label="キャンペーン名" value={campaign.title} onChange={(v) => update('title', v)} />
      <FieldRow label="説明文" value={campaign.description} onChange={(v) => update('description', v)} />
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="終了日" value={campaign.deadline} onChange={(v) => update('deadline', v)} type="date" />
        <FieldRow label="リンク先" value={campaign.linkUrl} onChange={(v) => update('linkUrl', v)} placeholder="/campaign" />
      </div>
      <div className="border-t border-gray-100 pt-3 mt-3">
        <p className="text-xs font-medium text-gray-500 mb-2">特典設定</p>
        <div className="grid grid-cols-2 gap-3">
          <FieldRow label="特典1 内容" value={campaign.benefit1Label} onChange={(v) => update('benefit1Label', v)} />
          <FieldRow label="特典1 金額" value={campaign.benefit1Amount} onChange={(v) => update('benefit1Amount', v)} />
          <FieldRow label="特典2 内容" value={campaign.benefit2Label} onChange={(v) => update('benefit2Label', v)} />
          <FieldRow label="特典2 金額" value={campaign.benefit2Amount} onChange={(v) => update('benefit2Amount', v)} />
          <FieldRow label="特典3 内容" value={campaign.benefit3Label} onChange={(v) => update('benefit3Label', v)} />
          <FieldRow label="特典3 金額" value={campaign.benefit3Amount} onChange={(v) => update('benefit3Amount', v)} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Site Stats Section
// ---------------------------------------------------------------------------
function StatsSection({ siteStats }: { siteStats: SiteStats }) {
  const update = (key: keyof SiteStats, value: string) => {
    settingsStore.update('siteStats', { ...siteStats, [key]: value });
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
      <h3 className="text-sm font-bold text-gray-900 mb-1">サイト統計情報</h3>
      <p className="text-xs text-gray-400 mb-4">トップページやAboutページに表示される数値を設定します</p>
      <div className="grid grid-cols-3 gap-3">
        <FieldRow label="YouTube登録者数" value={siteStats.youtubeSubscribers} onChange={(v) => update('youtubeSubscribers', v)} placeholder="4.28万+" />
        <FieldRow label="公開動画数" value={siteStats.videoCount} onChange={(v) => update('videoCount', v)} placeholder="257本" />
        <FieldRow label="取材企業数" value={siteStats.partnerCount} onChange={(v) => update('partnerCount', v)} placeholder="100+" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pagination Section
// ---------------------------------------------------------------------------
function PaginationSection({ pagination }: { pagination: PaginationSettings }) {
  const update = (key: keyof PaginationSettings, value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1) return;
    settingsStore.update('pagination', { ...pagination, [key]: num });
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
      <h3 className="text-sm font-bold text-gray-900 mb-1">表示件数設定</h3>
      <p className="text-xs text-gray-400 mb-4">各一覧ページで1ページあたりに表示するコンテンツ数を設定します</p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">ニュース</label>
          <input type="number" min={1} max={50} value={pagination.newsPerPage} onChange={(e) => update('newsPerPage', e.target.value)} className={CLS} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">お役立ち記事</label>
          <input type="number" min={1} max={50} value={pagination.articlesPerPage} onChange={(e) => update('articlesPerPage', e.target.value)} className={CLS} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">動画コンテンツ</label>
          <input type="number" min={1} max={50} value={pagination.videosPerPage} onChange={(e) => update('videosPerPage', e.target.value)} className={CLS} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Settings Page
// ---------------------------------------------------------------------------
export default function SettingsPage() {
  const settings = useSettings();

  const listSections: { title: string; description: string; storeKey: 'articleTags' | 'newsCategories' | 'interviewCategories' | 'eventTypes'; options: string[] }[] = [
    { title: 'お役立ち記事 ─ タグ', description: 'お役立ち記事で使用するタグの一覧', storeKey: 'articleTags', options: settings.articleTags },
    { title: 'ニュース ─ カテゴリー', description: 'ニュース記事で使用するカテゴリーの一覧', storeKey: 'newsCategories', options: settings.newsCategories },
    { title: '取材・レポート ─ カテゴリー', description: '取材・レポートで使用するカテゴリーの一覧', storeKey: 'interviewCategories', options: settings.interviewCategories },
    { title: '見学会・イベント ─ 種別', description: '見学会・イベントで使用する種別の一覧', storeKey: 'eventTypes', options: settings.eventTypes },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">システム設定</h1>
      <p className="text-sm text-gray-500 mb-8">サイト全体の設定とコンテンツ管理オプションを管理します</p>

      <div className="grid gap-8 max-w-3xl">
        {/* サイト設定 */}
        <div>
          <h2 className="text-xs font-bold text-[#E8740C] uppercase tracking-wider mb-4">サイト設定</h2>
          <div className="grid gap-6">
            <SnsSection snsLinks={settings.snsLinks} />
            <StatsSection siteStats={settings.siteStats} />
            <PaginationSection pagination={settings.pagination} />
          </div>
        </div>

        {/* キャンペーン */}
        <div>
          <h2 className="text-xs font-bold text-[#E8740C] uppercase tracking-wider mb-4">キャンペーン</h2>
          <CampaignSection campaign={settings.campaign} />
        </div>

        {/* タグ・カテゴリー管理 */}
        <div>
          <h2 className="text-xs font-bold text-[#E8740C] uppercase tracking-wider mb-4">タグ・カテゴリー管理</h2>
          <div className="grid gap-6">
            {listSections.map((s) => <OptionSection key={s.storeKey} {...s} />)}
          </div>
        </div>

        {/* エリア設定 */}
        <div>
          <h2 className="text-xs font-bold text-[#E8740C] uppercase tracking-wider mb-4">エリア設定</h2>
          <OptionSection title="対応都道府県" description="サイト内のエリアフィルターで表示する都道府県の一覧" storeKey="prefectures" options={settings.prefectures} />
        </div>
      </div>
    </div>
  );
}
