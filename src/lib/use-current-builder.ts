'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { builders as staticBuilders, type BuilderData } from './builders-data'

/**
 * React hook for the builder dashboard to resolve the "current builder"
 * from the authenticated session.
 *
 * Resolution order:
 *   1. `session.user.builderId` (set by NextAuth callback when a user is linked)
 *   2. Email-based match in the static builders seed (convenient for dev: any
 *      account whose email starts with "builder" maps to the first seed entry)
 *   3. First seed entry as a fallback so the dashboard still renders for demo
 *      accounts until proper multi-tenant auth is wired up.
 *
 * The returned object is stable and includes a loading flag.
 */
export interface CurrentBuilder {
  id: string
  name: string
  data: BuilderData | null
  loading: boolean
}

export function useCurrentBuilder(): CurrentBuilder {
  const { data: session, status } = useSession()
  const [data, setData] = useState<BuilderData | null>(null)

  const sessionBuilderId = (session?.user as { builderId?: string } | undefined)?.builderId
  const email = session?.user?.email ?? ''

  // Pick a seed builder even before we know the session, so the UI shows
  // something reasonable on first paint. We'll refine it once auth settles.
  const resolved: BuilderData =
    (sessionBuilderId && staticBuilders.find((b) => b.id === sessionBuilderId)) ||
    (email.includes('builder') && staticBuilders[0]) ||
    staticBuilders[0]

  useEffect(() => {
    if (status === 'loading') return
    // Try fetching fresh builder data from the API; fall back to seed
    const id = sessionBuilderId ?? resolved.id
    fetch(`/api/builders/${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((apiBuilder) => {
        if (apiBuilder && !Array.isArray(apiBuilder)) {
          setData(apiBuilder as BuilderData)
        } else {
          setData(resolved)
        }
      })
      .catch(() => setData(resolved))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, sessionBuilderId])

  return {
    id: data?.id ?? resolved.id,
    name: data?.name ?? resolved.name,
    data: data ?? resolved,
    loading: status === 'loading',
  }
}
