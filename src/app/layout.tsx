import type { Metadata } from 'next';
import { Montserrat, Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://payhome.jp'),
  title: {
    default: 'ぺいほーむ | 住宅メディア - 家づくりをもっと楽しく',
    template: '%s | ぺいほーむ',
  },
  description:
    'YouTube登録者4.28万人の住宅メディア「ぺいほーむ」。平屋のルームツアー動画と記事で、家づくりの情報をわかりやすくお届けします。無料住宅相談も受付中。',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: 'ぺいほーむ',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pei_home_',
  },
  icons: {
    icon: '/images/pei_wink.png',
    apple: '/images/pei_wink.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${montserrat.variable} ${notoSansJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
