# ぺいほーむ プラットフォーム 要件定義書

**文書バージョン:** 3.0
**作成日:** 2026-03-22
**対象システム:** payhome-next
**技術基盤:** Next.js 16.2.0 / React 19 / Supabase / Vercel
**想定読者:** PM / エンジニア / 事業責任者

---

## 第1章：文書目的

本文書は「ぺいほーむ」プラットフォームの要件を定義する。

従来の要件定義（画面・機能の列挙）に加え、以下の観点を明示的に含む。

- **データ要件**：何のデータを、いつ、どこに保存し、何に使うか
- **イベント計測要件**：どの行動を追跡し、何を分析するか
- **AI/推薦要件**：AIコンシェルジュの段階的な進化に必要な機能と前提条件
- **開発優先順位**：データ基盤の整備を機能拡張より優先する

---

## 第2章：背景 / 事業目的

### 2.1 事業定義

ぺいほーむは、平屋を検討するユーザーの意思決定を支援し、その意思決定プロセスから得られるデータを蓄積・活用するAI住宅プラットフォームである。

### 2.2 プロダクトの目的

1. **消費者向け**：平屋検討における情報整理・比較・相談・行動支援を提供する
2. **住宅会社向け**：意向データを伴った高精度な見込み顧客接点を提供する
3. **データ基盤**：蓄積されるデータを基に、AI住宅コンシェルジュおよびAI営業支援に進化する

### 2.3 設計原則

| 原則 | 内容 |
|------|------|
| データファースト | すべてのユーザー接点でデータを取得・蓄積する前提で設計する |
| 段階的進化 | MVP→データ蓄積→AI活用→SaaS化の順で段階的に進化する |
| 構造化優先 | コンテンツ・リード・行動データはAIが処理しやすい構造化形式で保存する |
| 匿名→実名接続 | 匿名ユーザーの行動データを、会員登録後に紐付けられる設計にする |

---

## 第3章：システム全体像

### 3.1 アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                       クライアント                            │
│  ブラウザ（PC / タブレット / スマートフォン）                  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────┐
│                    Vercel Edge Network                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ SSR/SSG  │  │API Routes│  │Middleware │  │ イベント    │  │
│  │Next.js 16│  │          │  │(認証)     │  │ 収集API    │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
└────┬──────────────┬──────────────┬──────────────┬───────────┘
     │              │              │              │
┌────▼────┐  ┌──────▼──────┐  ┌───▼───┐  ┌──────▼──────┐
│Supabase │  │  外部API     │  │  GA4  │  │  将来拡張    │
│PostgreSQL│  │・OpenAI     │  │       │  │・Redis      │
│          │  │・Stripe     │  │       │  │・BigQuery   │
│・users   │  │・Resend     │  │       │  │・ML Pipeline│
│・leads   │  │・Google OAuth│ │       │  │             │
│・builders│  └─────────────┘  └───────┘  └─────────────┘
│・events  │
│・user_   │
│ profiles │
│・user_   │
│ events   │
│・chat_   │
│ sessions │
│・chat_   │
│ messages │
│・favorites│
│・comparisons│
│・content_ │
│ engage-  │
│ ments    │
└──────────┘
```

### 3.2 技術スタック

| 区分 | 技術 | バージョン | 用途 |
|------|------|-----------|------|
| フレームワーク | Next.js | 16.2.0 | SSR/SSG/API |
| UI | React | 19.2.4 | コンポーネント |
| 言語 | TypeScript | 5.x | 型安全 |
| CSS | Tailwind CSS | 4.x | スタイリング |
| DB | Supabase (PostgreSQL) | - | データ永続化 |
| 認証 | NextAuth.js | 4.24.13 | 認証・セッション |
| 決済 | Stripe | 20.4.1 | サブスクリプション |
| メール | Resend | 6.9.4 | 通知メール |
| AI/LLM | OpenAI | 6.32.0 | AIコンシェルジュ |
| デプロイ | Vercel | - | ホスティング |
| SEO | next-sitemap | 4.2.3 | サイトマップ |
| 計測 | GA4 | - | アクセス解析 |

---

## 第4章：ユーザー区分

### 4.1 ロール定義

| ロール | 説明 | アクセス範囲 |
|--------|------|-------------|
| anonymous | 未ログインユーザー | 公開ページ閲覧、AIチャット利用、フォーム送信 |
| user | 会員登録済みユーザー | + お気に入り・比較・閲覧履歴・ユーザーダッシュボード |
| builder | 工務店担当者 | + 工務店ダッシュボード・自社リード閲覧 |
| admin | システム管理者 | 全機能アクセス |

### 4.2 ユーザー識別子の統一設計

| 状態 | 識別子 | 行動データの扱い |
|------|--------|----------------|
| 匿名（初回訪問） | anonymous_id（UUID、ブラウザLocalStorageに保存） | user_eventsにanonymous_idで記録 |
| 会員登録時 | user_id発行 + anonymous_idを紐付け | 過去のanonymous_idの行動データをuser_idにマージ |
| ログイン済み | user_id | user_eventsにuser_idで記録 |

**設計意図：** 匿名状態での閲覧・チャット行動を、会員登録後に接続することで、「この人はどんな物件を見て、何を相談して、何が気になって問い合わせたか」という一連の文脈を構築する。

---

## 第5章：提供機能一覧

### 5.1 消費者向け（toC）: 20画面

| # | パス | 画面名 | ステータス | 取得データ |
|---|------|--------|----------|-----------|
| 1 | / | トップページ | ✅ | page_view, video_view |
| 2 | /property/[id] | 物件詳細 | ✅ | page_view, video_view, favorite_add |
| 3 | /articles | 記事一覧 | ✅ | page_view |
| 4 | /articles/[id] | 記事詳細 | ✅ | article_read, scroll_depth |
| 5 | /interview | 取材一覧 | ✅ | page_view |
| 6 | /interview/[id] | 取材詳細 | ✅ | article_read |
| 7 | /voice | お客様の声一覧 | ✅ | page_view |
| 8 | /voice/[id] | お客様の声詳細 | ✅ | article_read |
| 9 | /webinar | セミナー一覧 | ✅ | page_view |
| 10 | /webinar/[id] | セミナー詳細 | ✅ | event_detail_view |
| 11 | /news | ニュース一覧 | ✅ | page_view |
| 12 | /news/[id] | ニュース詳細 | ✅ | article_read |
| 13 | /magazine | 月刊誌 | ✅ | page_view |
| 14 | /event | イベント一覧 | ✅ | page_view |
| 15 | /event/[id] | イベント詳細 | ✅ | event_detail_view |
| 16 | /builders | 工務店一覧 | ✅ | page_view |
| 17 | /catalog | カタログ | ✅ | page_view |
| 18 | /simulator | ローン試算 | ✅ | simulator_use |
| 19 | /consultation | 無料相談フォーム | ✅ | consultation_request |
| 20 | /thanks | サンクスページ | ✅ | - |

### 5.2 住宅会社向け（toB）: 8画面 ✅

| # | パス | 画面名 |
|---|------|--------|
| 1 | /biz | Bizトップ |
| 2 | /biz/service | サービス紹介 |
| 3 | /biz/ad | 広告・タイアップ |
| 4 | /biz/partner | パートナー |
| 5 | /biz/articles | Biz記事一覧 |
| 6 | /biz/news | Bizニュース |
| 7 | /biz/webinar | Bizセミナー |
| 8 | /biz/contact | お問い合わせ |

### 5.3 管理画面（appadmin CMS）: 27画面 ✅

全コンテンツのCRUD・ページ編集・SEO管理・メディア管理・ワークフロー・監査ログ・バックアップ・システム設定

### 5.4 ダッシュボード: 7画面

| # | パス | 画面名 | ステータス |
|---|------|--------|----------|
| 1 | /dashboard | TOP | 🔧 |
| 2 | /dashboard/builder | 工務店KPI | 🔧 |
| 3 | /dashboard/builder/leads | リード管理 | 🔧 |
| 4 | /dashboard/builder/events | イベント管理 | 🔧 |
| 5 | /dashboard/builder/profile | プロフィール | 🔧 |
| 6 | /dashboard/builder/billing | 請求管理 | 📋 |
| 7 | /dashboard/user | ユーザーダッシュボード | 📋→🔧（優先度引き上げ） |

---

## 第6章：機能要件

### 6.1 消費者向け機能（実装済み ✅）

現在実装済みの機能は維持する。詳細は第5章の画面一覧を参照。

### 6.2 ユーザーダッシュボード（優先度引き上げ）

お気に入り・比較・閲覧履歴は後回しではなく、データ蓄積の中核として優先実装する。

| 機能 | 説明 | Phase |
|------|------|-------|
| お気に入り管理 | 物件・工務店をお気に入りに追加・解除。一覧表示 | Phase 1 |
| 比較リスト | 物件・工務店を比較リストに追加。並べて比較 | Phase 2 |
| 閲覧履歴 | 過去に閲覧した物件・記事・工務店の履歴 | Phase 1 |
| 相談履歴 | 過去のAIチャット会話の一覧・再開 | Phase 2 |
| マイプロフィール | 家族構成・予算・希望エリア等の自己申告 | Phase 2 |

### 6.3 リード拡張

| 追加フィールド | 内容 | 取得方法 | Phase |
|---------------|------|---------|-------|
| source_channel | 流入チャネル（YouTube/SEO/SNS/直接） | UTMパラメータ・referrer | Phase 1 |
| source_content_id | 流入元コンテンツID | 直前ページのコンテンツID | Phase 1 |
| recent_views | 直前閲覧履歴（最大10件） | user_eventsから集計 | Phase 1 |
| chat_summary | 直前チャット要約 | chat_sessionsから取得 | Phase 2 |
| interest_tags | 関心タグ（平屋/ZEH/デザイン等） | 閲覧・チャットから推定 | Phase 2 |
| concerns | 不安要素（予算/土地/業者選び等） | チャットから抽出 | Phase 2 |
| comparison_targets | 比較対象の工務店・物件 | comparison_historyから | Phase 2 |
| recommended_builders | 推薦候補の工務店 | 推薦ロジックの出力 | Phase 2 |
| recommendation_reason | 推薦理由 | 推薦ロジックの出力 | Phase 2 |
| consideration_phase | 検討フェーズ（情報収集/比較/決定直前） | 行動パターンから推定 | Phase 2 |
| temperature | 温度感（0-100） | 行動スコアリング | Phase 1 |
| conversion_reason | コンバージョン理由 | フォーム送信時の文脈分析 | Phase 2 |

---

## 第7章：データ要件

### 7.1 データモデル一覧

| # | テーブル名 | 用途 | ステータス |
|---|-----------|------|----------|
| 1 | users | ユーザー認証・基本情報 | ✅ 既存 |
| 2 | leads | リード（問い合わせ） | ✅ 既存→拡張 |
| 3 | builders | 工務店情報 | ✅ 既存→拡張 |
| 4 | events | 見学会・イベント | ✅ 既存 |
| 5 | user_profiles | ユーザー属性・意向 | 📋 新設 |
| 6 | user_events | 行動イベントログ | 📋 新設 |
| 7 | chat_sessions | チャットセッション | 📋 新設 |
| 8 | chat_messages | チャットメッセージ | 📋 新設 |
| 9 | favorites | お気に入り | 📋 新設 |
| 10 | comparisons | 比較履歴 | 📋 新設 |
| 11 | content_engagements | コンテンツエンゲージメント集計 | 📋 新設 |
| 12 | builder_recommendations | 工務店推薦履歴 | 📋 新設 |

### 7.2 新設テーブル定義

#### user_profiles テーブル

| カラム | 型 | 説明 | 取得方法 |
|--------|-----|------|---------|
| id | uuid | PK | 自動 |
| user_id | uuid | FK(users) | 認証時 |
| family_structure | text | 家族構成（夫婦のみ/子育て中/シニア等） | 自己申告 or チャット推定 |
| age_range | text | 年齢層（30代/40代/50代/60代以上） | 自己申告 or チャット推定 |
| planned_timing | text | 建築予定時期（半年以内/1年以内/未定等） | 自己申告 or チャット推定 |
| has_land | boolean | 土地の有無 | 自己申告 |
| preferred_area | text | 希望エリア | 自己申告 or フォーム |
| budget_range | text | 予算帯（2000万以下/2000-3000万/3000万以上） | 自己申告 or チャット推定 |
| hiraya_preference | integer | 平屋希望度（1-5） | 行動から推定 |
| design_orientation | text[] | デザイン志向（モダン/和風/ナチュラル/シンプル） | 閲覧傾向から推定 |
| performance_orientation | text[] | 性能志向（断熱/耐震/ZEH/省エネ） | 閲覧傾向から推定 |
| lifestyle_priorities | text[] | 暮らしの優先事項（老後配慮/子育て/コスト重視/家事動線/収納） | 自己申告 or チャット推定 |
| consideration_phase | text | 検討フェーズ（情報収集/比較検討/決定直前/契約後） | 行動パターンから推定 |
| temperature | integer | 温度感（0-100） | 行動スコアリング |
| created_at | timestamptz | 作成日時 | 自動 |
| updated_at | timestamptz | 更新日時 | 自動 |

#### user_events テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| user_id | uuid | FK(users)、NULL可（匿名時） |
| anonymous_id | text | 匿名ユーザー識別子 |
| event_type | text | イベント種別（後述） |
| content_type | text | コンテンツ種別（property/article/builder/event等） |
| content_id | text | コンテンツID |
| metadata | jsonb | 追加情報（滞在時間・スクロール深度等） |
| page_url | text | ページURL |
| referrer | text | リファラ |
| device_type | text | デバイス種別 |
| created_at | timestamptz | イベント発生日時 |

#### chat_sessions テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| user_id | uuid | FK(users)、NULL可 |
| anonymous_id | text | 匿名ユーザー識別子 |
| source_page | text | 会話開始ページ |
| started_at | timestamptz | 開始日時 |
| ended_at | timestamptz | 終了日時 |
| message_count | integer | メッセージ数 |
| category | text | 会話カテゴリ（資金相談/工務店探し/間取り相談/性能比較/一般質問） |
| inferred_intent | text | 推定意図（情報収集/比較検討/具体相談/クレーム） |
| extracted_tags | text[] | 抽出タグ（平屋/3LDK/ZEH/鹿児島/2000万等） |
| conversation_summary | text | 会話要約（AI自動生成） |
| recommended_action | text | 推薦アクション（見学会予約/資料請求/相談等） |
| lead_conversion | boolean | リード化したか |
| lead_id | uuid | リード化した場合のlead ID |
| next_best_action | text | 次に取るべきアクション（将来） |
| created_at | timestamptz | 作成日時 |

#### chat_messages テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| session_id | uuid | FK(chat_sessions) |
| role | text | 'user' or 'assistant' |
| content | text | メッセージ内容 |
| tokens_used | integer | 使用トークン数 |
| created_at | timestamptz | 送信日時 |

#### favorites テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| user_id | uuid | FK(users) |
| content_type | text | 'property' / 'builder' / 'article' / 'event' |
| content_id | text | コンテンツID |
| created_at | timestamptz | 追加日時 |

#### comparisons テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| user_id | uuid | FK(users) |
| content_type | text | 'property' / 'builder' |
| content_ids | text[] | 比較対象のID配列 |
| comparison_axes | text[] | 比較軸（価格/間取り/性能/デザイン等） |
| created_at | timestamptz | 作成日時 |

#### content_engagements テーブル（集計テーブル）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| content_type | text | コンテンツ種別 |
| content_id | text | コンテンツID |
| total_views | integer | 総閲覧数 |
| unique_views | integer | ユニーク閲覧数 |
| avg_duration | integer | 平均滞在時間（秒） |
| favorite_count | integer | お気に入り数 |
| comparison_count | integer | 比較追加数 |
| lead_count | integer | リード化数 |
| period | date | 集計期間（日次） |

#### builder_recommendations テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| user_id | uuid | FK(users) |
| builder_id | text | 推薦工務店ID |
| score | decimal | 推薦スコア |
| reason | text | 推薦理由 |
| source | text | 推薦元（AI/ルールベース/手動） |
| clicked | boolean | クリックされたか |
| created_at | timestamptz | 推薦日時 |

### 7.3 既存テーブルの拡張

#### builders テーブル追加カラム

CMS入稿時にAI推薦用の構造化データを登録する。

| 追加カラム | 型 | 説明 |
|-----------|-----|------|
| price_range | text | 対応価格帯（1500-2500万/2500-4000万等） |
| hiraya_ratio | integer | 平屋の施工比率（%） |
| hiraya_annual | integer | 年間平屋施工数 |
| design_taste | text[] | デザインテイスト（モダン/和風/ナチュラル/シンプル/北欧） |
| insulation_grade | text | 断熱等級（4/5/6/7） |
| earthquake_grade | text | 耐震等級（1/2/3） |
| ua_value_range | text | UA値の範囲 |
| features | text[] | 特徴（家事動線/回遊動線/収納/中庭/吹き抜け/勾配天井） |
| suitable_for | text[] | 向いている顧客像（子育て世帯/シニア/共働き/二世帯） |
| land_proposal | boolean | 土地提案の可否 |
| common_concerns | text[] | よくある不安（価格/工期/アフター等） |
| strengths | text[] | 強み |
| weaknesses | text[] | 弱み・注意点 |
| comparison_points | text[] | 他社比較時の観点 |

---

## 第8章：AI / チャット / 推薦要件

### 8.1 AIチャット（コンシェルジュ）の段階的進化

#### MVP（Phase 1）

| 機能 | 説明 | 前提条件 |
|------|------|---------|
| FAQ応答 | 平屋の基本知識・よくある質問に回答 | システムプロンプトにFAQを含める |
| 基本ヒアリング | 予算・エリア・家族構成・建築時期を聞き取る | プロンプトにヒアリング項目を定義 |
| コンテンツ提案 | 関連する動画・記事を提案 | コンテンツデータをRAGに登録 |
| 相談導線接続 | 会話の中で見学会予約・資料請求・無料相談を案内 | CTA用のリンクをプロンプトに含める |
| 会話ログ保存 | 全メッセージをchat_messages、セッション情報をchat_sessionsに保存 | DB設計・API実装 |

#### 次フェーズ（Phase 2）

| 機能 | 説明 | 前提条件 |
|------|------|---------|
| ユーザータイプ診断 | 会話内容からユーザーのタイプ（コスト重視/性能重視/デザイン重視等）を判定 | user_profilesへの書き込み |
| 工務店推薦 | ユーザーの関心に合った工務店を理由付きで推薦 | builders構造化データ + 推薦ロジック |
| 見学会推薦 | 近い日程の見学会・関心に合うイベントを案内 | eventsデータのRAG登録 |
| 次アクション提案 | 検討フェーズに応じた次のステップを提案 | user_profilesの検討フェーズ参照 |
| 会話要約の自動生成 | セッション終了時にconversation_summaryを自動生成 | GPTによる要約処理 |
| リード化判定 | 会話内容から「この人はリード化すべきか」を判定し、lead_conversionフラグを設定 | 判定ロジック実装 |
| 意向抽出 | 会話からextracted_tags・inferred_intentを抽出 | GPTによるタグ抽出処理 |

#### 将来フェーズ（Phase 3）

| 機能 | 説明 | 前提条件 |
|------|------|---------|
| AI住宅コンシェルジュ | ユーザーの検討フェーズ・行動履歴・プロフィールを踏まえた高度な対話 | 十分な行動データの蓄積 |
| AI営業マン | 住宅会社側に「この顧客にはこう提案すべき」を提示 | リード+行動+チャット+プロフィールの統合 |
| 商談前要約生成 | リードの行動履歴・チャット内容・意向を1ページに自動要約 | chat_sessions + user_events + user_profiles |
| 工務店別提案最適化 | 工務店の強み×顧客の関心を掛け合わせた提案文を自動生成 | builders構造化データ + ユーザーデータ |
| next best action推定 | ユーザーごとに「次にすべきこと」を推定して表示 | 行動パターン分析 + 成約者データ |

### 8.2 推薦ロジック

#### Phase 2での初期推薦

```
入力:
  - user_profilesの属性（エリア・予算・家族構成・デザイン志向）
  - user_eventsの閲覧傾向（よく見る物件の特徴）
  - chat_sessionsのextracted_tags

処理:
  - buildersの構造化データとマッチング
  - スコア計算（属性一致 × 閲覧類似度 × 地理的近さ）

出力:
  - builder_recommendationsに記録
  - 推薦工務店3社 + 推薦理由
```

---

## 第9章：CMS / 管理画面要件

### 9.1 CMS構造化データの方針

CMSは単なる入稿管理ではなく、**AIが理解・推薦しやすい構造化項目を登録する基盤**として設計する。

### 9.2 コンテンツ別の構造化項目

#### 物件（property）に追加すべき構造化項目

| 項目 | 型 | 用途 |
|------|-----|------|
| design_taste | text[] | デザインテイスト分類 |
| lifestyle_fit | text[] | 向いている暮らし方（子育て/シニア/共働き/趣味重視） |
| key_features | text[] | 特徴タグ（中庭/吹き抜け/回遊動線/大収納等） |
| target_audience | text[] | 想定ターゲット |

#### 記事（article）に追加すべき構造化項目

| 項目 | 型 | 用途 |
|------|-----|------|
| related_concerns | text[] | 関連する不安・疑問 |
| consideration_phase | text | 対象の検討フェーズ |
| related_builder_ids | text[] | 関連工務店 |

#### 工務店（builder）の構造化項目

第7章の builders テーブル追加カラムを参照。

### 9.3 管理画面の拡張要件

| 機能 | 内容 | Phase |
|------|------|-------|
| チャット分析ダッシュボード | セッション数・完了率・リード化率・抽出タグ分布 | Phase 2 |
| 行動分析ダッシュボード | コンテンツ別エンゲージメント・ファネル分析 | Phase 2 |
| リード詳細の拡張 | 行動履歴・チャット要約・推薦理由の表示 | Phase 2 |
| 工務店向けレポート生成 | 月次リード分析・コンテンツ効果レポート | Phase 2 |

---

## 第10章：イベント計測 / 分析要件

### 10.1 追跡対象イベント一覧

| イベント名 | 発火タイミング | 送信先 | Phase |
|-----------|---------------|--------|-------|
| page_view | ページ表示 | GA4 + user_events | Phase 1 |
| top_view | トップページ表示 | GA4 | Phase 1 |
| article_read | 記事ページで一定スクロール | GA4 + user_events | Phase 1 |
| video_view | YouTube動画再生開始 | GA4 + user_events | Phase 1 |
| builder_detail_view | 工務店詳細ページ表示 | GA4 + user_events | Phase 1 |
| event_detail_view | イベント詳細ページ表示 | GA4 + user_events | Phase 1 |
| favorite_add | お気に入り追加 | user_events | Phase 1 |
| favorite_remove | お気に入り解除 | user_events | Phase 1 |
| comparison_add | 比較リスト追加 | user_events | Phase 2 |
| chat_start | AIチャット開始 | GA4 + chat_sessions | Phase 1 |
| chat_complete | AIチャット終了（5メッセージ以上） | GA4 + chat_sessions | Phase 1 |
| chat_to_lead | チャットからリードへ転換 | GA4 + chat_sessions | Phase 2 |
| reservation_submit | 見学会予約フォーム送信 | GA4 + leads | Phase 1 |
| catalog_request | 資料請求フォーム送信 | GA4 + leads | Phase 1 |
| consultation_request | 無料相談フォーム送信 | GA4 + leads | Phase 1 |
| simulator_use | ローンシミュレーター利用 | GA4 + user_events | Phase 1 |
| line_click | LINE友だち追加クリック | GA4 | Phase 1 |
| tel_click | 電話番号クリック | GA4 | Phase 1 |

### 10.2 GA4カスタムディメンション

| ディメンション | 値の例 | 用途 |
|---------------|--------|------|
| user_type | anonymous / user / builder | ユーザー区分別分析 |
| consideration_phase | 情報収集 / 比較検討 / 決定直前 | フェーズ別分析 |
| content_category | property / article / builder / event | コンテンツ種別分析 |
| source_channel | youtube / seo / sns / direct | 流入経路別分析 |

---

## 第11章：非機能要件

### 11.1 パフォーマンス

| 項目 | 要件 |
|------|------|
| 初回ページ読み込み（LCP） | 3秒以内 |
| ページ遷移 | 1秒以内 |
| API応答時間 | 500ms以内 |
| AIチャット初回応答 | 3秒以内 |
| イベント送信 | 非同期、ページ表示をブロックしない |

### 11.2 セキュリティ

| 項目 | 要件 | ステータス |
|------|------|----------|
| HTTPS通信 | 全通信TLS暗号化 | ✅ |
| JWT認証 | 30日間有効 | ✅ |
| RBAC | admin/builder/user/anonymous 4段階 | ✅ |
| XSS対策 | HTMLサニタイザー | ✅ |
| 行動データ分離 | 個人情報と行動ログを分離保存 | Phase 1 |
| 同意管理 | データ取得に関する同意取得 | Phase 1 |
| 監査ログ | 管理操作の記録 | ✅ |

### 11.3 可用性・スケーラビリティ

| 項目 | 要件 |
|------|------|
| 稼働率 | 99.9%以上 |
| サーバーレス | Vercel Edge Functions |
| DB | Supabase接続プーリング |
| CDN | Vercel CDN |
| イベントバッファ | user_eventsの書き込みはバッチ化して負荷軽減 |

### 11.4 レスポンシブ・SEO

| 項目 | 要件 | ステータス |
|------|------|----------|
| モバイルファースト | 375px〜対応 | ✅ |
| メタタグ | 全ページ設定 | ✅ |
| OGP | SNSシェア用画像 | ✅ |
| サイトマップ | 自動生成 | ✅ |
| 構造化データ（JSON-LD） | 物件・イベント・記事 | 📋 |

---

## 第12章：外部連携要件

| サービス | 用途 | ステータス | Phase |
|---------|------|----------|-------|
| Supabase | DB・ストレージ | ✅ | - |
| NextAuth | 認証 | ✅ | - |
| Google OAuth | ソーシャルログイン | ✅ | - |
| OpenAI GPT-4o | AIコンシェルジュ | ✅ | - |
| GA4 | アクセス解析・カスタムイベント | 🔧 | Phase 1 |
| Resend | リード通知メール | 🔧 | Phase 1 |
| Stripe | 工務店サブスクリプション | 📋 | Phase 3 |
| LINE Messaging API | 友だち追加・通知 | 📋 | Phase 2 |

### 12.1 API一覧

| メソッド | エンドポイント | 認証 | ステータス |
|---------|---------------|------|----------|
| GET/POST | /api/auth/[...nextauth] | - | ✅ |
| POST | /api/contact | 不要 | ✅ |
| GET | /api/leads | 必要 | ✅ |
| POST | /api/leads | 必要 | ✅ |
| GET/PATCH | /api/leads/[id] | 必要 | ✅ |
| GET | /api/builders | 不要 | ✅ |
| GET/POST | /api/events | 不要/必要 | ✅ |
| GET | /api/stats | 必要 | ✅ |
| POST | /api/chat | 不要 | ✅→拡張 |
| POST | /api/events/track | 不要 | 📋 Phase 1 |
| GET/POST | /api/favorites | 必要 | 📋 Phase 1 |
| GET/POST | /api/comparisons | 必要 | 📋 Phase 2 |
| GET | /api/recommendations | 必要 | 📋 Phase 2 |
| GET | /api/user/profile | 必要 | 📋 Phase 2 |
| PATCH | /api/user/profile | 必要 | 📋 Phase 2 |

---

## 第13章：MVP / 次フェーズ / 将来構想

### Phase 0（完了 ✅）
- 消費者向け全ページ（20画面）
- 住宅会社向け全ページ（8画面）
- CMS管理画面（27画面）
- リード獲得フォーム
- 認証基盤
- AIチャット基盤
- 工務店ダッシュボード（読み取り中心）

### Phase 1：データ基盤構築（最優先）

| 項目 | なぜ今やるか |
|------|-------------|
| ユーザー識別子統一（anonymous_id → user_id接続） | 行動データの連続性の基盤。これなしにデータは使えない |
| user_eventsテーブル + イベント送信API | AIが学習するデータの根幹。早く始めるほどデータが溜まる |
| chat_sessions / chat_messagesテーブル | チャットログなしに意向抽出・要約は不可能 |
| チャットログ保存機能 | 既存APIチャットの拡張。ログをDBに保存する |
| リードと行動データの紐付け | リードに「直前閲覧」「流入元」を付与。住宅会社への価値向上 |
| お気に入り機能（favorites） | ユーザーの明示的関心表明。データとしても推薦材料としても重要 |
| 閲覧履歴表示 | ユーザー体験の向上 + データの可視化 |
| GA4カスタムイベント計測設計 | ファネル分析・CV率計測の基盤 |
| CMS構造化データ項目追加 | AI推薦のマッチング材料。後から追加するとデータ欠損 |
| Resendによるリード通知メール | 工務店への即時通知。運用の基本 |

### Phase 2：AI活用開始

| 項目 | 内容 |
|------|------|
| user_profilesテーブル | 段階的プロフィール構築 |
| 比較リスト機能 | 物件・工務店の比較 |
| AIチャット拡張（推薦・診断・要約） | 意向抽出・タグ付け・推薦・要約 |
| 推薦ロジック初期版 | 閲覧傾向 × 工務店構造化データ |
| 意向データ付きリード | 関心タグ・チャット要約・行動文脈をリードに付与 |
| スコアリング可視化 | 行動データに基づく温度感の自動計算 |
| 管理画面分析ダッシュボード | チャット分析・行動分析・ファネル分析 |
| 工務店向けレポート基盤 | 月次リードレポート・コンテンツ効果レポート |

### Phase 3：AI本格稼働・SaaS化

| 項目 | 内容 |
|------|------|
| AI住宅コンシェルジュ | 検討フェーズ認識 + 行動文脈 + パーソナライズ対話 |
| AI営業マン | 住宅会社向け提案支援 |
| 商談前要約自動生成 | チャット + 行動 + プロフィールの統合要約 |
| 営業改善SaaS | 成約パターン分析・最適提案 |
| Stripe決済連携 | 工務店サブスクリプション |
| CRM連携 | 外部CRMへのデータ連携 |
| エリア拡大 | 九州全域 → 中国・四国 |

---

## 第14章：開発優先順位

### 最優先（Phase 1）

| 優先度 | 実装項目 | 理由 |
|--------|---------|------|
| S | ユーザー識別子の統一（anonymous_id） | 全データの接続基盤 |
| S | user_eventsテーブル + イベント送信API | AIデータの根幹 |
| S | chat_sessions / chat_messages保存 | 意向推定の材料 |
| S | リードへの流入チャネル・直前閲覧の付与 | リード品質向上の即効性が高い |
| A | お気に入り機能 | ユーザーの関心表明データ |
| A | 閲覧履歴機能 | データ蓄積 + UX向上 |
| A | GA4カスタムイベント設計・実装 | 計測なしに改善はできない |
| A | CMS構造化データ項目追加 | AI推薦の材料。後からだと過去データが欠損 |
| B | Resendリード通知メール | 運用の基本 |
| B | CMS → Supabase永続化 | 現在TSファイルに依存している部分の移行 |

### 次点（Phase 2）

| 優先度 | 実装項目 |
|--------|---------|
| A | AIチャット拡張（意向抽出・タグ付け・要約） |
| A | 推薦ロジック初期版 |
| A | 意向データ付きリード |
| B | user_profilesテーブル |
| B | 比較リスト機能 |
| B | 管理画面分析ダッシュボード |
| B | 工務店向けレポート基盤 |
| B | スコアリング可視化 |

### 後回しでよい

| 項目 | 理由 |
|------|------|
| Stripe請求管理の高度化 | パートナー数が少ない段階では手動対応で十分 |
| 複雑な課金UI | まず価値を証明してから |
| 全国展開前提の仕様 | 九州で十分なデータを蓄積してから |
| 高度な自動化（リード自動配分等） | データとルールが十分に揃ってから |
| CRM連携 | 工務店側のCRM利用状況を調査してから |

---

## 第15章：KPI / 評価指標

### 15.1 プラットフォーム全体KPI

| カテゴリ | KPI | 現在値 | 目標値（6ヶ月） |
|---------|-----|--------|----------------|
| 集客 | 月間WEB PV | 計測中 | 50,000 |
| 集客 | YouTube月間視聴回数 | 152,228 | 300,000 |
| リード | 月間リード獲得数 | - | 50件 |
| 成約 | リード→成約転換率 | - | 15% |
| B2B | パートナー工務店数 | 12社 | 25社 |

### 15.2 AI / チャットKPI

| KPI | 定義 | 目標値 |
|-----|------|--------|
| AI相談開始率 | サイト訪問者のうちチャットを開始した割合 | 5% |
| AI相談完了率 | チャット開始者のうち5メッセージ以上会話した割合 | 60% |
| AI経由CV率 | チャット完了者のうちリード化した割合 | 15% |
| チャット→予約率 | チャット後に見学会予約した割合 | 8% |
| チャット→資料請求率 | チャット後に資料請求した割合 | 12% |
| チャット→離脱率 | チャット後に何もアクションせず離脱した割合 | 65%以下 |

### 15.3 コンテンツ→CV率

| KPI | 定義 |
|-----|------|
| 動画→CV率 | 動画視聴者のうちリード化した割合 |
| 記事→CV率 | 記事閲覧者のうちリード化した割合 |
| 工務店詳細→CV率 | 工務店詳細閲覧者のうちリード化した割合 |
| イベント詳細→CV率 | イベント詳細閲覧者のうち予約した割合 |

### 15.4 ユーザー行動KPI

| KPI | 定義 |
|-----|------|
| お気に入り率 | 物件詳細閲覧者のうちお気に入りした割合 |
| 比較追加率 | 物件詳細閲覧者のうち比較リストに追加した割合 |
| 推薦クリック率 | 推薦表示回数のうちクリックされた割合 |
| 会員登録率 | 訪問者のうち会員登録した割合 |

### 15.5 成約者分析KPI

| KPI | 定義 | 用途 |
|-----|------|------|
| 成約者の平均閲覧コンテンツ数 | 成約に至った人が平均何件のコンテンツを見たか | コンテンツ戦略の指標 |
| 成約者の平均相談回数 | 成約者が平均何回AIチャットを使ったか | AIの貢献度評価 |
| 成約者の閲覧コンテンツ傾向 | 成約者がよく見たコンテンツのカテゴリ | コンテンツ制作の優先順位 |
| 成約者の検討期間 | 初回訪問〜成約までの日数 | ファネル最適化 |

---

*本文書は payhome-next コードベース（2026-03-22時点）の実装状態および将来構想に基づいて作成されたものです。*
