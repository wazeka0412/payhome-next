import { NextRequest } from 'next/server'
import { listContent, createContent } from '@/lib/admin-content-store'
import { interviews } from '@/lib/interviews'

const TABLE = 'interviews'

export async function GET() {
  const rows = await listContent(TABLE, interviews)
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
      category: body.category ?? '工務店取材',
      company: body.company ?? '',
      location: body.location ?? '',
      excerpt: body.excerpt ?? '',
      body: Array.isArray(body.body) ? body.body : [],
      thumbnail: body.thumbnail ?? '',
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
