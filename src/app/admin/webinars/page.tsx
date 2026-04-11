'use client'

import ContentAdminTable, { type FieldDef } from '@/components/admin/ContentAdminTable'

const fields: FieldDef[] = [
  { key: 'category', label: 'カテゴリ', type: 'select', options: ['開催予定', 'アーカイブ'], inList: true, className: 'w-28' },
  { key: 'title', label: 'タイトル', type: 'text', inList: true },
  { key: 'dateFormatted', label: '開催日', type: 'text', inList: true, className: 'w-32' },
  { key: 'status', label: 'ステータス', type: 'select', options: ['draft', 'published'], inList: true, className: 'w-24' },
  { key: 'shortTitle', label: '短縮タイトル', type: 'text' },
  { key: 'date', label: '日付 (YYYY-MM-DD)', type: 'date' },
  { key: 'month', label: '月', type: 'text' },
  { key: 'day', label: '日', type: 'text' },
  { key: 'info', label: '情報', type: 'text' },
  { key: 'description', label: '概要', type: 'textarea' },
  { key: 'body', label: '本文 (HTML)', type: 'longtext' },
  { key: 'publishDate', label: '公開日', type: 'date' },
  { key: 'seoTitle', label: 'SEOタイトル', type: 'text' },
  { key: 'seoDescription', label: 'SEO説明', type: 'textarea' },
]

export default function AdminWebinarsPage() {
  return (
    <ContentAdminTable
      endpoint="/api/webinars"
      title="ウェビナー管理"
      fields={fields}
      newDefaults={{ category: '開催予定', status: 'draft', isUpcoming: true }}
      searchKeys={['title', 'description']}
    />
  )
}
