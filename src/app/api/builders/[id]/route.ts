import { NextRequest } from 'next/server'
import { getContentById, updateContent } from '@/lib/admin-content-store'
import { builders } from '@/lib/builders-data'

const TABLE = 'builders_overrides'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const row = await getContentById(TABLE, id, builders)
  if (!row) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(row)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const updated = await updateContent(TABLE, id, body)
    if (!updated) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(updated)
  } catch {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
}
