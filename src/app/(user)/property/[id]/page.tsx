import Link from 'next/link';
import PropertySummary from '@/components/property/PropertySummary';
import { LINE_URL } from '@/lib/constants';
import { getPropertyById, properties } from '@/lib/properties';

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

          {/* Builder Info */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#3D2200] mb-4">今回紹介した工務店はこちら</h2>
            <div className="bg-[#FFF8F0] rounded-2xl p-6">
              <div className="flex gap-5 flex-wrap">
                <div className="w-20 h-20 bg-[#E8740C]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gray-400">Logo</span>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <h3 className="text-base font-bold text-[#3D2200] mb-3">{property.builder.name}</h3>
                  <div className="bg-white rounded-xl overflow-hidden mb-3">
                    <table className="w-full">
                      <tbody>
                        {[
                          { label: '所在地', value: property.builder.location },
                          { label: '得意分野', value: property.builder.specialty },
                        ].map((row) => (
                          <tr key={row.label} className="border-b border-gray-50 last:border-0">
                            <th className="text-left text-xs text-gray-500 font-medium py-2 px-3 w-24">{row.label}</th>
                            <td className="text-sm text-gray-800 py-2 px-3">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
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
