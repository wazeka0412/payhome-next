/**
 * Content store — generic CRUD layer for managed content types.
 *
 * Each content type has:
 *   1. A static seed array exported from src/lib/{type}-data.ts (the canonical
 *      ship-with-the-app fixture).
 *   2. A local-store table with the same name (in .local-data/{type}.json) that
 *      holds admin overrides — edits, additions, and tombstones for deletes.
 *
 * The merge rules:
 *   - Local rows whose `id` matches a seed row override that seed row.
 *   - Local rows with `_deleted: true` hide the matching seed row.
 *   - Local rows with no matching seed row are admin-created entries.
 *
 * This way, admin CRUD works against the local-store immediately (no Supabase
 * needed in dev) while the static data files remain the canonical source for
 * what gets shipped to production. When Supabase comes online, the same
 * content-store API can be re-pointed to read/write Supabase tables instead.
 */

import {
  localSelect,
  localInsert,
  localUpdate,
  localDelete,
  localFindOne,
} from './local-store'

type Row = Record<string, unknown> & { id: string }

interface OverrideRow extends Row {
  _deleted?: boolean
}

/**
 * Merge static seed rows with local-store overrides.
 */
export async function listContent<T extends { id: string }>(
  table: string,
  seed: readonly T[]
): Promise<T[]> {
  const overrideRows = (await localSelect(table, {})) as OverrideRow[]
  const overrideMap = new Map<string, OverrideRow>()
  for (const ov of overrideRows) {
    overrideMap.set(String(ov.id), ov)
  }

  const result: T[] = []

  for (const seedRow of seed) {
    const ov = overrideMap.get(seedRow.id)
    if (ov) {
      if (ov._deleted) {
        // Hidden by tombstone
      } else {
        const merged = { ...seedRow, ...ov } as T
        result.push(merged)
      }
      overrideMap.delete(seedRow.id)
    } else {
      result.push(seedRow)
    }
  }

  // Local-only new rows (not in seed)
  for (const ov of overrideMap.values()) {
    if (!ov._deleted) {
      result.push(ov as unknown as T)
    }
  }

  return result
}

/**
 * Read a single content row by id, applying overrides.
 */
export async function getContentById<T extends { id: string }>(
  table: string,
  id: string,
  seed: readonly T[]
): Promise<T | null> {
  const all = await listContent(table, seed)
  return all.find((r) => r.id === id) ?? null
}

/**
 * Create a new content row. Returns the inserted row.
 */
export async function createContent<T extends Record<string, unknown>>(
  table: string,
  data: T
): Promise<T & { id: string; created_at: string; updated_at: string }> {
  return localInsert(table, data)
}

/**
 * Update a content row by id. If the id refers to a static seed row that
 * has no override yet, the patch is stored as a fresh override row carrying
 * the original id (so future merges produce the patched result).
 */
export async function updateContent<T extends Record<string, unknown>>(
  table: string,
  id: string,
  patch: T
): Promise<Record<string, unknown> | null> {
  const existing = await localFindOne(table, { id })
  if (existing) {
    await localUpdate(table, patch, { id })
    return (await localFindOne(table, { id })) as Record<string, unknown> | null
  }
  // No local override yet — create one keyed on the seed id
  const inserted = await localInsert(table, { ...patch, id })
  return inserted as unknown as Record<string, unknown>
}

/**
 * Delete a content row by id. For static seed rows we leave a tombstone so
 * subsequent merges hide them; for local-only rows we hard-delete.
 */
export async function deleteContent(
  table: string,
  id: string,
  seedIds: readonly string[]
): Promise<boolean> {
  const isSeed = seedIds.includes(id)
  if (isSeed) {
    // Replace any prior override with a tombstone
    await localDelete(table, { id })
    await localInsert(table, { id, _deleted: true })
    return true
  }
  const removed = await localDelete(table, { id })
  return removed > 0
}
