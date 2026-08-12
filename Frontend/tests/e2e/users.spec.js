import { test, expect } from '@playwright/test';

test.describe('E2E Coverage: User Management Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'gantt_user',
        JSON.stringify({ username: 'admin', role: 'Project Manager', name: 'Admin' })
      );
    });
    await page.goto('/');
    await page.evaluate(() => window.navigateTo('user-management'));
    await expect(page.locator('h2:has-text("System Users")')).toBeVisible();
  });

  test('Create user', async ({ page }) => {
    await page.click('button:has-text("Add User")');
    await page.fill('#nu-name', 'Alice QA Engineer');
    await page.fill('#nu-email', 'alice.qa@company.com');
    await page.selectOption('#nu-role', 'Engineer');
    await page.click('#modal-confirm-btn');

    await page.fill('#user-search-input', 'alice.qa@company.com');
    await expect(page.locator('td:has-text("Alice QA Engineer")')).toBeVisible();
  });

  test('Invalid email format rejection', async ({ page }) => {
    await page.click('button:has-text("Add User")');
    await page.fill('#nu-name', 'Invalid User');
    await page.fill('#nu-email', 'invalid-email-format');
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.modal-body')).toContainText('format');
  });

  test('Duplicate email rejection', async ({ page }) => {
    await page.click('button:has-text("Add User")');
    await page.fill('#nu-name', 'Duplicate User');
    await page.fill('#nu-email', 'alice.s@example.com'); // Existing user email
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.modal-body')).toContainText('already exists');
  });

  test('Edit user & role change', async ({ page }) => {
    await page.fill('#user-search-input', 'bob.j@example.com');
    await page.click('button[title="Edit user"] >> nth=0');
    await page.selectOption('#eu-role', 'Engineer');
    await page.click('#modal-confirm-btn');

    await expect(page.locator('td:has-text("Engineer")').first()).toBeVisible();
  });

  test('Active/Inactive toggle', async ({ page }) => {
    await page.fill('#user-search-input', 'bob.j@example.com');
    const u = await page.evaluate(() => window.appState.users.find(u => u.email === 'bob.j@example.com'));
    await page.evaluate(id => window.toggleUserStatus(id), u.id);

    await expect(page.locator('.toast')).toContainText('status updated');
  });

  test('Block primary administrator deletion', async ({ page }) => {
    const admin = await page.evaluate(() => window.appState.users.find(u => u.role === 'Admin'));
    await page.evaluate(id => window._confirmDeleteUser(id), admin.id);
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.toast')).toContainText('Administrator');
  });
});
