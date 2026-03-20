import { createServerClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('builders')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Builders GET error:', error)
    return Response.json({ error: 'Failed to fetch builders' }, { status: 500 })
  }

  return Response.json(data)
}
