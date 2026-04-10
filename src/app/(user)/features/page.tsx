import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import { features, type FeatureType } from '@/lib/features-data';

const TYPE_LABELS: Record<FeatureType, string> = {
  prefecture: 'エリアから探す',
  hiraya: '平屋のサイズで探す',
  builder: '工務店で探す',
};

const TYPE_ORDER: FeatureType[] = ['prefecture', 'hiraya', 'builder'];

export default function FeaturesPage() {
  const grouped = TYPE_ORDER.map((type) => ({
    type,
    label: TYPE_LABELS[type],
    items: features.filter((f) => f.type === type),
  }));

  return (
    <>
      <PageHeader
        title="特集"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '特集' },
        ]}
        subtitle="ぺいほーむが厳選したテーマ別ルームツアー"
      />

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          {grouped.map((group) => (
            <div key={group.type}>
              <h2 className="text-xl md:text-2xl font-bold text-[#3D2200] mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#E8740C] rounded-full" />
                {group.label}
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.items.map((feature) => (
                  <Link
                    key={feature.id}
                    href={`/features/${feature.id}`}
                    className="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div
                      className={`relative h-36 bg-gradient-to-br ${feature.heroColor} flex items-end p-5`}
                    >
                      <div className="text-white">
                        <p className="text-xs opacity-80 mb-1">{feature.subtitle}</p>
                        <h3 className="text-lg font-bold leading-tight">{feature.title}</h3>
                      </div>
                    </div>
                    <div className="p-5 bg-white">
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-3">
                        {feature.description}
                      </p>
                      <span className="inline-flex items-center text-xs font-bold text-[#E8740C] group-hover:underline">
                        特集を見る →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
