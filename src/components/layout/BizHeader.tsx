'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

const NAV_CONTENT = [
  {
    label: 'サービス',
    items: [
      { href: '/biz/service', label: 'サービス概要' },
      { href: '/biz/ad', label: '広告・タイアップ' },
      { href: '/biz/partner', label: '提携パートナー募集' },
    ],
  },
  {
    label: '情報',
    items: [
      { href: '/biz/news', label: '業界ニュース' },
      { href: '/biz/articles', label: '集客ノウハウ' },
      { href: '/biz/webinar', label: 'セミナー' },
    ],
  },
  {
    label: '運営情報',
    items: [
      { href: '/about', label: 'ぺいほーむとは' },
      { href: '/company', label: '運営会社' },
    ],
  },
];

export default function BizHeader() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

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
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 200);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 transition-all duration-300 ${
          isScrolled ? 'shadow-md' : ''
        } ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className={`max-w-7xl mx-auto px-4 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-12' : 'h-16'
        }`}>
          <Link href="/biz" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="ぺいほーむ"
              width={140}
              height={40}
              className={`w-auto transition-all duration-300 ${isScrolled ? 'h-7' : 'h-9'}`}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_CONTENT.map((group) => (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(group.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors text-sm cursor-pointer ${openDropdown === group.label ? 'text-[#E8740C] bg-[#FFF8F0]' : 'hover:text-[#E8740C]'}`}>
                  {group.label}
                  <svg
                    className={`w-3 h-3 transition-transform ${openDropdown === group.label ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === group.label && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm hover:bg-orange-50 hover:text-[#E8740C] transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* Phase 2: 工務店ログイン導入後に有効化 */}
            {/* <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-[#E8740C] transition hidden md:block"
            >
              管理画面
            </Link> */}

            <Link
              href="/biz/contact"
              className="bg-[#E8740C] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#D4660A] transition-colors"
            >
              お問い合わせ
            </Link>
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 cursor-pointer"
            aria-label="メニュー"
          >
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : 'mb-1.5'}`} />
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'opacity-0' : 'mb-1.5'}`} />
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile Menu — 旧サイトと同じデザイン */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <Image src="/images/logo.png" alt="Pei Home" width={160} height={44} className="h-10 w-auto" />
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-lg cursor-pointer"
              aria-label="閉じる"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 px-5 py-5">
            {NAV_CONTENT.map((group) => (
              <div key={group.label} className="mb-5">
                <div className="text-xs font-bold tracking-wider pb-2 mb-1" style={{ color: '#E8740C', borderBottom: '2px solid #E8740C', letterSpacing: '0.1em' }}>
                  {group.label}
                </div>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 py-3.5 px-3 text-[0.95rem] font-medium text-gray-800 border-b border-gray-100 hover:bg-orange-50 hover:text-[#E8740C] hover:pl-5 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#E8740C', opacity: 0.5 }} />
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}

            {/* Phase 2: 工務店管理画面リンク */}
            {/* <div className="mb-5">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 py-3.5 px-3 text-[0.95rem] font-bold hover:bg-orange-50 transition-all"
                style={{ color: '#E8740C' }}
                onClick={() => setIsMenuOpen(false)}
              >
                管理画面 →
              </Link>
            </div> */}

            <div className="mb-5">
              <Link
                href="/"
                className="flex items-center gap-3 py-3.5 px-3 text-[0.95rem] font-bold hover:bg-orange-50 transition-all"
                style={{ color: '#E8740C' }}
                onClick={() => setIsMenuOpen(false)}
              >
                ユーザー向けサイトへ →
              </Link>
            </div>
          </div>

          <div className="flex justify-center py-4">
            <Image src="/images/pei_smile.png" alt="ペイさん" width={80} height={80} className="w-20 h-auto" />
          </div>

          <div className="px-5 pb-6">
            <Link
              href="/biz/contact"
              className="block text-center text-white font-bold py-3.5 rounded-full shadow-md transition-colors"
              style={{ background: '#E8740C' }}
              onClick={() => setIsMenuOpen(false)}
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
