import { NextRequest } from 'next/server'
import { listContent, createContent } from '@/lib/admin-content-store'
import { webinars } from '@/lib/webinars-data'

const TABLE = 'webinars'

export async function GET() {
  const rows = await listContent(TABLE, webinars)
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
      shortTitle: body.shortTitle ?? body.title,
      date: body.date ?? '',
      dateFormatted: body.dateFormatted ?? '',
      month: body.month ?? '',
      day: body.day ?? '',
      category: body.category ?? '開催予定',
      isUpcoming: body.isUpcoming ?? true,
      status: body.status ?? 'draft',
      info: body.info ?? '',
      description: body.description ?? '',
      body: body.body ?? '',
      publishDate: body.publishDate ?? '',
      seoTitle: body.seoTitle ?? '',
      seoDescription: body.seoDescription ?? '',
    })
    return Response.json(inserted, { status: 201 })
  } catch {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
}
