'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function DashboardLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('メールアドレスまたはパスワードが正しくありません')
      return
    }

    // ログイン成功 → ユーザーのロールに基づいてリダイレクト
    // セッションからロールを取得してリダイレクト先を決定
    const res = await fetch('/api/auth/session')
    const session = await res.json()

    if (session?.user?.role === 'admin') {
      window.location.href = '/admin/dashboard'
    } else if (session?.user?.role === 'builder') {
      window.location.href = '/dashboard/builder'
    } else {
      window.location.href = '/dashboard/user'
    }
  }

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard/user' })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <img src="/images/logo.png" alt="ぺいほーむ" className="h-12 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">ダッシュボード ログイン</h1>
          <p className="text-sm text-gray-500 mt-1">アカウント情報を入力してください</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}

          {/* Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition mb-4 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-sm font-semibold text-gray-700">Googleでログイン</span>
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-gray-400">または</span></div>
          </div>

          {/* Email/Password */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8740C] focus:ring-1 focus:ring-[#E8740C]"
                placeholder="example@email.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8740C] focus:ring-1 focus:ring-[#E8740C]"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E8740C] text-white font-bold py-3.5 rounded-xl hover:bg-[#D4660A] transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-400">初回ログイン時にアカウントが自動作成されます</p>
          </div>
        </div>
      </div>
    </div>
  )
}
