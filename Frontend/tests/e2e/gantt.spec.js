import { test, expect } from '@playwright/test';

test.describe('GANT Frontend Production-Like E2E Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'gantt_user',
        JSON.stringify({ username: 'admin', role: 'Project Manager', name: 'Admin' })
      );
    });
    await page.goto('/');
    await expect(page.locator('.app-main')).toBeVisible();
  });

  test('E2E-01: Dashboard rendering & baseline KPIs', async ({ page }) => {
    await expect(page.locator('.app-header')).toBeVisible();
    await expect(page.locator('text=Overall Project Progress').first()).toBeVisible();
    await expect(page.locator('text=58%').first()).toBeVisible();
    await expect(page.locator('text=Equipment Summary').first()).toBeVisible();
    await expect(page.locator('text=333').first()).toBeVisible();
  });

  test('E2E-02..05: Building CRUD lifecycle', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('room-building'));
    await expect(page.locator('h2:has-text("Building Management")')).toBeVisible();

    await page.click('button:has-text("New Building")');
    await page.fill('#nb-code', 'BLD-E2E');
    await page.fill('#nb-name', 'E2E Test Building');
    await page.fill('#nb-loc', 'Zone E2E - Testing Suite');
    await page.click('#modal-confirm-btn');

    await expect(page.locator('text=E2E Test Building').first()).toBeVisible();

    await page.fill('#global-search-input', 'E2E Test Building');
    await expect(page.locator('#search-results-dropdown')).toBeVisible();
    await expect(page.locator('#search-results-dropdown')).toContainText('E2E Test Building');
  });

  test('E2E-11..14: Equipment CRUD & context sync', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('equipment-list'));
    await expect(page.locator('.card-top-title:has-text("Equipment Master List")')).toBeVisible();

    await page.click('button:has-text("Add Equipment")');
    await page.fill('#neq-id', 'EQ-E2E-99');
    await page.fill('#neq-name', 'E2E Test Air Handler');
    await page.click('#modal-confirm-btn');

    await expect(page.locator('td:has-text("EQ-E2E-99")')).toBeVisible();

    await page.evaluate(() => window.navigateTo('equipment-timeline'));
    await page.selectOption('#eq-timeline-select', 'EQ-E2E-99');
    await expect(page.locator('.app-main')).toContainText('EQ-E2E-99');
  });

  test('E2E-15..17: Activity CRUD & Dashboard metric update', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('daily-activity'));
    await expect(page.locator('span:has-text("Daily Site Activity Log")').first()).toBeVisible();

    await page.click('button:has-text("Add Activity")');
    await page.selectOption('#na-eq', 'AHU-001');
    await page.fill('#na-act', 'E2E Filter Testing Action');
    await page.click('#modal-confirm-btn');

    await page.fill('#act-search-input', 'E2E Filter Testing Action');
    await expect(page.locator('td:has-text("E2E Filter Testing Action")')).toBeVisible();
  });

  test('E2E-30..33: CxL Phase progress & gate sign-off workflow', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('phase-progress'));
    await expect(page.locator('.cxl-view')).toBeVisible();

    await page.click('span.view-tab:has-text("Phase Gate Detail")');
    await expect(page.locator('.cxl-view')).toContainText('Phase Gate');
  });

  test('E2E-34..36: LocalStorage persistence & Reset Demo Data', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('project-settings'));
    await expect(page.locator('h3:has-text("Reset Demo Data")')).toBeVisible();

    await page.click('button:has-text("Reset Demo Data")');
    await expect(page.locator('.modal-overlay')).toBeVisible();
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.toast')).toContainText('Demo data has been reset');
  });

  test('E2E Security: XSS input escaping test', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('room-building'));
    await page.click('button:has-text("New Building")');

    const xssStr = '<script>alert("XSS")</script>';
    await page.fill('#nb-code', 'BLD-XSS');
    await page.fill('#nb-name', xssStr);
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.app-main')).toContainText('BLD-XSS');
  });

  test('Theme Toggle: Landing welcome page dark/light mode toggle', async ({ page }) => {
    await page.evaluate(() => {
      sessionStorage.removeItem('gantt_user');
      window.handleLogout();
      window.handleShowLanding();
    });
    await expect(page.locator('.landing-root')).toBeVisible();

    const landingToggleBtn = page.locator('.landing-theme-toggle-btn');
    await expect(landingToggleBtn).toBeVisible();

    const isDarkBefore = await page.evaluate(() => document.body.classList.contains('dark-mode'));
    await landingToggleBtn.click();
    const isDarkAfter = await page.evaluate(() => document.body.classList.contains('dark-mode'));
    expect(isDarkBefore).not.toEqual(isDarkAfter);
  });

  test('Theme Toggle: Login page card pill & floating theme toggles', async ({ page }) => {
    await page.evaluate(() => window.handleLogout());
    await expect(page.locator('#login-root')).toBeVisible();

    const pillBtn = page.locator('#login-theme-pill-btn');
    await expect(pillBtn).toBeVisible();

    const hasDarkModeBefore = await page.evaluate(() => document.body.classList.contains('dark-mode'));
    await pillBtn.click();
    const hasDarkModeAfter = await page.evaluate(() => document.body.classList.contains('dark-mode'));
    expect(hasDarkModeBefore).not.toEqual(hasDarkModeAfter);
  });

  test('Theme Toggle: Welcome page dark/light mode toggle', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('welcome'));
    await expect(page.locator('.welcome-container')).toBeVisible();

    const isDarkBefore = await page.evaluate(() => document.body.classList.contains('dark-mode'));
    await page.click('.welcome-container button:has-text("Light Mode"), .welcome-container button:has-text("Dark Mode")');

    const isDarkAfter = await page.evaluate(() => document.body.classList.contains('dark-mode'));
    expect(isDarkBefore).not.toEqual(isDarkAfter);
  });
});
