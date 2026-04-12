'use client'

import { useState } from 'react'
import Link from 'next/link'

const AREA_PRIORITIES = [
  '指定の地域がある', '通勤通学に便利なエリア', '実家に近い場所',
  '予算内に収まる', '土地の広さ・周辺環境',
]
const PERFORMANCE = [
  '耐震性', '断熱性', '耐火性', '太陽光発電', '全館空調',
  'シックハウス対策', 'ビルトインガレージ',
]
const PURPOSES = [
  '家が古くなってきた', '家が手狭', '家賃がもったいない',
  '結婚のため', '家族構成の変化', '家族の希望',
  '環境をよくしたい', '通勤通学の利便性',
]
const EXTERIORS = [
  '和風', '和洋折衷', '洋風', 'ナチュラルモダン', 'シンプルモダン',
]

export default function HomeBuildingPage() {
  const [step, setStep] = useState<'form' | 'saved'>('form')
  const [saving, setSaving] = useState(false)

  // STEP 0
  const [startDate, setStartDate] = useState('')
  const [moveIn, setMoveIn] = useState('')
  const [family, setFamily] = useState('')
  const [purposes, setPurposes] = useState<string[]>([])

  // STEP 2: 土地
  const [hasLand, setHasLand] = useState<boolean | null>(null)
  const [landStatus, setLandStatus] = useState('')
  const [areas, setAreas] = useState(['', '', ''])
  const [areaPriorities, setAreaPriorities] = useState<string[]>([])
  const [siteArea, setSiteArea] = useState('')

  // STEP 2: 予算
  const [totalBudget, setTotalBudget] = useState('')
  const [buildingBudget, setBuildingBudget] = useState('')
  const [landBudget, setLandBudget] = useState('')
  const [ownFunds, setOwnFunds] = useState('')
  const [monthlyPayment, setMonthlyPayment] = useState('')

  // STEP 2: 間取り
  const [floorArea, setFloorArea] = useState('')
  const [ldkCount, setLdkCount] = useState('')
  const [parking, setParking] = useState('')

  // STEP 3: デザイン
  const [exterior, setExterior] = useState('')
  const [styleDetail, setStyleDetail] = useState('')
  const [performance, setPerformance] = useState<string[]>([])

  const toggle = (arr: string[], v: string, setter: (a: string[]) => void) => {
    setter(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v])
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/profile/home-building', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'temp-user', // Will be replaced with actual user ID
          consideration_start: startDate,
          move_in_timeline: moveIn,
          family_summary: family,
          building_purpose: purposes,
          has_land: hasLand,
          land_search_status: landStatus,
          preferred_areas: areas.filter(a => a),
          area_priorities: areaPriorities,
          site_area_tsubo: siteArea ? parseFloat(siteArea) : null,
          total_budget: totalBudget ? parseInt(totalBudget) : null,
          building_budget: buildingBudget ? parseInt(buildingBudget) : null,
          land_budget: landBudget ? parseInt(landBudget) : null,
          own_funds: ownFunds ? parseInt(ownFunds) : null,
          monthly_payment: monthlyPayment ? parseInt(monthlyPayment) : null,
          floor_area_tsubo: floorArea ? parseFloat(floorArea) : null,
          ldk_count: ldkCount ? parseInt(ldkCount) : null,
          parking_spaces: parking ? parseInt(parking) : null,
          exterior_style: exterior,
          style_detail: styleDetail,
          performance_priorities: performance,
        }),
      })
      setStep('saved')
    } catch {
      alert('保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  if (step === 'saved') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-5xl mb-6">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">カルテを保存しました</h1>
          <p className="text-gray-600 mb-8">入力いただいた情報は、見学会予約時や工務店との商談前に活用されます。いつでも更新できます。</p>
          <div className="flex gap-3 justify-center">
            <Link href="/event" className="bg-[#E8740C] text-white px-6 py-3 rounded-full font-medium hover:bg-[#d06a0a] transition">見学会を探す</Link>
            <Link href="/mypage" className="bg-white text-gray-700 px-6 py-3 rounded-full font-medium border border-gray-300 hover:bg-gray-50 transition">マイページへ</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">📋</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">お家づくりカルテ</h1>
          <p className="text-sm text-gray-500">希望条件を整理すると、おすすめ精度UP & 工務店に要望が正確に伝わります</p>
        </div>

        <div className="space-y-8">
          {/* STEP 0: 基本情報 */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-[#3D2200] mb-4 flex items-center gap-2">
              <span className="bg-[#E8740C] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">0</span>
              基本情報
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">検討開始時期</label>
                <input type="text" value={startDate} onChange={e => setStartDate(e.target.value)}
                  placeholder="例: 2025年1月" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">入居希望時期</label>
                <div className="flex flex-wrap gap-2">
                  {['半年以内', '半年〜1年', '1〜2年', '2年以上', '未定'].map(v => (
                    <button key={v} onClick={() => setMoveIn(v)}
                      className={`px-3 py-2 rounded-lg border text-sm ${moveIn === v ? 'border-[#E8740C] bg-orange-50 text-[#E8740C] font-medium' : 'border-gray-200'}`}>{v}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">家族構成</label>
                <input type="text" value={family} onChange={e => setFamily(e.target.value)}
                  placeholder="例: 本人(30) + 婚約者(31)" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">検討のきっかけ（複数選択可）</label>
                <div className="flex flex-wrap gap-2">
                  {PURPOSES.map(v => (
                    <button key={v} onClick={() => toggle(purposes, v, setPurposes)}
                      className={`px-3 py-2 rounded-lg border text-xs ${purposes.includes(v) ? 'border-[#E8740C] bg-orange-50 text-[#E8740C] font-medium' : 'border-gray-200'}`}>{v}</button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* STEP 2: 土地・エリア */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-[#3D2200] mb-4 flex items-center gap-2">
              <span className="bg-[#E8740C] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">1</span>
              土地・エリア
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">建築予定地</label>
                <div className="flex gap-2">
                  <button onClick={() => setHasLand(true)} className={`flex-1 px-4 py-3 rounded-lg border text-sm ${hasLand === true ? 'border-[#E8740C] bg-orange-50 text-[#E8740C] font-medium' : 'border-gray-200'}`}>あり</button>
                  <button onClick={() => setHasLand(false)} className={`flex-1 px-4 py-3 rounded-lg border text-sm ${hasLand === false ? 'border-[#E8740C] bg-orange-50 text-[#E8740C] font-medium' : 'border-gray-200'}`}>なし（探す）</button>
                </div>
              </div>
              {hasLand === false && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">土地検討状況</label>
                  <div className="flex flex-wrap gap-2">
                    {['これから探す', '情報収集中', '不動産会社に依頼中', '検討中'].map(v => (
                      <button key={v} onClick={() => setLandStatus(v)}
                        className={`px-3 py-2 rounded-lg border text-sm ${landStatus === v ? 'border-[#E8740C] bg-orange-50 text-[#E8740C] font-medium' : 'border-gray-200'}`}>{v}</button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">検討エリア（最大3つ）</label>
                {[0, 1, 2].map(i => (
                  <input key={i} type="text" value={areas[i]} onChange={e => { const a = [...areas]; a[i] = e.target.value; setAreas(a) }}
                    placeholder={`エリア${i + 1}`} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-2" />
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">エリアで重視すること</label>
                <div className="flex flex-wrap gap-2">
                  {AREA_PRIORITIES.map(v => (
                    <button key={v} onClick={() => toggle(areaPriorities, v, setAreaPriorities)}
                      className={`px-3 py-2 rounded-lg border text-xs ${areaPriorities.includes(v) ? 'border-[#E8740C] bg-orange-50 text-[#E8740C] font-medium' : 'border-gray-200'}`}>{v}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">希望敷地面積（坪）</label>
                <input type="number" value={siteArea} onChange={e => setSiteArea(e.target.value)}
                  placeholder="例: 70" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" />
              </div>
            </div>
          </section>

          {/* STEP 2: 予算 */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-[#3D2200] mb-4 flex items-center gap-2">
              <span className="bg-[#E8740C] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">2</span>
              予算・資金計画
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['総予算（万円）', totalBudget, setTotalBudget, '3800'],
                ['建物予算（万円）', buildingBudget, setBuildingBudget, '3000'],
                ['土地予算（万円）', landBudget, setLandBudget, '800'],
                ['自己資金（万円）', ownFunds, setOwnFunds, '300'],
                ['月返済希望（万円）', monthlyPayment, setMonthlyPayment, '8'],
              ].map(([label, val, setter, ph]) => (
                <div key={label as string}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{label as string}</label>
                  <input type="number" value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)}
                    placeholder={ph as string} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" />
                </div>
              ))}
            </div>
          </section>

          {/* STEP 2: 間取り */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-[#3D2200] mb-4 flex items-center gap-2">
              <span className="bg-[#E8740C] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">3</span>
              間取り・広さ
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">延床面積（坪）</label>
                <input type="number" value={floorArea} onChange={e => setFloorArea(e.target.value)}
                  placeholder="30" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">LDK数</label>
                <input type="number" value={ldkCount} onChange={e => setLdkCount(e.target.value)}
                  placeholder="4" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">駐車スペース</label>
                <input type="number" value={parking} onChange={e => setParking(e.target.value)}
                  placeholder="2" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" />
              </div>
            </div>
          </section>

          {/* STEP 3: デザイン・性能 */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-[#3D2200] mb-4 flex items-center gap-2">
              <span className="bg-[#E8740C] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">4</span>
              デザイン・性能
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">好きな外観タイプ</label>
                <div className="flex flex-wrap gap-2">
                  {EXTERIORS.map(v => (
                    <button key={v} onClick={() => setExterior(v)}
                      className={`px-3 py-2 rounded-lg border text-sm ${exterior === v ? 'border-[#E8740C] bg-orange-50 text-[#E8740C] font-medium' : 'border-gray-200'}`}>{v}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">デザインの補足（自由記述）</label>
                <textarea value={styleDetail} onChange={e => setStyleDetail(e.target.value)} rows={2}
                  placeholder="例: シンプルモダンで自然素材が強すぎないのが好み"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">こだわりたい性能（複数選択可）</label>
                <div className="flex flex-wrap gap-2">
                  {PERFORMANCE.map(v => (
                    <button key={v} onClick={() => toggle(performance, v, setPerformance)}
                      className={`px-3 py-2 rounded-lg border text-xs ${performance.includes(v) ? 'border-[#E8740C] bg-orange-50 text-[#E8740C] font-medium' : 'border-gray-200'}`}>{v}</button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 保存ボタン */}
          <button onClick={handleSave} disabled={saving}
            className="w-full bg-[#E8740C] text-white py-4 rounded-full font-bold text-base hover:bg-[#d06a0a] disabled:opacity-50 transition shadow-lg">
            {saving ? '保存中...' : 'カルテを保存する'}
          </button>

          <p className="text-center text-xs text-gray-400">いつでも更新できます。全項目の入力は不要です。</p>
        </div>
      </div>
    </div>
  )
}
