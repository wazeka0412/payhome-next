'use client';

import { useState } from 'react';

type Activity = {
  id: number;
  user: string;
  initials: string;
  action: string;
  type: 'login' | 'lead' | 'settings' | 'builder' | 'property';
  detail: string;
  timestamp: string;
  group: string;
};

const typeColors: Record<string, string> = {
  login: 'bg-green-500',
  lead: 'bg-blue-500',
  settings: 'bg-purple-500',
  builder: 'bg-orange-500',
  property: 'bg-yellow-500',
};

const typeLabels: Record<string, string> = {
  login: 'ログイン',
  lead: 'リード操作',
  settings: '設定変更',
  builder: '工務店操作',
  property: '物件操作',
};

const mockActivities: Activity[] = [
  { id: 1, user: '田中太郎', initials: '田中', action: 'ダッシュボードにログイン', type: 'login', detail: 'Chrome / macOS - IP: 203.0.113.45', timestamp: '09:15', group: '今日' },
  { id: 2, user: '田中太郎', initials: '田中', action: 'リード「山本様」のステータスを「対応中」に変更', type: 'lead', detail: 'リードID: LD-0042 / 変更前: 新規 → 変更後: 対応中', timestamp: '09:12', group: '今日' },
  { id: 3, user: '佐藤花子', initials: '佐藤', action: 'ダッシュボードにログイン', type: 'login', detail: 'Safari / iOS - IP: 203.0.113.50', timestamp: '08:30', group: '今日' },
  { id: 4, user: '佐藤花子', initials: '佐藤', action: '新規リード「高橋様」を手動追加', type: 'lead', detail: 'リードID: LD-0058 / ソース: 電話問い合わせ', timestamp: '08:25', group: '今日' },
  { id: 5, user: '田中太郎', initials: '田中', action: '通知設定を変更', type: 'settings', detail: 'Slack通知: OFF → ON / チャンネル: #leads', timestamp: '08:10', group: '今日' },
  { id: 6, user: '鈴木建設', initials: '鈴木', action: '物件「グリーンヒルズ3LDK」の情報を更新', type: 'property', detail: '物件ID: PR-0015 / 価格: 3,200万 → 3,100万', timestamp: '07:50', group: '今日' },
  { id: 7, user: '佐藤花子', initials: '佐藤', action: 'リード「小林様」を工務店「山田工務店」に紹介', type: 'lead', detail: 'リードID: LD-0039 / 紹介メール送信済み', timestamp: '07:30', group: '今日' },
  { id: 8, user: '田中太郎', initials: '田中', action: '工務店「松本建築」の登録情報を承認', type: 'builder', detail: '工務店ID: BL-0008 / ステータス: 審査中 → 承認済み', timestamp: '07:15', group: '今日' },
  { id: 9, user: '山田工務店', initials: '山田', action: '見学会イベントを新規作成', type: 'property', detail: 'イベント名: 春の完成見学会 / 日程: 2026-04-05', timestamp: '07:00', group: '今日' },
  { id: 10, user: '渡辺一郎', initials: '渡辺', action: 'ダッシュボードにログイン', type: 'login', detail: 'Chrome / macOS - IP: 198.51.100.22', timestamp: '06:45', group: '今日' },
  { id: 11, user: '山田工務店', initials: '山田', action: 'ダッシュボードにログイン', type: 'login', detail: 'Edge / Windows - IP: 203.0.113.80', timestamp: '17:30', group: '昨日' },
  { id: 12, user: '佐藤花子', initials: '佐藤', action: 'リード「中村様」の面談メモを更新', type: 'lead', detail: 'リードID: LD-0035 / メモ追加: 土地探し中、予算3500万前後', timestamp: '16:45', group: '昨日' },
  { id: 13, user: '田中太郎', initials: '田中', action: 'パスワードポリシーを変更', type: 'settings', detail: '最低文字数: 6 → 8 / 特殊文字必須: ON', timestamp: '16:00', group: '昨日' },
  { id: 14, user: '渡辺一郎', initials: '渡辺', action: 'ダッシュボードにログイン', type: 'login', detail: 'Chrome / macOS - IP: 198.51.100.22', timestamp: '16:00', group: '昨日' },
  { id: 15, user: '中村美咲', initials: '中村', action: 'リード一覧をCSVエクスポート', type: 'lead', detail: 'エクスポート件数: 142件 / フィルタ: 2026年3月', timestamp: '15:30', group: '昨日' },
  { id: 16, user: '松本建築', initials: '松本', action: '物件「サニーテラス」を新規登録', type: 'property', detail: '物件ID: PR-0022 / 種別: 4LDK / 価格: 4,500万', timestamp: '14:00', group: '昨日' },
  { id: 17, user: '田中太郎', initials: '田中', action: 'ユーザー「加藤誠」のアカウントを停止', type: 'settings', detail: '理由: 5回連続ログイン失敗によるロック', timestamp: '12:30', group: '昨日' },
  { id: 18, user: '鈴木建設', initials: '鈴木', action: 'リード「吉田様」に見積もり資料を送信', type: 'lead', detail: 'リードID: LD-0041 / 添付: 概算見積書.pdf', timestamp: '11:00', group: '昨日' },
  { id: 19, user: '佐藤花子', initials: '佐藤', action: 'ダッシュボードにログイン', type: 'login', detail: 'Chrome / Windows - IP: 203.0.113.55', timestamp: '10:00', group: '昨日' },
  { id: 20, user: '田中太郎', initials: '田中', action: 'ダッシュボードにログイン', type: 'login', detail: 'Chrome / macOS - IP: 203.0.113.45', timestamp: '09:00', group: '昨日' },
  { id: 21, user: '田中太郎', initials: '田中', action: 'APIキー「ステージング」を再発行', type: 'settings', detail: '旧キー無効化 → 新キー発行完了', timestamp: '18:00', group: '2日前' },
  { id: 22, user: '佐藤花子', initials: '佐藤', action: 'リード「藤田様」のスコアを手動更新', type: 'lead', detail: 'リードID: LD-0033 / スコア: 45 → 72', timestamp: '15:30', group: '2日前' },
  { id: 23, user: '山田工務店', initials: '山田', action: '物件「オークコート」の写真を追加', type: 'property', detail: '物件ID: PR-0018 / 追加枚数: 12枚', timestamp: '14:00', group: '2日前' },
  { id: 24, user: '松本建築', initials: '松本', action: '工務店プロフィールを更新', type: 'builder', detail: '対応エリア追加: 広島市安芸区 / 施工実績: 3件追加', timestamp: '11:00', group: '2日前' },
  { id: 25, user: '田中太郎', initials: '田中', action: 'CORS設定にオリジンを追加', type: 'settings', detail: '追加: https://staging.payhome.jp', timestamp: '10:00', group: '2日前' },
  { id: 26, user: '鈴木建設', initials: '鈴木', action: 'リード「岡田様」の担当者を変更', type: 'lead', detail: 'リードID: LD-0037 / 担当: 佐藤 → 田中', timestamp: '09:30', group: '2日前' },
];

export default function ActivityPage() {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const users = [...new Set(mockActivities.map(a => a.user))];
  const groups = ['今日', '昨日', '2日前'];

  const filtered = mockActivities.filter(a => {
    if (filterType !== 'all' && a.type !== filterType) return false;
    if (filterUser !== 'all' && a.user !== filterUser) return false;
    return true;
  });

  const todayActions = filtered.filter(a => a.group === '今日').length;
  const mostActive = (() => {
    const counts: Record<string, number> = {};
    filtered.forEach(a => { counts[a.user] = (counts[a.user] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
  })();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">アクティビティログ</h1>
          <p className="text-sm text-gray-500 mt-1">システム上のすべての操作履歴</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            リアルタイム
          </span>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">エクスポート</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">本日のアクション数</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{todayActions}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">最もアクティブなユーザー</p>
          <p className="text-3xl font-bold text-[#E8740C] mt-2">{mostActive}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">ピーク時間帯</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">08:00-09:00</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">アクション種別</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
            <option value="all">すべて</option>
            {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">ユーザー</label>
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
            <option value="all">すべて</option>
            {users.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">期間</label>
          <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
            <option>過去3日間</option>
            <option>過去7日間</option>
            <option>過去30日間</option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {groups.map(group => {
          const items = filtered.filter(a => a.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="mb-8 last:mb-0">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{group}</h3>
              <div className="relative pl-8">
                {/* Vertical line */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200" />

                {items.map((item, idx) => (
                  <div key={item.id} className="relative mb-6 last:mb-0">
                    {/* Dot */}
                    <div className={`absolute -left-5 top-1.5 w-3 h-3 rounded-full border-2 border-white ${typeColors[item.type]}`} />

                    <div className="flex items-start gap-3 cursor-pointer" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-[#2A1700] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {item.initials.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-gray-900">{item.user}</span>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium text-white ${typeColors[item.type]}`}>{typeLabels[item.type]}</span>
                          <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{item.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{item.action}</p>
                        {expandedId === item.id && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">{item.detail}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
