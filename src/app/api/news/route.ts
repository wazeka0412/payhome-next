import { NextRequest } from 'next/server'
import { listContent, createContent } from '@/lib/admin-content-store'
import { newsItems } from '@/lib/news-data'

const TABLE = 'news'

export async function GET() {
  const rows = await listContent(TABLE, newsItems)
  return Response.json(rows)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.title) {
      return Response.json({ error: 'title is required' }, { status: 400 })
    }
    const inserted = await createContent(TABLE, {
      title: body.title,
      date: body.date ?? new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      category: body.category ?? 'お知らせ',
      description: body.description ?? '',
      body: body.body ?? '',
      status: body.status ?? 'draft',
      publishDate: body.publishDate ?? '',
      seoTitle: body.seoTitle ?? '',
      seoDescription: body.seoDescription ?? '',
      ogpImage: body.ogpImage ?? '',
    })
    return Response.json(inserted, { status: 201 })
  } catch {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
}
