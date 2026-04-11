import type { Metadata } from 'next';
import BizHeader from '@/components/layout/BizHeader';
import BizPageLoader from './BizPageLoader';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    template: '%s | ぺいほーむ for Business',
    default: '住宅会社の方へ | ぺいほーむ for Business',
  },
  description:
    'YouTube登録者4.28万人の住宅メディア「ぺいほーむ」が、住宅会社の集客を動画とWEBでワンストップサポート。',
};

export default function BizLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BizPageLoader />
      <BizHeader />
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <Image src="/images/logo.png" alt="ぺいほーむ" width={140} height={40} className="h-9 w-auto brightness-0 invert" />
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                住宅会社の集客を、動画とWEBで変える。<br />
                YouTube登録者4.28万人の住宅メディア「ぺいほーむ」が集客をサポートします。
              </p>
              <div className="flex gap-4 mt-4">
                <a href="https://www.youtube.com/@pei_home" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-[#E8740C] transition">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://www.instagram.com/pei_home_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#E8740C] transition">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </a>
                <a href="https://x.com/pei_home_" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-[#E8740C] transition">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://line.me/R/ti/p/@253gzmoh" target="_blank" rel="noopener noreferrer" aria-label="LINE" className="hover:text-[#E8740C] transition">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
                </a>
              </div>
            </div>

            {/* About — MVPは /biz TOP と /biz/contact のみ公開 */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">ぺいほーむについて</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/biz" className="hover:text-[#E8740C] transition">サービス TOP</Link></li>
                <li><Link href="/biz/contact" className="hover:text-[#E8740C] transition">お問い合わせ</Link></li>
                <li><Link href="/about" className="hover:text-[#E8740C] transition">ぺいほーむとは</Link></li>
                <li><Link href="/company" className="hover:text-[#E8740C] transition">運営会社</Link></li>
                <li><Link href="/" className="hover:text-[#E8740C] transition">ユーザー向けサイト</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <span>&copy; 2026 Pei Home by 株式会社wazeka. All rights reserved.</span>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-gray-300 transition">プライバシーポリシー</Link>
              <Link href="/terms" className="hover:text-gray-300 transition">利用規約</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
