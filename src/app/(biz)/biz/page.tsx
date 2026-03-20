'use client';

import Link from 'next/link';
import Image from 'next/image';
import MobileMarquee from '@/components/ui/MobileMarquee';

const stats = [
  { number: '4.28万+', label: 'YouTube登録者数' },
  { number: '257本', label: '公開動画数' },
  { number: '100+', label: '取材企業数' },
];

const services = [
  {
    title: 'ルームツアー撮影',
    desc: 'プロの映像クルーが完成物件を撮影。YouTube・Instagram・ホームページで活用できる高品質な動画を制作します。',
    icon: '/images/service_roomtour.png',
  },
  {
    title: 'SNS運用代行',
    desc: 'Instagram・YouTube・TikTokの企画・投稿・分析をまるごとお任せ。住宅特化のコンテンツ設計でフォロワーと反響を獲得します。',
    icon: '/images/service_sns.png',
  },
  {
    title: 'WEB制作',
    desc: '住宅会社に特化したホームページ・LP制作。SEO対策とコンバージョン設計で、WEBからの反響数を最大化します。',
    icon: '/images/service_web.png',
  },
  {
    title: 'ポータルサイト掲載',
    desc: 'ぺいほーむが運営する住宅会社ポータルサイトに掲載。AIチャット相談機能を通じて見込み顧客をご紹介します。',
    icon: '/images/service_portal.png',
  },
];

const caseStudies = [
  {
    company: 'A工務店（鹿児島市）',
    title: 'YouTube経由の問い合わせが月3件→月15件に増加',
    excerpt:
      'ルームツアー動画の定期配信とInstagram運用代行を導入。6ヶ月でYouTube登録者1,200人を達成し、動画経由の反響が5倍に。',
  },
  {
    company: 'Bハウス（福岡市）',
    title: 'WEBリニューアルで資料請求数が2.8倍に',
    excerpt:
      'ホームページリニューアルとSEO対策を実施。施工事例ページの充実と動線改善により、月間資料請求数が大幅に向上しました。',
  },
  {
    company: 'Cホーム（熊本市）',
    title: 'SNS運用開始3ヶ月でモデルハウス来場数1.5倍',
    excerpt:
      'Instagramリール動画を中心としたSNS運用を開始。地元ユーザーへのリーチが大幅に増加し、来場予約数の増加に貢献。',
  },
];

const latestInfo = [
  {
    tag: '業界ニュース',
    date: '2026.03.18',
    title: '2026年度 九州エリア新築着工件数、前年比8%増の見通し',
  },
  {
    tag: '集客ノウハウ',
    date: '2026.03.15',
    title: 'ルームツアー動画の再生数を伸ばす7つのテクニック',
  },
  {
    tag: 'セミナー',
    date: '2026.04.15 開催',
    title: 'YouTube集客の始め方｜ゼロから月10件の問い合わせを獲る方法',
  },
];

export default function BizTopPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,#E8740C_0%,transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-4">
              For Housing Companies
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
              住宅会社の集客を、
              <br />
              動画とWEBで変える。
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8">
              YouTube登録者4.28万人・動画257本の住宅メディア「ぺいほーむ」が、
              <br className="hidden md:block" />
              住宅会社の集客をワンストップでサポートします。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/biz/service"
                className="bg-[#E8740C] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#D4660A] transition"
              >
                サービス詳細を見る
              </Link>
              <Link
                href="/biz/contact"
                className="border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition"
              >
                お問い合わせ
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 md:gap-16 mt-16 pt-8 border-t border-white/10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-extrabold text-[#E8740C] font-mono">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/0gxkNh2BC0A"
                title="ルームツアー"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <Image
              src="/images/pei_wink.png"
              alt="ペイさん"
              width={120}
              height={120}
              className="absolute -bottom-6 -right-6 w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-lg hidden md:block"
            />
          </div>
        </div>
      </section>

      {/* ===== SERVICE CARDS ===== */}
      <section className="bg-gray-50 py-20 relative">
        <Image
          src="/images/pei_think.png"
          alt=""
          width={120}
          height={120}
          className="absolute top-8 right-8 w-20 h-20 object-contain opacity-50 hidden lg:block"
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">
              SERVICE
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold">パッケージプラン</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link
                key={service.title}
                href="/biz/service"
                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition"
              >
                <div className="w-16 h-16 mb-4">
                  <Image src={service.icon} alt={service.title} width={64} height={64} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-[#E8740C] transition">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.desc}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/biz/service"
              className="inline-block border-2 border-[#E8740C] text-[#E8740C] font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition"
            >
              サービス詳細を見る
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CASE STUDY ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">
              CASE STUDY
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold">導入事例</h2>
          </div>
          <MobileMarquee desktopGridClass="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((cs) => (
              <div
                key={cs.company}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                  Photo
                </div>
                <div className="p-6">
                  <p className="text-xs text-[#E8740C] font-semibold mb-2">{cs.company}</p>
                  <h3 className="font-bold mb-2 leading-snug">{cs.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{cs.excerpt}</p>
                </div>
              </div>
            ))}
          </MobileMarquee>
          <div className="text-center mt-10">
            <Link
              href="/biz/service"
              className="inline-block border-2 border-[#E8740C] text-[#E8740C] font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition"
            >
              導入事例の詳細を見る
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #E8740C 0%, #F5A623 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Image src="/images/pei_surprise.png" alt="ペイさん" width={80} height={80} className="mx-auto mb-6 w-20 h-20 object-contain" />
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
            まずはお気軽にご相談ください
          </h2>
          <p className="text-white/80 mb-8 leading-relaxed">
            住宅会社の集客課題をヒアリングし、最適なプランをご提案いたします。
            <br className="hidden md:block" />
            オンライン相談も対応可能です。
          </p>
          <Link
            href="/biz/contact"
            className="inline-block bg-white text-[#E8740C] font-semibold px-10 py-4 rounded-full hover:bg-gray-50 transition text-lg shadow-lg"
          >
            お問い合わせはこちら
          </Link>
        </div>
      </section>

      {/* ===== LATEST INFO ===== */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">
              LATEST
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold">最新情報</h2>
          </div>
          <MobileMarquee desktopGridClass="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestInfo.map((info) => (
              <div
                key={info.title}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition"
              >
                <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                  Photo
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs bg-orange-50 text-[#E8740C] font-semibold px-2 py-0.5 rounded">
                      {info.tag}
                    </span>
                    <span className="text-xs text-gray-400">{info.date}</span>
                  </div>
                  <h3 className="font-bold text-sm leading-snug">{info.title}</h3>
                </div>
              </div>
            ))}
          </MobileMarquee>
          <div className="text-center mt-10">
            <Link
              href="/biz/news"
              className="inline-block border-2 border-[#E8740C] text-[#E8740C] font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition"
            >
              最新情報をもっと見る
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PARTNER CTA BANNER ===== */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative bg-gradient-to-r from-[#E8740C] to-[#F5A623] rounded-3xl p-10 md:p-14 text-center text-white overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/10 rounded-full" />
            <h2 className="relative text-xl md:text-2xl font-extrabold mb-3">
              提携パートナーを募集しています
            </h2>
            <p className="relative text-sm opacity-90 mb-1">
              記事掲載は無料。ルームツアー動画はオプション。
            </p>
            <p className="relative text-xs opacity-80 mb-6">
              反響課金型なので、初期費用ゼロでスタートできます。
            </p>
            <div className="relative flex flex-wrap gap-3 justify-center">
              <Link
                href="/biz/partner"
                className="bg-white text-[#E8740C] font-bold px-8 py-3 rounded-full hover:bg-gray-50 transition text-sm"
              >
                パートナープログラムの詳細 &rarr;
              </Link>
              <Link
                href="/biz/contact"
                className="border-2 border-white/60 text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition text-sm"
              >
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
