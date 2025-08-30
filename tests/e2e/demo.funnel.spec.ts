import { test, expect } from '@playwright/test';

test('demo funnel happy path', async ({ page }) => {
  await page.goto('/playground2');
  await expect(page.getByText('Redaction Playground')).toBeVisible();

  await page.goto('/pricing');
  await expect(page.getByRole('heading', { name: 'Pricing' })).toBeVisible();

  await page.goto('/roi-export');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /download pdf/i }).click(),
  ]);
  await download.delete();

  await page.goto('/leads');
  await page.getByPlaceholder('Work email').fill('test@example.com');
  await page.getByPlaceholder('Company').fill('ACME');
  await page.getByPlaceholder('Company size').fill('10');
  await page.getByPlaceholder('Industry vertical').fill('tech');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Thanks!')).toBeVisible();
});
