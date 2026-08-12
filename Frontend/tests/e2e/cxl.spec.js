import { test, expect } from '@playwright/test';

test.describe('E2E Coverage: Commissioning (CxL) Phase Gate & Checklist Sign-Off', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'gantt_user',
        JSON.stringify({ username: 'admin', role: 'Project Manager', name: 'Admin' })
      );
    });
    await page.goto('/');
    await page.evaluate(() => window.navigateTo('phase-progress'));
    await expect(page.locator('.cxl-view')).toBeVisible();
  });

  test('Select phase gate & toggle checklist item', async ({ page }) => {
    await page.evaluate(() => window.selectCxlPhase('CxL3'));
    await expect(page.locator('.cxl-view')).toContainText('CxL3');

    await page.click('div[onclick*="toggleChecklist"] >> nth=0');
    const checked = await page.evaluate(() => {
      return window.appState.checklistState && window.appState.checklistState.CxL3;
    });
    expect(checked).toBeDefined();
  });

  test('Attempt gate approval with incomplete checklist (verify blocked)', async ({ page }) => {
    await page.evaluate(() => {
      window.appState.selectedCxlPhase = 'CxL1';
      window.appState.checklistState.CxL1 = { 'REQ-101': false };
      window.renderApp();
    });

    await page.evaluate(() => window.approvePhaseGate('CxL1'));
    await expect(page.locator('.toast')).toContainText('checklist requirement(s) not yet completed');
  });

  test('Attempt gate approval with unmet prerequisite phase (verify blocked)', async ({ page }) => {
    await page.evaluate(() => {
      window.appState.selectedCxlPhase = 'CxL2';
      window.appState.checklistState.CxL2 = { 'REQ-201': true, 'REQ-202': true, 'REQ-203': true, 'REQ-204': true, 'REQ-205': true, 'REQ-206': true };
      window.appState.phaseApprovalState.CxL1 = { status: 'Pending' };
      window.renderApp();
    });

    await page.evaluate(() => window.approvePhaseGate('CxL2'));
    await expect(page.locator('.toast')).toContainText('Prerequisite phase CxL1 must be fully approved first');
  });

  test('Complete checklist & approve phase gate sign-off', async ({ page }) => {
    await page.evaluate(() => {
      window.appState.selectedCxlPhase = 'CxL1';
      const defs = window.CXL_CHECKLISTS['CxL1'] || [];
      window.appState.checklistState['CxL1'] = {};
      defs.forEach(d => { window.appState.checklistState['CxL1'][d.id] = true; });
      window.renderApp();
    });

    await page.evaluate(() => window.approvePhaseGate('CxL1'));
    await expect(page.locator('.toast')).toContainText('Approved successfully');
  });
});
