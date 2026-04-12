import { NextRequest } from 'next/server'
import { listContent, createContent } from '@/lib/admin-content-store'
import { reviews } from '@/lib/reviews-data'

const TABLE = 'reviews'

export async function GET() {
  const rows = await listContent(TABLE, reviews)
  return Response.json(rows)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.name || !body.text) {
      return Response.json({ error: 'name and text are required' }, { status: 400 })
    }
    const inserted = await createContent(TABLE, {
      name: body.name,
      area: body.area ?? '',
      age: body.age ?? '',
      family: body.family ?? '',
      text: body.text,
      propertyType: body.propertyType ?? '',
      builder: body.builder ?? '',
      budget: body.budget ?? '',
      duration: body.duration ?? '',
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
