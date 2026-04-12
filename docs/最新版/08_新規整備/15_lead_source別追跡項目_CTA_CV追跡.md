# lead_source 別追跡項目 + CTA 別 CV 追跡 シート

最終更新: 2026-04-12
対象: PM + 開発 + マーケ
目的: Phase 3 以降の成果報酬 3% 対象判定 + CTA 効果測定

---

## 1. lead_source の定義 (4 種類)

| 値 | 経路 | 成果報酬 | 主要な発生画面 |
| --- | --- | --- | --- |
| `consultation` | 無料相談フォーム (`/consultation`) 送信 | ✅ 対象 (Phase 3〜) | /consultation |
| `diagnosis` | AI 家づくり診断 (`/diagnosis`) 完走後のアクション | ✅ 対象 (Phase 3〜) | /diagnosis の結果画面からの CTA |
| `member` | 会員登録済みユーザー (`/signup` 完了済み) のアクション | ✅ 対象 (Phase 3〜) | 任意のページ (条件判定で付与) |
| `direct` | 非会員の直接問合せ | ❌ 対象外 | 任意のページ (デフォルト値) |

---

## 2. DB スキーマ追加案 (Supabase マイグレーション)

### leads テーブルへのカラム追加

```sql
-- migration: 005_add_lead_source_tracking.sql

ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_source TEXT
  CHECK (lead_source IN ('consultation', 'diagnosis', 'member', 'direct'))
  DEFAULT 'direct';

ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_source_detail TEXT;
-- 例: 'diagnosis_result_builder_A', 'consultation_form_top', 'member_profile_page'

ALTER TABLE leads ADD COLUMN IF NOT EXISTS cta_id TEXT;
-- 例: 'top_hero_diagnosis', 'event_thanks_signup', 'welcome_builder_1_reserve'

ALTER TABLE leads ADD COLUMN IF NOT EXISTS referrer_page TEXT;
-- 例: '/diagnosis', '/welcome', '/event/123/thanks'

ALTER TABLE leads ADD COLUMN IF NOT EXISTS contract_signed_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contract_amount NUMERIC;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS success_fee_amount NUMERIC;

-- インデックス
CREATE INDEX IF NOT EXISTS idx_leads_lead_source ON leads(lead_source);
CREATE INDEX IF NOT EXISTS idx_leads_cta_id ON leads(cta_id);
CREATE INDEX IF NOT EXISTS idx_leads_contract_signed ON leads(contract_signed_at);
```

---

## 3. lead_source の自動判定ロジック

### リード作成時の優先順位

複数の条件に該当する場合、以下の優先順位で lead_source を決定する:

```
1. consultation  — /consultation フォーム経由 (最優先)
2. diagnosis     — diagnosis_session_id がセットされている場合
3. member        — session.user_id が存在する場合
4. direct        — 上記以外 (デフォルト)
```

### 実装例 (API Route)

```typescript
// src/app/api/leads/route.ts (Phase 3 時に追加)
function determineLeadSource(
  body: { form?: string; diagnosis_session_id?: string },
  userId?: string
): LeadSource {
  if (body.form === 'consultation') return 'consultation';
  if (body.diagnosis_session_id) return 'diagnosis';
  if (userId) return 'member';
  return 'direct';
}
```

---

## 4. CTA 別 CV 追跡の設計

### 4-1. CTA ID 命名規則

`{page}_{section}_{action}` の形式:

- `top_hero_diagnosis` — TOP ヒーローの AI診断ボタン
- `top_campaign_signup` — TOP CampaignSection の会員登録ボタン
- `top_fixedbar_consultation` — TOP FixedBar の無料相談ボタン
- `casestudies_gate_signup` — 事例ライブラリ 6件目ゲートの会員登録
- `casestudies_detail_builder` — 事例詳細の工務店ページボタン
- `builders_detail_event` — 工務店詳細の見学会予約
- `builders_detail_consultation` — 工務店詳細の無料相談
- `diagnosis_result_builder_{n}_event` — 診断結果 N 番目工務店の見学会予約
- `welcome_builder_{n}_event` — welcome ページ N 番目工務店の見学会予約
- `welcome_consultation_sub` — welcome の副導線無料相談
- `event_thanks_signup` — 見学会完了画面の会員登録
- `fixedbar_consultation` — 固定バー無料相談
- `fixedbar_diagnosis` — 固定バー AI診断
- `fixedbar_event` — 固定バー見学会
- `fixedbar_line` — 固定バー LINE

### 4-2. フロントエンド実装 (Link に data 属性)

```tsx
<Link
  href="/diagnosis"
  data-cta-id="top_hero_diagnosis"
  onClick={() => trackCTA('top_hero_diagnosis')}
>
  AI診断をはじめる →
</Link>
```

### 4-3. GA4 イベント

```javascript
// trackCTA 関数の実装
export function trackCTA(ctaId: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      cta_id: ctaId,
      page_path: window.location.pathname,
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

## 5. 追跡シート (CTA 別 CV)

### テンプレート構造

| cta_id | 画面 | 月間クリック数 | 会員登録 CV | 見学会予約 CV | 無料相談 CV | AI診断 CV | CVR (主要CV) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| top_hero_diagnosis | TOP | 500 | - | - | - | 150 | 30% |
| top_campaign_signup | TOP | 300 | 45 | - | - | - | 15% |
| top_fixedbar_consultation | 全体 | 200 | - | - | 10 | - | 5% |
| casestudies_gate_signup | 事例 | 400 | 80 | - | - | - | 20% |
| welcome_builder_1_event | /welcome | 100 | - | 30 | - | - | 30% |
| welcome_consultation_sub | /welcome | 80 | - | - | 8 | - | 10% |
| event_thanks_signup | /event/*/thanks | 150 | 60 | - | - | - | 40% |

※ 主要 CV は画面の主目的に合わせる (TOP Hero なら診断、見学会完了なら会員登録など)

---

## 6. GA4 カスタムディメンション

Google Analytics 4 で以下のカスタムディメンションを設定:

| 名前 | パラメータ名 | スコープ |
| --- | --- | --- |
| CTA ID | `cta_id` | イベント |
| lead_source | `lead_source` | ユーザー |
| user_type | `user_type` (AI診断結果) | ユーザー |
| referrer_page | `referrer_page` | イベント |
| builder_id | `builder_id` | イベント |

---

## 7. Supabase クエリ (分析用)

### 7-1. lead_source 別の発生数 (月次)

```sql
SELECT
  lead_source,
  COUNT(*) AS lead_count,
  DATE_TRUNC('month', created_at) AS month
FROM leads
WHERE created_at >= '2026-05-01'
GROUP BY lead_source, month
ORDER BY month, lead_source;
```

### 7-2. CTA 別の CV 数 (Phase 3 以降、cta_id 実装後)

```sql
SELECT
  cta_id,
  COUNT(*) AS cv_count,
  lead_source,
  DATE_TRUNC('month', created_at) AS month
FROM leads
WHERE cta_id IS NOT NULL
  AND created_at >= '2026-09-01'
GROUP BY cta_id, lead_source, month
ORDER BY month DESC, cv_count DESC;
```

### 7-3. 成約までの転換ファネル (Phase 3 以降)

```sql
WITH funnel AS (
  SELECT
    lead_source,
    COUNT(*) FILTER (WHERE status = 'new') AS new_leads,
    COUNT(*) FILTER (WHERE status = 'contacted') AS contacted,
    COUNT(*) FILTER (WHERE status = 'event_booked') AS event_booked,
    COUNT(*) FILTER (WHERE status = 'event_attended') AS event_attended,
    COUNT(*) FILTER (WHERE status = 'closed_won') AS closed_won,
    SUM(contract_amount) FILTER (WHERE status = 'closed_won') AS total_contract,
    SUM(success_fee_amount) FILTER (WHERE status = 'closed_won') AS total_success_fee
  FROM leads
  WHERE created_at >= '2026-09-01'
  GROUP BY lead_source
)
SELECT * FROM funnel;
```

### 7-4. 工務店別の成約率

```sql
SELECT
  b.name AS builder_name,
  COUNT(l.id) FILTER (WHERE l.status = 'event_booked') AS event_bookings,
  COUNT(l.id) FILTER (WHERE l.status = 'closed_won') AS closings,
  ROUND(100.0 * COUNT(l.id) FILTER (WHERE l.status = 'closed_won')
        / NULLIF(COUNT(l.id) FILTER (WHERE l.status = 'event_booked'), 0), 1) AS close_rate,
  SUM(l.success_fee_amount) FILTER (WHERE l.status = 'closed_won') AS total_success_fee
FROM leads l
LEFT JOIN builders b ON l.builder_id = b.id
WHERE l.created_at >= '2026-09-01'
GROUP BY b.id, b.name
ORDER BY total_success_fee DESC;
```

---

## 8. 週次レビュー項目 (PM)

毎週月曜 10:00 の朝会で以下を確認:

1. 先週の lead_source 別リード数
2. 対象リード (consultation/diagnosis/member) の比率
3. direct リードの割合と原因分析
4. CTA 別のクリック数トップ 5
5. CV 率が低下している CTA とその原因

---

## 9. 月次レビュー項目 (代表 + PM)

毎月末に以下を確認:

1. lead_source 別の成約転換率
2. 工務店別の成約数・成約額
3. 成果報酬の対象 / 対象外の比率
4. CTA 別の CV 効率 (クリックあたりの主要 CV)
5. A/B テスト候補の洗い出し (低 CVR の CTA)

---

## 10. 優先実装タスク (Phase 3 準備)

- [ ] マイグレーション `005_add_lead_source_tracking.sql` を適用
- [ ] `/api/leads` で lead_source の自動判定ロジック実装
- [ ] 全主要 CTA に `data-cta-id` 属性追加
- [ ] `trackCTA()` 関数を utils に追加
- [ ] GA4 カスタムディメンション 5 種類を設定
- [ ] 工務店ダッシュボードに成約報告フォーム追加
- [ ] 分析用 SQL クエリセット作成 (`scripts/analytics-queries.sql`)

---

## 11. 関連ドキュメント

- `01_エンジニア共有用/AI要件定義書.md` (lead_source tracking 要件)
- `01_エンジニア共有用/AI設計書.md` (DB スキーマ)
- `08_新規整備/10_成果報酬3%契約別紙.md`
- `08_新規整備/13_成約証憑受領管理シート_テンプレート.md`
- `08_新規整備/14_工務店月次レポートテンプレート.md`
