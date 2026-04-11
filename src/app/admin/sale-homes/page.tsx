'use client'

import ContentAdminTable, { type FieldDef } from '@/components/admin/ContentAdminTable'

const fields: FieldDef[] = [
  { key: 'title', label: 'タイトル', type: 'text', inList: true },
  { key: 'builderId', label: '工務店ID', type: 'text', inList: true, className: 'w-24 font-mono text-xs' },
  { key: 'city', label: '市区町村', type: 'text', inList: true, className: 'w-28' },
  { key: 'price', label: '価格(万円)', type: 'number', inList: true, className: 'w-24', format: (v) => `${Number(v).toLocaleString()}万` },
  { key: 'layout', label: '間取り', type: 'text', inList: true, className: 'w-20' },
  { key: 'status', label: 'ステータス', type: 'select', options: ['available', 'reserved', 'sold'], inList: true, className: 'w-24' },
  { key: 'prefecture', label: '都道府県', type: 'text' },
  { key: 'landArea', label: '土地面積(㎡)', type: 'number' },
  { key: 'buildingArea', label: '建物面積(㎡)', type: 'number' },
  { key: 'features', label: '特徴（カンマ区切り）', type: 'tags' },
]

export default function AdminSaleHomesPage() {
  return (
    <ContentAdminTable
      endpoint="/api/sale-homes"
      title="建売物件管理"
      fields={fields}
      newDefaults={{ status: 'available', prefecture: '鹿児島県', layout: '3LDK' }}
      searchKeys={['title', 'city', 'builderId']}
    />
  )
}
