import PageHeader from '@/components/ui/PageHeader';
import Link from 'next/link';

const backNumbers = [
  { issue: '2026年2月号', title: '特集：断熱等級7の家づくり最前線' },
  { issue: '2026年1月号', title: '特集：2026年の住宅トレンド予測' },
  { issue: '2025年12月号', title: '特集：施主100人に聞いた「建てて良かったこと」' },
  { issue: '2025年11月号', title: '特集：平屋ブームの本当の理由' },
  { issue: '2025年10月号', title: '特集：住宅ローン減税 最新ガイド' },
  { issue: '2025年9月号', title: '特集：九州の木造住宅と地産地消' },
];

export default function MagazinePage() {
  return (
    <>
      <PageHeader
        title="月刊ぺいほーむ"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '月刊ぺいほーむ' },
        ]}
        subtitle="住宅のトレンドや取材記事をデジタル雑誌でお届け"
      />

      {/* Latest Issue */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">Latest Issue</p>
          <h2 className="text-2xl font-bold text-center text-[#3D2200] mb-10">最新号</h2>

          <div className="flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="md:w-1/2 aspect-[3/4] md:aspect-auto bg-gray-100 flex items-center justify-center text-gray-400 text-sm min-h-[300px]">
              Cover Image
            </div>
            <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
              <span className="inline-block text-xs font-semibold text-[#E8740C] bg-[#E8740C]/10 px-3 py-1 rounded mb-3 w-fit">
                最新号
              </span>
              <h3 className="text-xl font-bold text-[#3D2200] mb-3">月刊ぺいほーむ 2026年3月号</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                特集「鹿児島・九州の注目工務店10選」— 地元の気候風土を知り尽くした工務店が提案する、次世代の家づくり。
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-[#E8740C] font-bold mt-0.5">-</span>
                  鹿児島の注目工務店10選
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E8740C] font-bold mt-0.5">-</span>
                  住宅ローン金利の最新トレンド
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E8740C] font-bold mt-0.5">-</span>
                  施主インタビュー：建てて1年後のリアル
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E8740C] font-bold mt-0.5">-</span>
                  ぺいほーむ取材の裏側
                </li>
              </ul>
              <Link
                href="#"
                className="inline-flex items-center justify-center bg-[#E8740C] text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-[#D4660A] transition w-fit"
              >
                この号を読む
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Back Numbers */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">Back Numbers</p>
          <h2 className="text-2xl font-bold text-center text-[#3D2200] mb-10">バックナンバー</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {backNumbers.map((item) => (
              <Link
                key={item.issue}
                href="#"
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Cover Image
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-[#E8740C] bg-[#E8740C]/10 px-2 py-0.5 rounded">
                    {item.issue}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 mt-2 group-hover:text-[#E8740C] transition-colors">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-16 bg-gradient-to-r from-[#E8740C] to-[#F5A623] text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest uppercase opacity-80 mb-2">Subscribe</p>
          <h2 className="text-2xl font-bold mb-4">月刊ぺいほーむを毎月お届け</h2>
          <p className="text-sm opacity-90 leading-relaxed mb-8">
            メールアドレスをご登録いただくと、毎月の最新号を無料でお届けします。<br />
            住宅トレンド・取材レポート・お役立ち情報をまとめてチェック。
          </p>
          <Link
            href="#"
            className="inline-flex items-center justify-center bg-white text-[#E8740C] font-bold px-8 py-3 rounded-full text-sm hover:bg-gray-100 transition"
          >
            無料で定期購読する
          </Link>
        </div>
      </section>
    </>
  );
}
