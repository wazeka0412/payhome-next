'use client';

import { useSyncExternalStore } from 'react';

// ---------------------------------------------------------------------------
// System-wide CMS settings
// ---------------------------------------------------------------------------
export interface SnsLinks {
  youtube: string;
  instagram: string;
  twitter: string;
  line: string;
}

export interface CampaignSettings {
  enabled: boolean;
  title: string;
  description: string;
  deadline: string;
  linkUrl: string;
  benefit1Label: string;
  benefit1Amount: string;
  benefit2Label: string;
  benefit2Amount: string;
  benefit3Label: string;
  benefit3Amount: string;
}

export interface SiteStats {
  youtubeSubscribers: string;
  videoCount: string;
  partnerCount: string;
}

export interface PaginationSettings {
  newsPerPage: number;
  articlesPerPage: number;
  videosPerPage: number;
}

interface SettingsState {
  // タグ・カテゴリー・種別
  articleTags: string[];
  newsCategories: string[];
  interviewCategories: string[];
  eventTypes: string[];
  // SNSリンク
  snsLinks: SnsLinks;
  // キャンペーン
  campaign: CampaignSettings;
  // サイト統計
  siteStats: SiteStats;
  // 表示件数
  pagination: PaginationSettings;
  // エリア設定
  prefectures: string[];
  // listeners (internal)
  listeners: Set<() => void>;
}

const DEFAULTS: Omit<SettingsState, 'listeners'> = {
  articleTags: ['家づくりの基本', '資金計画', '間取り', '設備', '断熱・省エネ', '土地探し', 'メンテナンス'],
  newsCategories: ['お知らせ', '業界ニュース', 'コラム'],
  interviewCategories: ['工務店取材', 'ハウスメーカー取材', '施主インタビュー', 'トレンドレポート'],
  eventTypes: ['完成見学会', 'モデルハウス', 'オンライン見学会', 'ぺいほーむ特別見学会'],
  snsLinks: {
    youtube: 'https://www.youtube.com/@pei_home',
    instagram: 'https://www.instagram.com/pei_home_/',
    twitter: 'https://x.com/pei_home_',
    line: 'https://line.me/R/ti/p/@253gzmoh',
  },
  campaign: {
    enabled: true,
    title: '春の住宅キャンペーン',
    description: '家づくりを始める方を応援！',
    deadline: '2026-04-30',
    linkUrl: '/campaign',
    benefit1Label: 'PayPayポイント進呈（無料相談）',
    benefit1Amount: '1,000円',
    benefit2Label: 'PayPayポイント進呈（見学会参加）',
    benefit2Amount: '4,000円',
    benefit3Label: 'ギフトカード or 現金（契約）',
    benefit3Amount: '100,000円',
  },
  siteStats: {
    youtubeSubscribers: '4.28万+',
    videoCount: '257本',
    partnerCount: '100+',
  },
  pagination: {
    newsPerPage: 5,
    articlesPerPage: 6,
    videosPerPage: 6,
  },
  prefectures: ['福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄'],
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

function buildSnapshot(store: SettingsState): SettingsData {
  return {
    articleTags: store.articleTags,
    newsCategories: store.newsCategories,
    interviewCategories: store.interviewCategories,
    eventTypes: store.eventTypes,
    snsLinks: store.snsLinks,
    campaign: store.campaign,
    siteStats: store.siteStats,
    pagination: store.pagination,
    prefectures: store.prefectures,
  };
}

function notify() {
  const store = getStore();
  snapshot = buildSnapshot(store);
  store.listeners.forEach((l) => l());
}

export const settingsStore = {
  get: (): SettingsData => snapshot,
  update: <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    const store = getStore();
    (store as unknown as Record<string, unknown>)[key] = value;
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
