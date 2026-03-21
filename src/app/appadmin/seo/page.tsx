'use client';

import { useState } from 'react';

const CLS = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]';

type PageSeo = {
  path: string;
  title: string;
  description: string;
  index: boolean;
};

const INITIAL_PAGES: PageSeo[] = [
  { path: '/', title: 'ぺいほーむ - 住宅の全てがわかるプラットフォーム', description: '住宅購入・建築に関する動画、イベント、工務店情報を提供', index: true },
  { path: '/videos', title: '動画コンテンツ一覧 | ぺいほーむ', description: '住宅・建築に関する動画コンテンツをご覧いただけます', index: true },
  { path: '/events', title: '見学会・イベント | ぺいほーむ', description: '住宅完成見学会やセミナーイベントの情報', index: true },
  { path: '/interviews', title: '取材・レポート | ぺいほーむ', description: '工務店や住宅メーカーへの取材記事', index: true },
  { path: '/reviews', title: 'お客様の声 | ぺいほーむ', description: '実際に家を建てたお客様の体験談', index: true },
  { path: '/builders', title: '工務店一覧 | ぺいほーむ', description: '厳選された工務店・住宅メーカーの一覧', index: true },
  { path: '/articles', title: 'お役立ち記事 | ぺいほーむ', description: '住宅に関する知識やノウハウ記事', index: true },
  { path: '/contact', title: 'お問い合わせ | ぺいほーむ', description: 'ぺいほーむへのお問い合わせ', index: false },
  { path: '/privacy', title: 'プライバシーポリシー | ぺいほーむ', description: '個人情報の取り扱いについて', index: false },
];

export default function SeoPage() {
  const [siteTitle, setSiteTitle] = useState('ぺいほーむ - 住宅の全てがわかるプラットフォーム');
  const [siteDesc, setSiteDesc] = useState('住宅購入・建築に関する動画、見学会、工務店情報、お客様の声など、家づくりに必要な情報をワンストップで提供するプラットフォームです。');
  const [ogpImage, setOgpImage] = useState('https://payhome.jp/images/ogp-default.jpg');
  const [favicon, setFavicon] = useState('/favicon.ico');
  const [gaId, setGaId] = useState('G-XXXXXXXXXX');
  const [gscCode, setGscCode] = useState('google-site-verification=xxxxxxxxxxxxxxxxxxxx');
  const [robots, setRobots] = useState(`User-agent: *\nAllow: /\nDisallow: /appadmin/\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://payhome.jp/sitemap.xml`);
  const [orgName, setOrgName] = useState('株式会社ぺいほーむ');
  const [orgLogo, setOrgLogo] = useState('https://payhome.jp/images/logo.png');
  const [orgContact, setOrgContact] = useState('info@payhome.jp');
  const [ogpTitleTpl, setOgpTitleTpl] = useState('{title} | ぺいほーむ');
  const [ogpDescTpl, setOgpDescTpl] = useState('{description} - ぺいほーむで住宅情報を見つけよう');
  const [sitemapAuto, setSitemapAuto] = useState(true);
  const [excludedPaths, setExcludedPaths] = useState(['/admin', '/appadmin', '/api', '/private']);
  const [newExclude, setNewExclude] = useState('');
  const [pages, setPages] = useState(INITIAL_PAGES);
  const [saved, setSaved] = useState(false);
  const [gaConnected] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addExclude = () => {
    const v = newExclude.trim();
    if (v && !excludedPaths.includes(v)) {
      setExcludedPaths([...excludedPaths, v]);
      setNewExclude('');
    }
  };

  const togglePageIndex = (idx: number) => {
    setPages(pages.map((p, i) => i === idx ? { ...p, index: !p.index } : p));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO・メタ設定</h1>
          <p className="text-sm text-gray-500 mt-1">サイト全体のSEO設定とメタ情報を管理します</p>
        </div>
        <button onClick={handleSave}
          className="bg-[#E8740C] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#d4680b] transition cursor-pointer">
          {saved ? '保存しました' : '全設定を保存'}
        </button>
      </div>

      {/* GA Status */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${gaConnected ? 'bg-green-400' : 'bg-red-400'}`} />
        <span className="text-sm text-gray-700">Google Analytics:</span>
        <span className={`text-sm font-medium ${gaConnected ? 'text-green-600' : 'text-red-600'}`}>
          {gaConnected ? '接続済み' : '未接続'}
        </span>
        <span className="text-xs text-gray-400 ml-2">{gaId}</span>
      </div>

      <div className="space-y-6">
        {/* Site-wide defaults */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4">サイト基本設定</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">サイトタイトル</label>
              <input type="text" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} className={CLS} />
              <p className="text-xs text-gray-400 mt-1">{siteTitle.length} / 60文字</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">サイトディスクリプション</label>
              <textarea value={siteDesc} onChange={(e) => setSiteDesc(e.target.value)} rows={3} className={CLS} />
              <p className="text-xs text-gray-400 mt-1">{siteDesc.length} / 160文字</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">OGP画像 URL</label>
                <input type="text" value={ogpImage} onChange={(e) => setOgpImage(e.target.value)} className={CLS} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">ファビコン URL</label>
                <input type="text" value={favicon} onChange={(e) => setFavicon(e.target.value)} className={CLS} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Google Analytics ID</label>
                <input type="text" value={gaId} onChange={(e) => setGaId(e.target.value)} className={CLS} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Google Search Console 認証コード</label>
                <input type="text" value={gscCode} onChange={(e) => setGscCode(e.target.value)} className={CLS} />
              </div>
            </div>
          </div>
        </div>

        {/* robots.txt */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4">robots.txt エディタ</h2>
          <textarea value={robots} onChange={(e) => setRobots(e.target.value)} rows={8} className={CLS + ' font-mono text-xs'} />
        </div>

        {/* Structured Data */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4">構造化データ設定</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">組織名</label>
              <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} className={CLS} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">ロゴ URL</label>
              <input type="text" value={orgLogo} onChange={(e) => setOrgLogo(e.target.value)} className={CLS} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">連絡先メール</label>
              <input type="email" value={orgContact} onChange={(e) => setOrgContact(e.target.value)} className={CLS} />
            </div>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4">ソーシャル共有設定</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">OGPタイトルテンプレート</label>
              <input type="text" value={ogpTitleTpl} onChange={(e) => setOgpTitleTpl(e.target.value)} className={CLS} />
              <p className="text-xs text-gray-400 mt-1">{'{title}'} はページタイトルに置換されます</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">OGPディスクリプションテンプレート</label>
              <input type="text" value={ogpDescTpl} onChange={(e) => setOgpDescTpl(e.target.value)} className={CLS} />
              <p className="text-xs text-gray-400 mt-1">{'{description}'} はページ説明文に置換されます</p>
            </div>
          </div>
        </div>

        {/* Sitemap */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4">サイトマップ設定</h2>
          <div className="flex items-center gap-3 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={sitemapAuto} onChange={(e) => setSitemapAuto(e.target.checked)}
                className="w-4 h-4 accent-[#E8740C] cursor-pointer" />
              <span className="text-sm text-gray-700">サイトマップを自動生成する</span>
            </label>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-2">除外パス</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {excludedPaths.map((p, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                  {p}
                  <button onClick={() => setExcludedPaths(excludedPaths.filter((_, j) => j !== i))}
                    className="text-gray-400 hover:text-red-500 cursor-pointer ml-0.5">&times;</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="/example-path" value={newExclude} onChange={(e) => setNewExclude(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExclude(); } }}
                className={CLS + ' flex-1 max-w-xs'} />
              <button onClick={addExclude} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition cursor-pointer">追加</button>
            </div>
          </div>
        </div>

        {/* Page-specific SEO */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-6 pb-4">
            <h2 className="text-sm font-bold text-gray-900">ページ別SEO設定</h2>
            <p className="text-xs text-gray-400 mt-1">各ページのタイトル・ディスクリプション・インデックス状態を管理</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">パス</th>
                  <th className="px-4 py-3 font-medium text-gray-500">タイトル</th>
                  <th className="px-4 py-3 font-medium text-gray-500">ディスクリプション</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-center">インデックス</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pages.map((p, idx) => (
                  <tr key={p.path} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{p.path}</td>
                    <td className="px-4 py-3">
                      <input type="text" value={p.title}
                        onChange={(e) => setPages(pages.map((pg, i) => i === idx ? { ...pg, title: e.target.value } : pg))}
                        className="border border-transparent hover:border-gray-200 focus:border-[#E8740C] rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-[#E8740C]/30" />
                    </td>
                    <td className="px-4 py-3">
                      <input type="text" value={p.description}
                        onChange={(e) => setPages(pages.map((pg, i) => i === idx ? { ...pg, description: e.target.value } : pg))}
                        className="border border-transparent hover:border-gray-200 focus:border-[#E8740C] rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-[#E8740C]/30" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => togglePageIndex(idx)}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition ${p.index ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {p.index ? 'index' : 'noindex'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
