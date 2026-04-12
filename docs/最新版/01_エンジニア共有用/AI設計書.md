# AI機能 設計書

最終更新: 2026-04-12
関連文書: `AI要件定義書.md`

---

## 1. システム概要

ぺいほーむの AI 機能は、**Next.js API Routes + Supabase + OpenAI API** を組み合わせたシンプルな構成。
MVP では LLM 呼び出しを最小化し、Phase 2 以降に段階的に LLM 比重を上げていく。

```
┌──────────────┐   POST   ┌─────────────────┐   upsert   ┌────────────┐
│  /diagnosis  │ ───────▶ │ /api/ai/        │ ──────────▶ │ Supabase   │
│  (client)    │          │  diagnosis      │             │            │
└──────────────┘          └─────────────────┘             │ diagnosis_ │
                                                          │ sessions   │
                                                          │ user_      │
                                                          │ profiles   │
                                                          └────────────┘

┌──────────────┐  stream  ┌─────────────────┐  stream   ┌────────────┐
│  Chat UI     │ ───────▶ │ /api/chat       │ ────────▶ │ OpenAI     │
│  (client)    │ ◀─────── │                 │ ◀──────── │ GPT-4o     │
└──────────────┘          └─────────────────┘           └────────────┘
                                  │
                                  │ insert
                                  ▼
                          ┌──────────────┐
                          │ chat_sessions│
                          │ chat_messages│
                          └──────────────┘
```

## 2. 技術スタック

| レイヤー | 技術 | 理由 |
| --- | --- | --- |
| API Route | Next.js 16 App Router | Next.js 単体で完結、Vercel Edge 対応可 |
| LLM | OpenAI GPT-4o | 日本語品質と応答速度のバランス |
| LLM (将来) | Claude Sonnet 4.5 / Gemini 2.0 候補 | Phase 2 でラッパー経由に切り替え可能にする |
| DB | Supabase PostgreSQL | RLS で工務店別データ分離が容易 |
| Local Fallback | `src/lib/local-store.ts` | Supabase 未接続時の開発・テスト用 |
| 認証 | NextAuth.js (JWT) | API Route から token 経由で user_id 取得 |
| Bot対策 | Cloudflare Turnstile | 診断・チャットの濫用防止 |
| 計測 | GA4 + Vercel Analytics + Sentry | 応答時間・離脱率・エラー追跡 |

## 3. データモデル

### 3.1 既存テーブル

#### `diagnosis_sessions`

| カラム | 型 | 備考 |
| --- | --- | --- |
| id | uuid (PK) | |
| anonymous_id | text | Cookie ベース |
| user_id | uuid (FK users) | ログイン時のみ |
| answers | jsonb | 10問の回答全て |
| user_type | text | 7タイプ |
| recommended_builders | jsonb | `[{builder_id, score, reason}]` |
| completed_at | timestamptz | 完走時刻 |
| created_at | timestamptz | |

インデックス: `(user_id)`, `(anonymous_id)`, `(completed_at DESC)`

#### `user_profiles`

| カラム | 型 | 備考 |
| --- | --- | --- |
| user_id | uuid (PK, FK users) | |
| family_structure | text | |
| age_range | text | |
| budget_range | text | |
| preferred_area | text | |
| has_land | boolean | |
| planned_timing | text | |
| design_orientation | text[] | |
| performance_orientation | text[] | |
| lifestyle_priorities | text[] | |
| consideration_phase | text | |
| user_type | text | |
| updated_at | timestamptz | |

#### `chat_sessions`

| カラム | 型 | 備考 |
| --- | --- | --- |
| id | uuid (PK) | |
| anonymous_id | text | |
| user_id | uuid (FK) | nullable |
| title | text | 初回メッセージの先頭 50 文字 |
| source_page | text | どのページから起動したか |
| message_count | int | |
| last_message_at | timestamptz | |
| created_at | timestamptz | |

#### `chat_messages`

| カラム | 型 | 備考 |
| --- | --- | --- |
| id | uuid (PK) | |
| session_id | uuid (FK chat_sessions) | |
| role | text | user / assistant / system |
| content | text | |
| created_at | timestamptz | |

### 3.2 Phase 4 で追加するテーブル

#### `builder_questions` (API は実装済み、Phase 4 で UI 公開)

| カラム | 型 | 備考 |
| --- | --- | --- |
| id | uuid (PK) | |
| builder_id | text (FK builders) | |
| user_id | uuid (FK users) | nullable |
| anonymous_id | text | |
| question | text | 1000 文字上限 |
| category | text | pricing/design/quality/process/other |
| status | text | pending/answered/resolved |
| answer | text | nullable |
| answered_at | timestamptz | nullable |
| tone_adjusted_question | text | AI 調整後の質問（audit 用） |
| created_at | timestamptz | |

#### `monthly_reports` (Phase 4 新設)

| カラム | 型 | 備考 |
| --- | --- | --- |
| id | uuid (PK) | |
| report_month | text | `YYYY-MM` |
| report_type | text | platform / builder |
| builder_id | text (FK builders) | nullable (platform 時) |
| metrics | jsonb | 集計結果全て |
| generated_at | timestamptz | |
| generated_by | text | scheduled / manual |

UNIQUE: `(report_month, report_type, builder_id)`
インデックス: `(report_month DESC)`, `(builder_id)`

## 4. API 仕様

### 4.1 POST `/api/ai/diagnosis`

#### リクエスト

```jsonc
{
  "anonymous_id": "anon_abc123",
  "answers": {
    "family_structure": "family_kids",
    "age_range": "30s",
    "budget_range": "2500-3000",
    "preferred_area": "鹿児島市",
    "has_land": "searching",
    "planned_timing": "6-12months",
    "design_orientation": ["modern", "natural"],
    "performance_orientation": ["insulation", "zeh"],
    "lifestyle_priorities": ["family_friendly", "storage"],
    "consideration_phase": "comparison"
  }
}
```

#### レスポンス (200)

```jsonc
{
  "session_id": "uuid",
  "user_type": "performance_focused",
  "recommended_builders": [
    {
      "id": "builder-1",
      "name": "○○工務店",
      "area": "鹿児島市",
      "score": 80,
      "reason": "高性能住宅に強み・年間120棟の豊富な施工実績"
    },
    ...
  ]
}
```

#### エラーケース

| ステータス | body | 原因 |
| --- | --- | --- |
| 400 | `{error: "missing_answers"}` | answers が空または未指定 |
| 500 | `{error: "internal_error"}` | DB エラー、未キャッチ例外 |

### 4.2 POST `/api/chat` (SSE ストリーミング)

#### リクエスト

```jsonc
{
  "messages": [
    {"role": "user", "content": "鹿児島で2500万円で平屋は建ちますか？"}
  ],
  "sessionId": null,
  "anonymousId": "anon_abc123",
  "sourcePage": "/"
}
```

#### レスポンス (SSE ストリーム)

`Content-Type: text/event-stream` で以下の形式を流す:

```
data: {"content": "鹿児島"}

data: {"content": "では平屋の相場として"}

data: {"content": "..."}

data: [DONE]
```

#### ヘッダー

- `X-Chat-Session-Id`: 新規作成された場合のセッションID

### 4.3 POST `/api/builders/questions` (Phase 4)

実装済み。リクエスト: `builder_id`, `question`, `anonymous_id?`, `category?`。
レスポンス: `{ ok: true, id }`。

### 4.4 POST `/api/reports/monthly/generate` (Phase 4、未実装)

#### 実装予定シグネチャ

```typescript
export async function POST(request: NextRequest) {
  const { month, builder_id } = await request.json()
  // month = "2026-09"
  // builder_id = optional
  const start = `${month}-01`
  const end = `${nextMonth(month)}-01`

  const metrics = await aggregateMonth(start, end, builder_id)
  const report = await supabase
    .from('monthly_reports')
    .upsert({
      report_month: month,
      report_type: builder_id ? 'builder' : 'platform',
      builder_id: builder_id || null,
      metrics,
      generated_at: new Date().toISOString(),
      generated_by: 'manual',
    }, { onConflict: 'report_month,report_type,builder_id' })
    .select()
    .single()

  return Response.json({ report })
}
```

## 5. 診断レコメンドロジック

### 5.1 MVP (Phase 1): ルールベース

現行実装: `src/app/api/ai/diagnosis/route.ts > recommendBuilders()`

フロー:

```
1. 希望エリアで工務店候補をフィルタ
   ↓ (3社未満なら鹿児島県全社にフォールバック)
2. 各候補に初期スコア 50 点
   ↓
3. 年間棟数でスコア加点 (~10点)
   ↓
4. ユーザータイプごとの specialty マッチで加点 (~15点)
   ↓
5. 平屋 specialty に一律 +5点
   ↓
6. スコア降順ソート、上位3社を返す
```

加点ルール表:

| 条件 | +点 | 理由文例 |
| --- | --- | --- |
| `annualBuilds >= 100` | +10 | 年間120棟の豊富な施工実績 |
| `annualBuilds >= 50` | +5 | 年間60棟の確かな施工実績 |
| `design_focused & specialty~/デザイン/` | +15 | デザイン重視の施工が得意 |
| `performance_focused & specialty~/高性能|ZEH|断熱/` | +15 | 高性能住宅に強み |
| `cost_focused & specialty~/ローコスト|コスパ/` | +15 | コストパフォーマンスの高い家づくり |
| `senior_friendly & specialty~/平屋|バリアフリー/` | +15 | 平屋・バリアフリーの設計に強み |
| `natural_focused & specialty~/自然素材|木/` | +15 | 自然素材を活かした家づくり |
| `family_focused & specialty~/子育て|家族/` | +10 | 子育て世帯向けの提案が豊富 |
| `specialty~/平屋/` | +5 | 平屋の施工経験あり |

### 5.2 Phase 2: LLM ハイブリッド（計画）

現行ルールで上位5社に絞り → GPT-4o-mini にスコアリング根拠を JSON で出力させる。

```typescript
const prompt = `
あなたは住宅コンサルタントです。以下のユーザー情報と工務店候補5社から、
最も相性の良い上位3社を選び、それぞれの推薦理由を50文字以内で生成してください。

ユーザー情報:
${JSON.stringify(answers, null, 2)}

工務店候補:
${candidates.map(c => `${c.name} (specialties: ${c.specialties.join(', ')})`).join('\n')}

JSON で返す:
[
  { "builder_id": "...", "rank": 1, "reason": "..." },
  ...
]
`
```

期待効果: reason のパーソナライズ、ルールでは拾えない要望ニュアンスへの対応。

### 5.3 Phase 4: RAG 版（案）

工務店の施工事例 / 動画 / FAQ をベクトル化し、`text-embedding-3-small` で類似度検索。
LLM に渡して「この事例があるから○○さんにおすすめ」と固有事例を引用させる。

## 6. チャット処理フロー

```
1. Client が /api/chat に POST (messages, anonymousId, sourcePage)
   ↓
2. sessionId が無ければ chat_sessions に INSERT（最初のメッセージの先頭50文字を title に）
   ↓
3. ユーザーメッセージを chat_messages に INSERT
   ↓
4. OpenAI Chat Completions API にストリーミングリクエスト
   ↓
5. delta.content を逐次 SSE で Client に配信
   ↓
6. ストリーム完了後、フルコンテンツを chat_messages に INSERT
   ↓
7. chat_sessions.message_count と last_message_at を UPDATE
```

Phase 1 では OpenAI SDK をそのまま使用。
Phase 2 で `src/lib/llm/` を新設し、以下の関数でラップする:

```typescript
// src/lib/llm/client.ts
export async function streamChat(
  messages: ChatMessage[],
  opts?: { model?: string; temperature?: number }
): Promise<AsyncIterable<string>>

export async function completeJson<T>(
  prompt: string,
  schema: ZodSchema<T>
): Promise<T>
```

これにより Claude / Gemini / ローカル LLM への差し替えが API Route 側を変えずに可能。

## 7. フロントエンド連携

### 7.1 診断フロー

- Client: `src/app/(user)/diagnosis/page.tsx`
- State 管理: `useState` でステップ管理 + answers オブジェクト
- 最終質問後: `fetch('/api/ai/diagnosis', { method: 'POST', body })` で一括送信
- 完了後: 結果画面にリダイレクト、`/mypage`（ログイン時）にも保存される

### 7.2 チャットフロー

- Client: TOP の `AIChatWidget` 等（未実装）
- ストリーミング読み取り: `fetch` → `response.body.getReader()` で SSE を逐次デコード
- セッションIDは `X-Chat-Session-Id` レスポンスヘッダーから取得し、次回リクエストに添付

## 8. エラーハンドリング

### 8.1 診断 API

| シナリオ | 対応 |
| --- | --- |
| Supabase 接続失敗 | `local-store.ts` にフォールバック、200 応答 |
| answers 不正 | 400 `missing_answers` |
| 予期しない例外 | 500 `internal_error`、Sentry にキャプチャ |

### 8.2 チャット API

| シナリオ | 対応 |
| --- | --- |
| OpenAI API 失敗 | 500、ストリームを close、エラーログ |
| セッション保存失敗 | 応答は継続、ログ警告のみ |
| ストリーム途中切断 | `controller.close()` で graceful 終了 |

## 9. レート制限・コスト管理

| リソース | Phase 1 | Phase 2 | Phase 4 |
| --- | --- | --- | --- |
| 診断 | IP あたり 5回/分 | 5回/分 | 10回/分 + 月100回上限 |
| チャット | IP あたり 20req/分 | 20req/分 | SaaS は無制限、無料は 20req/日 |
| 月次 API コスト | $100 | $300 | $1000 (SaaS 収益でカバー) |

実装: Vercel の `edge-config` または Upstash Redis + sliding window。

## 10. モニタリング指標

| 指標 | 計測方法 | 閾値 |
| --- | --- | --- |
| 診断 API p95 応答時間 | Vercel Analytics | 2 秒以内 |
| 診断完走率 | GA4 `diagnosis_complete / diagnosis_start` | 40% 以上 |
| チャット初回トークン時間 | カスタムイベント | 1.5 秒以内 |
| OpenAI API エラー率 | Sentry | 1% 以下 |
| Supabase クエリエラー率 | Sentry | 0.5% 以下 |
| 月次 OpenAI コスト | OpenAI ダッシュボード | $100 以下 |

## 11. テスト計画

### 11.1 単体テスト

- `classifyUserType()` の 7 パターン全てに対するテスト
- `recommendBuilders()` のスコアリングテスト（既知の入力に対し同じ順位になること）

### 11.2 統合テスト

- `POST /api/ai/diagnosis` — Supabase mock で 200 応答と DB insert の確認
- `POST /api/chat` — OpenAI mock でストリーム応答と DB insert の確認

### 11.3 E2E テスト (Playwright)

- `/diagnosis` ページで 10 問全て回答 → 結果画面に推薦3社が表示される
- TOP のチャットで質問 → 応答が表示される

## 12. セキュリティ考慮事項

| 脅威 | 対策 |
| --- | --- |
| Prompt Injection | システムプロンプトでユーザー入力を囲まない、`role: system` に閉じる |
| PII 漏洩 | 診断応答 / チャット応答を LLM 送信前にサニタイズ（住所・電話番号の検出） |
| API Key 漏洩 | `OPENAI_API_KEY` はサーバー側の `.env` のみ、`NEXT_PUBLIC_*` には絶対に入れない |
| Cost Attack (無限ループ投稿) | Turnstile + Rate Limit + max_tokens=1000 |
| SQL Injection | Supabase クライアントのパラメータ化クエリを使用（raw SQL 禁止） |
| Session Hijacking | JWT の secret を本番で再生成、Cookie は Secure + HttpOnly + SameSite=Lax |

## 13. 今後の拡張案

| フェーズ | 案 |
| --- | --- |
| Phase 2 | 診断結果に「あなたに似た家族の事例3件」をレコメンド |
| Phase 2 | チャット履歴の要約を工務店ダッシュボードに週次配信 |
| Phase 3 | 建売物件の AI マッチング（希望条件から最適物件TOP5） |
| Phase 4 | AI Q&A の回答テンプレートを工務店に提案（回答時間短縮） |
| Phase 4 | 月次レポート自動メール配信（SendGrid 経由） |
| Phase 5 | 画像認識で事例写真から類似物件検索 |
| Phase 5 | 音声診断（スマホで話しかけて相性判定） |

## 14. 参考ファイル一覧

| 種別 | ファイル |
| --- | --- |
| 質問定義 | `src/lib/diagnosis-questions.ts` |
| 診断 API | `src/app/api/ai/diagnosis/route.ts` |
| 診断取得 API | `src/app/api/ai/diagnosis/me/route.ts` |
| 診断 UI | `src/app/(user)/diagnosis/page.tsx` |
| チャット API | `src/app/api/chat/route.ts` |
| 工務店質問 API | `src/app/api/builders/questions/route.ts`, `src/app/api/builders/questions/[id]/route.ts` |
| 匿名質問 UI | `src/components/builders/AnonymousQuestionForm.tsx` |
| 工務店データ | `src/lib/builders-data.ts` |
| ローカルフォールバック | `src/lib/local-store.ts` |
| Supabase クライアント | `src/lib/supabase.ts` |
