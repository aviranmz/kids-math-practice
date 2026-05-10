import { describe, expect, it } from 'vitest'
import {
  LEVEL_RANGE,
  answerFor,
  buildRound,
  formatQuestion,
  randomQuestion,
} from './game'

describe('LEVEL_RANGE', () => {
  it('matches locked MVP ranges', () => {
    expect(LEVEL_RANGE.easy).toEqual({ min: 1, max: 10 })
    expect(LEVEL_RANGE.medium).toEqual({ min: 1, max: 25 })
    expect(LEVEL_RANGE.hard).toEqual({ min: 1, max: 100 })
  })
})

describe('answerFor', () => {
  it('computes results', () => {
    expect(answerFor({ left: 3, right: 4, op: 'add' })).toBe(7)
    expect(answerFor({ left: 9, right: 4, op: 'subtract' })).toBe(5)
    expect(answerFor({ left: 6, right: 7, op: 'multiply' })).toBe(42)
    expect(answerFor({ left: 24, right: 6, op: 'divide' })).toBe(4)
  })
})

describe('formatQuestion', () => {
  it('renders readable prompts', () => {
    expect(formatQuestion({ left: 2, right: 3, op: 'add' })).toBe('2 + 3')
    expect(formatQuestion({ left: 10, right: 2, op: 'divide' })).toBe('10 ÷ 2')
  })
})

describe('randomQuestion', () => {
  it('keeps operands within level bounds for easy add', () => {
    for (let i = 0; i < 40; i++) {
      const q = randomQuestion('easy', 'add')
      expect(q.left).toBeGreaterThanOrEqual(1)
      expect(q.left).toBeLessThanOrEqual(10)
      expect(q.right).toBeGreaterThanOrEqual(1)
      expect(q.right).toBeLessThanOrEqual(10)
    }
  })

  it('produces whole-number division answers', () => {
    for (let i = 0; i < 60; i++) {
      const q = randomQuestion('medium', 'divide')
      expect(q.left % q.right).toBe(0)
      expect(answerFor(q)).toBe(Math.round(answerFor(q)))
    }
  })
})

describe('buildRound', () => {
  it('returns the requested length', () => {
    expect(buildRound('hard', 'multiply', 10)).toHaveLength(10)
  })
})
