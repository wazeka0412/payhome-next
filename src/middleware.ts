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

  // v4.0: /dashboard/builder/* は builder / admin ロール
  if (pathname.startsWith('/dashboard/builder')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.redirect(new URL('/login?redirect=' + encodeURIComponent(pathname), request.url))
    }
    if (token.role !== 'builder' && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // v4.0: /dashboard/user/*, /mypage, /diagnosis/result は認証済みユーザー全員
  if (
    pathname.startsWith('/dashboard/user') ||
    pathname === '/mypage' ||
    pathname.startsWith('/mypage/')
  ) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.redirect(new URL('/login?redirect=' + encodeURIComponent(pathname), request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/appadmin/:path*',
    '/dashboard/builder/:path*',
    '/dashboard/user/:path*',
    '/mypage',
    '/mypage/:path*',
  ],
}
