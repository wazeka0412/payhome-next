'use client'

import ContentAdminTable, { type FieldDef } from '@/components/admin/ContentAdminTable'

const fields: FieldDef[] = [
  { key: 'issue', label: '号', type: 'text', inList: true, className: 'w-32' },
  { key: 'title', label: 'タイトル', type: 'text', inList: true },
  { key: 'publishDate', label: '発行日', type: 'date', inList: true, className: 'w-28' },
  { key: 'isLatest', label: '最新号', type: 'select', options: ['true', 'false'], inList: true, className: 'w-20' },
  { key: 'status', label: 'ステータス', type: 'select', options: ['draft', 'published'], inList: true, className: 'w-24' },
  { key: 'description', label: '説明', type: 'textarea' },
  { key: 'coverImage', label: '表紙画像', type: 'image' },
  { key: 'contents', label: '目次（カンマ区切り）', type: 'tags' },
  { key: 'seoTitle', label: 'SEOタイトル', type: 'text' },
  { key: 'seoDescription', label: 'SEO説明', type: 'textarea' },
]

export default function AdminMagazinePage() {
  return (
    <ContentAdminTable
      endpoint="/api/magazine"
      title="マガジン管理"
      fields={fields}
      newDefaults={{ status: 'draft', isLatest: false }}
      searchKeys={['title', 'issue']}
    />
  )
}
