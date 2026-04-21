import { test, expect } from '../support/fixtures';

test('webapp deve estar online ', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Velô by Papito/);
});

test('CT01 - Acessar o Configurador a partir da Landing Page', async ({ page }) => {
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('hero-section')).toBeVisible();
  await page.getByTestId('hero-cta-primary').click();
  await expect(page).toHaveURL(/\/configure\/?(\?.*)?$/);
  await expect(page.getByTestId('section-cores')).toBeVisible();
});

