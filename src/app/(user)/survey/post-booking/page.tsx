'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const CONSIDERATION_OPTIONS = [
  { value: 'browsing', label: '情報収集段階' },
  { value: 'comparing', label: '比較検討中' },
  { value: 'serious', label: 'かなり具体的に検討中' },
]

const CONCERN_OPTIONS = [
  { value: 'budget', label: '予算・住宅ローン' },
  { value: 'layout', label: '間取り・設計' },
  { value: 'land', label: '土地探し' },
  { value: 'builder', label: '工務店選び' },
  { value: 'schedule', label: 'スケジュール' },
  { value: 'other', label: 'その他' },
]

const VISIT_INTEREST_OPTIONS = [
  { value: 'quality', label: '施工品質・仕上がり' },
  { value: 'layout_real', label: '実際の間取り・広さ' },
  { value: 'price', label: '価格感・コスパ' },
  { value: 'staff', label: 'スタッフの対応・相性' },
  { value: 'equipment', label: '設備・性能' },
]

export default function PostBookingSurveyPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">読み込み中...</div>}>
      <PostBookingSurveyPage />
    </Suspense>
  )
}

function PostBookingSurveyPage() {
  const params = useSearchParams()
  const eventId = params.get('event_id') || ''
  const builderName = params.get('builder') || ''

  const [step, setStep] = useState<'survey' | 'complete'>('survey')
  const [consideration, setConsideration] = useState('')
  const [comparingCount, setComparingCount] = useState('')
  const [concerns, setConcerns] = useState<string[]>([])
  const [visitInterests, setVisitInterests] = useState<string[]>([])
  const [wantInfo, setWantInfo] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const toggleConcern = (v: string) => {
    setConcerns(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }
  const toggleInterest = (v: string) => {
    setVisitInterests(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyType: 'post_booking',
          eventId,
          builderName,
          responses: {
            consideration,
            comparingCount,
            concerns,
            visitInterests,
            wantInfo,
          },
        }),
      })
      setStep('complete')
    } catch {
      alert('送信に失敗しました。もう一度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ありがとうございます！</h1>
          <p className="text-gray-600 mb-8">
            ご回答をもとに、見学会をより充実したものにするための準備をいたします。
          </p>
          <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 mb-8">
            <div className="text-lg font-bold text-[#E8740C] mb-2">🎁 特典をお届けします</div>
            <p className="text-sm text-gray-600 mb-4">ご登録のメールアドレスに以下をお送りします</p>
            <ul className="text-left text-sm space-y-2">
              <li className="flex items-start gap-2"><span>✅</span> 見学会チェックリスト（当日確認すべき30項目）</li>
              <li className="flex items-start gap-2"><span>✅</span> 家づくり失敗回避ガイド（よくある後悔10選）</li>
              <li className="flex items-start gap-2"><span>✅</span> 平屋比較シート（工務店を比べるテンプレート）</li>
            </ul>
          </div>
          <Link href="/mypage" className="inline-block bg-[#E8740C] text-white px-8 py-3 rounded-full font-medium hover:bg-[#d06a0a] transition">
            マイページへ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🏡</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            より良い家づくりサポートのために
          </h1>
          <p className="text-sm text-gray-500">1分で完了 · 回答で家づくり特典をプレゼント</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-8">
          {/* Q1 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Q1. 現在の検討度合いを教えてください
            </label>
            <div className="space-y-2">
              {CONSIDERATION_OPTIONS.map(o => (
                <button key={o.value} onClick={() => setConsideration(o.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition ${
                    consideration === o.value ? 'border-[#E8740C] bg-orange-50 text-[#E8740C] font-medium' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q2 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Q2. 現在何社くらい比較していますか？
            </label>
            <div className="flex gap-2">
              {['まだ0社', '1〜2社', '3社以上'].map(v => (
                <button key={v} onClick={() => setComparingCount(v)}
                  className={`flex-1 px-3 py-3 rounded-lg border text-sm transition ${
                    comparingCount === v ? 'border-[#E8740C] bg-orange-50 text-[#E8740C] font-medium' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Q3 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Q3. 今いちばん不安なことは？（複数選択可）
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CONCERN_OPTIONS.map(o => (
                <button key={o.value} onClick={() => toggleConcern(o.value)}
                  className={`px-3 py-2.5 rounded-lg border text-sm transition ${
                    concerns.includes(o.value) ? 'border-[#E8740C] bg-orange-50 text-[#E8740C] font-medium' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q4 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Q4. 見学会で特に知りたいことは？（複数選択可）
            </label>
            <div className="grid grid-cols-2 gap-2">
              {VISIT_INTEREST_OPTIONS.map(o => (
                <button key={o.value} onClick={() => toggleInterest(o.value)}
                  className={`px-3 py-2.5 rounded-lg border text-sm transition ${
                    visitInterests.includes(o.value) ? 'border-[#E8740C] bg-orange-50 text-[#E8740C] font-medium' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q5 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Q5. 家づくりに役立つ情報を受け取りますか？
            </label>
            <div className="flex gap-2">
              <button onClick={() => setWantInfo(true)}
                className={`flex-1 px-4 py-3 rounded-lg border text-sm transition ${wantInfo ? 'border-[#E8740C] bg-orange-50 text-[#E8740C] font-medium' : 'border-gray-200'}`}>
                はい、受け取りたい
              </button>
              <button onClick={() => setWantInfo(false)}
                className={`flex-1 px-4 py-3 rounded-lg border text-sm transition ${!wantInfo ? 'border-gray-400 bg-gray-50 font-medium' : 'border-gray-200'}`}>
                今はいいです
              </button>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={submitting || !consideration}
            className="w-full bg-[#E8740C] text-white py-3.5 rounded-full font-medium text-base hover:bg-[#d06a0a] disabled:opacity-50 transition">
            {submitting ? '送信中...' : '回答して特典を受け取る'}
          </button>
        </div>
      </div>
    </div>
  )
}
