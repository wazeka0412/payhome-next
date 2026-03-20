import PageHeader from '@/components/ui/PageHeader';
import Link from 'next/link';
import { getUpcomingWebinars, getArchiveWebinars } from '@/lib/webinars-data';
import type { WebinarData } from '@/lib/webinars-data';

function WebinarCard({ item }: { item: WebinarData }) {
  return (
    <Link
      href={`/webinar/${item.id}`}
      className="flex gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex-shrink-0 w-16 h-16 bg-[#FFF8F0] rounded-xl flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-[#E8740C] uppercase">{item.month}</span>
        <span className="text-2xl font-extrabold text-[#3D2200] font-mono leading-none">{item.day}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-[#3D2200] mb-1 line-clamp-2">{item.title}</h4>
        <p className="text-xs text-gray-500 mb-2">{item.info}</p>
        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
          item.isUpcoming
            ? 'bg-[#E8740C]/10 text-[#E8740C]'
            : 'bg-gray-100 text-gray-500'
        }`}>
          {item.status}
        </span>
      </div>
    </Link>
  );
}

export default function WebinarPage() {
  const upcomingWebinars = getUpcomingWebinars();
  const archiveWebinars = getArchiveWebinars();

  return (
    <>
      <PageHeader
        title="ウェビナー"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: 'ウェビナー' },
        ]}
        subtitle="住宅業界の最新トレンドやノウハウをオンラインで学べるウェビナーを開催しています。"
      />

      {/* Upcoming */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">Upcoming</p>
          <h2 className="text-xl font-bold text-[#3D2200] mb-8">開催予定のウェビナー</h2>
          <div className="space-y-4">
            {upcomingWebinars.map((w) => (
              <WebinarCard key={w.id} item={w} />
            ))}
          </div>
        </div>
      </section>

      {/* Archive */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">Archive</p>
          <h2 className="text-xl font-bold text-[#3D2200] mb-8">過去のウェビナー</h2>
          <div className="space-y-4">
            {archiveWebinars.map((w) => (
              <WebinarCard key={w.id} item={w} />
            ))}
          </div>
        </div>
      </section>

      {/* Speaker Request */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">Speaker Request</p>
          <h2 className="text-xl font-bold text-[#3D2200] mb-6">登壇・出演依頼について</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            ぺいほーむでは、住宅業界のイベントやセミナーへの登壇・出演のご依頼を承っております。
            住宅メディアならではの知見をお届けします。
          </p>
          <Link
            href="/consultation"
            className="inline-flex items-center justify-center bg-[#E8740C] text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-[#D4660A] transition"
          >
            お問い合わせはこちら
          </Link>
        </div>
      </section>
    </>
  );
}
