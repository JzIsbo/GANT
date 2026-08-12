import { test, expect } from '@playwright/test';

test.describe('E2E Coverage: Report & Gantt CSV Export Download Events', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'gantt_user',
        JSON.stringify({ username: 'admin', role: 'Project Manager', name: 'Admin' })
      );
    });
    await page.goto('/');
  });

  test('Export Report CSV download event', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('export-report'));
    await expect(page.locator('h2:has-text("Export Reports Data")')).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Generate Export")');
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toContain('.csv');
    const path = await download.path();
    expect(path).toBeTruthy();
  });

  test('Gantt CSV export download event', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('gantt'));
    await expect(page.locator('.gantt-view-container')).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.evaluate(() => window._ganttExportCsv());
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toContain('.csv');
  });

  test('Duration Analysis CSV export download event', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('duration-analysis'));
    await expect(page.locator('.card-top-title:has-text("Duration Analysis")')).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.evaluate(() => window._exportDurationCsv());
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toContain('.csv');
  });
});
