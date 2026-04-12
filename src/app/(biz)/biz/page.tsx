'use client';

import Link from 'next/link';
import Image from 'next/image';
import MobileMarquee from '@/components/ui/MobileMarquee';
import { SITE_STATS, USER_SIDE_FEATURES, CONTENT_TYPES } from '@/lib/site-config';
import { LINE_URL } from '@/lib/constants';

const stats = [
  { number: SITE_STATS.youtubeSubscribers, label: 'YouTube登録者数' },
  { number: SITE_STATS.videoCount, label: '公開ルームツアー' },
  { number: SITE_STATS.partnerCount, label: '提携工務店' },
  { number: SITE_STATS.prefectureCoverage, label: '対応エリア' },
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
              YouTube登録者{SITE_STATS.youtubeSubscribers}・ルームツアー{SITE_STATS.videoCount}の住宅メディア「ぺいほーむ」が、
              <br className="hidden md:block" />
              AI家づくり診断＋Smart Match 送客システムで、工務店の集客を次のステージへ。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/biz/contact"
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

      {/* ===== PLATFORM FEATURES (USER-SIDE) ===== */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">
              PLATFORM
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold">
              ぺいほーむが提供するユーザー向け機能
            </h2>
            <p className="text-gray-500 mt-4 text-sm md:text-base">
              ユーザーが使う機能だから、工務店は &quot;本気度の高い&quot; リードだけを受け取れる
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {USER_SIDE_FEATURES.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#E8740C] hover:shadow-lg transition"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{f.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold mb-1.5 group-hover:text-[#E8740C] transition">
                      {f.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                  </div>
                </div>
                <div className="mt-4 text-xs text-[#E8740C] font-semibold">
                  ユーザー画面で見る →
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 md:p-8 border border-orange-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  ぺいほーむ CMS は全 {CONTENT_TYPES.length} 種類のコンテンツを一元管理
                </h3>
                <p className="text-sm text-gray-600">
                  動画 {SITE_STATS.videoCount} / 施工事例 {SITE_STATS.totalCaseStudies} / 平屋間取り {SITE_STATS.totalFloorPlans} / 取材 {SITE_STATS.totalInterviews} ほか、提携工務店の情報をまとめて配信
                </p>
              </div>
              <div className="flex flex-wrap gap-2 max-w-md">
                {CONTENT_TYPES.slice(0, 8).map((c) => (
                  <span
                    key={c.key}
                    className="inline-flex items-center gap-1 bg-white border border-orange-200 text-xs text-gray-700 px-3 py-1.5 rounded-full"
                  >
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                  </span>
                ))}
              </div>
            </div>
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
              href="/biz/contact"
              className="inline-block border-2 border-[#E8740C] text-[#E8740C] font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition"
            >
              お問い合わせはこちら
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SIMPLE 3-CTA ===== */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xl font-bold text-center mb-3">まずはお気軽にご連絡ください</h2>
          <p className="text-center text-sm text-gray-500 mb-10">
            広告掲載・ルームツアー撮影のご相談を承ります。
          </p>
          <div className="space-y-4">
            <Link
              href="/biz/contact"
              className="flex items-center gap-4 bg-[#E8740C] text-white rounded-2xl p-6 hover:bg-[#D4660A] transition group"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">&#9993;</div>
              <div>
                <div className="font-bold text-lg">お問い合わせ</div>
                <div className="text-sm opacity-90">広告掲載・ルームツアー撮影のご相談</div>
              </div>
              <div className="ml-auto text-2xl opacity-70 group-hover:translate-x-1 transition">&rarr;</div>
            </Link>
            <Link
              href="/biz/contact?type=document"
              className="flex items-center gap-4 bg-white border-2 border-[#E8740C] text-gray-900 rounded-2xl p-6 hover:bg-orange-50 transition group"
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl flex-shrink-0">&#128196;</div>
              <div>
                <div className="font-bold text-lg">資料請求</div>
                <div className="text-sm text-gray-500">メディアデータ・料金表をお送りします</div>
              </div>
              <div className="ml-auto text-2xl text-[#E8740C] opacity-70 group-hover:translate-x-1 transition">&rarr;</div>
            </Link>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#06C755] text-white rounded-2xl p-6 hover:bg-[#05b34d] transition group"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">&#128172;</div>
              <div>
                <div className="font-bold text-lg">公式LINEでお問い合わせ</div>
                <div className="text-sm opacity-90">チャットで気軽にご相談いただけます</div>
              </div>
              <div className="ml-auto text-2xl opacity-70 group-hover:translate-x-1 transition">&rarr;</div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
