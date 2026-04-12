-- ============================================================
-- Phase 1: 顧客アンケート・成約報告基盤
-- 作成日: 2026-04-12
-- 目的: 見学会予約後/見学後/成約時の顧客接点を管理し、
--       成果報酬50万円の対象判定を補強する
-- ============================================================

CREATE TABLE IF NOT EXISTS surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- ユーザー情報
  user_id UUID,                                    -- 会員の場合
  anonymous_id TEXT,                               -- 匿名ユーザーの場合
  email TEXT,                                      -- 連絡先

  -- アンケート種別
  survey_type TEXT NOT NULL CHECK (survey_type IN (
    'post_booking',    -- 見学会予約後
    'post_visit',      -- 見学会後
    'conversion_report' -- 成約報告
  )),

  -- 関連情報
  event_id TEXT,                                   -- 見学会ID
  builder_id TEXT,                                 -- 工務店ID
  builder_name TEXT,                               -- 工務店名
  booking_date DATE,                               -- 予約日/見学日

  -- アンケート回答 (JSONB で柔軟に格納)
  responses JSONB NOT NULL DEFAULT '{}',

  -- 成約報告固有
  conversion_date DATE,                            -- 成約日
  conversion_company TEXT,                         -- 成約先会社名
  evidence_submitted BOOLEAN DEFAULT FALSE,        -- 証憑提出済み
  gift_requested BOOLEAN DEFAULT FALSE,            -- プレゼント希望
  gift_sent BOOLEAN DEFAULT FALSE,                 -- プレゼント送付済み

  -- メタデータ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_surveys_type ON surveys(survey_type);
CREATE INDEX IF NOT EXISTS idx_surveys_user ON surveys(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_surveys_event ON surveys(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_surveys_builder ON surveys(builder_id) WHERE builder_id IS NOT NULL;

-- RLS
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "surveys_service_all" ON surveys
  FOR ALL USING (true);
