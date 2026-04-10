import { notFound } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import { builders, getBuilderById, PRICE_BAND_LABELS } from '@/lib/builders-data';
import { events, formatPeriod, EVENT_TYPE_STYLES } from '@/lib/events-data';
import { videos } from '@/lib/videos-data';
import { getSaleHomesByBuilderId, SALE_HOME_STATUS_LABELS } from '@/lib/sale-homes-data';
import { getLandsByBuilderId, LAND_STATUS_LABELS } from '@/lib/lands-data';

export function generateStaticParams() {
  return builders.map((b) => ({ id: b.id }));
}

export default async function BuilderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const builder = getBuilderById(id);

  if (!builder) {
    notFound();
  }

  // この工務店が開催する見学会・イベント
  const builderEvents = events.filter((e) => e.builder === builder.name);

  // featured 動画（builders-data の featuredVideoIds から解決）
  const featuredVideos = builder.featuredVideoIds
    .map((vid) => videos.find((v) => v.id === vid))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  // 関連工務店（同じエリアで他3社）
  const relatedBuilders = builders
    .filter((b) => b.id !== builder.id && b.area === builder.area)
    .slice(0, 3);

  // この工務店が販売中の建売・土地
  const saleHomes = getSaleHomesByBuilderId(builder.id);
  const lands = getLandsByBuilderId(builder.id);

  return (
    <>
      <PageHeader
        title={builder.name}
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '工務店一覧', href: '/builders' },
          { label: builder.name },
        ]}
        subtitle={builder.catchphrase}
      />

      {/* ── Hero Gradient ── */}
      <div className="bg-gradient-to-br from-[#FFF8F0] via-[#FFF3E6] to-[#FFECD4]">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Logo placeholder */}
            <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] text-gray-400 tracking-wider">LOGO</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-[10px] font-bold text-white bg-[#E8740C] px-3 py-1 rounded-full tracking-wider">
                  {PRICE_BAND_LABELS[builder.priceBand].description.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">
                  創業 {builder.established}年 / {builder.area} {builder.region}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-[#3D2200] mb-3 leading-tight">
                {builder.name}
              </h1>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed max-w-3xl">
                {builder.description}
              </p>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-5">
            <Kpi label="年間施工棟数" value={`${builder.annualBuilds}棟`} />
            <Kpi label="坪単価" value={`${builder.pricePerTsubo.min}〜${builder.pricePerTsubo.max}万円`} />
            <Kpi label="耐震等級" value={builder.earthquakeGrade} />
            <Kpi label="断熱性能" value={builder.insulationGrade.split('（')[0]} />
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 space-y-14">
          {/* ── 強み3点 ── */}
          <div>
            <SectionTitle>この工務店の強み</SectionTitle>
            <div className="grid md:grid-cols-3 gap-4">
              {builder.strengths.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition"
                >
                  <div className="w-10 h-10 bg-[#E8740C] text-white rounded-full flex items-center justify-center font-extrabold text-base mb-4">
                    {idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-[#3D2200] mb-2 leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── 基本情報（表） ── */}
          <div>
            <SectionTitle>会社情報</SectionTitle>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <InfoRow label="会社名" value={builder.name} />
                  <InfoRow label="本社所在地" value={`${builder.area} ${builder.region}`} />
                  <InfoRow label="創業" value={`${builder.established}年`} />
                  <InfoRow label="年間施工棟数" value={`約${builder.annualBuilds}棟`} />
                  <InfoRow
                    label="対応エリア"
                    value={builder.serviceCities.join(' / ')}
                  />
                  <InfoRow
                    label="坪単価目安"
                    value={`${builder.pricePerTsubo.min}〜${builder.pricePerTsubo.max}万円`}
                  />
                  <InfoRow
                    label="価格帯"
                    value={`${PRICE_BAND_LABELS[builder.priceBand].label}（${PRICE_BAND_LABELS[builder.priceBand].description}）`}
                  />
                  <InfoRow label="構造・工法" value={builder.construction} />
                  <InfoRow label="断熱性能" value={builder.insulationGrade} />
                  <InfoRow label="耐震等級" value={builder.earthquakeGrade} />
                  <InfoRow label="保証・アフター" value={builder.warranty} />
                  <InfoRow
                    label="向いている方"
                    value={builder.suitableFor.join(' / ')}
                  />
                  <InfoRow label="電話番号" value={builder.phone} />
                </tbody>
              </table>
            </div>
          </div>

          {/* ── 特徴タグ ── */}
          <div>
            <SectionTitle>得意分野</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {builder.specialties.map((s) => (
                <span
                  key={s}
                  className="bg-[#FFF8F0] text-[#E8740C] border border-[#E8740C]/30 px-4 py-2 rounded-full text-sm font-bold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* ── 代表的な動画 ── */}
          {featuredVideos.length > 0 && (
            <div>
              <SectionTitle>代表的なルームツアー動画</SectionTitle>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredVideos.slice(0, 6).map((v) => (
                  <Link
                    key={v.id}
                    href={`/videos/${v.id}`}
                    className="block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition"
                  >
                    <div className="relative aspect-video bg-gray-200">
                      <img
                        src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                        alt={v.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded">
                        ▶ {v.views}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xs font-bold text-[#3D2200] line-clamp-2 mb-2 min-h-[2rem]">
                        {v.title}
                      </h3>
                      <p className="text-[10px] text-gray-500">{v.tsubo > 0 ? `${v.tsubo}坪` : '—'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── 販売中の分譲戸建 ── */}
          {saleHomes.length > 0 && (
            <div>
              <SectionTitle>{builder.name}が販売中の分譲戸建（{saleHomes.length}件）</SectionTitle>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {saleHomes.map((home) => {
                  const status = SALE_HOME_STATUS_LABELS[home.status];
                  return (
                    <Link
                      key={home.id}
                      href={`/sale-homes/${home.id}`}
                      className="block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md hover:border-[#E8740C]/30 transition"
                    >
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-[#FFF8F0] via-[#FFF3E6] to-[#FFECD4] flex items-center justify-center">
                        <div className="text-center text-[#E8740C]/40">
                          <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-[#3D2200] line-clamp-2 mb-2 min-h-[2rem]">
                          {home.title}
                        </h3>
                        <p className="text-xl font-extrabold text-[#E8740C] mb-2">
                          {home.price.toLocaleString()}
                          <span className="text-xs ml-1">万円</span>
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {home.layout} / {home.tsubo}坪 / {home.city}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4 text-right">
                <Link
                  href={`/sale-homes?builder=${builder.id}`}
                  className="inline-block text-xs text-[#E8740C] font-bold hover:underline"
                >
                  すべての分譲戸建を見る →
                </Link>
              </div>
            </div>
          )}

          {/* ── 販売中の土地情報 ── */}
          {lands.length > 0 && (
            <div>
              <SectionTitle>{builder.name}が取扱中の土地情報（{lands.length}件）</SectionTitle>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {lands.map((land) => {
                  const status = LAND_STATUS_LABELS[land.status];
                  return (
                    <Link
                      key={land.id}
                      href={`/lands/${land.id}`}
                      className="block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md hover:border-[#E8740C]/30 transition"
                    >
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 flex items-center justify-center">
                        <div className="text-center text-emerald-700/40">
                          <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8l6-6 6 6M5 8v12a1 1 0 001 1h12a1 1 0 001-1V8M5 8h14" />
                          </svg>
                          <p className="text-xs font-semibold mt-1">{land.tsubo}坪</p>
                        </div>
                        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-[#3D2200] line-clamp-2 mb-2 min-h-[2rem]">
                          {land.title}
                        </h3>
                        <p className="text-xl font-extrabold text-[#E8740C] mb-2">
                          {land.price.toLocaleString()}
                          <span className="text-xs ml-1">万円</span>
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {land.tsubo}坪 / 坪単価{land.pricePerTsubo}万円 / {land.city}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4 text-right">
                <Link
                  href={`/lands?builder=${builder.id}`}
                  className="inline-block text-xs text-[#E8740C] font-bold hover:underline"
                >
                  すべての土地情報を見る →
                </Link>
              </div>
            </div>
          )}

          {/* ── 開催予定の見学会 ── */}
          {builderEvents.length > 0 && (
            <div>
              <SectionTitle>開催予定の見学会</SectionTitle>
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
                        className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2 ${style.bg} ${style.text}`}
                      >
                        {event.typeLabel}
                      </span>
                      <h3 className="text-sm md:text-base font-bold text-[#3D2200] mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>{event.location}</p>
                        <p>{formatPeriod(event.startDate, event.endDate)}</p>
                        <p>定員 {event.capacity}組</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 見学会予約 大型CTA ── */}
          <div className="relative overflow-hidden rounded-2xl bg-[#E8740C] text-white p-8 md:p-12 shadow-xl">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-wider mb-2 opacity-90">
                NEXT STEP
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                {builder.name}の家を実際に見に行きませんか？
              </h2>
              <p className="text-sm md:text-base text-white/95 mb-6 leading-relaxed">
                動画では伝わらない広さ・光の入り方・素材の質感を体感できます。
                {builderEvents.length > 0
                  ? `現在 ${builderEvents.length} 件の見学会を受付中です。`
                  : '随時、見学会を開催しています。'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/event?builder=${encodeURIComponent(builder.name)}`}
                  className="inline-flex items-center justify-center bg-white text-[#E8740C] font-bold px-8 py-3.5 rounded-full text-sm hover:bg-gray-50 transition shadow-lg"
                >
                  見学会の日程を見る
                </Link>
                <Link
                  href="/diagnosis"
                  className="inline-flex items-center justify-center bg-white/15 backdrop-blur-sm border border-white/40 text-white font-bold px-8 py-3.5 rounded-full text-sm hover:bg-white/25 transition"
                >
                  AI診断で相性をチェック
                </Link>
              </div>
            </div>
          </div>

          {/* ── 関連工務店 ── */}
          {relatedBuilders.length > 0 && (
            <div>
              <SectionTitle>同じエリアの他の工務店</SectionTitle>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedBuilders.map((b) => (
                  <Link
                    key={b.id}
                    href={`/builders/${b.id}`}
                    className="block bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-[#E8740C]/30 transition"
                  >
                    <h3 className="font-bold text-[#3D2200] mb-1">{b.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{b.region}</p>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">{b.catchphrase}</p>
                    <div className="flex flex-wrap gap-1">
                      {b.specialties.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="text-[10px] bg-[#FFF8F0] text-[#E8740C] px-2 py-0.5 rounded font-semibold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl md:text-2xl font-bold text-[#3D2200] mb-5 flex items-center gap-3">
      <span className="w-1 h-6 bg-[#E8740C] rounded-full" />
      {children}
    </h2>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center md:text-left">
      <div className="text-[10px] text-gray-500 mb-1 tracking-wide">{label}</div>
      <div className="text-base md:text-lg font-extrabold text-[#3D2200]">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <th className="text-left font-bold text-[#3D2200] bg-[#FFF8F0] px-5 py-3 w-32 md:w-40 align-top text-xs md:text-sm">
        {label}
      </th>
      <td className="px-5 py-3 text-gray-700 text-xs md:text-sm">{value}</td>
    </tr>
  );
}
