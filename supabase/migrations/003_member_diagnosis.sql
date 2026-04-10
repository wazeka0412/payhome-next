-- ============================================================
-- Phase 1: 会員登録 × AI家づくり診断基盤
-- 作成日: 2026-04-02
-- 目的: F-24 会員登録フロー + F-25 AI家づくり診断のための
--       user_profiles + diagnosis_sessions テーブルを追加
-- ============================================================

-- ----------------------------------------
-- 1. user_profiles テーブル（会員プロフィール + 診断結果）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,

  -- デモグラ
  full_name TEXT,
  family_structure TEXT,         -- 'single' / 'couple' / 'family_kids' / 'family_seniors'
  age_range TEXT,                -- '20s' / '30s' / '40s' / '50s' / '60s+'

  -- 家づくりの希望
  budget_range TEXT,             -- '~2000' / '2000-2500' / '2500-3000' / '3000-4000' / '4000+'
  preferred_area TEXT,           -- 鹿児島市 / 姶良市 / 霧島市 etc
  has_land BOOLEAN,              -- 土地の有無
  planned_timing TEXT,           -- 'immediately' / '3-6months' / '6-12months' / '1year+' / 'researching'

  -- 志向性
  design_orientation TEXT[],     -- ['modern', 'natural', 'japanese', 'scandinavian', 'industrial']
  performance_orientation TEXT[],-- ['insulation', 'earthquake', 'zeh', 'airtight']
  lifestyle_priorities TEXT[],   -- ['family_friendly', 'senior_friendly', 'pet_friendly', 'home_office', 'open_kitchen']

  -- 推定された検討フェーズ（診断結果）
  consideration_phase TEXT,      -- 'awareness' / 'interest' / 'comparison' / 'decision'
  user_type TEXT,                -- AI診断結果のタイプラベル
  temperature INTEGER,           -- 0-100 の温度感

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON user_profiles(user_type);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_profiles_select_own" ON user_profiles FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);
CREATE POLICY "user_profiles_insert_own" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "user_profiles_update_own" ON user_profiles FOR UPDATE USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- ----------------------------------------
-- 2. diagnosis_sessions テーブル（診断履歴）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS diagnosis_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  anonymous_id TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- 診断の入力
  answers JSONB NOT NULL DEFAULT '{}',

  -- 診断の結果
  user_type TEXT,                -- 'cost_focused' / 'design_focused' / 'performance_focused' / etc
  recommended_builders JSONB DEFAULT '[]',  -- [{ builder_id, score, reason }]
  recommended_properties JSONB DEFAULT '[]',-- [{ property_id, score, reason }]

  -- メタ
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diagnosis_sessions_anonymous_id ON diagnosis_sessions(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_sessions_user_id ON diagnosis_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_sessions_created_at ON diagnosis_sessions(created_at DESC);

ALTER TABLE diagnosis_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "diagnosis_sessions_insert_all" ON diagnosis_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "diagnosis_sessions_select_own" ON diagnosis_sessions FOR SELECT USING (
  user_id = auth.uid() OR anonymous_id IS NOT NULL OR
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- ----------------------------------------
-- 3. users テーブル拡張: last_login_at
-- ----------------------------------------
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
