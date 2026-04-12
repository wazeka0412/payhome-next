'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCurrentBuilder } from '@/lib/use-current-builder'

/**
 * MVPリリース (2026/05/01) 版工務店ダッシュボード
 *
 * リード対応 → 見学会運営 → 掲載情報更新 のシンプル運用に絞り込み。
 * AI質問対応 / 施工事例 / 建売 / 土地 / 動画 / お客様の声 / 請求プラン は
 * middleware で 404。Phase 2 以降に順次復活。
 */
const PRIMARY_NAV = [
  { href: '/dashboard/builder', label: 'ダッシュボード', icon: '\u{1F4CA}' },
  { href: '/dashboard/builder/leads', label: 'リード管理', icon: '\u{1F464}' },
  { href: '/dashboard/builder/events', label: '見学会管理', icon: '\u{1F4C5}' },
  { href: '/dashboard/builder/profile', label: '掲載情報', icon: '\u{1F3E0}' },
]

const MOBILE_NAV = PRIMARY_NAV.map((item) => ({
  ...item,
  label: item.label.replace('管理', '').replace('情報', ''),
}))

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const builder = useCurrentBuilder()

  const renderSection = (
    title: string | null,
    items: Array<{ href: string; label: string; icon: string }>
  ) => (
    <div>
      {title && (
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-1 px-3">
          {title}
        </div>
      )}
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                pathname === item.href
                  ? 'bg-[#FFF8F0] text-[#E8740C] font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="ぺいほーむ" className="h-7" />
            <span className="text-xs bg-[#E8740C] text-white px-2 py-0.5 rounded-full font-bold">工務店管理</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{builder.name}</span>
            <Link href="/" className="text-xs text-gray-400 hover:text-[#E8740C]">サイトへ</Link>
          </div>
        </div>
      </header>
      <div className="flex">
        {/* Sidebar - desktop */}
        <nav className="hidden md:block w-56 bg-white border-r border-gray-100 min-h-[calc(100vh-56px)] p-4">
          {renderSection(null, PRIMARY_NAV)}
        </nav>
        {/* Mobile nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
          <div className="flex justify-around py-2">
            {MOBILE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center text-xs py-1 ${
                  pathname === item.href ? 'text-[#E8740C] font-bold' : 'text-gray-400'
                }`}
              >
                <span className="text-lg mb-0.5">{item.icon}</span>
                <span className="text-[10px]">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">{children}</main>
      </div>
    </div>
  )
}
