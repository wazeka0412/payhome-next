'use client';

import { useState } from 'react';

type Channel = 'email' | 'slack' | 'line' | 'webhook';
type Trigger = { event: string; channels: Record<Channel, boolean>; urgency: string };
type HistoryEntry = { id: number; channel: Channel; event: string; recipient: string; status: 'sent' | 'failed' | 'pending'; date: string };

const channelLabels: Record<Channel, string> = { email: 'Email', slack: 'Slack', line: 'LINE', webhook: 'Webhook' };
const statusColor: Record<string, string> = { sent: 'bg-green-100 text-green-700', failed: 'bg-red-100 text-red-700', pending: 'bg-yellow-100 text-yellow-700' };
const statusLabel: Record<string, string> = { sent: '送信済', failed: '失敗', pending: '保留' };

const initialTriggers: Trigger[] = [
  { event: '新規リード', channels: { email: true, slack: true, line: true, webhook: true }, urgency: '即時' },
  { event: 'ステータス変更', channels: { email: true, slack: true, line: false, webhook: false }, urgency: '即時' },
  { event: '見学会予約', channels: { email: true, slack: true, line: true, webhook: false }, urgency: '即時' },
  { event: '工務店登録', channels: { email: true, slack: true, line: false, webhook: true }, urgency: '即時' },
  { event: 'エラー発生', channels: { email: true, slack: true, line: false, webhook: true }, urgency: '即時' },
  { event: 'バックアップ完了', channels: { email: false, slack: true, line: false, webhook: false }, urgency: '日次まとめ' },
  { event: '未対応リードアラート', channels: { email: true, slack: true, line: false, webhook: false }, urgency: '日次まとめ' },
  { event: '週間レポート', channels: { email: true, slack: false, line: false, webhook: false }, urgency: '週次まとめ' },
  { event: 'ユーザー登録', channels: { email: true, slack: true, line: false, webhook: false }, urgency: '即時' },
  { event: 'セキュリティアラート', channels: { email: true, slack: true, line: true, webhook: true }, urgency: '即時' },
  { event: 'API使用量警告', channels: { email: true, slack: true, line: false, webhook: false }, urgency: '即時' },
];

const initialHistory: HistoryEntry[] = [
  { id: 1, channel: 'slack', event: '新規リード', recipient: '#leads', status: 'sent', date: '2026-03-21 09:12' },
  { id: 2, channel: 'email', event: '新規リード', recipient: 'tanaka@payhome.jp', status: 'sent', date: '2026-03-21 09:12' },
  { id: 3, channel: 'line', event: '新規リード', recipient: 'グループ: 営業チーム', status: 'sent', date: '2026-03-21 09:12' },
  { id: 4, channel: 'webhook', event: 'エラー発生', recipient: 'https://hooks.example.com/err', status: 'failed', date: '2026-03-21 09:08' },
  { id: 5, channel: 'email', event: 'ステータス変更', recipient: 'sato@payhome.jp', status: 'sent', date: '2026-03-21 08:25' },
  { id: 6, channel: 'slack', event: 'ステータス変更', recipient: '#leads', status: 'sent', date: '2026-03-21 08:25' },
  { id: 7, channel: 'email', event: '見学会予約', recipient: 'yamada@koumuten.jp', status: 'sent', date: '2026-03-20 16:30' },
  { id: 8, channel: 'slack', event: 'バックアップ完了', recipient: '#system', status: 'sent', date: '2026-03-21 03:05' },
  { id: 9, channel: 'email', event: '週間レポート', recipient: 'tanaka@payhome.jp', status: 'pending', date: '2026-03-21 09:00' },
  { id: 10, channel: 'line', event: 'セキュリティアラート', recipient: 'グループ: 管理者', status: 'sent', date: '2026-03-21 07:20' },
];

const templateVars = ['{{lead_name}}', '{{builder_name}}', '{{event_date}}', '{{status}}', '{{url}}'];

export default function NotificationsPage() {
  const [channelEnabled, setChannelEnabled] = useState<Record<Channel, boolean>>({ email: true, slack: true, line: true, webhook: false });
  const [email, setEmail] = useState({ host: 'smtp.gmail.com', port: '587', from: 'noreply@payhome.jp', name: 'Pei Home' });
  const [slack, setSlack] = useState({ webhookUrl: 'https://hooks.slack.com/services/T00/B00/xxxx', channel: '#leads', mention: '@channel' });
  const [line, setLine] = useState({ token: 'xxxxxxxxxxxxxxxxxxxxxxxx', groupId: 'C1234567890abcdef' });
  const [webhook, setWebhook] = useState({ url: 'https://hooks.example.com/payhome', secret: 'whsec_xxxxxxxx', retryCount: '3' });
  const [triggers, setTriggers] = useState(initialTriggers);
  const [selectedTemplate, setSelectedTemplate] = useState('新規リード');
  const [templateSubject, setTemplateSubject] = useState('【Pei Home】新規リードが登録されました: {{lead_name}}');
  const [templateBody, setTemplateBody] = useState('{{lead_name}}様から新規お問い合わせがありました。\n\n詳細はこちら: {{url}}\n\nPei Home管理画面');

  const toggleChannel = (ch: Channel) => setChannelEnabled({ ...channelEnabled, [ch]: !channelEnabled[ch] });

  const toggleTriggerChannel = (eventIdx: number, ch: Channel) => {
    const next = [...triggers];
    next[eventIdx] = { ...next[eventIdx], channels: { ...next[eventIdx].channels, [ch]: !next[eventIdx].channels[ch] } };
    setTriggers(next);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">通知設定</h1>
        <p className="text-sm text-gray-500 mt-1">通知チャンネルとトリガーの管理</p>
      </div>

      {/* Channel Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(['email', 'slack', 'line', 'webhook'] as Channel[]).map(ch => (
          <div key={ch} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">{channelLabels[ch]}</h3>
              <button onClick={() => toggleChannel(ch)} className={`w-12 h-6 rounded-full transition ${channelEnabled[ch] ? 'bg-[#E8740C]' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition ${channelEnabled[ch] ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <p className="text-xs text-gray-400">{channelEnabled[ch] ? '有効' : '無効'}</p>
            <button className="mt-3 text-xs text-[#E8740C] font-medium hover:underline">テスト送信</button>
          </div>
        ))}
      </div>

      {/* Channel Config */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Config */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Email設定</h2>
          <div className="space-y-3">
            {[
              { label: 'SMTPホスト', value: email.host, key: 'host' },
              { label: 'ポート', value: email.port, key: 'port' },
              { label: '送信元アドレス', value: email.from, key: 'from' },
              { label: '送信者名', value: email.name, key: 'name' },
            ].map(f => (
              <div key={f.key} className="flex items-center gap-4">
                <label className="text-sm text-gray-600 w-32 flex-shrink-0">{f.label}</label>
                <input value={f.value} onChange={e => setEmail({ ...email, [f.key]: e.target.value })} className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Slack Config */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Slack設定</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600 w-32 flex-shrink-0">Webhook URL</label>
              <input value={slack.webhookUrl} onChange={e => setSlack({ ...slack, webhookUrl: e.target.value })} className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600 w-32 flex-shrink-0">チャンネル名</label>
              <input value={slack.channel} onChange={e => setSlack({ ...slack, channel: e.target.value })} className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600 w-32 flex-shrink-0">メンション設定</label>
              <input value={slack.mention} onChange={e => setSlack({ ...slack, mention: e.target.value })} className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
            </div>
          </div>
        </div>

        {/* LINE Config */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">LINE設定</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600 w-32 flex-shrink-0">アクセストークン</label>
              <input value={line.token} onChange={e => setLine({ ...line, token: e.target.value })} type="password" className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600 w-32 flex-shrink-0">グループID</label>
              <input value={line.groupId} onChange={e => setLine({ ...line, groupId: e.target.value })} className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
            </div>
          </div>
        </div>

        {/* Webhook Config */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Webhook設定</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600 w-32 flex-shrink-0">エンドポイントURL</label>
              <input value={webhook.url} onChange={e => setWebhook({ ...webhook, url: e.target.value })} className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600 w-32 flex-shrink-0">シークレットキー</label>
              <input value={webhook.secret} onChange={e => setWebhook({ ...webhook, secret: e.target.value })} type="password" className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600 w-32 flex-shrink-0">リトライ回数</label>
              <input value={webhook.retryCount} onChange={e => setWebhook({ ...webhook, retryCount: e.target.value })} type="number" className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center" />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Triggers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">通知トリガー</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="py-3 px-4 text-left text-gray-500 font-medium">イベント名</th>
                {(['email', 'slack', 'line', 'webhook'] as Channel[]).map(ch => (
                  <th key={ch} className="py-3 px-4 text-center text-gray-500 font-medium">{channelLabels[ch]}</th>
                ))}
                <th className="py-3 px-4 text-left text-gray-500 font-medium">配信タイミング</th>
              </tr>
            </thead>
            <tbody>
              {triggers.map((t, idx) => (
                <tr key={t.event} className="border-b border-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{t.event}</td>
                  {(['email', 'slack', 'line', 'webhook'] as Channel[]).map(ch => (
                    <td key={ch} className="py-3 px-4 text-center">
                      <input type="checkbox" checked={t.channels[ch]} onChange={() => toggleTriggerChannel(idx, ch)} className="accent-[#E8740C] w-4 h-4" />
                    </td>
                  ))}
                  <td className="py-3 px-4">
                    <select value={t.urgency} onChange={e => { const next = [...triggers]; next[idx] = { ...next[idx], urgency: e.target.value }; setTriggers(next); }} className="border border-gray-200 rounded-lg px-2 py-1 text-xs">
                      <option>即時</option>
                      <option>日次まとめ</option>
                      <option>週次まとめ</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template Editor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">テンプレートエディタ</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-600 w-24 flex-shrink-0">イベント</label>
            <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
              {initialTriggers.map(t => <option key={t.event}>{t.event}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">件名</label>
            <input value={templateSubject} onChange={e => setTemplateSubject(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">本文</label>
            <textarea value={templateBody} onChange={e => setTemplateBody(e.target.value)} rows={5} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">変数:</span>
            {templateVars.map(v => (
              <button key={v} onClick={() => setTemplateBody(templateBody + v)} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">{v}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Notification History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">通知履歴</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="py-3 px-4 text-left text-gray-500 font-medium">チャンネル</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">イベント</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">宛先</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">ステータス</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">日時</th>
              </tr>
            </thead>
            <tbody>
              {initialHistory.map(h => (
                <tr key={h.id} className="border-b border-gray-50 hover:bg-orange-50/50">
                  <td className="py-3 px-4 font-medium text-gray-900">{channelLabels[h.channel]}</td>
                  <td className="py-3 px-4 text-gray-600">{h.event}</td>
                  <td className="py-3 px-4 text-gray-600 text-xs">{h.recipient}</td>
                  <td className="py-3 px-4"><span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[h.status]}`}>{statusLabel[h.status]}</span></td>
                  <td className="py-3 px-4 text-gray-500">{h.date}</td>
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
