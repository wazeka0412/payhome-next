'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import FilterTabs from '@/components/ui/FilterTabs';
import Pagination from '@/components/ui/Pagination';

const videos = [
  { id: '10', youtubeId: '0gxkNh2BC0A', title: '小さなかわいい平屋。。', views: '99万回再生', viewCount: 990000, category: 'ルームツアー' },
  { id: '11', youtubeId: 'm_ndZJfV8a0', title: '老後も安心して過ごせる最先端の平屋', views: '91万回再生', viewCount: 910000, category: 'ルームツアー' },
  { id: '12', youtubeId: 'YhgQSfYYUJ0', title: '完璧な間取りのお洒落で超かわいい平屋', views: '78万回再生', viewCount: 780000, category: 'ルームツアー' },
  { id: '13', youtubeId: 'rTceXJ2NoP4', title: '超有名な一級建築家の作る天才的な平屋', views: '59万回再生', viewCount: 590000, category: 'ルームツアー' },
  { id: '14', youtubeId: 'Oz3mV-uGTH8', title: 'お値段大公開！20坪の小さな高性能平屋', views: '59万回再生', viewCount: 590000, category: 'ルームツアー' },
  { id: '15', youtubeId: 'ocRVUPEcx90', title: '完全に大人の女性に似合う平屋！', views: '50万回再生', viewCount: 500000, category: 'ルームツアー' },
  { id: '16', youtubeId: 'WzSTo2M9Mug', title: '嘘だろ...これが平屋はヤバすぎる！', views: '47万回再生', viewCount: 470000, category: 'ルームツアー' },
  { id: '17', youtubeId: '2KAwhfOO3uI', title: '令和時代に超人気な間取りの平屋', views: '47万回再生', viewCount: 470000, category: 'ルームツアー' },
  { id: '18', youtubeId: 'P3walOjt0uE', title: 'えっヤバすぎ！これはもはや平屋ではない。', views: '47万回再生', viewCount: 470000, category: 'ルームツアー' },
  { id: '19', youtubeId: 'npGkmEaOaI0', title: '女性設計士の作るボーホーインテリアのかわいい平屋', views: '44万回再生', viewCount: 440000, category: 'ルームツアー' },
  { id: '20', youtubeId: 'crfgrlvsaWY', title: 'シンプルおしゃれの小さく可愛い平屋', views: '40万回再生', viewCount: 400000, category: 'ルームツアー' },
  { id: '21', youtubeId: 'An1aJxhWjgg', title: '大人仕様のおしゃれな平屋', views: '39万回再生', viewCount: 390000, category: 'ルームツアー' },
  { id: '22', youtubeId: 'isKYL1WKaRI', title: '完全に騙された！全てがヤバ過ぎる平屋', views: '28万回再生', viewCount: 280000, category: 'ルームツアー' },
  { id: '23', youtubeId: 'do6aZ23Gv0U', title: 'ここ海外？セレブにお洒落な奥様必見の平屋', views: '26万回再生', viewCount: 260000, category: 'ルームツアー' },
  { id: '24', youtubeId: 'gbUaUWPT9dQ', title: 'IoTのハイテクすぎるおしゃれな平屋', views: '25万回再生', viewCount: 250000, category: 'ルームツアー' },
  { id: '25', youtubeId: 'AvieNcvE3rc', title: '一級建築士の作る超大豪邸の平屋', views: '25万回再生', viewCount: 250000, category: 'ルームツアー' },
  { id: '26', youtubeId: 'C3Ovhi472uk', title: '白基調でかわいい！風通しのいいLDKが最高な24坪の平屋', views: '24万回再生', viewCount: 240000, category: 'ルームツアー' },
  { id: '27', youtubeId: '4WMf8_JMS58', title: 'アメリカンカントリー調の高性能なかわいい平屋', views: '23万回再生', viewCount: 230000, category: 'ルームツアー' },
  { id: '28', youtubeId: '7iBoXBebyZM', title: '旅館？別荘？これぞ和の漂う最高級の平屋', views: '22万回再生', viewCount: 220000, category: 'ルームツアー' },
  { id: '29', youtubeId: 'bgQbK9Oe15E', title: 'お家でカフェ気分！人を呼びたくなる平屋', views: '20万回再生', viewCount: 200000, category: 'ルームツアー' },
  { id: '30', youtubeId: 'dEpBZBmsXlk', title: '女性設計士さんが考えた家族温まるかわいい平屋', views: '19万回再生', viewCount: 190000, category: 'ルームツアー' },
  { id: '31', youtubeId: 'nmKWWxKGrCc', title: 'ドストライクを貫く広くてかわいい平屋', views: '18万回再生', viewCount: 180000, category: 'ルームツアー' },
  { id: '32', youtubeId: 'gX-7VytEPZc', title: 'これぞ理想的！完璧な家事動線の平屋', views: '17万回再生', viewCount: 170000, category: 'ルームツアー' },
  { id: '33', youtubeId: 'vUhExXZ8TLE', title: 'やっぱりコンパクト！シンプルに住みやすい平屋', views: '16万回再生', viewCount: 160000, category: 'ルームツアー' },
  { id: '34', youtubeId: 'MIUreMvCvUU', title: 'これが風呂？色々と企画外な広々平屋', views: '16万回再生', viewCount: 160000, category: 'ルームツアー' },
  { id: '01', youtubeId: 'lPIxPVV2jm4', title: 'おひとり様の理想を叶えた平家', views: '15万回再生', viewCount: 150000, category: 'ルームツアー' },
  { id: '35', youtubeId: 'yFGUF3Ldan4', title: 'これなら老後も安心安全の間取りの平屋', views: '15万回再生', viewCount: 150000, category: 'ルームツアー' },
  { id: '36', youtubeId: 'AAOiIYhL2y8', title: '一級建築家の作る扉のない2LDK平屋', views: '14万回再生', viewCount: 140000, category: 'ルームツアー' },
  { id: '37', youtubeId: '7EQp2_-aq6M', title: '色気漂う男の極上の平屋', views: '14万回再生', viewCount: 140000, category: 'ルームツアー' },
  { id: '38', youtubeId: 'yPgUC3wftA0', title: '完全に惚れてしまうシックにカッコイイ平屋', views: '14万回再生', viewCount: 140000, category: 'ルームツアー' },
  { id: '39', youtubeId: 'uzy-qm-GkJ4', title: '色々とおかしい15坪1LDKの極小平屋', views: '13万回再生', viewCount: 130000, category: 'ルームツアー' },
  { id: '40', youtubeId: 'sboD9U6jgns', title: 'おしゃれなキッチンとコンパクトでも抜かりない平屋', views: '12万回再生', viewCount: 120000, category: 'ルームツアー' },
  { id: '41', youtubeId: 'AZfUPSWLIhE', title: '温もりある木に包まれた心落ち着く平屋', views: '12万回再生', viewCount: 120000, category: 'ルームツアー' },
  { id: '08', youtubeId: '4CeIIZ2qMWs', title: '26坪4LDKでコスパ最強なスーパー平屋', views: '2.6万回再生', viewCount: 26000, category: 'ルームツアー' },
  { id: '03', youtubeId: 'TESbCN-am3k', title: '令和時代に爆発的人気な間取りの平屋', views: '1.8万回再生', viewCount: 18000, category: 'ルームツアー' },
  { id: '06', youtubeId: 'IPM8xygYlhU', title: '空調のこだわりと最強の気密性を備えた平屋', views: '1.7万回再生', viewCount: 17000, category: 'ルームツアー' },
  { id: '07', youtubeId: 'B0u0UPkB89U', title: 'こりゃかわいい！好みのデザインで埋め尽くした平屋', views: '1.7万回再生', viewCount: 17000, category: 'ルームツアー' },
  { id: '02', youtubeId: 'eWbyhRr-K1w', title: 'まるで"高級ホテル"豪華すぎるシンプルな平屋', views: '1万回再生', viewCount: 10000, category: 'ルームツアー' },
  { id: '04', youtubeId: 'fZMmHqHXtMI', title: '27坪なのに4LDKで収納たっぷりの平屋', views: '7,909回再生', viewCount: 7909, category: 'ルームツアー' },
  { id: '05', youtubeId: 'UkCuPCS7eWs', title: '家づくりの参考になる素敵な間取りの平屋まとめ', views: '7,160回再生', viewCount: 7160, category: 'ルームツアー' },
  { id: '09', youtubeId: '1V4Ok8iftTY', title: '広く感じるLDKなのに28坪で3LDKの間取りな平屋', views: '3,920回再生', viewCount: 3920, category: 'ルームツアー' },
];

const ITEMS_PER_PAGE = 6;
const FILTER_TABS = ['すべて', 'ルームツアー', '取材', '解説', 'トレンド'];

export default function VideosPage() {
  const [activeFilter, setActiveFilter] = useState('すべて');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = activeFilter === 'すべて'
    ? videos
    : videos.filter(item => item.category === activeFilter);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <PageHeader
        title="動画コンテンツ"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '動画コンテンツ' },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <FilterTabs
            tabs={FILTER_TABS}
            onChange={(tab) => { setActiveFilter(tab); setCurrentPage(1); }}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((video) => (
              <Card
                key={video.id}
                href={`/property/${video.id}`}
                imageSrc={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                imageAlt={video.title}
                tag={video.category}
                meta={video.views}
                title={video.title}
                showPlay
              />
            ))}
          </div>

          {paginatedItems.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">該当する動画がありません</div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page)
              document.querySelector('section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-br from-[#3D2200] to-[#E8740C] text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest uppercase opacity-80 mb-3">For Housing Companies</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">住宅会社の集客を、動画とWEBで変える。</h2>
          <p className="text-sm opacity-90 leading-relaxed mb-6">
            ルームツアー撮影・SNS運用・WEB制作をパッケージでご提供。<br />まずはお気軽にご相談ください。
          </p>
          <Link
            href="/consultation"
            className="inline-block bg-white text-[#3D2200] font-bold px-8 py-3.5 rounded-full text-sm hover:bg-gray-100 transition"
          >
            サービス詳細を見る
          </Link>
        </div>
      </section>
    </>
  );
}
