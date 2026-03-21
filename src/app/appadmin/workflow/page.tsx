'use client';

import { useState } from 'react';

type ContentStatus = '下書き' | 'レビュー待ち' | '公開予定' | '公開中' | '非公開';
type ContentType = '記事' | '動画' | 'イベント' | 'ニュース' | 'お客様の声' | 'ウェビナー';

type WorkflowItem = {
  id: number;
  title: string;
  type: ContentType;
  author: string;
  status: ContentStatus;
  submittedDate: string;
  scheduledDate?: string;
  reviewComment?: string;
  reviewer?: string;
  reviewedDate?: string;
};

const STATUS_COLORS: Record<ContentStatus, string> = {
  '下書き': 'bg-gray-100 text-gray-600',
  'レビュー待ち': 'bg-yellow-100 text-yellow-700',
  '公開予定': 'bg-blue-100 text-blue-700',
  '公開中': 'bg-green-100 text-green-700',
  '非公開': 'bg-red-100 text-red-600',
};

const MOCK_ITEMS: WorkflowItem[] = [
  { id: 1, title: '2026年版 住宅ローン金利比較ガイド', type: '記事', author: '田中 太郎', status: 'レビュー待ち', submittedDate: '2026-03-21 10:30' },
  { id: 2, title: '春の完成見学会 in 横浜', type: 'イベント', author: '佐藤 花子', status: 'レビュー待ち', submittedDate: '2026-03-21 09:15' },
  { id: 3, title: '木造住宅の耐震性能を徹底解説', type: '動画', author: '山田 次郎', status: '公開予定', submittedDate: '2026-03-20 15:45', scheduledDate: '2026-03-25 09:00' },
  { id: 4, title: '住宅補助金2026年最新情報', type: 'ニュース', author: '高橋 一郎', status: '公開予定', submittedDate: '2026-03-20 14:20', scheduledDate: '2026-03-23 10:00' },
  { id: 5, title: '30代夫婦の家づくり体験記', type: 'お客様の声', author: '佐藤 花子', status: 'レビュー待ち', submittedDate: '2026-03-20 11:00' },
  { id: 6, title: '初めてのマイホーム購入セミナー', type: 'ウェビナー', author: '田中 太郎', status: '公開中', submittedDate: '2026-03-18 09:00' },
  { id: 7, title: '断熱材の選び方完全ガイド', type: '記事', author: '山田 次郎', status: '下書き', submittedDate: '2026-03-19 16:30' },
  { id: 8, title: '太陽光パネル設置のメリット・デメリット', type: '記事', author: '鈴木 美咲', status: '下書き', submittedDate: '2026-03-19 14:00' },
  { id: 9, title: 'リフォーム成功のポイント5選', type: '動画', author: '高橋 一郎', status: '公開中', submittedDate: '2026-03-16 10:00' },
  { id: 10, title: '夏のモデルハウス見学フェア', type: 'イベント', author: '佐藤 花子', status: '公開予定', submittedDate: '2026-03-19 13:00', scheduledDate: '2026-04-01 00:00' },
  { id: 11, title: 'ZEH住宅とは？基礎知識まとめ', type: '記事', author: '田中 太郎', status: '非公開', submittedDate: '2026-03-10 09:00' },
  { id: 12, title: '工務店選びの失敗しない方法', type: '動画', author: '山田 次郎', status: '公開中', submittedDate: '2026-03-12 11:30' },
  { id: 13, title: 'キッチンリフォーム事例集', type: '記事', author: '鈴木 美咲', status: 'レビュー待ち', submittedDate: '2026-03-21 08:45' },
  { id: 14, title: '住宅展示場の歩き方', type: 'ウェビナー', author: '高橋 一郎', status: '下書き', submittedDate: '2026-03-20 17:00' },
  { id: 15, title: '注文住宅vs建売住宅 徹底比較', type: 'ニュース', author: '田中 太郎', status: '公開中', submittedDate: '2026-03-15 09:00' },
  { id: 16, title: '子育て世代の間取り提案', type: '記事', author: '佐藤 花子', status: '非公開', submittedDate: '2026-03-08 14:30' },
];

const APPROVAL_HISTORY = [
  { title: '住宅ローン減税 完全攻略ガイド', reviewer: '田中 太郎', action: '承認', comment: '内容確認済み。公開OKです。', date: '2026-03-20 16:00' },
  { title: '古い物件情報 2025年版', reviewer: '高橋 一郎', action: '却下', comment: '情報が古いため更新が必要です。', date: '2026-03-20 14:30' },
  { title: 'リフォーム成功のポイント5選', reviewer: '田中 太郎', action: '承認', comment: 'サムネイルも良いですね。公開します。', date: '2026-03-19 11:00' },
  { title: '工務店選びの失敗しない方法', reviewer: '佐藤 花子', action: '承認', comment: '丁寧な説明で分かりやすいです。', date: '2026-03-18 15:20' },
  { title: 'テスト記事', reviewer: '高橋 一郎', action: '却下', comment: 'テスト投稿のため却下します。', date: '2026-03-17 09:45' },
];

const ALL_STATUSES: ContentStatus[] = ['下書き', 'レビュー待ち', '公開予定', '公開中', '非公開'];

export default function WorkflowPage() {
  const [filterStatus, setFilterStatus] = useState<string>('すべて');
  const [filterType, setFilterType] = useState<string>('すべて');
  const [items, setItems] = useState(MOCK_ITEMS);

  const statusCounts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = items.filter((i) => i.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  const pendingReview = items.filter((i) => i.status === 'レビュー待ち');
  const scheduled = items.filter((i) => i.status === '公開予定');

  const filtered = items.filter((i) => {
    if (filterStatus !== 'すべて' && i.status !== filterStatus) return false;
    if (filterType !== 'すべて' && i.type !== filterType) return false;
    return true;
  });

  const handleApprove = (id: number) => {
    setItems(items.map((i) => i.id === id ? { ...i, status: '公開中' as ContentStatus } : i));
  };

  const handleReject = (id: number) => {
    setItems(items.map((i) => i.id === id ? { ...i, status: '下書き' as ContentStatus } : i));
  };

  const handleCancelSchedule = (id: number) => {
    setItems(items.map((i) => i.id === id ? { ...i, status: '下書き' as ContentStatus, scheduledDate: undefined } : i));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ワークフロー管理</h1>
        <p className="text-sm text-gray-500 mt-1">コンテンツの承認フローとステータスを管理します</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        {ALL_STATUSES.map((s) => (
          <div key={s} className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer hover:shadow-md transition"
            onClick={() => setFilterStatus(s)}>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${STATUS_COLORS[s]}`}>{s}</span>
            <p className="text-2xl font-bold text-gray-900">{statusCounts[s]}</p>
          </div>
        ))}
      </div>

      {/* Pending Review */}
      {pendingReview.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">レビュー待ちキュー</h2>
            <p className="text-xs text-gray-400 mt-0.5">{pendingReview.length}件の承認待ちコンテンツ</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">タイトル</th>
                  <th className="px-4 py-3 font-medium text-gray-500">タイプ</th>
                  <th className="px-4 py-3 font-medium text-gray-500">著者</th>
                  <th className="px-4 py-3 font-medium text-gray-500">提出日</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-right">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pendingReview.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
                    <td className="px-4 py-3 text-gray-600">{item.type}</td>
                    <td className="px-4 py-3 text-gray-600">{item.author}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{item.submittedDate}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleApprove(item.id)}
                          className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-600 transition cursor-pointer">
                          承認
                        </button>
                        <button onClick={() => handleReject(item.id)}
                          className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 transition cursor-pointer">
                          却下
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Scheduled Publications */}
      {scheduled.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">公開予定コンテンツ</h2>
            <p className="text-xs text-gray-400 mt-0.5">{scheduled.length}件のスケジュール済み</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">タイトル</th>
                  <th className="px-4 py-3 font-medium text-gray-500">タイプ</th>
                  <th className="px-4 py-3 font-medium text-gray-500">公開予定日時</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-right">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {scheduled.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
                    <td className="px-4 py-3 text-gray-600">{item.type}</td>
                    <td className="px-4 py-3 text-blue-600 font-medium text-xs">{item.scheduledDate}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleCancelSchedule(item.id)}
                        className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-200 transition cursor-pointer">
                        キャンセル
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Content with Filters */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-gray-900">全コンテンツ一覧</h2>
          <div className="flex gap-3">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30">
              <option value="すべて">全ステータス</option>
              {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30">
              <option value="すべて">全タイプ</option>
              {['記事', '動画', 'イベント', 'ニュース', 'お客様の声', 'ウェビナー'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">タイトル</th>
                <th className="px-4 py-3 font-medium text-gray-500">タイプ</th>
                <th className="px-4 py-3 font-medium text-gray-500">著者</th>
                <th className="px-4 py-3 font-medium text-gray-500">ステータス</th>
                <th className="px-4 py-3 font-medium text-gray-500">更新日</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
                  <td className="px-4 py-3 text-gray-600">{item.type}</td>
                  <td className="px-4 py-3 text-gray-600">{item.author}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{item.submittedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval History */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">承認履歴</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {APPROVAL_HISTORY.map((h, i) => (
            <div key={i} className="px-6 py-4 flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${h.action === '承認' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {h.action === '承認' ? '✓' : '✕'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium">{h.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{h.reviewer}が{h.action} - {h.date}</p>
                <p className="text-xs text-gray-400 mt-1">{h.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
