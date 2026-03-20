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
// Generic store factory
// ---------------------------------------------------------------------------
type Listener = () => void;

function createStore<T>(initial: T[]) {
  let data = [...initial];
  const listeners = new Set<Listener>();

  const get = () => data;

  const set = (updater: T[] | ((prev: T[]) => T[])) => {
    data = typeof updater === 'function' ? (updater as (prev: T[]) => T[])(data) : [...updater];
    listeners.forEach((l) => l());
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  };

  return { get, set, subscribe };
}

// ---------------------------------------------------------------------------
// Stores
// ---------------------------------------------------------------------------
export const propertyStore  = createStore<PropertyData>(initialProperties);
export const eventStore     = createStore<EventData>(initialEvents);
export const interviewStore = createStore<Interview>(initialInterviews);
export const reviewStore    = createStore<Review>(initialReviews);
export const webinarStore   = createStore<WebinarData>(initialWebinars);
export const newsStore      = createStore<NewsItem>(initialNews);
export const builderStore   = createStore<BuilderData>(initialBuilders);
export const articleStore   = createStore<ArticleData>(initialArticles);
export const magazineStore  = createStore<MagazineIssue>(initialMagazine);

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
