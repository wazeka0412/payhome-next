'use client'

import ContentAdminTable, { type FieldDef } from '@/components/admin/ContentAdminTable'

const fields: FieldDef[] = [
  { key: 'title', label: 'タイトル', type: 'text', inList: true },
  { key: 'builderId', label: '工務店ID', type: 'text', inList: true, className: 'w-24 font-mono text-xs' },
  { key: 'city', label: '市区町村', type: 'text', inList: true, className: 'w-28' },
  { key: 'price', label: '価格(万円)', type: 'number', inList: true, className: 'w-24', format: (v) => `${Number(v).toLocaleString()}万` },
  { key: 'tsubo', label: '坪数', type: 'number', inList: true, className: 'w-16' },
  { key: 'pricePerTsubo', label: '坪単価(万)', type: 'number', inList: true, className: 'w-24' },
  { key: 'status', label: 'ステータス', type: 'select', options: ['available', 'reserved', 'sold'], inList: true, className: 'w-24' },
  { key: 'prefecture', label: '都道府県', type: 'text' },
  { key: 'area', label: '面積(㎡)', type: 'number' },
  { key: 'features', label: '特徴（カンマ区切り）', type: 'tags' },
]

export default function AdminLandsPage() {
  return (
    <ContentAdminTable
      endpoint="/api/lands"
      title="土地情報管理"
      fields={fields}
      newDefaults={{ status: 'available', prefecture: '鹿児島県' }}
      searchKeys={['title', 'city', 'builderId']}
    />
  )
}
