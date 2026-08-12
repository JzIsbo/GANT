import { test, expect } from '@playwright/test';

test.describe('E2E Coverage: Shared Links Domain Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'gantt_user',
        JSON.stringify({ username: 'admin', role: 'Project Manager', name: 'Admin' })
      );
    });
    await page.goto('/');
    await page.evaluate(() => window.navigateTo('shared-files'));
    await expect(page.locator('h3:has-text("Active Shared Links")')).toBeVisible();
  });

  test('Create shared link', async ({ page }) => {
    await page.evaluate(() => {
      if (!window.appState.sharedLinks) window.appState.sharedLinks = [];
      window.appState.sharedLinks.push({
        id: 'SHL-TEST99',
        name: 'E2E_Test_Share_Doc.pdf',
        sharedBy: 'Admin',
        sharedWith: 'auditor@company.com',
        date: '2026-08-11',
        expiry: 'Never'
      });
      window.renderApp();
    });

    await expect(page.locator('td:has-text("E2E_Test_Share_Doc.pdf")')).toBeVisible();
  });

  test('Copy shared link feedback', async ({ page }) => {
    await page.click('button[title="Copy Link"] >> nth=0');
    await expect(page.locator('.toast')).toBeVisible();
  });

  test('Revoke shared link & verify disappearance', async ({ page }) => {
    const initialCount = await page.evaluate(() => (window.appState.sharedLinks || []).length);
    await page.click('button[title="Revoke Access"] >> nth=0');
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.toast')).toContainText('revoked');
    const newCount = await page.evaluate(() => (window.appState.sharedLinks || []).length);
    expect(newCount).toBe(initialCount - 1);
  });
});
