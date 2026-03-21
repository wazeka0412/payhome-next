'use client';

import { useState } from 'react';

type LoginEntry = { id: number; user: string; ip: string; device: string; date: string; status: 'success' | 'failed' | 'blocked'; location: string };
type ApiKey = { id: string; name: string; created: string; lastUsed: string; prefix: string };

const mockLogins: LoginEntry[] = [
  { id: 1, user: '田中太郎', ip: '203.0.113.45', device: 'Chrome / macOS', date: '2026-03-21 09:15', status: 'success', location: '東京' },
  { id: 2, user: '佐藤花子', ip: '203.0.113.50', device: 'Safari / iOS', date: '2026-03-21 08:30', status: 'success', location: '大阪' },
  { id: 3, user: '不明', ip: '192.168.1.100', device: 'curl/7.88', date: '2026-03-21 08:12', status: 'blocked', location: '海外' },
  { id: 4, user: '鈴木建設', ip: '10.0.0.55', device: 'Firefox / Windows', date: '2026-03-21 07:45', status: 'success', location: '名古屋' },
  { id: 5, user: '加藤誠', ip: '172.16.0.10', device: 'Chrome / Android', date: '2026-03-21 07:20', status: 'failed', location: '福岡' },
  { id: 6, user: '加藤誠', ip: '172.16.0.10', device: 'Chrome / Android', date: '2026-03-21 07:19', status: 'failed', location: '福岡' },
  { id: 7, user: '加藤誠', ip: '172.16.0.10', device: 'Chrome / Android', date: '2026-03-21 07:18', status: 'failed', location: '福岡' },
  { id: 8, user: '山田工務店', ip: '203.0.113.80', device: 'Edge / Windows', date: '2026-03-20 17:30', status: 'success', location: '札幌' },
  { id: 9, user: '渡辺一郎', ip: '198.51.100.22', device: 'Chrome / macOS', date: '2026-03-20 16:00', status: 'success', location: '横浜' },
  { id: 10, user: '不明', ip: '45.33.32.156', device: 'Python/3.11', date: '2026-03-20 14:50', status: 'blocked', location: '海外' },
  { id: 11, user: '中村美咲', ip: '203.0.113.99', device: 'Safari / macOS', date: '2026-03-20 12:15', status: 'success', location: '京都' },
  { id: 12, user: '不明', ip: '91.240.118.50', device: 'Unknown', date: '2026-03-20 10:05', status: 'blocked', location: '海外' },
  { id: 13, user: '小林健太', ip: '198.51.100.88', device: 'Chrome / Linux', date: '2026-03-20 09:30', status: 'success', location: '神戸' },
  { id: 14, user: '松本建築', ip: '203.0.113.120', device: 'Chrome / Windows', date: '2026-03-20 08:00', status: 'success', location: '広島' },
  { id: 15, user: '田中太郎', ip: '203.0.113.45', device: 'Chrome / macOS', date: '2026-03-19 18:00', status: 'success', location: '東京' },
  { id: 16, user: '不明', ip: '185.220.101.1', device: 'Go-http-client', date: '2026-03-19 15:30', status: 'blocked', location: '海外' },
];

const mockApiKeys: ApiKey[] = [
  { id: '1', name: '本番環境', created: '2026-01-15', lastUsed: '2026-03-21 09:00', prefix: 'pk_live_a3f2' },
  { id: '2', name: 'ステージング', created: '2026-02-01', lastUsed: '2026-03-20 14:30', prefix: 'pk_test_b7e1' },
  { id: '3', name: 'Webhook連携', created: '2026-02-20', lastUsed: '2026-03-21 08:45', prefix: 'pk_hook_c9d4' },
  { id: '4', name: 'モバイルアプリ', created: '2026-03-01', lastUsed: '2026-03-19 22:10', prefix: 'pk_mob_d1f5' },
  { id: '5', name: '外部パートナー', created: '2026-03-10', lastUsed: '2026-03-18 11:00', prefix: 'pk_ext_e2g6' },
  { id: '6', name: 'バッチ処理', created: '2026-03-15', lastUsed: '2026-03-21 06:00', prefix: 'pk_bat_f3h7' },
];

const statusColor: Record<string, string> = {
  success: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  blocked: 'bg-gray-100 text-gray-700',
};
const statusLabel: Record<string, string> = { success: '成功', failed: '失敗', blocked: 'ブロック' };

export default function SecurityPage() {
  const [password, setPassword] = useState({ minLength: 8, uppercase: true, number: true, special: true, expiryDays: 90, maxFailed: 5 });
  const [session, setSession] = useState({ timeout: 30, maxConcurrent: 3, rememberDays: 14 });
  const [twoFa, setTwoFa] = useState({ enabled: true, level: '推奨' });
  const [ipWhitelist, setIpWhitelist] = useState(['203.0.113.0/24', '10.0.0.0/8']);
  const [ipBlacklist, setIpBlacklist] = useState(['45.33.32.0/24', '91.240.118.0/24', '185.220.101.0/24']);
  const [newWhite, setNewWhite] = useState('');
  const [newBlack, setNewBlack] = useState('');
  const [corsOrigins, setCorsOrigins] = useState(['https://payhome.jp', 'https://app.payhome.jp', 'https://staging.payhome.jp']);
  const [newCors, setNewCors] = useState('');
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [alerts] = useState([
    { id: 1, severity: '高', message: '同一IPから5回連続ログイン失敗を検知', date: '2026-03-21 07:20', color: 'bg-red-100 text-red-700 border-red-200' },
    { id: 2, severity: '中', message: 'ブロック対象IPからのアクセス試行 (4件)', date: '2026-03-20 14:50', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { id: 3, severity: '低', message: 'APIキー「外部パートナー」が3日間未使用', date: '2026-03-21 06:00', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  ]);

  const failedLogins24h = mockLogins.filter(l => l.status === 'failed').length;
  const activeSessions = 8;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">セキュリティ設定</h1>
        <p className="text-sm text-gray-500 mt-1">システムのセキュリティポリシーと監視設定</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'ログイン失敗 (24h)', value: failedLogins24h, color: failedLogins24h > 5 ? 'text-red-600' : 'text-gray-900' },
          { label: 'アクティブセッション', value: activeSessions, color: 'text-gray-900' },
          { label: '最終セキュリティスキャン', value: '3時間前', color: 'text-gray-900' },
          { label: '脅威レベル', value: '低', color: 'text-green-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className={`text-3xl font-bold mt-2 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Security Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">セキュリティアラート</h2>
        <div className="space-y-3">
          {alerts.map(a => (
            <div key={a.id} className={`flex items-center justify-between p-3 rounded-lg border ${a.color}`}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded">{a.severity}</span>
                <span className="text-sm">{a.message}</span>
              </div>
              <span className="text-xs opacity-70">{a.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Policy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">パスワードポリシー</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">最低文字数</label>
              <input type="number" value={password.minLength} onChange={e => setPassword({ ...password, minLength: +e.target.value })} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center" />
            </div>
            {[
              { key: 'uppercase' as const, label: '大文字必須' },
              { key: 'number' as const, label: '数字必須' },
              { key: 'special' as const, label: '特殊文字必須' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <label className="text-sm text-gray-700">{item.label}</label>
                <button onClick={() => setPassword({ ...password, [item.key]: !password[item.key] })} className={`w-12 h-6 rounded-full transition ${password[item.key] ? 'bg-[#E8740C]' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition ${password[item.key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">有効期限 (日)</label>
              <input type="number" value={password.expiryDays} onChange={e => setPassword({ ...password, expiryDays: +e.target.value })} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">ロックまでの失敗回数</label>
              <input type="number" value={password.maxFailed} onChange={e => setPassword({ ...password, maxFailed: +e.target.value })} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center" />
            </div>
          </div>
        </div>

        {/* Session Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">セッション設定</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">セッションタイムアウト (分)</label>
              <input type="number" value={session.timeout} onChange={e => setSession({ ...session, timeout: +e.target.value })} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">最大同時セッション数</label>
              <input type="number" value={session.maxConcurrent} onChange={e => setSession({ ...session, maxConcurrent: +e.target.value })} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">ログイン記憶期間 (日)</label>
              <input type="number" value={session.rememberDays} onChange={e => setSession({ ...session, rememberDays: +e.target.value })} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center" />
            </div>
          </div>
          <hr className="my-4 border-gray-100" />
          <h3 className="text-sm font-semibold text-gray-900 mb-3">二要素認証</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">有効化</label>
              <button onClick={() => setTwoFa({ ...twoFa, enabled: !twoFa.enabled })} className={`w-12 h-6 rounded-full transition ${twoFa.enabled ? 'bg-[#E8740C]' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition ${twoFa.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">適用レベル</label>
              <select value={twoFa.level} onChange={e => setTwoFa({ ...twoFa, level: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                <option>任意</option>
                <option>推奨</option>
                <option>必須</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IP Whitelist */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">IPホワイトリスト</h2>
          <div className="space-y-2 mb-3">
            {ipWhitelist.map((ip, i) => (
              <div key={i} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                <code className="text-sm text-gray-700">{ip}</code>
                <button onClick={() => setIpWhitelist(ipWhitelist.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-sm">削除</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newWhite} onChange={e => setNewWhite(e.target.value)} placeholder="192.168.0.0/16" className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
            <button onClick={() => { if (newWhite) { setIpWhitelist([...ipWhitelist, newWhite]); setNewWhite(''); } }} className="px-3 py-1.5 bg-[#E8740C] text-white rounded-lg text-sm">追加</button>
          </div>
        </div>

        {/* IP Blacklist */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">IPブラックリスト</h2>
          <div className="space-y-2 mb-3">
            {ipBlacklist.map((ip, i) => (
              <div key={i} className="flex items-center justify-between bg-red-50 px-3 py-2 rounded-lg">
                <code className="text-sm text-gray-700">{ip}</code>
                <button onClick={() => setIpBlacklist(ipBlacklist.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-sm">削除</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newBlack} onChange={e => setNewBlack(e.target.value)} placeholder="10.0.0.0/8" className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
            <button onClick={() => { if (newBlack) { setIpBlacklist([...ipBlacklist, newBlack]); setNewBlack(''); } }} className="px-3 py-1.5 bg-[#E8740C] text-white rounded-lg text-sm">追加</button>
          </div>
        </div>
      </div>

      {/* CORS Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">CORS設定 - 許可オリジン</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {corsOrigins.map((o, i) => (
            <span key={i} className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-sm">
              <code>{o}</code>
              <button onClick={() => setCorsOrigins(corsOrigins.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newCors} onChange={e => setNewCors(e.target.value)} placeholder="https://example.com" className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
          <button onClick={() => { if (newCors) { setCorsOrigins([...corsOrigins, newCors]); setNewCors(''); } }} className="px-3 py-1.5 bg-[#E8740C] text-white rounded-lg text-sm">追加</button>
        </div>
      </div>

      {/* API Key Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">APIキー管理</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="py-3 px-4 text-left text-gray-500 font-medium">名前</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">キープレフィックス</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">作成日</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">最終使用</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map(k => (
                <tr key={k.id} className="border-b border-gray-50 hover:bg-orange-50/50">
                  <td className="py-3 px-4 font-medium text-gray-900">{k.name}</td>
                  <td className="py-3 px-4"><code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{k.prefix}••••••••</code></td>
                  <td className="py-3 px-4 text-gray-500">{k.created}</td>
                  <td className="py-3 px-4 text-gray-500">{k.lastUsed}</td>
                  <td className="py-3 px-4"><button onClick={() => setApiKeys(apiKeys.filter(a => a.id !== k.id))} className="text-red-500 text-sm font-medium hover:underline">無効化</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Login History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">ログイン履歴</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="py-3 px-4 text-left text-gray-500 font-medium">ユーザー</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">IP</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">デバイス</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">日時</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">ステータス</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">場所</th>
              </tr>
            </thead>
            <tbody>
              {mockLogins.map(l => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-orange-50/50">
                  <td className="py-3 px-4 font-medium text-gray-900">{l.user}</td>
                  <td className="py-3 px-4"><code className="text-xs">{l.ip}</code></td>
                  <td className="py-3 px-4 text-gray-600">{l.device}</td>
                  <td className="py-3 px-4 text-gray-500">{l.date}</td>
                  <td className="py-3 px-4"><span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[l.status]}`}>{statusLabel[l.status]}</span></td>
                  <td className="py-3 px-4 text-gray-500">{l.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2.5 bg-[#E8740C] text-white rounded-lg text-sm font-medium hover:bg-[#d06a0b] transition">すべての設定を保存</button>
      </div>
    </div>
  );
}
