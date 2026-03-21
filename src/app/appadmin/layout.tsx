'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const NAV_ITEMS = [
  { href: '/appadmin', icon: '📊', label: 'ダッシュボード', exact: true },
  { href: '/appadmin/properties', icon: '🎬', label: '動画コンテンツ' },
  { href: '/appadmin/events', icon: '📅', label: '見学会・イベント' },
  { href: '/appadmin/interviews', icon: '📰', label: '取材・レポート' },
  { href: '/appadmin/reviews', icon: '💬', label: 'お客様の声' },
  { href: '/appadmin/webinars', icon: '🎓', label: 'ウェビナー' },
  { href: '/appadmin/builders', icon: '🏗', label: '工務店一覧' },
  { href: '/appadmin/articles', icon: '📝', label: 'お役立ち記事' },
  { href: '/appadmin/news', icon: '📢', label: 'ニュース' },
  { href: '/appadmin/magazine', icon: '📖', label: '月刊ぺいほーむ' },
];

const TOOL_NAV_ITEMS = [
  { href: '/appadmin/media', icon: '🖼️', label: 'メディアライブラリ' },
  { href: '/appadmin/workflow', icon: '📋', label: 'ワークフロー' },
  { href: '/appadmin/seo', icon: '🔍', label: 'SEO設定' },
  { href: '/appadmin/audit', icon: '📜', label: '監査ログ' },
  { href: '/appadmin/system', icon: '🖥️', label: 'システム状態' },
  { href: '/appadmin/backup', icon: '💾', label: 'バックアップ' },
];

const SETTINGS_NAV = [
  { href: '/appadmin/settings', icon: '⚙️', label: 'システム設定' },
];

export default function AppAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.add('pei-page-loaded');
    return () => { document.body.classList.remove('pei-page-loaded'); };
  }, []);

  const isActive = (item: { href: string; exact?: boolean }) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-[#1a1a2e] text-white flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <Link href="/appadmin" className="text-lg font-bold text-[#E8740C]">
            Pei Home CMS
          </Link>
          <p className="text-[0.65rem] text-gray-400 mt-0.5">コンテンツ管理システム</p>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                  isActive(item)
                    ? 'bg-[#E8740C] text-white font-semibold'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="px-4 text-[0.6rem] uppercase tracking-wider text-gray-500 mb-2">管理ツール</p>
            <div className="space-y-0.5">
              {TOOL_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                    isActive(item)
                      ? 'bg-[#E8740C] text-white font-semibold'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 space-y-0.5">
            {SETTINGS_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                  isActive(item)
                    ? 'bg-[#E8740C] text-white font-semibold'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/admin" className="text-xs text-gray-500 hover:text-gray-300 transition">
            ← リード管理画面へ
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
