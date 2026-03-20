'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <img src="/images/pei_surprise.png" alt="ペイくん" className="w-24 h-24 mx-auto mb-6 object-contain" />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">エラーが発生しました</h1>
        <p className="text-sm text-gray-500 mb-8">申し訳ございません。ページの読み込みに失敗しました。</p>
        <button
          onClick={reset}
          className="bg-[#E8740C] text-white font-bold px-8 py-3 rounded-full hover:bg-[#D4660A] transition text-sm cursor-pointer"
        >
          もう一度試す
        </button>
      </div>
    </div>
  )
}
