# MVP 実装仕様書（2026-05-01 リリース版）

最終更新: 2026-04-12
対応コミット: MVP スコープ縮小完了
対象ブランチ: `main`

---

## 1. アーキテクチャ概要

| 項目 | 値 |
| --- | --- |
| フレームワーク | Next.js 16.2.0 (App Router) |
| 言語 | TypeScript 5.x |
| スタイル | Tailwind CSS |
| 認証 | NextAuth.js 4.24.13 (JWT セッション) |
| DB | Supabase (現在はローカルフォールバック稼働) |
| ホスティング | Vercel 予定 |
| パス隠蔽 | `src/middleware.ts` による 404 リライト |

**重要:** Next.js 16 では `middleware.ts` は `proxy.ts` への改名が推奨されている（`AGENTS.md` 参照）。
MVP 期間は既存の `middleware.ts` を維持し、Phase 2 初頭にまとめて改名する。

---

## 2. 公開中の画面一覧（MVP 17画面）

| カテゴリ | パス | 役割 |
| --- | --- | --- |
| トップ | `/` | ヒーロー + AI診断CTA + 動画PICKUP + 使い方3ステップ + 工務店PICKUP + 会員特典 |
| サービス紹介 | `/about` | ぺいほーむとは |
| 会社情報 | `/company` | 運営会社 株式会社wazeka |
| 法務 | `/privacy`, `/terms` | プライバシーポリシー/利用規約 |
| AI診断 | `/diagnosis` | 10問のAI家づくり診断 |
| 無料相談 | `/consultation` | 住宅相談フォーム |
| 動画 | `/videos`, `/videos/[id]` | ルームツアー動画一覧と詳細 |
| 工務店 | `/builders`, `/builders/[id]` | 工務店一覧と詳細ページ |
| 事例 | `/case-studies` | 平屋事例ライブラリ |
| お客様の声 | `/voice` | レビュー一覧 |
| 見学会 | `/event`, `/event/[id]`, `/event/[id]/thanks` | 見学会一覧・詳細・予約完了 |
| カタログ | `/catalog` | デジタルカタログ |
| 認証 | `/login`, `/signup` | メール・Google 認証 |
| B2B | `/biz` | 工務店向けTOP |
| B2B問合せ | `/biz/contact` | 資料請求/問合せフォーム |

### 認証後の画面

- `/mypage` — マイページTOP（お気に入り、診断履歴、相談履歴、連絡希望設定）
- `/mypage/favorites` — お気に入り工務店
- `/mypage/contact-preferences` — 連絡希望プロファイル
- `/dashboard/user/*` — ユーザーダッシュボード
- `/dashboard/builder` — 工務店ダッシュボード（4画面のみ）
- `/admin/dashboard`, `/admin/leads`, `/admin/builders`, `/admin/events` — 管理画面（4画面のみ）

---

## 3. 非公開中の画面一覧（40+ パス）

`src/middleware.ts` の `HIDDEN_PATH_PREFIXES` で 404 を返す。
完全一致と前方一致（`/articles/123` も含む）の両方をカバー。

### ユーザー向け

```
/articles, /news, /interview, /magazine, /webinar
/sale-homes, /lands, /features, /simulator
/area, /welcome, /property
/builders/compare, /builders/contact
/mypage/catalog, /mypage/questions, /mypage/feedback
```

### B2B 側

```
/biz/service, /biz/ad, /biz/partner
/biz/articles, /biz/news, /biz/webinar
```

### 工務店ダッシュボード

```
/dashboard/builder/questions    (AI質問対応)
/dashboard/builder/billing       (請求・プラン)
/dashboard/builder/case-studies  (施工事例CMS)
/dashboard/builder/sale-homes    (建売CMS)
/dashboard/builder/lands         (土地CMS)
/dashboard/builder/videos        (動画CMS)
/dashboard/builder/reviews       (お客様の声CMS)
```

### 管理画面

```
/admin/articles, /admin/news, /admin/videos
/admin/interviews, /admin/webinars, /admin/case-studies
/admin/sale-homes, /admin/lands, /admin/magazine
/admin/features, /admin/reviews
/admin/biz-articles, /admin/biz-news, /admin/biz-webinars
/admin/users, /admin/properties, /admin/security
/admin/activity, /admin/system, /admin/notifications
/admin/data, /admin/reports
```

**コードは全て温存**しており、middleware のリストから該当パスを削除するだけで即座に復活する。

---

## 4. 3層ガードの仕組み

非公開パスを完全に封じ込めるため、以下の3層で守っている。
**1つでも漏らすとリークするので、追加・削除時は必ず3箇所同時に更新すること。**

### レイヤー1: middleware による 404 リライト

ファイル: `src/middleware.ts`

```ts
const HIDDEN_PATH_PREFIXES: readonly string[] = [
  '/articles', '/news', '/interview', /* ...40+ */
] as const

function isHiddenPath(pathname: string): boolean {
  return HIDDEN_PATH_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (isHiddenPath(pathname)) {
    return NextResponse.rewrite(new URL('/404', request.url))
  }
  // ...認証ルートへ
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts|robots.txt|sitemap.xml).*)',
  ],
}
```

### レイヤー2: ナビゲーションからリンク削除

- `src/components/layout/Header.tsx` — `NAV_CONTENT` (3カラム・8項目)
- `src/components/layout/Footer.tsx` — `FOOTER_COLUMNS` (3カラム)
- `src/components/layout/BizHeader.tsx` — 運営情報1カラムのみ
- `src/app/(biz)/layout.tsx` — B2Bフッターも1カラムに縮小
- `src/app/admin/layout.tsx` — 管理画面サイドバー4項目のみ
- `src/app/dashboard/builder/layout.tsx` — 工務店ダッシュボード4項目のみ

### レイヤー3: 検索エンジン向け

- `public/robots.txt` — 全ての非公開パスを `Disallow` で列挙
- `public/sitemap.xml` — MVP 17 URL のみ手動管理
  (`next-sitemap` の自動生成は一時停止)

---

## 5. 非公開パスの復活手順

Phase 移行時や個別復活の際の作業フロー:

### ステップ1: middleware から削除

```ts
// src/middleware.ts
const HIDDEN_PATH_PREFIXES = [
  // '/articles',  // ← この行を削除
  '/news',
  // ...
] as const
```

### ステップ2: ナビゲーションに追加

Phase 2 で復活させる `/news` の例:

```tsx
// src/components/layout/Header.tsx
const NAV_CONTENT = [
  {
    label: 'さがす',
    items: [
      { href: '/videos', label: '動画コンテンツ', desc: '...' },
      { href: '/builders', label: '工務店一覧', desc: '...' },
      { href: '/case-studies', label: '平屋事例ライブラリ', desc: '...' },
      { href: '/event', label: '見学会・イベント', desc: '...' },
      { href: '/news', label: 'ニュース', desc: '業界の最新情報' },  // ← 追加
    ],
  },
  // ...
]
```

同様に `Footer.tsx`, `admin/layout.tsx`, `dashboard/builder/layout.tsx` も更新。

### ステップ3: robots.txt と sitemap.xml

```
# public/robots.txt
# Disallow: /news   ← この行を削除
```

```xml
<!-- public/sitemap.xml に追加 -->
<url><loc>https://payhome.jp/news</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>
```

### ステップ4: 検証

```bash
# ローカルで動作確認
npm run dev

# プレビューサーバー経由で全ページが 200/404 通りに動くか確認
curl -I http://localhost:3000/news  # → 200 になっていること
curl -I http://localhost:3000/articles  # → 404 (まだ非公開) になっていること
```

---

## 6. 主要データソース

| 画面 | データ | 補完 |
| --- | --- | --- |
| 動画 | `src/lib/videos-data.ts` | YouTube Data API で後日同期 |
| 工務店 | `src/lib/builders-data.ts` | 10社分ハードコード |
| 事例 | `src/lib/case-studies-data.ts` | 工務店紐付け |
| カタログ | `src/lib/catalogs-data.ts` | PDF 2冊分のメタ情報 |
| 見学会 | Supabase `events` テーブル | ローカルフォールバック有り |
| リード | Supabase `leads` テーブル | ローカルフォールバック有り |
| 連絡希望 | Supabase `contact_preferences` | ローカルフォールバック有り |

Supabase が未接続でもビルド・起動・全画面表示まで落ちない設計。
リリース前に Supabase 接続と環境変数（`NEXTAUTH_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`）を設定する。

---

## 7. リリースチェックリスト

`02_管理シート/MVP実行計画.xlsx` の `⑤ リリース前チェックリスト` と同期している。
ここでは技術側の項目のみ列挙。

- [ ] `.env.production` を Vercel に設定（全キー）
- [ ] `npm run build` がエラーなく通る
- [ ] `npm run lint` で重大な警告なし
- [ ] Supabase のマイグレーション適用
- [ ] `/admin/dashboard` に管理者ログインできる
- [ ] `/dashboard/builder` に工務店ログインできる
- [ ] 17公開ページ全てが 200 で返る
- [ ] 40+ 非公開ページ全てが 404 で返る
- [ ] GA4 計測タグが動いている
- [ ] Cloudflare Turnstile（bot対策）が有効
- [ ] ログ集約先（Vercel Logs / Sentry 等）のダッシュボードを確認
- [ ] 独自ドメイン `payhome.jp` と SSL の設定
- [ ] `robots.txt` と `sitemap.xml` が本番URLで見える
- [ ] Search Console に sitemap.xml を登録

---

## 8. ファイル変更サマリー（2026-04-12 時点）

| ファイル | 変更内容 |
| --- | --- |
| `src/middleware.ts` | `HIDDEN_PATH_PREFIXES` 40+ 追加、`isHiddenPath()` 関数追加、matcher を正規表現化 |
| `src/components/layout/Header.tsx` | `NAV_CONTENT` 14項目 → 8項目に縮小 |
| `src/components/layout/Footer.tsx` | `FOOTER_COLUMNS` 同様に縮小 |
| `src/components/layout/BizHeader.tsx` | NAV を運営情報1カラムに縮小 |
| `src/components/layout/CampaignSection.tsx` | `/mypage/catalog` → `/catalog` に変更 |
| `src/app/(biz)/layout.tsx` | フッター3カラム → 1カラムに縮小 |
| `src/app/(biz)/biz/page.tsx` | `/biz/service`, `/biz/news`, `/biz/partner` リンクを `/biz/contact` に統合 |
| `src/app/(biz)/biz/contact/page.tsx` | 完了画面の「サービス一覧」ボタン削除 |
| `src/app/(user)/page.tsx` | 特集/建売/土地 の3セクション削除。関連 import と変数も削除 |
| `src/app/(user)/builders/page.tsx` | `CompareToggleButton` と `/builders/compare` リンク削除 |
| `src/app/(user)/videos/page.tsx` | カード遷移先を `/property/[id]` → `/videos/[id]` に変更 |
| `src/lib/site-config.ts` | `USER_SIDE_FEATURES` から匿名質問とシミュレーター項目を削除 |
| `src/app/admin/layout.tsx` | サイドバー31項目 → 4項目に縮小。セクション開閉UIも撤去 |
| `src/app/dashboard/builder/layout.tsx` | サイドバー11項目 → 4項目に縮小。モバイルメニューも統合 |
| `public/robots.txt` | 非公開パスの `Disallow` 30+ 追加 |
| `public/sitemap.xml` | 自動生成を一時停止し、MVP 17URL の手動管理版に差し替え |

---

## 9. 次フェーズ（Phase 2）で触る予定のファイル

詳細は `フェーズ別機能ロードマップ.md` を参照。ここではファイル単位のみ。

- `src/middleware.ts` — `/news`, `/articles` を削除
- `src/components/layout/Header.tsx` — 「情報」カラムを復活
- `src/app/admin/layout.tsx` — 「コンテンツ管理」セクションを一部復活
- `public/sitemap.xml` — 復活URL追加
- `public/robots.txt` — 該当 Disallow 削除
- `src/app/(biz)/biz/page.tsx` — Phase 2 プラン表の追加
- `src/lib/site-config.ts` — `USER_SIDE_FEATURES` の更新
