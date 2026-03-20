import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <img src="/images/pei_confused.png" alt="ペイくん" className="w-24 h-24 mx-auto mb-6 object-contain" />
        <h1 className="text-6xl font-extrabold text-[#E8740C] mb-4">404</h1>
        <h2 className="text-xl font-bold text-gray-900 mb-2">ページが見つかりません</h2>
        <p className="text-sm text-gray-500 mb-8">お探しのページは移動または削除された可能性があります。</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="bg-[#E8740C] text-white font-bold px-8 py-3 rounded-full hover:bg-[#D4660A] transition text-sm">
            トップページへ
          </Link>
          <Link href="/videos" className="border-2 border-[#E8740C] text-[#E8740C] font-bold px-8 py-3 rounded-full hover:bg-orange-50 transition text-sm">
            動画を見る
          </Link>
        </div>
      </div>
    </div>
  )
}
