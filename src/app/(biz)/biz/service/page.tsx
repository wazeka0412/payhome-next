'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const plans = [
  {
    key: 'plan-roomtour',
    title: 'ルームツアー撮影',
    desc: 'プロの映像クルーが完成物件を撮影。YouTube・Instagram・ホームページで活用できる高品質な動画を制作します。',
    icon: '/images/service_roomtour.png',
    detail: {
      description: 'プロの映像クルーが完成物件を撮影し、高品質なルームツアー動画を制作します。',
      services: ['4K撮影・ドローン空撮対応', '企画構成・台本作成', 'プロによる編集・テロップ・BGM挿入', 'YouTube・Instagram向け最適化', 'サムネイル制作込み'],
      recommended: ['動画を活用した集客を始めたい', '自社で撮影・編集のリソースがない', 'YouTubeチャンネルを開設したい'],
      result: '平均再生回数 1.5万回 / 最高再生回数 11万回',
    },
  },
  {
    key: 'plan-sns',
    title: 'SNS運用代行',
    desc: 'Instagram・YouTube・TikTokの企画・投稿・分析をまるごとお任せ。住宅特化のコンテンツ設計でフォロワーと反響を獲得します。',
    icon: '/images/service_sns.png',
    detail: {
      description: 'Instagram・YouTube・TikTokの企画・投稿・分析をまるごとお任せいただけます。',
      services: ['月次コンテンツカレンダー作成', '投稿素材の撮影・制作', 'Instagram：フィード・リール・ストーリーズ運用', 'コメント・DM対応サポート', '月次レポート・改善提案'],
      recommended: ['SNSアカウントはあるが運用が止まっている', 'フォロワーを増やして反響を獲得したい', '投稿ネタや運用ノウハウがわからない'],
      result: '運用3ヶ月で平均フォロワー +800人 / エンゲージメント率 4.2%',
    },
  },
  {
    key: 'plan-web',
    title: 'WEB制作',
    desc: '住宅会社に特化したホームページ・LP制作。SEO対策とコンバージョン設計で、WEBからの反響数を最大化します。',
    icon: '/images/service_web.png',
    detail: {
      description: '住宅会社に特化したホームページ・LP制作で、WEBからの反響数を最大化します。',
      services: ['レスポンシブ対応ホームページ制作', '施工事例・お客様の声ページ設計', 'SEO対策（内部構造・コンテンツ最適化）', 'コンバージョン導線設計（CTA最適化）', 'Googleアナリティクス・サーチコンソール設定'],
      recommended: ['ホームページが古くスマホ対応できていない', '来場予約やお問い合わせをWEBで増やしたい', 'SEOで検索上位を狙いたい'],
      result: 'リニューアル後 平均PV +180% / 来場予約 +2.8倍',
    },
  },
  {
    key: 'plan-portal',
    title: 'ポータルサイト掲載＋Smart Match 送客',
    desc: 'AI家づくり診断と Smart Match 連絡希望プロファイルで、本気度の高いユーザーを自動選別して送客。しつこい営業ゼロを実現します。',
    icon: '/images/service_portal.png',
    detail: {
      description: 'ぺいほーむポータルに掲載すると、AI家づくり診断 × Smart Match システムで、ユーザーの希望条件と相性の良い工務店だけに送客されます。ユーザーが事前に連絡時間・頻度・手段を設定しているため、営業ストレスゼロで商談に進めます。',
      services: [
        '工務店プロフィール詳細ページ（施工事例・動画・口コミ付き）',
        'AI家づくり診断からの相性マッチング（上位3社に推薦）',
        '見学会モード連携（体感 / 相談 / 契約検討）',
        '匿名AI仲介質問機能（ユーザーから気軽に質問）',
        '連絡希望プロファイル同期（希望時間・頻度・手段を事前把握）',
        'エリア・特徴・間取りでの検索最適化',
        '工務店ダッシュボードでリード即時確認・対応',
      ],
      recommended: ['&quot;しつこい営業&quot;を避けたい顧客層に届きたい', 'AI診断で本気度の高いリードだけ獲得したい', '地元エリアでの認知度を上げたい'],
      result: '月間サイト訪問者 12,000人 / AI診断経由 成約率 35% / 平均送客 月8件',
    },
  },
];

const cases = [
  {
    key: 'case-a',
    company: 'A工務店（鹿児島市）',
    title: 'YouTube経由の問い合わせが月3件から月15件に増加',
    excerpt: 'ルームツアー動画の定期配信とInstagram運用代行を導入。6ヶ月でYouTube登録者1,200人を達成し、動画経由の反響が5倍に。',
    detail: {
      service: 'スタンダードプラン（ルームツアー撮影 月2本 + Instagram運用代行）',
      results: ['YouTube登録者：0人 → 1,200人', '動画経由の問い合わせ：月3件 → 月15件', 'Instagramフォロワー：300人 → 1,800人', '来場予約数：月5件 → 月12件'],
      quote: '「動画を見て来てくれるお客様が増え、初回面談の質が格段に上がりました。動画で家づくりの想いが伝わるので、商談もスムーズです。」',
    },
  },
  {
    key: 'case-b',
    company: 'Bハウス（福岡市）',
    title: 'WEBリニューアルで来場予約数が2.8倍に',
    excerpt: 'ホームページリニューアルとSEO対策を実施。施工事例ページの充実と動線改善により、月間の来場予約・無料相談数が大幅に向上しました。',
    detail: {
      service: 'WEB制作（フルリニューアル）+ SEO対策 + 月次改善',
      results: ['月間PV：3,200 → 8,500（+166%）', '来場予約数：月12件 → 月34件（2.8倍）', '施工事例ページ直帰率：68% → 32%', 'モバイル表示速度：4.2秒 → 1.8秒'],
      quote: '「以前のサイトはスマホで見づらく、お客様からも指摘がありました。リニューアル後は反響が目に見えて増え、営業担当も喜んでいます。」',
    },
  },
  {
    key: 'case-c',
    company: 'Cホーム（熊本市）',
    title: 'SNS運用開始3ヶ月でモデルハウス来場数1.5倍',
    excerpt: 'Instagramリール動画を中心としたSNS運用を開始。地元ユーザーへのリーチが大幅に増加し、来場予約数の増加に貢献。',
    detail: {
      service: 'ライトプラン（ルームツアー撮影 月1本）+ Instagram運用代行オプション',
      results: ['Instagramリーチ数：月500 → 月15,000', 'リール動画平均再生：8,000回', 'モデルハウス来場数：月20組 → 月30組（1.5倍）', 'Instagram経由の予約：月0件 → 月8件'],
      quote: '「リール動画のおかげで20〜30代のお客様が増えました。地元のフォロワーが多いので、来場に直結しやすいのが嬉しいです。」',
    },
  },
];

const faqs = [
  { q: '対応エリアはどこまでですか？', a: '鹿児島県・九州全域を中心に対応しております。撮影を伴う場合は出張費が別途かかる場合がございますが、まずはお気軽にご相談ください。九州以外のエリアについても個別にご対応可能です。' },
  { q: '契約期間の縛りはありますか？', a: '最低契約期間は6ヶ月となります。SNS運用やYouTubeチャンネルの成長には一定の期間が必要なため、効果を実感いただくための期間設定です。6ヶ月以降は1ヶ月単位での更新が可能です。' },
  { q: '撮影した動画の著作権はどうなりますか？', a: '撮影した動画の利用権はお客様にございます。YouTube、Instagram、ホームページ、チラシなど自由にご活用いただけます。ぺいほーむのメディアでもご紹介させていただく場合がございます。' },
  { q: 'すでにYouTubeチャンネルを持っていますが対応できますか？', a: 'はい、既存チャンネルの運用改善も承っております。現状分析を行い、チャンネル設計の見直しやコンテンツ企画の改善をご提案いたします。新規チャンネル開設からのサポートも可能です。' },
  { q: 'まずは相談だけでも可能ですか？', a: 'もちろんです。無料のオンライン相談を実施しておりますので、お気軽にお問い合わせフォームからご連絡ください。現在の課題やご要望をお伺いし、最適なプランをご提案いたします。' },
];

type ModalData = { title: string; body: React.ReactNode } | null;

export default function ServicePage() {
  const [modal, setModal] = useState<ModalData>(null);
  const [formData, setFormData] = useState({ company: '', name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const openPlanModal = (plan: typeof plans[0]) => {
    setModal({
      title: plan.title,
      body: (
        <div>
          <p className="text-gray-600 mb-4">{plan.detail.description}</p>
          <h4 className="font-bold text-sm mb-2 text-[#E8740C]">サービス内容</h4>
          <ul className="list-disc pl-5 mb-4 text-sm text-gray-600 space-y-1">
            {plan.detail.services.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <h4 className="font-bold text-sm mb-2 text-[#E8740C]">こんな会社におすすめ</h4>
          <ul className="list-disc pl-5 mb-4 text-sm text-gray-600 space-y-1">
            {plan.detail.recommended.map((r) => <li key={r}>{r}</li>)}
          </ul>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm">
            <strong>実績：</strong>{plan.detail.result}
          </div>
        </div>
      ),
    });
  };

  const openCaseModal = (cs: typeof cases[0]) => {
    setModal({
      title: cs.company,
      body: (
        <div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 font-bold text-center">{cs.title}</div>
          <h4 className="font-bold text-sm mb-2 text-[#E8740C]">導入サービス</h4>
          <p className="text-sm text-gray-600 mb-4">{cs.detail.service}</p>
          <h4 className="font-bold text-sm mb-2 text-[#E8740C]">成果</h4>
          <ul className="list-disc pl-5 mb-4 text-sm text-gray-600 space-y-1">
            {cs.detail.results.map((r) => <li key={r}>{r}</li>)}
          </ul>
          <h4 className="font-bold text-sm mb-2 text-[#E8740C]">お客様の声</h4>
          <blockquote className="border-l-4 border-[#E8740C] pl-4 italic text-sm text-gray-600">{cs.detail.quote}</blockquote>
        </div>
      ),
    });
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <img src="/images/pei_surprise.png" alt="ペイさん" className="w-28 h-28 mx-auto mb-6 object-contain" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">お問い合わせありがとうございます！</h2>
          <p className="text-sm text-gray-500 mb-6">内容を確認の上、2営業日以内にご連絡いたします。</p>
          <div className="flex gap-3 justify-center">
            <Link href="/biz" className="bg-[#E8740C] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#D4660A] transition text-sm">トップに戻る</Link>
            <Link href="/biz/service" className="border-2 border-[#E8740C] text-[#E8740C] font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition text-sm">サービス一覧</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-400 mb-4"><Link href="/biz" className="hover:text-white">ホーム</Link> &gt; サービス概要</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">住宅会社の集客を、動画とWEBで変える。</h1>
          <p className="text-gray-300">ルームツアー撮影・SNS運用・WEB制作をワンストップでご提供します。</p>
        </div>
      </div>

      <section className="py-20"><div className="max-w-7xl mx-auto px-4"><div className="text-center mb-12"><p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">Why payhome?</p><h2 className="text-2xl md:text-3xl font-extrabold">なぜ、ぺいほーむなのか</h2></div><div className="max-w-3xl mx-auto space-y-6 text-gray-600 leading-loose"><p>住宅業界の集客は、ポータルサイト依存から脱却し「自社メディア」の時代に突入しています。しかし、多くの住宅会社が動画制作やSNS運用に課題を抱えています。</p><p>ぺいほーむは、YouTube登録者4.28万人の住宅メディアとして培った動画制作ノウハウと、100社以上の住宅会社取材で蓄積した業界理解を強みに、住宅会社の集客を「動画」と「WEB」の両面からサポートします。</p><p>住宅に特化したクリエイティブチームだからこそ、住宅業界の「伝わる動画」「反響が出るSNS」をご提供できます。</p></div></div></section>

      <section className="bg-gray-50 py-20"><div className="max-w-7xl mx-auto px-4"><div className="text-center mb-12"><p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">Service</p><h2 className="text-2xl md:text-3xl font-extrabold">パッケージプラン</h2></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{plans.map((plan) => (<div key={plan.key} onClick={() => openPlanModal(plan)} className="cursor-pointer group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition"><div className="w-16 h-16 mb-4"><Image src={plan.icon} alt={plan.title} width={64} height={64} className="w-full h-full object-contain" /></div><h4 className="text-lg font-bold mb-2 group-hover:text-[#E8740C] transition">{plan.title}</h4><p className="text-sm text-gray-500 leading-relaxed">{plan.desc}</p></div>))}</div></div></section>

      <section className="py-20"><div className="max-w-7xl mx-auto px-4"><div className="mb-12"><p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">Case Study</p><h2 className="text-2xl md:text-3xl font-extrabold">導入事例</h2></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{cases.map((cs) => (<div key={cs.key} onClick={() => openCaseModal(cs)} className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition"><div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">Photo</div><div className="p-6"><p className="text-xs text-[#E8740C] font-semibold mb-2">{cs.company}</p><h3 className="font-bold mb-2 leading-snug">{cs.title}</h3><p className="text-sm text-gray-500 leading-relaxed">{cs.excerpt}</p></div></div>))}</div></div></section>

      {/* ===== 競合比較 ===== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">Comparison</p>
            <h2 className="text-2xl font-extrabold">他社との比較</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 w-1/4"></th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-gray-400">S社</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-gray-400">H社</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-[#E8740C] bg-[#FFF8F0]">ぺいほーむ</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['初期費用', '有償', '有償', '0円'],
                  ['動画コンテンツ', '❌', '❌', '✅ 4.28万人CH'],
                  ['AI診断レコメンド', '❌', '❌', '✅'],
                  ['Smart Match 連携', '❌', '❌', '✅'],
                  ['月額プラン', '必須', '必須', '任意（無料プランあり）'],
                  ['専任担当', '△', '△', '✅（プレミアム）'],
                ].map(([label, s, h, p], i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="py-3.5 px-4 text-sm font-semibold text-gray-700">{label}</td>
                    <td className="py-3.5 px-4 text-center text-sm text-gray-500">{s}</td>
                    <td className="py-3.5 px-4 text-center text-sm text-gray-500">{h}</td>
                    <td className="py-3.5 px-4 text-center text-sm font-bold text-[#E8740C] bg-[#FFF8F0]">{p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20"><div className="max-w-7xl mx-auto px-4"><div className="text-center mb-12"><p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">Pricing</p><h2 className="text-2xl md:text-3xl font-extrabold">料金プラン</h2></div><div className="max-w-3xl mx-auto overflow-x-auto"><table className="w-full border-collapse text-center text-sm"><thead><tr className="bg-gray-900 text-white"><th className="p-4 text-left w-2/5">サービス</th><th className="p-4">料金</th></tr></thead><tbody><tr className="border-b border-gray-200"><th className="p-4 text-left bg-gray-50 font-semibold">記事掲載・プロフィール掲載</th><td className="p-4"><span className="text-[#E8740C] font-extrabold text-xl font-mono">無料</span></td></tr><tr className="border-b border-gray-200"><th className="p-4 text-left bg-gray-50 font-semibold">ルームツアー動画（オプション）</th><td className="p-4"><span className="text-[#E8740C] font-extrabold text-xl font-mono">お問い合わせ</span></td></tr><tr className="border-b border-gray-200"><th className="p-4 text-left bg-gray-50 font-semibold">プレミアム掲載・送客プラン</th><td className="p-4"><span className="text-[#E8740C] font-extrabold text-xl font-mono">お問い合わせ</span></td></tr></tbody></table></div><p className="text-center mt-8 text-xs text-gray-400">※ 記事掲載・工務店プロフィール掲載は完全無料。初期費用ゼロでスタートできます。<br />※ オプションサービスや成果報酬の詳細は、貴社の課題やご予算に合わせて個別にご提案いたします。お気軽にお問い合わせください。</p></div></section>

      <section className="py-20"><div className="max-w-7xl mx-auto px-4"><div className="text-center mb-12"><p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">FAQ</p><h2 className="text-2xl md:text-3xl font-extrabold">よくあるご質問</h2></div><div className="max-w-3xl mx-auto divide-y divide-gray-200">{faqs.map((faq) => (<details key={faq.q} className="group py-4"><summary className="flex items-center justify-between cursor-pointer font-semibold text-sm list-none">{faq.q}<span className="text-[#E8740C] text-lg font-bold group-open:hidden">+</span><span className="text-[#E8740C] text-lg font-bold hidden group-open:inline">-</span></summary><p className="mt-3 text-sm text-gray-500 leading-relaxed">{faq.a}</p></details>))}</div></div></section>

      <section className="bg-gray-50 py-20" id="contact"><div className="max-w-7xl mx-auto px-4"><div className="text-center mb-12"><p className="text-[#E8740C] font-semibold text-sm tracking-widest uppercase mb-2">Contact</p><h2 className="text-2xl md:text-3xl font-extrabold">お問い合わせ</h2></div><form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6"><div><label className="block font-semibold text-sm mb-1">会社名 <span className="text-[#E8740C] text-xs">必須</span></label><input type="text" required placeholder="例：株式会社○○工務店" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition" /></div><div><label className="block font-semibold text-sm mb-1">担当者名 <span className="text-[#E8740C] text-xs">必須</span></label><input type="text" required placeholder="例：山田 太郎" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition" /></div><div><label className="block font-semibold text-sm mb-1">メールアドレス <span className="text-[#E8740C] text-xs">必須</span></label><input type="email" required placeholder="例：info@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition" /></div><div><label className="block font-semibold text-sm mb-1">電話番号</label><input type="tel" placeholder="例：099-000-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition" /></div><div><label className="block font-semibold text-sm mb-1">お問い合わせ内容 <span className="text-[#E8740C] text-xs">必須</span></label><textarea required placeholder="ご質問・ご相談内容をご記入ください" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#E8740C] focus:outline-none transition min-h-[150px] resize-y" /></div><div className="text-center"><button type="submit" className="bg-[#E8740C] text-white font-semibold px-10 py-3 rounded-full hover:bg-[#D4660A] transition">送信する</button></div></form></div></section>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100"><h3 className="text-lg font-bold">{modal.title}</h3><button onClick={() => setModal(null)} className="text-gray-400 text-2xl hover:text-gray-600">&times;</button></div>
            <div className="p-6">{modal.body}</div>
            <div className="p-6 pt-0 text-center"><a href="#contact" onClick={() => setModal(null)} className="inline-block bg-[#E8740C] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#D4660A] transition">お問い合わせはこちら</a></div>
          </div>
        </div>
      )}
    </>
  );
}
