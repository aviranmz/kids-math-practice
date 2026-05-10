import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import type { Question } from './game'
import { answerFor, formatQuestion } from './game'

type Props = {
  question: Question
  questionNumber: number
  totalQuestions: number
  onContinue: (payload: { correct: boolean }) => void
}

export function MathQuestion({
  question,
  questionNumber,
  totalQuestions,
  onContinue,
}: Props) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const continueButtonRef = useRef<HTMLButtonElement>(null)
  const [value, setValue] = useState('')
  const [locked, setLocked] = useState(false)
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [lastCorrect, setLastCorrect] = useState(false)

  const correctAnswer = Math.round(answerFor(question))
  const isLast = questionNumber >= totalQuestions

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (locked) {
      continueButtonRef.current?.focus()
    }
  }, [locked])

  function submit() {
    if (locked) return
    const parsed = Number.parseInt(value.trim(), 10)
    if (Number.isNaN(parsed)) return

    const ok = parsed === correctAnswer
    setLocked(true)
    setLastCorrect(ok)
    setFeedback(ok ? 'correct' : 'wrong')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') submit()
  }

  function handleContinue() {
    onContinue({ correct: lastCorrect })
  }

  return (
    <div className="math-card">
      <p className="progress" aria-live="polite">
        Question {questionNumber} of {totalQuestions}
      </p>
      <h2 className="prompt" id={`${inputId}-question`} tabIndex={-1}>
        <span className="prompt-inner">{formatQuestion(question)} = ?</span>
      </h2>

      <div className="answer-row">
        <label className="sr-only" htmlFor={inputId}>
          Your answer
        </label>
        <input
          id={inputId}
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9-]*"
          autoComplete="off"
          className="answer-input"
          aria-describedby={`${inputId}-question`}
          value={value}
          disabled={locked}
          onChange={(e) => setValue(e.target.value.replace(/\s+/g, ''))}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="btn primary"
          disabled={locked || value.trim() === ''}
          onClick={submit}
        >
          Check
        </button>
      </div>

      {feedback !== 'idle' && (
        <>
          <p
            className={`feedback ${feedback}`}
            role="status"
            aria-live="polite"
          >
            {feedback === 'correct'
              ? 'Nice work!'
              : `Not quite — the answer is ${correctAnswer}.`}
          </p>
          <button
            type="button"
            className="btn wide"
            ref={continueButtonRef}
            onClick={handleContinue}
          >
            {isLast ? 'See score' : 'Next question'}
          </button>
        </>
      )}
    </div>
  )
}
