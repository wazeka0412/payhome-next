'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';

const events = [
  { month: 'Apr', day: '12', type: '完成見学会', typeClass: 'bg-[#E8740C]/10 text-[#E8740C]', title: '【鹿児島市】平屋3LDK完成見学会', location: '鹿児島市○○町', company: '万代ホーム', dateLabel: '2026.04.12' },
  { month: 'Apr', day: '19', type: 'ぺいほーむ特別見学会', typeClass: 'bg-orange-50 text-orange-700', title: '【動画の家を見よう】99万回再生の小さなかわいい平屋', location: '鹿児島市', company: 'ハウスサポート', dateLabel: '2026.04.19' },
  { month: 'Apr', day: '26', type: 'モデルハウス', typeClass: 'bg-green-50 text-green-700', title: '【福岡市】最新平屋モデルハウス見学', location: '福岡市東区', company: 'タマルハウス', dateLabel: '2026.04.26' },
  { month: 'May', day: '10', type: 'オンライン見学会', typeClass: 'bg-blue-50 text-blue-700', title: '【Zoom開催】高気密高断熱の平屋オンライン見学', location: 'オンライン', company: '感動ハウス', dateLabel: '2026.05.10' },
];

const reports = [
  { title: '【レポート】鹿児島市・平屋完成見学会を開催しました', date: '2026.03.08', participants: '24名' },
  { title: '【レポート】ぺいほーむ特別見学会 in 福岡', date: '2026.02.22', participants: '18名' },
  { title: '【レポート】オンライン見学会・高性能住宅のすべて', date: '2026.02.08', participants: '42名' },
];

export default function EventPage() {
  const [modalEvent, setModalEvent] = useState<typeof events[0] | null>(null);
  const [isReserved, setIsReserved] = useState(false);
  const [reserveName, setReserveName] = useState('');

  const openModal = (event: typeof events[0]) => {
    setModalEvent(event);
    setIsReserved(false);
    setReserveName('');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalEvent(null);
    document.body.style.overflow = '';
    setTimeout(() => {
      setIsReserved(false);
      setReserveName('');
    }, 300);
  };

  const handleReserve = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    setReserveName(name + ' 様');

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: '見学会予約', name: formData.get('name'), email: formData.get('email'), phone: formData.get('phone'), participants: formData.get('participants'), message: formData.get('message'), event: modalEvent?.title, eventDate: modalEvent?.dateLabel, builderName: modalEvent?.company }),
      });
    } catch (e) { /* silent fail */ }

    setIsReserved(true);
  };

  return (
    <>
      <PageHeader
        title="見学会・イベント予約"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '見学会・イベント予約' },
        ]}
        subtitle="動画で見た家を実際に体感できるチャンスです"
      />

      {/* Upcoming Events */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">UPCOMING</p>
          <h2 className="text-2xl font-bold text-center text-[#3D2200] mb-10">開催予定の見学会・イベント</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event, i) => (
              <div key={i} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-[#E8740C] hover:shadow-md transition-all">
                <div className="flex items-start gap-4 p-5">
                  <div className="flex-shrink-0 w-[72px] h-[72px] bg-gradient-to-br from-[#3D2200] to-[#E8740C] rounded-2xl flex flex-col items-center justify-center text-white">
                    <span className="text-[0.7rem] font-bold uppercase leading-none">{event.month}</span>
                    <span className="text-2xl font-extrabold font-mono leading-tight">{event.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-1.5 ${event.typeClass}`}>
                      {event.type}
                    </span>
                    <h3 className="text-sm font-bold text-[#3D2200] leading-snug">{event.title}</h3>
                  </div>
                </div>
                <div className="px-5 pb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{event.location}</p>
                    <p className="text-xs text-gray-400">{event.company}</p>
                  </div>
                  <button
                    onClick={() => openModal(event)}
                    className="bg-gradient-to-r from-[#E8740C] to-[#F5A623] text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:opacity-90 transition"
                  >
                    予約する
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Reports */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">REPORT</p>
          <h2 className="text-2xl font-bold text-center text-[#3D2200] mb-10">イベントレポート</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Photo
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-bold text-[#3D2200] mb-2 leading-snug">{report.title}</h4>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{report.date}</span>
                    <span>参加者数：{report.participants}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {modalEvent && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
            >
              &#10005;
            </button>

            {/* Reservation Form */}
            {!isReserved && (
              <div>
                <h3 className="text-lg font-bold text-[#3D2200] mb-2">見学会を予約する</h3>
                <p className="text-sm text-[#E8740C] font-semibold mb-6 pb-4 border-b border-gray-100">
                  {modalEvent.title}（{modalEvent.dateLabel}）
                </p>

                <form onSubmit={handleReserve} className="space-y-4">
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
                    <label className="block text-sm font-bold mb-1">参加人数</label>
                    <select name="participants" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]">
                      <option value="1">1名</option>
                      <option value="2">2名</option>
                      <option value="3">3名以上</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">ご質問・ご要望</label>
                    <textarea name="message" rows={3} placeholder="当日聞きたいことなどがあればご記入ください" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] resize-y" />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#E8740C] to-[#F5A623] text-white font-bold py-4 rounded-xl text-sm hover:opacity-90 transition mt-2"
                  >
                    予約する（無料）
                  </button>
                </form>
              </div>
            )}

            {/* Reservation Complete */}
            {isReserved && (
              <div className="text-center py-5">
                <div className="mb-5">
                  <Image src="/images/pei_wink.png" alt="ペイくん" width={100} height={100} className="mx-auto object-contain" />
                </div>
                <h3 className="text-xl font-extrabold text-[#3D2200] mb-3">予約が完了しました!</h3>
                <p className="text-base font-bold mb-2">{reserveName}</p>
                <p className="text-sm text-[#E8740C] mb-4">
                  {modalEvent.title}（{modalEvent.dateLabel}）
                </p>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  ご入力いただいたメールアドレスに確認メールをお送りしました。<br />
                  当日のご来場をお待ちしております。
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link href="/" className="bg-[#3D2200] text-white font-bold px-7 py-3 rounded-full text-sm hover:opacity-90 transition">
                    トップページへ戻る
                  </Link>
                  <Link href="/videos" className="bg-white text-[#E8740C] font-bold px-7 py-3 rounded-full text-sm border-2 border-[#E8740C] hover:bg-[#E8740C]/5 transition">
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
        </div>
      )}
    </>
  );
}
