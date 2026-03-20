'use client'

import { useEffect } from 'react'

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add('pei-page-loaded')
    return () => { document.body.classList.remove('pei-page-loaded') }
  }, [])

  return <>{children}</>
}
