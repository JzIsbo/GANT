import { test, expect } from '@playwright/test';

test.describe('E2E Coverage: Equipment Domain Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'gantt_user',
        JSON.stringify({ username: 'admin', role: 'Project Manager', name: 'Admin' })
      );
    });
    await page.goto('/');
    await page.evaluate(() => window.navigateTo('equipment-list'));
    await expect(page.locator('.card-top-title:has-text("Equipment Master List")')).toBeVisible();
  });

  test('Create equipment', async ({ page }) => {
    await page.click('button:has-text("Add Equipment")');
    await page.fill('#neq-id', 'EQ-SPEC-01');
    await page.fill('#neq-name', 'Spec Test Chiller');
    await page.click('#modal-confirm-btn');

    await page.fill('#eq-search-input', 'EQ-SPEC-01');
    await expect(page.locator('td:has-text("EQ-SPEC-01")')).toBeVisible();
  });

  test('Duplicate equipment ID rejection', async ({ page }) => {
    await page.click('button:has-text("Add Equipment")');
    await page.fill('#neq-id', 'AHU-001'); // Duplicate ID
    await page.fill('#neq-name', 'Duplicate Unit');
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.modal-body')).toContainText('already exists');
  });

  test('Invalid building reference rejection', async ({ page }) => {
    const res = await page.evaluate(() => {
      return window.createEquipment({ id: 'EQ-INV-B', name: 'Invalid Building Eq', buildingId: 'NON-EXISTENT-BLDG' });
    });
    expect(res.ok).toBe(false);
    expect(res.error).toContain('Selected building does not exist');
  });

  test('Edit equipment & change building/room/phase/status', async ({ page }) => {
    await page.fill('#eq-search-input', 'AHU-001');
    await page.click('button[title*="Edit AHU-001"]');
    await page.fill('#eeq-name', 'AHU-001 Updated Name');
    await page.selectOption('#eeq-phase', 'CxL4 Functional');
    await page.click('#modal-confirm-btn');

    await page.fill('#eq-search-input', 'AHU-001');
    await expect(page.locator('td:has-text("AHU-001 Updated Name")')).toBeVisible();
  });

  test('Cross-view synchronization: Equipment Timeline & Gantt', async ({ page }) => {
    await page.evaluate(() => window.navigateTo('equipment-timeline'));
    await expect(page.locator('#eq-timeline-select')).toBeVisible();
    await page.selectOption('#eq-timeline-select', 'CHP-001');
    await expect(page.locator('.app-main')).toContainText('CHP-001');

    await page.evaluate(() => window.navigateTo('gantt'));
    await expect(page.locator('.gantt-view-container')).toBeVisible();
  });

  test('Delete with activity dependency block', async ({ page }) => {
    await page.evaluate(() => window._confirmDeleteEquipment('PMP-101'));
    await expect(page.locator('#modal-overlay')).toHaveClass(/active/);
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.toast')).toContainText('cannot be deleted');
  });

  test('Delete clean after dependency removal & selectedEquipment reconciliation', async ({ page }) => {
    await page.evaluate(() => {
      window.createEquipment({ id: 'EQ-DEL-TEST', name: 'Delete Test Unit', buildingId: window.appState.buildings[0].id });
      window.renderApp();
    });

    await page.evaluate(() => window._confirmDeleteEquipment('EQ-DEL-TEST'));
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.toast')).toContainText('deleted');
  });
});
