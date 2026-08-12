import { test, expect } from '@playwright/test';

test.describe('E2E Coverage: Room Domain Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'gantt_user',
        JSON.stringify({ username: 'admin', role: 'Project Manager', name: 'Admin' })
      );
    });
    await page.goto('/');
    await page.evaluate(() => window.navigateTo('room-building'));
    await expect(page.locator('h2:has-text("Room Directory")')).toBeVisible();
  });

  test('Create room', async ({ page }) => {
    await page.click('button:has-text("Add Room")');
    await page.fill('#nr-no', '999');
    await page.selectOption('#nr-bldg', { label: 'Building A' });
    await page.fill('#nr-floor', '9');
    await page.fill('#nr-area', '150');
    await page.click('#modal-confirm-btn');

    await page.fill('#room-search-input', '999');
    await expect(page.locator('td:has-text("Rm 999")')).toBeVisible();
  });

  test('Invalid building reference rejection', async ({ page }) => {
    const res = await page.evaluate(() => {
      return window.createRoom({ roomNo: '888', buildingId: 'NON-EXISTENT-ID', floor: '1', area: '50' });
    });
    expect(res.ok).toBe(false);
    expect(res.error).toContain('Selected building does not exist');
  });

  test('Duplicate room number in same building rejection', async ({ page }) => {
    await page.click('button:has-text("Add Room")');
    await page.fill('#nr-no', '101');
    await page.selectOption('#nr-bldg', { label: 'Building A' }); // Rm 101 already exists in Building A
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.modal-body')).toContainText('already exists');
  });

  test('Edit room', async ({ page }) => {
    await page.fill('#room-search-input', '101');
    await page.click('button[onclick*="_openEditRoomModal"] >> nth=0');
    await page.fill('#er-area', '175');
    await page.click('#modal-confirm-btn');

    await expect(page.locator('td:has-text("175")')).toBeVisible();
  });

  test('Delete room with equipment dependency block', async ({ page }) => {
    await page.evaluate(() => {
      const bldg = window.appState.buildings[0];
      window.createRoom({ roomNo: '901', buildingId: bldg.id, floor: '9', area: '100' });
      window.createEquipment({ id: 'EQ-RM-DEP', name: 'Room Dep Unit', buildingId: bldg.id, room: '901' });
      window.renderApp();
    });

    const rm = await page.evaluate(() => window.appState.rooms.find(r => r.roomNo === '901'));
    await page.evaluate(id => window._confirmDeleteRoom(id), rm.id);
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.toast')).toContainText('cannot be deleted');
  });

  test('Delete room clean after dependency removal', async ({ page }) => {
    await page.evaluate(() => {
      const bldg = window.appState.buildings[0];
      window.createRoom({ roomNo: '902', buildingId: bldg.id, floor: '9', area: '100' });
      window.renderApp();
    });

    const rm = await page.evaluate(() => window.appState.rooms.find(r => r.roomNo === '902'));
    await page.evaluate(id => window._confirmDeleteRoom(id), rm.id);
    await page.click('#modal-confirm-btn');

    await expect(page.locator('.toast')).toContainText('deleted');
  });
});
