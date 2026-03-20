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
    } else {
      // Phase 1: admin以外はトップページへリダイレクト
      // Phase 2で工務店・ユーザーダッシュボードを有効化時に変更
      setError('管理者アカウントのみログイン可能です')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <img src="/images/logo.png" alt="ぺいほーむ" className="h-12 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">管理者ログイン</h1>
          <p className="text-sm text-gray-500 mt-1">管理者アカウントでログインしてください</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}

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
            <p className="text-xs text-gray-400">管理者専用のログインページです</p>
          </div>
        </div>
      </div>
    </div>
  )
}
