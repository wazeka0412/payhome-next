'use client'

import ContentAdminTable, { type FieldDef } from '@/components/admin/ContentAdminTable'

const fields: FieldDef[] = [
  { key: 'youtubeId', label: 'YouTube ID', type: 'text', inList: true, className: 'w-32 font-mono text-xs' },
  { key: 'title', label: 'タイトル', type: 'text', inList: true },
  { key: 'category', label: 'カテゴリ', type: 'select', options: ['ルームツアー', '取材', '解説', 'トレンド'], inList: true, className: 'w-28' },
  { key: 'builder', label: '工務店', type: 'text', inList: true, className: 'w-32' },
  { key: 'prefecture', label: '都道府県', type: 'text', inList: true, className: 'w-24' },
  { key: 'views', label: '再生数表示', type: 'text' },
  { key: 'viewCount', label: '再生数(数値)', type: 'number', inList: true, className: 'w-24', format: (v) => Number(v).toLocaleString() },
  { key: 'tsubo', label: '坪数', type: 'number' },
]

export default function AdminVideosPage() {
  return (
    <ContentAdminTable
      endpoint="/api/videos"
      title="動画管理"
      fields={fields}
      newDefaults={{ category: 'ルームツアー', prefecture: '鹿児島県', viewCount: 0 }}
      searchKeys={['title', 'builder', 'youtubeId']}
    />
  )
}
