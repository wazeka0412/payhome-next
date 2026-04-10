'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LINE_URL } from '@/lib/constants';

const LineSvg = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

export default function FixedBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Desktop */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 h-14 items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="ぺいほーむ"
            width={100}
            height={26}
            className="h-6 w-auto"
          />
          <span className="text-sm text-gray-600">家づくりの無料相談受付中</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/consultation"
            className="bg-[#E8740C] text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-[#D4660A] transition-colors"
          >
            無料相談
          </Link>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#06C755] text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-[#05b04c] transition-colors flex items-center gap-1.5"
          >
            <LineSvg size={16} />
            LINE相談
          </a>
          <Link
            href="/diagnosis"
            className="bg-[#3D2200] text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-[#2a1700] transition-colors"
          >
            AI診断
          </Link>
          <Link
            href="/event"
            className="border border-[#E8740C] text-[#E8740C] text-sm font-bold px-4 py-2 rounded-full hover:bg-[#FFF8F0] transition-colors"
          >
            見学会予約
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden h-14 items-center justify-center gap-2 px-3">
        <Link
          href="/consultation"
          className="flex-1 bg-[#E8740C] text-white text-xs font-bold py-2.5 rounded-full text-center hover:bg-[#D4660A] transition-colors"
        >
          無料相談
        </Link>
        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#06C755] text-white text-xs font-bold py-2.5 rounded-full text-center hover:bg-[#05b04c] transition-colors flex items-center justify-center gap-1"
        >
          <LineSvg size={14} />
          LINE
        </a>
        <Link
          href="/diagnosis"
          className="flex-1 bg-[#3D2200] text-white text-xs font-bold py-2.5 rounded-full text-center hover:bg-[#2a1700] transition-colors"
        >
          AI診断
        </Link>
        <Link
          href="/event"
          className="flex-1 border border-[#E8740C] text-[#E8740C] text-xs font-bold py-2.5 rounded-full text-center hover:bg-[#FFF8F0] transition-colors"
        >
          見学会
        </Link>
      </div>
    </div>
  );
}
