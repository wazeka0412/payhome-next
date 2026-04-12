/**
 * AI家づくり診断の質問定義（v4.0 MVP版）
 *
 * 10問で家づくりの志向をヒアリングし、タイプ分類 + 工務店レコメンドに使う。
 * 各質問は answers オブジェクトのキーに対応する。
 */

export interface DiagnosisQuestion {
  key: string
  question: string
  options: { value: string; label: string }[]
  multi?: boolean // trueなら複数選択可
}

export const DIAGNOSIS_QUESTIONS: DiagnosisQuestion[] = [
  // ── Q1-Q3: あなたのこと ──
  {
    key: 'family_structure',
    question: '家族構成を教えてください',
    options: [
      { value: 'single', label: 'ひとり暮らし' },
      { value: 'couple', label: '夫婦ふたり' },
      { value: 'family_kids', label: '夫婦＋子ども' },
      { value: 'family_seniors', label: '親との二世帯・多世代' },
    ],
  },
  {
    key: 'age_range',
    question: 'ご年齢は？',
    options: [
      { value: '20s', label: '20代' },
      { value: '30s', label: '30代' },
      { value: '40s', label: '40代' },
      { value: '50s', label: '50代' },
      { value: '60s+', label: '60代以上' },
    ],
  },
  {
    key: 'building_trigger',
    question: '家づくりを考えたきっかけは？',
    options: [
      { value: 'marriage', label: '結婚・入籍' },
      { value: 'family_change', label: '家族が増える・構成の変化' },
      { value: 'rent_waste', label: '家賃がもったいない' },
      { value: 'old_house', label: '今の家が古い・手狭' },
      { value: 'environment', label: '環境を変えたい' },
      { value: 'retirement', label: '老後に備えて' },
    ],
  },
  // ── Q4-Q6: 条件 ──
  {
    key: 'preferred_area',
    question: 'ご希望のエリアは？',
    options: [
      { value: '鹿児島市', label: '鹿児島市' },
      { value: '姶良市', label: '姶良市' },
      { value: '霧島市', label: '霧島市' },
      { value: '薩摩川内市', label: '薩摩川内市' },
      { value: 'その他', label: 'その他・未定' },
    ],
  },
  {
    key: 'has_land',
    question: '土地はお持ちですか？',
    options: [
      { value: 'yes', label: 'すでに土地がある' },
      { value: 'searching', label: '土地を探している' },
      { value: 'need_help', label: '土地探しから相談したい' },
    ],
  },
  {
    key: 'budget_range',
    question: 'ご予算の目安は？（土地代含む総額）',
    options: [
      { value: '~2000', label: '2,000万円以下' },
      { value: '2000-2500', label: '2,000〜2,500万円' },
      { value: '2500-3000', label: '2,500〜3,000万円' },
      { value: '3000-4000', label: '3,000〜4,000万円' },
      { value: '4000+', label: '4,000万円以上' },
    ],
  },
  {
    key: 'monthly_payment',
    question: '月々の返済はどのくらいをイメージしていますか？',
    options: [
      { value: '~6', label: '6万円以下' },
      { value: '6-8', label: '6〜8万円' },
      { value: '8-10', label: '8〜10万円' },
      { value: '10-13', label: '10〜13万円' },
      { value: '13+', label: '13万円以上' },
    ],
  },
  // ── Q8-Q9: 広さ・間取り ──
  {
    key: 'floor_area',
    question: '希望の広さ（延床面積）は？',
    options: [
      { value: '~25', label: '25坪以下（コンパクト）' },
      { value: '25-30', label: '25〜30坪' },
      { value: '30-35', label: '30〜35坪' },
      { value: '35-40', label: '35〜40坪' },
      { value: '40+', label: '40坪以上（ゆとり）' },
    ],
  },
  {
    key: 'parking_needs',
    question: '駐車スペースは何台分必要ですか？',
    options: [
      { value: '0', label: '不要' },
      { value: '1', label: '1台' },
      { value: '2', label: '2台' },
      { value: '3+', label: '3台以上' },
    ],
  },
  // ── Q10-Q12: デザイン・性能・暮らし ──
  {
    key: 'design_orientation',
    question: '好みのテイストは？（複数選択可）',
    multi: true,
    options: [
      { value: 'modern', label: 'モダン・スタイリッシュ' },
      { value: 'natural', label: 'ナチュラル・木の温もり' },
      { value: 'japanese', label: '和モダン・和風' },
      { value: 'scandinavian', label: '北欧・シンプル' },
      { value: 'industrial', label: 'インダストリアル・男前' },
    ],
  },
  {
    key: 'performance_orientation',
    question: 'こだわりたい性能は？（複数選択可）',
    multi: true,
    options: [
      { value: 'insulation', label: '断熱（冬あたたかく夏涼しい）' },
      { value: 'airtight', label: '気密（C値・UA値の高水準）' },
      { value: 'earthquake', label: '耐震（等級3）' },
      { value: 'zeh', label: 'ZEH・省エネ' },
      { value: 'durability', label: '長寿命・メンテナンス性' },
    ],
  },
  {
    key: 'lifestyle_priorities',
    question: '暮らしで大切にしたいことは？（複数選択可）',
    multi: true,
    options: [
      { value: 'family_friendly', label: '家族のコミュニケーション' },
      { value: 'senior_friendly', label: 'バリアフリー・老後に備える' },
      { value: 'home_office', label: '在宅ワーク・書斎' },
      { value: 'open_kitchen', label: '広いLDK・対面キッチン' },
      { value: 'storage', label: '収納力・家事動線' },
      { value: 'outdoor', label: '庭・ウッドデッキ' },
    ],
  },
  // ── Q13-Q14: 営業相性・検討段階 ──
  {
    key: 'sales_preference',
    question: '工務店の営業担当に求めることは？（複数選択可）',
    multi: true,
    options: [
      { value: 'attentive', label: '親身に話を聞いてくれる' },
      { value: 'responsive', label: 'レスポンスが早い' },
      { value: 'proactive', label: '積極的にリードしてくれる' },
      { value: 'visual', label: 'パースや3Dで提案してくれる' },
      { value: 'consistent', label: '担当が最後まで変わらない' },
      { value: 'not_pushy', label: 'しつこい営業はNG' },
    ],
  },
  {
    key: 'planned_timing',
    question: 'いつ頃の建築・入居をお考えですか？',
    options: [
      { value: 'immediately', label: 'すぐにでも（3ヶ月以内）' },
      { value: '3-6months', label: '3〜6ヶ月以内' },
      { value: '6-12months', label: '半年〜1年以内' },
      { value: '1year+', label: '1年以上先' },
      { value: 'researching', label: 'まだ情報収集中' },
    ],
  },
  {
    key: 'consideration_phase',
    question: '家づくりの検討はどの段階ですか？',
    options: [
      { value: 'awareness', label: '興味を持ち始めた' },
      { value: 'interest', label: '情報を集めている' },
      { value: 'comparison', label: '工務店を比較している' },
      { value: 'decision', label: '決定間近' },
    ],
  },
]

export const TOTAL_QUESTIONS = DIAGNOSIS_QUESTIONS.length // 15問（v5.0）

/**
 * 診断結果のユーザータイプを算出する（MVP版・ルールベース）
 */
export function classifyUserType(answers: Record<string, string | string[]>): string {
  const design = (answers.design_orientation as string[]) || []
  const performance = (answers.performance_orientation as string[]) || []
  const lifestyle = (answers.lifestyle_priorities as string[]) || []
  const budget = answers.budget_range as string
  const family = answers.family_structure as string
  const trigger = answers.building_trigger as string

  // 性能重視（性能2つ以上選択）
  if (performance.length >= 2 && (performance.includes('insulation') || performance.includes('airtight'))) {
    return 'performance_focused'
  }
  // デザイン重視
  if (design.includes('modern') || design.includes('scandinavian') || design.includes('industrial')) {
    return 'design_focused'
  }
  // コスト重視
  if (budget === '~2000' || budget === '2000-2500') {
    return 'cost_focused'
  }
  // シニア・バリアフリー重視
  if (lifestyle.includes('senior_friendly') || family === 'family_seniors' || trigger === 'retirement') {
    return 'senior_friendly'
  }
  // 家族・子育て重視
  if (family === 'family_kids' || trigger === 'family_change' || lifestyle.includes('family_friendly')) {
    return 'family_focused'
  }
  // 自然素材・ナチュラル
  if (design.includes('natural') || design.includes('japanese')) {
    return 'natural_focused'
  }
  return 'balanced'
}

/**
 * ユーザータイプのラベルと説明
 */
export const USER_TYPE_INFO: Record<string, { label: string; description: string; color: string }> = {
  performance_focused: {
    label: '高性能重視タイプ',
    description: '断熱・気密・耐震など、長く快適に暮らせる性能を最優先にする方。光熱費や住み心地に妥協しません。',
    color: '#2E86DE',
  },
  design_focused: {
    label: 'デザイン重視タイプ',
    description: '住む人の個性が反映されたデザインにこだわる方。見た目の美しさと機能性を両立したい。',
    color: '#A569BD',
  },
  cost_focused: {
    label: 'コスト重視タイプ',
    description: '予算内で最大限の満足を求める賢い方。無駄を省いて本当に必要なものに投資したい。',
    color: '#27AE60',
  },
  senior_friendly: {
    label: '終の棲家タイプ',
    description: 'バリアフリー・コンパクト・管理のしやすさを重視。長く安心して暮らせる家を求める方。',
    color: '#E67E22',
  },
  family_focused: {
    label: '子育て重視タイプ',
    description: '家族のコミュニケーション・家事動線・収納を重視する方。子育てしやすい家をお探し。',
    color: '#E74C3C',
  },
  natural_focused: {
    label: 'ナチュラル派タイプ',
    description: '木の温もりや自然素材を活かした家を好む方。健康的で落ち着く住まいを求めています。',
    color: '#8B6F47',
  },
  balanced: {
    label: 'バランス重視タイプ',
    description: 'コスト・デザイン・性能をバランスよく取り入れたい方。無理なく理想の家を目指します。',
    color: '#E8740C',
  },
}
