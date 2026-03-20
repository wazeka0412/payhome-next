'use client';

import { useState, useRef } from 'react';
import { useSettings, settingsStore } from '@/lib/settings-store';

interface OptionSectionProps {
  title: string;
  description: string;
  storeKey: 'articleTags' | 'newsCategories' | 'interviewCategories' | 'eventTypes';
  options: string[];
}

function OptionSection({ title, description, storeKey, options }: OptionSectionProps) {
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

  const remove = (idx: number) => {
    settingsStore.update(storeKey, options.filter((_, i) => i !== idx));
  };

  const startEdit = (idx: number) => {
    setEditIdx(idx);
    setEditValue(options[idx]);
  };

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
        <input
          ref={inputRef}
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="新しい項目を入力..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
        />
        <button
          type="button"
          onClick={add}
          className="bg-[#E8740C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#d4680b] transition cursor-pointer"
        >
          追加
        </button>
      </div>

      <div className="space-y-1.5">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2 group">
            {editIdx === idx ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); saveEdit(idx); } if (e.key === 'Escape') setEditIdx(null); }}
                  className="flex-1 border border-[#E8740C] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30"
                  autoFocus
                />
                <button type="button" onClick={() => saveEdit(idx)} className="text-green-600 hover:text-green-800 text-sm cursor-pointer px-2">保存</button>
                <button type="button" onClick={() => setEditIdx(null)} className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer px-2">取消</button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-1.5">{opt}</span>
                <button
                  type="button"
                  onClick={() => startEdit(idx)}
                  className="text-gray-300 hover:text-[#E8740C] text-sm cursor-pointer opacity-0 group-hover:opacity-100 transition px-1"
                  title="編集"
                >
                  編集
                </button>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-gray-300 hover:text-red-500 text-sm cursor-pointer opacity-0 group-hover:opacity-100 transition px-1"
                  title="削除"
                >
                  削除
                </button>
              </>
            )}
          </div>
        ))}
        {options.length === 0 && (
          <p className="text-xs text-gray-400 py-2">項目がありません。上のフォームから追加してください。</p>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const settings = useSettings();

  const sections: OptionSectionProps[] = [
    {
      title: 'お役立ち記事 ─ タグ',
      description: 'お役立ち記事で使用するタグの一覧を管理します',
      storeKey: 'articleTags',
      options: settings.articleTags,
    },
    {
      title: 'ニュース ─ カテゴリー',
      description: 'ニュース記事で使用するカテゴリーの一覧を管理します',
      storeKey: 'newsCategories',
      options: settings.newsCategories,
    },
    {
      title: '取材・レポート ─ カテゴリー',
      description: '取材・レポートで使用するカテゴリーの一覧を管理します',
      storeKey: 'interviewCategories',
      options: settings.interviewCategories,
    },
    {
      title: '見学会・イベント ─ 種別',
      description: '見学会・イベントで使用する種別の一覧を管理します',
      storeKey: 'eventTypes',
      options: settings.eventTypes,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">システム設定</h1>
      <p className="text-sm text-gray-500 mb-8">コンテンツ管理で使用するタグ・カテゴリー・種別などの選択肢を管理します</p>

      <div className="grid gap-6 max-w-2xl">
        {sections.map((s) => (
          <OptionSection key={s.storeKey} {...s} />
        ))}
      </div>
    </div>
  );
}
