import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const builderName = data.builderName || data.builder || undefined
    const selectedCompanies = data.selectedCompanies || data.selected || undefined

    // Build message with extra context (event date, participants, postal, address)
    const messageParts: string[] = []
    if (data.eventDate) messageParts.push(`参加希望日: ${data.eventDate}`)
    if (data.event) messageParts.push(`イベント: ${data.event}`)
    if (data.participants) messageParts.push(`参加人数: ${data.participants}名`)
    if (data.postal) messageParts.push(`郵便番号: ${data.postal}`)
    if (data.address) messageParts.push(`住所: ${data.address}`)
    if (data.message) messageParts.push(data.message)
    const message = messageParts.length > 0 ? messageParts.join('\n') : undefined

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
