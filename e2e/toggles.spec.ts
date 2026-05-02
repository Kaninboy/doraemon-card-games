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
