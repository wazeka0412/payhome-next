'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const SATISFACTION_OPTIONS = [
  { value: '5', label: '😄 とても良かった' },
  { value: '4', label: '🙂 良かった' },
  { value: '3', label: '😐 普通' },
  { value: '2', label: '😕 やや不満' },
  { value: '1', label: '😞 不満' },
]

export default function PostVisitSurveyPage() {
  const params = useSearchParams()
  const eventId = params.get('event_id') || ''
  const builderName = params.get('builder') || ''

  const [step, setStep] = useState<'survey' | 'complete'>('survey')
  const [satisfaction, setSatisfaction] = useState('')
  const [impression, setImpression] = useState('')
  const [nextMeeting, setNextMeeting] = useState('')
  const [comparing, setComparing] = useState('')
  const [concern, setConcern] = useState('')
  const [wantConsult, setWantConsult] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyType: 'post_visit',
          eventId,
          builderName,
          responses: { satisfaction, impression, nextMeeting, comparing, concern, wantConsult },
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-5xl mb-6">🙏</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ご回答ありがとうございます！</h1>
          <p className="text-gray-600 mb-8">今後の家づくりをぺいほーむがサポートします。</p>
          <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 mb-8">
            <div className="text-lg font-bold text-blue-600 mb-2">🎁 特典をお届けします</div>
            <ul className="text-left text-sm space-y-2">
              <li className="flex items-start gap-2"><span>✅</span> 工務店比較テンプレート</li>
              <li className="flex items-start gap-2"><span>✅</span> 間取り打ち合わせ質問リスト</li>
              <li className="flex items-start gap-2"><span>✅</span> 家づくり比較表（Excel）</li>
            </ul>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/consultation" className="bg-[#E8740C] text-white px-6 py-3 rounded-full font-medium hover:bg-[#d06a0a] transition">
              無料相談する
            </Link>
            <Link href="/mypage" className="bg-white text-gray-700 px-6 py-3 rounded-full font-medium border border-gray-300 hover:bg-gray-50 transition">
              マイページへ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🏠</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">見学会はいかがでしたか？</h1>
          <p className="text-sm text-gray-500">1分で完了 · 回答で比較ツールをプレゼント</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-8">
          {/* Q1 満足度 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Q1. 見学会の満足度</label>
            <div className="space-y-2">
              {SATISFACTION_OPTIONS.map(o => (
                <button key={o.value} onClick={() => setSatisfaction(o.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition ${
                    satisfaction === o.value ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 hover:border-gray-300'
                  }`}>{o.label}</button>
              ))}
            </div>
          </div>

          {/* Q2 印象 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Q2. {builderName || '工務店'}の印象は？</label>
            <div className="flex gap-2">
              {['とても良い', '良い', '普通', 'やや不安'].map(v => (
                <button key={v} onClick={() => setImpression(v)}
                  className={`flex-1 px-2 py-3 rounded-lg border text-xs transition ${
                    impression === v ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200'
                  }`}>{v}</button>
              ))}
            </div>
          </div>

          {/* Q3 次回面談 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Q3. 次回の面談予定はありますか？</label>
            <div className="flex gap-2">
              {['予定あり', '検討中', 'まだ考え中', '予定なし'].map(v => (
                <button key={v} onClick={() => setNextMeeting(v)}
                  className={`flex-1 px-2 py-3 rounded-lg border text-xs transition ${
                    nextMeeting === v ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200'
                  }`}>{v}</button>
              ))}
            </div>
          </div>

          {/* Q4 比較状況 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Q4. 他の工務店とも比較していますか？</label>
            <div className="flex gap-2">
              {['はい', 'いいえ', 'これから'].map(v => (
                <button key={v} onClick={() => setComparing(v)}
                  className={`flex-1 px-3 py-3 rounded-lg border text-sm transition ${
                    comparing === v ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200'
                  }`}>{v}</button>
              ))}
            </div>
          </div>

          {/* Q5 悩み */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Q5. 今いちばん悩んでいることは？（自由記述）</label>
            <textarea value={concern} onChange={e => setConcern(e.target.value)} rows={3}
              placeholder="例: 予算内でどの工務店が合うのか分からない..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
          </div>

          {/* 相談希望 */}
          <div className="bg-orange-50 rounded-xl p-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={wantConsult} onChange={e => setWantConsult(e.target.checked)}
                className="w-5 h-5 text-[#E8740C] rounded" />
              <span className="text-sm text-gray-700">ぺいほーむに無料で相談したい</span>
            </label>
          </div>

          <button onClick={handleSubmit} disabled={submitting || !satisfaction}
            className="w-full bg-blue-600 text-white py-3.5 rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 transition">
            {submitting ? '送信中...' : '回答して特典を受け取る'}
          </button>
        </div>
      </div>
    </div>
  )
}
