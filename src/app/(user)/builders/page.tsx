import PageHeader from '@/components/ui/PageHeader';
import FilterTabs from '@/components/ui/FilterTabs';
import Link from 'next/link';

const builders = [
  { id: 'b01', name: '万代ホーム', area: '鹿児島市', region: '鹿児島', specialties: ['平屋', '注文住宅', 'バリアフリー'], annualBuilds: 25 },
  { id: 'b02', name: '南日本ハウス', area: '鹿児島市', region: '鹿児島', specialties: ['平屋', 'デザイン住宅'], annualBuilds: 40 },
  { id: 'b03', name: 'ヤマサハウス', area: '鹿児島市', region: '鹿児島', specialties: ['木造住宅', '高気密高断熱'], annualBuilds: 80 },
  { id: 'b04', name: '田建築工房', area: '鹿児島市', region: '鹿児島', specialties: ['自然素材', '和モダン'], annualBuilds: 15 },
  { id: 'b05', name: 'マルマサハウス', area: '鹿児島市', region: '鹿児島', specialties: ['平屋', 'ローコスト'], annualBuilds: 30 },
  { id: 'b06', name: '福岡工務店', area: '福岡市', region: '福岡', specialties: ['デザイン住宅', '二世帯'], annualBuilds: 60 },
  { id: 'b07', name: '太陽ハウス', area: '福岡市', region: '福岡', specialties: ['高性能住宅', 'ZEH'], annualBuilds: 45 },
  { id: 'b08', name: '熊本建設', area: '熊本市', region: '熊本', specialties: ['耐震住宅', '平屋'], annualBuilds: 35 },
  { id: 'b09', name: '宮崎ホーム', area: '宮崎市', region: '宮崎', specialties: ['平屋', 'ガーデンハウス'], annualBuilds: 20 },
  { id: 'b10', name: '大分住建', area: '大分市', region: '大分', specialties: ['自然素材', '平屋'], annualBuilds: 18 },
  { id: 'b11', name: '長崎建築', area: '長崎市', region: '長崎', specialties: ['デザイン住宅', '狭小住宅'], annualBuilds: 22 },
  { id: 'b12', name: '佐賀ハウジング', area: '佐賀市', region: '佐賀', specialties: ['注文住宅', '二世帯'], annualBuilds: 28 },
];

export default function BuildersPage() {
  return (
    <>
      <PageHeader
        title="工務店一覧"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '工務店一覧' },
        ]}
        subtitle="ぺいほーむが取材した提携工務店をご紹介"
      />

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <FilterTabs
            tabs={['すべて', '鹿児島', '福岡', '熊本', '宮崎', '大分', '長崎', '佐賀']}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {builders.map((builder) => (
              <div
                key={builder.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-[#FFF8F0] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-gray-400">Logo</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-[#3D2200] mb-1 truncate">{builder.name}</h3>
                    <p className="text-xs text-gray-500">{builder.area}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {builder.specialties.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-[#E8740C]/10 text-[#E8740C] px-2 py-0.5 rounded font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-400 mb-4">
                  年間施工: 約{builder.annualBuilds}棟 / エリア: {builder.region}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/builders/contact?builder=${encodeURIComponent(builder.name)}&area=${encodeURIComponent(builder.area)}`}
                    className="flex-1 text-center bg-[#E8740C] text-white text-xs font-bold py-2.5 rounded-full hover:bg-[#D4660A] transition"
                  >
                    この工務店に相談
                  </Link>
                  <Link
                    href="/catalog"
                    className="flex-1 text-center border border-[#E8740C] text-[#E8740C] text-xs font-bold py-2.5 rounded-full hover:bg-[#E8740C]/5 transition"
                  >
                    資料請求
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
