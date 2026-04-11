import { NextRequest } from 'next/server'
import { listContent, createContent } from '@/lib/admin-content-store'
import { bizWebinars } from '@/lib/biz-webinars-data'

const TABLE = 'biz_webinars'

export async function GET() {
  const rows = await listContent(TABLE, bizWebinars)
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
      date: body.date ?? '',
      dateLabel: body.dateLabel ?? '',
      year: body.year ?? new Date().getFullYear().toString(),
      category: body.category ?? '開催予定',
      excerpt: body.excerpt ?? '',
      info: body.info ?? '',
      body: body.body ?? '',
      schedule: Array.isArray(body.schedule) ? body.schedule : [],
      speakers: Array.isArray(body.speakers) ? body.speakers : [],
      participants: body.participants ?? '',
      keyPoints: Array.isArray(body.keyPoints) ? body.keyPoints : [],
      seoTitle: body.seoTitle ?? '',
      seoDescription: body.seoDescription ?? '',
    })
    return Response.json(inserted, { status: 201 })
  } catch {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
}
