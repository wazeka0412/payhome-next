-- サンプルデータ投入

-- 工務店データ
INSERT INTO builders (name, email, phone, area, address, specialties, description, website, plan) VALUES
('万代ホーム', 'info@mandai.com', '099-222-3333', '鹿児島市', '鹿児島県鹿児島市中央町1-1', ARRAY['平屋', '注文住宅'], '鹿児島で50年の実績', 'https://mandai-home.com', 'グロース'),
('ハウスサポート', 'info@hs.com', '099-333-4444', '鹿児島市', '鹿児島県鹿児島市城南町2-5', ARRAY['平屋', 'ローコスト'], '手の届く価格で理想の家', 'https://house-support.com', 'フリー'),
('タマルハウス', 'info@tamaru.com', '099-444-5555', '姶良市', '鹿児島県姶良市加治木町3-10', ARRAY['注文住宅', '平屋'], 'デザインと機能性の両立', 'https://tamaru-house.com', 'プレミアム'),
('ヤマサハウス', 'info@yamasa.com', '099-555-6666', '姶良市', '鹿児島県姶良市東餅田2-20', ARRAY['平屋', '高性能住宅'], '南九州No.1の住宅メーカー', 'https://yamasahouse.co.jp', 'グロース'),
('ベルハウジング', 'info@bell.com', '099-666-7777', '鹿児島市', '鹿児島県鹿児島市与次郎1-5', ARRAY['平屋', 'デザイン住宅'], 'デザインにこだわる家づくり', 'https://bell-housing.com', 'フリー'),
('七呂建設', 'info@shichiro.com', '099-777-8888', '日置市', '鹿児島県日置市伊集院町1-1', ARRAY['注文住宅', '自然素材'], '地元密着の工務店', 'https://shichiro.com', 'フリー'),
('スマイルホーム', 'info@smile.com', '099-888-9999', '鹿屋市', '鹿児島県鹿屋市寿5-1', ARRAY['平屋', 'ローコスト'], '笑顔になる家づくり', 'https://smile-home.com', 'フリー'),
('ロイヤルホーム', 'info@royal.com', '099-999-0000', '指宿市', '鹿児島県指宿市湊1-1', ARRAY['注文住宅', '平屋'], '品質にこだわる家づくり', 'https://royal-home.com', 'フリー'),
('アイフルホーム鹿児島', 'info@eyeful-kagoshima.com', '099-111-2222', '鹿児島市', '鹿児島県鹿児島市田上3-1', ARRAY['注文住宅', '平屋'], 'ずっと愛される家', 'https://eyeful-kagoshima.com', 'フリー'),
('センチュリーハウス', 'info@century.com', '099-222-4444', '霧島市', '鹿児島県霧島市国分中央1-1', ARRAY['注文住宅', '二世帯'], '100年住める家', 'https://century-house.com', 'フリー'),
('マルタ建設', 'info@maruta.com', '099-333-5555', '姶良市', '鹿児島県姶良市加治木町2-5', ARRAY['平屋', '自然素材'], '無垢材にこだわる', 'https://maruta-kensetsu.com', 'フリー'),
('丸和建設', 'info@maruwa.com', '099-444-6666', '鹿児島市', '鹿児島県鹿児島市宇宿2-1', ARRAY['注文住宅', '平屋'], '信頼と実績の家づくり', 'https://maruwa-kensetsu.com', 'フリー');

-- リードデータ
INSERT INTO leads (type, name, email, phone, area, budget, layout, builder_name, status, score) VALUES
('無料相談', '田中 太郎', 'tanaka@example.com', '090-1234-5678', '鹿児島市', '2,500万円', '3LDK', '万代ホーム', '新規', 85),
('資料請求', '佐藤 花子', 'sato@example.com', '080-9876-5432', '福岡市', '3,000万円', '4LDK', NULL, '対応中', 60),
('見学会予約', '鈴木 一郎', 'suzuki@example.com', NULL, '鹿児島市', NULL, NULL, 'ハウスサポート', '紹介済', 70),
('無料相談', '高橋 美咲', 'takahashi@example.com', '070-1111-2222', '熊本市', '2,000万円', '2LDK', 'タマルハウス', '成約', 95),
('工務店相談', '渡辺 健', 'watanabe@example.com', NULL, '鹿児島市', NULL, NULL, '万代ホーム', '新規', 50),
('資料請求', '伊藤 裕子', 'ito@example.com', NULL, '宮崎市', '2,800万円', NULL, 'ヤマサハウス', '新規', 45),
('無料相談', '山田 美咲', 'yamada@example.com', '090-4567-8901', '鹿児島市', '3,500万円', '4LDK', '万代ホーム', '面談済', 90),
('資料請求', '中村 大輔', 'nakamura2@example.com', '090-5678-9012', '薩摩川内市', '2,200万円', '3LDK', 'ヤマサハウス', '成約', 80),
('無料相談', '小林 裕子', 'kobayashi@example.com', '090-6789-0123', '鹿屋市', '2,700万円', '3LDK', 'ベルハウジング', '新規', 65),
('見学会予約', '加藤 翔', 'kato@example.com', '090-7890-1234', '日置市', '3,200万円', NULL, '万代ホーム', '対応中', 50);

-- イベントデータ
INSERT INTO events (builder_name, title, date, location, type, capacity, reservations) VALUES
('万代ホーム', '平屋3LDK完成見学会', '2026-04-12', '鹿児島市○○町', '完成見学会', 20, 8),
('ハウスサポート', '99万回再生の小さなかわいい平屋', '2026-04-19', '鹿児島市', 'ぺいほーむ特別見学会', 15, 12),
('タマルハウス', '最新平屋モデルハウス見学', '2026-04-26', '福岡市東区', 'モデルハウス', 30, 5),
('ヤマサハウス', 'ZEH平屋完成見学会', '2026-05-10', '姶良市加治木町', '完成見学会', 20, 3);
