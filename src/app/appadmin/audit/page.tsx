'use client';

import { useState, useMemo } from 'react';

type AuditEntry = {
  id: number;
  datetime: string;
  user: string;
  action: '作成' | '更新' | '削除' | 'ログイン' | '設定変更' | 'ログアウト';
  target: string;
  ip: string;
  status: '成功' | '失敗';
};

const USERS = ['田中 太郎', '佐藤 花子', '山田 次郎', '鈴木 美咲', '高橋 一郎'];

const MOCK_ENTRIES: AuditEntry[] = [
  { id: 1, datetime: '2026-03-21 14:32:10', user: '田中 太郎', action: '更新', target: '記事「住宅ローン金利の最新動向」', ip: '192.168.1.10', status: '成功' },
  { id: 2, datetime: '2026-03-21 14:28:05', user: '佐藤 花子', action: '作成', target: 'イベント「春の完成見学会 in 横浜」', ip: '192.168.1.22', status: '成功' },
  { id: 3, datetime: '2026-03-21 14:15:44', user: '山田 次郎', action: 'ログイン', target: '管理画面', ip: '203.104.52.18', status: '成功' },
  { id: 4, datetime: '2026-03-21 13:58:31', user: '鈴木 美咲', action: '削除', target: 'ニュース「旧キャンペーン告知」', ip: '192.168.1.35', status: '成功' },
  { id: 5, datetime: '2026-03-21 13:45:20', user: '高橋 一郎', action: '設定変更', target: 'SEO設定 - サイトディスクリプション', ip: '192.168.1.8', status: '成功' },
  { id: 6, datetime: '2026-03-21 13:30:12', user: '田中 太郎', action: '更新', target: '工務店「株式会社ホームデザイン」', ip: '192.168.1.10', status: '成功' },
  { id: 7, datetime: '2026-03-21 13:12:55', user: '佐藤 花子', action: '作成', target: 'お客様の声「30代夫婦の家づくり体験記」', ip: '192.168.1.22', status: '成功' },
  { id: 8, datetime: '2026-03-21 12:50:08', user: '山田 次郎', action: 'ログイン', target: '管理画面', ip: '45.67.89.101', status: '失敗' },
  { id: 9, datetime: '2026-03-21 12:48:30', user: '山田 次郎', action: 'ログイン', target: '管理画面', ip: '45.67.89.101', status: '失敗' },
  { id: 10, datetime: '2026-03-21 12:30:44', user: '鈴木 美咲', action: '更新', target: '動画「木造住宅の耐震性能を徹底解説」', ip: '192.168.1.35', status: '成功' },
  { id: 11, datetime: '2026-03-21 11:55:18', user: '高橋 一郎', action: '設定変更', target: '自動バックアップ設定', ip: '192.168.1.8', status: '成功' },
  { id: 12, datetime: '2026-03-21 11:40:33', user: '田中 太郎', action: '作成', target: '記事「2026年版 住宅補助金まとめ」', ip: '192.168.1.10', status: '成功' },
  { id: 13, datetime: '2026-03-21 11:22:10', user: '佐藤 花子', action: '削除', target: 'メディア「old-banner.jpg」', ip: '192.168.1.22', status: '成功' },
  { id: 14, datetime: '2026-03-21 10:58:45', user: '山田 次郎', action: '更新', target: 'ウェビナー「初めてのマイホーム購入セミナー」', ip: '203.104.52.18', status: '成功' },
  { id: 15, datetime: '2026-03-21 10:30:22', user: '鈴木 美咲', action: '作成', target: 'ニュース「春のリフォームフェア開催決定」', ip: '192.168.1.35', status: '成功' },
  { id: 16, datetime: '2026-03-21 10:15:09', user: '高橋 一郎', action: 'ログアウト', target: '管理画面', ip: '192.168.1.8', status: '成功' },
  { id: 17, datetime: '2026-03-21 09:45:55', user: '高橋 一郎', action: 'ログイン', target: '管理画面', ip: '192.168.1.8', status: '成功' },
  { id: 18, datetime: '2026-03-20 18:30:41', user: '田中 太郎', action: '設定変更', target: 'SNSリンク - Instagram URL', ip: '192.168.1.10', status: '成功' },
  { id: 19, datetime: '2026-03-20 17:55:12', user: '佐藤 花子', action: '更新', target: '取材「地元工務店の新しい挑戦」', ip: '192.168.1.22', status: '成功' },
  { id: 20, datetime: '2026-03-20 17:20:38', user: '山田 次郎', action: '作成', target: '月刊ぺいほーむ「2026年4月号」', ip: '203.104.52.18', status: '成功' },
  { id: 21, datetime: '2026-03-20 16:45:19', user: '鈴木 美咲', action: '削除', target: 'お客様の声「テスト投稿」', ip: '192.168.1.35', status: '成功' },
  { id: 22, datetime: '2026-03-20 15:30:07', user: '田中 太郎', action: 'ログイン', target: '管理画面', ip: '192.168.1.10', status: '成功' },
  { id: 23, datetime: '2026-03-20 14:10:52', user: '佐藤 花子', action: '設定変更', target: 'ページネーション設定 - 表示件数', ip: '192.168.1.22', status: '成功' },
  { id: 24, datetime: '2026-03-20 13:22:30', user: '高橋 一郎', action: '更新', target: '記事「断熱材の選び方ガイド」', ip: '192.168.1.8', status: '成功' },
];

const ACTION_COLORS: Record<string, string> = {
  '作成': 'bg-green-100 text-green-700',
  '更新': 'bg-blue-100 text-blue-700',
  '削除': 'bg-red-100 text-red-700',
  'ログイン': 'bg-purple-100 text-purple-700',
  'ログアウト': 'bg-gray-100 text-gray-600',
  '設定変更': 'bg-yellow-100 text-yellow-700',
};

const ACTIONS = ['すべて', '作成', '更新', '削除', 'ログイン', 'ログアウト', '設定変更'];
const PAGE_SIZE = 10;

export default function AuditPage() {
  const [filterAction, setFilterAction] = useState('すべて');
  const [filterUser, setFilterUser] = useState('すべて');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return MOCK_ENTRIES.filter((e) => {
      if (filterAction !== 'すべて' && e.action !== filterAction) return false;
      if (filterUser !== 'すべて' && e.user !== filterUser) return false;
      if (filterDateFrom && e.datetime < filterDateFrom) return false;
      if (filterDateTo && e.datetime < filterDateTo) return false;
      return true;
    });
  }, [filterAction, filterUser, filterDateFrom, filterDateTo]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const successCount = MOCK_ENTRIES.filter((e) => e.status === '成功').length;
  const failCount = MOCK_ENTRIES.filter((e) => e.status === '失敗').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">監査ログ</h1>
          <p className="text-sm text-gray-500 mt-1">システム操作の全履歴を確認できます</p>
        </div>
        <button className="bg-[#E8740C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#d4680b] transition cursor-pointer">
          CSVエクスポート
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">総ログ数</p>
          <p className="text-2xl font-bold text-gray-900">{MOCK_ENTRIES.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">成功</p>
          <p className="text-2xl font-bold text-green-600">{successCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">失敗</p>
          <p className="text-2xl font-bold text-red-600">{failCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">アクティブユーザー</p>
          <p className="text-2xl font-bold text-gray-900">{USERS.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">アクション</label>
            <select value={filterAction} onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30">
              {ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">ユーザー</label>
            <select value={filterUser} onChange={(e) => { setFilterUser(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30">
              <option value="すべて">すべて</option>
              {USERS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">開始日</label>
            <input type="date" value={filterDateFrom} onChange={(e) => { setFilterDateFrom(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">終了日</label>
            <input type="date" value={filterDateTo} onChange={(e) => { setFilterDateTo(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30" />
          </div>
          <button onClick={() => { setFilterAction('すべて'); setFilterUser('すべて'); setFilterDateFrom(''); setFilterDateTo(''); setPage(1); }}
            className="text-sm text-gray-500 hover:text-[#E8740C] transition cursor-pointer px-3 py-2">
            リセット
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">日時</th>
                <th className="px-4 py-3 font-medium text-gray-500">ユーザー</th>
                <th className="px-4 py-3 font-medium text-gray-500">アクション</th>
                <th className="px-4 py-3 font-medium text-gray-500">対象</th>
                <th className="px-4 py-3 font-medium text-gray-500">IPアドレス</th>
                <th className="px-4 py-3 font-medium text-gray-500">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap font-mono text-xs">{entry.datetime}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">{entry.user}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${ACTION_COLORS[entry.action] ?? 'bg-gray-100 text-gray-600'}`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{entry.target}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{entry.ip}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${entry.status === '成功' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">{filtered.length} 件中 {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, filtered.length)} 件表示</p>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition cursor-pointer disabled:cursor-default">
              前へ
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => setPage(i + 1)}
                className={`px-3 py-1.5 rounded text-xs border transition cursor-pointer ${page === i + 1 ? 'bg-[#E8740C] text-white border-[#E8740C]' : 'border-gray-200 hover:bg-gray-50'}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition cursor-pointer disabled:cursor-default">
              次へ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
