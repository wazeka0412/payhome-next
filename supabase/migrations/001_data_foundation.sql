-- ============================================================
-- Phase 1: データ基盤構築マイグレーション
-- 作成日: 2026-03-22
-- 目的: AI住宅コンシェルジュに向けたデータ蓄積基盤の構築
-- ============================================================

-- ----------------------------------------
-- 1. user_events テーブル（行動イベントログ）
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS user_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  anonymous_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  event_type TEXT NOT NULL,
  content_type TEXT,
  content_id TEXT,
  page_path TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  device_type TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_events_anonymous_id ON user_events(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_event_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON user_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_events_content ON user_events(content_type, content_id);

ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_events_insert_all" ON user_events FOR INSERT WITH CHECK (true);
CREATE POLICY "user_events_select_own" ON user_events FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- ----------------------------------------
-- 2. chat_sessions テーブル
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  anonymous_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  title TEXT,
  message_count INTEGER DEFAULT 0,
  source_page TEXT,
  category TEXT,
  inferred_intent TEXT,
  extracted_tags TEXT[] DEFAULT '{}',
  conversation_summary TEXT,
  recommended_action TEXT,
  lead_conversion BOOLEAN DEFAULT false,
  lead_id UUID REFERENCES leads(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_anonymous_id ON chat_sessions(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat_sessions_insert_all" ON chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "chat_sessions_select_own" ON chat_sessions FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);
CREATE POLICY "chat_sessions_update_own" ON chat_sessions FOR UPDATE USING (
  anonymous_id IS NOT NULL OR user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- ----------------------------------------
-- 3. chat_messages テーブル
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat_messages_insert_all" ON chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "chat_messages_select_via_session" ON chat_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chat_sessions cs
    WHERE cs.id = chat_messages.session_id
    AND (cs.user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'))
  )
);

-- ----------------------------------------
-- 4. leads テーブル拡張
-- ----------------------------------------
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_channel TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_content_id TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS recent_views JSONB DEFAULT '[]';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS anonymous_id TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS chat_session_id UUID REFERENCES chat_sessions(id);

-- ----------------------------------------
-- 5. favorites テーブル拡張
-- ----------------------------------------
ALTER TABLE favorites ADD COLUMN IF NOT EXISTS anonymous_id TEXT;
ALTER TABLE favorites ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'property';
-- property_id を content_id にリネーム（互換性維持）
ALTER TABLE favorites RENAME COLUMN property_id TO content_id;
-- ユニーク制約の再設定
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_user_id_property_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_unique ON favorites(
  COALESCE(user_id::text, ''), COALESCE(anonymous_id, ''), content_type, content_id
);

-- RLSポリシー更新（anonymous_idでもアクセス可能に）
DROP POLICY IF EXISTS "favorites_own" ON favorites;
CREATE POLICY "favorites_own" ON favorites FOR ALL USING (
  user_id = auth.uid() OR anonymous_id IS NOT NULL
);

-- ----------------------------------------
-- 6. builders テーブル構造化カラム追加
-- ----------------------------------------
ALTER TABLE builders ADD COLUMN IF NOT EXISTS price_range TEXT;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS hiraya_ratio INTEGER;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS hiraya_annual INTEGER;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS design_taste TEXT[] DEFAULT '{}';
ALTER TABLE builders ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}';
ALTER TABLE builders ADD COLUMN IF NOT EXISTS suitable_for TEXT[] DEFAULT '{}';
ALTER TABLE builders ADD COLUMN IF NOT EXISTS insulation_grade TEXT;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS earthquake_grade TEXT;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS construction_method TEXT;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS land_proposal BOOLEAN DEFAULT false;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS common_concerns TEXT[] DEFAULT '{}';
ALTER TABLE builders ADD COLUMN IF NOT EXISTS strengths TEXT[] DEFAULT '{}';
ALTER TABLE builders ADD COLUMN IF NOT EXISTS comparison_points TEXT[] DEFAULT '{}';
