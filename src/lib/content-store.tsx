'use client';

import { useSyncExternalStore } from 'react';
import { properties as initialProperties, type PropertyData } from './properties';
import { events as initialEvents, type EventData } from './events-data';
import { interviews as initialInterviews, type Interview } from './interviews';
import { reviews as initialReviews, type Review } from './reviews-data';
import { webinars as initialWebinars, type WebinarData } from './webinars-data';
import { newsItems as initialNews, type NewsItem } from './news-data';
import { builders as initialBuilders, type BuilderData } from './builders-data';
import { articles as initialArticles, type ArticleData } from './articles-data';
import { magazineIssues as initialMagazine, type MagazineIssue } from './magazine-data';

// ---------------------------------------------------------------------------
// Window global to ensure singleton state across Next.js route chunks
// ---------------------------------------------------------------------------
interface StoreState<T> {
  data: T[];
  listeners: Set<() => void>;
}

interface GlobalStores {
  [key: string]: StoreState<unknown>;
}

declare global {
  interface Window {
    __payhomeStores?: GlobalStores;
  }
}

function getGlobalStore<T>(key: string, initial: T[]): StoreState<T> {
  if (typeof window === 'undefined') {
    // SSR fallback — each request gets a fresh copy
    return { data: [...initial], listeners: new Set() };
  }
  if (!window.__payhomeStores) {
    window.__payhomeStores = {};
  }
  if (!window.__payhomeStores[key]) {
    window.__payhomeStores[key] = { data: [...initial], listeners: new Set() };
  }
  return window.__payhomeStores[key] as StoreState<T>;
}

// ---------------------------------------------------------------------------
// Generic store factory — backed by window global
// ---------------------------------------------------------------------------
function createStore<T>(key: string, initial: T[]) {
  const get = (): T[] => getGlobalStore<T>(key, initial).data;

  const set = (updater: T[] | ((prev: T[]) => T[])) => {
    const store = getGlobalStore<T>(key, initial);
    store.data = typeof updater === 'function'
      ? (updater as (prev: T[]) => T[])(store.data)
      : [...updater];
    store.listeners.forEach((l) => l());
  };

  const subscribe = (listener: () => void) => {
    const store = getGlobalStore<T>(key, initial);
    store.listeners.add(listener);
    return () => { store.listeners.delete(listener); };
  };

  return { get, set, subscribe };
}

// ---------------------------------------------------------------------------
// Stores
// ---------------------------------------------------------------------------
export const propertyStore  = createStore<PropertyData>('properties', initialProperties);
export const eventStore     = createStore<EventData>('events', initialEvents);
export const interviewStore = createStore<Interview>('interviews', initialInterviews);
export const reviewStore    = createStore<Review>('reviews', initialReviews);
export const webinarStore   = createStore<WebinarData>('webinars', initialWebinars);
export const newsStore      = createStore<NewsItem>('news', initialNews);
export const builderStore   = createStore<BuilderData>('builders', initialBuilders);
export const articleStore   = createStore<ArticleData>('articles', initialArticles);
export const magazineStore  = createStore<MagazineIssue>('magazine', initialMagazine);

// ---------------------------------------------------------------------------
// React hooks  — each returns the live array and re-renders on change
// ---------------------------------------------------------------------------
export function useProperties()  { return useSyncExternalStore(propertyStore.subscribe,  propertyStore.get,  () => initialProperties); }
export function useEvents()      { return useSyncExternalStore(eventStore.subscribe,     eventStore.get,     () => initialEvents); }
export function useInterviews()  { return useSyncExternalStore(interviewStore.subscribe, interviewStore.get, () => initialInterviews); }
export function useReviews()     { return useSyncExternalStore(reviewStore.subscribe,    reviewStore.get,    () => initialReviews); }
export function useWebinars()    { return useSyncExternalStore(webinarStore.subscribe,   webinarStore.get,   () => initialWebinars); }
export function useNews()        { return useSyncExternalStore(newsStore.subscribe,      newsStore.get,      () => initialNews); }
export function useBuilders()    { return useSyncExternalStore(builderStore.subscribe,   builderStore.get,   () => initialBuilders); }
export function useArticles()    { return useSyncExternalStore(articleStore.subscribe,   articleStore.get,   () => initialArticles); }
export function useMagazine()    { return useSyncExternalStore(magazineStore.subscribe,  magazineStore.get,  () => initialMagazine); }
