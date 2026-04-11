# SETUP — ローカル開発環境 構築手順

最終更新: 2026-04-12
対象: ぺいほーむ事業を引き継ぐエンジニア

このドキュメントは **何もない状態から `http://localhost:3000` で動くようにする** までの最小手順です。
背景・設計意図は `docs/最新版/01_エンジニア共有用/` を参照してください。

---

## 1. 前提条件

| 項目 | バージョン | 備考 |
| --- | --- | --- |
| OS | macOS / Linux / Windows (WSL2) | |
| Node.js | **20.x 以上** | `nvm use 20` 推奨 |
| npm | 10.x 以上 | Node 20 に同梱 |
| Git | 任意 | GitHub collaborator 権限必須 |
| Python | 3.10 以上 (任意) | `scripts/` のドキュメント生成用 |

### 必須アカウント

- **GitHub** — `wazeka0412/payhome-next` への Write 権限
- **Supabase** — プロジェクトメンバー (dev 用プロジェクト)
- **Vercel** — プロジェクトメンバー (preview/production)
- **OpenAI API** — API Key (AIチャット・診断用)

機密情報 (KEY 類) は **別途 1Password 等で受領** してください。GitHub には絶対に commit しないでください。

---

## 2. 環境変数の取得

以下のキーを準備してください。`.env.local` に貼り付けます。

| 変数 | 取得場所 | 必須 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 同上 | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | 同上 (秘匿) | ✅ |
| `NEXTAUTH_URL` | `http://localhost:3000` (開発時) | ✅ |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` で生成 | ✅ |
| `GOOGLE_CLIENT_ID` | Google Cloud Console → APIs → Credentials | ⭕ (OAuth) |
| `GOOGLE_CLIENT_SECRET` | 同上 | ⭕ (OAuth) |
| `APPLE_ID` | Apple Developer Portal | ⭕ (OAuth) |
| `APPLE_SECRET` | 同上 | ⭕ (OAuth) |
| `OPENAI_API_KEY` | platform.openai.com → API keys | ✅ (AI機能) |
| `NEXT_PUBLIC_GA_ID` | GA4 → 管理 → データストリーム | ⭕ (本番) |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Meta ビジネスマネージャ | ⭕ (本番) |
| `RESEND_API_KEY` | resend.com → API Keys | ⭕ (メール送信) |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` (開発) / `https://payhome.jp` (本番) | ✅ |

✅ = 必須 / ⭕ = 機能により必須 (OAuth 使うなら ⭕)

> Supabase が未接続でも `src/lib/local-store.ts` のフォールバックで起動・閲覧は可能です (書き込みはローカル JSON)。

---

## 3. セットアップ手順

### 3.1 リポジトリをクローン

```bash
git clone https://github.com/wazeka0412/payhome-next.git
cd payhome-next
```

### 3.2 Node 20 に切り替え

```bash
nvm use 20       # なければ nvm install 20
node --version   # v20.x.x が表示されること
```

### 3.3 依存パッケージをインストール

```bash
npm install
```

> Next.js **16.2.0** + React **19.2.4** です。`AGENTS.md` に書いてある通り、
> Next.js の API・ファイル規約は 15 以前と異なります。コードを書く前に
> `node_modules/next/dist/docs/` の該当ガイドを確認してください。

### 3.4 環境変数を設定

```bash
cp .env.example .env.local
# エディタで .env.local を開き、取得したキーを貼り付け
```

`NEXTAUTH_SECRET` は以下で生成できます:

```bash
openssl rand -base64 32
```

### 3.5 Supabase マイグレーション (オプション)

ローカルフォールバックで動くため必須ではありませんが、Supabase 接続する場合:

```bash
# Supabase CLI インストール済みであること
supabase link --project-ref <YOUR_PROJECT_REF>
supabase db push
```

マイグレーション SQL は `supabase/migrations/` 配下。最新は `004_content_management.sql`。

### 3.6 開発サーバー起動

```bash
npm run dev
```

- `http://localhost:3000` が開けば成功
- ホットリロード有効
- コンソールに `[events GET] Supabase unreachable, using local fallback` と出る場合は、Supabase 未接続のローカル動作。問題なし。

### 3.7 動作確認

以下 17 ページが 200 で表示されることを確認:

```
/                 /about              /company
/privacy          /terms              /diagnosis
/consultation     /catalog            /videos
/builders         /case-studies       /voice
/event            /login              /signup
/biz              /biz/contact
```

以下 40+ パスが **404** を返すことを確認 (middleware で隠している):

```
/articles         /news               /interview
/magazine         /webinar            /sale-homes
/lands            /features           /simulator
/biz/service      /biz/ad             /biz/partner
...他 30+
```

一括検証コマンド:

```bash
# 公開ページ
for p in / /about /company /diagnosis /videos /builders /case-studies /event /biz; do
  echo -n "$p → "
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000$p
done

# 非公開ページ (全て 404 であるべき)
for p in /articles /news /sale-homes /lands /features /simulator; do
  echo -n "$p → "
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000$p
done
```

---

## 4. よく使うコマンド

| コマンド | 用途 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド (リリース前に必ず実行) |
| `npm run start` | ビルド済みサーバー起動 |
| `npm run lint` | ESLint 実行 |
| `python3 scripts/audit-latest-docs.py` | ドキュメントの整合性監査 |

---

## 5. ディレクトリ構成 (概要)

```
payhome-next/
├── src/
│   ├── app/
│   │   ├── (user)/          ← エンドユーザー向け画面
│   │   ├── (biz)/           ← 工務店向けページ
│   │   ├── admin/           ← 管理画面
│   │   ├── dashboard/       ← 工務店ダッシュボード
│   │   └── api/             ← API Routes
│   ├── components/
│   ├── lib/
│   └── middleware.ts        ← ★ 非公開パスの404ガード
├── public/
│   ├── robots.txt           ← ★ 非公開パスと同期
│   └── sitemap.xml          ← ★ MVP 17 URL のみ手動管理
├── supabase/
│   └── migrations/
├── docs/
│   ├── 最新版/              ← ★ 決定版ドキュメント一式 (55 ファイル)
│   └── 09_エンジニア引き継ぎ/HANDOVER.md
├── scripts/                 ← ドキュメント生成スクリプト
├── .env.example             ← 環境変数雛形
├── AGENTS.md                ← ★ Next.js 16 の注意
├── CLAUDE.md                ← Claude Code 用
├── SETUP.md                 ← このファイル
└── RUNBOOK.md               ← 本番デプロイ手順
```

★ 印はリリース前に必ず目を通してください。

---

## 6. 読むべきドキュメント

初日に上から順に読むことを推奨:

1. `AGENTS.md` — Next.js 16 の注意事項 (超重要)
2. `CLAUDE.md` → `AGENTS.md` 経由で同じ
3. `docs/最新版/README.docx` — 全体インデックス
4. `docs/最新版/01_エンジニア共有用/MVP実装仕様書.md` — 技術設計と3層ガード
5. `docs/最新版/01_エンジニア共有用/フェーズ別機能ロードマップ.md` — 何をいつ復活させるか
6. `docs/最新版/01_エンジニア共有用/AI要件定義書.md`
7. `docs/最新版/01_エンジニア共有用/AI設計書.md`
8. `RUNBOOK.md` — 本番デプロイ手順
9. `docs/09_エンジニア引き継ぎ/HANDOVER.md` — 過去引き継ぎ (補足)

---

## 7. トラブルシューティング

### Q1. `npm install` で失敗する
- Node 20 になっているか確認: `node --version`
- `rm -rf node_modules package-lock.json && npm install`

### Q2. `localhost:3000` が表示されない
- ポート 3000 が既に使われていないか: `lsof -i :3000`
- `.env.local` に `NEXTAUTH_URL=http://localhost:3000` があるか

### Q3. 「Supabase unreachable」のログが大量に出る
- 正常 (ローカルフォールバックで動いている)
- 本格的に使うなら Supabase キーを `.env.local` に設定

### Q4. `/articles` 等が 200 で返ってくる (本当は 404 のはず)
- `src/middleware.ts` の `HIDDEN_PATH_PREFIXES` にそのパスが含まれているか確認
- 変更した後は dev サーバー再起動 (middleware はホットリロード対象外のことがある)

### Q5. AI 診断が動かない
- `OPENAI_API_KEY` が `.env.local` に設定されているか
- OpenAI 側の credit が残っているか

### Q6. ビルドで TypeScript エラー
- `node_modules/next/dist/docs/` 配下のドキュメントで API 変更を確認
- `params` が Promise 型になっている箇所に注意 (Next.js 16 の変更)

---

## 8. サポート

| 困りごと | 連絡先 |
| --- | --- |
| 環境構築全般 | Slack #payhome-dev |
| 機密情報の再発行 | 代表 or 1Password 管理者 |
| Supabase / Vercel 権限 | 代表 |
| AI 設計の相談 | `docs/最新版/01_エンジニア共有用/AI設計書.md` 参照後、PM に連絡 |

---

## 9. リリース前の最終確認

本番デプロイ前に `RUNBOOK.md` の **「リリース当日チェックリスト」** を完走してください。
`docs/最新版/02_管理シート/MVP実行計画.xlsx` の
**⑤ リリース前チェックリスト** シート (34 項目) と重複しているため、どちらか一方で管理すれば OK です。
