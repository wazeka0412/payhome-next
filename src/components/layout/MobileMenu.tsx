'use client';

import Link from 'next/link';
import Image from 'next/image';

interface NavGroup {
  label: string;
  items: { href: string; label: string }[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navContent: NavGroup[];
}

export default function MobileMenu({ isOpen, onClose, navContent }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto">
      {/* Header — ロゴ + 閉じるボタン */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <Image
          src="/images/logo.png"
          alt="Pei Home"
          width={160}
          height={44}
          className="h-10 w-auto"
        />
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-lg"
          aria-label="閉じる"
        >
          ✕
        </button>
      </div>

      {/* Body — グループ一覧 */}
      <div className="flex-1 px-5 py-5">
        {/* マイページ — 上部に目立つように配置 */}
        <Link
          href="/mypage"
          className="flex items-center justify-between w-full mb-5 px-5 py-3.5 rounded-xl border-2 border-[#E8740C] text-[#E8740C] font-bold text-sm hover:bg-[#E8740C] hover:text-white transition-all"
          onClick={onClose}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FFF8F0] flex items-center justify-center overflow-hidden">
              <Image src="/images/pei_wink.png" alt="" width={24} height={24} className="object-contain" />
            </div>
            <span>マイページ</span>
          </div>
          <span>→</span>
        </Link>

        {navContent.map((group) => (
          <div key={group.label} className="mb-5">
            {/* グループタイトル（オレンジ + 下線） */}
            <div
              className="text-xs font-bold tracking-wider pb-2 mb-1"
              style={{
                color: '#E8740C',
                borderBottom: '2px solid #E8740C',
                letterSpacing: '0.1em',
              }}
            >
              {group.label}
            </div>
            {/* リンク一覧 */}
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 py-3.5 px-3 text-[0.95rem] font-medium text-gray-800 border-b border-gray-100 hover:bg-orange-50 hover:text-[#E8740C] hover:pl-5 transition-all"
                onClick={onClose}
              >
                {/* オレンジ丸ドット */}
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: '#E8740C', opacity: 0.5 }}
                />
                {item.label}
              </Link>
            ))}
          </div>
        ))}

        {/* 企業様リンク */}
        <div className="mb-5">
          <Link
            href="/biz"
            className="flex items-center gap-3 py-3.5 px-3 text-[0.95rem] font-bold hover:bg-orange-50 transition-all"
            style={{ color: '#E8740C' }}
            onClick={onClose}
          >
            広告掲載をお考えの企業様 →
          </Link>
        </div>
      </div>

      {/* Character */}
      <div className="flex justify-center py-4">
        <Image
          src="/images/pei_smile.png"
          alt="ペイさん"
          width={80}
          height={80}
          className="w-20 h-auto"
        />
      </div>

      {/* Bottom CTA */}
      <div className="px-5 pb-6">
        <Link
          href="/biz"
          className="block text-center text-white font-bold py-3.5 rounded-full shadow-md transition-colors"
          style={{ background: '#E8740C' }}
          onClick={onClose}
        >
          広告掲載をお考えの企業様
        </Link>
      </div>
    </div>
  );
}
