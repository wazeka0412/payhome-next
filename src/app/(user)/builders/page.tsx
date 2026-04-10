import PageHeader from '@/components/ui/PageHeader';
import FilterTabs from '@/components/ui/FilterTabs';
import Link from 'next/link';
import { builders } from '@/lib/builders-data';

export default function BuildersPage() {
  // region から県名を抽出（フィルタタブ用）
  const prefectures = Array.from(new Set(builders.map((b) => b.area.replace('県', ''))));

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
          <FilterTabs tabs={['すべて', ...prefectures]} />

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
                    <p className="text-xs text-gray-500">{builder.region}</p>
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
                  年間施工: 約{builder.annualBuilds}棟 / エリア: {builder.area}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/builders/${builder.id}`}
                    className="flex-1 text-center bg-[#E8740C] text-white text-xs font-bold py-2.5 rounded-full hover:bg-[#D4660A] transition"
                  >
                    詳しく見る
                  </Link>
                  <Link
                    href={`/event?builder=${encodeURIComponent(builder.name)}`}
                    className="flex-1 text-center border border-[#E8740C] text-[#E8740C] text-xs font-bold py-2.5 rounded-full hover:bg-[#E8740C]/5 transition"
                  >
                    見学会予約
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
