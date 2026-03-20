'use client';

import Link from 'next/link';
import { useProperties, useEvents, useInterviews, useReviews, useWebinars, useNews, useBuilders, useArticles, useMagazine } from '@/lib/content-store';

export default function AppAdminDashboard() {
  const propertiesCount = useProperties().length;
  const eventsCount = useEvents().length;
  const interviewsCount = useInterviews().length;
  const reviewsCount = useReviews().length;
  const webinarsCount = useWebinars().length;
  const newsCount = useNews().length;
  const buildersCount = useBuilders().length;
  const articlesCount = useArticles().length;
  const magazineCount = useMagazine().length;

  const SECTIONS = [
    { href: '/appadmin/properties', icon: '🎬', label: '動画コンテンツ', color: 'bg-orange-500', count: propertiesCount },
    { href: '/appadmin/events', icon: '📅', label: '見学会・イベント', color: 'bg-purple-500', count: eventsCount },
    { href: '/appadmin/interviews', icon: '📰', label: '取材・レポート', color: 'bg-blue-500', count: interviewsCount },
    { href: '/appadmin/reviews', icon: '💬', label: 'お客様の声', color: 'bg-green-500', count: reviewsCount },
    { href: '/appadmin/webinars', icon: '🎓', label: 'ウェビナー', color: 'bg-indigo-500', count: webinarsCount },
    { href: '/appadmin/builders', icon: '🏗', label: '工務店一覧', color: 'bg-yellow-500', count: buildersCount },
    { href: '/appadmin/articles', icon: '📝', label: 'お役立ち記事', color: 'bg-pink-500', count: articlesCount },
    { href: '/appadmin/news', icon: '📢', label: 'ニュース', color: 'bg-teal-500', count: newsCount },
    { href: '/appadmin/magazine', icon: '📖', label: '月刊ぺいほーむ', color: 'bg-rose-500', count: magazineCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">コンテンツ管理</h1>
      <p className="text-sm text-gray-500 mb-8">各コンテンツの新規追加・編集・削除を行えます</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-[#E8740C]/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                {s.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#E8740C] transition">{s.label}</h3>
                <p className="text-xs text-gray-400">{s.count > 0 ? `${s.count} 件` : '—'}</p>
              </div>
            </div>
            <div className="flex items-center justify-end text-xs font-semibold text-[#E8740C] opacity-0 group-hover:opacity-100 transition">
              管理する →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
