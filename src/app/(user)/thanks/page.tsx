import Link from 'next/link';
import Image from 'next/image';

export default function ThanksPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3">
        <div className="max-w-7xl mx-auto px-4 text-xs text-gray-500">
          <Link href="/" className="hover:underline">ホーム</Link>
          <span className="mx-1">&gt;</span>
          <Link href="/consultation" className="hover:underline">お問い合わせ</Link>
          <span className="mx-1">&gt;</span>
          <span>送信完了</span>
        </div>
      </div>

      {/* Thanks Main */}
      <section className="py-16 md:py-24">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 text-center relative">
            {/* Character */}
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="w-full h-full bg-[#FFF8F0] rounded-full flex items-center justify-center">
                <Image
                  src="/images/pei_wink.png"
                  alt="ペイさん"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 font-bold text-sm px-4 py-2 rounded-full mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              送信完了
            </div>

            {/* Title & Message */}
            <h1 className="text-2xl font-extrabold text-[#3D2200] mb-4 leading-relaxed">
              お問い合わせを<br />受け付けました
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              お問い合わせいただきありがとうございます。<br />
              ぺいほーむ編集部にて内容を確認の上、<br />
              <strong className="text-gray-700">2営業日以内</strong>にご連絡いたします。
            </p>

            {/* Info Box */}
            <div className="bg-[#FFF8F0] rounded-xl p-5 mb-8 text-left">
              <div className="flex items-center gap-2 text-sm font-bold text-[#3D2200] mb-3">
                <svg className="w-5 h-5 text-[#E8740C]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                ご確認ください
              </div>
              <ul className="space-y-2">
                {[
                  '確認メールをお送りしています。届かない場合は迷惑メールフォルダをご確認ください。',
                  'お急ぎの場合は、お電話でもお問い合わせいただけます。',
                  '営業時間：平日 9:00〜18:00（土日祝休み）',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                    <span className="text-[#E8740C] font-bold shrink-0 mt-0.5">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center bg-[#E8740C] text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-[#D4660A] transition"
              >
                トップページへ戻る
              </Link>
              <Link
                href="/videos"
                className="inline-flex items-center justify-center bg-white border-2 border-[#E8740C] text-[#E8740C] font-bold px-8 py-3 rounded-full text-sm hover:bg-[#FFF8F0] transition"
              >
                動画を見る
              </Link>
            </div>

            {/* Footer character */}
            <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-gray-100">
              <Image
                src="/images/pei_smile.png"
                alt="ペイさん"
                width={40}
                height={40}
                className="object-contain"
              />
              <p className="text-xs text-gray-400 text-left">
                お返事まで少々お待ちくださいね。<br />その間にぺいほーむの動画もぜひチェック！
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
