'use client';

import { useState } from 'react';
import ContentTable from '@/components/appadmin/ContentTable';
import { properties, type PropertyData } from '@/lib/properties';

type EditMode = 'list' | 'add' | 'edit';

export default function PropertiesAdmin() {
  const [mode, setMode] = useState<EditMode>('list');
  const [editItem, setEditItem] = useState<PropertyData | null>(null);
  const [items, setItems] = useState<PropertyData[]>(properties);

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'title',
      label: 'タイトル',
      render: (v: unknown) => <span className="font-medium text-gray-900 max-w-[200px] truncate block">{String(v)}</span>,
    },
    { key: 'layout', label: '間取り' },
    { key: 'price', label: '価格' },
    { key: 'views', label: '再生数' },
    {
      key: 'builder',
      label: '工務店',
      render: (_: unknown, item: Record<string, unknown>) => {
        const b = item.builder as PropertyData['builder'];
        return b?.name ?? '';
      },
    },
  ];

  const handleDelete = (item: Record<string, unknown>) => {
    setItems((prev) => prev.filter((p) => p.id !== item.id));
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <PropertyForm
        item={editItem}
        onSave={(data) => {
          if (mode === 'edit' && editItem) {
            setItems((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
          } else {
            setItems((prev) => [data as PropertyData, ...prev]);
          }
          setMode('list');
          setEditItem(null);
        }}
        onCancel={() => { setMode('list'); setEditItem(null); }}
      />
    );
  }

  return (
    <ContentTable
      title="動画コンテンツ（物件）管理"
      description="物件詳細ページのコンテンツを管理します"
      columns={columns}
      data={items as unknown as Record<string, unknown>[]}
      onAdd={() => setMode('add')}
      onEdit={(item) => { setEditItem(item as unknown as PropertyData); setMode('edit'); }}
      onDelete={handleDelete}
    />
  );
}

function PropertyForm({
  item,
  onSave,
  onCancel,
}: {
  item: PropertyData | null;
  onSave: (data: Partial<PropertyData>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    id: item?.id ?? '',
    title: item?.title ?? '',
    youtubeId: item?.youtubeId ?? '',
    views: item?.views ?? '',
    price: item?.price ?? '',
    layout: item?.layout ?? '',
    area: item?.area ?? '',
    landArea: item?.landArea ?? '',
    buildingCoverage: item?.buildingCoverage ?? '',
    floorAreaRatio: item?.floorAreaRatio ?? '',
    terrain: item?.terrain ?? '平坦地',
    roadAccess: item?.roadAccess ?? '',
    zoning: item?.zoning ?? '',
    landCategory: item?.landCategory ?? '宅地',
    buildingCondition: item?.buildingCondition ?? 'なし',
    kitchenMaker: item?.kitchen?.maker ?? '',
    kitchenSeries: item?.kitchen?.series ?? '',
    bathMaker: item?.bath?.maker ?? '',
    bathSize: item?.bath?.size ?? '',
    toiletMaker: item?.toilet?.maker ?? '',
    toiletSeries: item?.toilet?.series ?? '',
    insulation: item?.insulation ?? '',
    uaValue: item?.uaValue ?? '',
    earthquake: item?.earthquake ?? '等級3',
    buildingPrice: item?.priceBreakdown?.building ?? '',
    landPrice: item?.priceBreakdown?.land ?? '',
    miscPrice: item?.priceBreakdown?.misc ?? '',
    perTsubo: item?.priceBreakdown?.perTsubo ?? '',
    builderName: item?.builder?.name ?? '',
    builderLocation: item?.builder?.location ?? '',
    builderSpecialty: item?.builder?.specialty ?? '',
    builderDescription: item?.builder?.description ?? '',
    builderPhone: item?.builder?.phone ?? '',
    builderWebsite: item?.builder?.website ?? '',
    builderEstablished: item?.builder?.established ?? '',
    builderServiceArea: item?.builder?.serviceArea ?? '',
    builderFeatures: item?.builder?.features?.join(', ') ?? '',
    points: item?.points?.join('\n') ?? '',
    photos: item?.photos?.join('\n') ?? '',
    memoName: item?.designerMemo?.name ?? '',
    memoRole: item?.designerMemo?.role ?? '',
    memoComment: item?.designerMemo?.comment ?? '',
  });

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: form.id,
      title: form.title,
      youtubeId: form.youtubeId,
      views: form.views,
      price: form.price,
      priceBreakdown: { building: form.buildingPrice, land: form.landPrice, misc: form.miscPrice, perTsubo: form.perTsubo },
      layout: form.layout,
      area: form.area,
      landArea: form.landArea,
      buildingCoverage: form.buildingCoverage,
      floorAreaRatio: form.floorAreaRatio,
      terrain: form.terrain,
      roadAccess: form.roadAccess,
      zoning: form.zoning,
      landCategory: form.landCategory,
      buildingCondition: form.buildingCondition,
      kitchen: { maker: form.kitchenMaker, series: form.kitchenSeries },
      bath: { maker: form.bathMaker, size: form.bathSize },
      toilet: { maker: form.toiletMaker, series: form.toiletSeries },
      insulation: form.insulation,
      uaValue: form.uaValue,
      earthquake: form.earthquake,
      builder: {
        name: form.builderName,
        location: form.builderLocation,
        specialty: form.builderSpecialty,
        description: form.builderDescription,
        phone: form.builderPhone,
        website: form.builderWebsite,
        established: form.builderEstablished,
        serviceArea: form.builderServiceArea,
        features: form.builderFeatures.split(',').map((s) => s.trim()).filter(Boolean),
      },
      points: form.points.split('\n').filter(Boolean),
      photos: form.photos.split('\n').filter(Boolean),
      designerMemo: { name: form.memoName, role: form.memoRole, comment: form.memoComment },
    });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-[#E8740C] cursor-pointer">← 戻る</button>
        <h1 className="text-2xl font-bold text-gray-900">{item ? '物件を編集' : '物件を新規追加'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <FormSection title="基本情報">
          <FormRow label="ID" value={form.id} onChange={(v) => set('id', v)} required />
          <FormRow label="タイトル" value={form.title} onChange={(v) => set('title', v)} required />
          <FormRow label="YouTube ID" value={form.youtubeId} onChange={(v) => set('youtubeId', v)} required />
          <FormRow label="再生回数" value={form.views} onChange={(v) => set('views', v)} placeholder="99万回" />
        </FormSection>

        <FormSection title="価格情報">
          <FormRow label="総額" value={form.price} onChange={(v) => set('price', v)} placeholder="1,980万円" />
          <div className="grid grid-cols-2 gap-4">
            <FormRow label="建物本体" value={form.buildingPrice} onChange={(v) => set('buildingPrice', v)} />
            <FormRow label="土地代" value={form.landPrice} onChange={(v) => set('landPrice', v)} />
            <FormRow label="諸費用" value={form.miscPrice} onChange={(v) => set('miscPrice', v)} />
            <FormRow label="坪単価" value={form.perTsubo} onChange={(v) => set('perTsubo', v)} />
          </div>
        </FormSection>

        <FormSection title="物件スペック">
          <div className="grid grid-cols-2 gap-4">
            <FormRow label="間取り" value={form.layout} onChange={(v) => set('layout', v)} />
            <FormRow label="延床面積" value={form.area} onChange={(v) => set('area', v)} />
            <FormRow label="敷地面積" value={form.landArea} onChange={(v) => set('landArea', v)} />
            <FormRow label="建ぺい率" value={form.buildingCoverage} onChange={(v) => set('buildingCoverage', v)} />
            <FormRow label="容積率" value={form.floorAreaRatio} onChange={(v) => set('floorAreaRatio', v)} />
            <FormRow label="地形" value={form.terrain} onChange={(v) => set('terrain', v)} />
            <FormRow label="接道状況" value={form.roadAccess} onChange={(v) => set('roadAccess', v)} />
            <FormRow label="用途地域" value={form.zoning} onChange={(v) => set('zoning', v)} />
          </div>
        </FormSection>

        <FormSection title="設備情報">
          <div className="grid grid-cols-2 gap-4">
            <FormRow label="キッチンメーカー" value={form.kitchenMaker} onChange={(v) => set('kitchenMaker', v)} />
            <FormRow label="キッチンシリーズ" value={form.kitchenSeries} onChange={(v) => set('kitchenSeries', v)} />
            <FormRow label="バスメーカー" value={form.bathMaker} onChange={(v) => set('bathMaker', v)} />
            <FormRow label="バスサイズ" value={form.bathSize} onChange={(v) => set('bathSize', v)} />
            <FormRow label="トイレメーカー" value={form.toiletMaker} onChange={(v) => set('toiletMaker', v)} />
            <FormRow label="トイレシリーズ" value={form.toiletSeries} onChange={(v) => set('toiletSeries', v)} />
          </div>
        </FormSection>

        <FormSection title="性能">
          <div className="grid grid-cols-3 gap-4">
            <FormRow label="断熱等級" value={form.insulation} onChange={(v) => set('insulation', v)} />
            <FormRow label="UA値" value={form.uaValue} onChange={(v) => set('uaValue', v)} />
            <FormRow label="耐震等級" value={form.earthquake} onChange={(v) => set('earthquake', v)} />
          </div>
        </FormSection>

        <FormSection title="工務店情報">
          <FormRow label="工務店名" value={form.builderName} onChange={(v) => set('builderName', v)} required />
          <FormRow label="所在地" value={form.builderLocation} onChange={(v) => set('builderLocation', v)} />
          <FormRow label="得意分野" value={form.builderSpecialty} onChange={(v) => set('builderSpecialty', v)} />
          <FormRow label="紹介文" value={form.builderDescription} onChange={(v) => set('builderDescription', v)} multiline />
          <div className="grid grid-cols-2 gap-4">
            <FormRow label="電話番号" value={form.builderPhone} onChange={(v) => set('builderPhone', v)} />
            <FormRow label="ウェブサイト" value={form.builderWebsite} onChange={(v) => set('builderWebsite', v)} />
            <FormRow label="創業" value={form.builderEstablished} onChange={(v) => set('builderEstablished', v)} />
            <FormRow label="対応エリア" value={form.builderServiceArea} onChange={(v) => set('builderServiceArea', v)} />
          </div>
          <FormRow label="特徴（カンマ区切り）" value={form.builderFeatures} onChange={(v) => set('builderFeatures', v)} />
        </FormSection>

        <FormSection title="コンテンツ">
          <FormRow label="ポイント（1行1項目）" value={form.points} onChange={(v) => set('points', v)} multiline rows={5} />
          <FormRow label="写真パス（1行1パス）" value={form.photos} onChange={(v) => set('photos', v)} multiline rows={3} />
        </FormSection>

        <FormSection title="担当者メモ">
          <div className="grid grid-cols-2 gap-4">
            <FormRow label="担当者名" value={form.memoName} onChange={(v) => set('memoName', v)} />
            <FormRow label="役職" value={form.memoRole} onChange={(v) => set('memoRole', v)} />
          </div>
          <FormRow label="コメント" value={form.memoComment} onChange={(v) => set('memoComment', v)} multiline rows={3} />
        </FormSection>

        <div className="flex gap-3 pt-4">
          <button type="submit" className="bg-[#E8740C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d4680b] transition cursor-pointer">
            {item ? '更新する' : '追加する'}
          </button>
          <button type="button" onClick={onCancel} className="px-6 py-3 text-gray-600 hover:text-gray-800 cursor-pointer">
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-sm font-bold text-[#E8740C] uppercase tracking-wider mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function FormRow({
  label,
  value,
  onChange,
  required,
  placeholder,
  multiline,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}) {
  const cls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]";
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className={cls + " resize-y"} rows={rows || 3} placeholder={placeholder} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} required={required} placeholder={placeholder} />
      )}
    </div>
  );
}
