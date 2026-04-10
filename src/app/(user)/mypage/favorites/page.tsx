'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import { getOrCreateAnonymousId } from '@/lib/anonymous-id';
import { properties } from '@/lib/properties';
import { builders } from '@/lib/builders-data';
import { saleHomes } from '@/lib/sale-homes-data';
import { lands } from '@/lib/lands-data';

interface FavoriteRow {
  id: string;
  content_type: 'property' | 'builder' | 'sale_home' | 'land' | string;
  content_id: string;
  created_at?: string;
}

const TABS: Array<{ value: 'all' | 'property' | 'builder' | 'sale_home' | 'land'; label: string }> = [
  { value: 'all', label: 'すべて' },
  { value: 'property', label: '物件・動画' },
  { value: 'builder', label: '工務店' },
  { value: 'sale_home', label: '建売' },
  { value: 'land', label: '土地' },
];

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['value']>('all');

  useEffect(() => {
    if (status === 'loading') return;

    const anonymousId = getOrCreateAnonymousId();
    fetch(`/api/favorites?anonymous_id=${anonymousId}`)
      .then((r) => r.json())
      .then((rows) => {
        if (Array.isArray(rows)) setFavorites(rows.filter((r: FavoriteRow) => r.content_id));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <>
        <PageHeader
          title="お気に入り"
          breadcrumbs={[
            { label: 'ホーム', href: '/' },
            { label: 'マイページ', href: '/mypage' },
            { label: 'お気に入り' },
          ]}
        />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <h2 className="text-lg font-bold text-[#3D2200] mb-3">会員限定機能です</h2>
          <p className="text-sm text-gray-500 mb-6">
            会員登録すると、お気に入りを無制限に保存できます。
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/signup?redirect=/mypage/favorites"
              className="bg-[#E8740C] text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-[#D4660A] transition"
            >
              無料会員登録する
            </Link>
            <Link
              href="/login?redirect=/mypage/favorites"
              className="text-xs text-gray-500 hover:text-[#E8740C]"
            >
              すでに会員の方はログイン →
            </Link>
          </div>
        </div>
      </>
    );
  }

  const filtered = activeTab === 'all' ? favorites : favorites.filter((f) => f.content_type === activeTab);
  const counts: Record<string, number> = {
    all: favorites.length,
    property: favorites.filter((f) => f.content_type === 'property').length,
    builder: favorites.filter((f) => f.content_type === 'builder').length,
    sale_home: favorites.filter((f) => f.content_type === 'sale_home').length,
    land: favorites.filter((f) => f.content_type === 'land').length,
  };

  const userName =
    (session?.user as { name?: string | null } | undefined)?.name || 'ゲスト';

  return (
    <>
      <PageHeader
        title="お気に入り"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: 'マイページ', href: '/mypage' },
          { label: 'お気に入り' },
        ]}
        subtitle={`${userName} さんの保存リスト（${favorites.length}件）`}
      />

      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4">
          {/* タブ */}
          <div className="bg-white border border-gray-100 rounded-2xl p-2 mb-6 inline-flex flex-wrap gap-1 shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.value
                    ? 'bg-[#E8740C] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                <span className="ml-1.5 opacity-70">{counts[tab.value] || 0}</span>
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
              <p className="text-gray-500 mb-4">
                {activeTab === 'all'
                  ? 'まだお気に入りに登録された項目はありません'
                  : 'このカテゴリにはお気に入りがありません'}
              </p>
              <Link
                href="/builders"
                className="inline-block bg-[#E8740C] text-white font-bold px-6 py-2.5 rounded-full text-sm hover:bg-[#D4660A] transition"
              >
                工務店を探す
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((fav) => (
                <FavoriteCard key={fav.id} fav={fav} />
              ))}
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <Link
              href="/mypage"
              className="text-sm text-[#E8740C] font-bold hover:underline"
            >
              ← マイページに戻る
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function FavoriteCard({ fav }: { fav: FavoriteRow }) {
  let title = '';
  let subtitle = '';
  let href = '#';
  let badge = '';

  if (fav.content_type === 'property') {
    const p = properties.find((x) => x.id === fav.content_id);
    if (!p) return null;
    title = p.title;
    subtitle = `${p.layout} / ${p.area}`;
    href = `/videos/${p.id}`;
    badge = '物件';
  } else if (fav.content_type === 'builder') {
    const b = builders.find((x) => x.id === fav.content_id);
    if (!b) return null;
    title = b.name;
    subtitle = `${b.region} / 年間${b.annualBuilds}棟`;
    href = `/builders/${b.id}`;
    badge = '工務店';
  } else if (fav.content_type === 'sale_home') {
    const s = saleHomes.find((x) => x.id === fav.content_id);
    if (!s) return null;
    title = s.title;
    subtitle = `${s.layout} / ${s.tsubo}坪 / ${s.price.toLocaleString()}万円`;
    href = `/sale-homes/${s.id}`;
    badge = '建売';
  } else if (fav.content_type === 'land') {
    const l = lands.find((x) => x.id === fav.content_id);
    if (!l) return null;
    title = l.title;
    subtitle = `${l.tsubo}坪 / 坪単価${l.pricePerTsubo}万円`;
    href = `/lands/${l.id}`;
    badge = '土地';
  } else {
    return null;
  }

  return (
    <Link
      href={href}
      className="block bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-[#E8740C]/30 transition"
    >
      <span className="inline-block text-[10px] font-bold bg-[#FFF8F0] text-[#E8740C] px-2 py-0.5 rounded mb-2">
        {badge}
      </span>
      <h3 className="text-sm font-bold text-[#3D2200] line-clamp-2 mb-2 min-h-[2.5rem]">
        {title}
      </h3>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </Link>
  );
}
