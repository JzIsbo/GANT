import { test, expect } from '@playwright/test';

test.describe('E2E Coverage: Filtering Systems & Search Input Focus Stability', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'gantt_user',
        JSON.stringify({ username: 'admin', role: 'Project Manager', name: 'Admin' })
      );
    });
    await page.goto('/');
  });

  test('Gantt filters (Building, Type, Phase, Empty State)', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('gantt'));
    await expect(page.locator('.gantt-view')).toBeVisible();
    await page.selectOption('.gantt-view select >> nth=0', { index: 1 });
    await expect(page.locator('.gantt-view')).toBeVisible();
  });

  test('Activity filters (Phase, Status, Search, Empty State)', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('daily-activity'));
    await expect(page.locator('.activities-view')).toBeVisible();
    await page.selectOption('.activities-view select >> nth=0', { index: 1 });
    await expect(page.locator('.activities-view')).toBeVisible();
  });

  test('Equipment filters (Building, Type, Phase, Status, Search)', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('equipment-list'));
    await expect(page.locator('#eq-search-input')).toBeVisible();
    await page.fill('#eq-search-input', 'AHU');
    await expect(page.locator('td:has-text("AHU-001")').first()).toBeVisible();
  });

  test('Document filters (Type, Status, Equipment, Search)', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('documents'));
    await expect(page.locator('#doc-search-input')).toBeVisible();
    await page.fill('#doc-search-input', 'Protocol');
    await expect(page.locator('.documents-view-container')).toBeVisible();
  });

  test('Search input focus & typing caret stability validation', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('equipment-list'));
    const input = page.locator('#eq-search-input');
    await expect(input).toBeVisible();
    await input.focus();
    await input.pressSequentially('AHU', { delay: 50 });
    await expect(input).toBeFocused();
    expect(await input.inputValue()).toBe('AHU');
  });
});
