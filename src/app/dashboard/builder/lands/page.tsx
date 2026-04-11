'use client'

import BuilderContentTable, { type BuilderFieldDef } from '@/components/dashboard/BuilderContentTable'
import { useCurrentBuilder } from '@/lib/use-current-builder'

const fields: BuilderFieldDef[] = [
  { key: 'title', label: 'タイトル', type: 'text', inList: true },
  { key: 'city', label: '市区町村', type: 'text', inList: true, className: 'w-28' },
  { key: 'price', label: '価格(万円)', type: 'number', inList: true, className: 'w-24', format: (v) => `${Number(v).toLocaleString()}万` },
  { key: 'tsubo', label: '坪数', type: 'number', inList: true, className: 'w-16' },
  { key: 'pricePerTsubo', label: '坪単価(万)', type: 'number', inList: true, className: 'w-24' },
  { key: 'status', label: 'ステータス', type: 'select', options: ['available', 'reserved', 'sold'], inList: true, className: 'w-24' },
  { key: 'prefecture', label: '都道府県', type: 'text' },
  { key: 'area', label: '面積(㎡)', type: 'number' },
  { key: 'features', label: '特徴（カンマ区切り）', type: 'tags' },
]

export default function BuilderLandsPage() {
  const builder = useCurrentBuilder()
  return (
    <BuilderContentTable
      endpoint="/api/lands"
      title="土地情報管理"
      description="公開ページ /lands に掲載される販売中・取扱中の土地情報を管理します。"
      fields={fields}
      builderMatchKey="builderId"
      builderMatchValue={builder.id}
      newDefaults={{ status: 'available', prefecture: builder.data?.area ?? '鹿児島県' }}
      searchKeys={['title', 'city']}
    />
  )
}
