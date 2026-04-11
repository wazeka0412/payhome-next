'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import MobileMenu from './MobileMenu';

/**
 * MVPリリース (2026/05/01) 版ナビゲーション
 *
 * 「YouTube → TOP → 工務店ページ → 見学会予約」の核ループのみに絞り込み。
 * 非公開項目は src/middleware.ts の HIDDEN_PATH_PREFIXES で404を返すため、
 * 復活させる際はナビ + middleware の2箇所から削除するだけ。
 */
const NAV_CONTENT = [
  {
    label: 'さがす',
    items: [
      { href: '/videos', label: '動画コンテンツ', desc: '平屋ルームツアー' },
      { href: '/builders', label: '工務店一覧', desc: '提携工務店を検索' },
      { href: '/case-studies', label: '平屋事例ライブラリ', desc: '完成事例を確認' },
      { href: '/event', label: '見学会・イベント', desc: '実物を体感' },
    ],
  },
  {
    label: 'サービス',
    items: [
      { href: '/diagnosis', label: 'AI家づくり診断', desc: '10問で自分に合う家を提案' },
      { href: '/consultation', label: '無料住宅相談', desc: '専門スタッフに相談' },
    ],
  },
  {
    label: 'ぺいほーむについて',
    items: [
      { href: '/about', label: 'ぺいほーむとは', desc: '私たちの想い' },
      { href: '/company', label: '運営会社', desc: '株式会社wazeka' },
    ],
  },
];

export default function Header() {
  const { data: session } = useSession();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 100);

      if (window.innerWidth < 1024) {
        if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
          setIsHeaderVisible(false);
        } else {
          setIsHeaderVisible(true);
        }
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const userName = (session?.user as { name?: string | null } | undefined)?.name
    || (session?.user as { email?: string | null } | undefined)?.email;

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 ${
          !isHeaderVisible ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-5 flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'h-14' : 'h-[72px]'
          }`}
        >
          {/* ─── Logo ─── */}
          <Link href="/" className="flex items-center shrink-0 group">
            <Image
              src="/images/logo.png"
              alt="ぺいほーむ"
              width={160}
              height={40}
              className={`w-auto transition-all duration-300 group-hover:opacity-80 ${
                isScrolled ? 'h-8' : 'h-10'
              }`}
              priority
            />
          </Link>

          {/* ─── Desktop Nav ─── */}
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center">
              {NAV_CONTENT.map((group) => (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(group.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`relative px-4 py-2 text-[13px] font-semibold tracking-wide transition-colors ${
                      openDropdown === group.label
                        ? 'text-[#E8740C]'
                        : 'text-gray-700 hover:text-[#E8740C]'
                    }`}
                  >
                    {group.label}
                    <span
                      className={`absolute bottom-0 left-4 right-4 h-[2px] bg-[#E8740C] transition-transform duration-300 origin-left ${
                        openDropdown === group.label ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </button>

                  {openDropdown === group.label && (
                    <div className="absolute top-full left-0 pt-2">
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[280px] overflow-hidden">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-5 py-3 hover:bg-[#FFF8F0] transition-colors group/item"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <div className="text-sm font-bold text-gray-900 group-hover/item:text-[#E8740C] transition-colors">
                              {item.label}
                            </div>
                            {item.desc && (
                              <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ─── Divider ─── */}
            <div className="mx-3 h-6 w-px bg-gray-200" />

            {/* ─── AI診断 primary CTA ─── */}
            <Link
              href="/diagnosis"
              className="px-5 py-2 bg-[#E8740C] text-white rounded-full text-[13px] font-bold hover:bg-[#D4660A] transition-colors shadow-[0_2px_8px_rgba(232,116,12,0.25)]"
            >
              AI家づくり診断
            </Link>

            {/* ─── 会員メニュー ─── */}
            {session?.user ? (
              <div className="ml-3 flex items-center gap-2">
                <Link
                  href="/mypage"
                  className="flex items-center gap-2 text-[13px] text-gray-700 hover:text-[#E8740C] px-3 py-2 rounded-lg hover:bg-gray-50 transition font-semibold"
                  title={userName || 'マイページ'}
                >
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E8740C] to-[#F5A623] text-white text-xs font-bold flex items-center justify-center">
                    {(userName || '?')[0]?.toUpperCase()}
                  </span>
                  <span className="max-w-[100px] truncate">マイページ</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-[11px] text-gray-400 hover:text-[#E8740C] transition px-2"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <div className="ml-3 flex items-center gap-1">
                <Link
                  href="/login"
                  className="text-[13px] text-gray-700 hover:text-[#E8740C] px-3 py-2 rounded-lg transition font-semibold"
                >
                  ログイン
                </Link>
                <Link
                  href="/signup"
                  className="text-[13px] border border-gray-300 hover:border-[#E8740C] text-gray-700 hover:text-[#E8740C] px-4 py-2 rounded-full transition font-semibold"
                >
                  会員登録
                </Link>
              </div>
            )}
          </nav>

          {/* ─── Hamburger (mobile) ─── */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="メニューを開く"
          >
            <span className="block w-6 h-0.5 bg-gray-800 mb-1.5 rounded-full" />
            <span className="block w-6 h-0.5 bg-gray-800 mb-1.5 rounded-full" />
            <span className="block w-6 h-0.5 bg-gray-800 rounded-full" />
          </button>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navContent={NAV_CONTENT.map((g) => ({ label: g.label, items: g.items.map((i) => ({ href: i.href, label: i.label })) }))}
      />
    </>
  );
}
