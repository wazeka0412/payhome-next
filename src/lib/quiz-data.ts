/**
 * ぺいほーむクイズ 問題定義 (MVP v1)
 *
 * 目的: 家づくりの理解度を可視化し、次の最適行動へ導く教育導線
 *
 * 4 カテゴリ × 10 問:
 *   - 建売と注文住宅の違い (3問)
 *   - 住宅ローン (2問)
 *   - 家づくりの流れ (2問)
 *   - 平屋の特徴 (3問)
 *
 * レベル判定:
 *   - 初心者: 0〜3 問正解
 *   - 中級者: 4〜7 問正解
 *   - 上級者: 8〜10 問正解
 */

export interface QuizQuestion {
  id: string
  category: 'tatemono' | 'loan' | 'flow' | 'hiraya'
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface QuizResult {
  score: number
  total: number
  level: 'beginner' | 'intermediate' | 'advanced'
  categoryScores: Record<string, { correct: number; total: number }>
  weakCategories: string[]
}

export const CATEGORY_LABELS: Record<string, string> = {
  tatemono: '建売と注文住宅の違い',
  loan: '住宅ローン',
  flow: '家づくりの流れ',
  hiraya: '平屋の特徴',
}

export const LEVEL_LABELS: Record<string, { label: string; description: string; color: string }> = {
  beginner: {
    label: '初心者',
    description: '家づくりの基礎知識を身につけるところからスタートしましょう。動画やAI診断で、自分に合う家づくりの方向性を見つけることをおすすめします。',
    color: '#E8740C',
  },
  intermediate: {
    label: '中級者',
    description: '基本は理解できています。苦手カテゴリを補強しつつ、具体的な工務店比較や事例閲覧を進めてみましょう。',
    color: '#2E86DE',
  },
  advanced: {
    label: '上級者',
    description: '家づくりの知識は十分です。具体的なアクション（見学会予約や無料相談）で、理想の家づくりを前に進めましょう。',
    color: '#27AE60',
  },
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ── 建売と注文住宅の違い (3問) ──
  {
    id: 'q01',
    category: 'tatemono',
    difficulty: 'easy',
    question: '「建売住宅」と「注文住宅」の最も大きな違いはどれですか？',
    options: [
      '建売は土地とセットで販売されるが、注文住宅は土地を別に用意する必要がある',
      '建売の方が注文住宅より必ず安い',
      '注文住宅は木造しか建てられない',
      '建売住宅はリフォームができない',
    ],
    correctIndex: 0,
    explanation:
      '建売住宅は完成済み（または建築中）の住宅を土地とセットで購入します。注文住宅は間取りや仕様を自由に決められますが、土地を別途用意する必要があります。',
  },
  {
    id: 'q02',
    category: 'tatemono',
    difficulty: 'medium',
    question: '注文住宅のメリットとして正しいものはどれですか？',
    options: [
      '建築途中のチェックができないため安心感がある',
      '間取り・デザイン・設備を自分の希望に合わせて設計できる',
      '引き渡しまでの期間が建売より短い',
      '住宅ローンの審査が建売より有利になる',
    ],
    correctIndex: 1,
    explanation:
      '注文住宅の最大のメリットは、間取り・デザイン・設備を自由に決められることです。家族のライフスタイルに合わせた家づくりが可能です。ただし、建売より完成までの時間がかかります。',
  },
  {
    id: 'q03',
    category: 'tatemono',
    difficulty: 'hard',
    question: '建売住宅を購入する際、特に注意すべき点はどれですか？',
    options: [
      '外観のデザインが気に入れば内装は問題ない',
      '建物の構造や断熱性能、地盤の状態を確認すること',
      '値引き交渉をしないこと',
      'モデルハウスと同じ仕様であると信じること',
    ],
    correctIndex: 1,
    explanation:
      '建売住宅は完成品のため、構造や断熱性能など見えない部分の品質を事前に確認することが重要です。地盤調査報告書や第三者検査の有無もチェックしましょう。',
  },

  // ── 住宅ローン (2問) ──
  {
    id: 'q04',
    category: 'loan',
    difficulty: 'easy',
    question: '住宅ローンの「変動金利」と「固定金利」の違いについて正しいものはどれですか？',
    options: [
      '変動金利は金利がずっと変わらない',
      '固定金利は返済中に金利が変動する可能性がある',
      '変動金利は返済中に金利が変わる可能性があり、固定金利は完済まで金利が一定',
      '変動金利と固定金利に違いはない',
    ],
    correctIndex: 2,
    explanation:
      '変動金利は半年ごとに金利が見直され、返済額が変わる可能性があります。固定金利は借入時の金利が完済まで一定なので、返済計画が立てやすいのが特徴です。',
  },
  {
    id: 'q05',
    category: 'loan',
    difficulty: 'medium',
    question: '住宅ローンの返済負担率（年間返済額÷年収）の目安として、一般的に推奨される上限はどれですか？',
    options: [
      '年収の10%以内',
      '年収の25%以内',
      '年収の50%以内',
      '年収の80%以内',
    ],
    correctIndex: 1,
    explanation:
      '一般的に、住宅ローンの年間返済額は年収の25%以内に抑えることが推奨されています。無理のない返済計画を立てるために、返済負担率を意識しましょう。',
  },

  // ── 家づくりの流れ (2問) ──
  {
    id: 'q06',
    category: 'flow',
    difficulty: 'easy',
    question: '家づくりの一般的な流れとして正しい順番はどれですか？',
    options: [
      '契約 → 設計 → 土地探し → 引き渡し',
      '情報収集 → 土地探し・工務店選び → 設計・見積り → 契約 → 着工 → 引き渡し',
      '着工 → 設計 → 土地探し → 契約',
      '引き渡し → 設計 → 契約 → 着工',
    ],
    correctIndex: 1,
    explanation:
      '家づくりは「情報収集 → 土地探し・工務店選び → 設計・見積り → 契約 → 着工 → 引き渡し」の流れが一般的です。最初の情報収集と工務店選びが最も重要なステップです。',
  },
  {
    id: 'q07',
    category: 'flow',
    difficulty: 'medium',
    question: '注文住宅の場合、契約から引き渡しまでにかかる一般的な期間はどれくらいですか？',
    options: [
      '約1ヶ月',
      '約3〜6ヶ月',
      '約6〜12ヶ月',
      '約3年以上',
    ],
    correctIndex: 2,
    explanation:
      '注文住宅は設計打ち合わせ、確認申請、着工、完成、検査を経て引き渡しまで6〜12ヶ月程度かかるのが一般的です。工法や規模によってはそれ以上かかることもあります。',
  },

  // ── 平屋の特徴 (3問) ──
  {
    id: 'q08',
    category: 'hiraya',
    difficulty: 'easy',
    question: '平屋住宅のメリットとして最も適切なものはどれですか？',
    options: [
      '2階建てより必ず建築費が安い',
      '階段がないためバリアフリーで、生活動線がコンパクト',
      '狭い土地でも建てられる',
      '税金が2階建てより安くなる',
    ],
    correctIndex: 1,
    explanation:
      '平屋の最大のメリットは、階段がないことによるバリアフリー性と生活動線のコンパクトさです。老後も安心して暮らせ、家事動線も効率的になります。ただし、同じ延床面積なら2階建てより広い土地が必要です。',
  },
  {
    id: 'q09',
    category: 'hiraya',
    difficulty: 'medium',
    question: '平屋を建てる際に注意すべき点として正しいものはどれですか？',
    options: [
      '平屋は構造的に弱いので地震に不利',
      '日当たりや通風の確保のため、建物の配置と間取りの工夫が重要',
      '平屋は設備のグレードを下げないと予算が合わない',
      '平屋は2階建てと同じ土地面積で建てられる',
    ],
    correctIndex: 1,
    explanation:
      '平屋は全ての部屋が1階にあるため、建物の中心部は日当たりや通風が確保しづらくなります。中庭やハイサイドライトなどの工夫で快適な住環境を実現できます。なお、平屋は重心が低く耐震性に優れています。',
  },
  {
    id: 'q10',
    category: 'hiraya',
    difficulty: 'hard',
    question: '鹿児島で平屋を建てる場合の坪単価の目安として、最も近いのはどれですか？',
    options: [
      '30〜40万円/坪',
      '50〜70万円/坪',
      '100〜120万円/坪',
      '150万円以上/坪',
    ],
    correctIndex: 1,
    explanation:
      '鹿児島で平屋を建てる場合、ローコスト住宅で50万円/坪〜、標準的な注文住宅で60〜70万円/坪が目安です。高性能住宅やデザイン住宅ではさらに上がります。ぺいほーむの動画や事例で実際の坪単価を確認してみましょう。',
  },
]

/**
 * スコアからレベルを判定する
 */
export function determineLevel(score: number, total: number): QuizResult['level'] {
  const ratio = score / total
  if (ratio >= 0.8) return 'advanced'
  if (ratio >= 0.4) return 'intermediate'
  return 'beginner'
}

/**
 * カテゴリ別スコアと苦手カテゴリを算出する
 */
export function calculateCategoryScores(
  answers: Array<{ questionId: string; selectedIndex: number }>
): QuizResult['categoryScores'] {
  const scores: Record<string, { correct: number; total: number }> = {}

  for (const q of QUIZ_QUESTIONS) {
    const cat = q.category
    if (!scores[cat]) scores[cat] = { correct: 0, total: 0 }
    scores[cat].total += 1

    const answer = answers.find((a) => a.questionId === q.id)
    if (answer && answer.selectedIndex === q.correctIndex) {
      scores[cat].correct += 1
    }
  }

  return scores
}

export function findWeakCategories(
  categoryScores: QuizResult['categoryScores']
): string[] {
  return Object.entries(categoryScores)
    .filter(([_, s]) => s.correct / s.total < 0.5)
    .map(([cat]) => cat)
}

/**
 * 全体の QuizResult を算出する
 */
export function calculateQuizResult(
  answers: Array<{ questionId: string; selectedIndex: number }>
): QuizResult {
  const total = QUIZ_QUESTIONS.length
  let score = 0

  for (const q of QUIZ_QUESTIONS) {
    const answer = answers.find((a) => a.questionId === q.id)
    if (answer && answer.selectedIndex === q.correctIndex) {
      score += 1
    }
  }

  const level = determineLevel(score, total)
  const categoryScores = calculateCategoryScores(answers)
  const weakCategories = findWeakCategories(categoryScores)

  return { score, total, level, categoryScores, weakCategories }
}
