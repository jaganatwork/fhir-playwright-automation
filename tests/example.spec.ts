import { test, expect } from '@playwright/test';

test('should load Playwright website', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
});
