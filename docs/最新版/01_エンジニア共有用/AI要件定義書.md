# AI機能 要件定義書

最終更新: 2026-04-12
対象リリース: 2026-05-01 MVP + Phase 2〜4 順次追加
ステータス: **Phase 1 確定 / Phase 2〜4 案**

---

## 1. 目的

ぺいほーむは「動画 → 工務店 → 見学会予約」の核ループに AI を差し込むことで、以下を達成する。

1. **ユーザーの迷いを減らす** — 10問の質問で「自分に合う家」を明確化
2. **工務店とのマッチング精度を上げる** — 感覚ではなくデータで推薦
3. **運用負荷を減らす** — 問合せ対応を半自動化
4. **ストック型収益を生む** — Phase 4 の SaaS プランで AI 機能を有料化

## 2. 用語定義

| 用語 | 意味 |
| --- | --- |
| AI家づくり診断 | 10問の選択式質問から、ユーザータイプ分類と推薦工務店3社を返す機能 |
| ユーザータイプ | 診断結果のラベル（高性能重視 / デザイン重視 / コスト重視 / 終の棲家 / 子育て重視 / ナチュラル派 / バランス重視 の7タイプ） |
| 匿名AI仲介質問 | ユーザーが匿名で工務店に質問でき、AI が表現調整・仲介する機能（Phase 4） |
| Smart Match | 診断 + 見学会予約時の訪問目的（体感 / 相談 / 契約検討）を工務店に渡す仕組み |
| 月次レポート | AI が user_events / chat_sessions / leads / favorites を集計し、月次でプラットフォーム全体と工務店別に配信（SaaS プラン機能、Phase 4） |
| RAG | Retrieval-Augmented Generation。工務店FAQ・記事・マニュアルをベクトル検索し LLM に渡す手法 |

## 3. 対象範囲

### 3.1 MVP（Phase 1）で動作する AI 機能

| 機能 | 状態 | 実装済ファイル |
| --- | --- | --- |
| AI家づくり診断（10問） | **MVP で動作** | `src/app/(user)/diagnosis/page.tsx`, `src/app/api/ai/diagnosis/route.ts`, `src/lib/diagnosis-questions.ts` |
| 住宅相談チャット（LLM ストリーミング） | **MVP で動作** | `src/app/api/chat/route.ts`（OpenAI GPT-4o 使用） |

### 3.2 Phase 2〜4 で追加する AI 機能

| 機能 | Phase | 現時点の実装 |
| --- | --- | --- |
| 診断レコメンドの精度向上 (LLM 判定) | Phase 2 | 未実装（ルールベースから差し替え） |
| **`lead_source` tracking (成果報酬対象の識別)** | **Phase 3** | **未実装 — `leads` テーブルに `lead_source` カラム追加 + 無料相談/AI診断/会員登録フローでの自動記録** |
| 匿名AI仲介質問（ユーザー→工務店） | Phase 4 | API のみ存在 `src/app/api/builders/questions/route.ts` |
| 月次レポート自動集計 | Phase 4 | API ルート未作成（`/api/reports/monthly/*`） |
| 工務店ダッシュボードの AI Q&A | Phase 4 | UI のみ `src/app/dashboard/builder/questions/page.tsx`（中身は API 未結線） |

### 3.3 成果報酬の対象判定ロジック (Phase 3 導入)

料金モデル v2 では成果報酬 3% が以下の条件で発生する:

| 対象 | `lead_source` | 成果報酬 |
| --- | --- | --- |
| 無料相談経由 (`/consultation`) | `consultation` | ✅ 3% |
| AI 診断経由 (`/diagnosis`) | `diagnosis` | ✅ 3% |
| 会員登録済みユーザーの成約 | `member` | ✅ 3% |
| 非会員の直接問合せ | `direct` | ❌ なし |

#### 実装要件

1. **DB スキーマ**: `leads` テーブルに以下のカラムを追加
   ```sql
   ALTER TABLE leads ADD COLUMN lead_source TEXT CHECK (lead_source IN ('consultation','diagnosis','member','direct'));
   ```

2. **記録ロジック**:
   - 無料相談フォーム送信時: `lead_source = 'consultation'`
   - AI 診断完了時にリード生成: `lead_source = 'diagnosis'`
   - ログイン済みユーザーからの任意のリード: `lead_source = 'member'`
   - 匿名ユーザーからの直接問合せ: `lead_source = 'direct'`

3. **成約報告フローと成果報酬集計**:
   - 工務店ダッシュボードに「成約報告」フォームを実装
   - `leads` レコードに `contract_signed_at` / `contract_amount` を追記
   - 月次で `lead_source IN ('consultation','diagnosis','member')` の成約を集計
   - 成果報酬 = `契約額 × 0.03` (上限なし)

## 4. 機能要件

### 4.1 AI家づくり診断

#### 4.1.1 ユースケース

```
ユーザー → /diagnosis にアクセス
        → 10問の質問に順次回答（1問につき1画面）
        → 最終画面で結果を取得
        → 「あなたは○○タイプです」+ 推薦工務店3社が表示される
        → 会員なら結果が mypage に保存される
```

#### 4.1.2 入力項目（10問）

| # | key | 質問 | 型 | 選択肢数 |
| --- | --- | --- | --- | --- |
| 1 | family_structure | 家族構成 | 単一選択 | 4 |
| 2 | age_range | 年齢 | 単一選択 | 5 |
| 3 | budget_range | 予算 | 単一選択 | 5 |
| 4 | preferred_area | 希望エリア | 単一選択 | 5 |
| 5 | has_land | 土地の有無 | 単一選択 | 3 |
| 6 | planned_timing | 建築・入居時期 | 単一選択 | 5 |
| 7 | design_orientation | 好みのテイスト | 複数選択 | 5 |
| 8 | performance_orientation | こだわる性能 | 複数選択 | 5 |
| 9 | lifestyle_priorities | 暮らしで大切にしたいこと | 複数選択 | 6 |
| 10 | consideration_phase | 検討段階 | 単一選択 | 4 |

定義: `src/lib/diagnosis-questions.ts` の `DIAGNOSIS_QUESTIONS`

#### 4.1.3 出力項目

- `user_type`: 7種類のユーザータイプのいずれか
- `recommended_builders`: 上位3社（`id`, `name`, `area`, `score`, `reason`）
- `session_id`: DB 保存後のセッションID

#### 4.1.4 ユーザータイプ分類ロジック（MVP = ルールベース）

`src/lib/diagnosis-questions.ts > classifyUserType()` 参照。
優先順位:

1. 性能重視（断熱 & 気密）→ `performance_focused`
2. デザイン重視（モダン/北欧/インダストリアル）→ `design_focused`
3. コスト重視（予算 2500 万円以下）→ `cost_focused`
4. 終の棲家（バリアフリー or 二世帯）→ `senior_friendly`
5. 家族・子育て重視 → `family_focused`
6. ナチュラル派 → `natural_focused`
7. それ以外 → `balanced`

#### 4.1.5 推薦工務店スコアリング（MVP = ルールベース）

`src/app/api/ai/diagnosis/route.ts > recommendBuilders()` 参照。
初期スコア 50 点から加点:

| 加点条件 | +点 |
| --- | --- |
| 年間 100 棟以上 | +10 |
| 年間 50 棟以上 | +5 |
| タイプに合致する specialty（例: 性能重視 & ZEH対応） | +15 |
| 子育て重視 & 子育てspecialty | +10 |
| 平屋 specialty | +5 |

エリアフィルタ: 希望エリアの工務店が 3 社未満なら `鹿児島県` の全社にフォールバック。

#### 4.1.6 永続化

| テーブル | 主キー | 内容 |
| --- | --- | --- |
| `diagnosis_sessions` | id | 回答と推薦結果を全件保存 |
| `user_profiles` | user_id | ログイン済みなら answers の主要項目を upsert |

Supabase 未接続時は `src/lib/local-store.ts` のローカルフォールバックに書く。

#### 4.1.7 非機能要件

- **応答時間**: エンドツーエンドで 2 秒以内（MVP はルールベースのため十分）
- **離脱率**: 10問完走率 40% 以上（Phase 1 目標）
- **計測**: GA4 に `diagnosis_start` / `diagnosis_complete` / `diagnosis_question_{n}_answered` イベントを発火

#### 4.1.8 セキュリティ・プライバシー

- 匿名ID（`anonymous_id`）は Cookie で保持、PII は保存しない
- 会員診断はログイン済みユーザーのみ `user_profiles` に保存
- 診断結果は工務店には「ユーザータイプ」「希望エリア」「予算レンジ」のみ共有（氏名・住所は見学会予約時まで非開示）

### 4.2 住宅相談チャット

#### 4.2.1 ユースケース

TOP のチャット UI から質問 → OpenAI GPT-4o でストリーミング応答 → 応答を DB に保存。

#### 4.2.2 入力項目

- `messages`: Array<{ role: 'user' | 'assistant', content: string }>
- `sessionId?`: 既存セッションに追記する場合
- `anonymousId`: 匿名トラッキングID
- `sourcePage`: どのページから来たか

#### 4.2.3 システムプロンプト

`src/app/api/chat/route.ts > SYSTEM_PROMPT` に定義:

- ぺいほーむの役割説明 (平屋づくりの意思決定プラットフォーム)
- 家づくり・ローン・補助金への対応
- 工務店の整理・比較提案
- AI診断 / 無料相談 / 見学会予約 / 会員登録への誘導
- 回答スタイル（親しみやすく専門的、3-5文、フォローアップ質問で終わる）

**注記 (2026-04-12):** v2 方針で「資料請求」はシステムプロンプトから削除済み。
工務店ヒアリングの結果、資料請求のリード質が低いことが判明したため、主要導線から外しました。

#### 4.2.4 LLM 設定

| 項目 | 値 |
| --- | --- |
| モデル | `gpt-4o` (OpenAI) |
| ストリーミング | 有効 (`stream: true`) |
| temperature | 0.7 |
| max_tokens | 1000 |

#### 4.2.5 永続化

| テーブル | 内容 |
| --- | --- |
| `chat_sessions` | 匿名ID, 初回メッセージ, sourcePage, message_count |
| `chat_messages` | session_id, role, content |

#### 4.2.6 非機能要件

- **初回応答時間（トークン1）**: 1.5 秒以内
- **タイムアウト**: 60 秒
- **月次コスト上限**: Phase 1 は $100/月（超過時は rate limit）

### 4.3 匿名AI仲介質問（Phase 4 で UI 復活）

#### 4.3.1 ユースケース

```
ユーザー → 工務店詳細ページで「匿名で質問する」ボタンを押す
        → カテゴリ（料金 / デザイン / 品質 / 流れ / その他）と本文を入力
        → 送信時に AI がトーン調整（失礼な表現を穏やかに）
        → 工務店ダッシュボードに届き、回答を入力
        → AI が回答を整形してユーザーに通知
```

#### 4.3.2 入力項目

- `builder_id`: 必須
- `question`: 必須、1000 文字以内
- `category`: pricing / design / quality / process / other
- `anonymous_id` or `user_id`

API: `src/app/api/builders/questions/route.ts`

#### 4.3.3 AI の役割

| ステップ | 処理 |
| --- | --- |
| ユーザー投稿前 | トーン調整（不適切な語彙を穏やかに変換） |
| 工務店への通知 | 質問要約 + カテゴリタグ付与 |
| 回答後のユーザー通知 | 回答を整形（専門用語を注釈付きで） |

#### 4.3.4 Phase 4 以降の FAQ 化

`builder_questions` テーブルの `answered_at IS NOT NULL` の回答を、
工務店詳細ページの FAQ セクションとして公開（類似質問の重複を減らす）。

### 4.4 月次レポート自動集計（Phase 4 の SaaS 機能）

#### 4.4.1 ユースケース

工務店がダッシュボードを開く → 「月次レポート」を選ぶ → 該当月の KPI が表示される。
PDF ダウンロード / メール配信も可能。

#### 4.4.2 入力

- 対象月（例: `2026-09`）
- 工務店ID（platform 全体レポートなら省略）

#### 4.4.3 出力項目（JSON）

```jsonc
{
  "report_month": "2026-09",
  "report_type": "builder",
  "builder_id": "...",
  "metrics": {
    "visitors": { "total": 1200, "unique": 800, "prev_month_ratio": 1.25 },
    "events": { "total": 3200, "by_source": { "youtube": 1200 } },
    "leads": { "total": 15, "by_type": { "event_booking": 8, "inquiry": 7 } },
    "chat": { "sessions": 42, "completed": 35, "conversion_to_lead": 6 },
    "favorites": 28,
    "top_videos": [...]
  }
}
```

#### 4.4.4 集計クエリ対象

| テーブル | 集計内容 |
| --- | --- |
| `user_events` | 総イベント数 / ユニーク訪問 / デバイス別 / ソース別 / コンテンツ別 |
| `chat_sessions` | セッション数 / 完了率 / リード転換数 |
| `leads` | 総数 / タイプ別 / ステータス別 |
| `favorites` | 月次登録数 |
| 前月 `monthly_reports` | 前月比の算出 |

#### 4.4.5 実装予定 API

| メソッド | パス | 用途 |
| --- | --- | --- |
| POST | `/api/reports/monthly/generate` | 指定月を集計して `monthly_reports` に UPSERT |
| GET | `/api/reports/monthly?month=2026-09` | プラットフォーム全体レポート |
| GET | `/api/reports/monthly/builder?month=2026-09&builder_id=xxx` | 工務店別レポート |

#### 4.4.6 UI

`/admin/reports`（Phase 4 で middleware から解放、管理者向け）
工務店ダッシュボード側は SaaS プラン加入工務店のみ表示。

## 5. 非機能要件（全 AI 機能共通）

| 項目 | 要求 |
| --- | --- |
| 可用性 | 99.5% 以上（Phase 1）、99.9% 以上（Phase 4） |
| 応答時間 (p95) | 診断 2秒、チャット初回トークン 1.5 秒 |
| 月次コスト | Phase 1 は OpenAI API で $100/月 以下 |
| プライバシー | PII はログに出さない。匿名ID は Cookie、30日でローテーション |
| スケーラビリティ | 月間 10万 リクエスト想定（Phase 3 で必要） |
| セキュリティ | Rate limit: IP あたり診断 5 回/分、チャット 20 リクエスト/分 |
| モニタリング | Sentry でエラー補足、Vercel Analytics で応答時間計測 |
| バックアップ | Supabase の自動バックアップ（毎日）+ Phase 2 から週次エクスポート |

## 6. 制約事項

| # | 制約 |
| --- | --- |
| C-1 | MVP では診断推薦はルールベース。LLM 呼び出しはコスト抑制のため Phase 2 以降 |
| C-2 | 工務店データは `src/lib/builders-data.ts` のハードコード（10社）。Phase 5 で DB 移行 |
| C-3 | OpenAI API Key は `.env` の `OPENAI_API_KEY` のみを使用。クライアント側に漏らさない |
| C-4 | Claude / Gemini への切替可能性を残すため、LLM 呼び出しはラッパー経由にする（Phase 2 で抽象化層追加） |
| C-5 | 診断結果の個人情報は Phase 1 時点では工務店に非共有。予約発生時のみ氏名を渡す |

## 7. 外部依存

| サービス | 用途 | Phase |
| --- | --- | --- |
| OpenAI GPT-4o | 住宅相談チャット | Phase 1〜 |
| OpenAI GPT-4o-mini | Phase 2 で診断推薦の判定に使用検討 | Phase 2〜 |
| OpenAI Embeddings (text-embedding-3-small) | Phase 4 の RAG（工務店FAQ 類似検索） | Phase 4〜 |
| Supabase | 全 AI 機能のデータ永続化 | Phase 1〜 |
| Sentry | エラートラッキング | Phase 1〜 |
| Cloudflare Turnstile | bot 対策（診断とチャットの濫用防止） | Phase 1〜 |

## 8. KPI と計測

### Phase 1 目標

| 指標 | 目標 |
| --- | --- |
| 診断開始数 | 月 200 件 |
| 診断完走率 | 40% 以上 |
| 診断 → 工務店詳細遷移率 | 50% 以上 |
| 診断 → 見学会予約転換率 | 2% 以上 |
| チャット1セッションあたり平均メッセージ数 | 4 以上 |
| チャット → 無料相談/予約転換率 | 5% 以上 |

### Phase 4 目標（SaaS 開始時）

| 指標 | 目標 |
| --- | --- |
| AI質問 月間投稿数 | 200 件 |
| AI質問 回答率 | 80% 以上 |
| 月次レポート開封率 | 60% 以上 |
| SaaS ライト契約 | 10 社 |

## 9. リリース計画

| 日付 | マイルストーン |
| --- | --- |
| 2026-05-01 | Phase 1 リリース（診断 + チャット） |
| 2026-07-01 | Phase 2 開始（LLM 版診断レコメンドを段階的に有効化） |
| 2026-09-01 | Phase 3 開始（月額掲載プランの対象として診断導線を強化） |
| 2026-12-01 | Phase 4 開始（匿名AI仲介質問 + 月次レポート + SaaS 販売） |
| 2027-03-01 | Phase 5 開始（全国展開・LLM Provider 切替検討） |

## 10. 開発チェックリスト（リリース前）

- [ ] `OPENAI_API_KEY` が本番 .env に設定されている
- [ ] `/diagnosis` の 10 問全て表示される（desktop / mobile）
- [ ] 診断完了後に `diagnosis_sessions` にレコードが insert される
- [ ] ログイン済みなら `user_profiles` が upsert される
- [ ] `chat_sessions` に初回メッセージ時のレコードが作成される
- [ ] ストリーミング応答が 60 秒以内に完了する
- [ ] Supabase 未接続時もローカルフォールバックで 200 が返る
- [ ] GA4 に diagnosis_start / diagnosis_complete イベントが送信される
- [ ] Turnstile が 診断・チャット送信前に検証を要求する
- [ ] Sentry に AI API のエラーが補足される
