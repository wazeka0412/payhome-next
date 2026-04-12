import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '家づくり理解度チェック | ぺいほーむクイズ',
  description:
    '10問のクイズで住宅ローン・建売vs注文住宅・平屋の特徴・家づくりの流れの理解度を判定。初心者でも安心の解説付き。結果に応じた次のステップもご案内します。',
  openGraph: {
    title: '家づくり理解度チェック | ぺいほーむクイズ',
    description:
      '10問で家づくりの知識レベルを判定。苦手カテゴリもわかります。',
  },
}

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
