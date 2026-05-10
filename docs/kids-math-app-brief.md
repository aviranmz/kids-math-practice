# Kids Math Practice — project brief

A small **React 18** single-page web app that helps children **ages 7–13** practice **addition, subtraction, multiplication, and division**. No accounts, no server — everything runs in the browser.

## Goals

- Make quick math practice **fun and low-friction** (tap/click, immediate feedback).
- Support **three difficulty levels** so younger and older kids can both use the same app.
- Keep the UI **simple, readable, and kid-friendly** (large touch targets, clear labels, encouraging copy).

## Core features

| Area | Scope |
|------|--------|
| Operations | Add, subtract, multiply, divide (user picks one or “mix”). |
| Levels | **3 levels** — define clear number ranges and operation rules per level (see suggestion below). |
| Sessions | Short rounds (e.g. 10 questions) with score and optional “try again”. |
| Data | No login; optional **local-only** progress (e.g. high score / last level) via `localStorage` if you want persistence without a backend. |

### Suggested level design (tunable)

- **Level 1 (7–8):** Small numbers; addition/subtraction only; multiplication as ×2, ×5, ×10 if included.
- **Level 2 (9–10):** Larger operands; all four operations; division with **whole-number answers** only.
- **Level 3 (11–13):** Harder ranges; stricter time optional; division still safe (no awkward remainders unless you add a “remainder” mode later).

## Non-goals (v1)

- User accounts, social, leaderboards, or any backend API.
- Parent/teacher dashboards (could be a later phase).

## UX principles

- **One primary action** per screen (e.g. “Start”, “Next”, “Play again”).
- **Big numbers and buttons**; high contrast; avoid tiny text.
- **Positive feedback** on correct answers; gentle, clear hints on wrong answers (show correct answer, short encouragement).
- **No dead ends** — always an obvious way to change level or operation.

## Technical stack

- **React 18** + TypeScript (recommended), Vite or CRA-style tooling.
- **No backend** — static hosting is enough (Netlify, Vercel, S3, etc.).
- Styling: CSS modules, Tailwind, or a small component lib — keep bundle small.

## Success criteria (MVP)

- Child can pick level and operation and complete a round without help.
- Works on **phone and desktop** (responsive layout).
- No crashes; accessible basics: focus order, labels for controls, sufficient color contrast.

## Open decisions

- Timer on/off per level.
- Whether to persist anything in `localStorage`.
- Exact number ranges per level (align with school expectations if you have a target region).

---

*Document version: initial brief for scoping a small frontend-only MVP.*
