'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';

const partners = [
  { name: '万代ホーム', location: '鹿児島市', specialty: '平屋・注文住宅', area: 'kagoshima' },
  { name: 'ハウスサポート', location: '鹿児島市', specialty: 'デザイン住宅・平屋', area: 'kagoshima' },
  { name: 'タマルハウス', location: '福岡市', specialty: '高気密高断熱・平屋', area: 'fukuoka' },
  { name: 'ベルハウジング', location: '鹿児島市', specialty: '自然素材・注文住宅', area: 'kagoshima' },
  { name: 'ヤマサハウス', location: '鹿児島市', specialty: '平屋・二世帯住宅', area: 'kagoshima' },
  { name: '七呂建設', location: '鹿児島市', specialty: 'ローコスト・平屋', area: 'kagoshima' },
];

const areaFilters = [
  { label: 'すべて', value: 'all' },
  { label: '鹿児島', value: 'kagoshima' },
  { label: '福岡', value: 'fukuoka' },
  { label: '熊本', value: 'kumamoto' },
  { label: 'その他九州', value: 'other' },
];

export default function CatalogPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [completeName, setCompleteName] = useState('');
  const completeRef = useRef<HTMLDivElement>(null);

  const togglePartner = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const filteredPartners = activeFilter === 'all'
    ? partners
    : partners.filter((p) => p.area === activeFilter);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    setCompleteName(name + ' 様');

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: '資料請求', name: formData.get('name'), email: formData.get('email'), phone: formData.get('phone'), postal: formData.get('postal'), address: formData.get('address'), selected, selectedCompanies: selected }),
      });
    } catch (e) { /* silent fail */ }

    setIsSubmitted(true);
    setTimeout(() => {
      completeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  if (isSubmitted) {
    return (
      <>
        <PageHeader
          title="資料請求"
          breadcrumbs={[
            { label: 'ホーム', href: '/' },
            { label: '資料請求' },
          ]}
        />

        <section className="py-20" ref={completeRef}>
          <div className="max-w-xl mx-auto px-4 text-center">
            <div className="mb-6">
              <Image src="/images/pei_wink.png" alt="ペイくん" width={120} height={120} className="mx-auto object-contain" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#3D2200] mb-3">資料請求が完了しました!</h2>
            <p className="text-lg font-bold mb-2">{completeName}</p>
            {selected.length > 0 && (
              <p className="text-sm text-[#E8740C] mb-5">請求先：{selected.join('、')}</p>
            )}
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              ご入力いただいたメールアドレスに確認メールをお送りしました。<br />
              選択された工務店から、3営業日以内にカタログ・資料をお届けします。
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/" className="bg-[#3D2200] text-white font-bold px-8 py-3.5 rounded-full text-sm hover:opacity-90 transition">
                トップページへ戻る
              </Link>
              <Link href="/videos" className="bg-white text-[#E8740C] font-bold px-8 py-3.5 rounded-full text-sm border-2 border-[#E8740C] hover:bg-[#E8740C]/5 transition">
                動画を見る
              </Link>
            </div>
            <div className="mt-6 p-4 bg-[#06C755]/10 rounded-xl">
              <p className="text-sm font-semibold text-[#06C755] mb-2">📱 LINEで最新情報を受け取る</p>
              <a href="https://line.me/R/ti/p/@253gzmoh" target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-[#06C755] text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-[#05a648] transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596a.629.629 0 0 1-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595a.63.63 0 0 1 .495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
                友だち追加
              </a>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="資料請求"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '資料請求' },
        ]}
        subtitle="気になる工務店のカタログ・施工事例集を無料でお届けします"
      />

      {/* Partner List */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">PARTNER</p>
          <h2 className="text-2xl font-bold text-center text-[#3D2200] mb-8">提携工務店一覧</h2>

          {/* Area Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {areaFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeFilter === f.value
                    ? 'bg-[#E8740C] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Partner Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPartners.map((partner) => {
              const isSelected = selected.includes(partner.name);
              return (
                <button
                  key={partner.name}
                  onClick={() => togglePartner(partner.name)}
                  className={`relative text-left bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border-2 ${
                    isSelected ? 'border-[#E8740C] bg-[#FFF8F0]' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs shrink-0">
                      Logo
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#3D2200]">{partner.name}</div>
                      <div className="text-xs text-gray-500">{partner.location}</div>
                      <span className="text-xs text-[#E8740C] bg-[#E8740C]/10 px-2 py-0.5 rounded mt-1 inline-block">
                        {partner.specialty}
                      </span>
                    </div>
                  </div>
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[#E8740C] border-[#E8740C]' : 'border-gray-300 bg-white'
                  }`}>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 md:py-16 bg-[#FFF8F0]">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-10">
            <h3 className="text-lg font-bold text-center text-[#3D2200] mb-6">資料請求フォーム</h3>

            {/* Selected companies display */}
            <div className="bg-[#FFF8F0] rounded-xl p-3 mb-6 min-h-[40px]">
              {selected.length === 0 ? (
                <p className="text-xs text-gray-400">上の一覧から工務店を選択してください</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selected.map((name) => (
                    <span key={name} className="text-xs font-semibold text-[#E8740C] bg-[#E8740C]/10 px-3 py-1 rounded-full">
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-1">
                  お名前 <span className="text-red-500 text-xs">必須</span>
                </label>
                <input type="text" name="name" placeholder="山田 太郎" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  メールアドレス <span className="text-red-500 text-xs">必須</span>
                </label>
                <input type="email" name="email" placeholder="example@mail.com" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">電話番号</label>
                <input type="tel" name="phone" placeholder="090-1234-5678" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">郵便番号</label>
                <input type="text" name="postal" placeholder="890-0000" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  ご住所 <span className="text-red-500 text-xs">必須</span>
                </label>
                <input type="text" name="address" placeholder="鹿児島県鹿児島市○○町1-2-3" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#E8740C] to-[#F5A623] text-white font-bold py-4 rounded-full text-sm hover:opacity-90 transition"
              >
                資料を請求する（無料）
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
