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
