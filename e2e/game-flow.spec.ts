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
