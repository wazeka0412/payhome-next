'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LINE_URL } from '@/lib/constants';
import { useTrackEvent } from '@/lib/use-track-event';
import { getOrCreateAnonymousId, getUtmParams } from '@/lib/anonymous-id';

const faqData = [
  { q: '本当に無料ですか？', a: 'はい、完全無料です。ぺいほーむは提携工務店からの広告費で運営しているため、ご相談者様に費用が発生することは一切ございません。紹介料・相談料もかかりません。' },
  { q: 'どのエリアに対応していますか？', a: '九州全域を中心に、関東・関西・中部エリアの提携工務店もございます。対応エリアは随時拡大中ですので、まずはお気軽にご相談ください。' },
  { q: '紹介される工務店はどのような会社ですか？', a: 'ぺいほーむが実際に取材・撮影した工務店のみをご紹介しています。施工品質やお客様対応を確認した上で提携しているため、安心してご検討いただけます。' },
  { q: 'しつこい営業はありませんか？', a: '一切ありません。ご紹介後に「合わない」と感じた場合はお断りも代行いたします。お客様のペースで家づくりを進めていただけます。' },
  { q: 'オンラインでも相談できますか？', a: 'はい、ZoomやLINE通話での相談も承っております。全国どこからでもお気軽にご利用いただけます。' },
  { q: '相談してから家が建つまでどのくらいかかりますか？', a: '一般的に相談から引き渡しまで約8〜14ヶ月です。土地探しが必要な場合はさらに数ヶ月かかることもあります。まずはお気軽にご相談ください。' },
];

const recommendList = [
  '家づくりを考え始めたばかりで何から始めればいいかわからない',
  'YouTubeで見た平屋が気になるけど、どこに相談すればいいかわからない',
  '工務店とハウスメーカーの違いがわからず選べない',
  '予算内で理想の家を建てられるか不安',
  '複数の工務店を比較したいけど、1社ずつ回るのは大変',
  'セカンドライフに向けて平屋への建て替えを検討している',
];

export default function ConsultationPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [completeName, setCompleteName] = useState('');
  const [completeDetail, setCompleteDetail] = useState('');
  const completeRef = useRef<HTMLDivElement>(null);
  const trackEvent = useTrackEvent();

  useEffect(() => {
    trackEvent({ eventType: 'consultation_start', contentType: 'page' });
  }, [trackEvent]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const budget = formData.get('budget') as string;
    const layout = formData.get('layout') as string;

    setCompleteName(name + ' 様');
    const details: string[] = [];
    if (budget) details.push('ご予算: ' + budget);
    if (layout) details.push('間取り: ' + layout);
    setCompleteDetail(details.join(' / '));

    const utm = getUtmParams();
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: '無料相談',
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          area: formData.get('area'),
          build_area: formData.get('build_area'),
          budget,
          layout,
          video: formData.get('video'),
          message: formData.get('message'),
          anonymous_id: getOrCreateAnonymousId(),
          source_channel: utm.source || document.referrer || 'direct',
          source_content_id: new URLSearchParams(window.location.search).get('from') || undefined,
        }),
      });
      trackEvent({ eventType: 'consultation_request', contentType: 'lead' });
    } catch (e) { /* silent fail */ }

    setIsSubmitted(true);
    setTimeout(() => {
      completeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#E8740C] to-[#F5A623] text-white pt-24 pb-12 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest uppercase opacity-80 mb-3">
            FREE CONSULTATION
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold leading-relaxed mb-4">
            あなたの理想の家づくり、<br />ぺいほーむがサポートします
          </h1>
          <p className="text-sm opacity-90 leading-relaxed mb-8 max-w-xl mx-auto">
            YouTube登録者4.28万人の住宅メディアが、動画で紹介した工務店をあなたにご紹介。完全無料でご相談いただけます。
          </p>
          <div className="flex justify-center gap-8 md:gap-12 flex-wrap">
            <div>
              <div className="text-3xl font-extrabold font-mono">500件+</div>
              <div className="text-xs opacity-80 mt-1">相談実績</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold font-mono">80社+</div>
              <div className="text-xs opacity-80 mt-1">紹介工務店</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold font-mono">96%</div>
              <div className="text-xs opacity-80 mt-1">満足度</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Payhome */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">WHY PAYHOME</p>
          <h2 className="text-2xl font-bold text-center text-[#3D2200] mb-10">ぺいほーむの相談が選ばれる理由</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '\uD83D\uDCB0', title: '完全無料', desc: '相談料・紹介料は一切かかりません。工務店からの広告費で運営しているため、ユーザー様は無料でご利用いただけます。' },
              { icon: '\uD83C\uDFA5', title: '動画で見た家の工務店を直接紹介', desc: 'YouTubeで気になった家を建てた工務店を、そのままご紹介。「あの動画の家が気になる」からスタートできます。' },
              { icon: '\uD83C\uDF0F', title: '全国対応・しつこい営業なし', desc: '九州を中心に全国の提携工務店をご紹介。ご紹介後のしつこい営業は一切ありません。' },
            ].map((item) => (
              <div key={item.title} className="bg-[#FFF8F0] rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-[#E8740C]/10 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-[#E8740C] mb-3">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="py-16 bg-[#FFF8F0]">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">FLOW</p>
          <h2 className="text-2xl font-bold text-center text-[#3D2200] mb-10">相談の流れ</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: 1, title: '無料相談を申し込む', desc: 'フォームから簡単に申し込み。気になった動画や希望条件をお聞かせください。' },
              { num: 2, title: '専任スタッフがヒアリング', desc: 'ぺいほーむの住宅アドバイザーが、予算・エリア・間取りの希望を丁寧にヒアリングします。' },
              { num: 3, title: 'あなたに合った工務店をご紹介', desc: '動画で紹介した工務店を含め、条件に合った2〜3社を厳選してご紹介します。' },
              { num: 4, title: '工務店との面談をサポート', desc: '初回面談に同行し、聞きにくい質問もぺいほーむがサポート。安心して家づくりを始められます。' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 bg-[#E8740C] text-white rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-extrabold font-mono">
                  {step.num}
                </div>
                <h3 className="text-sm font-bold mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">RECOMMENDED</p>
          <h2 className="text-2xl font-bold text-center text-[#3D2200] mb-10">こんな方におすすめ</h2>
          <ul className="space-y-0 divide-y divide-gray-100">
            {recommendList.map((item, i) => (
              <li key={i} className="flex items-start gap-3 py-4">
                <div className="w-7 h-7 bg-[#E8740C]/10 rounded-full flex-shrink-0 flex items-center justify-center text-[#E8740C] text-xs font-extrabold mt-0.5">
                  &#10003;
                </div>
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#FFF8F0]">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">FAQ</p>
          <h2 className="text-2xl font-bold text-center text-[#3D2200] mb-10">よくある質問</h2>
          <div className="space-y-0 divide-y divide-gray-200">
            {faqData.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left py-5 pl-9 pr-8 relative font-bold text-sm text-[#3D2200] hover:text-[#E8740C] transition-colors"
                >
                  <span className="absolute left-0 top-5 w-6 h-6 bg-[#E8740C] text-white rounded text-xs font-extrabold flex items-center justify-center">
                    Q
                  </span>
                  {item.q}
                  <span className="absolute right-0 top-5 text-[#E8740C] text-lg">
                    {openFaq === i ? '\u2212' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="pl-9 pb-5 text-sm text-gray-500 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LINE Banner */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-[#06C755] rounded-3xl p-8 text-center text-white relative overflow-hidden">
            <div className="absolute -top-5 -right-5 w-24 h-24 bg-white/10 rounded-full" />
            <h3 className="text-xl font-extrabold mb-2">LINEでかんたん相談</h3>
            <p className="text-sm opacity-90 mb-4">
              フォームの入力が面倒な方は、LINEでお気軽にご相談ください。<br />
              「動画を見て相談したい」とメッセージするだけでOKです。
            </p>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#06C755] font-bold px-8 py-3 rounded-full text-sm hover:bg-gray-100 transition"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#06C755"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
              LINEで相談する
            </a>
            <p className="text-xs opacity-70 mt-3">友だち追加後、トーク画面からメッセージを送ってください</p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">CONTACT</p>
          <h2 className="text-2xl font-bold text-center text-[#3D2200] mb-3">無料相談を申し込む</h2>
          <p className="text-center text-sm text-gray-500 mb-2">以下のフォームに必要事項をご記入ください。2営業日以内にご連絡いたします。</p>
          <p className="text-center mb-8">
            <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="text-[#06C755] font-semibold text-sm no-underline">
              LINEでの相談はこちら
            </a>
          </p>

          {/* Form */}
          {!isSubmitted && (
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-10 max-w-xl mx-auto">
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
                  <input type="email" name="email" placeholder="example@email.com" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">電話番号</label>
                  <input type="tel" name="phone" placeholder="090-1234-5678" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">お住まいのエリア</label>
                  <select name="area" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]">
                    <option value="">選択してください</option>
                    {['北海道', '東北', '関東', '中部', '関西', '中国', '四国', '九州', '沖縄'].map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">建築予定エリア</label>
                  <input type="text" name="build_area" placeholder="例: 鹿児島市、福岡市など" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">ご予算</label>
                  <select name="budget" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]">
                    <option value="">選択してください</option>
                    {['〜1,500万円', '1,500〜2,000万円', '2,000〜2,500万円', '2,500〜3,000万円', '3,000〜4,000万円', '4,000万円〜', '未定'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">希望の間取り</label>
                  <select name="layout" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]">
                    <option value="">選択してください</option>
                    {['1LDK', '2LDK', '3LDK', '4LDK', '5LDK以上', '未定'].map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">気になった動画</label>
                  <input type="text" name="video" placeholder="動画のタイトルやURLがあればご記入ください" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">ご相談内容</label>
                  <textarea name="message" rows={5} placeholder="ご要望やご質問などをお気軽にお書きください" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]" />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#E8740C] text-white font-bold py-4 rounded-full text-sm hover:bg-[#D4660A] transition"
                >
                  無料相談を申し込む
                </button>
              </form>
            </div>
          )}

          {/* Completion Screen */}
          {isSubmitted && (
            <div ref={completeRef} className="text-center py-10 max-w-xl mx-auto">
              <div className="mb-6">
                <Image src="/images/pei_wink.png" alt="ペイくん" width={120} height={120} className="mx-auto object-contain" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#3D2200] mb-3">
                無料相談のお申し込みが完了しました!
              </h3>
              {completeName && <p className="text-lg font-bold mb-2">{completeName}</p>}
              {completeDetail && <p className="text-sm text-[#E8740C] mb-5">{completeDetail}</p>}
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                ご入力いただいたメールアドレスに確認メールをお送りしました。<br />
                ぺいほーむの住宅アドバイザーが<strong>2営業日以内</strong>にご連絡いたします。<br />
                お急ぎの方は<a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="text-[#06C755] font-bold">LINEでご連絡</a>ください。
              </p>
              <div className="bg-[#FFF8F0] rounded-2xl p-6 mb-8 text-left">
                <h4 className="text-sm font-bold text-[#3D2200] mb-3">今後の流れ</h4>
                <ol className="text-sm text-gray-500 leading-loose pl-5 list-decimal">
                  <li>確認メールをご確認ください</li>
                  <li>専任スタッフからヒアリングのご連絡</li>
                  <li>条件に合った工務店を2〜3社ご紹介</li>
                  <li>工務店との面談をサポート</li>
                </ol>
              </div>
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
          )}
        </div>
      </section>

      {/* Phone CTA */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#3D2200] to-[#E8740C] rounded-2xl p-8 text-white flex items-center gap-6 flex-wrap">
            <Image src="/images/pei_smile.png" alt="ぺいくん" width={80} height={80} className="flex-shrink-0 object-contain" />
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm opacity-90 mb-1">お電話でもお気軽にご相談ください</p>
              <div className="text-3xl font-extrabold font-mono tracking-wider">0120-XXX-XXX</div>
              <p className="text-xs opacity-70 mt-1">受付時間: 平日 9:00〜18:00</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
