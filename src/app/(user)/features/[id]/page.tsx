import { notFound } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import { features, getFeatureById } from '@/lib/features-data';
import { videos } from '@/lib/videos-data';
import { builders } from '@/lib/builders-data';

export function generateStaticParams() {
  return features.map((f) => ({ id: f.id }));
}

export default async function FeatureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const feature = getFeatureById(id);

  if (!feature) {
    notFound();
  }

  // フィルタに沿った動画を抽出
  const filteredVideos = videos
    .filter((v) => {
      if (feature.filter.prefecture && v.prefecture !== feature.filter.prefecture) return false;
      if (feature.filter.tsuboMin && (v.tsubo === 0 || v.tsubo < feature.filter.tsuboMin)) return false;
      if (feature.filter.tsuboMax && (v.tsubo === 0 || v.tsubo > feature.filter.tsuboMax)) return false;
      if (feature.filter.builder && v.builder !== feature.filter.builder) return false;
      return true;
    })
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 12);

  // 関連工務店（同じエリアで施工棟数が多い工務店を3社）
  const relatedBuilders = builders
    .filter((b) => {
      if (feature.filter.prefecture) {
        return b.area === feature.filter.prefecture;
      }
      return true;
    })
    .sort((a, b) => b.annualBuilds - a.annualBuilds)
    .slice(0, 3);

  return (
    <>
      <PageHeader
        title={feature.title}
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '特集', href: '/features' },
          { label: feature.title },
        ]}
        subtitle={feature.subtitle}
      />

      <div className={`bg-gradient-to-br ${feature.heroColor} text-white`}>
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
          <p className="text-sm md:text-base leading-relaxed text-white/95 max-w-3xl">
            {feature.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/diagnosis"
              className="inline-flex items-center gap-2 bg-white text-[#3D2200] font-bold px-6 py-3 rounded-full text-sm hover:bg-white/95 transition"
            >
              AI家づくり診断で自分に合う家を探す
            </Link>
            <Link
              href="/event"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-white/25 transition"
            >
              見学会を予約する
            </Link>
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* 動画グリッド */}
          <div className="mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-[#3D2200] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#E8740C] rounded-full" />
              特集ルームツアー {filteredVideos.length}件
            </h2>

            {filteredVideos.length === 0 ? (
              <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-6 text-center">
                該当する動画がまだありません。近日公開予定です。
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredVideos.map((video) => (
                  <Link
                    key={video.id}
                    href={`/videos/${video.id}`}
                    className="block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition"
                  >
                    <div className="relative aspect-video bg-gray-200">
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded">
                        ▶ {video.views}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-[#3D2200] mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{video.builder}</span>
                        {video.tsubo > 0 && <span>{video.tsubo}坪</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 関連工務店 */}
          {relatedBuilders.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-[#3D2200] mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#E8740C] rounded-full" />
                この特集に関連する工務店
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedBuilders.map((builder) => (
                  <Link
                    key={builder.id}
                    href={`/builders/${builder.id}`}
                    className="block bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-[#E8740C]/30 transition"
                  >
                    <h3 className="font-bold text-[#3D2200] mb-1">{builder.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{builder.region}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {builder.specialties.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="text-[0.65rem] bg-[#E8740C]/10 text-[#E8740C] px-2 py-0.5 rounded font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">年間施工 約{builder.annualBuilds}棟</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 他の特集へのリンク */}
          <div className="pt-8 border-t border-gray-100">
            <Link
              href="/features"
              className="inline-flex items-center gap-1 text-sm text-[#E8740C] font-bold hover:underline"
            >
              ← 他の特集を見る
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
