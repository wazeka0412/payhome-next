/**
 * 工務店比較リスト（クライアントサイド state）
 *
 * v4.0 では会員ベースの比較リストを localStorage で管理する。
 * 最大3社まで追加可能。比較ページ /builders/compare で並べて表示する。
 *
 * Phase 2 以降で comparisons テーブルにDB永続化する予定。
 */

const STORAGE_KEY = 'payhome_compare_builders';
const MAX_COMPARE = 3;

export interface CompareEntry {
  id: string;
  addedAt: number;
}

function read(): CompareEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(list: CompareEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('payhome:compare-changed'));
  } catch {
    /* ignore quota errors */
  }
}

export function getCompareList(): CompareEntry[] {
  return read();
}

export function isInCompareList(builderId: string): boolean {
  return read().some((e) => e.id === builderId);
}

export function getCompareCount(): number {
  return read().length;
}

/**
 * @returns 'added' | 'removed' | 'limit'
 */
export function toggleCompare(builderId: string): 'added' | 'removed' | 'limit' {
  const list = read();
  const existing = list.findIndex((e) => e.id === builderId);
  if (existing >= 0) {
    list.splice(existing, 1);
    write(list);
    return 'removed';
  }
  if (list.length >= MAX_COMPARE) {
    return 'limit';
  }
  list.push({ id: builderId, addedAt: Date.now() });
  write(list);
  return 'added';
}

export function clearCompareList(): void {
  write([]);
}

export function removeFromCompareList(builderId: string): void {
  write(read().filter((e) => e.id !== builderId));
}

export const COMPARE_LIMIT = MAX_COMPARE;
