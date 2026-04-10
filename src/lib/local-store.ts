/**
 * ローカルJSON ファイルによる簡易フォールバックストア
 *
 * Supabase に接続できない（DNS NXDOMAIN・ネットワーク不通・プロジェクト未設定等）
 * 場合に、プロジェクトルートの .local-data/*.json にデータを保存することで
 * 開発ローカルでも F-24/F-25 等の会員機能を完全に動作させる。
 *
 * Supabase が復旧すれば自動的にそちらが優先される（supabase-wrapper 側で
 * try Supabase → catch → local-store にフォールバック）。
 */

import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

const DATA_DIR = path.join(process.cwd(), '.local-data')

type Row = Record<string, unknown>

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch {
    // ignore
  }
}

async function readTable(table: string): Promise<Row[]> {
  await ensureDir()
  const file = path.join(DATA_DIR, `${table}.json`)
  try {
    const content = await fs.readFile(file, 'utf-8')
    return JSON.parse(content) as Row[]
  } catch {
    return []
  }
}

async function writeTable(table: string, rows: Row[]): Promise<void> {
  await ensureDir()
  const file = path.join(DATA_DIR, `${table}.json`)
  await fs.writeFile(file, JSON.stringify(rows, null, 2), 'utf-8')
}

function newId(): string {
  return crypto.randomUUID()
}

function nowIso(): string {
  return new Date().toISOString()
}

/**
 * INSERT: 新規行を追加して返す
 */
export async function localInsert<T extends Row>(
  table: string,
  data: T
): Promise<T & { id: string; created_at: string; updated_at: string }> {
  const rows = await readTable(table)
  const row = {
    id: (data.id as string) || newId(),
    created_at: (data.created_at as string) || nowIso(),
    updated_at: (data.updated_at as string) || nowIso(),
    ...data,
  }
  rows.push(row)
  await writeTable(table, rows)
  return row as T & { id: string; created_at: string; updated_at: string }
}

/**
 * SELECT: 条件に一致する行を返す（単純な eq マッチのみ対応）
 */
export async function localSelect(
  table: string,
  where: Record<string, unknown> = {}
): Promise<Row[]> {
  const rows = await readTable(table)
  return rows.filter((row) =>
    Object.entries(where).every(([k, v]) => row[k] === v)
  )
}

/**
 * UPSERT: onConflict で指定したキーが一致する行があれば更新、なければ INSERT
 */
export async function localUpsert<T extends Row>(
  table: string,
  data: T,
  onConflict: string
): Promise<T & { id: string; created_at: string; updated_at: string }> {
  const rows = await readTable(table)
  const conflictValue = data[onConflict]
  const idx = rows.findIndex((r) => r[onConflict] === conflictValue)

  if (idx >= 0) {
    const existing = rows[idx]
    const updated = {
      ...existing,
      ...data,
      id: existing.id as string,
      created_at: existing.created_at as string,
      updated_at: nowIso(),
    }
    rows[idx] = updated
    await writeTable(table, rows)
    return updated as T & { id: string; created_at: string; updated_at: string }
  }

  return localInsert(table, data)
}

/**
 * UPDATE: 条件に一致する行を更新
 */
export async function localUpdate(
  table: string,
  patch: Record<string, unknown>,
  where: Record<string, unknown>
): Promise<number> {
  const rows = await readTable(table)
  let count = 0
  for (const row of rows) {
    if (Object.entries(where).every(([k, v]) => row[k] === v)) {
      Object.assign(row, patch, { updated_at: nowIso() })
      count++
    }
  }
  if (count > 0) await writeTable(table, rows)
  return count
}

/**
 * 単一行取得（maybeSingle 相当）
 */
export async function localFindOne(
  table: string,
  where: Record<string, unknown>
): Promise<Row | null> {
  const matches = await localSelect(table, where)
  return matches[0] || null
}
