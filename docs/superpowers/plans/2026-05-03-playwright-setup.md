# Playwright E2E Test Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Playwright E2E test suite covering full game flow, King special rules, language/theme toggles, and localStorage persistence — running against `npm run dev` (Vite) on Chromium only.

**Architecture:** Feature-based spec files under `e2e/`, sharing thin helper functions (no Page Object Model). Tests start with cleared `localStorage` by default; the persistence test deliberately preserves state across reload. Kings tests stub `Math.random` and inject a known deck via `localStorage` for deterministic draw order.

**Tech Stack:** `@playwright/test`, Chromium, TypeScript. Vite dev server auto-started by Playwright `webServer` config on `http://localhost:5173`.

**Spec reference:** `docs/superpowers/specs/2026-05-03-playwright-design.md`

---

## File Map

**Create:**
- `playwright.config.ts` — root config
- `e2e/helpers.ts` — `clearState`, `startGame`, `drawCards`, `injectDeck`
- `e2e/start-page.spec.ts` — landing screen tests
- `e2e/game-flow.spec.ts` — core draw / rule / reset / game-over tests
- `e2e/kings.spec.ts` — 4-King challenge tests (uses `injectDeck`)
- `e2e/toggles.spec.ts` — language + theme toggle tests
- `e2e/persistence.spec.ts` — reload state-restore test

**Modify:**
- `package.json` — add `@playwright/test` devDependency + `test:e2e` and `test:e2e:ui` scripts
- `.gitignore` — add `playwright-report/`, `test-results/`, `playwright/.cache/`

---

## App-Specific Reference Notes (used throughout the plan)

- **Dev server:** Vite default — `http://localhost:5173`
- **Default theme:** `'dark'` (set in `ThemeContext.tsx:9`); `data-theme` attribute lives on `<html>` (`document.documentElement`)
- **localStorage keys:** `doraemon-card-game-state`, `doraemon-card-game-language`, `doraemon-card-game-theme`
- **Card ID format:** `` `${rank}-${suit}` `` (e.g., `K-hearts`)
- **Start button text (EN):** `Start Game`
- **Initial draw button text (EN):** `Draw Card`
- **Subsequent draw button text (EN):** `Draw Next Card`
- **Reset button text (EN):** `Restart Game` (during game) / `Play Again` (after game over)
- **Rules button:** has visible text `Rules` (with BookOpen icon)
- **Rules modal close button:** `aria-label="Close"`
- **Rule title format:** `Card: A` for regular cards, `Card: K #1` for the 1st King, etc.
- **King rules (EN, indexed 0–3):**
  - 0: `Create the challenge: What to do?`
  - 1: `Create the challenge: When to do?`
  - 2: `Create the challenge: How to do it? / How long?`
  - 3: `Do the challenge!`
- **Game over text (EN):** `Game Over!` heading + `All cards have been drawn.`
- **Cards remaining text (EN):** `Cards remaining: 52` (decrements on each draw)
- **Draw randomness:** `drawCard` uses `Math.random()` to pick an index — for deterministic Kings tests, stub via `page.addInitScript(() => { Math.random = () => 0; })` so index 0 is always drawn

---

## Task 1: Install Playwright, add npm scripts, update gitignore

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Install Playwright as a dev dependency**

Run:
```bash
npm install --save-dev @playwright/test
```

Expected: `@playwright/test` appears under `devDependencies` in `package.json`.

- [ ] **Step 2: Install the Chromium browser binary**

Run:
```bash
npx playwright install chromium
```

Expected: Chromium downloads to `~/AppData/Local/ms-playwright/` (Windows) and command exits 0.

- [ ] **Step 3: Add `test:e2e` and `test:e2e:ui` scripts to `package.json`**

Edit `package.json`'s `"scripts"` block to look like this:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest run",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

- [ ] **Step 4: Add Playwright artifacts to `.gitignore`**

Append these lines to `.gitignore`:

```
# Playwright
playwright-report/
test-results/
playwright/.cache/
```

- [ ] **Step 5: Verify nothing broke**

Run:
```bash
npm run lint
npm test
```

Expected: both pass (existing tests still green).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: install Playwright and add E2E test scripts"
```

---

## Task 2: Create `playwright.config.ts`

**Files:**
- Create: `playwright.config.ts`

- [ ] **Step 1: Create the config file**

Create `playwright.config.ts` at the project root with this exact content:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 2: Run a smoke check (no specs yet — should report zero tests)**

Run:
```bash
npx playwright test --list
```

Expected: command exits 0 and prints `Total: 0 tests in 0 files` (or similar). It must NOT error about a missing config.

- [ ] **Step 3: Commit**

```bash
git add playwright.config.ts
git commit -m "chore: add Playwright config for Chromium against Vite dev server"
```

---

## Task 3: Create `e2e/helpers.ts`

**Files:**
- Create: `e2e/helpers.ts`

- [ ] **Step 1: Create the helpers file**

Create `e2e/helpers.ts` with this exact content:

```ts
import type { Page } from '@playwright/test';

const STATE_KEY = 'doraemon-card-game-state';
const LANG_KEY = 'doraemon-card-game-language';
const THEME_KEY = 'doraemon-card-game-theme';

/**
 * Clear all game-related localStorage keys.
 * Must be called AFTER navigating to a page (origin must exist).
 */
export async function clearState(page: Page): Promise<void> {
  await page.evaluate(
    ({ stateKey, langKey, themeKey }) => {
      localStorage.removeItem(stateKey);
      localStorage.removeItem(langKey);
      localStorage.removeItem(themeKey);
    },
    { stateKey: STATE_KEY, langKey: LANG_KEY, themeKey: THEME_KEY }
  );
}

/**
 * Navigate to start page and click "Start Game" to enter the game screen.
 */
export async function startGame(page: Page): Promise<void> {
  await page.goto('/');
  await clearState(page);
  await page.reload();
  await page.getByRole('button', { name: 'Start Game' }).click();
}

/**
 * Click the draw button N times. Uses "Draw Card" for the first click
 * and "Draw Next Card" for subsequent clicks.
 */
export async function drawCards(page: Page, count: number): Promise<void> {
  for (let i = 0; i < count; i++) {
    const buttonName = i === 0 ? 'Draw Card' : 'Draw Next Card';
    await page.getByRole('button', { name: buttonName }).click();
  }
}

/**
 * Inject a deterministic deck into localStorage and stub Math.random
 * so drawCard always picks index 0 (drawing the deck in array order).
 *
 * Call this BEFORE the first navigation. It uses addInitScript so the
 * stub is in place before any app code runs.
 */
export async function injectDeck(
  page: Page,
  deck: Array<{ suit: string; rank: string; id: string }>
): Promise<void> {
  await page.addInitScript(
    ({ stateKey, deckData }) => {
      // Make drawCard deterministic: always pick index 0 of the remaining deck.
      Math.random = () => 0;
      localStorage.setItem(
        stateKey,
        JSON.stringify({
          deck: deckData,
          currentCard: null,
          kingsDrawn: 0,
          isGameOver: false,
        })
      );
    },
    { stateKey: STATE_KEY, deckData: deck }
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit
```

Expected: no errors. (If TypeScript complains about `e2e/` files, check whether `tsconfig.app.json` or `tsconfig.json` excludes them — they should be picked up by the default config since they're `.ts` files at the project root.)

- [ ] **Step 3: Commit**

```bash
git add e2e/helpers.ts
git commit -m "test(e2e): add shared Playwright helpers"
```

---

## Task 4: `e2e/start-page.spec.ts`

**Files:**
- Create: `e2e/start-page.spec.ts`

- [ ] **Step 1: Write the spec file**

Create `e2e/start-page.spec.ts` with this exact content:

```ts
import { test, expect } from '@playwright/test';
import { clearState } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await clearState(page);
  await page.reload();
});

test('start page shows game title', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Doraemon Card Game'
  );
});

test('start page shows subtitle', async ({ page }) => {
  await expect(page.getByText('Draw a card and drink!')).toBeVisible();
});

test('clicking Start Game navigates to game screen', async ({ page }) => {
  await page.getByRole('button', { name: 'Start Game' }).click();
  // Game screen shows the initial-draw instruction
  await expect(
    page.getByText('Click the button to draw your first card!')
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Draw Card' })).toBeVisible();
});

test('rules modal opens and closes from start page', async ({ page }) => {
  await page.getByRole('button', { name: 'Rules' }).click();
  await expect(page.getByRole('heading', { name: 'Game Rules' })).toBeVisible();

  await page.getByRole('button', { name: 'Close' }).click();
  await expect(
    page.getByRole('heading', { name: 'Game Rules' })
  ).not.toBeVisible();
});
```

- [ ] **Step 2: Run the spec — all 4 tests should pass against the live app**

Run:
```bash
npx playwright test e2e/start-page.spec.ts
```

Expected: `4 passed`. If any fail, the test selector or expected text is wrong — fix the spec, not the app.

- [ ] **Step 3: Commit**

```bash
git add e2e/start-page.spec.ts
git commit -m "test(e2e): add start page tests"
```

---

## Task 5: `e2e/game-flow.spec.ts`

**Files:**
- Create: `e2e/game-flow.spec.ts`

- [ ] **Step 1: Write the spec file**

Create `e2e/game-flow.spec.ts` with this exact content:

```ts
import { test, expect } from '@playwright/test';
import { startGame, drawCards } from './helpers';

test.beforeEach(async ({ page }) => {
  await startGame(page);
});

test('drawing a card shows a rule title', async ({ page }) => {
  await drawCards(page, 1);
  // Rule title is "Card: <rank>" — match the prefix.
  await expect(
    page.getByRole('heading', { name: /^Card:/ })
  ).toBeVisible();
});

test('cards-remaining decrements after a draw', async ({ page }) => {
  await expect(page.getByText('Cards remaining: 52')).toBeVisible();
  await drawCards(page, 1);
  await expect(page.getByText('Cards remaining: 51')).toBeVisible();
});

test('drawing multiple cards changes the rule title', async ({ page }) => {
  await drawCards(page, 1);
  const firstTitle = await page
    .getByRole('heading', { name: /^Card:/ })
    .textContent();

  // Draw up to 5 more times until the title changes — guards against the rare
  // case where the same rank is drawn twice in a row (different suit, same title).
  let changed = false;
  for (let i = 0; i < 5 && !changed; i++) {
    await page.getByRole('button', { name: 'Draw Next Card' }).click();
    const next = await page
      .getByRole('heading', { name: /^Card:/ })
      .textContent();
    if (next !== firstTitle) changed = true;
  }
  expect(changed).toBe(true);
});

test('Restart Game button resets cards-remaining to 52', async ({ page }) => {
  await drawCards(page, 3);
  await expect(page.getByText('Cards remaining: 49')).toBeVisible();

  await page.getByRole('button', { name: 'Restart Game' }).click();
  await expect(page.getByText('Cards remaining: 52')).toBeVisible();
  await expect(
    page.getByText('Click the button to draw your first card!')
  ).toBeVisible();
});

test('drawing all 52 cards reaches Game Over', async ({ page }) => {
  await drawCards(page, 52);
  await expect(
    page.getByRole('heading', { name: 'Game Over!' })
  ).toBeVisible();
  await expect(page.getByText('All cards have been drawn.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Play Again' })).toBeVisible();
});
```

- [ ] **Step 2: Run the spec**

Run:
```bash
npx playwright test e2e/game-flow.spec.ts
```

Expected: `5 passed`. The 52-card draw test may take ~10–15 seconds — that's normal.

- [ ] **Step 3: Commit**

```bash
git add e2e/game-flow.spec.ts
git commit -m "test(e2e): add game-flow tests covering draw, reset, and game over"
```

---

## Task 6: `e2e/kings.spec.ts`

**Files:**
- Create: `e2e/kings.spec.ts`

- [ ] **Step 1: Write the spec file**

Create `e2e/kings.spec.ts` with this exact content:

```ts
import { test, expect } from '@playwright/test';
import { injectDeck } from './helpers';

const FOUR_KINGS_DECK = [
  { suit: 'hearts', rank: 'K', id: 'K-hearts' },
  { suit: 'diamonds', rank: 'K', id: 'K-diamonds' },
  { suit: 'clubs', rank: 'K', id: 'K-clubs' },
  { suit: 'spades', rank: 'K', id: 'K-spades' },
  // Filler cards so isGameOver does not flip mid-test if anyone re-runs setup.
  { suit: 'hearts', rank: 'A', id: 'A-hearts' },
  { suit: 'diamonds', rank: '2', id: '2-diamonds' },
];

const KING_RULES = [
  'Create the challenge: What to do?',
  'Create the challenge: When to do?',
  'Create the challenge: How to do it? / How long?',
  'Do the challenge!',
];

test('the 4 Kings show the correct rule text in draw order', async ({
  page,
}) => {
  await injectDeck(page, FOUR_KINGS_DECK);
  await page.goto('/');
  await page.getByRole('button', { name: 'Start Game' }).click();

  // 1st King
  await page.getByRole('button', { name: 'Draw Card' }).click();
  await expect(
    page.getByRole('heading', { name: 'Card: K #1' })
  ).toBeVisible();
  await expect(page.getByText(KING_RULES[0])).toBeVisible();

  // 2nd King
  await page.getByRole('button', { name: 'Draw Next Card' }).click();
  await expect(
    page.getByRole('heading', { name: 'Card: K #2' })
  ).toBeVisible();
  await expect(page.getByText(KING_RULES[1])).toBeVisible();

  // 3rd King
  await page.getByRole('button', { name: 'Draw Next Card' }).click();
  await expect(
    page.getByRole('heading', { name: 'Card: K #3' })
  ).toBeVisible();
  await expect(page.getByText(KING_RULES[2])).toBeVisible();

  // 4th King
  await page.getByRole('button', { name: 'Draw Next Card' }).click();
  await expect(
    page.getByRole('heading', { name: 'Card: K #4' })
  ).toBeVisible();
  await expect(page.getByText(KING_RULES[3])).toBeVisible();
});
```

- [ ] **Step 2: Run the spec**

Run:
```bash
npx playwright test e2e/kings.spec.ts
```

Expected: `1 passed`. If it fails, the most likely cause is that `addInitScript` is firing too late or the localStorage state is being wiped — check by adding a `console.log(localStorage.getItem('doraemon-card-game-state'))` inside `page.evaluate` after navigation.

- [ ] **Step 3: Commit**

```bash
git add e2e/kings.spec.ts
git commit -m "test(e2e): add 4-King challenge sequence test with deterministic deck"
```

---

## Task 7: `e2e/toggles.spec.ts`

**Files:**
- Create: `e2e/toggles.spec.ts`

- [ ] **Step 1: Write the spec file**

Create `e2e/toggles.spec.ts` with this exact content:

```ts
import { test, expect } from '@playwright/test';
import { clearState } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await clearState(page);
  await page.reload();
});

test('language toggle switches Start button text EN ↔ TH', async ({ page }) => {
  // Default language is 'en'.
  await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible();

  // Toggle button shows "TH" when current language is en.
  await page.getByRole('button', { name: 'Switch to Thai' }).click();

  // After toggle, language is 'th' — Start button text becomes Thai.
  await expect(page.getByRole('button', { name: 'เริ่มเกม' })).toBeVisible();

  // Toggle back.
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible();
});

test('theme toggle flips data-theme on <html>', async ({ page }) => {
  const html = page.locator('html');

  // Default theme is 'dark' (per ThemeContext).
  await expect(html).toHaveAttribute('data-theme', 'dark');

  // Toggle button label is "Switch to light mode" when current theme is dark.
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await expect(html).toHaveAttribute('data-theme', 'light');

  // Toggle back.
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
});
```

- [ ] **Step 2: Run the spec**

Run:
```bash
npx playwright test e2e/toggles.spec.ts
```

Expected: `2 passed`.

- [ ] **Step 3: Commit**

```bash
git add e2e/toggles.spec.ts
git commit -m "test(e2e): add language and theme toggle tests"
```

---

## Task 8: `e2e/persistence.spec.ts`

**Files:**
- Create: `e2e/persistence.spec.ts`

- [ ] **Step 1: Write the spec file**

Create `e2e/persistence.spec.ts` with this exact content:

```ts
import { test, expect } from '@playwright/test';
import { startGame, drawCards } from './helpers';

test('mid-game reload restores remaining-card count and current rule', async ({
  page,
}) => {
  await startGame(page);

  await drawCards(page, 3);
  await expect(page.getByText('Cards remaining: 49')).toBeVisible();

  const ruleTitleBefore = await page
    .getByRole('heading', { name: /^Card:/ })
    .textContent();
  expect(ruleTitleBefore).toBeTruthy();

  // Reload the page. App.tsx always boots on the 'start' page, so we must
  // click Start Game again — but localStorage holds the saved game state,
  // which GamePage reads on mount via loadGameState().
  await page.reload();
  await page.getByRole('button', { name: 'Start Game' }).click();

  await expect(page.getByText('Cards remaining: 49')).toBeVisible();

  const ruleTitleAfter = await page
    .getByRole('heading', { name: /^Card:/ })
    .textContent();
  expect(ruleTitleAfter).toBe(ruleTitleBefore);
});
```

- [ ] **Step 2: Run the spec**

Run:
```bash
npx playwright test e2e/persistence.spec.ts
```

Expected: `1 passed`.

- [ ] **Step 3: Commit**

```bash
git add e2e/persistence.spec.ts
git commit -m "test(e2e): add mid-game reload persistence test"
```

---

## Task 9: Run the full E2E suite and verify

**Files:**
- (No file changes — verification only.)

- [ ] **Step 1: Run the entire E2E test suite**

Run:
```bash
npm run test:e2e
```

Expected: `13 passed` (4 + 5 + 1 + 2 + 1 = 13 tests across 5 files). Test runtime should be roughly 30–60 seconds total on a modern machine.

- [ ] **Step 2: Open the HTML report and visually confirm**

Run:
```bash
npx playwright show-report
```

Expected: a browser tab opens showing all 13 tests green. Close the report when done.

- [ ] **Step 3: Confirm the existing Vitest unit tests still pass**

Run:
```bash
npm test
```

Expected: existing Vitest suite still green (e.g., `LanguageToggle.test.tsx` tests).

- [ ] **Step 4: Confirm lint passes**

Run:
```bash
npm run lint
```

Expected: no lint errors. If ESLint reports issues in `e2e/`, the most likely fix is to add `e2e` to the ESLint ignore list or extend the existing config — but try a clean run first.

- [ ] **Step 5: No commit needed for verification.** If anything failed, fix it in the relevant task's spec file and re-run.

---

## Notes on TDD Pattern for E2E Tests

The app under test is **already implemented** — these Playwright tests are characterization / regression tests, not driver tests for new features. The TDD cycle here is:

1. Write the test based on the design spec.
2. Run it against the live dev server.
3. If it fails: 99% of the time the **test selector or expected text is wrong** (not the app). Fix the test.
4. If a real bug is uncovered, stop and surface it to the user — do not edit `src/` to make a Playwright test pass without explicit approval.

## Out of Scope (deferred per spec)

- Firefox / WebKit
- Visual regression / screenshot diffing
- Mobile viewport
- a11y audits
- CI integration
