'use client'

import Link from 'next/link';
import { useEffect } from 'react';

/**
 * MVPリリース (2026/05/01) 版管理画面ナビゲーション
 *
 * 核のループ運用に必要な4画面のみ:
 *   ダッシュボード / リード管理 / 工務店管理 / 見学会管理
 *
 * 非公開の管理画面パスは src/middleware.ts の HIDDEN_PATH_PREFIXES で 404。
 * 復活時はここに項目を戻し、middleware から該当パスを削除する。
 */
const NAV_ITEMS: Array<{ href: string; icon: string; label: string }> = [
  { href: '/admin/dashboard', icon: '📊', label: 'ダッシュボード' },
  { href: '/admin/leads', icon: '👥', label: 'リード管理' },
  { href: '/admin/builders', icon: '🏗', label: '工務店管理' },
  { href: '/admin/events', icon: '📅', label: '見学会管理' },
  { href: '/admin/reports', icon: '📈', label: '月次レポート' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add('pei-page-loaded')
    return () => { document.body.classList.remove('pei-page-loaded') }
  }, [])

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2A1700] text-white flex-shrink-0 overflow-y-auto max-h-screen sticky top-0">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold text-[#E8740C]">
            Pei Home Admin
          </Link>
          <div className="text-[10px] text-gray-500 mt-1">MVP 2026.05</div>
        </div>
        <nav className="px-4 pb-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
