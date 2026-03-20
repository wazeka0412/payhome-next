'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import MobileMenu from './MobileMenu';

const NAV_CONTENT = [
  {
    label: 'コンテンツ',
    items: [
      { href: '/videos', label: '動画コンテンツ' },
      { href: '/interview', label: '取材・レポート' },
      { href: '/magazine', label: '月刊ぺいほーむ' },
      { href: '/news', label: 'ニュース' },
      { href: '/articles', label: 'お役立ち記事' },
      { href: '/webinar', label: 'ウェビナー' },
      { href: '/area', label: 'エリアから探す' },
    ],
  },
  {
    label: '運営情報',
    items: [
      { href: '/about', label: 'ぺいほーむとは' },
      { href: '/company', label: '運営会社' },
    ],
  },
  {
    label: 'サービス',
    items: [
      { href: '/consultation', label: '無料住宅相談' },
      { href: '/catalog', label: '資料請求' },
      { href: '/event', label: '見学会・イベント予約' },
      { href: '/builders', label: '工務店一覧' },
      { href: '/simulator', label: 'ローンシミュレーター' },
    ],
  },
];

export default function Header() {
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

      // Shrink effect after 100px
      setIsScrolled(currentScrollY > 100);

      // Mobile: hide on scroll down, show on scroll up
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

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm transition-all duration-300 ${
          !isHeaderVisible ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'h-12' : 'h-16'
          }`}
        >
          {/* Logo + Face icon */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Pei Home"
              width={140}
              height={36}
              className={`w-auto transition-all duration-300 ${
                isScrolled ? 'h-7' : 'h-9'
              }`}
              priority
            />
          </Link>
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 text-sm">
            {NAV_CONTENT.map((group) => (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(group.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    openDropdown === group.label
                      ? 'text-[#E8740C] bg-[#FFF8F0]'
                      : 'text-gray-700 hover:text-[#E8740C] hover:bg-[#FFF8F0]'
                  }`}
                  onClick={() =>
                    setOpenDropdown(openDropdown === group.label ? null : group.label)
                  }
                >
                  {group.label}
                  <span className="ml-1 text-xs inline-block transition-transform duration-200"
                    style={{ transform: openDropdown === group.label ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    ▾
                  </span>
                </button>

                {openDropdown === group.label && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[200px] z-50">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2.5 text-gray-700 hover:text-[#E8740C] hover:bg-[#FFF8F0] transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/mypage"
              className="text-sm text-gray-600 hover:text-[#E8740C] transition hidden md:block"
            >
              マイページ
            </Link>

            <Link
              href="/biz"
              className="ml-3 bg-[#E8740C] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-[#D4660A] transition-colors shadow-sm"
            >
              広告掲載をお考えの企業様
            </Link>
          </nav>

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="メニュー"
          >
            <span className="block w-6 h-0.5 bg-gray-700 mb-1.5 rounded-full"></span>
            <span className="block w-6 h-0.5 bg-gray-700 mb-1.5 rounded-full"></span>
            <span className="block w-6 h-0.5 bg-gray-700 rounded-full"></span>
          </button>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navContent={NAV_CONTENT}
      />
    </>
  );
}
