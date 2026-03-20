'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

function BuilderContactForm() {
  const searchParams = useSearchParams()
  const builderName = searchParams.get('builder') || ''
  const builderArea = searchParams.get('area') || ''

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    budget: '',
    layout: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: '工務店相談', ...formData, builder: builderName, builder_area: builderArea }),
      })
    } catch (e) { /* silent fail */ }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <Image src="/images/pei_wink.png" alt="ペイさん" width={112} height={112} className="mx-auto mb-6 object-contain" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">お問い合わせありがとうございます！</h2>
          <p className="text-sm text-gray-500 mb-2">
            <strong className="text-[#E8740C]">{builderName}</strong> への相談を受け付けました。
          </p>
          <p className="text-sm text-gray-500 mb-6">2営業日以内にぺいほーむからご連絡いたします。</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/" className="bg-[#E8740C] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#D4660A] transition text-sm">
              トップに戻る
            </Link>
            <Link href="/builders" className="border-2 border-[#E8740C] text-[#E8740C] font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition text-sm">
              工務店一覧
            </Link>
          </div>
          <div className="mt-6 p-4 bg-[#06C755]/10 rounded-xl">
            <p className="text-sm font-semibold text-[#06C755] mb-2">📱 LINEで最新情報を受け取る</p>
            <a href="https://line.me/R/ti/p/@253gzmoh" target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-[#06C755] text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-[#05a648] transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596a.629.629 0 0 1-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595a.63.63 0 0 1 .495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
              友だち追加
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="max-w-7xl mx-auto px-4">
          <nav>
            <Link href="/">ホーム</Link>
            <span>&gt;</span>
            <Link href="/builders">工務店一覧</Link>
            <span>&gt;</span>
            <span className="text-gray-800">{builderName}への相談</span>
          </nav>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4">
          {/* Builder Info */}
          <div className="bg-[#FFF8F0] rounded-2xl p-6 mb-8 flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-xs text-gray-400">Logo</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#3D2200]">{builderName}</h2>
              {builderArea && <p className="text-sm text-gray-500">{builderArea}</p>}
              <p className="text-xs text-[#E8740C] font-semibold mt-1">この工務店について相談する</p>
            </div>
          </div>

          {/* Form */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">お問い合わせフォーム</h3>
          <p className="text-sm text-gray-500 mb-6">以下の情報をご記入ください。ぺいほーむが{builderName}との相談をサポートいたします。</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Hidden builder info */}
            <input type="hidden" name="builder" value={builderName} />
            <input type="hidden" name="builder_area" value={builderArea} />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                お名前 <span className="text-red-500 text-xs">必須</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                placeholder="山田 太郎"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                メールアドレス <span className="text-red-500 text-xs">必須</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">電話番号</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                placeholder="090-1234-5678"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">建築予定エリア</label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                placeholder="鹿児島市、姶良市 など"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ご予算</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] bg-white"
                >
                  <option value="">選択してください</option>
                  <option>〜1,500万円</option>
                  <option>1,500〜2,000万円</option>
                  <option>2,000〜2,500万円</option>
                  <option>2,500〜3,000万円</option>
                  <option>3,000〜4,000万円</option>
                  <option>4,000万円〜</option>
                  <option>未定</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">希望の間取り</label>
                <select
                  value={formData.layout}
                  onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] bg-white"
                >
                  <option value="">選択してください</option>
                  <option>1LDK</option>
                  <option>2LDK</option>
                  <option>3LDK</option>
                  <option>4LDK</option>
                  <option>5LDK以上</option>
                  <option>未定</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">ご相談内容</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] resize-vertical"
                placeholder={`${builderName}について聞きたいこと、家づくりのご要望などをご記入ください`}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E8740C] text-white font-bold py-4 rounded-full hover:bg-[#D4660A] transition-colors text-sm shadow-md cursor-pointer"
            >
              {builderName}について相談する（無料）
            </button>

            <p className="text-xs text-gray-400 text-center">
              ※ ぺいほーむが{builderName}との相談をサポートいたします。しつこい営業は一切ありません。
            </p>
          </form>
        </div>
      </section>
    </>
  )
}

export default function BuilderContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">読み込み中...</div>}>
      <BuilderContactForm />
    </Suspense>
  )
}
