'use client'

import ContentAdminTable, { type FieldDef } from '@/components/admin/ContentAdminTable'

const fields: FieldDef[] = [
  { key: 'type', label: 'タイプ', type: 'select', options: ['prefecture', 'hiraya', 'builder'], inList: true, className: 'w-28' },
  { key: 'title', label: 'タイトル', type: 'text', inList: true },
  { key: 'subtitle', label: 'サブタイトル', type: 'text', inList: true },
  { key: 'description', label: '説明', type: 'textarea' },
  { key: 'heroColor', label: 'ヒーローカラー', type: 'text', placeholder: 'from-orange-400 to-red-500' },
]

export default function AdminFeaturesPage() {
  return (
    <ContentAdminTable
      endpoint="/api/features"
      title="特集管理"
      fields={fields}
      newDefaults={{ type: 'prefecture' }}
      searchKeys={['title', 'subtitle']}
    />
  )
}
