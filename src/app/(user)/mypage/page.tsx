import Image from 'next/image'
import Link from 'next/link'

export default function MyPageComingSoon() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#FFF8F0] flex items-center justify-center">
          <Image src="/images/pei_think.png" alt="ペイくん" width={64} height={64} className="object-contain" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-3">マイページは準備中です</h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          お気に入り物件の保存や相談履歴の確認など、
          便利な機能を準備しています。もう少々お待ちください。
        </p>
        <div className="space-y-3">
          <Link
            href="/consultation"
            className="block w-full bg-[#E8740C] text-white font-bold py-3 rounded-xl hover:bg-[#D4660A] transition text-sm"
          >
            無料で住宅相談する
          </Link>
          <Link
            href="/"
            className="block w-full border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition text-sm"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
