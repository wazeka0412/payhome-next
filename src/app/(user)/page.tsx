'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import MobileMarquee from '@/components/ui/MobileMarquee';
import CampaignSection from '@/components/layout/CampaignSection';

/* ── Data ─────────────────────────────────────────── */

const reviews = [
  { name: 'A様ご家族', area: '鹿児島市', text: '動画で見た平屋に一目惚れ。ぺいほーむに相談したら、すぐに同じ工務店を紹介してもらえました。動画で間取りを確認していたので、打ち合わせもスムーズでした。' },
  { name: 'B様ご夫婦', area: '福岡市', text: '住宅展示場を何件も回るのが大変でしたが、ぺいほーむの動画で効率よく比較できました。価格や設備の情報も記事で詳しく分かるのが良かったです。' },
  { name: 'C様', area: '熊本市', text: 'セカンドライフの平屋を探していました。AIチャットで「バリアフリーの平屋」と聞いたら、ぴったりの物件を3つも紹介してくれました。' },
  { name: 'D様ご家族', area: '宮崎市', text: '初めての家づくりで不安でしたが、ぺいほーむの動画と記事で基礎知識を学べました。紹介してもらった工務店さんも親切で、大満足の家が建ちました。' },
  { name: 'E様', area: '大分市', text: '予算2,000万円台で平屋を探していましたが、ぺいほーむで理想の間取りを見つけることができました。ローンシミュレーターも便利でした。' },
];

function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, j) => (
          <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        ))}
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1 line-clamp-5">{review.text}</p>
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-10 h-10 rounded-full bg-[#FFF8F0] flex items-center justify-center text-xs text-[#E8740C] font-bold">{review.name[0]}</div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{review.name}</p>
          <p className="text-xs text-gray-400">{review.area}</p>
        </div>
      </div>
    </div>
  );
}

const featuredSlides = [
  {
    youtubeId: '0gxkNh2BC0A',
    title: '【ルームツアー】小さなかわいい平屋。。',
    views: '99万回視聴',
    desc: 'チャンネル最高再生数99万回！コンパクトで愛らしい平屋のルームツアー。',
  },
  {
    youtubeId: 'm_ndZJfV8a0',
    title: '【ルームツアー】老後も安心して過ごせる最先端の平屋',
    views: '91万回視聴',
    desc: '91万回視聴の大人気動画。老後も安心して暮らせる最先端の平屋をご紹介。',
  },
  {
    youtubeId: 'YhgQSfYYUJ0',
    title: '【ルームツアー】完璧な間取りのお洒落で超かわいい平屋',
    views: '78万回視聴',
    desc: '78万回視聴！完璧な間取りとおしゃれなデザインが詰まった平屋。',
  },
];

const latestVideos = [
  {
    id: '01',
    youtubeId: 'lPIxPVV2jm4',
    title: '【平屋ルームツアー】おひとり様の理想を叶えた平家',
    views: '13万回視聴',
  },
  {
    id: '02',
    youtubeId: 'eWbyhRr-K1w',
    title: '【平屋ルームツアー】まるで\u201C高級ホテル\u201D豪華すぎるシンプルな平屋',
    views: '1万回視聴',
  },
  {
    id: '03',
    youtubeId: 'TESbCN-am3k',
    title: '【平屋ルームツアー】令和時代に爆発的人気な間取りの平屋',
    views: '1.8万回視聴',
  },
];

const interviews = [
  {
    id: 'interview-01',
    company: '○○工務店（鹿児島市）',
    title: '「住む人の暮らし」から逆算する家づくりとは',
    excerpt:
      '地元の素材を活かし、住む人のライフスタイルに寄り添う設計哲学を聞きました。',
  },
  {
    id: 'interview-02',
    company: '△△ハウス（福岡市）',
    title: '年間200棟を手がけるハウスメーカーの品質管理',
    excerpt: '大量供給と品質を両立させる仕組みの裏側に迫ります。',
  },
];

const newsItems = [
  {
    id: '01',
    date: '2026.03.18',
    tag: 'お知らせ',
    title: 'ウェビナー「九州の住宅トレンド2026」開催のお知らせ',
  },
  {
    id: '02',
    date: '2026.03.15',
    tag: '業界',
    title: '2026年度の住宅省エネ基準改正について解説',
  },
  {
    id: '03',
    date: '2026.03.10',
    tag: 'コラム',
    title: '「良い工務店」の見分け方 ― 10のチェックポイント',
  },
  {
    id: '04',
    date: '2026.03.05',
    tag: 'お知らせ',
    title: '月刊ぺいほーむ 3月号を公開しました',
  },
];

const articles = [
  {
    id: 'article-01',
    tag: '基礎知識',
    date: '2026.03.16',
    title: '注文住宅の相場はいくら？鹿児島県の最新データ',
  },
  {
    id: 'article-02',
    tag: '住宅ローン',
    date: '2026.03.12',
    title: '住宅ローン審査に通るための5つのポイント',
  },
  {
    id: 'article-03',
    tag: '間取り',
    date: '2026.03.08',
    title: '失敗しない間取りの考え方｜プロが教える動線設計',
  },
];

/* ── Component ────────────────────────────────────── */

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % featuredSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length,
    );
  }, []);

  // Autoplay
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
  };

  return (
    <>
      {/* ===== 1. HERO ===== */}
      <section className="bg-gradient-to-br from-[#E8740C] via-[#F5A623] to-[#E8740C] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left content */}
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase opacity-80 mb-3">
                Housing Media
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                家づくりを、
                <br />
                もっと楽しく、もっと身近に。
              </h1>
              <p className="text-sm md:text-base opacity-90 leading-relaxed mb-6">
                ぺいほーむは鹿児島・九州を拠点に、工務店・ハウスメーカーの魅力を
                <br className="hidden md:inline" />
                動画と記事で届ける住宅メディアです。
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link
                  href="/videos"
                  className="bg-white text-[#E8740C] font-bold px-8 py-3 rounded-full text-sm hover:bg-gray-100 transition text-center max-w-[280px] w-full"
                >
                  最新動画を見る
                </Link>
                <Link
                  href="/about"
                  className="border border-white/40 text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-white/10 transition text-center max-w-[280px] w-full"
                >
                  ぺいほーむとは
                </Link>
              </div>
              <div className="flex gap-8 md:gap-12">
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold font-mono">
                    4.28万+
                  </div>
                  <div className="text-xs opacity-80 mt-1">YouTube登録者数</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold font-mono">
                    257本
                  </div>
                  <div className="text-xs opacity-80 mt-1">公開動画数</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold font-mono">
                    100+
                  </div>
                  <div className="text-xs opacity-80 mt-1">取材企業数</div>
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/lPIxPVV2jm4"
                  title="【平屋ルームツアー】おひとり様の理想を叶えた平家"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  style={{ borderRadius: 'inherit' }}
                />
              </div>
              <Image
                src="/images/pei_wink.png"
                alt="ペイさん"
                width={100}
                height={100}
                className="absolute -bottom-6 -right-4 md:-right-8 w-20 md:w-24 h-auto drop-shadow-lg"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== キャンペーン告知 ===== */}
      <CampaignSection />

      {/* ===== 2. はじめての方へ ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">
            FOR BEGINNERS
          </p>
          <h2 className="text-2xl font-bold text-center text-[#3D2200] mb-3">
            はじめての方へ
          </h2>
          <p className="text-center text-sm text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            ぺいほーむは、家づくりを考えるすべての方に役立つ情報を
            <br />
            動画と記事でわかりやすくお届けする住宅メディアです。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[900px] mx-auto">
            {[
              {
                num: 1,
                title: '動画で家を見る',
                desc: 'プロが撮影した平屋のルームツアー動画で、間取りや内装をリアルに体感できます。',
              },
              {
                num: 2,
                title: '記事で詳しく知る',
                desc: '価格・間取り図・設備メーカーなど、動画では伝えきれない詳細情報を記事で確認。',
              },
              {
                num: 3,
                title: '無料で相談する',
                desc: '気になる家があれば、ぺいほーむに無料相談。あなたに合った工務店を厳選してご紹介します。',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-[#FFF8F0] rounded-2xl py-7 px-5 text-center"
              >
                <div className="w-14 h-14 bg-[#E8740C]/10 rounded-full mx-auto mb-3.5 flex items-center justify-center">
                  <span className="text-xl font-extrabold text-[#E8740C]">
                    {step.num}
                  </span>
                </div>
                <h4 className="text-[0.95rem] font-bold mb-2">{step.title}</h4>
                <p className="text-[0.8rem] text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/consultation"
              className="inline-block bg-[#E8740C] text-white font-bold px-10 py-4 rounded-full text-base hover:bg-[#D4660A] transition"
            >
              無料相談の詳細はこちら &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 3. 注目コンテンツ (PICK UP slider) ===== */}
      <section className="py-16 md:py-20 bg-[#F5F0EB] relative overflow-hidden">
        {/* Decorative character */}
        <Image
          src="/images/pei_think.png"
          alt=""
          width={120}
          height={120}
          className="absolute top-8 right-4 md:right-12 w-16 md:w-24 h-auto opacity-80 hidden md:block"
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#E8740C]/10 text-[#E8740C] text-xs font-bold px-4 py-1.5 rounded-full mb-3">
              <Image
                src="/images/logo_face.png"
                alt=""
                width={20}
                height={20}
                className="w-5 h-5"
              />
              PICK UP
            </div>
            <h2 className="text-2xl font-bold text-[#3D2200] mt-3">
              注目コンテンツ
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              ぺいほーむで今もっとも注目されている動画をピックアップ
            </p>
          </div>

          {/* Slider */}
          <div
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredSlides.map((slide) => (
                  <a
                    key={slide.youtubeId}
                    href={`https://www.youtube.com/watch?v=${slide.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex-shrink-0 block bg-white rounded-2xl overflow-hidden shadow-sm"
                  >
                    <div className="grid md:grid-cols-2">
                      {/* Image side */}
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={`https://img.youtube.com/vi/${slide.youtubeId}/maxresdefault.jpg`}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 bg-black/50 rounded-full flex items-center justify-center text-white text-xl backdrop-blur-sm">
                            ▶
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center gap-1">
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                            人気
                          </span>
                          <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                            {slide.views}
                          </span>
                        </div>
                      </div>
                      {/* Text side */}
                      <div className="p-6 flex flex-col justify-center">
                        <span className="text-xs font-semibold text-[#E8740C] bg-[#E8740C]/10 px-2 py-0.5 rounded w-fit">
                          ルームツアー
                        </span>
                        <h3 className="text-lg font-bold mt-3 line-clamp-2">
                          {slide.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {slide.desc}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Prev / Next */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-white transition z-10"
              aria-label="前へ"
            >
              &#8249;
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-white transition z-10"
              aria-label="次へ"
            >
              &#8250;
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {featuredSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === currentSlide ? 'bg-[#E8740C]' : 'bg-gray-300'
                  }`}
                  aria-label={`スライド ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. 最新動画 ===== */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">
            Videos
          </p>
          <h2 className="text-2xl font-bold text-[#3D2200] mb-8">最新動画</h2>
          <MobileMarquee desktopGridClass="grid md:grid-cols-3 gap-6">
            {latestVideos.map((video) => (
              <Card
                key={video.id}
                href={`/property/${video.id}`}
                imageSrc={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                imageAlt={video.title}
                tag="ルームツアー"
                meta={video.views}
                title={video.title}
                showPlay
              />
            ))}
          </MobileMarquee>
          <div className="text-center mt-8">
            <Link
              href="/videos"
              className="inline-block border-2 border-[#E8740C] text-[#E8740C] font-bold px-8 py-3 rounded-full text-sm hover:bg-[#E8740C] hover:text-white transition"
            >
              動画一覧を見る
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 5. 取材レポート PICK UP ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">
            Interview
          </p>
          <h2 className="text-2xl font-bold text-[#3D2200] mb-8">
            取材レポート
          </h2>
          {/* PC: 横型カード2列 / モバイル: 縦型カード無限マーキー（旧サイトと同一） */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            {interviews.map((item) => (
              <Link
                key={item.id}
                href="/interview"
                className="group flex bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="w-48 flex-shrink-0 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFF8F0, #FDEBD0)' }}>
                  <img src="/images/pei_think.png" alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', opacity: 0.5, marginBottom: '4px' }} />
                  <span style={{ color: '#ccc', fontSize: '0.75rem' }}>取材写真</span>
                </div>
                <div className="p-5 flex-1">
                  <p className="text-xs text-[#E8740C] font-semibold mb-1">
                    {item.company}
                  </p>
                  <h3 className="text-sm font-bold mb-2 group-hover:text-[#E8740C] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {item.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {/* モバイル: 縦型カード無限マーキー */}
          <div className="md:hidden">
            <MobileMarquee desktopGridClass="grid grid-cols-2 gap-4">
              {interviews.map((item) => (
                <Link
                  key={item.id}
                  href="/interview"
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow block"
                >
                  <div className="aspect-[4/3] flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFF8F0, #FDEBD0)' }}>
                    <img src="/images/pei_think.png" alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', opacity: 0.5, marginBottom: '4px' }} />
                    <span style={{ color: '#ccc', fontSize: '0.75rem' }}>取材写真</span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-[#E8740C] font-semibold mb-1">
                      {item.company}
                    </p>
                    <h3 className="text-sm font-bold line-clamp-2 group-hover:text-[#E8740C] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </MobileMarquee>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/interview"
              className="inline-block border-2 border-[#E8740C] text-[#E8740C] font-bold px-8 py-3 rounded-full text-sm hover:bg-[#E8740C] hover:text-white transition"
            >
              取材一覧を見る
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 6. 月刊ぺいほーむ ===== */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">
              Digital Magazine
            </p>
            <h2 className="text-2xl font-bold text-[#3D2200]">
              月刊ぺいほーむ
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            <div className="bg-gray-100 rounded-2xl aspect-[3/4] flex items-center justify-center text-gray-400">
              Cover Image
            </div>
            <div>
              <span className="text-xs font-semibold text-[#E8740C] bg-[#E8740C]/10 px-2 py-0.5 rounded">
                最新号
              </span>
              <h3 className="text-lg font-bold mt-3">
                月刊ぺいほーむ 2026年3月号
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                特集「鹿児島・九州の注目工務店10選」—
                地元の気候風土を知り尽くした工務店が提案する、次世代の家づくり。
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-gray-600">
                <li>・鹿児島の注目工務店10選</li>
                <li>・住宅ローン金利の最新トレンド</li>
                <li>・施主インタビュー：建てて1年後のリアル</li>
                <li>・ぺいほーむ取材の裏側</li>
              </ul>
              <Link
                href="/magazine"
                className="inline-block bg-[#E8740C] text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-[#D4660A] transition mt-6"
              >
                詳しく見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. ニュース ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">
            News
          </p>
          <h2 className="text-2xl font-bold text-[#3D2200] mb-8">
            ぺいほーむニュース
          </h2>
          <div className="divide-y divide-gray-100">
            {newsItems.map((item) => (
              <Link
                key={item.id}
                href="/news"
                className="flex flex-wrap items-center gap-3 py-4 hover:bg-gray-50 transition-colors px-2 rounded"
              >
                <span className="text-xs text-gray-400 w-24">{item.date}</span>
                <span className="text-xs font-semibold text-[#E8740C] bg-[#E8740C]/10 px-2 py-0.5 rounded">
                  {item.tag}
                </span>
                <span className="text-sm text-gray-800 flex-1">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/news"
              className="inline-block border-2 border-[#E8740C] text-[#E8740C] font-bold px-8 py-3 rounded-full text-sm hover:bg-[#E8740C] hover:text-white transition"
            >
              ニュース一覧
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 8. お役立ち記事 ===== */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">
            Articles
          </p>
          <h2 className="text-2xl font-bold text-[#3D2200] mb-8">
            お役立ち記事
          </h2>
          <MobileMarquee desktopGridClass="grid md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card
                key={article.id}
                href="/articles"
                tag={article.tag}
                meta={article.date}
                title={article.title}
                placeholder="Article Image"
              />
            ))}
          </MobileMarquee>
          <div className="text-center mt-8">
            <Link
              href="/articles"
              className="inline-block border-2 border-[#E8740C] text-[#E8740C] font-bold px-8 py-3 rounded-full text-sm hover:bg-[#E8740C] hover:text-white transition"
            >
              記事一覧を見る
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 9. ポータルバナー (AI chat CTA) ===== */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#E8740C] to-[#F5A623] rounded-2xl p-8 md:p-12 flex items-center gap-6 text-white relative overflow-hidden">
            <div className="flex-1">
              <p className="text-sm md:text-base leading-relaxed">
                AIチャット相談で、あなたにぴったりの住宅会社が見つかります。ぺいほーむ取材済みの会社を中心にご紹介。
              </p>
            </div>
            <Image
              src="/images/pei_confused.png"
              alt="ペイさん"
              width={100}
              height={100}
              className="w-20 md:w-24 h-auto flex-shrink-0 hidden md:block"
            />
          </div>
        </div>
      </section>

      {/* ===== お客様の声 ===== */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2 text-center">Voice</p>
          <h2 className="text-2xl font-bold text-[#3D2200] mb-10 text-center">お客様の声</h2>
          {/* PC: グリッド表示 */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {reviews.map((review, i) => <ReviewCard key={i} review={review} />)}
          </div>
          {/* モバイル: 無限スライダー */}
          <div className="md:hidden">
            <MobileMarquee>
              {reviews.map((review, i) => (
                <div key={i} className="marquee-card-wide">
                  <ReviewCard review={review} />
                </div>
              ))}
            </MobileMarquee>
          </div>
          <div className="text-center mt-8">
            <Link href="/voice" className="inline-block border-2 border-[#E8740C] text-[#E8740C] font-semibold px-8 py-3 rounded-full hover:bg-[#E8740C] hover:text-white transition text-sm">
              お客様の声をもっと見る →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 10. CTA バナー (housing company CTA) ===== */}
      <section className="bg-gradient-to-r from-[#3D2200] to-[#E8740C] text-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase opacity-80 mb-2">
                For Housing Companies
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                住宅会社の集客を、動画とWEBで変える。
              </h2>
              <p className="text-sm opacity-90 leading-relaxed mb-6">
                ルームツアー撮影・SNS運用・WEB制作をパッケージでご提供。
                <br />
                まずはお気軽にご相談ください。
              </p>
              <a
                href="/biz"
                className="inline-block bg-white text-[#E8740C] font-bold px-8 py-3 rounded-full text-sm hover:bg-gray-100 transition"
              >
                サービス詳細を見る
              </a>
            </div>
            <Image
              src="/images/pei_surprise.png"
              alt="ペイさん"
              width={120}
              height={120}
              className="w-20 md:w-28 h-auto flex-shrink-0 hidden md:block"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>
    </>
  );
}
