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
