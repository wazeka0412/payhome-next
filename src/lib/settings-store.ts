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

function getStore(): SettingsState {
  if (typeof window === 'undefined') {
    return { ...DEFAULTS, listeners: new Set() };
  }
  if (!(window as unknown as Record<string, unknown>).__payhomeSettings) {
    (window as unknown as Record<string, unknown>).__payhomeSettings = { ...DEFAULTS, listeners: new Set() };
  }
  return (window as unknown as Record<string, unknown>).__payhomeSettings as SettingsState;
}

function notify() {
  getStore().listeners.forEach((l) => l());
}

export const settingsStore = {
  get: () => {
    const { listeners: _, ...data } = getStore();
    return data;
  },
  update: (key: keyof Omit<SettingsState, 'listeners'>, value: string[]) => {
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
