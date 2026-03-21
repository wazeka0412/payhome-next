'use client';

import { useState } from 'react';

type TableStat = { name: string; rows: number; size: string; lastUpdated: string; indexes: number };
type Migration = { id: string; name: string; date: string; description: string };

const tableStats: TableStat[] = [
  { name: 'leads', rows: 1842, size: '245 MB', lastUpdated: '2026-03-21 09:12', indexes: 5 },
  { name: 'builders', rows: 156, size: '82 MB', lastUpdated: '2026-03-21 07:50', indexes: 3 },
  { name: 'events', rows: 423, size: '120 MB', lastUpdated: '2026-03-20 16:30', indexes: 4 },
  { name: 'users', rows: 312, size: '18 MB', lastUpdated: '2026-03-21 09:15', indexes: 3 },
  { name: 'sessions', rows: 8540, size: '156 MB', lastUpdated: '2026-03-21 09:15', indexes: 2 },
];

const migrations: Migration[] = [
  { id: 'M007', name: '20260318_add_lead_scoring', date: '2026-03-18', description: 'リードスコアリングカラム追加' },
  { id: 'M006', name: '20260310_builder_verification', date: '2026-03-10', description: '工務店認証フィールド追加' },
  { id: 'M005', name: '20260301_event_capacity', date: '2026-03-01', description: 'イベント定員管理テーブル追加' },
  { id: 'M004', name: '20260220_session_device_info', date: '2026-02-20', description: 'セッションにデバイス情報カラム追加' },
  { id: 'M003', name: '20260210_lead_source_tracking', date: '2026-02-10', description: 'リード流入元トラッキング拡張' },
  { id: 'M002', name: '20260201_notification_preferences', date: '2026-02-01', description: '通知設定テーブル追加' },
  { id: 'M001', name: '20260115_initial_schema', date: '2026-01-15', description: '初期スキーマ作成' },
];

export default function DataPage() {
  const [exportTables, setExportTables] = useState<Set<string>>(new Set());
  const [exportFormat, setExportFormat] = useState('JSON');
  const [exportDateFrom, setExportDateFrom] = useState('2026-03-01');
  const [exportDateTo, setExportDateTo] = useState('2026-03-21');
  const [importTable, setImportTable] = useState('leads');
  const [importDryRun, setImportDryRun] = useState(true);
  const [importFile, setImportFile] = useState<string | null>(null);
  const [retentionMonths, setRetentionMonths] = useState(12);
  const [retentionEnabled, setRetentionEnabled] = useState(false);
  const [integrityResult, setIntegrityResult] = useState<string | null>(null);
  const [cleanupResult, setCleanupResult] = useState<string | null>(null);

  const totalLeads = 1842;
  const totalBuilders = 156;
  const totalEvents = 423;
  const totalUsers = 312;
  const dbSize = '621 MB';

  const toggleExportTable = (name: string) => {
    const next = new Set(exportTables);
    next.has(name) ? next.delete(name) : next.add(name);
    setExportTables(next);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">データ管理</h1>
        <p className="text-sm text-gray-500 mt-1">データベースの管理・エクスポート・メンテナンス</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {[
          { label: 'リード数', value: totalLeads.toLocaleString() },
          { label: '工務店数', value: totalBuilders },
          { label: 'イベント数', value: totalEvents },
          { label: 'ユーザー数', value: totalUsers },
          { label: 'DBサイズ', value: dbSize },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Table Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">テーブル統計</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="py-3 px-4 text-left text-gray-500 font-medium">テーブル名</th>
                <th className="py-3 px-4 text-right text-gray-500 font-medium">行数</th>
                <th className="py-3 px-4 text-right text-gray-500 font-medium">サイズ</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">最終更新</th>
                <th className="py-3 px-4 text-right text-gray-500 font-medium">インデックス数</th>
              </tr>
            </thead>
            <tbody>
              {tableStats.map(t => (
                <tr key={t.name} className="border-b border-gray-50 hover:bg-orange-50/50">
                  <td className="py-3 px-4"><code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{t.name}</code></td>
                  <td className="py-3 px-4 text-right text-gray-700">{t.rows.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-gray-700">{t.size}</td>
                  <td className="py-3 px-4 text-gray-500">{t.lastUpdated}</td>
                  <td className="py-3 px-4 text-right text-gray-700">{t.indexes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Export */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">データエクスポート</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">テーブル選択</label>
              <div className="flex flex-wrap gap-2">
                {tableStats.map(t => (
                  <button key={t.name} onClick={() => toggleExportTable(t.name)} className={`px-3 py-1.5 rounded-lg text-sm border transition ${exportTables.has(t.name) ? 'bg-[#E8740C] text-white border-[#E8740C]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#E8740C]'}`}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">形式</label>
                <select value={exportFormat} onChange={e => setExportFormat(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                  <option>JSON</option>
                  <option>CSV</option>
                  <option>SQL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">開始日</label>
                <input type="date" value={exportDateFrom} onChange={e => setExportDateFrom(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">終了日</label>
                <input type="date" value={exportDateTo} onChange={e => setExportDateTo(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
              </div>
            </div>
            <button disabled={exportTables.size === 0} className="w-full px-4 py-2 bg-[#E8740C] text-white rounded-lg text-sm font-medium hover:bg-[#d06a0b] disabled:opacity-50 disabled:cursor-not-allowed transition">ダウンロード</button>
          </div>
        </div>

        {/* Data Import */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">データインポート</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">対象テーブル</label>
              <select value={importTable} onChange={e => setImportTable(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                {tableStats.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">ファイルアップロード</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-400">{importFile || 'JSON/CSVファイルをドラッグ&ドロップ'}</p>
                <button onClick={() => setImportFile('data_import_20260321.csv')} className="mt-2 text-sm text-[#E8740C] font-medium hover:underline">ファイルを選択</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={importDryRun} onChange={e => setImportDryRun(e.target.checked)} className="accent-[#E8740C]" />
                ドライラン (プレビューのみ)
              </label>
            </div>
            <button disabled={!importFile} className="w-full px-4 py-2 bg-[#E8740C] text-white rounded-lg text-sm font-medium hover:bg-[#d06a0b] disabled:opacity-50 disabled:cursor-not-allowed transition">
              {importDryRun ? 'プレビュー実行' : 'インポート実行'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Cleanup */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">データクリーンアップ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-500">孤立レコード</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">7件</p>
            <button onClick={() => setCleanupResult('7件の孤立レコードを削除しました')} className="mt-2 text-sm text-[#E8740C] font-medium hover:underline">クリーンアップ</button>
          </div>
          <div className="border border-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-500">重複チェック</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">0件</p>
            <button className="mt-2 text-sm text-[#E8740C] font-medium hover:underline">再チェック</button>
          </div>
          <div className="border border-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-500">整合性チェック</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{integrityResult || '未実行'}</p>
            <button onClick={() => setIntegrityResult('問題なし')} className="mt-2 text-sm text-[#E8740C] font-medium hover:underline">チェック実行</button>
          </div>
        </div>
        {cleanupResult && <p className="mt-3 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">{cleanupResult}</p>}
      </div>

      {/* Database Maintenance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">データベースメンテナンス</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">最終VACUUM実行</span>
              <span className="text-sm font-medium text-gray-900">2026-03-20 03:00</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">最終ANALYZE実行</span>
              <span className="text-sm font-medium text-gray-900">2026-03-21 03:00</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">自動メンテナンス</span>
              <span className="text-sm font-medium text-gray-900">毎日 03:00</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 justify-center">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">VACUUM実行</button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">ANALYZE実行</button>
          </div>
        </div>
      </div>

      {/* Data Retention Policy */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">データ保持ポリシー</h2>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => setRetentionEnabled(!retentionEnabled)} className={`w-12 h-6 rounded-full transition ${retentionEnabled ? 'bg-[#E8740C]' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transform transition ${retentionEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
            自動アーカイブ
          </label>
          <div className="flex items-center gap-2">
            <input type="number" value={retentionMonths} onChange={e => setRetentionMonths(+e.target.value)} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center" disabled={!retentionEnabled} />
            <span className="text-sm text-gray-500">ヶ月以上前のリードを自動アーカイブ</span>
          </div>
        </div>
      </div>

      {/* Migration Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">マイグレーション履歴</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="py-3 px-4 text-left text-gray-500 font-medium">ID</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">マイグレーション名</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">適用日</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">説明</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {migrations.map(m => (
                <tr key={m.id} className="border-b border-gray-50">
                  <td className="py-3 px-4 text-gray-500">{m.id}</td>
                  <td className="py-3 px-4"><code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{m.name}</code></td>
                  <td className="py-3 px-4 text-gray-500">{m.date}</td>
                  <td className="py-3 px-4 text-gray-600">{m.description}</td>
                  <td className="py-3 px-4"><span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">適用済</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
