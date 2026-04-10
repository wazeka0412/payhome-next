/**
 * 見学会モード（Smart Match Phase 1.5）
 *
 * 会員様が見学会に参加する目的を事前に明示するためのタグ。
 * 工務店は商談スタイルを事前に調整でき、会員様は「今日は体感だけ」
 * などの希望を気兼ねなく伝えられる。
 */

export type ViewingMode =
  | 'experience'  // 体感モード：実物を見るだけ
  | 'consult'     // 相談モード：設計・予算の具体相談OK
  | 'contract';   // 契約検討モード：見積もり・契約の話OK

export const VIEWING_MODE_INFO: Record<
  ViewingMode,
  {
    label: string;
    shortLabel: string;
    icon: string;
    description: string;
    builderNote: string;
    color: string;
  }
> = {
  experience: {
    label: '体感モード',
    shortLabel: '見るだけ',
    icon: '👁',
    description: '今日は実物を見て雰囲気を感じたい。商談トークは不要です',
    builderNote: '物件の説明と施主ストーリーを中心に。具体的な商談トークは控えめに。',
    color: '#10B981', // green
  },
  consult: {
    label: '相談モード',
    shortLabel: '相談したい',
    icon: '💬',
    description: '間取り・予算・工務店選びについて具体的に相談したい',
    builderNote: '設計・予算・プランニングの相談に丁寧に応答してください。',
    color: '#E8740C', // orange (default)
  },
  contract: {
    label: '契約検討モード',
    shortLabel: '本気で検討',
    icon: '🤝',
    description: '具体的な見積もり・契約の話まで進めたい',
    builderNote: '見積もり・契約・資金計画を含めた具体的な商談にご対応ください。',
    color: '#EF4444', // red
  },
};

export function getViewingModeInfo(mode: ViewingMode) {
  return VIEWING_MODE_INFO[mode];
}
