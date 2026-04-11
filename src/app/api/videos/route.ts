import { NextRequest } from 'next/server'
import { listContent, createContent } from '@/lib/admin-content-store'
import { videos } from '@/lib/videos-data'

const TABLE = 'videos'

export async function GET() {
  const rows = await listContent(TABLE, videos)
  return Response.json(rows)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.title || !body.youtubeId) {
      return Response.json({ error: 'title and youtubeId are required' }, { status: 400 })
    }
    const inserted = await createContent(TABLE, {
      youtubeId: body.youtubeId,
      title: body.title,
      views: body.views ?? '0回再生',
      viewCount: body.viewCount ?? 0,
      category: body.category ?? 'ルームツアー',
      prefecture: body.prefecture ?? '鹿児島県',
      builder: body.builder ?? '',
      tsubo: body.tsubo ?? 0,
    })
    return Response.json(inserted, { status: 201 })
  } catch {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
}
