import Link from 'next/link'

const VIEWED_PROPERTIES = [
  { title: '平屋 × 自然素材の家', builder: '木の家工房', date: '2026/03/19', href: '/videos/1' },
  { title: '吹き抜けリビングの家', builder: 'デザインハウス', date: '2026/03/18', href: '/videos/2' },
  { title: 'ガレージ付き二世帯住宅', builder: 'ファミリーホーム', date: '2026/03/17', href: '/videos/3' },
  { title: 'コンパクトハウス 20坪の暮らし', builder: 'スマートホーム', date: '2026/03/16', href: '/videos/4' },
  { title: '和モダン × 中庭のある家', builder: '匠工務店', date: '2026/03/15', href: '/videos/5' },
]

const AI_CHATS = [
  { title: '住宅ローンの返済額について', date: '2026/03/18', summary: '月々の返済額と金利タイプの違いについて相談' },
  { title: '平屋と二階建ての比較', date: '2026/03/15', summary: '建築コストと暮らしやすさの観点から比較' },
]

const LOAN_SIMS = [
  { date: '2026/03/18', amount: '3,000万円', rate: '0.5%', years: 35, monthly: '77,875円' },
]

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      {/* Viewed Properties */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">最近閲覧した物件</h2>
        <div className="divide-y divide-gray-100">
          {VIEWED_PROPERTIES.map((item, i) => (
            <Link key={i} href={item.href}
              className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition group">
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-[#E8740C] transition">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.builder}</p>
              </div>
              <span className="text-xs text-gray-400 shrink-0 ml-4">{item.date}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Chat History */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">AIチャット履歴</h2>
        <div className="space-y-3">
          {AI_CHATS.map((item, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{item.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Loan Simulation Results */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">ローンシミュレーション結果</h2>
        {LOAN_SIMS.map((item, i) => (
          <div key={i} className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-blue-700">借入額 {item.amount}</span>
              <span className="text-xs text-gray-400">{item.date}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div>
                <div className="text-gray-500">金利</div>
                <div className="font-bold text-gray-900 mt-0.5">{item.rate}</div>
              </div>
              <div>
                <div className="text-gray-500">返済期間</div>
                <div className="font-bold text-gray-900 mt-0.5">{item.years}年</div>
              </div>
              <div>
                <div className="text-gray-500">月々返済額</div>
                <div className="font-bold text-[#E8740C] mt-0.5">{item.monthly}</div>
              </div>
            </div>
            <Link href="/simulator"
              className="block text-center text-xs text-[#E8740C] font-bold mt-3 hover:underline">
              シミュレーションをやり直す →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
