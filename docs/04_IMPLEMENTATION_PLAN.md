# 追加実装項目一覧

**作成日:** 2026-03-22

---

## 1. 今すぐ必要（Phase 1）

| # | 実装項目 | 優先度 | 工数目安 | 依存関係 |
|---|---------|--------|---------|---------|
| 1 | anonymous_id生成・LocalStorage保存 | S | 小 | なし |
| 2 | user_eventsテーブル作成（Supabase） | S | 小 | なし |
| 3 | イベント送信API（POST /api/events/track） | S | 中 | #2 |
| 4 | フロントエンドイベント送信フック（useTrackEvent） | S | 中 | #3 |
| 5 | 主要ページへのイベント埋め込み（page_view/video_view/article_read） | S | 中 | #4 |
| 6 | chat_sessions / chat_messagesテーブル作成 | S | 小 | なし |
| 7 | 既存AIチャットAPIの拡張（ログ保存） | S | 中 | #6 |
| 8 | リードへのsource_channel / source_content_id付与 | S | 中 | #4 |
| 9 | リードへのrecent_views（直前閲覧5件）付与 | S | 中 | #2, #8 |
| 10 | favoritesテーブル作成 | A | 小 | なし |
| 11 | お気に入りAPI（GET/POST/DELETE /api/favorites） | A | 中 | #10 |
| 12 | 物件詳細・工務店詳細にお気に入りボタン追加 | A | 中 | #11 |
| 13 | 閲覧履歴ページ（/dashboard/user/history） | A | 中 | #2 |
| 14 | GA4カスタムイベント送信設計・実装 | A | 中 | なし |
| 15 | buildersテーブルへの構造化カラム追加（price_range/design_taste/features等） | A | 中 | なし |
| 16 | CMS工務店編集画面の構造化入力フォーム追加 | A | 中 | #15 |
| 17 | Resendリード通知メール実装 | B | 中 | なし |
| 18 | 匿名→会員登録時のanonymous_id → user_idマージ処理 | A | 大 | #1, #2 |

---

## 2. 次フェーズで必要（Phase 2）

| # | 実装項目 | 優先度 | 依存関係 |
|---|---------|--------|---------|
| 19 | user_profilesテーブル作成 | A | なし |
| 20 | プロフィール入力UI（段階的ヒアリング） | B | #19 |
| 21 | comparisonsテーブル作成 | B | なし |
| 22 | 比較リスト機能（API + UI） | B | #21 |
| 23 | content_engagementsテーブル（日次集計バッチ） | B | #2 |
| 24 | AIチャット：会話要約の自動生成（セッション終了時） | A | #6, #7 |
| 25 | AIチャット：extracted_tags / inferred_intent抽出 | A | #6, #7 |
| 26 | AIチャット：ユーザータイプ診断機能 | B | #19, #25 |
| 27 | AIチャット：工務店推薦機能 | A | #15, #25 |
| 28 | builder_recommendationsテーブル + 推薦ロジック | A | #15, #19 |
| 29 | 意向データ付きリード（chat_summary/interest_tags/concerns） | A | #24, #25 |
| 30 | リードスコアリング自動計算（行動データベース） | B | #2, #9 |
| 31 | 管理画面：チャット分析ダッシュボード | B | #6 |
| 32 | 管理画面：行動分析ダッシュボード | B | #2, #23 |
| 33 | 管理画面：リード詳細の拡張（行動履歴・チャット要約表示） | A | #9, #24 |
| 34 | 工務店向け月次レポート自動生成 | B | #23 |
| 35 | LINE Messaging API連携 | C | なし |

---

## 3. 将来でよい（Phase 3+）

| # | 実装項目 | 依存関係 |
|---|---------|---------|
| 36 | AI住宅コンシェルジュ（フル機能） | Phase 2全体 |
| 37 | AI営業マン（住宅会社向け提案支援） | Phase 2全体 |
| 38 | 商談前要約の自動生成 | #24, #29 |
| 39 | next best action推定 | #28, #30 |
| 40 | 成約予測モデル | 十分なデータ蓄積 |
| 41 | Stripe決済連携（サブスクリプション） | パートナー数増加後 |
| 42 | 外部CRM連携 | 住宅会社のCRM利用調査後 |
| 43 | エリア拡大（九州全域→中国・四国） | 九州でのデータ蓄積後 |
| 44 | 住宅市場データ分析サービス | 十分なデータ蓄積 |

---

# AI住宅コンシェルジュ化のためのデータ取得項目一覧

| # | 項目名 | 内容 | 取得タイミング | 保存先 | 活用用途 | MVP必要 |
|---|--------|------|---------------|--------|---------|---------|
| 1 | anonymous_id | 匿名ユーザー識別子 | 初回訪問時 | LocalStorage + user_events | 匿名行動の追跡・会員化時の接続 | ✅ |
| 2 | page_view | ページ閲覧イベント | ページ表示時 | user_events + GA4 | 閲覧傾向分析・関心推定 | ✅ |
| 3 | video_view | 動画視聴開始 | YouTube再生開始時 | user_events + GA4 | 動画コンテンツの効果測定 | ✅ |
| 4 | article_read | 記事読了 | 一定スクロール到達時 | user_events + GA4 | 記事の効果測定・関心分析 | ✅ |
| 5 | builder_detail_view | 工務店詳細閲覧 | 工務店詳細ページ表示時 | user_events + GA4 | 関心のある工務店の把握 | ✅ |
| 6 | event_detail_view | イベント詳細閲覧 | イベント詳細ページ表示時 | user_events + GA4 | イベントの効果測定 | ✅ |
| 7 | favorite_add | お気に入り追加 | お気に入りボタン押下時 | favorites + user_events | 明示的関心の把握・推薦材料 | ✅ |
| 8 | chat_message | チャットメッセージ | メッセージ送受信時 | chat_messages | 意向抽出・要約生成・学習データ | ✅ |
| 9 | chat_session_start | チャット開始 | チャットウィジェット開始時 | chat_sessions + GA4 | AI利用率計測 | ✅ |
| 10 | chat_session_end | チャット終了 | 会話終了時（離脱 or 明示的終了） | chat_sessions | 完了率計測・要約トリガー | ✅ |
| 11 | source_channel | 流入チャネル | リード作成時 | leads.source_channel | チャネル別CV率分析 | ✅ |
| 12 | source_content_id | 流入元コンテンツ | リード作成時 | leads.source_content_id | コンテンツ→CV貢献分析 | ✅ |
| 13 | recent_views | 直前閲覧履歴 | リード作成時 | leads.recent_views | リード文脈の理解・住宅会社への提供 | ✅ |
| 14 | referrer | リファラ | ページ表示時 | user_events.referrer | 流入経路分析 | ✅ |
| 15 | device_type | デバイス種別 | ページ表示時 | user_events.device_type | デバイス別分析 | ✅ |
| 16 | simulator_use | ローンシミュレーター利用 | シミュレーター計算実行時 | user_events + GA4 | 検討の本気度推定 | ✅ |
| 17 | tel_click | 電話番号クリック | 電話番号タップ時 | GA4 | オフラインCV計測 | ✅ |
| 18 | line_click | LINE友だち追加クリック | LINEボタンクリック時 | GA4 | LINE経由CV計測 | ✅ |
| 19 | comparison_add | 比較リスト追加 | 比較ボタン押下時 | comparisons + user_events | 比較行動の把握 | ❌（Phase 2） |
| 20 | family_structure | 家族構成 | プロフィール入力 or チャット推定 | user_profiles | パーソナライズ・推薦 | ❌（Phase 2） |
| 21 | age_range | 年齢層 | プロフィール入力 or チャット推定 | user_profiles | セグメント分析 | ❌（Phase 2） |
| 22 | planned_timing | 建築予定時期 | プロフィール入力 or チャット推定 | user_profiles | 温度感推定・優先度判定 | ❌（Phase 2） |
| 23 | has_land | 土地の有無 | プロフィール入力 or チャット推定 | user_profiles | 工務店推薦のフィルタ条件 | ❌（Phase 2） |
| 24 | preferred_area | 希望エリア | プロフィール入力 or フォーム | user_profiles | エリアマッチング | ❌（Phase 2） |
| 25 | budget_range | 予算帯 | プロフィール入力 or チャット推定 | user_profiles | 工務店推薦のフィルタ条件 | ❌（Phase 2） |
| 26 | design_orientation | デザイン志向 | 閲覧傾向から推定 | user_profiles | 推薦ロジックの入力 | ❌（Phase 2） |
| 27 | performance_orientation | 性能志向 | 閲覧傾向から推定 | user_profiles | 推薦ロジックの入力 | ❌（Phase 2） |
| 28 | lifestyle_priorities | 暮らしの優先事項 | プロフィール or チャット推定 | user_profiles | 推薦ロジックの入力 | ❌（Phase 2） |
| 29 | consideration_phase | 検討フェーズ | 行動パターンから自動推定 | user_profiles | ファネル分析・next best action | ❌（Phase 2） |
| 30 | temperature | 温度感スコア | 行動スコアリング自動計算 | user_profiles / leads | リード優先度・自動スコアリング | ❌（Phase 2） |
| 31 | inferred_intent | 推定意図 | チャット終了時のAI分析 | chat_sessions | リード品質向上 | ❌（Phase 2） |
| 32 | extracted_tags | 抽出タグ | チャット終了時のAI分析 | chat_sessions | 意向の構造化 | ❌（Phase 2） |
| 33 | conversation_summary | 会話要約 | チャット終了時のAI生成 | chat_sessions | 商談前要約・リード品質向上 | ❌（Phase 2） |
| 34 | recommended_action | 推薦アクション | チャット分析時 | chat_sessions | next best action提案 | ❌（Phase 2） |
| 35 | lead_conversion | リード化フラグ | チャット→フォーム遷移時 | chat_sessions | AI→CV率計測 | ❌（Phase 2） |
| 36 | interest_tags | 関心タグ | 閲覧・チャットから複合推定 | leads | リード品質向上 | ❌（Phase 2） |
| 37 | concerns | 不安要素 | チャットから抽出 | leads | 商談準備支援 | ❌（Phase 2） |
| 38 | recommendation_reason | 推薦理由 | 推薦ロジック出力 | builder_recommendations | 透明性・信頼性 | ❌（Phase 2） |
| 39 | next_best_action | 次のアクション推定 | 行動パターン + 成約データ分析 | chat_sessions / user_profiles | AI提案の高度化 | ❌（Phase 3） |
| 40 | conversion_reason | コンバージョン理由 | フォーム送信時の文脈分析 | leads | 成約要因分析 | ❌（Phase 3） |

---

## まとめ

**Phase 1（MVP・データ基盤）で取得すべき項目：** #1〜#18（18項目）
**Phase 2（AI活用開始）で取得すべき項目：** #19〜#38（20項目）
**Phase 3（AI本格稼働）で取得すべき項目：** #39〜#40（2項目）

Phase 1の18項目は、ユーザー体験を大きく変えることなく、バックエンドのイベント送信とDB保存で実現できる。これが6ヶ月後のAI活用の成否を決める。

---

*本文書は payhome-next コードベース（2026-03-22時点）の実装状態および将来構想に基づいて作成されたものです。*
