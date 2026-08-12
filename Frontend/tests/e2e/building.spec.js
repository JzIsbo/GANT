import { test, expect } from '@playwright/test';

test.describe('E2E Coverage: Building Domain Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'gantt_user',
        JSON.stringify({ username: 'admin', role: 'Project Manager', name: 'Admin' })
      );
    });
    await page.goto('/');
    await page.evaluate(() => window.navigateTo('room-building'));
    await expect(page.locator('h2:has-text("Building Management")')).toBeVisible();
  });

  test('Create building', async ({ page }) => {
    await page.click('button:has-text("New Building")');
    await page.fill('#nb-code', 'BLD-TEST1');
    await page.fill('#nb-name', 'Test Building Alpha');
    await page.fill('#nb-loc', 'Zone Alpha');
    await page.click('#modal-confirm-btn');

    await expect(page.locator('text=Test Building Alpha').first()).toBeVisible();
  });

  test('Duplicate building code rejection', async ({ page }) => {
    await page.click('button:has-text("New Building")');
    await page.fill('#nb-code', 'BLD-A'); // Duplicate code
    await page.fill('#nb-name', 'Building Unique Name');
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.modal-body')).toContainText('already exists');
  });

  test('Duplicate building name rejection', async ({ page }) => {
    await page.click('button:has-text("New Building")');
    await page.fill('#nb-code', 'BLD-UNIQ');
    await page.fill('#nb-name', 'Building A'); // Duplicate name
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.modal-body')).toContainText('already exists');
  });

  test('Edit building', async ({ page }) => {
    await page.click('button:has-text("Edit") >> nth=0');
    await page.fill('#eb-name', 'Building A Updated');
    await page.click('#modal-confirm-btn');

    await expect(page.locator('text=Building A Updated').first()).toBeVisible();
  });

  test('Delete building with dependency block', async ({ page }) => {
    await page.evaluate(() => window._confirmDeleteBuilding('BLDG-A'));
    await expect(page.locator('.modal-body')).toContainText('Cannot delete');
    await page.click('#modal-confirm-btn');
  });

  test('Delete building after dependencies removed', async ({ page }) => {
    await page.evaluate(() => {
      window.createBuilding({ code: 'BLD-DEL', name: 'Temporary Building', location: 'Temp' });
      window.renderApp();
    });
    await expect(page.locator('text=Temporary Building').first()).toBeVisible();

    const bldg = await page.evaluate(() => window.appState.buildings.find(b => b.code === 'BLD-DEL'));
    await page.evaluate(id => window._confirmDeleteBuilding(id), bldg.id);
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.toast')).toContainText('deleted');
  });

  test('Cross-view propagation & Global Search', async ({ page }) => {
    await page.evaluate(() => {
      window.createBuilding({ code: 'BLD-SRCH', name: 'Searchable Building Hub', location: 'Zone S' });
      window.renderApp();
    });

    await page.fill('#global-search-input', 'Searchable Building Hub');
    await expect(page.locator('#search-results-dropdown')).toBeVisible();
    await expect(page.locator('#search-results-dropdown')).toContainText('Searchable Building Hub');
  });
});
