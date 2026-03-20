import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'

const FORM_META_DELIMITER = '\n---FORM_META---\n'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const builderName = data.builderName || data.builder || undefined
    const selectedCompanies = data.selectedCompanies || data.selected || undefined

    // Collect form-specific metadata that doesn't have dedicated DB columns
    const meta: Record<string, string> = {}
    if (data.build_area) meta.buildArea = data.build_area
    if (data.postal) meta.postal = data.postal
    if (data.address) meta.address = data.address
    if (data.eventDate) meta.eventDate = data.eventDate
    if (data.event) meta.eventTitle = data.event
    if (data.participants) meta.participants = String(data.participants)

    // Store user message + metadata JSON in message field
    const userMessage = data.message || ''
    const message = Object.keys(meta).length > 0
      ? userMessage + FORM_META_DELIMITER + JSON.stringify(meta)
      : userMessage || undefined

    const lead = await store.addLead({
      type: data.type || '無料相談',
      name: data.name || data.company || '',
      email: data.email || '',
      phone: data.phone,
      company: data.company,
      area: data.area || data.builder_area,
      budget: data.budget,
      layout: data.layout,
      message,
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
