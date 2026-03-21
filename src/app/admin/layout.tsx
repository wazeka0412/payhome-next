'use client'

import Link from 'next/link';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add('pei-page-loaded')
    return () => { document.body.classList.remove('pei-page-loaded') }
  }, [])
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2A1700] text-white flex-shrink-0">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold text-[#E8740C]">
            Pei Home Admin
          </Link>
        </div>
        <nav className="px-4 space-y-1">
          {[
            { href: '/admin/dashboard', icon: '📊', label: 'ダッシュボード' },
            { href: '/admin/leads', icon: '👥', label: 'リード管理' },
            { href: '/admin/properties', icon: '🏠', label: '物件データ管理' },
            { href: '/admin/builders', icon: '🏗', label: '工務店管理' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div className="pt-4 pb-2 px-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">システム管理</p>
          </div>
          {[
            { href: '/admin/users', icon: '👤', label: 'ユーザー管理' },
            { href: '/admin/security', icon: '🔒', label: 'セキュリティ' },
            { href: '/admin/activity', icon: '📊', label: 'アクティビティ' },
            { href: '/admin/system', icon: '🖥️', label: 'システム監視' },
            { href: '/admin/notifications', icon: '🔔', label: '通知設定' },
            { href: '/admin/data', icon: '🗄️', label: 'データ管理' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
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
