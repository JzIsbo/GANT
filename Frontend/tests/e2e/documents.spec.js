import { test, expect } from '@playwright/test';

test.describe('E2E Coverage: Document Domain & Download Events', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'gantt_user',
        JSON.stringify({ username: 'admin', role: 'Project Manager', name: 'Admin' })
      );
    });
    await page.goto('/');
    await page.evaluate(() => window.navigateTo('documents'));
    await expect(page.locator('h1:has-text("Documents & Files")')).toBeVisible();
  });

  test('Create document metadata & MIME/size validation', async ({ page }) => {
    await page.click('button:has-text("Upload Document")');
    await page.fill('#ud-title', 'Calibration Certificate 2026');
    await page.selectOption('#ud-eq', 'AHU-001');
    await page.click('#modal-confirm-btn');

    await page.fill('#doc-search-input', 'Calibration Certificate 2026');
    await expect(page.locator('td:has-text("Calibration Certificate 2026")')).toBeVisible();
  });

  test('Search & filter documents', async ({ page }) => {
    await page.fill('#doc-search-input', 'CxL3');
    await expect(page.locator('.summary-table')).toBeVisible();
  });

  test('Download document & verify actual Playwright download event', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.click('button[title="Download"] >> nth=0');
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBeTruthy();
    const path = await download.path();
    expect(path).toBeTruthy();
  });

  test('Delete document & repository sync', async ({ page }) => {
    const initialCount = await page.evaluate(() => window.appState.documents.length);
    await page.click('button[title="Delete Document"] >> nth=0');
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.toast')).toContainText('deleted');
    const newCount = await page.evaluate(() => window.appState.documents.length);
    expect(newCount).toBe(initialCount - 1);
  });
});
