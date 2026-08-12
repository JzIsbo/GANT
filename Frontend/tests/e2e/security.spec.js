import { test, expect } from '@playwright/test';

test.describe('E2E Coverage: XSS Escaping & Dialog Safety', () => {
  let unexpectedDialog = false;

  test.beforeEach(async ({ page }) => {
    unexpectedDialog = false;
    page.on('dialog', async dialog => {
      unexpectedDialog = true;
      await dialog.dismiss();
    });

    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'gantt_user',
        JSON.stringify({ username: 'admin', role: 'Project Manager', name: 'Admin' })
      );
    });

    await page.goto('/');
  });

  test('XSS Payload <script>alert("XSS")</script> safe text escaping', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('room-building'));
    await page.click('button:has-text("New Building")');

    await page.fill('#nb-code', 'BLD-XSS1');
    await page.fill('#nb-name', '<script>alert("XSS")</script>');
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.app-main')).toContainText('BLD-XSS1');
    expect(unexpectedDialog).toBe(false);
  });

  test('XSS Payload <img src=x onerror=alert("XSS")> safe text escaping', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('room-building'));
    await page.click('button:has-text("New Building")');

    await page.fill('#nb-code', 'BLD-XSS2');
    await page.fill('#nb-name', '<img src=x onerror=alert("XSS")>');
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.app-main')).toContainText('BLD-XSS2');
    expect(unexpectedDialog).toBe(false);
  });
});
