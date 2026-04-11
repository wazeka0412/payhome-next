import { NextRequest } from 'next/server'
import { listContent, createContent } from '@/lib/admin-content-store'
import { features } from '@/lib/features-data'

const TABLE = 'features'

export async function GET() {
  const rows = await listContent(TABLE, features)
  return Response.json(rows)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.title || !body.type) {
      return Response.json({ error: 'title and type are required' }, { status: 400 })
    }
    const inserted = await createContent(TABLE, {
      type: body.type,
      title: body.title,
      subtitle: body.subtitle ?? '',
      description: body.description ?? '',
      heroColor: body.heroColor ?? 'from-orange-400 to-red-500',
      filter: body.filter ?? {},
    })
    return Response.json(inserted, { status: 201 })
  } catch {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
}
