'use client';

import Link from 'next/link';
import { useState } from 'react';

const serviceOptions = [
  '広告掲載',
  'ルームツアー撮影',
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ company: '', name: '', email: '', phone: '', message: '' });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'B2Bお問い合わせ', ...formData, services: selectedServices }),
      });
    } catch (e) { /* silent fail */ }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <img src="/images/pei_wink.png" alt="ペイさん" className="w-28 h-28 mx-auto mb-6 object-contain" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">お問い合わせありがとうございます！</h2>
          <p className="text-sm text-gray-500 mb-6">内容を確認の上、2営業日以内にご連絡いたします。</p>
          <div className="flex gap-3 justify-center">
            <Link href="/biz" className="bg-[#E8740C] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#D4660A] transition text-sm">トップに戻る</Link>
          </div>
          <div className="mt-6 p-4 bg-[#06C755]/10 rounded-xl">
            <p className="text-sm font-semibold text-[#06C755] mb-2">📱 LINEで最新情報を受け取る</p>
            <a href="https://line.me/R/ti/p/@253gzmoh" target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-[#06C755] text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-[#05a648] transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596a.629.629 0 0 1-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595a.63.63 0 0 1 .495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
              友だち追加
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-400 mb-4"><Link href="/biz" className="hover:text-white">ホーム</Link> &gt; お問い合わせ</p>
          <h1 className="text-3xl md:text-4xl font-extrabold">お問い合わせ</h1>
        </div>
      </div>

      {/* Contact Form */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">CONTACT</p>
            <h2 className="text-2xl md:text-3xl font-extrabold">お問い合わせ</h2>
            <p className="max-w-xl mx-auto mt-4 text-gray-500 text-sm">サービスに関するご質問・ご相談はお気軽にお問い合わせください。通常2営業日以内にご返信いたします。</p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
            <div>
              <label className="block font-semibold text-sm mb-1">会社名 <span className="bg-[#E8740C] text-white text-xs px-1.5 py-0.5 rounded ml-1">必須</span></label>
              <input type="text" required placeholder="例：○○工務店" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition" />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-1">ご担当者名 <span className="bg-[#E8740C] text-white text-xs px-1.5 py-0.5 rounded ml-1">必須</span></label>
              <input type="text" required placeholder="例：山田 太郎" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition" />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-1">メールアドレス <span className="bg-[#E8740C] text-white text-xs px-1.5 py-0.5 rounded ml-1">必須</span></label>
              <input type="email" required placeholder="例：info@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition" />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-1">電話番号</label>
              <input type="tel" placeholder="例：099-000-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition" />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-2">ご興味のあるサービス</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {serviceOptions.map((service) => (
                  <label key={service} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={selectedServices.includes(service)} onChange={() => toggleService(service)} className="w-4 h-4 accent-[#E8740C]" />
                    {service}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-semibold text-sm mb-1">お問い合わせ内容 <span className="bg-[#E8740C] text-white text-xs px-1.5 py-0.5 rounded ml-1">必須</span></label>
              <textarea required placeholder="ご質問・ご相談内容をご記入ください" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition min-h-[160px] resize-y" />
            </div>
            <div className="text-center mt-8">
              <button type="submit" className="bg-[#E8740C] text-white font-semibold px-10 py-3 rounded-full hover:bg-[#D4660A] transition">送信する</button>
            </div>
          </form>
        </div>
      </section>

      {/* Alternative Contact */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold">その他のお問い合わせ方法</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center">
              <h4 className="font-bold mb-2">メール</h4>
              <p className="text-gray-500 text-sm mb-4">メールでのお問い合わせはこちら</p>
              <a href="mailto:info@pei-home.jp" className="text-[#E8740C] font-semibold text-lg hover:underline">info@pei-home.jp</a>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center">
              <h4 className="font-bold mb-2">LINE公式</h4>
              <p className="text-gray-500 text-sm mb-4">LINEでお気軽にご相談ください</p>
              <a href="https://line.me/R/ti/p/@253gzmoh" target="_blank" rel="noopener noreferrer" className="text-[#E8740C] font-semibold text-lg hover:underline">@pei_home</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
