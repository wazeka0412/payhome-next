import { notFound } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import {
  saleHomes,
  getSaleHomeById,
  SALE_HOME_STATUS_LABELS,
  getSaleHomesByBuilderId,
} from '@/lib/sale-homes-data';
import { getBuilderById } from '@/lib/builders-data';

export function generateStaticParams() {
  return saleHomes.map((s) => ({ id: s.id }));
}

export default async function SaleHomeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const home = getSaleHomeById(id);

  if (!home) {
    notFound();
  }

  const builder = getBuilderById(home.builderId);
  const status = SALE_HOME_STATUS_LABELS[home.status];

  // 同じ工務店の他の建売（最大3件）
  const otherHomes = getSaleHomesByBuilderId(home.builderId)
    .filter((h) => h.id !== home.id)
    .slice(0, 3);

  return (
    <>
      <PageHeader
        title={home.title}
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '建売情報', href: '/sale-homes' },
          { label: home.title },
        ]}
        subtitle={home.catchphrase}
      />

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#FFF8F0] via-[#FFF3E6] to-[#FFECD4]">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${status.color}`}>
              {status.label}
            </span>
            <span className="text-xs text-gray-500">
              {home.prefecture} {home.city} / 完成予定 {home.completionDate}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#3D2200] mb-3 leading-tight">
            {home.title}
          </h1>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-6 max-w-3xl">
            {home.description}
          </p>

          {/* Price + KPI strip */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-500 mb-1">本体価格</p>
              <p className="text-4xl md:text-5xl font-extrabold text-[#E8740C] leading-none">
                {home.price.toLocaleString()}
                <span className="text-xl ml-2 text-[#3D2200]">万円</span>
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              <Stat label="間取り" value={home.layout} />
              <Stat label="建物面積" value={`${home.buildingArea}㎡（${home.tsubo}坪）`} />
              <Stat label="土地面積" value={`${home.landArea}㎡`} />
              <Stat label="駐車場" value={`${home.parking}台`} />
            </div>
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          {/* ── ハイライト ── */}
          <div>
            <SectionTitle>この物件の魅力</SectionTitle>
            <div className="grid md:grid-cols-3 gap-4">
              {home.highlights.map((h, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6">
                  <div className="w-10 h-10 bg-[#E8740C] text-white rounded-full flex items-center justify-center font-extrabold mb-3">
                    {idx + 1}
                  </div>
                  <p className="text-sm font-bold text-[#3D2200] leading-relaxed">{h}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── 物件情報テーブル ── */}
          <div>
            <SectionTitle>物件情報</SectionTitle>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <Row label="物件名" value={home.title} />
                  <Row label="所在地" value={`${home.prefecture} ${home.city}`} />
                  <Row label="本体価格" value={`${home.price.toLocaleString()} 万円`} />
                  <Row label="建物種別" value={home.houseType} />
                  <Row label="間取り" value={home.layout} />
                  <Row label="土地面積" value={`${home.landArea} ㎡`} />
                  <Row label="建物面積" value={`${home.buildingArea} ㎡（${home.tsubo}坪）`} />
                  <Row label="駐車場" value={`${home.parking}台`} />
                  <Row label="完成時期" value={home.completionDate} />
                  <Row label="販売状況" value={status.label} />
                  {builder && <Row label="施工会社" value={builder.name} />}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── 設備仕様 ── */}
          <div>
            <SectionTitle>設備・仕様</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {home.facilities.map((f) => (
                <span
                  key={f}
                  className="bg-[#FFF8F0] text-[#E8740C] border border-[#E8740C]/30 px-4 py-2 rounded-full text-sm font-semibold"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* ── タグ ── */}
          <div>
            <SectionTitle>特徴</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {home.tags.map((t) => (
                <span
                  key={t}
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs font-semibold"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* ── 施工会社 ── */}
          {builder && (
            <div>
              <SectionTitle>施工会社</SectionTitle>
              <Link
                href={`/builders/${builder.id}`}
                className="block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-[#E8740C]/30 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#FFF8F0] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] text-gray-400">LOGO</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-[#3D2200] mb-1">{builder.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {builder.area} / 創業{builder.established}年 / 年間{builder.annualBuilds}棟
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{builder.catchphrase}</p>
                  </div>
                  <span className="text-xs font-bold text-[#E8740C]">詳しく見る →</span>
                </div>
              </Link>
            </div>
          )}

          {/* ── 大型CTA：見学予約 / 会員登録 ── */}
          <div className="relative overflow-hidden rounded-2xl bg-[#E8740C] text-white p-8 md:p-12 shadow-xl">
            <p className="text-xs font-bold tracking-wider mb-2 opacity-90">NEXT STEP</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
              この物件が気になりますか？
            </h2>
            <p className="text-sm md:text-base text-white/95 mb-6 leading-relaxed max-w-2xl">
              見学予約をして実物を体感するか、AI診断であなたとの相性をチェック。
              会員登録（無料）すると、お気に入り保存や履歴管理ができます。
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={builder ? `/event?builder=${encodeURIComponent(builder.name)}` : '/event'}
                className="inline-flex items-center justify-center bg-white text-[#E8740C] font-bold px-8 py-3.5 rounded-full text-sm hover:bg-gray-50 transition shadow-lg"
              >
                見学予約する
              </Link>
              <Link
                href="/diagnosis"
                className="inline-flex items-center justify-center bg-white/15 backdrop-blur-sm border border-white/40 text-white font-bold px-8 py-3.5 rounded-full text-sm hover:bg-white/25 transition"
              >
                AI診断で相性チェック
              </Link>
              <Link
                href={`/signup?redirect=/sale-homes/${home.id}`}
                className="inline-flex items-center justify-center bg-white/15 backdrop-blur-sm border border-white/40 text-white font-bold px-8 py-3.5 rounded-full text-sm hover:bg-white/25 transition"
              >
                お気に入り登録
              </Link>
            </div>
          </div>

          {/* ── 同じ工務店の他の建売 ── */}
          {otherHomes.length > 0 && builder && (
            <div>
              <SectionTitle>{builder.name}が販売中の他の分譲住宅</SectionTitle>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {otherHomes.map((h) => {
                  const s = SALE_HOME_STATUS_LABELS[h.status];
                  return (
                    <Link
                      key={h.id}
                      href={`/sale-homes/${h.id}`}
                      className="block bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-[#E8740C]/30 transition"
                    >
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${s.color}`}>
                        {s.label}
                      </span>
                      <h3 className="text-sm font-bold text-[#3D2200] line-clamp-2 mb-2 min-h-[2rem]">
                        {h.title}
                      </h3>
                      <p className="text-xl font-extrabold text-[#E8740C] mb-2">
                        {h.price.toLocaleString()}
                        <span className="text-xs ml-1">万円</span>
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {h.layout} / {h.tsubo}坪 / {h.city}
                      </p>
                    </Link>
                  );
                })}
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-gray-500 mb-1">{label}</div>
      <div className="text-sm md:text-base font-bold text-[#3D2200]">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <th className="text-left font-bold text-[#3D2200] bg-[#FFF8F0] px-5 py-3 w-32 md:w-40 align-top text-xs md:text-sm">
        {label}
      </th>
      <td className="px-5 py-3 text-gray-700 text-xs md:text-sm">{value}</td>
    </tr>
  );
}
