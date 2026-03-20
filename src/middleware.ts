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
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // /dashboard/builder/* は builder または admin のみ
  if (pathname.startsWith('/dashboard/builder')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (token.role !== 'builder' && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/user', request.url))
    }
    return NextResponse.next()
  }

  // /dashboard/user/* はログイン済みユーザーのみ
  if (pathname.startsWith('/dashboard/user')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/user/:path*', '/dashboard/builder/:path*'],
}
