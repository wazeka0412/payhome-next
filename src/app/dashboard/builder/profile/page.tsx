'use client'

import { useState } from 'react'

const CASES = [
  { title: '平屋の家 - 徳島市', image: '/images/ogp.png', area: '32坪', cost: '2,400万円' },
  { title: 'ガレージハウス - 鳴門市', image: '/images/ogp.png', area: '38坪', cost: '2,800万円' },
  { title: '二世帯住宅 - 阿南市', image: '/images/ogp.png', area: '45坪', cost: '3,200万円' },
]

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: '万代ホーム',
    address: '徳島県徳島市万代町5-71-4',
    area: '徳島市・鳴門市・小松島市・阿南市',
    specialties: '自然素材, 高気密高断熱, 平屋, ガレージハウス',
    description: '徳島の気候風土に合わせた、自然素材を使った快適な住まいづくりを得意としています。高気密・高断熱の家づくりで、年中快適な暮らしをご提案します。',
    website: 'https://mandai-home.example.com',
  })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handlePreview = () => {
    window.open('/builders', '_blank')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">掲載情報</h1>
        <button
          onClick={handlePreview}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
        >
          プレビュー
        </button>
      </div>

      {/* Save confirmation toast */}
      {saved && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-sm text-green-700 font-medium animate-fade-in">
          <span className="text-green-500">&#10003;</span>
          保存しました
        </div>
      )}

      {/* Company Form */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4">会社情報</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">会社名</label>
            <input value={form.name} onChange={e => update('name', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8740C] focus:ring-1 focus:ring-[#E8740C]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">住所</label>
            <input value={form.address} onChange={e => update('address', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8740C] focus:ring-1 focus:ring-[#E8740C]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">対応エリア</label>
            <input value={form.area} onChange={e => update('area', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8740C] focus:ring-1 focus:ring-[#E8740C]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">得意分野（カンマ区切り）</label>
            <input value={form.specialties} onChange={e => update('specialties', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8740C] focus:ring-1 focus:ring-[#E8740C]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">会社紹介</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8740C] focus:ring-1 focus:ring-[#E8740C] resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">WebサイトURL</label>
            <input value={form.website} onChange={e => update('website', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8740C] focus:ring-1 focus:ring-[#E8740C]" />
          </div>
        </div>

        {/* Logo upload */}
        <div className="mt-6">
          <label className="block text-xs font-semibold text-gray-600 mb-2">ロゴ画像</label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#E8740C] transition">
            <p className="text-sm text-gray-400">クリックまたはドラッグ&ドロップでアップロード</p>
            <p className="text-xs text-gray-300 mt-1">PNG, JPG (最大2MB)</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full bg-[#E8740C] text-white font-bold py-3 rounded-xl hover:bg-[#D4660A] transition cursor-pointer disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存する'}
        </button>
      </div>

      {/* Construction cases */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900">施工事例</h2>
          <button className="text-xs px-3 py-1.5 rounded-lg bg-[#E8740C] text-white font-bold hover:bg-[#D4660A] transition cursor-pointer">事例を追加</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CASES.map((c, i) => (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="h-32 bg-gray-100 flex items-center justify-center">
                <span className="text-3xl">{'\u{1F3E0}'}</span>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-800 mb-1">{c.title}</p>
                <p className="text-xs text-gray-500">{c.area} / {c.cost}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
