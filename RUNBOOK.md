# RUNBOOK — 本番デプロイ手順

最終更新: 2026-04-12
対象: 本番デプロイ・障害対応を担当するエンジニア
リリース日: **2026-05-01 (金) AM 6:00**

このドキュメントは **本番環境の構築・デプロイ・ロールバック・障害対応** の手順書です。
日常の開発手順は `SETUP.md` を参照してください。

---

## 1. 本番環境の全体像

```
                  [ユーザー]
                      │
                      ▼
              payhome.jp (Route53 / お名前.com)
                      │
                      ▼
                  Cloudflare
              (CDN + Turnstile)
                      │
                      ▼
              Vercel (Next.js 16)
              ├── Edge Middleware (404 ガード)
              └── Serverless Functions
                      │
        ┌─────────────┼──────────────┐
        ▼             ▼              ▼
     Supabase      OpenAI         Resend
    (Postgres)    (GPT-4o)       (Email)
```

| レイヤー | サービス | 用途 |
| --- | --- | --- |
| ドメイン | payhome.jp | お名前.com 管理想定 |
| CDN/WAF | Cloudflare | bot対策 (Turnstile) |
| ホスティング | Vercel | Next.js 16 運用 |
| DB | Supabase (Postgres) | ユーザー/リード/見学会/診断 |
| AI | OpenAI GPT-4o | 住宅相談チャット |
| Email | Resend | 通知メール |
| エラー監視 | Sentry | 障害検知 |
| 計測 | GA4 + Vercel Analytics | アクセス解析 |

---

## 2. 初回デプロイ (リリース前に一度だけ実行)

### 2.1 Vercel プロジェクト作成

1. `https://vercel.com/new` にアクセス
2. GitHub `wazeka0412/payhome-next` を import
3. **Framework**: Next.js (自動検出)
4. **Root Directory**: `./`
5. **Build Command**: `npm run build` (デフォルト)
6. **Output Directory**: `.next` (デフォルト)
7. **Install Command**: `npm install`

### 2.2 環境変数を Vercel に設定

Vercel → Project → Settings → Environment Variables で以下を全て登録:

| 変数名 | Production | Preview | Development |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ (秘匿) | ✅ | ✅ |
| `NEXTAUTH_URL` | `https://payhome.jp` | `https://preview.payhome.jp` | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | ✅ (本番用に新規生成) | ✅ | ✅ |
| `GOOGLE_CLIENT_ID` | ✅ | ✅ | ✅ |
| `GOOGLE_CLIENT_SECRET` | ✅ (秘匿) | ✅ | ✅ |
| `APPLE_ID` | ✅ | ✅ | ✅ |
| `APPLE_SECRET` | ✅ (秘匿) | ✅ | ✅ |
| `OPENAI_API_KEY` | ✅ (秘匿) | ✅ | ✅ |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | - | - |
| `NEXT_PUBLIC_FB_PIXEL_ID` | ✅ | - | - |
| `RESEND_API_KEY` | ✅ (秘匿) | ✅ | ✅ |
| `NEXT_PUBLIC_SITE_URL` | `https://payhome.jp` | `https://preview.payhome.jp` | `http://localhost:3000` |

⚠️ `NEXTAUTH_SECRET` は本番用に **新規生成** すること (dev と使い回さない)。

```bash
openssl rand -base64 32
```

### 2.3 独自ドメインの設定

1. Vercel → Project → Settings → Domains → Add `payhome.jp`
2. お名前.com (または Route53) で Vercel 推奨の A/CNAME レコードを設定
3. SSL 証明書は Vercel が自動発行 (Let's Encrypt)
4. `www.payhome.jp` は `payhome.jp` にリダイレクト設定

### 2.4 Supabase 本番プロジェクト作成

1. `https://supabase.com/dashboard` → New Project
2. リージョン: **Northeast Asia (Tokyo)** (ap-northeast-1)
3. データベースパスワードを強固なもので設定 → 1Password に保管
4. プロジェクト作成後、**Settings → API** で以下をコピーして Vercel に設定:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (秘匿)

### 2.5 マイグレーション適用

```bash
# ローカルから
supabase link --project-ref <PROD_PROJECT_REF>
supabase db push
```

あるいは Supabase Dashboard → SQL Editor で `supabase/migrations/` 配下の SQL を順番に実行:

```
001_initial_schema.sql
002_add_events.sql
003_anti_pressure.sql
004_content_management.sql
```

### 2.6 初期データ投入

- **工務店 10 社**: `src/lib/builders-data.ts` の内容を `builders` テーブルに手動または SQL で挿入
- **見学会イベント 3 件以上**: 各社と調整して `events` テーブルに登録

### 2.7 Cloudflare Turnstile 設定

1. `https://dash.cloudflare.com/` → Turnstile → Add Site
2. Domain: `payhome.jp`
3. 取得したキーを Vercel 環境変数に追加 (コード側で参照される名前を確認)

### 2.8 GA4 / Vercel Analytics / Sentry

- **GA4**: ストリーム作成 → 測定 ID を `NEXT_PUBLIC_GA_ID` に設定
- **Vercel Analytics**: Vercel → Project → Analytics → Enable
- **Sentry**: `https://sentry.io/` → New Project (Next.js) → DSN を環境変数に追加

---

## 3. 通常のデプロイ (日常運用)

Vercel は **main ブランチへの push = 自動デプロイ** されます。

### 3.1 通常フロー

```
1. feature ブランチで開発
2. Pull Request を作成
3. PR ページで Vercel Preview URL が自動発行される → 動作確認
4. レビュー承認後、main にマージ
5. Vercel が自動デプロイ (通常 2〜3 分)
6. 本番で動作確認
```

### 3.2 デプロイ前チェックリスト (毎回)

- [ ] `npm run build` がローカルで通る
- [ ] `npm run lint` で重大な警告なし
- [ ] TypeScript エラーなし
- [ ] Preview URL で主要導線 (診断 → 工務店 → 見学会予約) を目視確認
- [ ] `src/middleware.ts` を変更した場合、`public/robots.txt` と `public/sitemap.xml` も同期更新したか確認

### 3.3 デプロイ中のモニタリング

- Vercel ダッシュボードでビルドログを確認
- Sentry で新規エラーが出ていないか監視
- Vercel Analytics で 500 エラー率が急増していないか確認

---

## 4. リリース当日 (2026-05-01) の手順

### 4.1 前日 (2026-04-30) の準備

- [ ] Vercel の **Production Domain** が `payhome.jp` に紐付いていること
- [ ] 本番 DB に工務店 10 社データが入っていること
- [ ] 本番 DB に初週分の見学会イベントが入っていること
- [ ] `.env.production` の全キーが設定済みであること
- [ ] Vercel で main ブランチをデプロイしてステージング確認
- [ ] リハーサル実施 (main に空コミットを push してデプロイ時間を計測)
- [ ] ロールバック手順の確認 (5.1 参照)
- [ ] 全員の緊急連絡先を共有

### 4.2 当日の流れ

| 時刻 | 担当 | 作業 |
| --- | --- | --- |
| AM 5:30 | エンジニア | 全員 Slack に集合 |
| AM 5:45 | エンジニア | main の最新コミットを確認 |
| AM 6:00 | エンジニア | Vercel で Promote to Production |
| AM 6:05 | エンジニア | 17 公開ページの疎通確認 (curl + 目視) |
| AM 6:10 | エンジニア | 40+ 非公開パスの 404 確認 |
| AM 6:15 | エンジニア | AI 診断フロー完走確認 |
| AM 6:20 | エンジニア | 見学会予約フロー完走確認 |
| AM 6:30 | 代表 | Slack で全員に「リリース完了」通知 |
| AM 9:00 | 代表 | プレスリリース配信 |
| AM 9:00 | 代表 | YouTube リリース告知動画公開 |
| AM 9:00 | 代表 | SNS (X/Instagram/Threads) 予約投稿発火 |
| 9:00-22:00 | 全員 | オンコール体制 (Slack 常駐) |

### 4.3 リリース直後の動作確認コマンド

```bash
# 17 公開ページ
for p in / /about /company /privacy /terms /diagnosis /consultation /quiz \
         /catalog /videos /builders /case-studies /voice /event \
         /features /sale-homes /lands \
         /login /signup /welcome /biz /biz/contact /mypage/catalog; do
  echo -n "$p → "
  curl -s -o /dev/null -w "%{http_code}\n" https://payhome.jp$p
done

# 非公開パス (404 必須)
for p in /articles /news /simulator /interview /magazine /webinar \
         /builders/compare /mypage/questions /mypage/feedback \
         /biz/service /biz/ad /admin/articles; do
  echo -n "$p → "
  curl -s -o /dev/null -w "%{http_code}\n" https://payhome.jp$p
done

# robots.txt / sitemap.xml
curl https://payhome.jp/robots.txt
curl https://payhome.jp/sitemap.xml
```

全て想定通り (200 / 404) 返ってくることを確認。

---

## 5. 障害対応

### 5.1 ロールバック手順

Vercel は過去のデプロイを一覧で保持しており、ワンクリックで戻せます:

1. Vercel → Project → Deployments
2. 正常に動いていた時点のデプロイを選択
3. **"Promote to Production"** ボタンをクリック
4. 30 秒程度で本番に反映される

または Git で戻す方法:

```bash
git revert <問題のあるコミットハッシュ>
git push origin main
# Vercel が自動デプロイしロールバック完了
```

### 5.2 よくある障害と対応

| 症状 | 原因候補 | 対応 |
| --- | --- | --- |
| 全ページ 500 エラー | 環境変数未設定 / Supabase 接続失敗 | Vercel 環境変数確認 → 修正 → Redeploy |
| AI 診断が動かない | OpenAI API Key 無効 / credit 切れ | OpenAI ダッシュボードで確認 → Key 再発行 |
| 認証できない | `NEXTAUTH_SECRET` 未設定 or URL ミスマッチ | `.env.production` の `NEXTAUTH_URL` を確認 |
| 画像が表示されない | Next.js Image の domain 未許可 | `next.config.js` の `images.domains` に追加 |
| sitemap.xml が空 | next-sitemap の postbuild 失敗 | Vercel ビルドログ確認 |
| 404 が返らない | middleware 変更が未反映 | Vercel Redeploy |
| Supabase 接続エラー | RLS ポリシー誤設定 | Supabase ダッシュボードで SQL Editor → ポリシー確認 |

### 5.3 エスカレーション基準

| レベル | 条件 | 対応 |
| --- | --- | --- |
| P0 | 全ユーザーが使えない | 即座に全員招集、ロールバック優先 |
| P1 | 特定機能 (AI診断・見学会予約) が使えない | 1時間以内に修正デプロイ |
| P2 | 一部ユーザーのみ影響 | 当日中に修正 |
| P3 | 軽微な表示崩れ | 翌営業日に修正 |

P0 / P1 発生時は代表に即時連絡すること。

---

## 6. 日次運用

### 6.1 毎日 (午前中)

- [ ] Vercel ダッシュボードで 24h のエラー数確認
- [ ] Sentry で新規エラー確認
- [ ] Supabase ダッシュボードで DB エラー確認
- [ ] 前日分のリード・見学会予約件数を集計 (Supabase SQL)

### 6.2 毎週月曜 9:00 朝会

- [ ] 前週の KPI を `docs/最新版/02_管理シート/MVP実行計画.xlsx` に記入
- [ ] 工務店 10 社への週次レポート送付状況を確認

### 6.3 毎月末

- [ ] OpenAI API コスト確認 (上限 $100/月)
- [ ] Vercel / Supabase 利用量確認
- [ ] 月次 P&L 更新 (`docs/最新版/04_経理関係/請求・P&L管理.xlsx`)

---

## 7. フェーズ移行時の手順 (非公開パス復活)

Phase 2 以降で非公開パスを公開する場合:

### 7.1 ファイル変更 (3箇所同期が必須)

1. **`src/middleware.ts`** から該当パスを `HIDDEN_PATH_PREFIXES` 配列から削除
2. **`src/components/layout/Header.tsx`** / **`Footer.tsx`** / **`BizHeader.tsx`** 等のナビに項目追加
3. **`public/robots.txt`** の該当 `Disallow` 行を削除
4. **`public/sitemap.xml`** に該当 URL を追加

### 7.2 検証

```bash
# ローカルで
npm run dev
# 復活させたパスが 200 で表示されることを確認
curl -I http://localhost:3000/news
```

### 7.3 デプロイ

通常の PR フローで main にマージ → Vercel が自動デプロイ。

詳細は `docs/最新版/01_エンジニア共有用/フェーズ別機能ロードマップ.md` と `MVP実装仕様書.md` を参照。

---

## 8. 緊急連絡先

| 項目 | 連絡先 |
| --- | --- |
| 代表 | (電話番号) |
| 開発リーダー | (電話番号) |
| Vercel サポート | https://vercel.com/support |
| Supabase サポート | https://supabase.com/support |
| OpenAI サポート | https://help.openai.com |
| ドメイン管理 | お名前.com サポート |

---

## 9. 重要な参照先

- `AGENTS.md` — Next.js 16 の注意
- `SETUP.md` — ローカル環境構築
- `docs/最新版/01_エンジニア共有用/MVP実装仕様書.md` — 3層ガードの詳細
- `docs/最新版/02_管理シート/MVP実行計画.xlsx` — ⑤ リリース前チェックリスト (34項目)
- `docs/最新版/07_業務運用ルール/` — 運用ルール一式
