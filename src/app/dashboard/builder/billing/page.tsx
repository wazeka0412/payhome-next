'use client'

import { useState } from 'react'

const HISTORY = [
  { month: '2026年3月', items: '資料請求12件 x \u00A53,000', total: '\u00A536,000', status: '請求中' },
  { month: '2026年2月', items: '資料請求9件 x \u00A53,000', total: '\u00A527,000', status: '支払済' },
  { month: '2026年1月', items: '資料請求10件 x \u00A53,000', total: '\u00A530,000', status: '支払済' },
]

const PLANS = [
  {
    name: 'フリー',
    price: '\u00A50',
    unit: '/月',
    features: ['資料請求 \u00A53,000/件', '月間上限なし', 'リード管理', 'メールサポート'],
    current: true,
  },
  {
    name: 'グロース',
    price: '\u00A549,800',
    unit: '/月',
    features: ['資料請求 \u00A52,000/件', '月20件まで込み', '見学会管理', '優先サポート', '施工事例10件'],
    current: false,
    recommended: true,
  },
  {
    name: 'プレミアム',
    price: '\u00A598,000',
    unit: '/月',
    features: ['資料請求 \u00A51,500/件', '月50件まで込み', 'AI見積もり連携', '専任担当者', '施工事例無制限', 'エリア優先表示'],
    current: false,
  },
]

export default function BillingPage() {
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [currentPlan, setCurrentPlan] = useState('フリー')
  const [planChanged, setPlanChanged] = useState(false)

  const handlePlanSelect = (planName: string) => {
    setCurrentPlan(planName)
    setShowPlanModal(false)
    setPlanChanged(true)
    setTimeout(() => setPlanChanged(false), 3000)
  }

  const handleDownloadInvoice = (month: string) => {
    alert(`${month}の請求書をダウンロードします（デモ）`)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-6">請求・プラン</h1>

      {/* Plan changed confirmation */}
      {planChanged && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-sm text-green-700 font-medium">
          <span className="text-green-500">&#10003;</span>
          プランを「{currentPlan}」に変更しました
        </div>
      )}

      {/* Current plan */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">現在のプラン</p>
            <p className="text-xl font-bold text-gray-900">{currentPlan}プラン</p>
            <p className="text-sm text-gray-500 mt-1">従量課金制 - 資料請求 \u00A53,000/件</p>
          </div>
          <button
            onClick={() => setShowPlanModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#E8740C] text-white text-sm font-bold hover:bg-[#D4660A] transition cursor-pointer"
          >
            プランを変更
          </button>
        </div>
      </div>

      {/* Current billing */}
      <div className="bg-[#FFF8F0] rounded-xl border border-[#E8740C]/20 p-6 mb-6">
        <p className="text-sm text-gray-600 mb-1">今月の請求</p>
        <p className="text-3xl font-bold text-[#E8740C]">&yen;36,000</p>
        <p className="text-sm text-gray-500 mt-2">資料請求 12件 &times; &yen;3,000 = &yen;36,000</p>
      </div>

      {/* Billing history */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <h2 className="text-sm font-bold text-gray-900 mb-4">請求履歴</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 text-gray-500 font-semibold">月</th>
                <th className="text-left py-3 text-gray-500 font-semibold">内訳</th>
                <th className="text-right py-3 text-gray-500 font-semibold">金額</th>
                <th className="text-right py-3 text-gray-500 font-semibold">状態</th>
                <th className="text-right py-3 text-gray-500 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {HISTORY.map((h, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-3 text-gray-800">{h.month}</td>
                  <td className="py-3 text-gray-600">{h.items}</td>
                  <td className="py-3 text-right font-bold text-gray-800">{h.total}</td>
                  <td className="py-3 text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${h.status === '支払済' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {h.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(h.month)}
                      className="text-xs text-[#E8740C] font-bold hover:underline cursor-pointer"
                    >
                      請求書DL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan comparison */}
      <h2 className="text-sm font-bold text-gray-900 mb-4">プラン比較</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan, i) => {
          const isCurrent = plan.name === currentPlan;
          return (
            <div key={i} className={`bg-white rounded-xl border p-6 relative ${plan.recommended ? 'border-[#E8740C] ring-1 ring-[#E8740C]' : 'border-gray-100'}`}>
              {plan.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8740C] text-white text-xs px-3 py-0.5 rounded-full font-bold">おすすめ</span>
              )}
              <p className="text-lg font-bold text-gray-900 mb-1">{plan.name}</p>
              <p className="text-2xl font-bold text-gray-900">{plan.price}<span className="text-sm font-normal text-gray-400">{plan.unit}</span></p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f, j) => (
                  <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-green-500 text-xs">{'\u2713'}</span>{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => !isCurrent && handlePlanSelect(plan.name)}
                className={`w-full mt-6 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                  isCurrent ? 'bg-gray-100 text-gray-400 cursor-default' :
                  plan.recommended ? 'bg-[#E8740C] text-white hover:bg-[#D4660A]' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                disabled={isCurrent}
              >
                {isCurrent ? '現在のプラン' : 'このプランにする'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Plan Change Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={() => setShowPlanModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">プランを変更</h3>
            <p className="text-sm text-gray-500 mb-6">変更したいプランを選択してください。</p>
            <div className="space-y-3">
              {PLANS.map((plan, i) => {
                const isCurrent = plan.name === currentPlan;
                return (
                  <button
                    key={i}
                    onClick={() => !isCurrent && handlePlanSelect(plan.name)}
                    disabled={isCurrent}
                    className={`w-full text-left p-4 rounded-xl border transition cursor-pointer ${
                      isCurrent
                        ? 'border-[#E8740C] bg-[#FFF8F0]'
                        : 'border-gray-200 hover:border-[#E8740C] hover:bg-orange-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{plan.name}</p>
                        <p className="text-sm text-gray-500">{plan.price}{plan.unit}</p>
                      </div>
                      {isCurrent && <span className="text-xs bg-[#E8740C] text-white px-2 py-0.5 rounded-full">現在</span>}
                    </div>
                  </button>
                )
              })}
            </div>
            <button onClick={() => setShowPlanModal(false)} className="w-full mt-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition cursor-pointer">
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
