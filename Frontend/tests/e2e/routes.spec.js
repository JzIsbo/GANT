import { test, expect } from '@playwright/test';

test.describe('E2E Coverage: Route Navigation & Render Audits', () => {
  const routes = [
    'dashboard',
    'daily-activity',
    'weekly-activity',
    'activity-progress',
    'activity-status',
    'activity-history',
    'gantt',
    'equipment-timeline',
    'phase-progress',
    'duration-analysis',
    'equipment-list',
    'room-building',
    'user-management',
    'documents',
    'nas-files',
    'shared-files',
    'import-documents',
    'weekly-report',
    'monthly-report',
    'export-report',
    'project-settings',
    'account-settings'
  ];

  test.beforeEach(async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));

    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'gantt_user',
        JSON.stringify({ username: 'admin', role: 'Project Manager', name: 'Admin' })
      );
    });

    await page.goto('/');
    await expect(page.locator('.app-main')).toBeVisible();
    page.pageErrors = pageErrors;
  });

  for (const route of routes) {
    test(`Navigate to route: ${route}`, async ({ page }) => {
      await page.evaluate(r => window.navigateTo(r), route);
      await expect(page.locator('.app-main')).toBeVisible();
      await expect(page.locator('.app-main')).not.toBeEmpty();
      expect(page.pageErrors).toEqual([]);
    });
  }
});
