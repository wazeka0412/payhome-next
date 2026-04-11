'use client'

import { useEffect, useState, Fragment } from 'react'

export type BuilderFieldType = 'text' | 'textarea' | 'number' | 'select' | 'tags' | 'date' | 'image'

export interface BuilderFieldDef {
  key: string
  label: string
  type: BuilderFieldType
  options?: string[]
  inList?: boolean
  hideInForm?: boolean
  format?: (v: unknown, row: Record<string, unknown>) => string
  className?: string
  placeholder?: string
}

interface Props {
  endpoint: string
  title: string
  description?: string
  fields: BuilderFieldDef[]
  /** e.g. builderId or builderName — used to filter both list and new row */
  builderMatchKey: string
  builderMatchValue: string | undefined
  newDefaults?: Record<string, unknown>
  searchKeys?: string[]
}

type Row = Record<string, unknown> & { id: string }

export default function BuilderContentTable({
  endpoint,
  title,
  description,
  fields,
  builderMatchKey,
  builderMatchValue,
  newDefaults = {},
  searchKeys = ['title'],
}: Props) {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<Record<string, unknown>>({})
  const [creating, setCreating] = useState(false)
  const [createDraft, setCreateDraft] = useState<Record<string, unknown>>(newDefaults)
  const [saving, setSaving] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const fetchRows = () => {
    if (!builderMatchValue) {
      setRows([])
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(endpoint)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? (data as Row[]) : []
        setRows(list.filter((row) => row[builderMatchKey] === builderMatchValue))
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchRows()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, builderMatchKey, builderMatchValue])

  const startEdit = (row: Row) => {
    setEditingId(row.id)
    setEditDraft({ ...row })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditDraft({})
  }

  const saveEdit = async () => {
    if (!editingId) return
    setSaving(true)
    try {
      const res = await fetch(`${endpoint}/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editDraft),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      cancelEdit()
      fetchRows()
    } catch (err) {
      alert('保存に失敗しました: ' + (err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleCreate = async () => {
    if (!builderMatchValue) return
    setSaving(true)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...createDraft,
          [builderMatchKey]: builderMatchValue,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`)
      }
      setCreating(false)
      setCreateDraft(newDefaults)
      fetchRows()
    } catch (err) {
      alert('作成に失敗しました: ' + (err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setConfirmDeleteId(null)
      fetchRows()
    } catch (err) {
      alert('削除に失敗しました: ' + (err as Error).message)
    }
  }

  const listFields = fields.filter((f) => f.inList === true)
  const formFields = fields.filter((f) => !f.hideInForm)

  const filtered = search
    ? rows.filter((r) =>
        searchKeys.some((k) => {
          const v = r[k]
          return typeof v === 'string' && v.toLowerCase().includes(search.toLowerCase())
        })
      )
    : rows

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-[#E8740C] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm">データ取得エラー: {error}</div>
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          <p className="text-xs text-gray-400 mt-0.5">全 {rows.length} 件（表示中: {filtered.length} 件）</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-40 focus:outline-none focus:border-[#E8740C] focus:ring-1 focus:ring-[#E8740C]"
          />
          <button
            type="button"
            onClick={() => { setCreating(true); setCreateDraft({ ...newDefaults }) }}
            className="px-4 py-2 bg-[#E8740C] text-white rounded-lg text-sm font-bold hover:bg-[#D4660A] transition"
          >
            新規追加
          </button>
        </div>
      </div>

      {creating && (
        <div className="bg-white rounded-xl border border-orange-200 p-5 mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-4">新規作成</h2>
          <FieldForm fields={formFields} draft={createDraft} setDraft={setCreateDraft} />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => { setCreating(false); setCreateDraft(newDefaults) }}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={saving}
              className="px-4 py-2 text-sm bg-[#E8740C] text-white rounded-lg hover:bg-[#D4660A] disabled:opacity-50"
            >
              {saving ? '保存中...' : '作成'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 text-gray-500 font-medium w-8"></th>
                {listFields.map((f) => (
                  <th key={f.key} className={`text-left py-3 px-4 text-gray-500 font-medium ${f.className ?? ''}`}>
                    {f.label}
                  </th>
                ))}
                <th className="text-right py-3 px-4 text-gray-500 font-medium w-28">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const isEditing = editingId === row.id
                return (
                  <Fragment key={row.id}>
                    <tr className="border-b border-gray-50 hover:bg-orange-50/50 transition">
                      <td className="py-3 px-4 text-gray-400">
                        <button type="button" onClick={() => (isEditing ? cancelEdit() : startEdit(row))} className="cursor-pointer">
                          <span className={`inline-block transition-transform ${isEditing ? 'rotate-90' : ''}`}>&#9654;</span>
                        </button>
                      </td>
                      {listFields.map((f) => {
                        const v = row[f.key]
                        const display = f.format
                          ? f.format(v, row)
                          : Array.isArray(v)
                            ? v.join(', ')
                            : v == null
                              ? ''
                              : String(v)
                        return (
                          <td key={f.key} className={`py-3 px-4 text-gray-700 ${f.className ?? ''}`}>
                            <span className="line-clamp-1">{display}</span>
                          </td>
                        )
                      })}
                      <td className="py-3 px-4 text-right">
                        <button type="button" onClick={() => (isEditing ? cancelEdit() : startEdit(row))} className="text-xs text-[#E8740C] font-bold mr-3 hover:underline">
                          {isEditing ? '閉じる' : '編集'}
                        </button>
                        <button type="button" onClick={() => setConfirmDeleteId(row.id)} className="text-xs text-red-500 font-bold hover:underline">
                          削除
                        </button>
                      </td>
                    </tr>
                    {isEditing && (
                      <tr className="bg-orange-50/30">
                        <td colSpan={listFields.length + 2} className="px-6 py-5">
                          <FieldForm fields={formFields} draft={editDraft} setDraft={setEditDraft} />
                          <div className="flex justify-end gap-2 mt-4">
                            <button type="button" onClick={cancelEdit} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                              キャンセル
                            </button>
                            <button type="button" onClick={saveEdit} disabled={saving} className="px-4 py-2 text-sm bg-[#E8740C] text-white rounded-lg hover:bg-[#D4660A] disabled:opacity-50">
                              {saving ? '保存中...' : '保存'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                    {confirmDeleteId === row.id && (
                      <tr className="bg-red-50/40">
                        <td colSpan={listFields.length + 2} className="px-6 py-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-red-700">削除してよろしいですか？</span>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => setConfirmDeleteId(null)} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg">
                                キャンセル
                              </button>
                              <button type="button" onClick={() => handleDelete(row.id)} className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600">
                                削除する
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">データがありません。「新規追加」から登録してください。</div>
        )}
      </div>
    </div>
  )
}

function FieldForm({
  fields,
  draft,
  setDraft,
}: {
  fields: BuilderFieldDef[]
  draft: Record<string, unknown>
  setDraft: (d: Record<string, unknown>) => void
}) {
  const set = (key: string, value: unknown) => setDraft({ ...draft, [key]: value })
  const baseClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E8740C] focus:ring-1 focus:ring-[#E8740C]'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((f) => {
        const value = draft[f.key] ?? ''
        return (
          <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
            <label className="text-xs text-gray-500 block mb-1">{f.label}</label>
            {f.type === 'text' && (
              <input type="text" value={String(value)} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} className={baseClass} />
            )}
            {f.type === 'date' && (
              <input type="text" value={String(value)} placeholder="YYYY-MM-DD" onChange={(e) => set(f.key, e.target.value)} className={baseClass} />
            )}
            {f.type === 'number' && (
              <input type="number" value={Number(value) || 0} onChange={(e) => set(f.key, Number(e.target.value))} className={baseClass} />
            )}
            {f.type === 'textarea' && (
              <textarea value={String(value)} rows={3} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} className={`${baseClass} resize-y`} />
            )}
            {f.type === 'select' && (
              <select value={String(value)} onChange={(e) => set(f.key, e.target.value)} className={baseClass}>
                <option value="">— 選択 —</option>
                {(f.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
            {f.type === 'tags' && (
              <input
                type="text"
                value={Array.isArray(value) ? (value as string[]).join(', ') : String(value)}
                placeholder="カンマ区切り"
                onChange={(e) => set(f.key, e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                className={baseClass}
              />
            )}
            {f.type === 'image' && (
              <input type="text" value={String(value)} placeholder="/images/xxx.png" onChange={(e) => set(f.key, e.target.value)} className={baseClass} />
            )}
          </div>
        )
      })}
    </div>
  )
}
