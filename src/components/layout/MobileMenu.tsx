'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

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
  const { data: session } = useSession();
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
        {/* v4.0: 会員/ゲスト切り替え + AI診断primaryCTA */}
        <Link
          href="/diagnosis"
          className="flex items-center justify-between w-full mb-4 px-5 py-3.5 rounded-xl font-bold text-sm text-white bg-[#E8740C] hover:bg-[#D4660A] shadow-[0_2px_8px_rgba(232,116,12,0.25)] transition-colors"
          onClick={onClose}
        >
          <span>AI家づくり診断をはじめる</span>
          <span className="text-lg">→</span>
        </Link>

        {session?.user ? (
          <div className="mb-5 p-4 rounded-xl bg-[#FFF8F0] border border-[#E8740C]/20">
            <p className="text-xs text-gray-500 mb-1">ログイン中</p>
            <p className="text-sm font-bold text-[#3D2200] mb-3 truncate">
              {(session.user as { name?: string | null }).name ||
                (session.user as { email?: string | null }).email}
            </p>
            <div className="flex gap-2">
              <Link
                href="/mypage"
                className="flex-1 text-center bg-[#E8740C] text-white text-xs font-bold py-2 rounded-full hover:bg-[#D4660A] transition"
                onClick={onClose}
              >
                マイページ
              </Link>
              <button
                onClick={() => {
                  onClose();
                  signOut({ callbackUrl: '/' });
                }}
                className="flex-1 border border-gray-300 text-gray-600 text-xs font-bold py-2 rounded-full hover:bg-gray-50 transition"
              >
                ログアウト
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-5 grid grid-cols-2 gap-2">
            <Link
              href="/login"
              className="text-center bg-white border border-[#E8740C] text-[#E8740C] font-bold py-3 rounded-full text-sm hover:bg-[#FFF8F0] transition"
              onClick={onClose}
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="text-center bg-[#E8740C] text-white font-bold py-3 rounded-full text-sm hover:bg-[#D4660A] transition"
              onClick={onClose}
            >
              会員登録
            </Link>
          </div>
        )}

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

        {/* 企業様リンク（v4.0: 目立たない位置に） */}
        <div className="mb-5 pt-3 border-t border-gray-100">
          <Link
            href="/biz"
            className="flex items-center gap-3 py-2 px-3 text-xs text-gray-500 hover:text-[#E8740C] transition"
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

      {/* Bottom CTA: v4.0 は AI診断 を主導線に */}
      <div className="px-5 pb-6">
        <Link
          href="/diagnosis"
          className="block text-center text-white font-bold py-3.5 rounded-full shadow-[0_4px_12px_rgba(232,116,12,0.3)] bg-[#E8740C] hover:bg-[#D4660A] transition-colors"
          onClick={onClose}
        >
          AI家づくり診断をはじめる
        </Link>
      </div>
    </div>
  );
}
