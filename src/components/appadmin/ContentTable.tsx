'use client';

import { useState, useMemo } from 'react';

interface Column {
  key: string;
  label: string;
  render?: (value: unknown, item: Record<string, unknown>) => React.ReactNode;
}

interface ContentTableProps {
  title: string;
  description: string;
  columns: Column[];
  data: Record<string, unknown>[];
  idKey?: string;
  onAdd?: () => void;
  onEdit?: (item: Record<string, unknown>) => void;
  onDelete?: (item: Record<string, unknown>) => void;
  addLabel?: string;
}

export default function ContentTable({
  title,
  description,
  columns,
  data,
  idKey = 'id',
  onAdd,
  onEdit,
  onDelete,
  addLabel = '新規追加',
}: ContentTableProps) {
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);

  const filtered = useMemo(() => search
    ? data.filter((item) =>
        columns.some((col) => {
          const val = item[col.key];
          return typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase());
        })
      )
    : data, [data, search, columns]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{description}（{data.length} 件）</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="検索"
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] w-full sm:w-56"
          />
          {onAdd && (
            <button
              onClick={onAdd}
              aria-label={addLabel}
              className="bg-[#E8740C] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#d4680b] transition cursor-pointer whitespace-nowrap"
            >
              + {addLabel}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {columns.map((col) => (
                  <th key={col.key} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider w-32">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={String(item[idKey]) || idx} className="border-b border-gray-50 hover:bg-orange-50/30 transition">
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 px-4 text-gray-700">
                      {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? '')}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          aria-label="編集"
                          className="text-xs text-[#E8740C] hover:text-[#d4680b] font-medium cursor-pointer"
                        >
                          編集
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => setDeleteTarget(item)}
                          aria-label="削除"
                          className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer"
                        >
                          削除
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            {search ? '検索結果がありません' : 'データがありません'}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label="削除確認" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">削除の確認</h3>
            <p className="text-sm text-gray-600 mb-6">
              「{String(deleteTarget.title || deleteTarget.name || deleteTarget[idKey])}」を削除しますか？この操作は取り消せません。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                キャンセル
              </button>
              <button
                onClick={() => { onDelete?.(deleteTarget); setDeleteTarget(null); }}
                className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 cursor-pointer"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
