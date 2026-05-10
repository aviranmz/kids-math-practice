export type LevelId = 'easy' | 'medium' | 'hard'

/** Locked MVP ranges: Easy 1–10, Medium 1–25, Hard 1–100 */
export const LEVEL_RANGE: Record<LevelId, { min: number; max: number }> = {
  easy: { min: 1, max: 10 },
  medium: { min: 1, max: 25 },
  hard: { min: 1, max: 100 },
}

export type QuestionOp = 'add' | 'subtract' | 'multiply' | 'divide'

export interface Question {
  left: number
  right: number
  op: QuestionOp
}

const OPS_ALL: QuestionOp[] = [
  'add',
  'subtract',
  'multiply',
  'divide',
]

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function answerFor(q: Question): number {
  switch (q.op) {
    case 'add':
      return q.left + q.right
    case 'subtract':
      return q.left - q.right
    case 'multiply':
      return q.left * q.right
    case 'divide':
      return q.left / q.right
    default: {
      const _exhaustive: never = q.op
      return _exhaustive
    }
  }
}

export function formatQuestion(q: Question): string {
  const sym = { add: '+', subtract: '-', multiply: '×', divide: '÷' }[q.op]
  return `${q.left} ${sym} ${q.right}`
}

export function randomQuestion(
  level: LevelId,
  op: QuestionOp | 'mix',
): Question {
  const { min, max } = LEVEL_RANGE[level]
  const chosen = op === 'mix' ? OPS_ALL[randomInt(0, OPS_ALL.length - 1)] : op

  switch (chosen) {
    case 'add':
      return { left: randomInt(min, max), right: randomInt(min, max), op: 'add' }
    case 'subtract': {
      let a = randomInt(min, max)
      let b = randomInt(min, max)
      if (b > a) [a, b] = [b, a]
      return { left: a, right: b, op: 'subtract' }
    }
    case 'multiply':
      return {
        left: randomInt(min, max),
        right: randomInt(min, max),
        op: 'multiply',
      }
    case 'divide': {
      for (let i = 0; i < 100; i++) {
        const divisor = randomInt(2, Math.min(max, 12))
        const maxQ = Math.floor(max / divisor)
        if (maxQ < 1) continue
        const quotient = randomInt(1, maxQ)
        const dividend = divisor * quotient
        if (dividend >= min && dividend <= max) {
          return { left: dividend, right: divisor, op: 'divide' }
        }
      }
      return { left: 8, right: 2, op: 'divide' }
    }
    default: {
      const _exhaustive: never = chosen
      return _exhaustive
    }
  }
}

export function buildRound(
  level: LevelId,
  op: QuestionOp | 'mix',
  count: number,
): Question[] {
  return Array.from({ length: count }, () => randomQuestion(level, op))
}

const STORAGE_KEY = 'kids-math-practice.highScore.v1'

export type HighScores = Record<LevelId, number>

export function loadHighScores(): HighScores {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { easy: 0, medium: 0, hard: 0 }
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { easy: 0, medium: 0, hard: 0 }
    const o = JSON.parse(raw) as Partial<Record<LevelId, number>>
    return {
      easy: typeof o.easy === 'number' ? o.easy : 0,
      medium: typeof o.medium === 'number' ? o.medium : 0,
      hard: typeof o.hard === 'number' ? o.hard : 0,
    }
  } catch {
    return { easy: 0, medium: 0, hard: 0 }
  }
}

/** Returns true if this score is a new best for the level. */
export function maybeUpdateHighScore(level: LevelId, score: number): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false
  const prev = loadHighScores()
  if (score <= prev[level]) return false
  prev[level] = score
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prev))
  return true
}
