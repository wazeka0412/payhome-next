import { NextRequest } from 'next/server'
import { listContent, createContent } from '@/lib/admin-content-store'
import { saleHomes } from '@/lib/sale-homes-data'

const TABLE = 'sale_homes'

export async function GET() {
  const rows = await listContent(TABLE, saleHomes)
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
      landArea: body.landArea ?? 0,
      buildingArea: body.buildingArea ?? 0,
      layout: body.layout ?? '3LDK',
      status: body.status ?? 'available',
      features: Array.isArray(body.features) ? body.features : [],
    })
    return Response.json(inserted, { status: 201 })
  } catch {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
}
