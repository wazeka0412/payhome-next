import Link from 'next/link';
import { SITE_STATS } from '@/lib/site-config';
import { LINE_URL } from '@/lib/constants';

const mediaStats = [
  { number: SITE_STATS.youtubeSubscribers, label: 'YouTube登録者数' },
  { number: SITE_STATS.monthlyViews, label: '月間再生数' },
  { number: SITE_STATS.averageWatchTime, label: '平均視聴回数/本' },
  { number: '25-45歳', label: '主な視聴者層' },
];

const services = [
  {
    title: 'タイアップ動画',
    desc: 'ぺいほーむのYouTubeチャンネルで御社の商品・サービスを紹介する動画を制作・配信します。',
  },
  {
    title: 'タイアップ記事',
    desc: 'ぺいほーむのWEBメディアにスポンサード記事を掲載します。SEO最適化で長期的な流入を実現。',
  },
  {
    title: '月刊ぺいほーむ掲載',
    desc: 'デジタルマガジン「月刊ぺいほーむ」に広告枠またはタイアップ特集として掲載いたします。',
  },
  {
    title: 'イベント・ウェビナー協賛',
    desc: 'ぺいほーむ主催のウェビナーやイベントへの協賛・共催。ターゲット層への直接訴求が可能です。',
  },
];

export default function AdPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400 mb-4">
            <Link href="/biz" className="hover:text-white">ホーム</Link> &gt; 広告掲載をお考えの企業様へ
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            広告掲載をお考えの企業様へ
          </h1>
          <p className="text-gray-300 text-lg">
            住宅関連商材の認知拡大・集客をぺいほーむがサポートします。<br />
            まずはお気軽にお問い合わせください。
          </p>
        </div>
      </div>

      {/* Media Data */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-center mb-8">ぺいほーむのメディアデータ</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {mediaStats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-[#E8740C] font-mono">{s.number}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-xs text-gray-400">
            視聴者の約70%が住宅購入を検討中または計画中の方です。
          </p>
        </div>
      </section>

      {/* Services (overview only) */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-center mb-8">ご提供サービス</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((s) => (
              <div key={s.title} className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-bold text-[#E8740C] mb-1">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-sm text-gray-500">
            料金・詳細は資料請求またはお問い合わせにてご案内いたします。
          </p>
        </div>
      </section>

      {/* CTA: 3 simple actions */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xl font-bold text-center mb-3">まずはお気軽にご連絡ください</h2>
          <p className="text-center text-sm text-gray-500 mb-10">
            ご質問・ご相談だけでも大歓迎です。担当者が丁寧にご対応いたします。
          </p>

          <div className="space-y-4">
            {/* お問い合わせ */}
            <Link
              href="/biz/contact"
              className="flex items-center gap-4 bg-[#E8740C] text-white rounded-2xl p-6 hover:bg-[#D4660A] transition group"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                &#9993;
              </div>
              <div>
                <div className="font-bold text-lg">お問い合わせ</div>
                <div className="text-sm opacity-90">フォームから広告・タイアップのご相談</div>
              </div>
              <div className="ml-auto text-2xl opacity-70 group-hover:translate-x-1 transition">&rarr;</div>
            </Link>

            {/* 資料請求 */}
            <Link
              href="/biz/contact?type=document"
              className="flex items-center gap-4 bg-white border-2 border-[#E8740C] text-gray-900 rounded-2xl p-6 hover:bg-orange-50 transition group"
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl flex-shrink-0">
                &#128196;
              </div>
              <div>
                <div className="font-bold text-lg">資料請求</div>
                <div className="text-sm text-gray-500">メディアデータ・料金表をお送りします</div>
              </div>
              <div className="ml-auto text-2xl text-[#E8740C] opacity-70 group-hover:translate-x-1 transition">&rarr;</div>
            </Link>

            {/* 公式LINE */}
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#06C755] text-white rounded-2xl p-6 hover:bg-[#05b34d] transition group"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                &#128172;
              </div>
              <div>
                <div className="font-bold text-lg">公式LINEでお問い合わせ</div>
                <div className="text-sm opacity-90">チャットで気軽にご相談いただけます</div>
              </div>
              <div className="ml-auto text-2xl opacity-70 group-hover:translate-x-1 transition">&rarr;</div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
