'use client'

import ContentAdminTable, { type FieldDef } from '@/components/admin/ContentAdminTable'

const fields: FieldDef[] = [
  { key: 'category', label: 'カテゴリ', type: 'select', options: ['お知らせ', '業界ニュース', 'コラム'], inList: true, className: 'w-32' },
  { key: 'title', label: 'タイトル', type: 'text', inList: true },
  { key: 'date', label: '日付', type: 'date', inList: true, className: 'w-28' },
  { key: 'status', label: 'ステータス', type: 'select', options: ['draft', 'published'], inList: true, className: 'w-24' },
  { key: 'description', label: '概要', type: 'textarea' },
  { key: 'publishDate', label: '公開日', type: 'date' },
  { key: 'seoTitle', label: 'SEOタイトル', type: 'text' },
  { key: 'seoDescription', label: 'SEO説明', type: 'textarea' },
  { key: 'body', label: '本文 (HTML)', type: 'longtext' },
]

export default function AdminNewsPage() {
  return (
    <ContentAdminTable
      endpoint="/api/news"
      title="ニュース管理"
      fields={fields}
      newDefaults={{ category: 'お知らせ', status: 'draft' }}
      searchKeys={['title', 'category', 'description']}
    />
  )
}
