import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import { REGIONS } from '@/lib/constants';
import Link from 'next/link';

const kyushuProperties = [
  { id: '01', youtubeId: 'lPIxPVV2jm4', title: 'おひとり様の理想を叶えた平家', prefecture: '鹿児島', views: '15万回' },
  { id: '02', youtubeId: 'eWbyhRr-K1w', title: 'まるで"高級ホテル"豪華すぎるシンプルな平屋', prefecture: '鹿児島', views: '1万回' },
  { id: '03', youtubeId: 'TESbCN-am3k', title: '令和時代に爆発的人気な間取りの平屋', prefecture: '鹿児島', views: '1.8万回' },
  { id: '10', youtubeId: '0gxkNh2BC0A', title: '小さなかわいい平屋。。', prefecture: '鹿児島', views: '99万回' },
  { id: '11', youtubeId: 'm_ndZJfV8a0', title: '老後も安心して過ごせる最先端の平屋', prefecture: '福岡', views: '91万回' },
  { id: '12', youtubeId: 'YhgQSfYYUJ0', title: '完璧な間取りのお洒落で超かわいい平屋', prefecture: '熊本', views: '78万回' },
];

export default function AreaPage() {
  return (
    <>
      <PageHeader
        title="エリアから探す"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: 'エリアから探す' },
        ]}
        subtitle="お住まいのエリアから物件動画を探せます"
      />

      {/* Region Cards */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-[#3D2200] mb-6">地域を選択</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {REGIONS.map((region) => {
              const isActive = region.id === 'kyushu';
              return (
                <Link
                  key={region.id}
                  href={`#${region.id}`}
                  className={`block rounded-2xl p-5 text-center transition-shadow hover:shadow-md ${
                    isActive
                      ? 'bg-[#E8740C] text-white'
                      : 'bg-white border border-gray-100 text-gray-800 hover:border-[#E8740C]'
                  }`}
                >
                  <h3 className="text-lg font-bold mb-1">{region.name}</h3>
                  <p className={`text-xs ${isActive ? 'opacity-80' : 'text-gray-400'}`}>
                    {region.prefectures.join('・')}
                  </p>
                  {isActive && (
                    <span className="inline-block mt-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {kyushuProperties.length}件の物件
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kyushu Section */}
      <section id="kyushu" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-[#3D2200] mb-6">九州・沖縄</h2>

          {/* Prefecture Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['すべて', '鹿児島', '福岡', '熊本', '宮崎', '大分', '長崎', '佐賀', '沖縄'].map((pref, i) => (
              <button
                key={pref}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  i === 0
                    ? 'bg-[#E8740C] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#E8740C] hover:text-[#E8740C]'
                }`}
              >
                {pref}
              </button>
            ))}
          </div>

          {/* Property Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kyushuProperties.map((prop) => (
              <Card
                key={prop.id}
                href={`/property/${prop.id}`}
                imageSrc={`https://img.youtube.com/vi/${prop.youtubeId}/maxresdefault.jpg`}
                imageAlt={prop.title}
                tag={prop.prefecture}
                meta={`${prop.views}再生`}
                title={prop.title}
                showPlay
              />
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon sections */}
      {REGIONS.filter((r) => r.id !== 'kyushu').map((region) => (
        <section key={region.id} id={region.id} className="py-12 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl font-bold text-[#3D2200] mb-4">{region.name}</h2>
            <div className="bg-[#FFF8F0] rounded-2xl p-10 text-center">
              <p className="text-gray-500 text-sm mb-2">Coming Soon</p>
              <p className="text-xs text-gray-400">
                {region.name}エリアの物件情報は準備中です。公開まで今しばらくお待ちください。
              </p>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
