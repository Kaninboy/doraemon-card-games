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
