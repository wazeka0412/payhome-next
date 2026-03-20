'use client';

import Link from 'next/link';
import { useState } from 'react';

const statsData = [
  { number: '15万回', label: '月間視聴回数' },
  { number: '500件+', label: '相談実績' },
  { number: '35%', label: '紹介成約率' },
];

const planCards = [
  {
    name: '無料掲載プラン（スタンダード）',
    price: '0',
    priceUnit: '円/月',
    featured: false,
    features: [
      { text: 'WEBメディア記事掲載', value: '無料', ok: true },
      { text: '工務店プロフィールページ', value: '無料', ok: true },
      { text: '資料請求の受付', value: '無料（反響課金 3,000円/件）', ok: true },
      { text: '見学会・イベント掲載', value: '無料（来場課金 5,000円/件）', ok: true },
      { text: '無料相談からの紹介', value: '無料（成約報酬 20万円/件）', ok: true },
      { text: '月刊ぺいほーむ掲載', value: '', ok: false },
    ],
  },
  {
    name: 'ルームツアー動画オプション',
    price: '30万円〜',
    priceUnit: '/本',
    featured: false,
    features: [
      { text: 'プロクルーによる撮影（半日〜1日）', value: '', ok: true },
      { text: '企画構成・台本作成', value: '', ok: true },
      { text: '編集・テロップ・BGM・サムネイル', value: '', ok: true },
      { text: 'YouTube公開（4.28万人チャンネル）', value: '', ok: true },
      { text: 'WEB記事連動（物件詳細ページ作成）', value: '', ok: true },
      { text: 'SNS告知（Instagram・X）', value: '', ok: true },
    ],
  },
  {
    name: 'プレミアムプラン',
    price: '10万円',
    priceUnit: '/月',
    featured: true,
    features: [
      { text: '無料掲載プランの全機能', value: '', ok: true },
      { text: 'ルームツアー動画 月1本', value: '', ok: true },
      { text: '検索結果の優先表示', value: '', ok: true },
      { text: '月刊ぺいほーむ掲載', value: '', ok: true },
      { text: '専任担当者', value: '', ok: true },
      { text: '月次レポート', value: '', ok: true },
    ],
  },
];

const flowSteps = [
  { num: 1, title: 'お申し込み', desc: 'フォームからお申し込み。担当者より2営業日以内にご連絡します。' },
  { num: 2, title: '取材・撮影', desc: '貴社の強み・特徴をヒアリング。必要に応じてルームツアー撮影を実施します。' },
  { num: 3, title: '掲載開始', desc: 'プロフィールページと記事を公開。YouTube・SNSでも発信を開始します。' },
  { num: 4, title: '反響獲得', desc: '資料請求・来場予約・相談など、反響をお届けします。' },
];

const faqs = [
  { q: '掲載料は本当に無料ですか？', a: 'はい、記事掲載・プロフィールページは完全無料です。費用が発生するのは反響課金（資料請求・来場・成約時）のみです。' },
  { q: 'どのエリアの工務店が対象ですか？', a: '九州全域を中心に、全国の工務店様にご参加いただけます。' },
  { q: 'ルームツアー動画は必須ですか？', a: 'いいえ、オプションです。記事掲載のみでも提携パートナーとしてお客様をご紹介します。' },
  { q: '反響課金の支払いタイミングは？', a: '月末締め翌月末払いです。成約報酬は成約確認後にご請求します。' },
  { q: '解約はいつでもできますか？', a: 'はい、いつでも解約可能です。最低契約期間はありません。' },
];

export default function PartnerPage() {
  const [formData, setFormData] = useState({ company: '', name: '', email: '', phone: '', address: '', area: '', plan: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'パートナー申込', ...formData }),
      });
    } catch (e) { /* silent fail */ }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <img src="/images/pei_smile.png" alt="ペイさん" className="w-28 h-28 mx-auto mb-6 object-contain" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">お申し込みありがとうございます！</h2>
          <p className="text-sm text-gray-500 mb-6">内容を確認の上、2営業日以内にご連絡いたします。</p>
          <div className="flex gap-3 justify-center">
            <Link href="/biz" className="bg-[#E8740C] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#D4660A] transition text-sm">トップに戻る</Link>
            <Link href="/biz/partner" className="border-2 border-[#E8740C] text-[#E8740C] font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition text-sm">プラン詳細</Link>
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
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#E8740C] to-[#F5A623] text-white py-24 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm tracking-widest uppercase mb-4 opacity-85">PARTNER PROGRAM</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-relaxed">ぺいほーむの提携パートナーに<br />なりませんか？</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-95 leading-relaxed">YouTube登録者4.28万人の住宅メディアから、家づくりに本気のお客様をご紹介します。<br />記事掲載は無料。ルームツアー動画はオプションでご利用いただけます。</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center gap-12 flex-wrap">
            {statsData.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-[#E8740C] font-mono">{s.number}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">PLAN</p><h2 className="text-2xl md:text-3xl font-extrabold">掲載プラン</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planCards.map((plan) => (
              <div key={plan.name} className={`bg-white rounded-2xl border-2 p-8 flex flex-col hover:shadow-lg hover:-translate-y-1 transition relative ${plan.featured ? 'border-[#E8740C]' : 'border-gray-200'}`}>
                {plan.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8740C] text-white text-xs font-bold px-4 py-1 rounded-full">おすすめ</span>}
                <div className="font-bold text-lg mb-2">{plan.name}</div>
                <div className="text-3xl font-extrabold text-[#E8740C] font-mono mb-6">{plan.price}<small className="text-sm font-normal text-gray-500">{plan.priceUnit}</small></div>
                <div className="flex-1">
                  {plan.features.map((f) => (
                    <div key={f.text} className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
                      <span>{f.text}</span>
                      <span className={`font-semibold whitespace-nowrap ${f.ok ? 'text-green-600' : 'text-gray-300'}`}>
                        {f.ok ? (f.value || '\u2705') : '\u274C'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulation */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">SIMULATION</p><h2 className="text-2xl md:text-3xl font-extrabold">導入効果シミュレーション</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto items-center">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <h4 className="text-gray-500 mb-4">Before（導入前）</h4>
              <div className="flex justify-between py-2 border-b text-sm"><span>月間問い合わせ</span><span className="font-bold">5件</span></div>
              <div className="flex justify-between py-2 border-b text-sm"><span>来場</span><span className="font-bold">3組</span></div>
              <div className="flex justify-between py-2 text-sm"><span>成約</span><span className="font-bold">1件</span></div>
            </div>
            <div className="text-4xl text-[#E8740C] font-bold text-center md:block hidden">&rarr;</div>
            <div className="text-2xl text-[#E8740C] font-bold text-center md:hidden rotate-90">&rarr;</div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border-2 border-orange-100">
              <h4 className="text-[#E8740C] mb-4 font-semibold">After（6ヶ月後）</h4>
              <div className="flex justify-between py-2 border-b text-sm"><span>月間問い合わせ</span><span className="font-bold text-[#E8740C]">15件</span></div>
              <div className="flex justify-between py-2 border-b text-sm"><span>来場</span><span className="font-bold text-[#E8740C]">10組</span></div>
              <div className="flex justify-between py-2 text-sm"><span>成約</span><span className="font-bold text-[#E8740C]">3件</span></div>
            </div>
          </div>
          <div className="max-w-xl mx-auto mt-8 bg-orange-50 border-2 border-[#E8740C] rounded-xl p-4 text-center font-semibold text-[#E8740C]">
            動画視聴済みのお客様は成約率が通常の2〜3倍
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">FLOW</p><h2 className="text-2xl md:text-3xl font-extrabold">導入の流れ</h2></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {flowSteps.map((step) => (
              <div key={step.num} className="text-center relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#E8740C] text-white font-bold text-lg font-mono mb-4">{step.num}</div>
                <h4 className="font-bold mb-1">{step.title}</h4>
                <p className="text-xs text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">FAQ</p><h2 className="text-2xl md:text-3xl font-extrabold">よくある質問</h2></div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-gray-200 pb-4">
                <div className="flex items-start gap-3 font-bold text-sm">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#E8740C] text-white text-xs font-bold flex-shrink-0">Q</span>
                  {faq.q}
                </div>
                <p className="mt-2 pl-10 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20" id="apply">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">APPLY</p><h2 className="text-2xl md:text-3xl font-extrabold">パートナー申し込み</h2></div>
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
            <div><label className="block font-semibold text-sm mb-1">会社名 <span className="bg-[#E8740C] text-white text-xs px-1.5 py-0.5 rounded ml-1">必須</span></label><input type="text" required placeholder="例：○○工務店" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition" /></div>
            <div><label className="block font-semibold text-sm mb-1">担当者名 <span className="bg-[#E8740C] text-white text-xs px-1.5 py-0.5 rounded ml-1">必須</span></label><input type="text" required placeholder="例：山田 太郎" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition" /></div>
            <div><label className="block font-semibold text-sm mb-1">電話番号</label><input type="tel" placeholder="例：099-000-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition" /></div>
            {!showMore && (
              <button type="button" onClick={() => setShowMore(true)} className="text-sm text-[#E8740C] font-semibold hover:underline cursor-pointer">
                + もっと詳しく入力する
              </button>
            )}
            {showMore && (
              <>
                <div><label className="block font-semibold text-sm mb-1">メールアドレス <span className="bg-[#E8740C] text-white text-xs px-1.5 py-0.5 rounded ml-1">必須</span></label><input type="email" placeholder="例：info@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition" /></div>
                <div><label className="block font-semibold text-sm mb-1">所在地</label><input type="text" placeholder="例：鹿児島県鹿児島市○○町1-2-3" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition" /></div>
                <div><label className="block font-semibold text-sm mb-1">対応エリア</label><input type="text" placeholder="例：鹿児島県全域、宮崎県南部" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition" /></div>
                <div><label className="block font-semibold text-sm mb-1">希望プラン</label><select value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition bg-white"><option value="">選択してください</option><option value="free">無料掲載プラン</option><option value="roomtour">ルームツアー動画オプション</option><option value="premium">プレミアムプラン</option></select></div>
                <div><label className="block font-semibold text-sm mb-1">ご質問・ご要望</label><textarea placeholder="ご質問やご要望がございましたらご記入ください" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition min-h-[120px] resize-y" /></div>
              </>
            )}
            <div className="text-center mt-8"><button type="submit" className="bg-[#E8740C] text-white font-semibold px-12 py-3.5 rounded-full hover:bg-[#D4660A] transition text-lg">申し込む（無料）</button></div>
          </form>
        </div>
      </section>
    </>
  );
}
