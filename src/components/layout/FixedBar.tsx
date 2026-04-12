'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LINE_URL } from '@/lib/constants';

/**
 * 固定追従バー (MVP v2 仕様)
 *
 * 優先順位:
 *   1. 無料相談 (成約報酬の主要入口。最も目立たせる)
 *   2. AI家づくり診断 (10問。会員登録誘導)
 *   3. 見学会予約 (¥50,000/件 の課金入口)
 *   4. LINE 相談 (ライトな入口)
 *
 * スクロール 400px 以下では非表示。
 * スマホは横スクロール可能な横並び、PC は max-w-7xl のコンテナ中央配置。
 */

const LineSvg = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

export default function FixedBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsVisible(y > 400);
      setShowScrollTop(y > 800);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll-to-top button (右下、固定バーの上) */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="ページ上部へ"
        className={`fixed right-4 z-40 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg flex items-center justify-center text-[#3D2200] hover:bg-[#FFF8F0] hover:text-[#E8740C] transition-all duration-300 ${
          showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0) + 72px)' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      </button>

      {/* Fixed bottom bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
      >
        {/* Desktop (lg以上) */}
        <div className="hidden lg:flex max-w-7xl mx-auto px-5 h-[68px] items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Image
              src="/images/logo.png"
              alt="ぺいほーむ"
              width={100}
              height={26}
              className="h-7 w-auto shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-[#3D2200] truncate">
                家づくりのプロに無料相談
              </span>
              <span className="text-[11px] text-gray-500 truncate">
                AI診断・見学会予約・住宅相談まで 全て無料で対応
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Primary: 無料相談 (成約報酬の主要入口) */}
            <Link
              href="/consultation"
              className="bg-[#E8740C] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#D4660A] transition-colors shadow-[0_2px_8px_rgba(232,116,12,0.3)] flex items-center gap-1.5"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              無料相談
            </Link>
            {/* Secondary: AI診断 */}
            <Link
              href="/diagnosis"
              className="bg-[#3D2200] text-white text-sm font-bold px-4 py-2.5 rounded-full hover:bg-[#2a1700] transition-colors flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
              AI診断
            </Link>
            {/* Tertiary: 見学会予約 */}
            <Link
              href="/event"
              className="border-2 border-[#E8740C] text-[#E8740C] text-sm font-bold px-4 py-2 rounded-full hover:bg-[#FFF8F0] transition-colors flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              見学会予約
            </Link>
            {/* Quaternary: LINE */}
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#06C755] text-white text-sm font-bold px-4 py-2.5 rounded-full hover:bg-[#05a648] transition-colors flex items-center gap-1.5"
            >
              <LineSvg size={15} />
              LINE
            </a>
          </div>
        </div>

        {/* Tablet (md〜lg) */}
        <div className="hidden md:flex lg:hidden max-w-5xl mx-auto px-4 h-[60px] items-center justify-center gap-2">
          <Link
            href="/consultation"
            className="flex-[1.3] bg-[#E8740C] text-white text-sm font-bold py-2.5 rounded-full text-center hover:bg-[#D4660A] transition-colors shadow-[0_2px_8px_rgba(232,116,12,0.3)]"
          >
            無料相談
          </Link>
          <Link
            href="/diagnosis"
            className="flex-1 bg-[#3D2200] text-white text-sm font-bold py-2.5 rounded-full text-center hover:bg-[#2a1700] transition-colors"
          >
            AI診断
          </Link>
          <Link
            href="/event"
            className="flex-1 border-2 border-[#E8740C] text-[#E8740C] text-sm font-bold py-2 rounded-full text-center hover:bg-[#FFF8F0] transition-colors"
          >
            見学会
          </Link>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#06C755] text-white text-sm font-bold py-2.5 rounded-full text-center hover:bg-[#05a648] transition-colors flex items-center justify-center gap-1"
          >
            <LineSvg size={14} />
            LINE
          </a>
        </div>

        {/* Mobile (<md) */}
        <div className="flex md:hidden h-16 items-stretch justify-center gap-1.5 px-2.5 py-2">
          <Link
            href="/consultation"
            className="flex-[1.4] bg-[#E8740C] text-white text-[11px] font-bold rounded-full flex flex-col items-center justify-center gap-0.5 hover:bg-[#D4660A] active:scale-95 transition-all shadow-[0_2px_8px_rgba(232,116,12,0.3)]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>無料相談</span>
          </Link>
          <Link
            href="/diagnosis"
            className="flex-1 bg-[#3D2200] text-white text-[11px] font-bold rounded-full flex flex-col items-center justify-center gap-0.5 hover:bg-[#2a1700] active:scale-95 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            <span>AI診断</span>
          </Link>
          <Link
            href="/event"
            className="flex-1 border-2 border-[#E8740C] text-[#E8740C] text-[11px] font-bold rounded-full flex flex-col items-center justify-center gap-0.5 hover:bg-[#FFF8F0] active:scale-95 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span>見学会</span>
          </Link>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#06C755] text-white text-[11px] font-bold rounded-full flex flex-col items-center justify-center gap-0.5 hover:bg-[#05a648] active:scale-95 transition-all"
          >
            <LineSvg size={14} />
            <span>LINE</span>
          </a>
        </div>
      </div>
    </>
  );
}
