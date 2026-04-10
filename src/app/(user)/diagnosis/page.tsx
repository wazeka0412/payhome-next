'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  DIAGNOSIS_QUESTIONS,
  TOTAL_QUESTIONS,
  USER_TYPE_INFO,
} from '@/lib/diagnosis-questions'
import { getOrCreateAnonymousId } from '@/lib/anonymous-id'

type Answers = Record<string, string | string[]>

interface Recommendation {
  id: string
  name: string
  area: string
  score: number
  reason: string
}

interface DiagnosisResult {
  user_type: string
  recommended_builders: Recommendation[]
}

export default function DiagnosisPage() {
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  const [step, setStep] = useState(0) // 0: intro, 1..10: questions, 11: submitting, 12: result
  const [answers, setAnswers] = useState<Answers>({})
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState('')

  const currentQuestion = step >= 1 && step <= TOTAL_QUESTIONS
    ? DIAGNOSIS_QUESTIONS[step - 1]
    : null

  const handleSingleSelect = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    if (step < TOTAL_QUESTIONS) {
      setTimeout(() => setStep(step + 1), 200) // auto-advance
    }
  }

  const handleMultiToggle = (key: string, value: string) => {
    setAnswers((prev) => {
      const current = (prev[key] as string[]) || []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [key]: next }
    })
  }

  const handleSubmit = async () => {
    setStep(TOTAL_QUESTIONS + 1) // submitting
    setError('')

    try {
      const anonymousId = getOrCreateAnonymousId()
      const res = await fetch('/api/ai/diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anonymous_id: anonymousId, answers }),
      })

      if (!res.ok) {
        throw new Error('診断の送信に失敗しました')
      }

      const data: DiagnosisResult = await res.json()
      setResult(data)
      setStep(TOTAL_QUESTIONS + 2) // result

      // 会員登録後の /welcome 画面で再表示できるよう localStorage にキャッシュ
      try {
        localStorage.setItem(
          'payhome_diagnosis_result',
          JSON.stringify({
            user_type: data.user_type,
            recommended_builders: data.recommended_builders,
            cached_at: Date.now(),
          })
        )
      } catch {
        /* ignore quota errors */
      }
    } catch (err) {
      setError((err as Error).message || '通信エラーが発生しました')
      setStep(TOTAL_QUESTIONS) // back to last question
    }
  }

  // ────── Intro ──────
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF3E6]">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <span className="text-3xl font-bold text-[#E8740C]">ぺいほーむ</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI家づくり診断
            </h1>
            <p className="text-gray-600">
              10個の質問に答えるだけで、あなたにぴったりの工務店3社を提案します
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8740C]/10 rounded-full flex items-center justify-center text-[#E8740C] font-bold">1</div>
                <p className="text-gray-700">家族構成・予算・希望エリアを入力</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8740C]/10 rounded-full flex items-center justify-center text-[#E8740C] font-bold">2</div>
                <p className="text-gray-700">デザイン・性能・暮らしの優先事項を選択</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8740C]/10 rounded-full flex items-center justify-center text-[#E8740C] font-bold">3</div>
                <p className="text-gray-700">AIがあなたのタイプを分析し、工務店3社を提案</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
              <span>⏱</span>
              <span>所要時間：約2分</span>
            </div>
          </div>

          <button
            onClick={() => setStep(1)}
            className="w-full bg-[#E8740C] hover:bg-[#D06800] text-white font-bold py-4 rounded-xl text-lg shadow-lg transition"
          >
            診断をはじめる →
          </button>

          {!isLoggedIn && (
            <p className="text-xs text-gray-500 text-center mt-4">
              ※ 非会員でも診断できます。
              <Link href="/signup" className="text-[#E8740C] hover:underline">
                会員登録
              </Link>
              すると結果が保存できます
            </p>
          )}
        </div>
      </div>
    )
  }

  // ────── Questions ──────
  if (currentQuestion) {
    const progress = (step / TOTAL_QUESTIONS) * 100
    const selected = answers[currentQuestion.key]
    const selectedArray = (selected as string[]) || []
    const canProceed = currentQuestion.multi ? selectedArray.length > 0 : !!selected

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF3E6]">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>質問 {step} / {TOTAL_QUESTIONS}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#E8740C] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              {currentQuestion.question}
              {currentQuestion.multi && (
                <span className="block text-sm font-normal text-gray-500 mt-2">
                  （複数選択できます）
                </span>
              )}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = currentQuestion.multi
                  ? selectedArray.includes(opt.value)
                  : selected === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() =>
                      currentQuestion.multi
                        ? handleMultiToggle(currentQuestion.key, opt.value)
                        : handleSingleSelect(currentQuestion.key, opt.value)
                    }
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition ${
                      isSelected
                        ? 'border-[#E8740C] bg-[#E8740C]/5 text-[#E8740C] font-semibold'
                        : 'border-gray-200 hover:border-[#E8740C]/50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-[#E8740C] bg-[#E8740C]' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span>{opt.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-30 font-medium"
              >
                ← 前の質問
              </button>
              {currentQuestion.multi && (
                <button
                  onClick={() =>
                    step < TOTAL_QUESTIONS ? setStep(step + 1) : handleSubmit()
                  }
                  disabled={!canProceed}
                  className="bg-[#E8740C] hover:bg-[#D06800] disabled:opacity-30 text-white font-semibold px-6 py-2 rounded-lg transition"
                >
                  {step < TOTAL_QUESTIONS ? '次へ →' : '診断結果を見る'}
                </button>
              )}
              {!currentQuestion.multi && step === TOTAL_QUESTIONS && canProceed && (
                <button
                  onClick={handleSubmit}
                  className="bg-[#E8740C] hover:bg-[#D06800] text-white font-semibold px-6 py-2 rounded-lg transition"
                >
                  診断結果を見る
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ────── Submitting ──────
  if (step === TOTAL_QUESTIONS + 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF3E6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#E8740C] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-700 text-lg">AIがあなたにぴったりの工務店を分析中...</p>
        </div>
      </div>
    )
  }

  // ────── Result ──────
  if (result && step === TOTAL_QUESTIONS + 2) {
    const info = USER_TYPE_INFO[result.user_type] || USER_TYPE_INFO.balanced
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF3E6]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1 rounded-full text-sm font-semibold text-white mb-3" style={{ backgroundColor: info.color }}>
              あなたの家づくりタイプ
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {info.label}
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              {info.description}
            </p>
          </div>

          {/* Signup CTA + デジタルカタログプレゼント告知 */}
          {!isLoggedIn ? (
            <div className="bg-gradient-to-br from-[#3D2200] via-[#8B4513] to-[#3D2200] text-white rounded-2xl p-6 md:p-7 mb-8 shadow-xl">
              <p className="text-[10px] font-bold tracking-widest text-yellow-300 mb-2">
                ぺいほーむ住宅ポータルサイト開設記念
              </p>
              <h3 className="text-lg md:text-xl font-extrabold mb-2 leading-tight">
                会員登録でデジタルカタログ進呈
              </h3>
              <p className="text-sm mb-2 opacity-95">
                診断結果の保存に加え、<span className="font-bold text-yellow-300">施工事例集 30邸</span>と
                <span className="font-bold text-yellow-300">平屋間取り図集 30プラン</span>のデジタルカタログを今すぐお渡しします。
              </p>
              <ul className="text-xs opacity-90 mb-5 space-y-1">
                <li>✓ 間取り図をフル解像度で閲覧</li>
                <li>✓ お気に入り無制限</li>
                <li>✓ 工務店比較機能（最大3社）</li>
                <li>✓ デジタルカタログ無料DL</li>
              </ul>
              <Link
                href="/signup?redirect=/mypage/catalog"
                className="inline-block bg-white text-[#E8740C] font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-100 transition shadow-md"
              >
                会員登録してカタログを受け取る →
              </Link>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#E8740C] via-[#F5A623] to-[#E8740C] text-white rounded-2xl p-6 md:p-7 mb-8 shadow-xl">
              <p className="text-[10px] font-bold tracking-widest text-yellow-200 mb-2">
                受け取り条件をクリア
              </p>
              <h3 className="text-lg md:text-xl font-extrabold mb-2 leading-tight">
                デジタルカタログを受け取れます
              </h3>
              <p className="text-sm mb-4 opacity-95">
                施工事例集 30邸 + 平屋間取り図集 30プラン がマイページからご覧いただけます。
              </p>
              <Link
                href="/mypage/catalog"
                className="inline-block bg-white text-[#E8740C] font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-100 transition shadow-md"
              >
                カタログ受け取り画面へ →
              </Link>
            </div>
          )}

          {/* Recommended builders */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            あなたにおすすめの工務店 {result.recommended_builders.length}社
          </h2>
          <div className="space-y-4 mb-8">
            {result.recommended_builders.map((builder, idx) => (
              <div
                key={builder.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E8740C] text-white rounded-full flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{builder.name}</h3>
                      <p className="text-sm text-gray-500">{builder.area}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#E8740C]">
                      {builder.score}
                    </div>
                    <div className="text-xs text-gray-500">マッチ度</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4 bg-gray-50 rounded-lg p-3">
                  {builder.reason}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Link
                    href={`/builders/${builder.id}`}
                    className="bg-[#E8740C] hover:bg-[#D06800] text-white text-center text-xs font-semibold py-2.5 rounded-lg transition"
                  >
                    工務店ページ
                  </Link>
                  <Link
                    href={`/event?builder=${encodeURIComponent(builder.name)}`}
                    className="border border-[#E8740C] text-[#E8740C] hover:bg-[#FFF8F0] text-center text-xs font-semibold py-2.5 rounded-lg transition"
                  >
                    見学会予約
                  </Link>
                  <Link
                    href={`/sale-homes?builder=${builder.id}`}
                    className="border border-gray-300 hover:border-[#E8740C] text-gray-700 hover:text-[#E8740C] text-center text-xs font-semibold py-2.5 rounded-lg transition"
                  >
                    分譲を見る
                  </Link>
                  <Link
                    href={`/lands?builder=${builder.id}`}
                    className="border border-gray-300 hover:border-[#E8740C] text-gray-700 hover:text-[#E8740C] text-center text-xs font-semibold py-2.5 rounded-lg transition"
                  >
                    土地を見る
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setStep(0)
                setAnswers({})
                setResult(null)
              }}
              className="text-[#E8740C] hover:underline text-sm"
            >
              もう一度診断する
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
