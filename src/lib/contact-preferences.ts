/**
 * 連絡条件設定（Anti-Pressure Pack 第一弾）
 *
 * ユーザーが「ぺいほーむ経由での連絡はどう受け取りたいか」を明示的に
 * 設定できる仕組み。工務店は見学会予約・問い合わせ時にこれを受け取り、
 * 契約上の遵守義務を負う。
 *
 * 関連: docs/01_事業戦略・計画/営業圧力ゼロ戦略.md
 */

// ─── 連絡頻度 ───
export type ContactFrequency =
  | 'weekly'      // 週1回まで
  | 'monthly'     // 月1回まで
  | 'ondemand';   // 当方から連絡するのみ

export const CONTACT_FREQUENCY_LABELS: Record<ContactFrequency, string> = {
  weekly: '週1回までOK',
  monthly: '月1回までOK',
  ondemand: 'こちらから連絡します（プッシュ連絡不要）',
};

// ─── 連絡手段（複数選択可） ───
export type ContactChannel =
  | 'email'
  | 'line'
  | 'phone';

export const CONTACT_CHANNEL_LABELS: Record<ContactChannel, string> = {
  email: 'メール',
  line: 'LINE',
  phone: '電話',
};

// ─── 連絡時間帯 ───
export type ContactTimeSlot =
  | 'weekday_day'      // 平日昼間（10:00-17:00）
  | 'weekday_evening'  // 平日夜（18:00-21:00）
  | 'weekend'          // 週末
  | 'anytime';         // いつでもOK

export const CONTACT_TIMESLOT_LABELS: Record<ContactTimeSlot, string> = {
  weekday_day: '平日 10:00〜17:00',
  weekday_evening: '平日 18:00〜21:00',
  weekend: '週末（土日祝）',
  anytime: 'いつでもOK',
};

// ─── 連絡目的 ───
export type ContactPurpose =
  | 'info_only'         // 情報提供のみ
  | 'qa'                // 質問への回答のみ
  | 'proposal';         // 商談提案もOK

export const CONTACT_PURPOSE_LABELS: Record<ContactPurpose, string> = {
  info_only: '情報提供のみ希望（提案は不要）',
  qa: '質問への回答のみ希望',
  proposal: '具体的な商談・提案を受けたい',
};

// ─── 検討フェーズ ───
export type ConsiderationPhase =
  | 'collecting'  // A 情報収集中
  | 'comparing'   // B 比較検討中
  | 'specific'    // C 具体検討中
  | 'pre_contract'; // D 契約前

export const CONSIDERATION_PHASE_LABELS: Record<ConsiderationPhase, { label: string; description: string }> = {
  collecting: {
    label: 'A｜情報収集中',
    description: '平屋について勉強中。連絡は自分から求めた時だけで十分。',
  },
  comparing: {
    label: 'B｜比較検討中',
    description: '複数の工務店を比較中。週1回までの連絡ならOK。',
  },
  specific: {
    label: 'C｜具体検討中',
    description: '特定の工務店に絞って検討中。週2〜3回の連絡、見学会歓迎。',
  },
  pre_contract: {
    label: 'D｜契約前',
    description: '契約直前。積極的に連絡してほしい。',
  },
};

// ─── 設定データ ───
export interface ContactPreferences {
  id?: string;
  user_id?: string;
  anonymous_id?: string;
  frequency: ContactFrequency;
  channels: ContactChannel[];
  timeslots: ContactTimeSlot[];
  purpose: ContactPurpose;
  consideration_phase: ConsiderationPhase;
  memo?: string;
  updated_at?: string;
}

/**
 * デフォルト値
 * - 新規会員は「比較検討中 × メール週1」からスタート
 * - これは緩やかなデフォルトで、ユーザーが後から自由に調整可能
 */
export const DEFAULT_CONTACT_PREFERENCES: ContactPreferences = {
  frequency: 'weekly',
  channels: ['email'],
  timeslots: ['weekday_day', 'weekday_evening'],
  purpose: 'qa',
  consideration_phase: 'comparing',
  memo: '',
};

/**
 * 工務店向けに整形した「ユーザー名刺」形式のサマリー
 * 見学会予約通知メールや工務店ダッシュボードで表示する
 */
export function formatPreferencesForBuilder(p: ContactPreferences): string {
  const lines: string[] = [];
  lines.push('━━━ 会員様の連絡条件 ━━━');
  lines.push(
    `検討フェーズ: ${CONSIDERATION_PHASE_LABELS[p.consideration_phase].label}`
  );
  lines.push(`連絡頻度: ${CONTACT_FREQUENCY_LABELS[p.frequency]}`);
  lines.push(
    `連絡手段: ${p.channels.map((c) => CONTACT_CHANNEL_LABELS[c]).join(' / ')}`
  );
  lines.push(
    `連絡時間帯: ${p.timeslots.map((t) => CONTACT_TIMESLOT_LABELS[t]).join(' / ')}`
  );
  lines.push(`連絡目的: ${CONTACT_PURPOSE_LABELS[p.purpose]}`);
  if (p.memo) lines.push(`メモ: ${p.memo}`);
  lines.push('━━━━━━━━━━━━━━━━━');
  lines.push(
    '※ ぺいほーむ提携条件として、上記の連絡条件をお守りください。違反があった場合、プラットフォーム規約に基づき対応させていただきます。'
  );
  return lines.join('\n');
}
