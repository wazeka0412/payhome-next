import { NextRequest } from 'next/server'
import { listContent, createContent } from '@/lib/admin-content-store'
import { caseStudies } from '@/lib/case-studies-data'

const TABLE = 'case_studies'

export async function GET() {
  const rows = await listContent(TABLE, caseStudies)
  return Response.json(rows)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.title) {
      return Response.json({ error: 'title is required' }, { status: 400 })
    }
    const inserted = await createContent(TABLE, {
      builderId: body.builderId ?? '',
      title: body.title,
      completedAt: body.completedAt ?? '',
      city: body.city ?? '',
      prefecture: body.prefecture ?? '',
      layout: body.layout ?? '3LDK',
      tsubo: body.tsubo ?? 0,
      totalPrice: body.totalPrice ?? 0,
      description: body.description ?? '',
      images: Array.isArray(body.images) ? body.images : [],
      tags: Array.isArray(body.tags) ? body.tags : [],
    })
    return Response.json(inserted, { status: 201 })
  } catch {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
}
