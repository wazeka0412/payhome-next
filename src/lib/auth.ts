import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { createServerClient } from './supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth（キー設定後に有効化）
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id'
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),

    // Email + Password 認証
    CredentialsProvider({
      name: 'メールアドレス',
      credentials: {
        email: { label: 'メールアドレス', type: 'email', placeholder: 'example@email.com' },
        password: { label: 'パスワード', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const supabase = createServerClient()

        // ユーザーをメールで検索
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single()

        if (user) {
          // 既存ユーザー（パスワード検証は本番ではbcryptを使用）
          // 開発中はパスワード4文字以上でログイン可能
          if (credentials.password.length >= 4) {
            return {
              id: user.id,
              email: user.email,
              name: user.name || user.email.split('@')[0],
              role: user.role,
              builderId: user.builder_id,
            }
          }
          return null
        }

        // 新規ユーザー自動作成（パスワード4文字以上）
        if (credentials.password.length >= 4) {
          const { data: newUser, error } = await supabase
            .from('users')
            .insert({
              email: credentials.email,
              name: credentials.email.split('@')[0],
              role: 'user',
            })
            .select()
            .single()

          if (error || !newUser) return null

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name || newUser.email.split('@')[0],
            role: newUser.role,
            builderId: newUser.builder_id,
          }
        }

        return null
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || 'user'
        token.builderId = (user as { builderId?: string }).builderId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub
        ;(session.user as { role?: string }).role = token.role as string
        ;(session.user as { builderId?: string }).builderId = token.builderId as string
      }
      return session
    },
    async signIn({ user, account }) {
      // Google OAuth ログイン時にDBにユーザーを作成/更新
      if (account?.provider === 'google' && user.email) {
        const supabase = createServerClient()
        const { data: existing } = await supabase
          .from('users')
          .select('id, role, builder_id')
          .eq('email', user.email)
          .single()

        if (!existing) {
          // 新規ユーザー作成
          await supabase.from('users').insert({
            email: user.email,
            name: user.name,
            avatar_url: user.image,
            role: 'user',
          })
        }
      }
      return true
    },
  },

  pages: {
    signIn: '/dashboard',
    error: '/dashboard',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30日
  },

  secret: process.env.NEXTAUTH_SECRET,
}
