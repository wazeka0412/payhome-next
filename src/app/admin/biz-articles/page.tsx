'use client'

import ContentAdminTable, { type FieldDef } from '@/components/admin/ContentAdminTable'

const fields: FieldDef[] = [
  { key: 'category', label: 'カテゴリ', type: 'select', options: ['YouTube活用', '集客', 'ブランディング', 'SNS運用', 'コンテンツ戦略'], inList: true, className: 'w-32' },
  { key: 'title', label: 'タイトル', type: 'text', inList: true },
  { key: 'status', label: 'ステータス', type: 'select', options: ['draft', 'published'], inList: true, className: 'w-24' },
  { key: 'excerpt', label: '抜粋', type: 'textarea' },
  { key: 'publishDate', label: '公開日', type: 'date' },
  { key: 'seoTitle', label: 'SEOタイトル', type: 'text' },
  { key: 'seoDescription', label: 'SEO説明', type: 'textarea' },
  { key: 'body', label: '本文 (HTML)', type: 'longtext' },
]

export default function AdminBizArticlesPage() {
  return (
    <ContentAdminTable
      endpoint="/api/biz-articles"
      title="B2B記事管理"
      fields={fields}
      newDefaults={{ category: 'YouTube活用', status: 'draft' }}
      searchKeys={['title', 'category', 'excerpt']}
    />
  )
}
