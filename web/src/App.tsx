import { useState } from 'react'
import './App.css'
import { MathQuestion } from './MathQuestion'
import {
  type LevelId,
  type Question,
  type QuestionOp,
  buildRound,
  loadHighScores,
  maybeUpdateHighScore,
} from './game'

type Phase = 'level' | 'operation' | 'quiz' | 'score'

const ROUND_LENGTH = 10

const LEVEL_LABEL: Record<LevelId, string> = {
  easy: 'Easy (1–10)',
  medium: 'Medium (1–25)',
  hard: 'Hard (1–100)',
}

const OP_LABEL: Record<QuestionOp | 'mix', string> = {
  add: 'Add',
  subtract: 'Subtract',
  multiply: 'Multiply',
  divide: 'Divide',
  mix: 'Mix all',
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('level')
  const [level, setLevel] = useState<LevelId>('easy')
  const [operation, setOperation] = useState<QuestionOp | 'mix'>('mix')
  const [questions, setQuestions] = useState<Question[]>([])
  const [qIndex, setQIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [lastRoundCorrect, setLastRoundCorrect] = useState(0)
  const [highBeat, setHighBeat] = useState(false)

  const highScores = loadHighScores()

  function startRound(l: LevelId, op: QuestionOp | 'mix') {
    setLevel(l)
    setOperation(op)
    setQuestions(buildRound(l, op, ROUND_LENGTH))
    setQIndex(0)
    setCorrectCount(0)
    setPhase('quiz')
  }

  function handleQuestionContinue(payload: { correct: boolean }) {
    const nextCorrect = correctCount + (payload.correct ? 1 : 0)
    if (qIndex + 1 >= ROUND_LENGTH) {
      setCorrectCount(nextCorrect)
      setLastRoundCorrect(nextCorrect)
      const beat = maybeUpdateHighScore(level, nextCorrect)
      setHighBeat(beat)
      setPhase('score')
      return
    }
    setCorrectCount(nextCorrect)
    setQIndex((i) => i + 1)
  }

  function playAgainSame() {
    startRound(level, operation)
  }

  function changeLevel() {
    setPhase('level')
  }

  return (
    <div className="app">
      <header className="top">
        <h1 className="title">Kids Math Practice</h1>
        <p className="tagline">Ten questions — pick a level and go!</p>
      </header>

      {phase === 'level' && (
        <section className="panel" aria-labelledby="level-heading">
          <h2 id="level-heading" className="panel-title">
            Choose level
          </h2>
          <div className="btn-grid">
            {(Object.keys(LEVEL_LABEL) as LevelId[]).map((id) => (
              <button
                key={id}
                type="button"
                className="btn choice"
                onClick={() => {
                  setLevel(id)
                  setPhase('operation')
                }}
              >
                {LEVEL_LABEL[id]}
              </button>
            ))}
          </div>
        </section>
      )}

      {phase === 'operation' && (
        <section className="panel" aria-labelledby="op-heading">
          <h2 id="op-heading" className="panel-title">
            What do you want to practice?
          </h2>
          <p className="muted">
            Level: <strong>{LEVEL_LABEL[level]}</strong>
          </p>
          <div className="btn-grid">
            {(Object.keys(OP_LABEL) as (QuestionOp | 'mix')[]).map((op) => (
              <button
                key={op}
                type="button"
                className="btn choice"
                onClick={() => startRound(level, op)}
              >
                {OP_LABEL[op]}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn linkish"
            onClick={() => setPhase('level')}
          >
            ← Change level
          </button>
        </section>
      )}

      {phase === 'quiz' && questions[qIndex] && (
        <section className="panel quiz-panel">
          <MathQuestion
            key={`${qIndex}-${questions[qIndex].left}-${questions[qIndex].right}-${questions[qIndex].op}`}
            question={questions[qIndex]}
            questionNumber={qIndex + 1}
            totalQuestions={ROUND_LENGTH}
            onContinue={handleQuestionContinue}
          />
          <button
            type="button"
            className="btn linkish"
            onClick={() => setPhase('operation')}
          >
            Quit round
          </button>
        </section>
      )}

      {phase === 'score' && (
        <section className="panel" aria-labelledby="score-heading">
          <h2 id="score-heading" className="panel-title">
            Round complete!
          </h2>
          <p className="score-big" aria-live="polite">
            You got <strong>{lastRoundCorrect}</strong> out of{' '}
            <strong>{ROUND_LENGTH}</strong> correct.
          </p>
          <p className="muted">
            Best for this level ({LEVEL_LABEL[level]}):{' '}
            <strong>{highScores[level]}</strong> correct in one round.
          </p>
          {highBeat && (
            <p className="celebrate" role="status">
              New high score for this level!
            </p>
          )}
          <div className="btn-stack">
            <button
              type="button"
              className="btn primary wide"
              onClick={playAgainSame}
            >
              Play again
            </button>
            <button
              type="button"
              className="btn wide"
              onClick={changeLevel}
            >
              Change level or topic
            </button>
          </div>
        </section>
      )}

      <footer className="foot muted">
        High scores stay on this device only.
      </footer>
    </div>
  )
}
