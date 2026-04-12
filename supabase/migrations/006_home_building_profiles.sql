-- ============================================================
-- お家づくりカルテ基盤
-- 作成日: 2026-04-12
-- 目的: ヒアリングシートのデータを段階的に蓄積し、
--       AI診断精度向上・商談前要約・成果報酬判定補強に活用
-- ============================================================

CREATE TABLE IF NOT EXISTS home_building_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,

  -- STEP 0: 基本情報
  consideration_start TEXT,          -- 検討開始時期
  move_in_timeline TEXT,             -- 入居希望時期
  move_in_urgency TEXT,              -- 厳守/できるだけ早く/多少ズレOK/余裕あり
  family_summary TEXT,               -- 家族構成概要
  building_purpose TEXT[],           -- 検討きっかけ（複数選択）

  -- STEP 1: AI診断連携（diagnosis_sessionsから参照）
  diagnosis_session_id UUID,

  -- STEP 2: 土地・エリア
  has_land BOOLEAN,                  -- 計画地あり/なし
  land_search_status TEXT,           -- これから探す/情報収集中/不動産依頼中/検討中
  preferred_areas TEXT[],            -- 検討エリア（最大3）
  area_priorities TEXT[],            -- エリア重視項目
  commute_main TEXT,                 -- 通勤先（世帯主）
  commute_partner TEXT,              -- 通勤先（配偶者）
  site_area_tsubo NUMERIC,           -- 希望敷地面積（坪）
  road_direction TEXT,               -- 接道方向

  -- STEP 2: 予算・ローン
  total_budget INTEGER,              -- 総予算（万円）
  building_budget INTEGER,           -- 建物予算（万円）
  land_budget INTEGER,               -- 土地予算（万円）
  own_funds INTEGER,                 -- 自己資金（万円）
  monthly_payment INTEGER,           -- 希望月返済（万円）
  bonus_payment INTEGER,             -- ボーナス返済（万円）
  loan_years INTEGER,                -- 希望返済年数
  annual_income INTEGER,             -- 年収（万円）
  has_other_loans BOOLEAN,           -- 他ローンあり
  other_loan_detail TEXT,            -- 他ローン詳細

  -- STEP 2: 間取り・広さ
  floor_area_tsubo NUMERIC,          -- 希望延床（坪）
  stories INTEGER DEFAULT 1,         -- 階数（平屋=1）
  ldk_count INTEGER,                 -- LDK数
  parking_spaces INTEGER,            -- 駐車スペース
  cars_owned INTEGER,                -- 所有車台数

  -- STEP 3: デザイン・性能
  exterior_style TEXT,               -- 外観タイプ
  style_detail TEXT,                 -- デザイン詳細メモ
  construction_method TEXT,          -- 工法
  performance_priorities TEXT[],     -- 性能重視項目
  special_requirements TEXT[],       -- 特殊要件
  layout_preferences TEXT,           -- 間取り配置の希望

  -- STEP 4: 動画リアクション
  liked_videos TEXT[],               -- 好きな動画ID
  liked_points TEXT[],               -- 気に入ったポイント
  disliked_points TEXT[],            -- 違和感のあったポイント
  lifestyle_match TEXT,              -- 自分に合うと感じた要素

  -- STEP 5: 比較・営業相性
  comparing_companies JSONB DEFAULT '[]', -- [{name, source, status, rating, notes}]
  sales_priorities TEXT[],           -- 営業対応重視項目
  design_priorities TEXT[],          -- 設計対応重視項目
  ng_behaviors TEXT[],               -- NG営業行動
  sales_style_memo TEXT,             -- 営業相性メモ

  -- STEP 6: 見学前整理
  current_temperature TEXT,          -- 検討温度感
  visit_check_points TEXT[],         -- 見学で確認したいこと
  biggest_concern TEXT,              -- 一番の不安
  want_support BOOLEAN DEFAULT TRUE, -- 継続サポート希望

  -- メタ
  completion_rate INTEGER DEFAULT 0, -- 入力率(%)
  last_updated_step INTEGER DEFAULT 0, -- 最後に更新したSTEP
  staff_memo TEXT,                   -- ぺいほーむ担当者メモ

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_hbp_user ON home_building_profiles(user_id);

ALTER TABLE home_building_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hbp_service_all" ON home_building_profiles FOR ALL USING (true);
