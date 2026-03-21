'use client';

import { useState } from 'react';

type ServiceStatus = { name: string; status: 'operational' | 'degraded' | 'down'; responseTime: string };
type ApiEndpoint = { path: string; method: string; avgMs: number; p95Ms: number; p99Ms: number; callsDay: number; errorRate: string };
type ScheduledTask = { name: string; schedule: string; lastRun: string; nextRun: string; status: 'success' | 'running' | 'failed' };
type LogEntry = { id: number; level: 'INFO' | 'WARN' | 'ERROR'; message: string; timestamp: string };
type Dep = { name: string; current: string; latest: string; hasUpdate: boolean };

const services: ServiceStatus[] = [
  { name: 'Supabase DB', status: 'operational', responseTime: '12ms' },
  { name: 'NextAuth', status: 'operational', responseTime: '45ms' },
  { name: 'Vercel', status: 'operational', responseTime: '28ms' },
  { name: 'OpenAI API', status: 'degraded', responseTime: '320ms' },
  { name: 'Email Service', status: 'operational', responseTime: '85ms' },
];

const endpoints: ApiEndpoint[] = [
  { path: '/api/leads', method: 'GET', avgMs: 42, p95Ms: 120, p99Ms: 250, callsDay: 1250, errorRate: '0.1%' },
  { path: '/api/leads', method: 'POST', avgMs: 65, p95Ms: 180, p99Ms: 350, callsDay: 85, errorRate: '0.5%' },
  { path: '/api/builders', method: 'GET', avgMs: 38, p95Ms: 95, p99Ms: 180, callsDay: 680, errorRate: '0.0%' },
  { path: '/api/properties', method: 'GET', avgMs: 55, p95Ms: 150, p99Ms: 280, callsDay: 920, errorRate: '0.2%' },
  { path: '/api/stats', method: 'GET', avgMs: 110, p95Ms: 280, p99Ms: 500, callsDay: 340, errorRate: '0.3%' },
  { path: '/api/auth/session', method: 'GET', avgMs: 15, p95Ms: 35, p99Ms: 60, callsDay: 3200, errorRate: '0.0%' },
  { path: '/api/chatbot', method: 'POST', avgMs: 850, p95Ms: 2100, p99Ms: 4500, callsDay: 420, errorRate: '1.2%' },
  { path: '/api/webhooks', method: 'POST', avgMs: 30, p95Ms: 75, p99Ms: 150, callsDay: 180, errorRate: '0.0%' },
];

const tasks: ScheduledTask[] = [
  { name: 'リードスコア再計算', schedule: '0 */6 * * *', lastRun: '2026-03-21 06:00', nextRun: '2026-03-21 12:00', status: 'success' },
  { name: 'メール配信キュー処理', schedule: '*/5 * * * *', lastRun: '2026-03-21 09:15', nextRun: '2026-03-21 09:20', status: 'running' },
  { name: 'DBバックアップ', schedule: '0 3 * * *', lastRun: '2026-03-21 03:00', nextRun: '2026-03-22 03:00', status: 'success' },
  { name: 'セッション自動クリーンアップ', schedule: '0 1 * * *', lastRun: '2026-03-21 01:00', nextRun: '2026-03-22 01:00', status: 'success' },
  { name: 'OpenAI使用量集計', schedule: '0 0 * * *', lastRun: '2026-03-21 00:00', nextRun: '2026-03-22 00:00', status: 'success' },
  { name: '古いログ削除', schedule: '0 4 * * 0', lastRun: '2026-03-16 04:00', nextRun: '2026-03-23 04:00', status: 'failed' },
];

const logs: LogEntry[] = [
  { id: 1, level: 'INFO', message: '[API] GET /api/leads - 200 (42ms)', timestamp: '09:15:32' },
  { id: 2, level: 'INFO', message: '[Auth] Session refreshed for user: tanaka@payhome.jp', timestamp: '09:15:28' },
  { id: 3, level: 'WARN', message: '[OpenAI] Response time exceeded 2000ms (2340ms)', timestamp: '09:14:55' },
  { id: 4, level: 'INFO', message: '[Email] Notification sent to sato@payhome.jp', timestamp: '09:14:20' },
  { id: 5, level: 'ERROR', message: '[Cron] Task "古いログ削除" failed: ENOENT /var/log/archive', timestamp: '09:13:00' },
  { id: 6, level: 'INFO', message: '[API] POST /api/leads - 201 (65ms)', timestamp: '09:12:45' },
  { id: 7, level: 'INFO', message: '[DB] Connection pool: 8/20 active', timestamp: '09:12:00' },
  { id: 8, level: 'WARN', message: '[Rate] API calls from 203.0.113.45 approaching limit (85/100)', timestamp: '09:11:30' },
  { id: 9, level: 'INFO', message: '[Auth] Login success: tanaka@payhome.jp from 203.0.113.45', timestamp: '09:10:15' },
  { id: 10, level: 'INFO', message: '[API] GET /api/stats - 200 (110ms)', timestamp: '09:10:00' },
  { id: 11, level: 'ERROR', message: '[Webhook] Delivery failed to https://hooks.slack.com/xxx - timeout', timestamp: '09:08:45' },
  { id: 12, level: 'INFO', message: '[Cron] Task "メール配信キュー処理" completed (12 emails sent)', timestamp: '09:05:00' },
];

const deps: Dep[] = [
  { name: 'next', current: '15.1.0', latest: '15.2.1', hasUpdate: true },
  { name: 'react', current: '19.0.0', latest: '19.0.0', hasUpdate: false },
  { name: '@supabase/supabase-js', current: '2.45.0', latest: '2.47.2', hasUpdate: true },
  { name: 'next-auth', current: '5.0.0-beta.25', latest: '5.0.0', hasUpdate: true },
  { name: 'tailwindcss', current: '3.4.15', latest: '3.4.17', hasUpdate: true },
  { name: 'openai', current: '4.73.0', latest: '4.73.0', hasUpdate: false },
  { name: 'zod', current: '3.23.8', latest: '3.24.1', hasUpdate: true },
];

const statusDot: Record<string, string> = { operational: 'bg-green-500', degraded: 'bg-yellow-500', down: 'bg-red-500' };
const statusText: Record<string, string> = { operational: '正常', degraded: '低下', down: '停止' };
const levelColor: Record<string, string> = { INFO: 'bg-blue-100 text-blue-700', WARN: 'bg-yellow-100 text-yellow-700', ERROR: 'bg-red-100 text-red-700' };
const taskStatusColor: Record<string, string> = { success: 'bg-green-100 text-green-700', running: 'bg-blue-100 text-blue-700', failed: 'bg-red-100 text-red-700' };
const taskStatusLabel: Record<string, string> = { success: '成功', running: '実行中', failed: '失敗' };

export default function SystemPage() {
  const [refreshInterval, setRefreshInterval] = useState('off');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">システム監視</h1>
          <p className="text-sm text-gray-500 mt-1">サービスの稼働状況とパフォーマンス</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">自動更新:</label>
          <select value={refreshInterval} onChange={e => setRefreshInterval(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
            <option value="off">OFF</option>
            <option value="5">5秒</option>
            <option value="15">15秒</option>
            <option value="30">30秒</option>
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'アップタイム', value: '99.97%', color: 'text-green-600' },
          { label: 'APIコール数 (24h)', value: '7,075', color: 'text-gray-900' },
          { label: '平均レスポンス', value: '152ms', color: 'text-gray-900' },
          { label: 'エラー率', value: '0.28%', color: 'text-green-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className={`text-3xl font-bold mt-2 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Service Status Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">サービスステータス</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {services.map(s => (
            <div key={s.name} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full ${statusDot[s.status]}`} />
                <span className="text-sm font-medium text-gray-900">{s.name}</span>
              </div>
              <p className="text-xs text-gray-500">{statusText[s.status]} - {s.responseTime}</p>
            </div>
          ))}
        </div>
      </div>

      {/* API Endpoint Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">APIエンドポイント パフォーマンス</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="py-3 px-4 text-left text-gray-500 font-medium">パス</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">メソッド</th>
                <th className="py-3 px-4 text-right text-gray-500 font-medium">平均</th>
                <th className="py-3 px-4 text-right text-gray-500 font-medium">P95</th>
                <th className="py-3 px-4 text-right text-gray-500 font-medium">P99</th>
                <th className="py-3 px-4 text-right text-gray-500 font-medium">コール数/日</th>
                <th className="py-3 px-4 text-right text-gray-500 font-medium">エラー率</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((ep, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-orange-50/50">
                  <td className="py-3 px-4"><code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{ep.path}</code></td>
                  <td className="py-3 px-4"><span className={`text-xs font-medium px-2 py-0.5 rounded ${ep.method === 'GET' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{ep.method}</span></td>
                  <td className="py-3 px-4 text-right text-gray-700">{ep.avgMs}ms</td>
                  <td className="py-3 px-4 text-right text-gray-700">{ep.p95Ms}ms</td>
                  <td className="py-3 px-4 text-right text-gray-700">{ep.p99Ms}ms</td>
                  <td className="py-3 px-4 text-right text-gray-700">{ep.callsDay.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right"><span className={parseFloat(ep.errorRate) > 0.5 ? 'text-red-600 font-medium' : 'text-gray-500'}>{ep.errorRate}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">データベース統計</h2>
          <div className="space-y-3">
            {[
              { label: '総レコード数', value: '24,856' },
              { label: 'DBサイズ', value: '1.2 GB' },
              { label: 'アクティブ接続', value: '8 / 20' },
              { label: 'スロークエリ (24h)', value: '3' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">環境情報</h2>
          <div className="space-y-3">
            {[
              { label: 'Node.js', value: 'v20.11.0' },
              { label: 'Next.js', value: '15.1.0' },
              { label: 'デプロイリージョン', value: 'ap-northeast-1 (Tokyo)' },
              { label: '最終デプロイ', value: '2026-03-21 06:30' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dependencies */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">依存パッケージ</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="py-3 px-4 text-left text-gray-500 font-medium">パッケージ</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">現在</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">最新</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {deps.map(d => (
                <tr key={d.name} className="border-b border-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{d.name}</td>
                  <td className="py-3 px-4 text-gray-600">{d.current}</td>
                  <td className="py-3 px-4 text-gray-600">{d.latest}</td>
                  <td className="py-3 px-4">{d.hasUpdate ? <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">更新可能</span> : <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">最新</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheduled Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">スケジュールタスク</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="py-3 px-4 text-left text-gray-500 font-medium">タスク名</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">スケジュール</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">前回実行</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">次回実行</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t.name} className="border-b border-gray-50 hover:bg-orange-50/50">
                  <td className="py-3 px-4 font-medium text-gray-900">{t.name}</td>
                  <td className="py-3 px-4"><code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{t.schedule}</code></td>
                  <td className="py-3 px-4 text-gray-500">{t.lastRun}</td>
                  <td className="py-3 px-4 text-gray-500">{t.nextRun}</td>
                  <td className="py-3 px-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${taskStatusColor[t.status]}`}>{taskStatusLabel[t.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Stream */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">ログストリーム</h2>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs space-y-1.5 max-h-80 overflow-y-auto">
          {logs.map(l => (
            <div key={l.id} className="flex items-start gap-2">
              <span className="text-gray-500 flex-shrink-0">{l.timestamp}</span>
              <span className={`px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0 ${l.level === 'INFO' ? 'bg-blue-900 text-blue-300' : l.level === 'WARN' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>{l.level}</span>
              <span className="text-gray-300">{l.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
