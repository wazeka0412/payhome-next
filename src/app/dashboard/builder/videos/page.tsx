'use client'

import BuilderContentTable, { type BuilderFieldDef } from '@/components/dashboard/BuilderContentTable'
import { useCurrentBuilder } from '@/lib/use-current-builder'

const fields: BuilderFieldDef[] = [
  { key: 'youtubeId', label: 'YouTube ID', type: 'text', inList: true, className: 'w-32 font-mono text-xs' },
  { key: 'title', label: 'タイトル', type: 'text', inList: true },
  { key: 'category', label: 'カテゴリ', type: 'select', options: ['ルームツアー', '取材', '解説', 'トレンド'], inList: true, className: 'w-28' },
  { key: 'prefecture', label: '都道府県', type: 'text', inList: true, className: 'w-24' },
  { key: 'viewCount', label: '再生数', type: 'number', inList: true, className: 'w-24', format: (v) => Number(v).toLocaleString() },
  { key: 'tsubo', label: '坪数', type: 'number' },
  { key: 'views', label: '再生数表示', type: 'text', placeholder: '99万回再生' },
]

export default function BuilderVideosPage() {
  const builder = useCurrentBuilder()
  return (
    <BuilderContentTable
      endpoint="/api/videos"
      title="ルームツアー動画管理"
      description="YouTube に公開した動画のメタデータを管理します。ここで登録した動画IDを「掲載情報」の代表動画に設定できます。"
      fields={fields}
      builderMatchKey="builder"
      builderMatchValue={builder.name}
      newDefaults={{ category: 'ルームツアー', prefecture: builder.data?.area ?? '鹿児島県', viewCount: 0 }}
      searchKeys={['title', 'youtubeId']}
    />
  )
}
