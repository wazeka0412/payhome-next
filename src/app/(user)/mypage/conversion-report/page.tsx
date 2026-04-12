'use client'

import { useState } from 'react'
import Link from 'next/link'

const BUILDERS = [
  '丸和建設', 'ヤマサハウス', 'シースタイル', 'アイフルホーム鹿児島',
  'グッドホームかごしま', 'MBCハウス', 'ベルハウジング', 'タマホーム鹿児島',
  '七呂建設', '万代ホーム', 'その他'
]

export default function ConversionReportPage() {
  const [step, setStep] = useState<'form' | 'complete'>('form')
  const [hasConverted, setHasConverted] = useState<boolean | null>(null)
  const [conversionDate, setConversionDate] = useState('')
  const [company, setCompany] = useState('')
  const [otherCompany, setOtherCompany] = useState('')
  const [giftRequested, setGiftRequested] = useState(true)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyType: 'conversion_report',
          conversionDate: conversionDate || null,
          conversionCompany: company === 'その他' ? otherCompany : company,
          giftRequested,
          responses: {
            hasConverted,
            message,
            reportedBy: 'customer',
          },
        }),
      })
      setStep('complete')
    } catch {
      alert('送信に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-5xl mb-6">🎊</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {hasConverted ? 'ご成約おめでとうございます！' : 'ご報告ありがとうございます！'}
          </h1>
          {hasConverted ? (
            <>
              <p className="text-gray-600 mb-8">
                素敵な平屋づくりのスタートを心からお祝い申し上げます。
                ぺいほーむがお手伝いできたことを嬉しく思います。
              </p>
              {giftRequested && (
                <div className="bg-white rounded-2xl border-2 border-green-200 p-6 mb-8">
                  <div className="text-lg font-bold text-green-600 mb-2">🎁 お祝いギフトについて</div>
                  <p className="text-sm text-gray-600">
                    証憑（契約書の写し等）を確認後、お祝いギフトをお届けします。
                    詳細はメールでご案内いたします。
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-600 mb-8">
              引き続き、家づくりのサポートをいたします。お気軽にご相談ください。
            </p>
          )}
          <Link href="/mypage" className="inline-block bg-[#E8740C] text-white px-8 py-3 rounded-full font-medium hover:bg-[#d06a0a] transition">
            マイページへ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🏡</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">その後の状況を教えてください</h1>
          <p className="text-sm text-gray-500">ぺいほーむから、お祝いやサポートをお届けします</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-8">
          {/* 成約有無 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              工務店との契約は決まりましたか？
            </label>
            <div className="flex gap-3">
              <button onClick={() => setHasConverted(true)}
                className={`flex-1 px-4 py-4 rounded-xl border-2 text-center transition ${
                  hasConverted === true ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}>
                <div className="text-2xl mb-1">🎉</div>
                <div className="text-sm font-medium">はい、決まりました</div>
              </button>
              <button onClick={() => setHasConverted(false)}
                className={`flex-1 px-4 py-4 rounded-xl border-2 text-center transition ${
                  hasConverted === false ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                <div className="text-2xl mb-1">🤔</div>
                <div className="text-sm font-medium">まだ検討中です</div>
              </button>
            </div>
          </div>

          {hasConverted && (
            <>
              {/* 成約日 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">成約日</label>
                <input type="date" value={conversionDate} onChange={e => setConversionDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm" />
              </div>

              {/* 成約先 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">成約した工務店</label>
                <div className="grid grid-cols-2 gap-2">
                  {BUILDERS.map(b => (
                    <button key={b} onClick={() => setCompany(b)}
                      className={`px-3 py-2.5 rounded-lg border text-sm transition ${
                        company === b ? 'border-green-500 bg-green-50 text-green-700 font-medium' : 'border-gray-200'
                      }`}>{b}</button>
                  ))}
                </div>
                {company === 'その他' && (
                  <input type="text" value={otherCompany} onChange={e => setOtherCompany(e.target.value)}
                    placeholder="工務店名を入力" className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-3 text-sm" />
                )}
              </div>

              {/* ギフト希望 */}
              <div className="bg-green-50 rounded-xl p-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={giftRequested} onChange={e => setGiftRequested(e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">お祝いギフトを受け取る</div>
                    <div className="text-xs text-gray-500">証憑確認後にお届けします</div>
                  </div>
                </label>
              </div>
            </>
          )}

          {/* メッセージ */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {hasConverted ? 'ぺいほーむへのメッセージ（任意）' : '現在の状況を教えてください（任意）'}
            </label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
              placeholder={hasConverted ? '例: ぺいほーむで比較できたおかげで決められました！' : '例: まだ3社で迷っています...'}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm" />
          </div>

          <button onClick={handleSubmit} disabled={submitting || hasConverted === null}
            className="w-full bg-green-600 text-white py-3.5 rounded-full font-medium hover:bg-green-700 disabled:opacity-50 transition">
            {submitting ? '送信中...' : '送信する'}
          </button>
        </div>
      </div>
    </div>
  )
}
