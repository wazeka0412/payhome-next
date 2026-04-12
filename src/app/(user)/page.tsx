'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MobileMarquee from '@/components/ui/MobileMarquee';
import CampaignSection from '@/components/layout/CampaignSection';
import { videos } from '@/lib/videos-data';
import { builders } from '@/lib/builders-data';
import { caseStudies } from '@/lib/case-studies-data';

/* ── Data ─────────────────────────────────────────── */

const reviews = [
  { name: 'A様ご家族', area: '鹿児島市', text: '動画で見た平屋に一目惚れ。AI診断で同じ工務店を紹介してもらえました。動画で間取りを確認していたので、見学会もスムーズでした。' },
  { name: 'B様ご夫婦', area: '福岡市', text: '住宅展示場を何件も回るのが大変でしたが、ぺいほーむの動画と事例ライブラリで効率よく工務店を比較できました。' },
  { name: 'C様', area: '熊本市', text: 'セカンドライフの平屋を探していました。AI診断で「シニア向けバリアフリーの平屋」とぴったりの物件を3社も紹介してくれました。' },
  { name: 'D様ご家族', area: '宮崎市', text: '初めての家づくりで不安でしたが、ぺいほーむの動画と特集で基礎知識を学べました。紹介してもらった工務店さんも親切で、大満足の家が建ちました。' },
  { name: 'E様', area: '大分市', text: '予算2,000万円台で平屋を探していましたが、ぺいほーむで理想の間取りを見つけることができました。' },
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
    id: '10',
    youtubeId: '0gxkNh2BC0A',
    title: '小さなかわいい平屋',
    views: '99万回視聴',
    desc: 'チャンネル最高再生数99万回。コンパクトで愛らしい平屋のルームツアー。',
  },
  {
    id: '11',
    youtubeId: 'm_ndZJfV8a0',
    title: '老後も安心して過ごせる最先端の平屋',
    views: '91万回視聴',
    desc: '91万回視聴の大人気動画。老後も安心して暮らせる最先端の平屋。',
  },
  {
    id: '12',
    youtubeId: 'YhgQSfYYUJ0',
    title: '完璧な間取りのお洒落で超かわいい平屋',
    views: '78万回視聴',
    desc: '78万回視聴。完璧な間取りとおしゃれなデザインが詰まった平屋。',
  },
];

// 会員特典5項目
const memberBenefits = [
  {
    title: '間取り図フル解像度で閲覧',
    desc: '全物件の間取り図をフルHD品質で。寸法・収納配置・採光まで確認可能。',
  },
  {
    title: 'AI家づくり診断 結果保存',
    desc: '10問の診断結果と推薦工務店3社をマイページに永久保存。',
  },
  {
    title: '工務店3社のAIレコメンド',
    desc: 'あなたの好みに合う工務店を、診断結果と閲覧履歴からAIが提案。',
  },
  {
    title: 'お気に入り保存（無制限）',
    desc: '物件・工務店・建売・土地を上限なくお気に入り登録できます。',
  },
  {
    title: '平屋事例ライブラリ全件閲覧',
    desc: '非会員は5件までの事例が、会員登録で全件閲覧可能になります。',
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

  // データ抽出
  const latestVideos = videos.slice(0, 6);
  const topBuilders = [...builders].sort((a, b) => b.annualBuilds - a.annualBuilds).slice(0, 6);
  const topCaseStudies = [...caseStudies]
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, 6);

  return (
    <>
      {/* ===== 1. HERO ===== */}
      <section className="bg-gradient-to-br from-[#E8740C] via-[#F5A623] to-[#E8740C] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase opacity-80 mb-3">
                Housing Portal
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                家づくりを、
                <br />
                もっと楽しく、もっと身近に。
              </h1>
              <p className="text-sm md:text-base opacity-90 leading-relaxed mb-6">
                ぺいほーむは鹿児島・九州の住宅情報を網羅する住宅ポータル。
                <br className="hidden md:inline" />
                AI診断で自分に合う工務店を見つけ、見学会で実物を体感できます。
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link
                  href="/diagnosis"
                  className="bg-white text-[#E8740C] font-bold px-8 py-3 rounded-full text-sm hover:bg-gray-100 transition text-center max-w-[280px] w-full"
                >
                  AI家づくり診断をはじめる
                </Link>
                <Link
                  href="/videos"
                  className="border border-white/40 text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-white/10 transition text-center max-w-[280px] w-full"
                >
                  動画コンテンツを見る
                </Link>
              </div>
              <div className="flex gap-8 md:gap-12">
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold font-mono">4.28万+</div>
                  <div className="text-xs opacity-80 mt-1">YouTube登録者数</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold font-mono">42本</div>
                  <div className="text-xs opacity-80 mt-1">公開ルームツアー</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold font-mono">10社</div>
                  <div className="text-xs opacity-80 mt-1">提携工務店</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/0gxkNh2BC0A"
                  title="小さなかわいい平屋"
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

      {/* ===== 2. ポータル開設記念キャンペーン ===== */}
      <CampaignSection />

      {/* ===== 3. 3ステップで家づくり ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">
            HOW IT WORKS
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#3D2200] mb-3">
            ぺいほーむの使い方
          </h2>
          <p className="text-center text-sm text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            動画で比べて、AIに相談して、実物を体感する。
            <br />
            あなたの理想の家が見つかるまで、最短2分から始められます。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[900px] mx-auto">
            {[
              { num: 1, title: 'AI家づくり診断', desc: '10問・約2分。家族構成・予算・好みからあなたに合う工務店3社をAIが提案します。', cta: '診断する', href: '/diagnosis' },
              { num: 2, title: '動画と事例で比較', desc: 'プロが撮影したルームツアー動画42本と、完成事例ライブラリで気になる工務店を絞り込み。', cta: '動画を見る', href: '/videos' },
              { num: 3, title: '見学会で実物を体感', desc: 'モデルハウス・完成見学会の予約で、動画では伝わらない広さや素材感を実体験。', cta: '見学会を予約', href: '/event' },
            ].map((step) => (
              <div key={step.num} className="bg-[#FFF8F0] rounded-2xl py-7 px-5 text-center">
                <div className="w-14 h-14 bg-[#E8740C]/10 rounded-full mx-auto mb-3.5 flex items-center justify-center">
                  <span className="text-xl font-extrabold text-[#E8740C]">{step.num}</span>
                </div>
                <h4 className="text-base font-bold mb-2 text-[#3D2200]">{step.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{step.desc}</p>
                <Link href={step.href} className="text-xs font-bold text-[#E8740C] hover:underline">
                  {step.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. 注目コンテンツ (PICK UP slider) ===== */}
      <section className="py-16 md:py-20 bg-[#F5F0EB] relative overflow-hidden">
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
            <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">PICK UP</p>
            <h2 className="text-2xl font-bold text-[#3D2200]">注目の動画コンテンツ</h2>
            <p className="text-sm text-gray-500 mt-2">ぺいほーむで今もっとも見られているルームツアー</p>
          </div>

          <div className="relative" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            <div className="overflow-hidden rounded-2xl">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {featuredSlides.map((slide) => (
                  <Link
                    key={slide.id}
                    href={`/videos/${slide.id}`}
                    className="w-full flex-shrink-0 block bg-white rounded-2xl overflow-hidden shadow-sm"
                  >
                    <div className="grid md:grid-cols-2">
                      <div className="relative aspect-video overflow-hidden">
                        <img src={`https://img.youtube.com/vi/${slide.youtubeId}/maxresdefault.jpg`} alt={slide.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 bg-black/50 rounded-full flex items-center justify-center text-white text-xl backdrop-blur-sm">▶</div>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center gap-1">
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">人気</span>
                          <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded">{slide.views}</span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col justify-center">
                        <span className="text-xs font-semibold text-[#E8740C] bg-[#E8740C]/10 px-2 py-0.5 rounded w-fit">ルームツアー</span>
                        <h3 className="text-lg font-bold mt-3 line-clamp-2 text-[#3D2200]">{slide.title}</h3>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{slide.desc}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-white transition z-10" aria-label="前へ">&#8249;</button>
            <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-white transition z-10" aria-label="次へ">&#8250;</button>

            <div className="flex justify-center gap-2 mt-4">
              {featuredSlides.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)} className={`w-3 h-3 rounded-full transition-colors ${i === currentSlide ? 'bg-[#E8740C]' : 'bg-gray-300'}`} aria-label={`スライド ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 5. 最新動画 ===== */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">VIDEOS</p>
              <h2 className="text-2xl font-bold text-[#3D2200]">最新の動画コンテンツ</h2>
            </div>
            <Link href="/videos" className="hidden md:block text-sm text-[#E8740C] font-bold hover:underline">すべて見る →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestVideos.map((video) => (
              <Link key={video.id} href={`/videos/${video.id}`} className="block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition">
                <div className="relative aspect-video bg-gray-200">
                  <img src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} alt={video.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded">▶ {video.views}</div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-[#3D2200] mb-2 line-clamp-2 min-h-[2.5rem]">{video.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{video.builder}</span>
                    {video.tsubo > 0 && <span>{video.tsubo}坪</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link href="/videos" className="inline-block border-2 border-[#E8740C] text-[#E8740C] font-bold px-8 py-3 rounded-full text-sm hover:bg-[#E8740C] hover:text-white transition">
              動画一覧を見る
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 5.5 平屋事例ライブラリ ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">CASE STUDIES</p>
              <h2 className="text-2xl font-bold text-[#3D2200]">平屋事例ライブラリ</h2>
              <p className="text-sm text-gray-500 mt-2">ぺいほーむ取材済みの完成事例を間取り・費用・工務店・タグで検索</p>
            </div>
            <Link href="/case-studies" className="hidden md:block text-sm text-[#E8740C] font-bold hover:underline">
              すべて見る →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topCaseStudies.map((cs) => (
              <Link
                key={cs.id}
                href={`/case-studies/${cs.id}`}
                className="block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-[#E8740C]/30 transition"
              >
                <div className="relative aspect-video bg-gray-200">
                  <img
                    src={`https://img.youtube.com/vi/${cs.youtubeId}/mqdefault.jpg`}
                    alt={cs.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-[#E8740C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    完成事例
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {cs.completedAt}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-gray-500 mb-1">{cs.city} / {cs.familyStructure}</p>
                  <h3 className="text-sm font-bold text-[#3D2200] mb-2 line-clamp-2 min-h-[2.5rem]">
                    {cs.title}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-lg font-extrabold text-[#E8740C]">
                      {cs.totalPrice.toLocaleString()}
                      <span className="text-[10px] ml-1">万円</span>
                    </p>
                    <span className="text-[9px] text-gray-400">総額</span>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    {cs.layout} / {cs.tsubo}坪
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-6">
            ※ 非会員は新着5件まで閲覧可。6件目以降は無料会員登録でご覧いただけます
          </p>
        </div>
      </section>

      {/* ===== 7. 工務店一覧 PICKUP ===== */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">BUILDERS</p>
              <h2 className="text-2xl font-bold text-[#3D2200]">提携工務店</h2>
              <p className="text-sm text-gray-500 mt-2">ぺいほーむが取材した実力派工務店</p>
            </div>
            <Link href="/builders" className="hidden md:block text-sm text-[#E8740C] font-bold hover:underline">10社すべて見る →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topBuilders.map((b) => (
              <Link key={b.id} href={`/builders/${b.id}`} className="block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-[#E8740C]/30 transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-extrabold text-[#3D2200] truncate">{b.name}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">{b.region}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-[10px] text-gray-500">年間</p>
                    <p className="text-lg font-extrabold text-[#E8740C] leading-none">{b.annualBuilds}<span className="text-xs ml-0.5">棟</span></p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 mb-3 min-h-[2rem]">{b.catchphrase}</p>
                <div className="flex flex-wrap gap-1">
                  {b.specialties.slice(0, 4).map((s) => (
                    <span key={s} className="text-[10px] bg-[#FFF8F0] text-[#E8740C] px-2 py-0.5 rounded font-semibold">{s}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link href="/builders" className="inline-block border-2 border-[#E8740C] text-[#E8740C] font-bold px-8 py-3 rounded-full text-sm hover:bg-[#E8740C] hover:text-white transition">
              工務店一覧を見る
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 10. 会員特典 ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">MEMBER BENEFITS</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#3D2200] mb-3">無料会員登録でできること</h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              ぺいほーむは完全無料の住宅ポータル。
              会員登録で家づくりに役立つ機能がフルに使えるようになります。
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {memberBenefits.map((b, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#E8740C]/30 hover:shadow-md transition">
                <div className="w-10 h-10 bg-[#FFF8F0] text-[#E8740C] rounded-full flex items-center justify-center font-extrabold mb-4">
                  {i + 1}
                </div>
                <h3 className="text-base font-bold text-[#3D2200] mb-2 leading-tight">{b.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/signup"
              className="inline-block bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold px-10 py-4 rounded-full text-base transition shadow-[0_4px_12px_rgba(232,116,12,0.3)]"
            >
              無料会員登録する →
            </Link>
            <p className="text-xs text-gray-400 mt-3">
              すでに会員の方は{' '}
              <Link href="/login" className="text-[#E8740C] hover:underline font-bold">
                ログイン
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ===== 11. お客様の声 ===== */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2 text-center">VOICE</p>
          <h2 className="text-2xl font-bold text-[#3D2200] mb-10 text-center">お客様の声</h2>
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((review, i) => <ReviewCard key={i} review={review} />)}
          </div>
          <div className="md:hidden">
            <MobileMarquee>
              {reviews.map((review, i) => (
                <div key={i} className="marquee-card-wide">
                  <ReviewCard review={review} />
                </div>
              ))}
            </MobileMarquee>
          </div>
        </div>
      </section>

      {/* ===== 12. AI診断への最終CTA ===== */}
      <section className="bg-gradient-to-br from-[#E8740C] via-[#F5A623] to-[#E8740C] text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-bold tracking-widest opacity-80 mb-3">START NOW</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 leading-tight">
            まずはAI家づくり診断から
          </h2>
          <p className="text-sm md:text-base opacity-95 leading-relaxed mb-8 max-w-2xl mx-auto">
            10問・約2分の診断で、あなたの家づくりタイプを判定し、相性の良い工務店3社をご提案します。
            <br className="hidden md:block" />
            会員登録で、AI診断結果の保存・お気に入り整理・事例全件閲覧など家づくりが一気に進みます。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/diagnosis"
              className="inline-block bg-white text-[#E8740C] font-bold px-10 py-4 rounded-full text-base hover:bg-gray-100 transition shadow-xl"
            >
              AI家づくり診断をはじめる →
            </Link>
            <Link
              href="/signup"
              className="inline-block border-2 border-white/40 text-white font-bold px-10 py-4 rounded-full text-base hover:bg-white/10 transition"
            >
              会員登録する
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 13. 企業様向け（控えめ） ===== */}
      <section className="bg-[#3D2200] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase opacity-70 mb-2">FOR HOUSING COMPANIES</p>
              <h2 className="text-xl md:text-2xl font-bold mb-2">住宅会社・工務店の集客を、ぺいほーむで。</h2>
              <p className="text-xs opacity-80 leading-relaxed">
                ルームツアー撮影 / ポータル掲載 / 見学会送客をパッケージで提供します。
              </p>
            </div>
            <Link
              href="/biz"
              className="bg-white text-[#3D2200] font-bold px-8 py-3 rounded-full text-sm hover:bg-gray-100 transition flex-shrink-0"
            >
              掲載のご相談 →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
