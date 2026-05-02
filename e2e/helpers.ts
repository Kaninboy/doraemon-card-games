import type { Page } from '@playwright/test';

const STATE_KEY = 'doraemon-card-game-state';

/**
 * Clear all localStorage for the page's origin.
 * Must be called AFTER navigating to a page (origin must exist).
 */
export async function clearState(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear());
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
 * Click the draw button N times. The button label is "Draw Card" before any
 * card has been drawn and "Draw Next Card" after — the regex matches both
 * so this helper works regardless of starting state.
 */
export async function drawCards(page: Page, count: number): Promise<void> {
  for (let i = 0; i < count; i++) {
    await page.getByRole('button', { name: /^Draw (Next )?Card$/ }).click();
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
