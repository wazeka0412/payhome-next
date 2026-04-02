-- ============================================================
-- Phase 1: 月次レポート集計基盤
-- 作成日: 2026-04-02
-- 目的: データ収集基盤で蓄積したデータを月次で集計し、
--       工務店向け情報提供・Phase 2 AI学習データとして活用する
-- ============================================================

-- ----------------------------------------
-- 1. monthly_reports テーブル（月次集計レポート）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS monthly_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- レポート期間・種別
  report_month DATE NOT NULL,                    -- '2026-04-01' (月の1日で正規化)
  report_type TEXT NOT NULL CHECK (report_type IN ('platform', 'builder')),

  -- 工務店別レポートの場合のみ
  builder_id UUID,

  -- 集計データ (JSONB で柔軟に格納)
  metrics JSONB NOT NULL DEFAULT '{}',

  -- メタデータ
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 同一月・同一種別・同一工務店は1レコード (UPSERT用)
  UNIQUE(report_month, report_type, builder_id)
);

-- パフォーマンス用インデックス
CREATE INDEX IF NOT EXISTS idx_monthly_reports_month
  ON monthly_reports(report_month DESC);
CREATE INDEX IF NOT EXISTS idx_monthly_reports_type
  ON monthly_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_monthly_reports_builder
  ON monthly_reports(builder_id)
  WHERE builder_id IS NOT NULL;

-- RLS
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;

-- 管理者のみ全操作可
CREATE POLICY "monthly_reports_admin_all" ON monthly_reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- サービスロールキーからのINSERT/UPDATE許可 (API Route用)
CREATE POLICY "monthly_reports_service_insert" ON monthly_reports
  FOR INSERT WITH CHECK (true);
CREATE POLICY "monthly_reports_service_update" ON monthly_reports
  FOR UPDATE USING (true);
CREATE POLICY "monthly_reports_service_select" ON monthly_reports
  FOR SELECT USING (true);
