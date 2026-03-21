'use client';

import { useState } from 'react';

type BackupStatus = '完了' | '進行中' | '失敗';
type BackupType = '自動' | '手動';

type BackupEntry = {
  id: number;
  date: string;
  type: BackupType;
  scope: string;
  size: string;
  status: BackupStatus;
};

const STATUS_COLORS: Record<BackupStatus, string> = {
  '完了': 'bg-green-100 text-green-700',
  '進行中': 'bg-blue-100 text-blue-700',
  '失敗': 'bg-red-100 text-red-600',
};

const MOCK_BACKUPS: BackupEntry[] = [
  { id: 1, date: '2026-03-21 03:00', type: '自動', scope: '全体', size: '1.8 GB', status: '完了' },
  { id: 2, date: '2026-03-20 15:30', type: '手動', scope: 'コンテンツのみ', size: '420 MB', status: '完了' },
  { id: 3, date: '2026-03-20 03:00', type: '自動', scope: '全体', size: '1.8 GB', status: '完了' },
  { id: 4, date: '2026-03-19 03:00', type: '自動', scope: '全体', size: '1.7 GB', status: '完了' },
  { id: 5, date: '2026-03-18 10:22', type: '手動', scope: '設定のみ', size: '12 MB', status: '完了' },
  { id: 6, date: '2026-03-18 03:00', type: '自動', scope: '全体', size: '1.7 GB', status: '失敗' },
  { id: 7, date: '2026-03-17 03:00', type: '自動', scope: '全体', size: '1.7 GB', status: '完了' },
  { id: 8, date: '2026-03-16 14:15', type: '手動', scope: 'メディアのみ', size: '2.1 GB', status: '完了' },
  { id: 9, date: '2026-03-16 03:00', type: '自動', scope: '全体', size: '1.6 GB', status: '完了' },
  { id: 10, date: '2026-03-15 03:00', type: '自動', scope: '全体', size: '1.6 GB', status: '完了' },
];

const DB_STATS = [
  { table: 'properties', records: 257, size: '45 MB' },
  { table: 'articles', records: 128, size: '22 MB' },
  { table: 'events', records: 64, size: '8 MB' },
  { table: 'reviews', records: 89, size: '12 MB' },
  { table: 'builders', records: 42, size: '6 MB' },
  { table: 'media_files', records: 1234, size: '2.1 GB' },
  { table: 'users', records: 5, size: '1 MB' },
  { table: 'settings', records: 48, size: '256 KB' },
  { table: 'audit_logs', records: 12450, size: '85 MB' },
];

export default function BackupPage() {
  const [backupScope, setBackupScope] = useState('全体');
  const [frequency, setFrequency] = useState('毎日');
  const [retention, setRetention] = useState('30日');
  const [notifyEmail, setNotifyEmail] = useState('admin@payhome.jp');
  const [exportTypes, setExportTypes] = useState<Set<string>>(new Set(['properties', 'articles']));
  const [exportFormat, setExportFormat] = useState('JSON');
  const [dragOver, setDragOver] = useState(false);
  const [creating, setCreating] = useState(false);
  const [saved, setSaved] = useState(false);

  const CLS = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]';

  const toggleExportType = (t: string) => {
    setExportTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });
  };

  const handleCreate = () => {
    setCreating(true);
    setTimeout(() => setCreating(false), 2000);
  };

  const handleSaveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const totalRecords = DB_STATS.reduce((sum, t) => sum + t.records, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">バックアップ・データ管理</h1>
          <p className="text-sm text-gray-500 mt-1">データのバックアップ、エクスポート、インポートを管理</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">最終バックアップ</p>
          <p className="text-sm font-bold text-gray-900 mt-1">2026-03-21 03:00</p>
          <p className="text-xs text-green-500 mt-0.5">正常完了</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">バックアップ数</p>
          <p className="text-2xl font-bold text-gray-900">{MOCK_BACKUPS.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">総レコード数</p>
          <p className="text-2xl font-bold text-gray-900">{totalRecords.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">総ストレージ</p>
          <p className="text-2xl font-bold text-gray-900">2.4 GB</p>
        </div>
      </div>

      {/* Create Backup */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4">手動バックアップ作成</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">バックアップ範囲</label>
            <select value={backupScope} onChange={(e) => setBackupScope(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30">
              <option>全体</option>
              <option>コンテンツのみ</option>
              <option>設定のみ</option>
              <option>メディアのみ</option>
            </select>
          </div>
          <button onClick={handleCreate} disabled={creating}
            className="bg-[#E8740C] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#d4680b] transition cursor-pointer disabled:opacity-50">
            {creating ? 'バックアップ中...' : 'バックアップを作成'}
          </button>
        </div>
      </div>

      {/* Backup History */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">バックアップ履歴</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">日時</th>
                <th className="px-4 py-3 font-medium text-gray-500">タイプ</th>
                <th className="px-4 py-3 font-medium text-gray-500">範囲</th>
                <th className="px-4 py-3 font-medium text-gray-500">サイズ</th>
                <th className="px-4 py-3 font-medium text-gray-500">ステータス</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">アクション</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_BACKUPS.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs whitespace-nowrap">{b.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${b.type === '自動' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                      {b.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{b.scope}</td>
                  <td className="px-4 py-3 text-gray-600">{b.size}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      {b.status === '完了' && (
                        <button className="text-[#E8740C] hover:text-[#d4680b] text-xs font-medium cursor-pointer">
                          ダウンロード
                        </button>
                      )}
                      <button className="text-red-400 hover:text-red-600 text-xs font-medium cursor-pointer">
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto-backup Settings */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900">自動バックアップ設定</h2>
          <button onClick={handleSaveSettings}
            className="bg-[#E8740C] text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-[#d4680b] transition cursor-pointer">
            {saved ? '保存しました' : '設定を保存'}
          </button>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">バックアップ頻度</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={CLS}>
              <option>毎日</option>
              <option>毎週</option>
              <option>毎月</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">保持期間</label>
            <select value={retention} onChange={(e) => setRetention(e.target.value)} className={CLS}>
              <option>7日</option>
              <option>14日</option>
              <option>30日</option>
              <option>90日</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">通知メールアドレス</label>
            <input type="email" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} className={CLS} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Data Export */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4">データエクスポート</h2>
          <div className="space-y-3 mb-4">
            <label className="block text-xs text-gray-500">エクスポートするコンテンツタイプ</label>
            <div className="grid grid-cols-2 gap-2">
              {['properties', 'articles', 'events', 'reviews', 'builders', 'news', 'webinars', 'settings'].map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={exportTypes.has(t)} onChange={() => toggleExportType(t)}
                    className="w-4 h-4 accent-[#E8740C] cursor-pointer" />
                  <span className="text-sm text-gray-700">{t}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">フォーマット</label>
              <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30">
                <option>JSON</option>
                <option>CSV</option>
              </select>
            </div>
            <button className="bg-[#E8740C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#d4680b] transition cursor-pointer">
              エクスポート
            </button>
          </div>
        </div>

        {/* Data Import */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4">データインポート</h2>
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center mb-4 transition-colors cursor-pointer ${dragOver ? 'border-[#E8740C] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
          >
            <div className="text-3xl mb-2">📥</div>
            <p className="text-sm text-gray-700">JSON または CSV ファイルをドロップ</p>
            <p className="text-xs text-gray-400 mt-1">またはクリックしてファイルを選択</p>
          </div>
          <button disabled className="w-full bg-gray-100 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
            ファイルを選択してください
          </button>
        </div>
      </div>

      {/* Database Stats */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900">データベース統計</h2>
            <p className="text-xs text-gray-400 mt-0.5">最終最適化: 2026-03-20 03:15</p>
          </div>
          <button className="text-[#E8740C] text-xs font-medium hover:underline cursor-pointer">最適化を実行</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">テーブル</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">レコード数</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">サイズ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DB_STATS.map((t) => (
                <tr key={t.table} className="hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{t.table}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium text-right">{t.records.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600 text-right">{t.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
