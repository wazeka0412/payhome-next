'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import FilterTabs from '@/components/ui/FilterTabs';
import PrefectureFilter from '@/components/ui/PrefectureFilter';
import Pagination from '@/components/ui/Pagination';

const videos = [
  { id: '10', youtubeId: '0gxkNh2BC0A', title: '小さなかわいい平屋。。', views: '99万回再生', viewCount: 990000, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ハウスサポート', tsubo: 25 },
  { id: '11', youtubeId: 'm_ndZJfV8a0', title: '老後も安心して過ごせる最先端の平屋', views: '91万回再生', viewCount: 910000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 30 },
  { id: '12', youtubeId: 'YhgQSfYYUJ0', title: '完璧な間取りのお洒落で超かわいい平屋', views: '78万回再生', viewCount: 780000, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ベルハウジング', tsubo: 28 },
  { id: '13', youtubeId: 'rTceXJ2NoP4', title: '超有名な一級建築家の作る天才的な平屋', views: '59万回再生', viewCount: 590000, category: 'ルームツアー', prefecture: '福岡県', builder: 'タマルハウス', tsubo: 35 },
  { id: '14', youtubeId: 'Oz3mV-uGTH8', title: 'お値段大公開！20坪の小さな高性能平屋', views: '59万回再生', viewCount: 590000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '感動ハウス', tsubo: 20 },
  { id: '15', youtubeId: 'ocRVUPEcx90', title: '完全に大人の女性に似合う平屋！', views: '50万回再生', viewCount: 500000, category: 'ルームツアー', prefecture: '福岡県', builder: 'タマルハウス', tsubo: 32 },
  { id: '16', youtubeId: 'WzSTo2M9Mug', title: '嘘だろ...これが平屋はヤバすぎる！', views: '47万回再生', viewCount: 470000, category: 'ルームツアー', prefecture: '熊本県', builder: 'ハウスサポート', tsubo: 40 },
  { id: '17', youtubeId: '2KAwhfOO3uI', title: '令和時代に超人気な間取りの平屋', views: '47万回再生', viewCount: 470000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 28 },
  { id: '18', youtubeId: 'P3walOjt0uE', title: 'えっヤバすぎ！これはもはや平屋ではない。', views: '47万回再生', viewCount: 470000, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ヤマサハウス', tsubo: 45 },
  { id: '19', youtubeId: 'npGkmEaOaI0', title: '女性設計士の作るボーホーインテリアのかわいい平屋', views: '44万回再生', viewCount: 440000, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ベルハウジング', tsubo: 26 },
  { id: '20', youtubeId: 'crfgrlvsaWY', title: 'シンプルおしゃれの小さく可愛い平屋', views: '40万回再生', viewCount: 400000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '七呂建設', tsubo: 22 },
  { id: '21', youtubeId: 'An1aJxhWjgg', title: '大人仕様のおしゃれな平屋', views: '39万回再生', viewCount: 390000, category: 'ルームツアー', prefecture: '福岡県', builder: 'タマルハウス', tsubo: 30 },
  { id: '22', youtubeId: 'isKYL1WKaRI', title: '完全に騙された！全てがヤバ過ぎる平屋', views: '28万回再生', viewCount: 280000, category: 'ルームツアー', prefecture: '熊本県', builder: 'ハウスサポート', tsubo: 35 },
  { id: '23', youtubeId: 'do6aZ23Gv0U', title: 'ここ海外？セレブにお洒落な奥様必見の平屋', views: '26万回再生', viewCount: 260000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 38 },
  { id: '24', youtubeId: 'gbUaUWPT9dQ', title: 'IoTのハイテクすぎるおしゃれな平屋', views: '25万回再生', viewCount: 250000, category: 'ルームツアー', prefecture: '福岡県', builder: 'タマルハウス', tsubo: 33 },
  { id: '25', youtubeId: 'AvieNcvE3rc', title: '一級建築士の作る超大豪邸の平屋', views: '25万回再生', viewCount: 250000, category: 'ルームツアー', prefecture: '大分県', builder: '大分建設', tsubo: 50 },
  { id: '26', youtubeId: 'C3Ovhi472uk', title: '白基調でかわいい！風通しのいいLDKが最高な24坪の平屋', views: '24万回再生', viewCount: 240000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '七呂建設', tsubo: 24 },
  { id: '27', youtubeId: '4WMf8_JMS58', title: 'アメリカンカントリー調の高性能なかわいい平屋', views: '23万回再生', viewCount: 230000, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ベルハウジング', tsubo: 27 },
  { id: '28', youtubeId: '7iBoXBebyZM', title: '旅館？別荘？これぞ和の漂う最高級の平屋', views: '22万回再生', viewCount: 220000, category: 'ルームツアー', prefecture: '宮崎県', builder: '宮崎建設', tsubo: 42 },
  { id: '29', youtubeId: 'bgQbK9Oe15E', title: 'お家でカフェ気分！人を呼びたくなる平屋', views: '20万回再生', viewCount: 200000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 29 },
  { id: '30', youtubeId: 'dEpBZBmsXlk', title: '女性設計士さんが考えた家族温まるかわいい平屋', views: '19万回再生', viewCount: 190000, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ベルハウジング', tsubo: 26 },
  { id: '31', youtubeId: 'nmKWWxKGrCc', title: 'ドストライクを貫く広くてかわいい平屋', views: '18万回再生', viewCount: 180000, category: 'ルームツアー', prefecture: '福岡県', builder: 'タマルハウス', tsubo: 30 },
  { id: '32', youtubeId: 'gX-7VytEPZc', title: 'これぞ理想的！完璧な家事動線の平屋', views: '17万回再生', viewCount: 170000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 28 },
  { id: '33', youtubeId: 'vUhExXZ8TLE', title: 'やっぱりコンパクト！シンプルに住みやすい平屋', views: '16万回再生', viewCount: 160000, category: 'ルームツアー', prefecture: '熊本県', builder: 'ハウスサポート', tsubo: 22 },
  { id: '34', youtubeId: 'MIUreMvCvUU', title: 'これが風呂？色々と企画外な広々平屋', views: '16万回再生', viewCount: 160000, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ヤマサハウス', tsubo: 36 },
  { id: '01', youtubeId: 'lPIxPVV2jm4', title: 'おひとり様の理想を叶えた平家', views: '15万回再生', viewCount: 150000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 18 },
  { id: '35', youtubeId: 'yFGUF3Ldan4', title: 'これなら老後も安心安全の間取りの平屋', views: '15万回再生', viewCount: 150000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '感動ハウス', tsubo: 25 },
  { id: '36', youtubeId: 'AAOiIYhL2y8', title: '一級建築家の作る扉のない2LDK平屋', views: '14万回再生', viewCount: 140000, category: 'ルームツアー', prefecture: '福岡県', builder: 'タマルハウス', tsubo: 24 },
  { id: '37', youtubeId: '7EQp2_-aq6M', title: '色気漂う男の極上の平屋', views: '14万回再生', viewCount: 140000, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ベルハウジング', tsubo: 32 },
  { id: '38', youtubeId: 'yPgUC3wftA0', title: '完全に惚れてしまうシックにカッコイイ平屋', views: '14万回再生', viewCount: 140000, category: 'ルームツアー', prefecture: '大分県', builder: '大分建設', tsubo: 30 },
  { id: '39', youtubeId: 'uzy-qm-GkJ4', title: '色々とおかしい15坪1LDKの極小平屋', views: '13万回再生', viewCount: 130000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '七呂建設', tsubo: 15 },
  { id: '40', youtubeId: 'sboD9U6jgns', title: 'おしゃれなキッチンとコンパクトでも抜かりない平屋', views: '12万回再生', viewCount: 120000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 23 },
  { id: '41', youtubeId: 'AZfUPSWLIhE', title: '温もりある木に包まれた心落ち着く平屋', views: '12万回再生', viewCount: 120000, category: 'ルームツアー', prefecture: '宮崎県', builder: '宮崎建設', tsubo: 27 },
  { id: '08', youtubeId: '4CeIIZ2qMWs', title: '26坪4LDKでコスパ最強なスーパー平屋', views: '2.6万回再生', viewCount: 26000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '感動ハウス', tsubo: 26 },
  { id: '03', youtubeId: 'TESbCN-am3k', title: '令和時代に爆発的人気な間取りの平屋', views: '1.8万回再生', viewCount: 18000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 28 },
  { id: '06', youtubeId: 'IPM8xygYlhU', title: '空調のこだわりと最強の気密性を備えた平屋', views: '1.7万回再生', viewCount: 17000, category: 'ルームツアー', prefecture: '鹿児島県', builder: '感動ハウス', tsubo: 30 },
  { id: '07', youtubeId: 'B0u0UPkB89U', title: 'こりゃかわいい！好みのデザインで埋め尽くした平屋', views: '1.7万回再生', viewCount: 17000, category: 'ルームツアー', prefecture: '福岡県', builder: 'タマルハウス', tsubo: 25 },
  { id: '02', youtubeId: 'eWbyhRr-K1w', title: 'まるで"高級ホテル"豪華すぎるシンプルな平屋', views: '1万回再生', viewCount: 10000, category: 'ルームツアー', prefecture: '熊本県', builder: 'ハウスサポート', tsubo: 35 },
  { id: '04', youtubeId: 'fZMmHqHXtMI', title: '27坪なのに4LDKで収納たっぷりの平屋', views: '7,909回再生', viewCount: 7909, category: 'ルームツアー', prefecture: '鹿児島県', builder: '七呂建設', tsubo: 27 },
  { id: '05', youtubeId: 'UkCuPCS7eWs', title: '家づくりの参考になる素敵な間取りの平屋まとめ', views: '7,160回再生', viewCount: 7160, category: 'ルームツアー', prefecture: '鹿児島県', builder: '万代ホーム', tsubo: 0 },
  { id: '09', youtubeId: '1V4Ok8iftTY', title: '広く感じるLDKなのに28坪で3LDKの間取りな平屋', views: '3,920回再生', viewCount: 3920, category: 'ルームツアー', prefecture: '鹿児島県', builder: 'ベルハウジング', tsubo: 28 },
];

const ITEMS_PER_PAGE = 6;
const FILTER_TABS = ['すべて', 'ルームツアー', '取材', '解説', 'トレンド'];
const SORT_OPTIONS = [
  { value: 'popular', label: '人気順' },
  { value: 'newest', label: '新着順' },
  { value: 'tsubo-asc', label: '坪数：小さい順' },
  { value: 'tsubo-desc', label: '坪数：大きい順' },
] as const;

export default function VideosPage() {
  const [activeFilter, setActiveFilter] = useState('すべて');
  const [prefecture, setPrefecture] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<string>('popular');
  const [tsuboMin, setTsuboMin] = useState('');
  const [tsuboMax, setTsuboMax] = useState('');
  const [selectedBuilder, setSelectedBuilder] = useState('all');

  const builders = ['all', ...Array.from(new Set(videos.map(v => v.builder)))];

  let filteredItems = videos.filter(item => {
    if (activeFilter !== 'すべて' && item.category !== activeFilter) return false;
    if (prefecture !== 'all' && item.prefecture !== prefecture) return false;
    if (selectedBuilder !== 'all' && item.builder !== selectedBuilder) return false;
    if (keyword) {
      const q = keyword.toLowerCase();
      if (!item.title.toLowerCase().includes(q) && !item.builder.toLowerCase().includes(q)) return false;
    }
    if (tsuboMin && item.tsubo > 0 && item.tsubo < Number(tsuboMin)) return false;
    if (tsuboMax && item.tsubo > 0 && item.tsubo > Number(tsuboMax)) return false;
    return true;
  });

  // Sort
  if (sort === 'popular') filteredItems.sort((a, b) => b.viewCount - a.viewCount);
  else if (sort === 'tsubo-asc') filteredItems.sort((a, b) => a.tsubo - b.tsubo);
  else if (sort === 'tsubo-desc') filteredItems.sort((a, b) => b.tsubo - a.tsubo);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setActiveFilter('すべて');
    setPrefecture('all');
    setKeyword('');
    setSort('popular');
    setTsuboMin('');
    setTsuboMax('');
    setSelectedBuilder('all');
    setCurrentPage(1);
  };

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

          <PrefectureFilter value={prefecture} onChange={(v) => { setPrefecture(v); setCurrentPage(1); }} />

          {/* Advanced Search Toggle */}
          <div className="mb-8">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#E8740C] transition cursor-pointer"
            >
              <svg className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              詳細検索
            </button>

            {showAdvanced && (
              <div className="mt-3 bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">キーワード</label>
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1); }}
                      placeholder="タイトル・工務店名..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">工務店</label>
                    <select
                      value={selectedBuilder}
                      onChange={(e) => { setSelectedBuilder(e.target.value); setCurrentPage(1); }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                    >
                      {builders.map(b => (
                        <option key={b} value={b}>{b === 'all' ? 'すべて' : b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">坪数</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={tsuboMin}
                        onChange={(e) => { setTsuboMin(e.target.value); setCurrentPage(1); }}
                        placeholder="下限"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                      />
                      <span className="text-gray-400 text-xs">〜</span>
                      <input
                        type="number"
                        value={tsuboMax}
                        onChange={(e) => { setTsuboMax(e.target.value); setCurrentPage(1); }}
                        placeholder="上限"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">並び替え</label>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                    >
                      {SORT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-xs text-gray-400 hover:text-[#E8740C] transition cursor-pointer"
                >
                  フィルターをリセット
                </button>
              </div>
            )}
          </div>

          {/* Results count */}
          <p className="text-xs text-gray-400 mb-4">{filteredItems.length} 件の動画</p>

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
