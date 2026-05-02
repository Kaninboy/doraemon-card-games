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
