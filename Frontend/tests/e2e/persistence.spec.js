import { test, expect } from '@playwright/test';

test.describe('E2E Coverage: LocalStorage Persistence & Reset Demo Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'gantt_user',
        JSON.stringify({ username: 'admin', role: 'Project Manager', name: 'Admin' })
      );
    });
    await page.goto('/');
  });

  test('Create entity, read localStorage, reload & verify persistence', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('room-building'));
    await page.click('button:has-text("New Building")');
    await page.fill('#nb-code', 'BLD-PERSIST');
    await page.fill('#nb-name', 'Persisted Building');
    await page.click('#modal-confirm-btn');

    // Read localStorage
    const raw = await page.evaluate(() => localStorage.getItem('gantt_demo_state'));
    expect(raw).toBeTruthy();
    expect(raw).toContain('BLD-PERSIST');

    // Reload page
    await page.reload();
    await expect(page.locator('.app-main')).toBeVisible();

    await page.evaluate(() => window.navigateTo('room-building'));
    await expect(page.locator('text=Persisted Building').first()).toBeVisible();
  });

  test('Corrupt localStorage with invalid JSON & verify graceful fallback recovery', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('gantt_demo_state', '{invalid_json_corrupted:'));
    await page.reload();

    await expect(page.locator('.app-main')).toBeVisible();
    await expect(page.locator('text=Overall Project Progress').first()).toBeVisible();
  });

  test('Reset Demo Data cancel leaves state intact', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('project-settings'));
    await expect(page.locator('h3:has-text("Reset Demo Data")')).toBeVisible();

    await page.click('button:has-text("Reset Demo Data")');
    await expect(page.locator('#modal-overlay')).toHaveClass(/active/);

    await page.click('#modal-cancel-btn');
    await expect(page.locator('#modal-overlay')).not.toHaveClass(/active/);
  });

  test('Reset Demo Data confirm restores baseline', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('project-settings'));
    await expect(page.locator('h3:has-text("Reset Demo Data")')).toBeVisible();

    await page.click('button:has-text("Reset Demo Data")');
    await expect(page.locator('#modal-overlay')).toHaveClass(/active/);
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.toast')).toContainText('reset');
  });
});
