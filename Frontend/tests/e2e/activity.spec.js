import { test, expect } from '@playwright/test';

test.describe('E2E Coverage: Activity Domain Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'gantt_user',
        JSON.stringify({ username: 'admin', role: 'Project Manager', name: 'Admin' })
      );
    });
    await page.goto('/');
    await page.evaluate(() => window.navigateTo('daily-activity'));
    await expect(page.locator('span:has-text("Daily Site Activity Log")').first()).toBeVisible();
  });

  test('Create valid activity', async ({ page }) => {
    await page.click('button:has-text("Add Activity")');
    await page.selectOption('#na-eq', 'AHU-001');
    await page.fill('#na-act', 'Pressure Testing Zone A');
    await page.click('#modal-confirm-btn');

    await page.fill('#act-search-input', 'Pressure Testing Zone A');
    await expect(page.locator('td:has-text("Pressure Testing Zone A")')).toBeVisible();
  });

  test('Invalid equipment reference rejection', async ({ page }) => {
    const res = await page.evaluate(() => {
      return window.createActivity({ eq: 'NON-EXISTENT-EQ-999', act: 'Orphan Action' });
    });
    expect(res.ok).toBe(false);
    expect(res.error).toContain('does not exist');
  });

  test('Edit activity', async ({ page }) => {
    await page.click('button[title="Edit Activity"] >> nth=0');
    await page.fill('#ea-act', 'Updated Activity Title');
    await page.click('#modal-confirm-btn');

    await page.fill('#act-search-input', 'Updated Activity Title');
    await expect(page.locator('td:has-text("Updated Activity Title")')).toBeVisible();
  });

  test('Status transitions & Dashboard counters sync', async ({ page }) => {
    await page.selectOption('tbody tr:first-child td select', 'Completed');
    await expect(page.locator('.toast')).toContainText('status updated');

    await page.evaluate(() => window.navigateTo('dashboard'));
    await expect(page.locator('.stat-mini-box:has-text("Completed")')).toBeVisible();
  });

  test('Delete activity & Audit Log entry creation', async ({ page }) => {
    await page.click('button[title="Delete Activity"] >> nth=0');
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.toast')).toContainText('deleted');

    await page.evaluate(() => window.navigateTo('activity-history'));
    await expect(page.locator('.activities-view')).toContainText('DELETE');
  });
});
