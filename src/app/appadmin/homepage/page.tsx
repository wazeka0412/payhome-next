'use client';

import { useState } from 'react';

interface SectionItem {
  id: string;
  title: string;
}

interface HeroSlide {
  title: string;
  youtubeId: string;
  viewCount: string;
}

interface HomepageSection {
  key: string;
  label: string;
  max: number;
  visible: boolean;
  items: SectionItem[];
  available: SectionItem[];
}

const MOCK_VIDEOS: SectionItem[] = [
  { id: 'v1', title: '【完全版】注文住宅の流れを徹底解説' },
  { id: 'v2', title: '住宅ローン審査に通るためのポイント5選' },
  { id: 'v3', title: '失敗しない土地選びのコツ' },
  { id: 'v4', title: '断熱性能で選ぶ住宅メーカー比較' },
  { id: 'v5', title: '2026年最新の住宅補助金まとめ' },
  { id: 'v6', title: '平屋vs二階建て｜メリット・デメリット比較' },
  { id: 'v7', title: 'ZEH住宅のリアルな光熱費を公開' },
  { id: 'v8', title: '間取りで後悔しないための7つのルール' },
];

const MOCK_INTERVIEWS: SectionItem[] = [
  { id: 'i1', title: '大和工務店 代表取材レポート' },
  { id: 'i2', title: '自然素材の家づくり｜匠建設インタビュー' },
  { id: 'i3', title: '省エネ住宅のパイオニア｜グリーンホーム取材' },
  { id: 'i4', title: '地域密着30年｜まちの工務店の挑戦' },
];

const MOCK_NEWS: SectionItem[] = [
  { id: 'n1', title: '住宅ローン金利が過去最低を更新' },
  { id: 'n2', title: '2026年度の住宅エコポイント制度が決定' },
  { id: 'n3', title: '建築基準法改正のポイント解説' },
  { id: 'n4', title: '木材価格の最新動向レポート' },
  { id: 'n5', title: '省エネ基準義務化に向けた業界の動き' },
  { id: 'n6', title: '住宅展示場来場者数が回復傾向' },
];

const MOCK_ARTICLES: SectionItem[] = [
  { id: 'a1', title: '初めての家づくり完全ガイド' },
  { id: 'a2', title: '住宅ローンの選び方｜変動金利vs固定金利' },
  { id: 'a3', title: '間取りの基本｜LDKの広さの目安' },
  { id: 'a4', title: '外構費用の相場と節約術' },
  { id: 'a5', title: '住宅保険の賢い選び方' },
];

const MOCK_REVIEWS: SectionItem[] = [
  { id: 'r1', title: '東京都 S様｜理想の平屋が実現しました' },
  { id: 'r2', title: '神奈川県 T様｜断熱性能に大満足です' },
  { id: 'r3', title: '埼玉県 M様｜予算内で夢のマイホーム' },
  { id: 'r4', title: '千葉県 K様｜担当者の対応が素晴らしかった' },
  { id: 'r5', title: '大阪府 Y様｜家族全員が快適に暮らしています' },
  { id: 'r6', title: '愛知県 A様｜光熱費が以前の半分になりました' },
  { id: 'r7', title: '福岡県 N様｜アフターサポートも安心' },
];

const INITIAL_SECTIONS: HomepageSection[] = [
  { key: 'featured', label: '注目動画', max: 3, visible: true, items: MOCK_VIDEOS.slice(0, 3), available: MOCK_VIDEOS },
  { key: 'latest', label: '最新動画', max: 3, visible: true, items: MOCK_VIDEOS.slice(3, 6), available: MOCK_VIDEOS },
  { key: 'interviews', label: '取材カード', max: 2, visible: true, items: MOCK_INTERVIEWS.slice(0, 2), available: MOCK_INTERVIEWS },
  { key: 'news', label: 'ニュース', max: 4, visible: true, items: MOCK_NEWS.slice(0, 4), available: MOCK_NEWS },
  { key: 'articles', label: 'お役立ち記事', max: 3, visible: true, items: MOCK_ARTICLES.slice(0, 3), available: MOCK_ARTICLES },
  { key: 'reviews', label: 'お客様の声', max: 5, visible: true, items: MOCK_REVIEWS.slice(0, 5), available: MOCK_REVIEWS },
];

export default function HomepageAdmin() {
  const [sections, setSections] = useState<HomepageSection[]>(INITIAL_SECTIONS);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    { title: '家づくりの第一歩を、ここから。', youtubeId: 'dQw4w9WgXcQ', viewCount: '125,400' },
    { title: '理想の住まいが見つかる場所', youtubeId: 'abc123def45', viewCount: '89,200' },
    { title: 'プロが教える住宅選びのポイント', youtubeId: 'xyz789ghi01', viewCount: '67,800' },
  ]);
  const [mainTagline, setMainTagline] = useState('家づくりをもっと、わかりやすく。');
  const [subTagline, setSubTagline] = useState('住宅のプロが届ける、家づくりの情報メディア');
  const [saved, setSaved] = useState(false);

  const toggleVisibility = (key: string) => {
    setSections((prev) => prev.map((s) => (s.key === key ? { ...s, visible: !s.visible } : s)));
  };

  const removeItem = (sectionKey: string, itemId: string) => {
    setSections((prev) => prev.map((s) => (s.key === sectionKey ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s)));
  };

  const addItem = (sectionKey: string, itemId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.key !== sectionKey) return s;
        if (s.items.length >= s.max) return s;
        const item = s.available.find((a) => a.id === itemId);
        if (!item || s.items.some((i) => i.id === itemId)) return s;
        return { ...s, items: [...s.items, item] };
      })
    );
  };

  const moveItem = (sectionKey: string, index: number, direction: -1 | 1) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.key !== sectionKey) return s;
        const newItems = [...s.items];
        const target = index + direction;
        if (target < 0 || target >= newItems.length) return s;
        [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
        return { ...s, items: newItems };
      })
    );
  };

  const updateHeroSlide = (index: number, field: keyof HeroSlide, value: string) => {
    setHeroSlides((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ホームページ管理</h1>
          <p className="text-sm text-gray-500 mt-1">トップページに表示するコンテンツを管理します</p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#E8740C] text-white rounded-lg text-sm font-semibold hover:bg-[#d06a0b] transition cursor-pointer"
        >
          {saved ? '保存しました' : '変更を保存'}
        </button>
      </div>

      {/* キャッチコピー設定 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">キャッチコピー設定</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">メインキャッチコピー</label>
            <input
              type="text"
              value={mainTagline}
              onChange={(e) => setMainTagline(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">サブキャッチコピー</label>
            <input
              type="text"
              value={subTagline}
              onChange={(e) => setSubTagline(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
            />
          </div>
        </div>
      </div>

      {/* ヒーロースライド設定 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">ヒーロースライド設定</h2>
        <div className="space-y-4">
          {heroSlides.map((slide, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-[#E8740C] bg-[#E8740C]/10 px-2 py-0.5 rounded">スライド {i + 1}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">タイトル</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => updateHeroSlide(i, 'title', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">YouTube ID</label>
                  <input
                    type="text"
                    value={slide.youtubeId}
                    onChange={(e) => updateHeroSlide(i, 'youtubeId', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">再生回数</label>
                  <input
                    type="text"
                    value={slide.viewCount}
                    onChange={(e) => updateHeroSlide(i, 'viewCount', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* セクション管理 */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.key} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">{section.label}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  section.items.length >= section.max
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {section.items.length}/{section.max}
                </span>
              </div>
              <button
                onClick={() => toggleVisibility(section.key)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition cursor-pointer ${
                  section.visible
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {section.visible ? '表示中' : '非表示'}
              </button>
            </div>

            {/* 現在のアイテム */}
            <div className="space-y-2 mb-4">
              {section.items.length === 0 && (
                <p className="text-sm text-gray-400 py-2">アイテムがありません</p>
              )}
              {section.items.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-xs text-gray-400 w-5 text-center">{idx + 1}</span>
                  <span className="flex-1 text-sm text-gray-800 truncate">{item.title}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveItem(section.key, idx, -1)}
                      disabled={idx === 0}
                      className="w-6 h-6 flex items-center justify-center text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer disabled:cursor-default"
                      title="上に移動"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveItem(section.key, idx, 1)}
                      disabled={idx === section.items.length - 1}
                      className="w-6 h-6 flex items-center justify-center text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer disabled:cursor-default"
                      title="下に移動"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => removeItem(section.key, item.id)}
                      className="w-6 h-6 flex items-center justify-center text-xs text-red-400 hover:text-red-600 cursor-pointer"
                      title="削除"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 追加 */}
            {section.items.length < section.max && (
              <div className="flex items-center gap-2">
                <select
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C] bg-white"
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      addItem(section.key, e.target.value);
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="" disabled>アイテムを選択...</option>
                  {section.available
                    .filter((a) => !section.items.some((i) => i.id === a.id))
                    .map((a) => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                </select>
                <span className="text-xs text-gray-400">追加</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
