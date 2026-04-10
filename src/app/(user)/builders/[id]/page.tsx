import { notFound } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import { builders } from '@/lib/builders-data';
import { events, formatPeriod, EVENT_TYPE_STYLES } from '@/lib/events-data';

export function generateStaticParams() {
  return builders.map((b) => ({ id: b.id }));
}

export default async function BuilderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const builder = builders.find((b) => b.id === id);

  if (!builder) {
    notFound();
  }

  // この工務店が開催する見学会・イベント
  const builderEvents = events.filter((e) => e.builder === builder.name);

  return (
    <>
      <PageHeader
        title={builder.name}
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '工務店一覧', href: '/builders' },
          { label: builder.name },
        ]}
        subtitle={`${builder.region}の${builder.specialties.join('・')}が得意な工務店`}
      />

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* ── 会社概要カード ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
            <div className="flex items-start gap-5 mb-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-[#FFF8F0] rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-gray-400">Logo</span>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#3D2200] mb-2">
                  {builder.name}
                </h1>
                <p className="text-sm text-gray-500 mb-3">
                  {builder.area} / {builder.region}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {builder.specialties.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-[#E8740C]/10 text-[#E8740C] px-2.5 py-1 rounded-full font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
              <Stat label="年間施工棟数" value={`約${builder.annualBuilds}棟`} />
              <Stat label="対応エリア" value={builder.area} />
              <Stat label="拠点" value={builder.region} />
              <Stat label="得意分野" value={builder.specialties[0] || '—'} />
            </div>
          </div>

          {/* ── 見学会予約 CTAセクション（メインCV） ── */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E8740C] via-[#F5A623] to-[#E8740C] text-white p-8 md:p-10 shadow-xl mb-10">
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full">
              🏠 実物を見学できます
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {builder.name}の家を見学する
            </h2>
            <p className="text-sm md:text-base text-white/95 mb-6 leading-relaxed">
              動画では伝わらない広さ・光の入り方・素材の質感を、実際に体感できます。
              {builderEvents.length > 0
                ? `現在 ${builderEvents.length} 件の見学会を受付中です。`
                : '随時、見学会を開催しています。お気軽にご予約ください。'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/event?builder=${encodeURIComponent(builder.name)}`}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#E8740C] font-bold px-8 py-3.5 rounded-full text-sm hover:bg-white/95 transition shadow-lg"
              >
                📅 見学会の日程を見る
              </Link>
              <Link
                href="/diagnosis"
                className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold px-8 py-3.5 rounded-full text-sm hover:bg-white/25 transition"
              >
                🤖 AI家づくり診断で相性チェック
              </Link>
            </div>
          </div>

          {/* ── 開催中の見学会一覧 ── */}
          {builderEvents.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-[#3D2200] mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#E8740C] rounded-full" />
                開催予定の見学会
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {builderEvents.map((event) => {
                  const style = EVENT_TYPE_STYLES[event.type];
                  return (
                    <Link
                      key={event.id}
                      href={`/event/${event.id}`}
                      className="block bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-[#E8740C]/30 transition"
                    >
                      <span
                        className={`inline-block text-[0.65rem] font-bold px-2.5 py-0.5 rounded-full mb-2 ${style.bg} ${style.text}`}
                      >
                        {event.typeLabel}
                      </span>
                      <h3 className="text-sm md:text-base font-bold text-[#3D2200] mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>📍 {event.location}</p>
                        <p>📅 {formatPeriod(event.startDate, event.endDate)}</p>
                        <p>👥 定員 {event.capacity}組</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── 会員登録 CTA（非ログインユーザ向け） ── */}
          <div className="bg-[#FFF8F0] border border-[#E8740C]/20 rounded-2xl p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-bold text-[#3D2200] mb-3">
              工務店選びでお悩みですか？
            </h3>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              会員登録（無料）すると、AI家づくり診断の結果保存・間取り図のフル閲覧・お気に入り登録・工務店比較機能がご利用いただけます。
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup?redirect=/diagnosis"
                className="inline-flex items-center justify-center bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold px-6 py-3 rounded-full text-sm transition"
              >
                無料会員登録してAI診断を受ける →
              </Link>
              <Link
                href="/builders"
                className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:border-[#E8740C] hover:text-[#E8740C] font-bold px-6 py-3 rounded-full text-sm transition"
              >
                他の工務店を見る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm md:text-base font-bold text-[#3D2200]">{value}</div>
    </div>
  );
}
