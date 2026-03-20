import PageHeader from '@/components/ui/PageHeader';

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="利用規約"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: '利用規約' },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="prose prose-sm max-w-none">
            <h2 className="text-lg font-bold text-[#3D2200] mt-8 mb-3">1. 適用範囲</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              本規約は、ぺいほーむ（以下「本サービス」）の利用に関する条件を定めるものです。
            </p>

            <h2 className="text-lg font-bold text-[#3D2200] mt-8 mb-3">2. サービス内容</h2>
            <ul className="text-sm text-gray-600 leading-relaxed space-y-1 mb-6 list-disc pl-5">
              <li>住宅に関する動画・記事コンテンツの提供</li>
              <li>無料住宅相談サービス</li>
              <li>工務店・ハウスメーカーの紹介</li>
              <li>資料請求・見学会予約の紹介</li>
              <li>住宅ローンシミュレーターの提供</li>
            </ul>

            <h2 className="text-lg font-bold text-[#3D2200] mt-8 mb-3">3. 禁止事項</h2>
            <ul className="text-sm text-gray-600 leading-relaxed space-y-1 mb-6 list-disc pl-5">
              <li>虚偽の情報を登録する行為</li>
              <li>他のユーザーまたは第三者の権利を侵害する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>商業目的での無断利用</li>
            </ul>

            <h2 className="text-lg font-bold text-[#3D2200] mt-8 mb-3">4. 免責事項</h2>
            <ul className="text-sm text-gray-600 leading-relaxed space-y-1 mb-6 list-disc pl-5">
              <li>本サービスで提供する物件情報・価格は参考値であり、実際とは異なる場合があります</li>
              <li>紹介した工務店との契約に関して、当社は責任を負いません</li>
              <li>住宅ローンシミュレーターの計算結果は概算です</li>
            </ul>

            <h2 className="text-lg font-bold text-[#3D2200] mt-8 mb-3">5. 知的財産権</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              本サービスに掲載されるコンテンツの著作権は当社に帰属します。
            </p>

            <h2 className="text-lg font-bold text-[#3D2200] mt-8 mb-3">6. 規約の変更</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              本規約は予告なく変更される場合があります。
            </p>

            <h2 className="text-lg font-bold text-[#3D2200] mt-8 mb-3">7. 準拠法・管轄</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              本規約は日本法に準拠し、鹿児島地方裁判所を第一審の専属的合意管轄とします。
            </p>

            <p className="text-sm text-gray-400 mt-8">制定日：2026年3月19日</p>
          </div>
        </div>
      </section>
    </>
  );
}
