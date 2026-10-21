import { test, expect } from '@playwright/test';

test('dashboard lists the stopwatch project', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Vanilla Web Dev Lab' })).toBeVisible();
  await expect(page.getByText('Stopwatch Lap Tracker')).toBeVisible();
});

test('stopwatch page loads and has working assets', async ({ page }) => {
  const failed = [];
  page.on('response', (r) => r.status() >= 400 && failed.push(r.url()));
  await page.goto('/stopwatch-lap-tracker/');
  await expect(page).toHaveTitle(/.+/);
  expect(failed).toEqual([]);
});
