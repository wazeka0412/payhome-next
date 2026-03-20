'use client';

import { useState } from 'react';

type Property = {
  title: string
  price: string
  layout: string
  area: string
  builder: string
  accuracy: string
  published: boolean
}

const initialProperties: Property[] = [
  { title: '鹿児島市吉野町の平屋 3LDK', price: '2,480万円', layout: '3LDK', area: '鹿児島市', builder: '万代ホーム', accuracy: '確定', published: true },
  { title: '霧島市国分の二階建て 4LDK', price: '2,980万円', layout: '4LDK', area: '霧島市', builder: 'ハウスサポート', accuracy: '確定', published: true },
  { title: '姶良市加治木の平屋 2LDK', price: '1,980万円', layout: '2LDK', area: '姶良市', builder: 'ヤマサハウス', accuracy: '概算', published: true },
  { title: '鹿児島市紫原の二階建て 5LDK', price: '3,500万円', layout: '5LDK', area: '鹿児島市', builder: 'ベルハウジング', accuracy: '確定', published: true },
  { title: '薩摩川内市の平屋 3LDK', price: '2,200万円', layout: '3LDK', area: '薩摩川内市', builder: 'タマホーム', accuracy: '概算', published: true },
  { title: '日置市伊集院の二階建て 4LDK', price: '2,750万円', layout: '4LDK', area: '日置市', builder: '七呂建設', accuracy: '確定', published: true },
  { title: '鹿屋市の平屋 2LDK+S', price: '2,100万円', layout: '2LDK+S', area: '鹿屋市', builder: 'スマイルホーム', accuracy: '概算', published: true },
  { title: '指宿市の二階建て 3LDK', price: '2,350万円', layout: '3LDK', area: '指宿市', builder: 'ロイヤルホーム', accuracy: '確定', published: true },
];

export default function PropertiesPage() {
  const [search, setSearch] = useState('');
  const [properties, setProperties] = useState(initialProperties);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProp, setNewProp] = useState({ title: '', price: '', layout: '', area: '', builder: '', accuracy: '概算' });
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const togglePublish = (idx: number) => {
    setProperties(prev => prev.map((p, i) => i === idx ? { ...p, published: !p.published } : p));
  };

  const handleAddProperty = () => {
    if (!newProp.title) return;
    setProperties(prev => [...prev, { ...newProp, published: true }]);
    setNewProp({ title: '', price: '', layout: '', area: '', builder: '', accuracy: '概算' });
    setShowAddForm(false);
  };

  const filtered = search
    ? properties.filter(
        (p) =>
          p.title.includes(search) ||
          p.area.includes(search) ||
          p.builder.includes(search)
      )
    : properties;

  const publishedCount = properties.filter(p => p.published).length;
  const unpublishedCount = properties.filter(p => !p.published).length;
  const estimateCount = properties.filter(p => p.accuracy === '概算').length;
  const confirmedCount = properties.filter(p => p.accuracy === '確定').length;

  const stats = [
    { label: '公開中', value: `${publishedCount}件`, color: 'text-green-600' },
    { label: '非公開', value: `${unpublishedCount}件`, color: 'text-gray-400' },
    { label: '概算データ', value: `${estimateCount}件`, color: 'text-yellow-600' },
    { label: '確定データ', value: `${confirmedCount}件`, color: 'text-[#E8740C]' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">物件データ管理</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="タイトル・エリア・工務店で検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] w-64"
          />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-[#E8740C] text-white rounded-lg text-sm font-medium hover:bg-[#D4660A] transition cursor-pointer"
          >
            新規追加
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-900">新規物件登録</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="タイトル" value={newProp.title} onChange={e => setNewProp(p => ({ ...p, title: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input type="text" placeholder="価格（例: 2,480万円）" value={newProp.price} onChange={e => setNewProp(p => ({ ...p, price: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input type="text" placeholder="間取り（例: 3LDK）" value={newProp.layout} onChange={e => setNewProp(p => ({ ...p, layout: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input type="text" placeholder="エリア" value={newProp.area} onChange={e => setNewProp(p => ({ ...p, area: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input type="text" placeholder="工務店" value={newProp.builder} onChange={e => setNewProp(p => ({ ...p, builder: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <select value={newProp.accuracy} onChange={e => setNewProp(p => ({ ...p, accuracy: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="概算">概算</option>
              <option value="確定">確定</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAddProperty} disabled={!newProp.title} className="px-4 py-2 rounded-lg bg-[#E8740C] text-white text-sm font-bold hover:bg-[#D4660A] transition disabled:opacity-50 cursor-pointer">登録する</button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition cursor-pointer">キャンセル</button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 text-gray-500 font-medium w-12">画像</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">タイトル</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">価格</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">間取り</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">エリア</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">工務店</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">精度</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">公開</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((prop, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 hover:bg-orange-50/50 transition"
                >
                  <td className="py-3 px-4">
                    <div className="w-10 h-10 bg-gray-200 rounded" />
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{prop.title}</td>
                  <td className="py-3 px-4 text-gray-600">{prop.price}</td>
                  <td className="py-3 px-4 text-gray-600">{prop.layout}</td>
                  <td className="py-3 px-4 text-gray-600">{prop.area}</td>
                  <td className="py-3 px-4 text-gray-600">{prop.builder}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        prop.accuracy === '確定'
                          ? 'bg-[#E8740C]/10 text-[#E8740C]'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {prop.accuracy}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => togglePublish(i)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${prop.published ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${prop.published ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setEditIdx(editIdx === i ? null : i)}
                      className="text-xs px-3 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                    >
                      {editIdx === i ? '閉じる' : '編集'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
