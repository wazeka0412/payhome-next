'use client'

import ContentAdminTable, { type FieldDef } from '@/components/admin/ContentAdminTable'

const fields: FieldDef[] = [
  { key: 'tag', label: 'タグ', type: 'select', options: ['家づくりの基本', '資金計画', '間取り', '設備', '断熱・省エネ', '土地探し', 'メンテナンス'], inList: true, className: 'w-32' },
  { key: 'title', label: 'タイトル', type: 'text', inList: true },
  { key: 'date', label: '日付', type: 'date', inList: true, className: 'w-28' },
  { key: 'status', label: 'ステータス', type: 'select', options: ['draft', 'published'], inList: true, className: 'w-24' },
  { key: 'description', label: '概要', type: 'textarea' },
  { key: 'thumbnail', label: 'サムネイル', type: 'image' },
  { key: 'publishDate', label: '公開日', type: 'date' },
  { key: 'seoTitle', label: 'SEOタイトル', type: 'text' },
  { key: 'seoDescription', label: 'SEO説明', type: 'textarea' },
  { key: 'ogpImage', label: 'OGP画像', type: 'image' },
  { key: 'body', label: '本文 (HTML)', type: 'longtext' },
]

export default function AdminArticlesPage() {
  return (
    <ContentAdminTable
      endpoint="/api/articles"
      title="記事管理"
      fields={fields}
      newDefaults={{ tag: '家づくりの基本', status: 'draft' }}
      searchKeys={['title', 'tag', 'description']}
    />
  )
}
