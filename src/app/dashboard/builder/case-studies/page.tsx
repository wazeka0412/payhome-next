'use client'

import BuilderContentTable, { type BuilderFieldDef } from '@/components/dashboard/BuilderContentTable'
import { useCurrentBuilder } from '@/lib/use-current-builder'

const fields: BuilderFieldDef[] = [
  { key: 'title', label: 'タイトル', type: 'text', inList: true },
  { key: 'city', label: '市区町村', type: 'text', inList: true, className: 'w-28' },
  { key: 'layout', label: '間取り', type: 'select', options: ['1LDK', '2LDK', '3LDK', '4LDK', '5LDK+'], inList: true, className: 'w-20' },
  { key: 'tsubo', label: '坪数', type: 'number', inList: true, className: 'w-16' },
  { key: 'totalPrice', label: '総額(万円)', type: 'number', inList: true, className: 'w-24', format: (v) => `${Number(v).toLocaleString()}万` },
  { key: 'completedAt', label: '完成年月', type: 'text', placeholder: 'YYYY-MM' },
  { key: 'prefecture', label: '都道府県', type: 'text' },
  { key: 'description', label: '説明', type: 'textarea' },
  { key: 'images', label: '画像URL（カンマ区切り）', type: 'tags' },
  { key: 'tags', label: 'タグ（カンマ区切り）', type: 'tags' },
]

export default function BuilderCaseStudiesPage() {
  const builder = useCurrentBuilder()
  return (
    <BuilderContentTable
      endpoint="/api/case-studies"
      title="施工事例管理"
      description="公開ページ /case-studies に掲載される工務店の完成事例を管理します。"
      fields={fields}
      builderMatchKey="builderId"
      builderMatchValue={builder.id}
      newDefaults={{ layout: '3LDK', prefecture: builder.data?.area ?? '鹿児島県' }}
      searchKeys={['title', 'city']}
    />
  )
}
