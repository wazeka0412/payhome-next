'use client'

import ContentAdminTable, { type FieldDef } from '@/components/admin/ContentAdminTable'

const fields: FieldDef[] = [
  { key: 'category', label: 'カテゴリ', type: 'select', options: ['工務店取材', 'ハウスメーカー取材', '施主インタビュー', 'トレンドレポート'], inList: true, className: 'w-32' },
  { key: 'title', label: 'タイトル', type: 'text', inList: true },
  { key: 'company', label: '取材先', type: 'text', inList: true, className: 'w-40' },
  { key: 'location', label: '所在地', type: 'text', inList: true, className: 'w-32' },
  { key: 'date', label: '日付', type: 'date', inList: true, className: 'w-28' },
  { key: 'status', label: 'ステータス', type: 'select', options: ['draft', 'published'], inList: true, className: 'w-24' },
  { key: 'excerpt', label: '抜粋', type: 'textarea' },
  { key: 'thumbnail', label: 'サムネイル', type: 'image' },
  { key: 'publishDate', label: '公開日', type: 'date' },
  { key: 'seoTitle', label: 'SEOタイトル', type: 'text' },
  { key: 'seoDescription', label: 'SEO説明', type: 'textarea' },
]

export default function AdminInterviewsPage() {
  return (
    <ContentAdminTable
      endpoint="/api/interviews"
      title="インタビュー管理"
      fields={fields}
      newDefaults={{ category: '工務店取材', status: 'draft' }}
      searchKeys={['title', 'company', 'location']}
    />
  )
}
