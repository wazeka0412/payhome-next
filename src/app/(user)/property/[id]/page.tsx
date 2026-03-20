import Link from 'next/link';
import Image from 'next/image';
import PropertySummary from '@/components/property/PropertySummary';
import PhotoSlideshow from '@/components/property/PhotoSlideshow';
import { LINE_URL } from '@/lib/constants';
import { getPropertyById, properties } from '@/lib/properties';
import { events, EVENT_TYPE_STYLES, formatPeriod } from '@/lib/events-data';

export function generateStaticParams() {
  return properties.map(p => ({ id: p.id }))
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = getPropertyById(id);

  const price = {
    total: property.price,
    building: property.priceBreakdown.building,
    land: property.priceBreakdown.land,
    misc: property.priceBreakdown.misc,
    perTsubo: property.priceBreakdown.perTsubo,
  };

  const specs = {
    layout: property.layout,
    floorArea: property.area,
    siteArea: property.landArea,
    coverageRatio: property.buildingCoverage,
    floorRatio: property.floorAreaRatio,
    structure: '木造平屋建て',
  };

  const land = {
    terrain: property.terrain,
    roadAccess: property.roadAccess,
    landRights: '所有権',
    zoning: property.zoning,
    landCategory: property.landCategory,
    buildingConditions: property.buildingCondition,
  };

  const equipment = {
    kitchen: `${property.kitchen.maker} / ${property.kitchen.series}`,
    bathroom: `${property.bath.maker} / ${property.bath.size}サイズ`,
    toilet: `${property.toilet.maker} / ${property.toilet.series}`,
  };

  // Find events matching this builder
  const builderEvents = events.filter(e => e.builder === property.builder.name);

  return (
    <>
      {/* Breadcrumb Header */}
      <section className="bg-gradient-to-r from-[#E8740C] to-[#F5A623] text-white pt-24 pb-6">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm opacity-85">
            <Link href="/" className="hover:underline">ホーム</Link>
            <span className="mx-1">&gt;</span>
            <Link href="/videos" className="hover:underline">動画コンテンツ</Link>
            <span className="mx-1">&gt;</span>
            <span>物件詳細</span>
          </nav>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* YouTube Embed */}
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg mb-6">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${property.youtubeId}`}
              title={property.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Title & Meta */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-[#E8740C] bg-[#E8740C]/10 px-2 py-0.5 rounded">平屋</span>
              <span className="text-xs font-semibold text-[#E8740C] bg-[#E8740C]/10 px-2 py-0.5 rounded">ルームツアー</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#3D2200] mb-2">{property.title}</h1>
            <p className="text-sm text-gray-400">{property.views}再生</p>
          </div>

          {/* Property Summary Cards */}
          <PropertySummary
            price={price}
            specs={specs}
            land={land}
            equipment={equipment}
          />

          {/* Floor Plan Placeholder */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#3D2200] mb-4">間取り図</h2>
            <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center text-gray-400 text-sm">
              間取り図（準備中）
            </div>
          </div>

          {/* Photos Slideshow */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#3D2200] mb-4">写真ギャラリー</h2>
            <PhotoSlideshow photos={property.photos} title={property.title} />
          </div>

          {/* Points */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#3D2200] mb-4">この家のポイント</h2>
            <ul className="space-y-4">
              {property.points.map((point, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-7 h-7 bg-[#E8740C] text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#3D2200]">{point}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Designer Memo */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#3D2200] mb-4">担当者メモ</h2>
            <div className="bg-[#FFF8F0] rounded-2xl p-6 relative">
              <div className="absolute top-4 right-4 text-[#E8740C]/15">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E8740C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#E8740C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-[#3D2200]">{property.designerMemo.name}</span>
                    <span className="text-[0.65rem] text-[#E8740C] bg-[#E8740C]/10 px-2 py-0.5 rounded-full font-semibold">
                      {property.designerMemo.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{property.designerMemo.comment}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Table */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#3D2200] mb-4">性能・仕様</h2>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <tbody>
                  {[
                    { label: '断熱等級', value: property.insulation },
                    { label: 'UA値', value: `${property.uaValue} W/㎡K` },
                    { label: '耐震等級', value: property.earthquake },
                  ].map((item) => (
                    <tr key={item.label} className="border-b border-gray-50 last:border-0">
                      <th className="text-left text-xs text-gray-500 font-medium py-3 px-4 w-36 bg-gray-50">
                        {item.label}
                      </th>
                      <td className="text-sm text-gray-900 py-3 px-4">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Builder Info (Enhanced) */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#3D2200] mb-4">今回紹介した工務店はこちら</h2>
            <div className="bg-[#FFF8F0] rounded-2xl p-6">
              <div className="flex gap-5 flex-wrap mb-4">
                <div className="w-20 h-20 bg-[#E8740C]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gray-400">Logo</span>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <h3 className="text-lg font-bold text-[#3D2200] mb-1">{property.builder.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{property.builder.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {property.builder.features.map((f) => (
                      <span key={f} className="text-[0.7rem] font-semibold text-[#E8740C] bg-white border border-[#E8740C]/20 px-2.5 py-1 rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {[
                      { label: '所在地', value: property.builder.location },
                      { label: '得意分野', value: property.builder.specialty },
                      { label: '創業', value: property.builder.established },
                      { label: '対応エリア', value: property.builder.serviceArea },
                      { label: '電話番号', value: property.builder.phone },
                      { label: 'ウェブサイト', value: property.builder.website },
                    ].map((row) => (
                      <tr key={row.label} className="border-b border-gray-50 last:border-0">
                        <th className="text-left text-xs text-gray-500 font-medium py-2.5 px-4 w-28 bg-gray-50/50">{row.label}</th>
                        <td className="text-sm text-gray-800 py-2.5 px-4">
                          {row.label === 'ウェブサイト' ? (
                            <span className="text-[#E8740C] text-sm">{row.value}</span>
                          ) : (
                            row.value
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Builder Events */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#3D2200] mb-4">
              この工務店の見学会・イベント情報はこちら
            </h2>
            {builderEvents.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {builderEvents.map((event) => {
                  const style = EVENT_TYPE_STYLES[event.type];
                  return (
                    <Link
                      key={event.id}
                      href={`/event/${event.id}`}
                      className="group bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-[#E8740C] hover:shadow-lg transition-all"
                    >
                      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                        <Image
                          src={event.images[0]}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2-2H10L8 7H5a2 2 0 00-2 2z" />
                            <circle cx="12" cy="13" r="3" strokeWidth={1} />
                          </svg>
                        </div>
                        <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${style.bg} ${style.text} backdrop-blur-sm`}>
                          {event.typeLabel}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-[#3D2200] leading-snug mb-2 group-hover:text-[#E8740C] transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          <svg className="w-4 h-4 text-[#E8740C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={1.5} />
                            <path strokeWidth={1.5} d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                          <span className="font-semibold text-[#3D2200]">
                            {formatPeriod(event.startDate, event.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-end">
                          <span className="text-xs font-bold text-[#E8740C] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                            詳細を見る
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl py-10 text-center">
                <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={1.5} />
                  <path strokeWidth={1.5} d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <p className="text-sm text-gray-400">見学会・イベントの開催予定はありません。</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#E8740C] to-[#F5A623] rounded-2xl p-8 text-center text-white mb-8">
            <h3 className="text-lg font-bold mb-2">この家が気になったら</h3>
            <p className="text-sm opacity-90 mb-5">動画で紹介した工務店への相談・資料請求・見学会予約ができます</p>
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <Link
                href="/consultation"
                className="bg-white text-[#E8740C] font-bold px-8 py-4 rounded-full text-base shadow-lg hover:bg-gray-100 transition"
              >
                無料で相談する
              </Link>
              <Link
                href="/catalog"
                className="border-2 border-white/60 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/20 transition"
              >
                資料を請求する
              </Link>
              <Link
                href="/event"
                className="border-2 border-white/60 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/20 transition"
              >
                見学会を予約する
              </Link>
            </div>
            <p className="mt-4 text-xs opacity-80">
              または{' '}
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold"
              >
                LINEで気軽に相談
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
