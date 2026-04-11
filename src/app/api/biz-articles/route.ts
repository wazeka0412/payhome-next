import { NextRequest } from 'next/server'
import { listContent, createContent } from '@/lib/admin-content-store'
import { bizArticleItems } from '@/lib/biz-articles-data'

const TABLE = 'biz_articles'

export async function GET() {
  const rows = await listContent(TABLE, bizArticleItems)
  return Response.json(rows)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.title) {
      return Response.json({ error: 'title is required' }, { status: 400 })
    }
    const inserted = await createContent(TABLE, {
      category: body.category ?? 'YouTube活用',
      title: body.title,
      excerpt: body.excerpt ?? '',
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
