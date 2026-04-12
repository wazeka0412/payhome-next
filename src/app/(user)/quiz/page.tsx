'use client'

import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import PageHeader from '@/components/ui/PageHeader'
import {
  QUIZ_QUESTIONS,
  CATEGORY_LABELS,
  LEVEL_LABELS,
  calculateQuizResult,
  type QuizResult,
} from '@/lib/quiz-data'
import { getOrCreateAnonymousId } from '@/lib/anonymous-id'

/**
 * ぺいほーむクイズ (MVP v1)
 *
 * 目的: 家づくりの理解度を可視化し、次の最適行動へ導く教育導線
 *
 * 核ループ (動画 → AI診断/無料相談 → 工務店 → 見学会予約) を壊さず、
 * 核ループへ合流するための教育入口として機能する。
 *
 * AI診断との違い:
 *   - AI診断: 自分に合う家・工務店の方向性を整理する (マッチング)
 *   - クイズ: 家づくりの理解度を可視化し、知識不足を補う (教育)
 */
type Phase = 'intro' | 'quiz' | 'result'

export default function QuizPage() {
  const { status } = useSession()
  const isMember = status === 'authenticated'

  const [phase, setPhase] = useState<Phase>('intro')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Array<{ questionId: string; selectedIndex: number }>>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)

  const currentQuestion = QUIZ_QUESTIONS[currentIndex]
  const progress = currentIndex / QUIZ_QUESTIONS.length

  const handleSelect = useCallback((optionIndex: number) => {
    if (showExplanation) return
    setSelectedOption(optionIndex)
    setShowExplanation(true)

    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, selectedIndex: optionIndex },
    ])
  }, [showExplanation, currentQuestion])

  const handleNext = useCallback(() => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1)
      setSelectedOption(null)
      setShowExplanation(false)
    } else {
      // 全問回答完了
      const newAnswers = [
        ...answers.slice(0, -1),
        ...answers.slice(-1),
      ]
      const quizResult = calculateQuizResult(newAnswers)
      setResult(quizResult)
      setPhase('result')

      // 結果を localStorage に保存 (会員・非会員共通)
      try {
        const data = {
          result: quizResult,
          answers: newAnswers,
          completedAt: new Date().toISOString(),
        }
        localStorage.setItem('payhome_quiz_result', JSON.stringify(data))
      } catch { /* ignore */ }

      // 会員の場合は API に保存 (将来実装)
      if (isMember) {
        const anonymousId = getOrCreateAnonymousId()
        fetch('/api/quiz/result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            anonymous_id: anonymousId,
            answers: newAnswers,
            result: quizResult,
          }),
        }).catch(() => { /* 非致命的 */ })
      }
    }
  }, [currentIndex, answers, isMember])

  const handleRestart = useCallback(() => {
    setPhase('intro')
    setCurrentIndex(0)
    setAnswers([])
    setSelectedOption(null)
    setShowExplanation(false)
    setResult(null)
  }, [])

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <>
        <PageHeader
          title="ぺいほーむクイズ"
          breadcrumbs={[{ label: 'ホーム', href: '/' }, { label: 'ぺいほーむクイズ' }]}
          subtitle="家づくりの理解度をチェック"
        />
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-[#E8740C]/20">
              <div className="text-5xl mb-6">📝</div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#3D2200] mb-4 leading-tight">
                あなたの家づくり理解度は？
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                10問の質問に答えて、家づくりの知識レベルをチェック。
                <br />
                結果に応じて、あなたに最適な次のステップをご案内します。
              </p>
              <p className="text-xs text-gray-400 mb-8">
                所要時間: 約3分 / 全{QUIZ_QUESTIONS.length}問 / 4カテゴリ
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8 max-w-md mx-auto text-left">
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-2 h-2 bg-[#E8740C] rounded-full shrink-0" />
                    {label}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setPhase('quiz')}
                className="bg-[#E8740C] hover:bg-[#D4660A] text-white font-extrabold px-10 py-4 rounded-full text-sm transition shadow-[0_4px_12px_rgba(232,116,12,0.3)] cursor-pointer"
              >
                クイズをはじめる →
              </button>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/diagnosis"
                  className="text-xs text-[#E8740C] font-bold hover:underline"
                >
                  自分に合う工務店を知りたい方は → AI家づくり診断
                </Link>
              </div>

              {/* AI診断との違い */}
              <div className="mt-8 bg-[#FFF8F0] rounded-xl p-4 text-left">
                <p className="text-[10px] font-bold text-[#E8740C] mb-2">
                  AI家づくり診断との違い
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                  <div>
                    <p className="font-bold text-[#3D2200] mb-1">📝 ぺいほーむクイズ</p>
                    <p>家づくりの<strong>理解度</strong>を可視化し、知識不足を補う</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#3D2200] mb-1">🎯 AI家づくり診断</p>
                    <p>自分に<strong>合う家・工務店</strong>の方向性を整理する</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  // ── QUIZ ──
  if (phase === 'quiz' && currentQuestion) {
    const isCorrect = selectedOption === currentQuestion.correctIndex
    return (
      <>
        <PageHeader
          title="ぺいほーむクイズ"
          breadcrumbs={[{ label: 'ホーム', href: '/' }, { label: 'ぺいほーむクイズ' }]}
          subtitle={`Q${currentIndex + 1} / ${QUIZ_QUESTIONS.length}`}
        />
        <section className="py-8 md:py-12">
          <div className="max-w-3xl mx-auto px-4">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>Q{currentIndex + 1} / {QUIZ_QUESTIONS.length}</span>
                <span className="px-2 py-0.5 bg-[#FFF8F0] text-[#E8740C] rounded-full text-[10px] font-bold">
                  {CATEGORY_LABELS[currentQuestion.category]}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E8740C] rounded-full transition-all duration-500"
                  style={{ width: `${((currentIndex + (showExplanation ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
              <h2 className="text-lg md:text-xl font-bold text-[#3D2200] mb-6 leading-relaxed">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  let style = 'border-gray-200 hover:border-[#E8740C] hover:bg-[#FFF8F0]'
                  if (showExplanation) {
                    if (idx === currentQuestion.correctIndex) {
                      style = 'border-green-500 bg-green-50 text-green-900'
                    } else if (idx === selectedOption && idx !== currentQuestion.correctIndex) {
                      style = 'border-red-400 bg-red-50 text-red-900'
                    } else {
                      style = 'border-gray-100 opacity-50'
                    }
                  } else if (selectedOption === idx) {
                    style = 'border-[#E8740C] bg-[#FFF8F0]'
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={showExplanation}
                      className={`w-full text-left p-4 rounded-xl border-2 text-sm font-medium transition cursor-pointer ${style} ${
                        showExplanation ? 'cursor-default' : ''
                      }`}
                    >
                      <span className="font-bold text-[#E8740C] mr-2">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className={`rounded-2xl p-5 mb-6 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
                <p className={`text-sm font-bold mb-2 ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                  {isCorrect ? '✅ 正解！' : '❌ 不正解'}
                </p>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Next button */}
            {showExplanation && (
              <div className="text-center">
                <button
                  onClick={handleNext}
                  className="bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold px-8 py-3 rounded-full text-sm transition shadow-md cursor-pointer"
                >
                  {currentIndex < QUIZ_QUESTIONS.length - 1 ? '次の問題へ →' : '結果を見る →'}
                </button>
              </div>
            )}
          </div>
        </section>
      </>
    )
  }

  // ── RESULT ──
  if (phase === 'result' && result) {
    const levelInfo = LEVEL_LABELS[result.level]
    return (
      <>
        <PageHeader
          title="クイズ結果"
          breadcrumbs={[
            { label: 'ホーム', href: '/' },
            { label: 'ぺいほーむクイズ', href: '/quiz' },
            { label: '結果' },
          ]}
          subtitle={`${result.score} / ${result.total} 問正解`}
        />
        <section className="py-8 md:py-12">
          <div className="max-w-3xl mx-auto px-4 space-y-8">
            {/* Level card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10 text-center">
              <p className="text-xs font-bold tracking-widest mb-3" style={{ color: levelInfo.color }}>
                YOUR LEVEL
              </p>
              <div
                className="inline-flex items-center gap-2 text-3xl md:text-4xl font-extrabold mb-4"
                style={{ color: levelInfo.color }}
              >
                {result.level === 'beginner' && '🌱'}
                {result.level === 'intermediate' && '🌿'}
                {result.level === 'advanced' && '🌳'}
                {levelInfo.label}
              </div>
              <p className="text-lg font-extrabold text-[#3D2200] mb-3">
                {result.score} / {result.total} 問正解
              </p>
              <p className="text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">
                {levelInfo.description}
              </p>
            </div>

            {/* Category breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-base font-bold text-[#3D2200] mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#E8740C] rounded-full" />
                カテゴリ別の結果
              </h3>
              <div className="space-y-3">
                {Object.entries(result.categoryScores).map(([cat, score]) => {
                  const ratio = score.correct / score.total
                  const isWeak = ratio < 0.5
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#3D2200] w-36 truncate">
                        {CATEGORY_LABELS[cat] || cat}
                      </span>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isWeak ? 'bg-orange-400' : 'bg-green-400'}`}
                          style={{ width: `${ratio * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${isWeak ? 'text-orange-600' : 'text-green-600'}`}>
                        {score.correct}/{score.total}
                      </span>
                    </div>
                  )
                })}
              </div>
              {result.weakCategories.length > 0 && (
                <p className="mt-4 text-xs text-orange-600 font-bold">
                  📌 苦手カテゴリ: {result.weakCategories.map((c) => CATEGORY_LABELS[c] || c).join('、')}
                </p>
              )}
            </div>

            {/* Level-specific CTAs */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-base font-bold text-[#3D2200] mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#E8740C] rounded-full" />
                あなたにおすすめの次のステップ
              </h3>

              {result.level === 'beginner' && (
                <div className="space-y-3">
                  <CTACard
                    emoji="🎯"
                    title="AI家づくり診断を受ける"
                    description="10問で、あなたに合う工務店3社を提案します"
                    href="/diagnosis"
                    primary
                  />
                  <CTACard
                    emoji="💬"
                    title="無料住宅相談を申し込む"
                    description="専門スタッフが家づくりの基礎から一緒に考えます"
                    href="/consultation"
                  />
                  <CTACard
                    emoji="🎬"
                    title="動画で平屋を見てみる"
                    description="ルームツアー42本で、平屋のイメージを掴みましょう"
                    href="/videos"
                  />
                </div>
              )}

              {result.level === 'intermediate' && (
                <div className="space-y-3">
                  <CTACard
                    emoji="🏠"
                    title="平屋事例ライブラリを見る"
                    description="完成事例で、間取り・費用・工務店を比較"
                    href="/case-studies"
                    primary
                  />
                  <CTACard
                    emoji="🏗"
                    title="提携工務店を比較する"
                    description="得意分野・価格帯・年間棟数で絞り込み"
                    href="/builders"
                  />
                  <CTACard
                    emoji="🎯"
                    title="AI家づくり診断で方向性を整理"
                    description="相性の良い工務店3社を自動推薦"
                    href="/diagnosis"
                  />
                </div>
              )}

              {result.level === 'advanced' && (
                <div className="space-y-3">
                  <CTACard
                    emoji="📅"
                    title="見学会を予約する"
                    description="実物を体感して、理想の家づくりを前に進めましょう"
                    href="/event"
                    primary
                  />
                  <CTACard
                    emoji="💬"
                    title="無料相談で具体的に進める"
                    description="専門スタッフが工務店選びから資金計画まで相談に乗ります"
                    href="/consultation"
                  />
                  <CTACard
                    emoji="🏗"
                    title="気になる工務店を詳しく見る"
                    description="提携工務店の詳細ページで、得意分野と実績を確認"
                    href="/builders"
                  />
                </div>
              )}
            </div>

            {/* 会員訴求 (非会員のみ) */}
            {!isMember && (
              <div className="bg-gradient-to-br from-[#FFF8F0] to-white border-2 border-[#E8740C]/20 rounded-2xl p-6 text-center">
                <p className="text-xs font-bold text-[#E8740C] mb-2">MEMBER REGISTRATION</p>
                <h3 className="text-base font-bold text-[#3D2200] mb-2">
                  会員登録で、クイズ結果を保存できます
                </h3>
                <p className="text-xs text-gray-600 mb-4">
                  理解度の記録・AI診断結果の保存・お気に入り整理・事例全件閲覧まで、
                  家づくりが一気に進む会員機能が使えるようになります。
                </p>
                <Link
                  href="/signup?redirect=/quiz"
                  className="inline-block bg-[#E8740C] hover:bg-[#D4660A] text-white font-bold px-6 py-3 rounded-full text-sm transition shadow-md"
                >
                  無料会員登録する →
                </Link>
              </div>
            )}

            {/* もう一度受ける / マイページ */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRestart}
                className="border-2 border-[#E8740C] text-[#E8740C] font-bold px-6 py-2.5 rounded-full text-xs hover:bg-[#FFF8F0] transition cursor-pointer"
              >
                もう一度受ける
              </button>
              {isMember && (
                <Link
                  href="/mypage"
                  className="border border-gray-200 text-gray-600 font-bold px-6 py-2.5 rounded-full text-xs hover:bg-gray-50 transition text-center"
                >
                  マイページへ
                </Link>
              )}
            </div>
          </div>
        </section>
      </>
    )
  }

  return null
}

function CTACard({
  emoji,
  title,
  description,
  href,
  primary,
}: {
  emoji: string
  title: string
  description: string
  href: string
  primary?: boolean
}) {
  return (
    <Link
      href={href}
      className={`block rounded-xl p-4 transition ${
        primary
          ? 'bg-[#E8740C] text-white hover:bg-[#D4660A] shadow-[0_2px_8px_rgba(232,116,12,0.3)]'
          : 'bg-white border border-gray-100 hover:shadow-md hover:border-[#E8740C]/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{emoji}</span>
        <div>
          <h4 className={`text-sm font-bold ${primary ? 'text-white' : 'text-[#3D2200]'}`}>
            {title}
          </h4>
          <p className={`text-xs mt-0.5 ${primary ? 'text-white/90' : 'text-gray-500'}`}>
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}
