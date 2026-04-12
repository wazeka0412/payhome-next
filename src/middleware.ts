import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * MVP リリース (2026/05/01) に向けた「選択と集中」戦略。
 *
 * ここで指定したパスは 404 を返し、検索エンジン・一般ユーザーから隠す。
 * コードは温存されているので、リストから削除すれば即復活可能。
 *
 * 復活スケジュール (docs/mvp-launch-strategy.md 参照):
 *   M1 (6月) : case-studies/[id], voice/[id] 詳細
 *   M2 (7月) : news, articles
 *   M3 (8月) : sale-homes, lands
 *   M4 (9月) : interview, magazine
 *   M5 (10月): webinar, features
 *   M6 (11月): simulator, /biz 全体
 *   M9 (2月) : mypage/questions
 */
const HIDDEN_PATH_PREFIXES: readonly string[] = [
  // ── ユーザー側 ────────────────────────
  '/articles',
  '/news',
  '/interview',
  '/magazine',
  '/webinar',
  // 2026-04-12 スコープ再拡張: /sale-homes, /lands, /features を P1 で公開
  // '/sale-homes',
  // '/lands',
  // '/features',
  '/simulator',
  '/area',
  // 2026-04-12 修正: /welcome は会員登録完了後のリダイレクト先のため公開
  // '/welcome',
  '/property',
  '/builders/compare',
  '/builders/contact',
  // 2026-04-12 修正: /mypage/catalog は会員向けデジタルカタログ受け取り画面のため公開
  // '/mypage/catalog',
  '/mypage/questions',
  '/mypage/feedback',
  // ── B2B 側 (TOP と /biz/contact と /biz/ad のみ残す) ──
  '/biz/service',
  // 2026-04-12 修正: /biz/ad は広告掲載ページとして公開
  // '/biz/ad',
  '/biz/partner',
  '/biz/articles',
  '/biz/news',
  '/biz/webinar',
  // ── 工務店ダッシュボード ─────────────
  '/dashboard/builder/questions',
  '/dashboard/builder/billing',
  '/dashboard/builder/case-studies',
  '/dashboard/builder/sale-homes',
  '/dashboard/builder/lands',
  '/dashboard/builder/videos',
  '/dashboard/builder/reviews',
  // ── 管理画面 (leads/builders/events/dashboard のみ残す) ──
  '/admin/articles',
  '/admin/news',
  '/admin/videos',
  '/admin/interviews',
  '/admin/webinars',
  '/admin/case-studies',
  '/admin/sale-homes',
  '/admin/lands',
  '/admin/magazine',
  '/admin/features',
  '/admin/reviews',
  '/admin/biz-articles',
  '/admin/biz-news',
  '/admin/biz-webinars',
  '/admin/users',
  '/admin/properties',
  '/admin/security',
  '/admin/activity',
  '/admin/system',
  '/admin/notifications',
  '/admin/data',
  '/admin/reports',
] as const

function isHiddenPath(pathname: string): boolean {
  // 完全一致 or 前方一致 ("/articles/xxx" も含む)
  return HIDDEN_PATH_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // MVP: 非公開パスは 404
  if (isHiddenPath(pathname)) {
    return NextResponse.rewrite(new URL('/404', request.url))
  }

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
    // MVP hidden paths + auth-protected routes
    // 静的アセット・API・Next内部ルートは除外
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts|robots.txt|sitemap.xml).*)',
  ],
}
