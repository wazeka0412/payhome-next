'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCurrentBuilder } from '@/lib/use-current-builder'
import type { BuilderData } from '@/lib/builders-data'

const PRICE_BANDS: Array<{ value: BuilderData['priceBand']; label: string }> = [
  { value: 'low', label: 'ローコスト' },
  { value: 'mid', label: '標準' },
  { value: 'high', label: '高級' },
  { value: 'premium', label: 'プレミアム' },
]

type Form = {
  name: string
  catchphrase: string
  area: string
  region: string
  serviceCities: string
  phone: string
  website: string
  established: string
  description: string
  specialties: string
  suitableFor: string
  annualBuilds: string
  priceBand: BuilderData['priceBand'] | ''
  pricePerTsuboMin: string
  pricePerTsuboMax: string
  construction: string
  insulationGrade: string
  earthquakeGrade: string
  warranty: string
  featuredVideoIds: string
  strength1Title: string
  strength1Desc: string
  strength2Title: string
  strength2Desc: string
  strength3Title: string
  strength3Desc: string
}

function toForm(b: BuilderData | null): Form {
  if (!b) {
    return {
      name: '',
      catchphrase: '',
      area: '',
      region: '',
      serviceCities: '',
      phone: '',
      website: '',
      established: '',
      description: '',
      specialties: '',
      suitableFor: '',
      annualBuilds: '',
      priceBand: '',
      pricePerTsuboMin: '',
      pricePerTsuboMax: '',
      construction: '',
      insulationGrade: '',
      earthquakeGrade: '',
      warranty: '',
      featuredVideoIds: '',
      strength1Title: '',
      strength1Desc: '',
      strength2Title: '',
      strength2Desc: '',
      strength3Title: '',
      strength3Desc: '',
    }
  }
  return {
    name: b.name ?? '',
    catchphrase: b.catchphrase ?? '',
    area: b.area ?? '',
    region: b.region ?? '',
    serviceCities: (b.serviceCities ?? []).join(', '),
    phone: b.phone ?? '',
    website: b.website ?? '',
    established: String(b.established ?? ''),
    description: b.description ?? '',
    specialties: (b.specialties ?? []).join(', '),
    suitableFor: (b.suitableFor ?? []).join(', '),
    annualBuilds: String(b.annualBuilds ?? ''),
    priceBand: (b.priceBand ?? '') as Form['priceBand'],
    pricePerTsuboMin: String(b.pricePerTsubo?.min ?? ''),
    pricePerTsuboMax: String(b.pricePerTsubo?.max ?? ''),
    construction: b.construction ?? '',
    insulationGrade: b.insulationGrade ?? '',
    earthquakeGrade: b.earthquakeGrade ?? '',
    warranty: b.warranty ?? '',
    featuredVideoIds: (b.featuredVideoIds ?? []).join(', '),
    strength1Title: b.strengths?.[0]?.title ?? '',
    strength1Desc: b.strengths?.[0]?.description ?? '',
    strength2Title: b.strengths?.[1]?.title ?? '',
    strength2Desc: b.strengths?.[1]?.description ?? '',
    strength3Title: b.strengths?.[2]?.title ?? '',
    strength3Desc: b.strengths?.[2]?.description ?? '',
  }
}

function toPatch(f: Form): Partial<BuilderData> {
  return {
    name: f.name,
    catchphrase: f.catchphrase,
    area: f.area,
    region: f.region,
    serviceCities: f.serviceCities.split(',').map((s) => s.trim()).filter(Boolean),
    phone: f.phone,
    website: f.website,
    established: Number(f.established) || undefined,
    description: f.description,
    specialties: f.specialties.split(',').map((s) => s.trim()).filter(Boolean),
    suitableFor: f.suitableFor.split(',').map((s) => s.trim()).filter(Boolean),
    annualBuilds: Number(f.annualBuilds) || 0,
    priceBand: (f.priceBand || undefined) as BuilderData['priceBand'] | undefined,
    pricePerTsubo: {
      min: Number(f.pricePerTsuboMin) || 0,
      max: Number(f.pricePerTsuboMax) || 0,
    },
    construction: f.construction,
    insulationGrade: f.insulationGrade,
    earthquakeGrade: f.earthquakeGrade,
    warranty: f.warranty,
    featuredVideoIds: f.featuredVideoIds.split(',').map((s) => s.trim()).filter(Boolean),
    strengths: [
      { title: f.strength1Title, description: f.strength1Desc },
      { title: f.strength2Title, description: f.strength2Desc },
      { title: f.strength3Title, description: f.strength3Desc },
    ].filter((s) => s.title || s.description),
  }
}

export default function ProfilePage() {
  const builder = useCurrentBuilder()
  const [form, setForm] = useState<Form>(toForm(null))
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (builder.data) setForm(toForm(builder.data))
  }, [builder.data])

  const update = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    if (!builder.id) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/builders/${encodeURIComponent(builder.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toPatch(form)),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const Field = ({
    label,
    children,
    hint,
    full,
  }: {
    label: string
    children: React.ReactNode
    hint?: string
    full?: boolean
  }) => (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  )

  const input = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E8740C] focus:ring-1 focus:ring-[#E8740C]'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">掲載情報</h1>
          <p className="text-xs text-gray-500 mt-1">ID: {builder.id} — 公開ページに反映されます</p>
        </div>
        <Link
          href={`/builders/${builder.id}`}
          target="_blank"
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          プレビュー
        </Link>
      </div>

      {saved && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-sm text-green-700 font-medium">
          <span className="text-green-500">✓</span>
          保存しました
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          保存に失敗しました: {error}
        </div>
      )}

      {/* 会社基本情報 */}
      <section className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4">会社基本情報</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="会社名">
            <input value={form.name} onChange={(e) => update('name', e.target.value)} className={input} />
          </Field>
          <Field label="設立年" hint="例: 1976">
            <input value={form.established} onChange={(e) => update('established', e.target.value)} className={input} />
          </Field>
          <Field label="キャッチコピー" full>
            <input value={form.catchphrase} onChange={(e) => update('catchphrase', e.target.value)} className={input} placeholder="鹿児島で年間120棟の実績。平屋に強いエリアNo.1" />
          </Field>
          <Field label="会社紹介" full>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} className={`${input} resize-y`} />
          </Field>
          <Field label="都道府県">
            <input value={form.area} onChange={(e) => update('area', e.target.value)} className={input} placeholder="鹿児島県" />
          </Field>
          <Field label="拠点市区町村">
            <input value={form.region} onChange={(e) => update('region', e.target.value)} className={input} placeholder="鹿児島市" />
          </Field>
          <Field label="対応市町村（カンマ区切り）" full>
            <input value={form.serviceCities} onChange={(e) => update('serviceCities', e.target.value)} className={input} placeholder="鹿児島市, 姶良市, 霧島市" />
          </Field>
          <Field label="電話番号">
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className={input} />
          </Field>
          <Field label="WebサイトURL">
            <input value={form.website} onChange={(e) => update('website', e.target.value)} className={input} />
          </Field>
        </div>
      </section>

      {/* 規模・価格帯 */}
      <section className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4">規模・価格帯</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="年間施工棟数">
            <input type="number" value={form.annualBuilds} onChange={(e) => update('annualBuilds', e.target.value)} className={input} />
          </Field>
          <Field label="価格帯">
            <select value={form.priceBand} onChange={(e) => update('priceBand', e.target.value as Form['priceBand'])} className={input}>
              <option value="">—</option>
              {PRICE_BANDS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </Field>
          <Field label="坪単価 下限（万円）">
            <input type="number" value={form.pricePerTsuboMin} onChange={(e) => update('pricePerTsuboMin', e.target.value)} className={input} />
          </Field>
          <Field label="坪単価 上限（万円）">
            <input type="number" value={form.pricePerTsuboMax} onChange={(e) => update('pricePerTsuboMax', e.target.value)} className={input} />
          </Field>
        </div>
      </section>

      {/* 特徴・強み */}
      <section className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4">特徴・強み</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="特徴タグ（カンマ区切り）" hint="AI診断のマッチング条件になります" full>
            <input value={form.specialties} onChange={(e) => update('specialties', e.target.value)} className={input} placeholder="平屋, ZEH, 自然素材, 子育て" />
          </Field>
          <Field label="得意な家族構成（カンマ区切り）" full>
            <input value={form.suitableFor} onChange={(e) => update('suitableFor', e.target.value)} className={input} placeholder="子育て世帯, シニア夫婦, 二世帯住宅" />
          </Field>
        </div>
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-3">
              <Field label={`強み${n}：タイトル`}>
                <input
                  value={form[`strength${n}Title` as keyof Form] as string}
                  onChange={(e) => update(`strength${n}Title` as keyof Form, e.target.value as never)}
                  className={input}
                />
              </Field>
              <Field label="説明">
                <input
                  value={form[`strength${n}Desc` as keyof Form] as string}
                  onChange={(e) => update(`strength${n}Desc` as keyof Form, e.target.value as never)}
                  className={input}
                />
              </Field>
            </div>
          ))}
        </div>
      </section>

      {/* 性能・保証 */}
      <section className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4">性能・保証</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="構造・工法">
            <input value={form.construction} onChange={(e) => update('construction', e.target.value)} className={input} placeholder="木造軸組工法" />
          </Field>
          <Field label="断熱等級">
            <input value={form.insulationGrade} onChange={(e) => update('insulationGrade', e.target.value)} className={input} placeholder="UA値 0.46（等級6相当）" />
          </Field>
          <Field label="耐震等級">
            <input value={form.earthquakeGrade} onChange={(e) => update('earthquakeGrade', e.target.value)} className={input} placeholder="耐震等級3（最高等級）" />
          </Field>
          <Field label="保証・アフター">
            <input value={form.warranty} onChange={(e) => update('warranty', e.target.value)} className={input} placeholder="構造躯体30年保証 / 60年定期点検" />
          </Field>
        </div>
      </section>

      {/* 代表動画 */}
      <section className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4">代表的なルームツアー動画</h2>
        <Field label="動画ID（カンマ区切り）" hint="/dashboard/builder/videos で管理している動画IDを指定します">
          <input value={form.featuredVideoIds} onChange={(e) => update('featuredVideoIds', e.target.value)} className={input} placeholder="11, 17, 23" />
        </Field>
      </section>

      <button
        onClick={handleSave}
        disabled={saving || !builder.id}
        className="w-full bg-[#E8740C] text-white font-bold py-3 rounded-xl hover:bg-[#D4660A] transition disabled:opacity-50"
      >
        {saving ? '保存中...' : '保存する'}
      </button>
    </div>
  )
}
