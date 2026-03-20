'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-4 bottom-20 z-30 flex flex-col items-center gap-1 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="ページトップへ戻る"
    >
      <Image
        src="/images/icon.png"
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform"
      />
      <span className="text-[10px] font-bold text-[#E8740C]">TOPへ</span>
    </button>
  );
}
