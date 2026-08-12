import { test, expect } from '@playwright/test';

test.describe('E2E Coverage: Global Search Interaction & Route Redirection', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'gantt_user',
        JSON.stringify({ username: 'admin', role: 'Project Manager', name: 'Admin' })
      );
    });
    await page.goto('/');
    await expect(page.locator('#global-search-input')).toBeVisible();
  });

  test('Search Building, click result & verify route navigation', async ({ page }) => {
    await page.fill('#global-search-input', 'Building A');
    await expect(page.locator('#search-results-dropdown')).toBeVisible();
    await page.click('.search-result-item:has-text("Building A")');

    await expect(page.locator('h2:has-text("Building Management")')).toBeVisible();
  });

  test('Search Equipment, click result & verify route navigation', async ({ page }) => {
    await page.fill('#global-search-input', 'AHU-001');
    await expect(page.locator('#search-results-dropdown')).toBeVisible();
    await page.click('.search-result-item:has-text("AHU-001")');

    await expect(page.locator('.card-top-title:has-text("Equipment Master List")')).toBeVisible();
  });

  test('Search Activity, click result & verify route navigation', async ({ page }) => {
    await page.fill('#global-search-input', 'Alignment');
    await expect(page.locator('#search-results-dropdown')).toBeVisible();
    await page.click('.search-result-item >> nth=0');

    await expect(page.locator('.activities-view')).toBeVisible();
  });

  test('Search Document, click result & verify route navigation', async ({ page }) => {
    await page.fill('#global-search-input', 'Startup');
    await expect(page.locator('#search-results-dropdown')).toBeVisible();
    await page.click('.search-result-item >> nth=0');

    await expect(page.locator('h1:has-text("Documents & Files")')).toBeVisible();
  });

  test('Search User, click result & verify route navigation', async ({ page }) => {
    await page.fill('#global-search-input', 'Admin');
    await expect(page.locator('#search-results-dropdown')).toBeVisible();
    await page.click('.search-result-item:has-text("Admin")');

    await expect(page.locator('h2:has-text("System Users")')).toBeVisible();
  });
});
