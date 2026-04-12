'use client'

import ContentAdminTable, { type FieldDef } from '@/components/admin/ContentAdminTable'

const fields: FieldDef[] = [
  { key: 'name', label: 'お名前', type: 'text', inList: true, className: 'w-32' },
  { key: 'area', label: 'エリア', type: 'text', inList: true, className: 'w-28' },
  { key: 'age', label: '年代', type: 'text', inList: true, className: 'w-20' },
  { key: 'family', label: '家族構成', type: 'text', inList: true, className: 'w-32' },
  { key: 'builder', label: '工務店', type: 'text', inList: true, className: 'w-32' },
  { key: 'status', label: 'ステータス', type: 'select', options: ['draft', 'published'], inList: true, className: 'w-24' },
  { key: 'propertyType', label: '物件種別', type: 'text' },
  { key: 'budget', label: '予算', type: 'text' },
  { key: 'duration', label: '工期', type: 'text' },
  { key: 'text', label: '一言', type: 'textarea' },
  { key: 'body', label: '本文 (HTML)', type: 'longtext' },
  { key: 'publishDate', label: '公開日', type: 'date' },
  { key: 'seoTitle', label: 'SEOタイトル', type: 'text' },
  { key: 'seoDescription', label: 'SEO説明', type: 'textarea' },
]

export default function AdminReviewsPage() {
  return (
    <ContentAdminTable
      endpoint="/api/reviews"
      title="お客様の声管理"
      fields={fields}
      newDefaults={{ status: 'draft' }}
      searchKeys={['name', 'area', 'builder']}
    />
  )
}
