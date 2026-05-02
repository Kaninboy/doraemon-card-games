# Playwright E2E Test Setup — Design Spec

**Date:** 2026-05-03
**Branch:** v1.3-playwright-test
**Status:** Approved

---

## Overview

Add Playwright for end-to-end UI testing of the Doraemon card game. The goal is full game flow coverage: core draw/rules cycle, King special rules (4-step), EN/TH language toggle, light/dark theme toggle, and localStorage persistence across reload.

Existing Vitest + @testing-library/react unit tests are unchanged — Playwright covers the browser-level integration layer they cannot reach.

---

## Setup & Configuration

### Installation

- Add `@playwright/test` as a dev dependency
- Run `npx playwright install chromium` to download the browser binary

### `playwright.config.ts` (project root)

- `testDir: './e2e'`
- Single browser project: **Chromium only**
- `webServer`: auto-starts `npm run dev`, waits for `http://localhost:5173` before running tests
- `baseURL: 'http://localhost:5173'`
- No global `storageState` — each test clears localStorage in a `beforeEach` via `page.evaluate(() => localStorage.clear())`

### npm scripts (added to `package.json`)

```
"test:e2e":    "playwright test"
"test:e2e:ui": "playwright test --ui"
```

### Output

- `playwright-report/` — default HTML report (gitignored)
- `test-results/` — artifacts on failure (gitignored)

---

## Test Files & Coverage

All test files live in `e2e/`.

### `e2e/start-page.spec.ts`

| Test | What it verifies |
|------|-----------------|
| Page title visible | Doraemon branding text appears on screen |
| Start button navigates | Clicking "Start Game" transitions to the game screen |
| Rules modal opens | Clicking the rules button opens the modal |
| Rules modal closes | Clicking close/outside dismisses the modal |

### `e2e/game-flow.spec.ts`

| Test | What it verifies |
|------|-----------------|
| Draw card shows card | Suit and rank are visible after drawing |
| Rule text displayed | The card rule text appears after drawing |
| Multiple draws differ | Drawing repeatedly cycles through different cards |
| Reset returns to start | New Game / reset button resets state |
| Deck exhaustion | Drawing all 52 cards reaches the game-over state |

### `e2e/kings.spec.ts`

| Test | What it verifies |
|------|-----------------|
| 1st King rule | 1st King drawn shows the correct 1st-King rule text |
| 2nd King rule | 2nd King drawn shows the correct 2nd-King rule text |
| 3rd King rule | 3rd King drawn shows the correct 3rd-King rule text |
| 4th King rule | 4th King drawn shows the correct 4th-King rule text |

> Kings are drawn by clicking "Draw" repeatedly until a King appears. Tests may need to force-draw Kings by injecting a known deck order via `page.evaluate` on `localStorage` game state, to avoid flakiness from random draw order.

### `e2e/toggles.spec.ts`

| Test | What it verifies |
|------|-----------------|
| EN → TH language | After toggle, a known TH string appears on screen |
| TH → EN language | Toggling back restores the EN string |
| Light → Dark theme | `data-theme` attribute changes to `"dark"` after toggle |
| Dark → Light theme | `data-theme` attribute changes to `"light"` after toggle |

### `e2e/persistence.spec.ts`

| Test | What it verifies |
|------|-----------------|
| Game state survives reload | Draw 3 cards, reload page, verify the remaining deck count and last drawn card's suit/rank are still displayed |

---

## Shared Helpers (`e2e/helpers.ts`)

Three thin utilities shared across spec files:

```ts
clearState(page)      // localStorage.clear() via page.evaluate
startGame(page)       // goto('/') + click Start Game button
drawCards(page, n)    // click Draw button n times
```

**No Page Object Model** — helpers are plain functions, not classes. Sufficient for this app's complexity.

---

## Selector Strategy

Use Playwright's semantic locators throughout:

- `page.getByRole('button', { name: /start/i })` — preferred
- `page.getByText(...)` — for verifying visible text
- `page.locator('[data-theme]')` — for theme attribute checks

Avoid CSS class selectors (`.card-display`, `.game-page`) — they can change freely without breaking game logic.

---

## State Management in Tests

- **Default:** `beforeEach` clears `localStorage` via `page.evaluate(() => localStorage.clear())`
- **Kings tests:** Inject a known shuffled deck into `localStorage` game state so Kings appear at predictable draw positions — avoids random-order flakiness
- **Persistence test:** Explicitly does NOT clear state between the draw phase and the reload

---

## Out of Scope

- Firefox and WebKit (Chromium only)
- Visual regression / screenshot diffing
- Mobile viewport testing
- Accessibility (a11y) testing
- CI pipeline integration (can be added later)
