import PageHeader from '@/components/ui/PageHeader';

const members = [
  { role: '代表 / プロデューサー', name: 'ぺい', desc: '鹿児島出身。住宅業界の情報格差をなくしたいという想いからぺいほーむを設立。企画・撮影・編集を統括。' },
  { role: '映像ディレクター', name: 'スタッフA', desc: 'ルームツアーの撮影・編集を担当。住宅の魅力を最大限に引き出す映像表現を追求しています。' },
  { role: 'ライター / 編集', name: 'スタッフB', desc: '取材記事・月刊ぺいほーむの執筆を担当。住宅業界の専門知識をわかりやすく伝えることを心がけています。' },
  { role: 'SNS / マーケティング', name: 'スタッフC', desc: 'SNS運用・マーケティング戦略を担当。視聴者との繋がりを大切にしたコミュニケーションを実践。' },
];

const mediaAchievements = [
  '南日本新聞にぺいほーむの取り組みが掲載されました。',
  'KTS鹿児島テレビの情報番組にて住宅メディアとして紹介。',
  '住宅産業新聞にて九州の住宅系YouTubeチャンネルとして特集。',
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="ぺいほーむとは"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: 'ぺいほーむとは' },
        ]}
      />

      {/* Vision */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/2">
              <p className="text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">Our Vision</p>
              <h2 className="text-2xl font-bold text-[#3D2200] mb-6 leading-relaxed">
                家づくりを、もっと楽しく、<br />もっと身近に。
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  ぺいほーむは鹿児島・九州を拠点に、住宅の魅力を「動画」と「記事」で届ける住宅メディアです。
                </p>
                <p>
                  工務店やハウスメーカーの想いを映像に乗せ、家づくりを検討する方と住宅会社を繋ぐ架け橋でありたい。
                  地元の気候風土を知り尽くしたプロフェッショナルたちの技術と情熱を、全国に届けることが私たちの使命です。
                </p>
                <p>
                  YouTubeチャンネル登録者4.28万人を超え、500本以上の動画を公開。
                  ルームツアーや取材を通じて、リアルな住宅情報をお届けしています。
                </p>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
                About Image
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">Numbers</p>
          <h2 className="text-2xl font-bold text-center text-[#3D2200] mb-10">数字で見るぺいほーむ</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { number: '4.2万+', label: 'YouTube登録者' },
              { number: '500+', label: '公開動画数' },
              { number: '100+', label: '取材企業数' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-[#E8740C] font-mono">{item.number}</div>
                <div className="text-xs text-gray-500 mt-2">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">Members</p>
          <h2 className="text-2xl font-bold text-center text-[#3D2200] mb-10">メンバー紹介</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400 text-xs">
                  Photo
                </div>
                <h3 className="text-xs font-semibold text-[#E8740C] mb-1">{member.role}</h3>
                <p className="text-sm font-bold text-[#3D2200] mb-2">{member.name}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Achievements */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-xs font-semibold tracking-widest text-[#E8740C] uppercase mb-2">Media</p>
          <h2 className="text-2xl font-bold text-center text-[#3D2200] mb-10">メディア実績</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {mediaAchievements.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="w-full h-16 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 text-xs">
                  Media Logo
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
