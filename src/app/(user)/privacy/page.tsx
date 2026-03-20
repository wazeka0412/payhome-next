import PageHeader from '@/components/ui/PageHeader';

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="プライバシーポリシー"
        breadcrumbs={[
          { label: 'ホーム', href: '/' },
          { label: 'プライバシーポリシー' },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="prose prose-sm max-w-none">
            <h2 className="text-lg font-bold text-[#3D2200] mt-8 mb-3">1. はじめに</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              ぺいほーむ（運営：株式会社wazeka、以下「当社」）は、ユーザーの個人情報の保護を重要な責務と認識し、以下のとおりプライバシーポリシーを定めます。
            </p>

            <h2 className="text-lg font-bold text-[#3D2200] mt-8 mb-3">2. 収集する個人情報</h2>
            <ul className="text-sm text-gray-600 leading-relaxed space-y-1 mb-6 list-disc pl-5">
              <li>お名前、メールアドレス、電話番号、ご住所</li>
              <li>お問い合わせ・相談内容</li>
              <li>資料請求・見学会予約の申込情報</li>
              <li>ウェブサイトの閲覧履歴（Cookie等）</li>
            </ul>

            <h2 className="text-lg font-bold text-[#3D2200] mt-8 mb-3">3. 個人情報の利用目的</h2>
            <ul className="text-sm text-gray-600 leading-relaxed space-y-1 mb-6 list-disc pl-5">
              <li>無料住宅相談サービスの提供</li>
              <li>資料請求の対応・カタログの発送</li>
              <li>見学会・イベントの予約管理</li>
              <li>提携工務店へのお客様情報のご紹介（ご同意の上）</li>
              <li>サービスの改善・新機能の開発</li>
              <li>メールマガジン・お知らせの配信（ご同意の上）</li>
            </ul>

            <h2 className="text-lg font-bold text-[#3D2200] mt-8 mb-3">4. 個人情報の第三者提供</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              当社は、以下の場合を除き、個人情報を第三者に提供しません。
            </p>
            <ul className="text-sm text-gray-600 leading-relaxed space-y-1 mb-6 list-disc pl-5">
              <li>ご本人の同意がある場合</li>
              <li>提携工務店へのご紹介（無料相談・資料請求の場合）</li>
              <li>法令に基づく場合</li>
            </ul>

            <h2 className="text-lg font-bold text-[#3D2200] mt-8 mb-3">5. 個人情報の管理</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              適切な安全管理措置を講じ、不正アクセス・漏洩・改ざん等の防止に努めます。
            </p>

            <h2 className="text-lg font-bold text-[#3D2200] mt-8 mb-3">6. Cookieの使用</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              当サイトではCookieを使用しています。ブラウザの設定により無効化可能です。
            </p>

            <h2 className="text-lg font-bold text-[#3D2200] mt-8 mb-3">7. お問い合わせ</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              株式会社wazeka<br />
              所在地：鹿児島県鹿児島市<br />
              メール：info@wazeka.co.jp
            </p>

            <p className="text-sm text-gray-400 mt-8">制定日：2026年3月19日</p>
          </div>
        </div>
      </section>
    </>
  );
}
