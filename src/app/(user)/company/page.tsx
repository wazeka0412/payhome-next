import PageHeader from '@/components/ui/PageHeader';
import Link from 'next/link';

const companyInfo = [
  { label: '会社名', value: '株式会社ぺいほーむ' },
  { label: '設立', value: '2023年4月' },
  { label: '代表取締役', value: '○○ ○○' },
  { label: '所在地', value: '〒890-0000\n鹿児島県鹿児島市○○町0-0-0' },
  { label: '事業内容', value: '住宅メディア運営\n動画制作・SNS運用代行\n住宅会社ポータルサイト運営\nWEB制作' },
  { label: '資本金', value: '300万円' },
  { label: 'メール', value: 'info@payhome.jp' },
];

const businesses = [
  {
    title: '住宅メディア「ぺいほーむ」',
    desc: 'YouTube登録者4.28万人の住宅メディア。ルームツアー動画、工務店・ハウスメーカー取材、住宅トレンド解説を配信しています。',
    link: '/about',
    linkText: '詳しく見る',
  },
  {
    title: '住宅会社ポータル事業',
    desc: '鹿児島・九州の住宅会社を探せるポータルサイトを運営。AIチャット相談機能で、ユーザーに最適な住宅会社をマッチングします。',
    link: '#',
    linkText: 'ポータルサイトへ',
  },
  {
    title: '採用特化型YouTube運用',
    desc: '住宅会社の採用課題を解決するYouTubeチャンネル運用サービス。社員インタビューや職場紹介動画で採用力を強化します。',
    link: '#',
    linkText: '専用LPを見る',
  },
];

export default function CompanyPage() {
  return (
    <>
      <PageHeader
        title="運営会社"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '運営会社' },
        ]}
      />

      {/* Company Info + CEO Message */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">Company</p>
          <h2 className="text-2xl font-bold text-[#3D2200] mb-8">会社概要</h2>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Table */}
            <div className="lg:w-1/2">
              <table className="w-full text-sm">
                <tbody>
                  {companyInfo.map((row) => (
                    <tr key={row.label} className="border-b border-gray-100">
                      <th className="py-4 pr-6 text-left text-gray-500 font-semibold align-top w-28 whitespace-nowrap">
                        {row.label}
                      </th>
                      <td className="py-4 text-gray-800 whitespace-pre-line">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CEO Message */}
            <div className="lg:w-1/2">
              <h3 className="text-lg font-bold text-[#E8740C] mb-6">代表挨拶</h3>
              <div className="w-28 h-28 bg-gray-100 rounded-full mb-6 flex items-center justify-center text-gray-400 text-xs">
                Photo
              </div>
              <div className="space-y-4 text-sm text-gray-600 leading-[2]">
                <p>
                  鹿児島で生まれ育ち、地元の工務店やハウスメーカーの方々と関わる中で、
                  「良い家をつくっているのに、その魅力が伝わっていない」という課題を感じてきました。
                </p>
                <p>
                  ぺいほーむは、動画とWEBの力で住宅会社の魅力を「正しく」届けるメディアです。
                  家づくりをもっと楽しく、もっと身近に。その想いで日々コンテンツを発信しています。
                </p>
                <p>
                  住宅業界のDXを推進し、住宅会社と家づくりを考える方の架け橋になれるよう、
                  チーム一丸となって取り組んでまいります。
                </p>
              </div>
              <p className="mt-6 text-sm font-bold text-[#3D2200]">
                株式会社ぺいほーむ 代表取締役　○○ ○○
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">Business</p>
          <h2 className="text-2xl font-bold text-[#3D2200] mb-8">事業一覧</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {businesses.map((biz) => (
              <div key={biz.title} className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-bold text-[#3D2200] mb-3">{biz.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{biz.desc}</p>
                <Link
                  href={biz.link}
                  className="text-xs font-semibold text-[#E8740C] hover:underline"
                >
                  {biz.linkText} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
