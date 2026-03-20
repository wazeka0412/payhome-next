import { createServerClient } from '@/lib/supabase'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return Response.json({ error: 'Lead not found' }, { status: 404 })
  }

  return Response.json(data)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const updates = await request.json()
    const supabase = createServerClient()

    const dbUpdates: Record<string, unknown> = {}
    if (updates.status) dbUpdates.status = updates.status
    if (updates.score !== undefined) dbUpdates.score = updates.score
    if (updates.memo !== undefined) dbUpdates.memo = updates.memo

    const { data, error } = await supabase
      .from('leads')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      return Response.json({ error: 'Lead not found' }, { status: 404 })
    }

    return Response.json(data)
  } catch {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
}
