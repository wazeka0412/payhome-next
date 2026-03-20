import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin/* は admin ロールのみ
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Phase 1: /dashboard/builder/* と /dashboard/user/* は一時的に無効化
  // ローンチ時はログイン障壁を排除し、CV率を最大化する
  // 認証コードは温存し、リード数が増えてから段階的に開放する
  //
  // Phase 2 で以下を有効化:
  // if (pathname.startsWith('/dashboard/builder')) {
  //   const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  //   if (!token) return NextResponse.redirect(new URL('/dashboard', request.url))
  //   if (token.role !== 'builder' && token.role !== 'admin')
  //     return NextResponse.redirect(new URL('/dashboard/user', request.url))
  //   return NextResponse.next()
  // }
  //
  // if (pathname.startsWith('/dashboard/user')) {
  //   const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  //   if (!token) return NextResponse.redirect(new URL('/dashboard', request.url))
  //   return NextResponse.next()
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
