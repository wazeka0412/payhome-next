'use client'

import { notFound } from 'next/navigation'
import { useWebinars } from '@/lib/content-store'
import WebinarDetail from './WebinarDetail'

export default function WebinarDetailContent({ id }: { id: string }) {
  const webinars = useWebinars()
  const webinar = webinars.find((w) => w.id === id)
  if (!webinar) notFound()

  const idx = webinars.indexOf(webinar)
  const prev = idx > 0 ? webinars[idx - 1] : null
  const next = idx < webinars.length - 1 ? webinars[idx + 1] : null

  return <WebinarDetail webinar={webinar} prev={prev} next={next} />
}
