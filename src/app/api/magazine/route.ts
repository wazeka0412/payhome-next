import { NextRequest } from 'next/server'
import { listContent, createContent } from '@/lib/admin-content-store'
import { magazineIssues } from '@/lib/magazine-data'

const TABLE = 'magazine'

export async function GET() {
  const rows = await listContent(TABLE, magazineIssues)
  return Response.json(rows)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.title || !body.issue) {
      return Response.json({ error: 'title and issue are required' }, { status: 400 })
    }
    const inserted = await createContent(TABLE, {
      issue: body.issue,
      title: body.title,
      description: body.description ?? '',
      coverImage: body.coverImage ?? '',
      publishDate: body.publishDate ?? new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      contents: Array.isArray(body.contents) ? body.contents : [],
      isLatest: body.isLatest ?? false,
      status: body.status ?? 'draft',
      seoTitle: body.seoTitle ?? '',
      seoDescription: body.seoDescription ?? '',
      ogpImage: body.ogpImage ?? '',
    })
    return Response.json(inserted, { status: 201 })
  } catch {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
}
