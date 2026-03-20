import Link from 'next/link';
import Image from 'next/image';
import {
  SITE_NAME,
  LINE_URL,
  INSTAGRAM_URL,
  TWITTER_URL,
  YOUTUBE_URL,
  YOUTUBE_SUBSCRIBERS,
} from '@/lib/constants';

// Column order matches static HTML: コンテンツ, 運営情報, サービス, 企業様へ
const FOOTER_COLUMNS = [
  {
    heading: 'コンテンツ',
    links: [
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
    heading: '運営情報',
    links: [
      { href: '/about', label: 'ぺいほーむとは' },
      { href: '/company', label: '運営会社' },
    ],
  },
  {
    heading: 'サービス',
    links: [
      { href: '/consultation', label: '無料住宅相談' },
      { href: '/catalog', label: '資料請求' },
      { href: '/event', label: '見学会・イベント' },
      { href: '/builders', label: '工務店一覧' },
      { href: '/simulator', label: 'ローンシミュレーター' },
    ],
  },
  {
    heading: '企業様へ',
    links: [
      { href: '/biz', label: '広告掲載をお考えの企業様' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#3D2200] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image
              src="/images/logo.png"
              alt={SITE_NAME}
              width={140}
              height={36}
              className="h-9 w-auto brightness-0 invert mb-4"
            />
            <p className="text-sm text-gray-300 leading-relaxed mb-5">
              鹿児島・九州を拠点に、家づくりの魅力を動画と記事で届ける住宅メディア。
              <br />
              {YOUTUBE_SUBSCRIBERS}のYouTube登録者と共に、住まいの未来を発信しています。
            </p>
            <div className="flex items-center gap-4">
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
              <a
                href={TWITTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LINE"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link Columns: コンテンツ, 運営情報, サービス, 企業様へ */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-sm font-bold text-white mb-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <span>&copy; {new Date().getFullYear()} payhome. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              利用規約
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
