import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { createServerClient } from './supabase'
import { localFindOne, localInsert } from './local-store'

async function findUserByEmail(email: string) {
  // Supabase を試し、ダメならローカル
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    if (data) return { source: 'supabase' as const, user: data }
  } catch (err) {
    console.warn('[auth.findUserByEmail] Supabase failed, using local:', (err as Error).message)
  }
  const local = await localFindOne('users', { email })
  return local ? { source: 'local' as const, user: local } : null
}

async function createUserLocal(email: string) {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('users')
      .insert({ email, name: email.split('@')[0], role: 'user' })
      .select()
      .single()
    if (error) throw error
    return data
  } catch {
    const inserted = await localInsert('users', {
      email,
      name: email.split('@')[0],
      role: 'user',
    })
    return inserted
  }
}

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

    // Email + Password 認証（MVP: パスワード4文字以上で通過、bcrypt は将来対応）
    CredentialsProvider({
      name: 'メールアドレス',
      credentials: {
        email: { label: 'メールアドレス', type: 'email', placeholder: 'example@email.com' },
        password: { label: 'パスワード', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        if (credentials.password.length < 4) return null

        const found = await findUserByEmail(credentials.email)
        if (found) {
          const u = found.user as {
            id: string
            email: string
            name?: string
            role?: string
            builder_id?: string
          }
          return {
            id: u.id,
            email: u.email,
            name: u.name || u.email.split('@')[0],
            role: u.role || 'user',
            builderId: u.builder_id,
          }
        }

        // 新規ユーザー自動作成
        const newUser = (await createUserLocal(credentials.email)) as {
          id: string
          email: string
          name?: string
          role?: string
          builder_id?: string
        }
        return {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name || newUser.email.split('@')[0],
          role: newUser.role || 'user',
          builderId: newUser.builder_id,
        }
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
        ;(session.user as { id?: string }).id = token.sub
        ;(session.user as { role?: string }).role = token.role as string
        ;(session.user as { builderId?: string }).builderId = token.builderId as string
      }
      return session
    },
    async signIn({ user, account }) {
      // Google OAuth ログイン時にDBまたはローカルにユーザーを作成
      if (account?.provider === 'google' && user.email) {
        const existing = await findUserByEmail(user.email)
        if (!existing) {
          try {
            const supabase = createServerClient()
            await supabase.from('users').insert({
              email: user.email,
              name: user.name,
              avatar_url: user.image,
              role: 'user',
            })
          } catch {
            await localInsert('users', {
              email: user.email,
              name: user.name,
              avatar_url: user.image,
              role: 'user',
            })
          }
        }
      }
      return true
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30日
  },

  secret: process.env.NEXTAUTH_SECRET,
}
