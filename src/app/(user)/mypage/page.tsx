'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function MyPageLogin() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'register' && !name.trim()) {
      setError('お名前を入力してください')
      return
    }
    if (!email.includes('@')) {
      setError('正しいメールアドレスを入力してください')
      return
    }
    if (password.length < 4) {
      setError('パスワードは4文字以上で入力してください')
      return
    }
    router.push('/dashboard/user')
  }

  const handleSocialLogin = (provider: string) => {
    // In production, use NextAuth.js with Google/Apple providers
    console.log(`${provider} login clicked`)
    router.push('/dashboard/user')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#FFF8F0] flex items-center justify-center">
            <Image src="/images/pei_wink.png" alt="ペイくん" width={52} height={52} className="object-contain" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">マイページ</h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'login' ? 'ログインしてお気に入りや相談履歴を確認' : '新規登録して家づくりを始めよう'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Social Login */}
          <div className="space-y-3 mb-5">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Googleでログイン
            </button>

            <button
              onClick={() => handleSocialLogin('Apple')}
              className="w-full flex items-center justify-center gap-3 bg-black text-white rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-800 transition cursor-pointer"
            >
              <svg width="16" height="18" viewBox="0 0 17 20" fill="white">
                <path d="M13.545 10.239c-.022-2.234 1.824-3.305 1.907-3.357-1.039-1.518-2.655-1.726-3.231-1.749-1.374-.139-2.681.809-3.379.809-.697 0-1.775-.788-2.917-.767-1.5.022-2.883.872-3.656 2.215-1.559 2.703-.399 6.709 1.12 8.904.743 1.074 1.627 2.28 2.789 2.237 1.119-.045 1.543-.724 2.896-.724 1.353 0 1.733.724 2.917.702 1.205-.021 1.969-1.095 2.706-2.173.853-1.247 1.203-2.453 1.224-2.517-.027-.012-2.348-.901-2.376-3.58zM11.321 3.468c.617-.749.834-1.715.779-2.668C11.179.855 10.089 1.37 9.427 2.15c-.597.697-.92 1.64-.804 2.605 1.014.079 2.049-.532 2.698-1.287z"/>
              </svg>
              Appleでログイン
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">または</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <p className="text-xs text-red-500 mb-3 text-center bg-red-50 rounded-lg py-2">{error}</p>
            )}

            {/* Toggle Login/Register */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
              <button
                type="button"
                onClick={() => { setMode('login'); setError('') }}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition cursor-pointer ${
                  mode === 'login' ? 'bg-white text-[#E8740C] shadow-sm' : 'text-gray-500'
                }`}
              >
                ログイン
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError('') }}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition cursor-pointer ${
                  mode === 'register' ? 'bg-white text-[#E8740C] shadow-sm' : 'text-gray-500'
                }`}
              >
                新規登録
              </button>
            </div>

            {mode === 'register' && (
              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">お名前</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8740C] focus:ring-1 focus:ring-[#E8740C]"
                  placeholder="山田 太郎"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8740C] focus:ring-1 focus:ring-[#E8740C]"
                placeholder="example@email.com"
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-600 mb-1">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8740C] focus:ring-1 focus:ring-[#E8740C]"
                placeholder="4文字以上"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E8740C] text-white font-bold py-3 rounded-xl hover:bg-[#D4660A] transition cursor-pointer text-sm"
            >
              {mode === 'login' ? 'ログイン' : '新規登録'}
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-center mt-3">
              <button onClick={() => setMode('register')} className="text-xs text-[#E8740C] hover:underline cursor-pointer">
                アカウントをお持ちでない方はこちら
              </button>
            </p>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] text-gray-400 mt-4">
          ログインすることで<Link href="/terms" className="underline">利用規約</Link>と<Link href="/privacy" className="underline">プライバシーポリシー</Link>に同意したものとみなされます
        </p>
      </div>
    </div>
  )
}
