'use client';

import { useState } from 'react';

type MediaItem = {
  id: number;
  filename: string;
  type: '画像' | '動画' | 'PDF';
  size: string;
  sizeBytes: number;
  uploadDate: string;
  usedIn: string;
  color: string;
  icon: string;
  width?: number;
  height?: number;
};

const MOCK_MEDIA: MediaItem[] = [
  { id: 1, filename: 'hero-banner-spring.jpg', type: '画像', size: '2.4 MB', sizeBytes: 2516582, uploadDate: '2026-03-20', usedIn: 'トップページ', color: 'bg-orange-200', icon: '🏠', width: 1920, height: 1080 },
  { id: 2, filename: 'house-exterior-01.jpg', type: '画像', size: '1.8 MB', sizeBytes: 1887437, uploadDate: '2026-03-18', usedIn: '動画コンテンツ', color: 'bg-blue-200', icon: '🏡', width: 1600, height: 1200 },
  { id: 3, filename: 'interview-tanaka.mp4', type: '動画', size: '45.2 MB', sizeBytes: 47395635, uploadDate: '2026-03-17', usedIn: '取材レポート', color: 'bg-purple-200', icon: '🎥' },
  { id: 4, filename: 'floor-plan-a.pdf', type: 'PDF', size: '820 KB', sizeBytes: 839680, uploadDate: '2026-03-16', usedIn: '工務店ページ', color: 'bg-red-200', icon: '📄' },
  { id: 5, filename: 'kitchen-modern.jpg', type: '画像', size: '3.1 MB', sizeBytes: 3250586, uploadDate: '2026-03-15', usedIn: 'お役立ち記事', color: 'bg-green-200', icon: '🍳', width: 2048, height: 1365 },
  { id: 6, filename: 'webinar-thumbnail.jpg', type: '画像', size: '540 KB', sizeBytes: 552960, uploadDate: '2026-03-14', usedIn: 'ウェビナー', color: 'bg-indigo-200', icon: '🎓', width: 1280, height: 720 },
  { id: 7, filename: 'company-brochure.pdf', type: 'PDF', size: '4.5 MB', sizeBytes: 4718592, uploadDate: '2026-03-13', usedIn: '未使用', color: 'bg-yellow-200', icon: '📋' },
  { id: 8, filename: 'customer-review-sato.mp4', type: '動画', size: '28.7 MB', sizeBytes: 30093107, uploadDate: '2026-03-12', usedIn: 'お客様の声', color: 'bg-pink-200', icon: '🎬' },
  { id: 9, filename: 'bathroom-renovation.jpg', type: '画像', size: '2.0 MB', sizeBytes: 2097152, uploadDate: '2026-03-11', usedIn: 'お役立ち記事', color: 'bg-teal-200', icon: '🛁', width: 1600, height: 1067 },
  { id: 10, filename: 'event-poster-yokohama.jpg', type: '画像', size: '1.2 MB', sizeBytes: 1258291, uploadDate: '2026-03-10', usedIn: 'イベント', color: 'bg-amber-200', icon: '📅', width: 1080, height: 1350 },
  { id: 11, filename: 'solar-panel-guide.pdf', type: 'PDF', size: '1.7 MB', sizeBytes: 1782579, uploadDate: '2026-03-09', usedIn: 'お役立ち記事', color: 'bg-cyan-200', icon: '☀️' },
  { id: 12, filename: 'logo-payhome.svg', type: '画像', size: '24 KB', sizeBytes: 24576, uploadDate: '2026-03-08', usedIn: '全ページ共通', color: 'bg-orange-100', icon: '🏷️', width: 200, height: 60 },
  { id: 13, filename: 'staff-photo-group.jpg', type: '画像', size: '3.8 MB', sizeBytes: 3984589, uploadDate: '2026-03-07', usedIn: '会社概要', color: 'bg-rose-200', icon: '👥', width: 2400, height: 1600 },
  { id: 14, filename: 'construction-timelapse.mp4', type: '動画', size: '120 MB', sizeBytes: 125829120, uploadDate: '2026-03-05', usedIn: '動画コンテンツ', color: 'bg-slate-200', icon: '🏗️' },
];

const TYPE_ICON: Record<string, string> = { '画像': '🖼️', '動画': '🎬', 'PDF': '📄' };
const STORAGE_USED = 2.4;
const STORAGE_TOTAL = 10;

export default function MediaPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('すべて');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const filtered = MOCK_MEDIA.filter((m) => {
    if (search && !m.filename.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== 'すべて' && m.type !== filterType) return false;
    return true;
  });

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const storagePercent = (STORAGE_USED / STORAGE_TOTAL) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">メディアライブラリ</h1>
          <p className="text-sm text-gray-500 mt-1">アップロード済みファイルの管理</p>
        </div>
        {selected.size > 0 && (
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition cursor-pointer">
            {selected.size}件を削除
          </button>
        )}
      </div>

      {/* Storage Stats */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">使用量: {STORAGE_USED} GB / {STORAGE_TOTAL} GB</span>
          <span className="text-xs text-gray-400">{storagePercent.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div className="bg-[#E8740C] h-2.5 rounded-full transition-all" style={{ width: `${storagePercent}%` }} />
        </div>
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <span>画像: {MOCK_MEDIA.filter((m) => m.type === '画像').length}件</span>
          <span>動画: {MOCK_MEDIA.filter((m) => m.type === '動画').length}件</span>
          <span>PDF: {MOCK_MEDIA.filter((m) => m.type === 'PDF').length}件</span>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-colors cursor-pointer ${dragOver ? 'border-[#E8740C] bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
      >
        <div className="text-4xl mb-2">📤</div>
        <p className="text-sm font-medium text-gray-700">ファイルをドラッグ&ドロップ</p>
        <p className="text-xs text-gray-400 mt-1">または クリックしてファイルを選択（JPEG, PNG, MP4, PDF 対応）</p>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input type="text" placeholder="ファイル名で検索..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30" />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30">
          <option value="すべて">すべてのタイプ</option>
          <option value="画像">画像</option>
          <option value="動画">動画</option>
          <option value="PDF">PDF</option>
        </select>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button onClick={() => setViewMode('grid')}
            className={`px-3 py-2 text-sm cursor-pointer transition ${viewMode === 'grid' ? 'bg-[#E8740C] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            グリッド
          </button>
          <button onClick={() => setViewMode('list')}
            className={`px-3 py-2 text-sm cursor-pointer transition ${viewMode === 'list' ? 'bg-[#E8740C] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            リスト
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <div key={item.id}
                  className={`bg-white rounded-xl border overflow-hidden cursor-pointer transition hover:shadow-md ${selected.has(item.id) ? 'border-[#E8740C] ring-2 ring-[#E8740C]/20' : 'border-gray-100'}`}
                  onClick={() => setDetailItem(item)}>
                  <div className={`aspect-square ${item.color} flex items-center justify-center text-4xl relative`}>
                    <span>{item.icon}</span>
                    <input type="checkbox" checked={selected.has(item.id)}
                      onChange={(e) => { e.stopPropagation(); toggleSelect(item.id); }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-2 left-2 w-4 h-4 cursor-pointer accent-[#E8740C]" />
                    <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {TYPE_ICON[item.type]} {item.type}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-900 truncate">{item.filename}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.size} / {item.uploadDate}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 w-8"><input type="checkbox" className="accent-[#E8740C] cursor-pointer" /></th>
                    <th className="px-4 py-3 font-medium text-gray-500">ファイル名</th>
                    <th className="px-4 py-3 font-medium text-gray-500">タイプ</th>
                    <th className="px-4 py-3 font-medium text-gray-500">サイズ</th>
                    <th className="px-4 py-3 font-medium text-gray-500">アップロード日</th>
                    <th className="px-4 py-3 font-medium text-gray-500">使用先</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 cursor-pointer transition" onClick={() => setDetailItem(item)}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.has(item.id)}
                          onChange={() => toggleSelect(item.id)} onClick={(e) => e.stopPropagation()}
                          className="accent-[#E8740C] cursor-pointer" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-8 h-8 ${item.color} rounded flex items-center justify-center text-sm`}>{item.icon}</span>
                          <span className="text-gray-900 font-medium">{item.filename}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{item.type}</td>
                      <td className="px-4 py-3 text-gray-600">{item.size}</td>
                      <td className="px-4 py-3 text-gray-600">{item.uploadDate}</td>
                      <td className="px-4 py-3 text-gray-500">{item.usedIn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {detailItem && (
          <div className="w-72 flex-shrink-0 bg-white rounded-xl border border-gray-100 p-5 h-fit sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">ファイル詳細</h3>
              <button onClick={() => setDetailItem(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">&times;</button>
            </div>
            <div className={`aspect-video ${detailItem.color} rounded-lg flex items-center justify-center text-5xl mb-4`}>
              {detailItem.icon}
            </div>
            <div className="space-y-3 text-sm">
              <div><p className="text-xs text-gray-400">ファイル名</p><p className="text-gray-900 font-medium break-all">{detailItem.filename}</p></div>
              <div><p className="text-xs text-gray-400">タイプ</p><p className="text-gray-700">{detailItem.type}</p></div>
              <div><p className="text-xs text-gray-400">サイズ</p><p className="text-gray-700">{detailItem.size}</p></div>
              {detailItem.width && <div><p className="text-xs text-gray-400">寸法</p><p className="text-gray-700">{detailItem.width} x {detailItem.height}px</p></div>}
              <div><p className="text-xs text-gray-400">アップロード日</p><p className="text-gray-700">{detailItem.uploadDate}</p></div>
              <div><p className="text-xs text-gray-400">使用先</p><p className="text-gray-700">{detailItem.usedIn}</p></div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 bg-[#E8740C] text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-[#d4680b] transition cursor-pointer">
                ダウンロード
              </button>
              <button className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-100 transition cursor-pointer">
                削除
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
