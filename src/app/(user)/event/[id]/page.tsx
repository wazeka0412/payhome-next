'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import {
  formatPeriod,
  formatDateJP,
  EVENT_TYPE_STYLES,
} from '@/lib/events-data';
import { useEvents } from '@/lib/content-store';

/* ─── Calendar helpers ─── */
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0=Sun
}
function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function parseYearMonth(dateStr: string): [number, number] {
  const [y, m] = dateStr.split('-').map(Number);
  return [y, m - 1];
}

const WEEK_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const events = useEvents();
  const event = events.find(e => e.id === id);

  /* slideshow */
  const [slideIdx, setSlideIdx] = useState(0);

  /* calendar — initialise from event start date string (no Date object at init) */
  const [initYear, initMonth] = event ? parseYearMonth(event.startDate) : [2026, 3];
  const [calYear, setCalYear] = useState(initYear);
  const [calMonth, setCalMonth] = useState(initMonth);
  const [selectedDate, setSelectedDate] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  /* form */
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const reservationRef = useRef<HTMLDivElement>(null);

  const isDateSelectable = useCallback(
    (dateStr: string) => {
      if (!event) return false;
      return dateStr >= event.startDate && dateStr <= event.endDate;
    },
    [event],
  );

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const firstDay = getFirstDayOfWeek(calYear, calMonth);
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [calYear, calMonth]);

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalYear((y) => y - 1);
      setCalMonth(11);
    } else {
      setCalMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalYear((y) => y + 1);
      setCalMonth(0);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  const scrollToReservation = () => {
    reservationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event || !selectedDate) return;
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: '見学会予約',
          name: fd.get('name'),
          email: fd.get('email'),
          phone: fd.get('phone'),
          message: fd.get('message'),
          participants: fd.get('participants'),
          event: event.title,
          eventDate: selectedDate,
          builderName: event.builder,
        }),
      });
    } catch {
      /* silent */
    }

    // Save summary to sessionStorage for thanks page
    sessionStorage.setItem(
      `event-reservation-${id}`,
      JSON.stringify({
        eventTitle: event.title,
        selectedDate,
        name: fd.get('name'),
      }),
    );
    router.push(`/event/${id}/thanks`);
  };

  if (!event) {
    return (
      <>
        <PageHeader
          title="イベントが見つかりません"
          breadcrumbs={[
            { label: 'ホーム', href: '/' },
            { label: '見学会・イベント', href: '/event' },
            { label: 'Not Found' },
          ]}
        />
        <section className="py-20 text-center">
          <p className="text-gray-500 mb-6">指定されたイベントは存在しません。</p>
          <Link
            href="/event"
            className="inline-block bg-[#E8740C] text-white font-bold px-8 py-3 rounded-full text-sm hover:opacity-90 transition"
          >
            イベント一覧に戻る
          </Link>
        </section>
      </>
    );
  }

  const style = EVENT_TYPE_STYLES[event.type];

  return (
    <>
      <PageHeader
        title={event.typeLabel}
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '見学会・イベント', href: '/event' },
          { label: event.typeLabel },
        ]}
        subtitle={event.title}
      />

      <div className="max-w-4xl mx-auto px-4 py-10 md:py-14">
        {/* ─── Image Slideshow ─── */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-8">
          <div className="aspect-[16/9] relative">
            {event.images.map((src, i) => (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  i === slideIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <Image
                  src={src}
                  alt={`${event.title} - ${i + 1}`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Fallback */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 pointer-events-none">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2-2H10L8 7H5a2 2 0 00-2 2z" />
                    <circle cx="12" cy="13" r="3" strokeWidth={1} />
                  </svg>
                  <span className="text-sm mt-2">Image {i + 1}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Prev / Next buttons */}
          {event.images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setSlideIdx((prev) =>
                    prev === 0 ? event.images.length - 1 : prev - 1,
                  )
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition"
                aria-label="前の画像"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() =>
                  setSlideIdx((prev) =>
                    prev === event.images.length - 1 ? 0 : prev + 1,
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition"
                aria-label="次の画像"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Dot indicators */}
          {event.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {event.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIdx(i)}
                  className={`w-2.5 h-2.5 rounded-full transition ${
                    i === slideIdx ? 'bg-white scale-110' : 'bg-white/50'
                  }`}
                  aria-label={`画像${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ─── Type badge + title ─── */}
        <span
          className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${style.bg} ${style.text}`}
        >
          {event.typeLabel}
        </span>
        <h2 className="text-xl md:text-2xl font-extrabold text-[#3D2200] leading-snug mb-6">
          {event.title}
        </h2>

        {/* ─── Overview ─── */}
        <section className="mb-10">
          <h3 className="text-base font-bold text-[#3D2200] mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#E8740C] rounded-full" />
            イベント概要
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">{event.description}</p>

          <div className="grid sm:grid-cols-2 gap-3">
            {event.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-2 bg-[#FFF8F0] rounded-xl px-4 py-3"
              >
                <span className="text-[#E8740C] font-bold shrink-0 mt-0.5">&#10003;</span>
                <span className="text-sm text-[#3D2200]">{h}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Event info table ─── */}
        <section className="mb-10">
          <h3 className="text-base font-bold text-[#3D2200] mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#E8740C] rounded-full" />
            開催情報
          </h3>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <Row label="開催期間" value={formatPeriod(event.startDate, event.endDate)} />
                <Row label="会場" value={event.location} />
                <Row label="住所" value={event.address} />
                <Row label="施工会社" value={event.builder} />
                <Row label="定員" value={`${event.capacity}組`} />
                {event.features.map((f) => (
                  <Row key={f.label} label={f.label} value={f.value} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <div className="text-center mb-14">
          <button
            onClick={scrollToReservation}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E8740C] to-[#F5A623] text-white font-bold px-10 py-4 rounded-xl text-base hover:opacity-90 transition shadow-lg shadow-[#E8740C]/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={1.5} />
              <path strokeWidth={1.5} d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            予約する
          </button>
        </div>

        {/* ─── Reservation Form ─── */}
        <div ref={reservationRef} className="scroll-mt-24">
          <section className="bg-white border-2 border-[#E8740C]/20 rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-extrabold text-[#3D2200] mb-1">見学会を予約する</h3>
            <p className="text-sm text-gray-500 mb-6">
              ご希望の日程を選択し、必要事項をご入力ください。
            </p>

            {/* Calendar date picker */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#3D2200] mb-2">
                ご希望日を選択 <span className="text-red-500 text-xs">必須</span>
              </label>
              <div className="bg-[#FFF8F0] rounded-xl p-4 max-w-sm mx-auto">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-gray-500 transition"
                    aria-label="前月"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-sm font-bold text-[#3D2200]">
                    {calYear}年{calMonth + 1}月
                  </span>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-gray-500 transition"
                    aria-label="翌月"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Week day headers */}
                <div className="grid grid-cols-7 text-center mb-1">
                  {WEEK_LABELS.map((w, i) => (
                    <span
                      key={w}
                      className={`text-[0.65rem] font-bold ${
                        i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
                      }`}
                    >
                      {w}
                    </span>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    if (day === null) {
                      return <div key={`empty-${i}`} />;
                    }
                    const dateStr = toDateStr(calYear, calMonth, day);
                    const selectable = isDateSelectable(dateStr);
                    const isSelected = dateStr === selectedDate;

                    return (
                      <button
                        key={dateStr}
                        type="button"
                        disabled={!selectable}
                        onClick={() => selectable && setSelectedDate(dateStr)}
                        className={`
                          w-full aspect-square rounded-lg text-xs font-semibold transition
                          ${
                            isSelected
                              ? 'bg-[#E8740C] text-white shadow-md'
                              : selectable
                                ? 'bg-white text-[#3D2200] hover:bg-[#E8740C]/10 cursor-pointer'
                                : 'text-gray-300 cursor-default'
                          }
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {selectedDate && (
                  <p className="text-center text-xs font-bold text-[#E8740C] mt-3">
                    選択中：{formatDateJP(selectedDate)}
                  </p>
                )}
              </div>
            </div>

            {/* Form fields */}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  お名前 <span className="text-red-500 text-xs">必須</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="山田 太郎"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  メールアドレス <span className="text-red-500 text-xs">必須</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@mail.com"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">電話番号</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="090-1234-5678"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">参加人数</label>
                <select
                  name="participants"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                >
                  <option value="1">1名</option>
                  <option value="2">2名</option>
                  <option value="3">3名以上</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">ご質問・ご要望</label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="当日聞きたいことなどがあればご記入ください"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedDate || submitting}
                className="w-full bg-gradient-to-r from-[#E8740C] to-[#F5A623] text-white font-bold py-4 rounded-xl text-sm hover:opacity-90 transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? '送信中...'
                  : selectedDate
                    ? `${formatDateJP(selectedDate)} で予約する（無料）`
                    : '日程を選択してください'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}

/* ─── Table row helper ─── */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <th className="text-left font-bold text-[#3D2200] bg-[#FFF8F0] px-4 py-3 w-28 md:w-36 align-top text-xs md:text-sm">
        {label}
      </th>
      <td className="px-4 py-3 text-gray-600 text-xs md:text-sm">{value}</td>
    </tr>
  );
}
