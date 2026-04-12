'use client'

import ContentAdminTable, { type FieldDef } from '@/components/admin/ContentAdminTable'

const fields: FieldDef[] = [
  { key: 'typeLabel', label: '種別', type: 'select', options: ['完成見学会', 'モデルハウス', 'オンライン見学会', 'ぺいほーむ特別見学会'], inList: true, className: 'w-36' },
  { key: 'title', label: 'タイトル', type: 'text', inList: true },
  { key: 'startDate', label: '開始日', type: 'date', inList: true, className: 'w-28' },
  { key: 'endDate', label: '終了日', type: 'date', inList: true, className: 'w-28' },
  { key: 'builder', label: '工務店', type: 'text', inList: true, className: 'w-32' },
  { key: 'location', label: '場所', type: 'text', inList: true },
  { key: 'capacity', label: '定員', type: 'number', inList: true, className: 'w-16' },
  { key: 'type', label: 'type値', type: 'select', options: ['completion', 'model', 'online', 'special'] },
  { key: 'address', label: '住所', type: 'text' },
  { key: 'prefecture', label: '都道府県', type: 'text' },
  { key: 'description', label: '説明', type: 'textarea' },
  { key: 'images', label: '画像URL（カンマ区切り）', type: 'tags' },
  { key: 'highlights', label: '見どころ（カンマ区切り）', type: 'tags' },
]

export default function AdminEventsPage() {
  return (
    <ContentAdminTable
      endpoint="/api/events"
      title="イベント管理"
      fields={fields}
      newDefaults={{ type: 'completion', typeLabel: '完成見学会', prefecture: '鹿児島県', capacity: 10 }}
      searchKeys={['title', 'builder', 'location']}
    />
  )
}
