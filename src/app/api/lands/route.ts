import { NextRequest } from 'next/server'
import { listContent, createContent } from '@/lib/admin-content-store'
import { lands } from '@/lib/lands-data'

const TABLE = 'lands'

export async function GET() {
  const rows = await listContent(TABLE, lands)
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
      city: body.city ?? '',
      prefecture: body.prefecture ?? '鹿児島県',
      price: body.price ?? 0,
      area: body.area ?? 0,
      tsubo: body.tsubo ?? 0,
      pricePerTsubo: body.pricePerTsubo ?? 0,
      status: body.status ?? 'available',
      features: Array.isArray(body.features) ? body.features : [],
    })
    return Response.json(inserted, { status: 201 })
  } catch {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
}
