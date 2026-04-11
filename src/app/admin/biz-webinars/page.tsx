'use client'

import ContentAdminTable, { type FieldDef } from '@/components/admin/ContentAdminTable'

const fields: FieldDef[] = [
  { key: 'category', label: 'カテゴリ', type: 'select', options: ['開催予定', 'アーカイブ'], inList: true, className: 'w-28' },
  { key: 'title', label: 'タイトル', type: 'text', inList: true },
  { key: 'dateLabel', label: '日付ラベル', type: 'text', inList: true, className: 'w-24' },
  { key: 'year', label: '年', type: 'text', inList: true, className: 'w-20' },
  { key: 'excerpt', label: '抜粋', type: 'textarea' },
  { key: 'date', label: '日付 (YYYY-MM-DD)', type: 'date' },
  { key: 'info', label: '情報', type: 'text' },
  { key: 'participants', label: '参加対象', type: 'text' },
  { key: 'schedule', label: 'スケジュール（カンマ区切り）', type: 'tags' },
  { key: 'keyPoints', label: '要点（カンマ区切り）', type: 'tags' },
  { key: 'body', label: '本文 (HTML)', type: 'longtext' },
  { key: 'seoTitle', label: 'SEOタイトル', type: 'text' },
  { key: 'seoDescription', label: 'SEO説明', type: 'textarea' },
]

export default function AdminBizWebinarsPage() {
  return (
    <ContentAdminTable
      endpoint="/api/biz-webinars"
      title="B2Bウェビナー管理"
      fields={fields}
      newDefaults={{ category: '開催予定', year: new Date().getFullYear().toString() }}
      searchKeys={['title', 'excerpt']}
    />
  )
}
