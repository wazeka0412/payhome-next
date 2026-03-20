'use client';

import { useSyncExternalStore } from 'react';

// ---------------------------------------------------------------------------
// System-wide editable options for tags, categories, and types
// ---------------------------------------------------------------------------
interface SettingsState {
  articleTags: string[];
  newsCategories: string[];
  interviewCategories: string[];
  eventTypes: string[];
  listeners: Set<() => void>;
}

const DEFAULTS: Omit<SettingsState, 'listeners'> = {
  articleTags: ['家づくりの基本', '資金計画', '間取り', '設備', '断熱・省エネ', '土地探し', 'メンテナンス'],
  newsCategories: ['お知らせ', '業界ニュース', 'コラム'],
  interviewCategories: ['工務店取材', 'ハウスメーカー取材', '施主インタビュー', 'トレンドレポート'],
  eventTypes: ['完成見学会', 'モデルハウス', 'オンライン見学会', 'ぺいほーむ特別見学会'],
};

type SettingsData = Omit<SettingsState, 'listeners'>;

// Cached snapshot — only replaced when data changes
let snapshot: SettingsData = { ...DEFAULTS };

function getStore(): SettingsState {
  if (typeof window === 'undefined') {
    return { ...DEFAULTS, listeners: new Set() };
  }
  if (!(window as unknown as Record<string, unknown>).__payhomeSettings) {
    (window as unknown as Record<string, unknown>).__payhomeSettings = { ...DEFAULTS, listeners: new Set() };
    snapshot = { ...DEFAULTS };
  }
  return (window as unknown as Record<string, unknown>).__payhomeSettings as SettingsState;
}

function notify() {
  const store = getStore();
  snapshot = {
    articleTags: store.articleTags,
    newsCategories: store.newsCategories,
    interviewCategories: store.interviewCategories,
    eventTypes: store.eventTypes,
  };
  store.listeners.forEach((l) => l());
}

export const settingsStore = {
  get: (): SettingsData => snapshot,
  update: (key: keyof SettingsData, value: string[]) => {
    const store = getStore();
    store[key] = value;
    notify();
  },
  subscribe: (listener: () => void) => {
    const store = getStore();
    store.listeners.add(listener);
    return () => { store.listeners.delete(listener); };
  },
};

export function useSettings() {
  return useSyncExternalStore(
    settingsStore.subscribe,
    settingsStore.get,
    () => DEFAULTS,
  );
}
