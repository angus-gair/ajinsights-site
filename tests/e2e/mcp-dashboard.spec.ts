import { test, expect } from '@playwright/test';

test.describe('MCP Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the MCP dashboard before each test
    await page.goto('/mcp-test');
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should load the MCP dashboard', async ({ page }) => {
    // Check if the page has loaded correctly
    await expect(page).toHaveTitle(/MCP Test/);
    
    // Check if the dashboard tabs are visible
    const tabs = page.locator('[role="tab"]');
    await expect(tabs).toHaveCount(3);
    
    // Check if the Skills Recommendation tab is active by default
    await expect(page.locator('button[aria-selected="true"]')).toHaveText('Skills Recommendation');
  });

  test('should display trending skills', async ({ page }) => {
    // Wait for skills to load
    const skills = page.locator('.skill-item');
    await expect(skills.first()).toBeVisible({ timeout: 10000 });
    
    // Check if we have some skills displayed
    const skillCount = await skills.count();
    expect(skillCount).toBeGreaterThan(0);
    
    // Verify skill items have expected content
    for (let i = 0; i < Math.min(3, skillCount); i++) {
      const skillName = await skills.nth(i).textContent();
      expect(skillName).toBeTruthy();
    }
  });

  test('should allow selecting skills', async ({ page }) => {
    // Wait for skills to load
    const skillCheckboxes = page.locator('.skill-checkbox');
    await expect(skillCheckboxes.first()).toBeVisible({ timeout: 10000 });
    
    // Select the first skill
    const firstCheckbox = skillCheckboxes.first();
    await firstCheckbox.check();
    await expect(firstCheckbox).toBeChecked();
    
    // Verify the apply button is enabled
    const applyButton = page.locator('button:has-text("Apply Selected Skills")');
    await expect(applyButton).toBeEnabled();
  });

  test('should allow switching between tabs', async ({ page }) => {
    // Click on the Technical Context tab
    await page.click('button:has-text("Technical Context")');
    
    // Check if the tab is active
    await expect(page.locator('button[aria-selected="true"]')).toHaveText('Technical Context');
    
    // Verify content specific to Technical Context tab is visible
    await expect(page.locator('h2:has-text("Technical Enhancements")')).toBeVisible();
    
    // Click on the User Preferences tab
    await page.click('button:has-text("User Preferences")');
    
    // Check if the tab is active
    await expect(page.locator('button[aria-selected="true"]')).toHaveText('User Preferences');
    
    // Verify content specific to User Preferences tab is visible
    await expect(page.locator('h2:has-text("Your Preferences")')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock a failed API request
    await page.route('**/api/mcp/skills', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    // Reload the page to trigger the API call
    await page.reload();
    
    // Verify error message is displayed
    await expect(page.locator('text=Failed to load skills')).toBeVisible();
  });

  test('should apply selected skills', async ({ page }) => {
    // Wait for skills to load
    const skillCheckboxes = page.locator('.skill-checkbox');
    await expect(skillCheckboxes.first()).toBeVisible({ timeout: 10000 });
    
    // Select a skill
    const skillToSelect = skillCheckboxes.first();
    const skillName = await skillCheckboxes.first().locator('+ label').textContent();
    await skillToSelect.check();
    
    // Mock the API response for applying skills
    await page.route('**/api/mcp/apply-skills', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, appliedSkills: [skillName?.trim()] })
      });
    });
    
    // Click the apply button
    const applyButton = page.locator('button:has-text("Apply Selected Skills")');
    await applyButton.click();
    
    // Verify success message
    await expect(page.locator('text=Skills applied successfully')).toBeVisible();
  });
});
