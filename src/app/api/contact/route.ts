import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const builderName = data.builderName || data.builder || undefined
    const selectedCompanies = data.selectedCompanies || data.selected || undefined

    const lead = await store.addLead({
      type: data.type || '無料相談',
      name: data.name || data.company || '',
      email: data.email || '',
      phone: data.phone,
      company: data.company,
      area: data.area,
      budget: data.budget,
      layout: data.layout,
      message: data.message,
      video: data.video,
      builderName,
      selectedServices: data.selectedServices,
      selectedCompanies,
    })
    console.log('=== NEW LEAD ===', lead.id)
    return NextResponse.json({ success: true, leadId: lead.id })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
