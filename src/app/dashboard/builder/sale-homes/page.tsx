'use client'

import BuilderContentTable, { type BuilderFieldDef } from '@/components/dashboard/BuilderContentTable'
import { useCurrentBuilder } from '@/lib/use-current-builder'

const fields: BuilderFieldDef[] = [
  { key: 'title', label: 'タイトル', type: 'text', inList: true },
  { key: 'city', label: '市区町村', type: 'text', inList: true, className: 'w-28' },
  { key: 'price', label: '価格(万円)', type: 'number', inList: true, className: 'w-24', format: (v) => `${Number(v).toLocaleString()}万` },
  { key: 'layout', label: '間取り', type: 'text', inList: true, className: 'w-20' },
  { key: 'status', label: 'ステータス', type: 'select', options: ['available', 'reserved', 'sold'], inList: true, className: 'w-24' },
  { key: 'prefecture', label: '都道府県', type: 'text' },
  { key: 'landArea', label: '土地面積(㎡)', type: 'number' },
  { key: 'buildingArea', label: '建物面積(㎡)', type: 'number' },
  { key: 'features', label: '特徴（カンマ区切り）', type: 'tags' },
]

export default function BuilderSaleHomesPage() {
  const builder = useCurrentBuilder()
  return (
    <BuilderContentTable
      endpoint="/api/sale-homes"
      title="建売物件管理"
      description="公開ページ /sale-homes に掲載される販売中の分譲戸建を管理します。"
      fields={fields}
      builderMatchKey="builderId"
      builderMatchValue={builder.id}
      newDefaults={{ status: 'available', layout: '3LDK', prefecture: builder.data?.area ?? '鹿児島県' }}
      searchKeys={['title', 'city']}
    />
  )
}
