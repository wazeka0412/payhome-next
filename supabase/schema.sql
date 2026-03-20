-- ぺいほーむ データベーススキーマ

-- 工務店テーブル（先に作成）
CREATE TABLE IF NOT EXISTS builders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  area TEXT,
  address TEXT,
  specialties TEXT[] DEFAULT '{}',
  description TEXT,
  website TEXT,
  logo_url TEXT,
  plan TEXT DEFAULT 'フリー' CHECK (plan IN ('フリー', 'グロース', 'プレミアム')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'builder', 'user')),
  builder_id UUID REFERENCES builders(id),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- リード（問い合わせ）テーブル
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('無料相談', '資料請求', '見学会予約', '工務店相談', 'B2Bお問い合わせ', 'パートナー申込', 'セミナー申込')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  area TEXT,
  budget TEXT,
  layout TEXT,
  message TEXT,
  video TEXT,
  builder_id UUID REFERENCES builders(id),
  builder_name TEXT,
  selected_companies TEXT[] DEFAULT '{}',
  selected_services TEXT[] DEFAULT '{}',
  status TEXT DEFAULT '新規' CHECK (status IN ('新規', '対応中', '紹介済', '面談済', '成約', '失注')),
  score INTEGER DEFAULT 50,
  memo TEXT,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 見学会・イベントテーブル
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  builder_id UUID REFERENCES builders(id),
  builder_name TEXT NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  type TEXT CHECK (type IN ('完成見学会', 'モデルハウス', 'ぺいほーむ特別見学会', 'オンライン見学会')),
  capacity INTEGER DEFAULT 20,
  reservations INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- お気に入りテーブル
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- チャット履歴テーブル
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLSポリシー
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE builders ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- RLSポリシー定義
-- builders: 誰でも読み取り可能
CREATE POLICY "builders_select" ON builders FOR SELECT USING (true);
CREATE POLICY "builders_admin_all" ON builders FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- leads: 管理者は全件、工務店は自社分のみ
CREATE POLICY "leads_admin_all" ON leads FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);
CREATE POLICY "leads_builder_select" ON leads FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'builder' AND users.builder_id = leads.builder_id)
);

-- events: 誰でも読み取り、管理者と工務店は編集可能
CREATE POLICY "events_select" ON events FOR SELECT USING (true);
CREATE POLICY "events_admin_all" ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- favorites: 自分のお気に入りのみ
CREATE POLICY "favorites_own" ON favorites FOR ALL USING (user_id = auth.uid());

-- chat_history: 自分の履歴のみ
CREATE POLICY "chat_own" ON chat_history FOR ALL USING (user_id = auth.uid());

-- インデックス
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_builder_name ON leads(builder_name);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_builder_id ON events(builder_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON chat_history(session_id);

-- updated_at自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_builders_updated_at BEFORE UPDATE ON builders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
