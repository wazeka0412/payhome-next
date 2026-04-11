'use client'

import BuilderContentTable, { type BuilderFieldDef } from '@/components/dashboard/BuilderContentTable'
import { useCurrentBuilder } from '@/lib/use-current-builder'

const fields: BuilderFieldDef[] = [
  { key: 'name', label: 'お名前', type: 'text', inList: true, className: 'w-32' },
  { key: 'area', label: 'エリア', type: 'text', inList: true, className: 'w-28' },
  { key: 'age', label: '年代', type: 'text', inList: true, className: 'w-20' },
  { key: 'family', label: '家族構成', type: 'text', inList: true, className: 'w-32' },
  { key: 'status', label: 'ステータス', type: 'select', options: ['draft', 'published'], inList: true, className: 'w-24' },
  { key: 'propertyType', label: '物件種別', type: 'text' },
  { key: 'budget', label: '予算', type: 'text' },
  { key: 'duration', label: '工期', type: 'text' },
  { key: 'text', label: '一言コメント', type: 'textarea' },
  { key: 'body', label: '本文 (HTML)', type: 'textarea' },
]

export default function BuilderReviewsPage() {
  const builder = useCurrentBuilder()
  return (
    <BuilderContentTable
      endpoint="/api/reviews"
      title="お客様の声管理"
      description="公開ページ /voice に掲載される施主様の声を管理します。お施主様の許諾を得てから登録してください。"
      fields={fields}
      builderMatchKey="builder"
      builderMatchValue={builder.name}
      newDefaults={{ status: 'draft' }}
      searchKeys={['name', 'area']}
    />
  )
}
