import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 開発環境では /appadmin と /admin のアクセスを許可
  const isDev = process.env.NODE_ENV === 'development'

  // /admin/*, /appadmin/* は admin ロールのみ（本番環境）
  if (pathname.startsWith('/admin') || pathname.startsWith('/appadmin')) {
    if (isDev) return NextResponse.next()
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Phase 1: /dashboard/builder/* と /dashboard/user/* は admin のみアクセス可能
  // ローンチ時はユーザー・工務店にはログインを求めず、リードはメール通知で届ける
  // Phase 2 でロール別アクセス制御に切り替え:
  //   builder/* → builder or admin
  //   user/*    → any authenticated user
  if (pathname.startsWith('/dashboard/builder') || pathname.startsWith('/dashboard/user')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/appadmin/:path*', '/dashboard/builder/:path*', '/dashboard/user/:path*'],
}
