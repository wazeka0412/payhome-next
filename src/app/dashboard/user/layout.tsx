'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/dashboard/user', label: 'マイページ', icon: '🏠' },
  { href: '/dashboard/user/favorites', label: 'お気に入り', icon: '❤️' },
  { href: '/dashboard/user/history', label: '閲覧履歴', icon: '📋' },
  { href: '/dashboard/user/consultations', label: '相談履歴', icon: '💬' },
]

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/"><img src="/images/logo.png" alt="ぺいほーむ" className="h-7" /></Link>
            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">マイページ</span>
          </div>
          <Link href="/" className="text-xs text-gray-400 hover:text-[#E8740C]">サイトへ戻る</Link>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <nav className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                pathname === item.href ? 'bg-[#E8740C] text-white font-bold' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#E8740C]'
              }`}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  )
}
