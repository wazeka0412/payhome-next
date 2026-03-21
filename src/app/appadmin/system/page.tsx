'use client';

import { useState } from 'react';

type HealthStatus = '稼働中' | '警告' | '停止';
const HEALTH_COLORS: Record<HealthStatus, string> = { '稼働中': 'bg-green-400', '警告': 'bg-yellow-400', '停止': 'bg-red-400' };
const HEALTH_TEXT: Record<HealthStatus, string> = { '稼働中': 'text-green-600', '警告': 'text-yellow-600', '停止': 'text-red-600' };

const HEALTH_ITEMS: { name: string; status: HealthStatus; detail: string }[] = [
  { name: 'API サーバー', status: '稼働中', detail: '応答時間: 42ms' },
  { name: 'データベース', status: '稼働中', detail: '接続数: 12/100' },
  { name: 'CDN', status: '稼働中', detail: 'キャッシュヒット率: 94.2%' },
  { name: 'ストレージ', status: '警告', detail: '使用率: 80.3%' },
];

const METRICS = [
  { label: '平均応答時間', value: '42ms', trend: 'down', change: '-8ms' },
  { label: 'ページロード時間', value: '1.2s', trend: 'down', change: '-0.3s' },
  { label: 'キャッシュヒット率', value: '94.2%', trend: 'up', change: '+2.1%' },
  { label: 'エラー率', value: '0.12%', trend: 'down', change: '-0.05%' },
];

const ERRORS = [
  { timestamp: '2026-03-21 14:22:10', code: '500', message: 'Internal Server Error - Database timeout', endpoint: '/api/properties', count: 3 },
  { timestamp: '2026-03-21 13:45:33', code: '404', message: 'Not Found - /api/old-endpoint', endpoint: '/api/old-endpoint', count: 12 },
  { timestamp: '2026-03-21 12:10:08', code: '429', message: 'Rate Limit Exceeded', endpoint: '/api/search', count: 8 },
  { timestamp: '2026-03-21 11:30:55', code: '503', message: 'Service Temporarily Unavailable', endpoint: '/api/media/upload', count: 1 },
  { timestamp: '2026-03-21 10:15:42', code: '400', message: 'Bad Request - Invalid JSON payload', endpoint: '/api/articles', count: 2 },
  { timestamp: '2026-03-20 22:05:19', code: '500', message: 'Internal Server Error - Memory overflow', endpoint: '/api/export', count: 1 },
  { timestamp: '2026-03-20 18:30:11', code: '401', message: 'Unauthorized - Token expired', endpoint: '/api/admin/settings', count: 5 },
  { timestamp: '2026-03-20 15:22:08', code: '502', message: 'Bad Gateway - Upstream timeout', endpoint: '/api/webhooks', count: 2 },
  { timestamp: '2026-03-20 12:11:33', code: '404', message: 'Not Found - /api/legacy/data', endpoint: '/api/legacy/data', count: 45 },
  { timestamp: '2026-03-20 09:05:01', code: '500', message: 'Internal Server Error - Null pointer', endpoint: '/api/reviews', count: 1 },
  { timestamp: '2026-03-19 20:30:44', code: '413', message: 'Payload Too Large', endpoint: '/api/media/upload', count: 4 },
];

const API_ENDPOINTS = [
  { path: '/api/properties', method: 'GET', avgTime: '35ms', requests24h: 1248, errors: 3 },
  { path: '/api/articles', method: 'GET', avgTime: '28ms', requests24h: 892, errors: 2 },
  { path: '/api/search', method: 'POST', avgTime: '120ms', requests24h: 2341, errors: 8 },
  { path: '/api/media/upload', method: 'POST', avgTime: '450ms', requests24h: 67, errors: 5 },
  { path: '/api/events', method: 'GET', avgTime: '32ms', requests24h: 456, errors: 0 },
  { path: '/api/reviews', method: 'GET', avgTime: '25ms', requests24h: 334, errors: 1 },
  { path: '/api/builders', method: 'GET', avgTime: '42ms', requests24h: 278, errors: 0 },
  { path: '/api/admin/settings', method: 'PUT', avgTime: '85ms', requests24h: 23, errors: 5 },
  { path: '/api/webhooks', method: 'POST', avgTime: '200ms', requests24h: 145, errors: 2 },
];

type JobStatus = '実行中' | '待機中' | '完了' | '失敗';
const JOB_COLORS: Record<JobStatus, string> = {
  '実行中': 'bg-blue-100 text-blue-700',
  '待機中': 'bg-gray-100 text-gray-600',
  '完了': 'bg-green-100 text-green-700',
  '失敗': 'bg-red-100 text-red-600',
};

const JOBS = [
  { name: 'サイトマップ生成', status: '完了' as JobStatus, lastRun: '2026-03-21 14:00', nextRun: '2026-03-21 15:00', duration: '2.3s' },
  { name: 'メディア最適化', status: '実行中' as JobStatus, lastRun: '2026-03-21 14:15', nextRun: '-', duration: '進行中...' },
  { name: 'データバックアップ', status: '完了' as JobStatus, lastRun: '2026-03-21 03:00', nextRun: '2026-03-22 03:00', duration: '45s' },
  { name: 'キャッシュクリア', status: '待機中' as JobStatus, lastRun: '2026-03-21 12:00', nextRun: '2026-03-21 18:00', duration: '-' },
  { name: 'メール送信キュー', status: '完了' as JobStatus, lastRun: '2026-03-21 14:10', nextRun: '2026-03-21 14:20', duration: '1.1s' },
  { name: '検索インデックス更新', status: '失敗' as JobStatus, lastRun: '2026-03-21 13:00', nextRun: '2026-03-21 15:00', duration: '失敗 (timeout)' },
];

const RESOURCES = [
  { name: 'CPU', percent: 34, color: 'bg-blue-500' },
  { name: 'メモリ', percent: 62, color: 'bg-purple-500' },
  { name: 'ストレージ', percent: 80, color: 'bg-orange-500' },
  { name: '帯域幅', percent: 45, color: 'bg-teal-500' },
];

export default function SystemPage() {
  const [autoRefresh, setAutoRefresh] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">システム状態</h1>
          <p className="text-sm text-gray-500 mt-1">サーバーとサービスの稼働状態をモニタリング</p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)}
            className="w-4 h-4 accent-[#E8740C] cursor-pointer" />
          <span className="text-sm text-gray-600">自動更新 (30秒)</span>
        </label>
      </div>

      {/* Health Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {HEALTH_ITEMS.map((h) => (
          <div key={h.name} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${HEALTH_COLORS[h.status]}`} />
              <span className="text-sm font-medium text-gray-900">{h.name}</span>
            </div>
            <p className={`text-sm font-bold ${HEALTH_TEXT[h.status]}`}>{h.status}</p>
            <p className="text-xs text-gray-400 mt-1">{h.detail}</p>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {METRICS.map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400">{m.label}</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-xl font-bold text-gray-900">{m.value}</p>
              <span className={`text-xs font-medium pb-0.5 ${m.trend === 'up' && m.label === 'キャッシュヒット率' ? 'text-green-500' : m.trend === 'down' ? 'text-green-500' : 'text-red-500'}`}>
                {m.trend === 'up' ? '↑' : '↓'} {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Resource Usage */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4">リソース使用状況</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RESOURCES.map((r) => (
            <div key={r.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{r.name}</span>
                <span className={`font-medium ${r.percent >= 80 ? 'text-orange-600' : 'text-gray-900'}`}>{r.percent}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className={`${r.color} h-2.5 rounded-full transition-all`} style={{ width: `${r.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Errors */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">最近のエラー</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">日時</th>
                <th className="px-4 py-3 font-medium text-gray-500">コード</th>
                <th className="px-4 py-3 font-medium text-gray-500">メッセージ</th>
                <th className="px-4 py-3 font-medium text-gray-500">エンドポイント</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">件数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ERRORS.map((e, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs whitespace-nowrap">{e.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      e.code.startsWith('5') ? 'bg-red-100 text-red-700' :
                      e.code.startsWith('4') ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                    }`}>{e.code}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{e.message}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{e.endpoint}</td>
                  <td className="px-4 py-3 text-right text-gray-900 font-medium">{e.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">APIエンドポイント統計 (24時間)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">エンドポイント</th>
                <th className="px-4 py-3 font-medium text-gray-500">メソッド</th>
                <th className="px-4 py-3 font-medium text-gray-500">平均応答時間</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">リクエスト数</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">エラー数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {API_ENDPOINTS.map((ep, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{ep.path}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      ep.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                      ep.method === 'POST' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{ep.method}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{ep.avgTime}</td>
                  <td className="px-4 py-3 text-right text-gray-900 font-medium">{ep.requests24h.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={ep.errors > 0 ? 'text-red-600 font-medium' : 'text-gray-400'}>{ep.errors}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Background Jobs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">バックグラウンドジョブ</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">ジョブ名</th>
                <th className="px-4 py-3 font-medium text-gray-500">ステータス</th>
                <th className="px-4 py-3 font-medium text-gray-500">最終実行</th>
                <th className="px-4 py-3 font-medium text-gray-500">次回実行</th>
                <th className="px-4 py-3 font-medium text-gray-500">所要時間</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {JOBS.map((job, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">{job.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${JOB_COLORS[job.status]}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{job.lastRun}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{job.nextRun}</td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{job.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
