'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { SITE_STATS } from '@/lib/site-config';

const mediaStats = [
  { number: SITE_STATS.youtubeSubscribers, label: 'YouTube登録者数' },
  { number: SITE_STATS.monthlyViews, label: '月間再生数' },
  { number: SITE_STATS.averageWatchTime, label: '平均視聴回数/本' },
  { number: '25-45歳', label: '主な視聴者層' },
];

const tieupMenus = [
  { key: 'tieup-video', title: 'タイアップ動画', desc: 'ぺいほーむのYouTubeチャンネルで御社の商品・サービスを紹介するタイアップ動画を制作・配信します。', icon: '/images/tieup_video.png', detail: { description: 'ぺいほーむのYouTubeチャンネル（4.28万登録者）で、御社の商品・サービスを紹介する動画を制作・配信します。', services: ['企画構成・台本作成', 'プロクルーによる撮影（半日〜1日）', '編集・テロップ・BGM・サムネイル制作', 'YouTube公開 + SNSでの告知投稿', '公開後1ヶ月間のレポート提出'], price: 'お問い合わせください', result: '再生回数 3.2万回 / 視聴維持率 52%' } },
  { key: 'tieup-article', title: 'タイアップ記事', desc: 'ぺいほーむのWEBメディアに御社の商品・サービスを紹介するスポンサード記事を掲載します。', icon: '/images/tieup_article.png', detail: { description: 'ぺいほーむのWEBメディアに、御社の商品・サービスを紹介するスポンサード記事を掲載します。', services: ['取材・ヒアリング（オンライン or 訪問）', '3,000〜5,000字の記事制作', '写真撮影 or 素材提供での構成', 'SEO最適化（検索流入を狙う設計）', 'SNSでの告知投稿（Instagram・X）'], price: 'お問い合わせください', result: '月間PV 8,000 / 平均滞在時間 3分12秒' } },
  { key: 'tieup-magazine', title: '月刊ぺいほーむ掲載', desc: 'デジタルマガジン「月刊ぺいほーむ」に広告枠またはタイアップ特集として掲載いたします。', icon: '/images/tieup_magazine.png', detail: { description: 'デジタルマガジン「月刊ぺいほーむ」に広告枠またはタイアップ特集として掲載いたします。', services: ['純広告枠：1/2ページ or 1ページの広告掲載', 'タイアップ特集：2〜4ページの編集記事風コンテンツ', '表紙周り：表2・表3・表4の広告枠'], price: 'お問い合わせください', result: '毎月 3,500人以上がダウンロード' } },
  { key: 'tieup-event', title: 'イベント・ウェビナー協賛', desc: 'ぺいほーむ主催のウェビナーやイベントへの協賛・共催が可能です。ターゲット層への直接訴求ができます。', icon: '/images/tieup_event.png', detail: { description: 'ぺいほーむ主催のウェビナーやイベントへの協賛・共催で、ターゲット層へ直接訴求できます。', services: ['冠スポンサー：イベント名に社名を冠し、登壇枠を提供', 'プレゼンスポンサー：10分間のプレゼン枠を提供', 'ブース協賛：会場イベント時の展示ブース提供', 'ロゴ掲載：告知バナー・動画内にロゴを掲出'], price: 'お問い合わせください', result: 'ウェビナー平均参加者 100名 / アーカイブ視聴 500名' } },
];

const tieupCases = [
  { key: 'case-dannetsu', tag: 'タイアップ', date: '2026.02', title: '○○建材様｜次世代断熱材の施工現場に密着', excerpt: '再生回数 5.8万回。建材メーカー様の新製品を施工現場取材形式でご紹介。', detail: { headline: '再生回数 5.8万回のタイアップ動画', description: '建材メーカー様の新しい断熱材を、実際の施工現場で職人さんの声とともに紹介。施工性の良さと断熱性能を視覚的に訴求しました。', results: ['再生回数：5.8万回', '高評価率：96.2%', 'コメント数：142件', '製品ページへの遷移：820件', '問い合わせ増加：前月比 +35%'], quote: '「施工現場のリアルな映像が工務店さんに響き、サンプル請求が大幅に増えました。ぺいほーむさんの住宅業界への理解度が高く、安心してお任せできました。」' } },
  { key: 'case-kitchen', tag: 'タイアップ', date: '2026.01', title: '△△住設様｜最新キッチン設備を徹底レビュー', excerpt: '再生回数 4.2万回。住宅設備メーカー様のショールーム取材企画。', detail: { headline: '再生回数 4.2万回のショールーム取材企画', description: '住宅設備メーカー様の最新ショールームを訪問し、キッチン設備の機能性・デザイン性を実演を交えて紹介しました。', results: ['再生回数：4.2万回', '視聴維持率：58%（チャンネル平均+12%）', 'ショールーム来場予約：+45%', 'カタログ請求：320件'], quote: '「動画を見てショールームに来てくれるお客様が増え、"あの動画の製品が見たい"と指名での来場が増えました。」' } },
  { key: 'case-loan', tag: '記事タイアップ', date: '2025.12', title: '□□ローン様｜住宅ローン選びのポイント特集', excerpt: '月間PV 1.2万。金融機関様との住宅ローン特集記事タイアップ。', detail: { headline: '月間PV 1.2万の記事タイアップ', description: '金融機関様との共同企画として、住宅ローンの選び方ガイド記事を制作。専門家インタビューと具体的なシミュレーション例を盛り込みました。', results: ['月間PV：12,000', '平均滞在時間：4分38秒', 'ローン相談申し込み：月68件', '検索順位：「住宅ローン 選び方 九州」3位'], quote: '「SEOに強い記事を制作いただき、公開から半年経った今も安定した流入があります。コンテンツの質が高く、ブランドイメージの向上にも繋がりました。」' } },
];

type ModalData = { title: string; body: React.ReactNode } | null;

export default function AdPage() {
  const [modal, setModal] = useState<ModalData>(null);

  const openTieupModal = (item: typeof tieupMenus[0]) => {
    setModal({
      title: item.title,
      body: (
        <div>
          <p className="text-gray-600 mb-4">{item.detail.description}</p>
          <h4 className="font-bold text-sm mb-2 text-[#E8740C]">プラン内容</h4>
          <ul className="list-disc pl-5 mb-4 text-sm text-gray-600 space-y-1">
            {item.detail.services.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <h4 className="font-bold text-sm mb-2 text-[#E8740C]">料金目安</h4>
          <p className="text-sm text-gray-600 mb-4">{item.detail.price}</p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm"><strong>実績：</strong>{item.detail.result}</div>
        </div>
      ),
    });
  };

  const openCaseModal = (cs: typeof tieupCases[0]) => {
    setModal({
      title: cs.title,
      body: (
        <div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 font-bold text-center">{cs.detail.headline}</div>
          <h4 className="font-bold text-sm mb-2 text-[#E8740C]">タイアップ概要</h4>
          <p className="text-sm text-gray-600 mb-4">{cs.detail.description}</p>
          <h4 className="font-bold text-sm mb-2 text-[#E8740C]">成果</h4>
          <ul className="list-disc pl-5 mb-4 text-sm text-gray-600 space-y-1">
            {cs.detail.results.map((r) => <li key={r}>{r}</li>)}
          </ul>
          <h4 className="font-bold text-sm mb-2 text-[#E8740C]">クライアント様の声</h4>
          <blockquote className="border-l-4 border-[#E8740C] pl-4 italic text-sm text-gray-600">{cs.detail.quote}</blockquote>
        </div>
      ),
    });
  };

  return (
    <>
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-400 mb-4"><Link href="/biz" className="hover:text-white">ホーム</Link> &gt; 広告・タイアップ</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">広告・タイアップのご案内</h1>
          <p className="text-gray-300">住宅関連商材の認知拡大・集客をぺいほーむがサポートします。</p>
        </div>
      </div>

      {/* Media Data */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">Media Data</p><h2 className="text-2xl md:text-3xl font-extrabold">メディアデータ</h2></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {mediaStats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-[#E8740C] font-mono">{s.number}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-xs text-gray-400">視聴者の約70%が住宅購入を検討中または計画中の方です。九州エリアの視聴者が全体の約45%を占めます。</p>
        </div>
      </section>

      {/* Tieup Menu */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">Menu</p><h2 className="text-2xl md:text-3xl font-extrabold">タイアップメニュー</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tieupMenus.map((item) => (
              <div key={item.key} onClick={() => openTieupModal(item)} className="cursor-pointer group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition">
                <div className="w-16 h-16 mb-4"><Image src={item.icon} alt={item.title} width={64} height={64} className="w-full h-full object-contain" /></div>
                <h4 className="text-lg font-bold mb-2 group-hover:text-[#E8740C] transition">{item.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tieup Cases */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12"><p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">Case</p><h2 className="text-2xl md:text-3xl font-extrabold">タイアップ事例</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tieupCases.map((cs) => (
              <div key={cs.key} onClick={() => openCaseModal(cs)} className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition">
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-sm relative">
                  {cs.tag === 'タイアップ' && <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-300">&#9654;</div>}
                  {cs.tag === 'タイアップ' ? 'Thumbnail' : 'Article Image'}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs bg-orange-50 text-[#E8740C] font-semibold px-2 py-0.5 rounded">{cs.tag}</span>
                    <span className="text-xs text-gray-400">{cs.date}</span>
                  </div>
                  <h3 className="font-bold text-sm leading-snug mb-2">{cs.title}</h3>
                  <p className="text-xs text-gray-500">{cs.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit CTA */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-20 text-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm tracking-widest uppercase mb-2 opacity-80">Media Kit</p>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">媒体資料をダウンロード</h2>
          <p className="opacity-90 mb-8">メディアデータ・タイアップメニュー・料金の詳細をまとめた媒体資料をご用意しております。</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#" className="bg-white text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition">媒体資料をダウンロード</a>
            <Link href="/biz/contact" className="border-2 border-white/50 text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition">お問い合わせはこちら</Link>
          </div>
        </div>
      </section>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100"><h3 className="text-lg font-bold">{modal.title}</h3><button onClick={() => setModal(null)} className="text-gray-400 text-2xl hover:text-gray-600">&times;</button></div>
            <div className="p-6">{modal.body}</div>
            <div className="p-6 pt-0 text-center"><Link href="/biz/contact" className="inline-block bg-[#E8740C] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#D4660A] transition">お問い合わせはこちら</Link></div>
          </div>
        </div>
      )}
    </>
  );
}
