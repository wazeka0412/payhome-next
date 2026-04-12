'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { getOrCreateAnonymousId } from '@/lib/anonymous-id'

function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const redirectTo = params.get('redirect') || '/welcome'

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!consent) {
      setError('利用規約・プライバシーポリシーへの同意が必要です')
      return
    }

    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください')
      return
    }

    setLoading(true)

    try {
      // 1. Create user record
      const anonymousId = typeof window !== 'undefined' ? getOrCreateAnonymousId() : undefined
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, anonymous_id: anonymousId }),
      })
      const signupData = await signupRes.json()

      if (!signupRes.ok) {
        if (signupData.error === 'email_already_registered') {
          setError('このメールアドレスはすでに登録されています。ログインしてください。')
        } else if (signupData.error === 'invalid_email') {
          setError('メールアドレスの形式が正しくありません')
        } else {
          setError('登録に失敗しました。時間をおいて再度お試しください')
        }
        setLoading(false)
        return
      }

      // 2. Auto sign-in with credentials
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (signInRes?.error) {
        setError('ログイン処理で問題が発生しました')
        setLoading(false)
        return
      }

      // 3. Redirect to mypage or intended destination
      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      console.error('signup error:', err)
      setError('通信エラーが発生しました')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF3E6] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/images/logo.png"
              alt="ぺいほーむ"
              width={180}
              height={48}
              className="h-12 w-auto mx-auto"
              priority
            />
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">会員登録</h2>
          <p className="text-sm text-gray-600">
            登録すると、以下の機能が使えるようになります
          </p>
        </div>

        {/* Value proposition (MVP v2 - 家づくり支援中心) */}
        <div className="bg-white rounded-xl p-5 mb-6 border border-[#E8740C]/20 shadow-sm">
          <p className="text-xs font-bold text-[#E8740C] mb-3">会員登録で、家づくりが一気に進みます</p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#E8740C] font-bold">✓</span>
              <span>AI家づくり診断の結果を保存し、何度でも見返し</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E8740C] font-bold">✓</span>
              <span>気になる工務店・動画・事例をお気に入りで整理</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E8740C] font-bold">✓</span>
              <span>平屋事例ライブラリを全件閲覧（非会員は5件まで）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E8740C] font-bold">✓</span>
              <span>間取り図のフル解像度で閲覧</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E8740C] font-bold">✓</span>
              <span>連絡希望条件を事前設定（Smart Match）— 工務店とお互いのペースで進める</span>
            </li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              お名前
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8740C]/30 focus:border-[#E8740C]"
            />
            <p className="text-xs text-gray-500 mt-1">8文字以上で設定してください</p>
          </div>

          <div>
            <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#E8740C] border-gray-300 rounded focus:ring-[#E8740C]"
              />
              <span>
                <Link href="/terms" className="text-[#E8740C] hover:underline">利用規約</Link>
                および
                <Link href="/privacy" className="text-[#E8740C] hover:underline">プライバシーポリシー</Link>
                に同意します
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E8740C] hover:bg-[#D06800] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? '登録中...' : '会員登録する'}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 text-center text-sm text-gray-600">
          すでにアカウントをお持ちの方は
          <Link href="/login" className="text-[#E8740C] hover:underline ml-1">
            ログイン
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
      <SignupForm />
    </Suspense>
  )
}
