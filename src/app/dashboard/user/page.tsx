import Link from 'next/link'
import Image from 'next/image'

const STATS = [
  { label: 'お気に入り物件', value: '3件', href: '/dashboard/user/favorites', color: 'bg-red-50 text-red-600' },
  { label: '相談中', value: '1件', href: '/dashboard/user/consultations', color: 'bg-blue-50 text-blue-600' },
  { label: '閲覧した物件', value: '12件', href: '/dashboard/user/history', color: 'bg-green-50 text-green-600' },
]

const TIMELINE = [
  { date: '2026/03/19', text: '「平屋 × 自然素材の家」をお気に入りに追加しました' },
  { date: '2026/03/18', text: 'AIチャットで住宅ローンについて相談しました' },
  { date: '2026/03/17', text: '無料住宅相談を申し込みました' },
]

const QUICK_ACTIONS = [
  { href: '/videos', label: '物件を探す', icon: '🔍' },
  { href: '/consultation', label: 'AIに相談', icon: '🤖' },
  { href: '/simulator', label: 'ローンシミュレーター', icon: '💰' },
]

export default function UserDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm">
        <Image src="/images/pei_wink.png" alt="ペイさん" width={64} height={64} className="w-16 h-16" />
        <div>
          <h1 className="text-lg font-bold text-gray-900">おかえりなさい！</h1>
          <p className="text-sm text-gray-500 mt-1">あなたの住まい探しをサポートします。</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        {STATS.map(stat => (
          <Link key={stat.label} href={stat.href}
            className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition group">
            <div className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1 group-hover:text-[#E8740C] transition">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">最近の活動</h2>
        <div className="space-y-3">
          {TIMELINE.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#E8740C] mt-1.5 shrink-0" />
              <div>
                <p className="text-sm text-gray-700">{item.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {QUICK_ACTIONS.map(action => (
          <Link key={action.label} href={action.href}
            className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md hover:border-[#E8740C] border border-transparent transition">
            <div className="text-2xl mb-2">{action.icon}</div>
            <div className="text-xs font-bold text-gray-700">{action.label}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
