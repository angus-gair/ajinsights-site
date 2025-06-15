# Test info

- Name: MCP Dashboard >> should handle API errors gracefully
- Location: /mnt/c/dev/v0-resume-creation-framework/tests/e2e/mcp-dashboard.spec.ts:74:7

# Error details

```
Error: browserType.launch: Executable doesn't exist at /home/gair_/.cache/ms-playwright/firefox-1482/firefox/firefox
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║     npx playwright install                                              ║
║                                                                         ║
║ <3 Playwright Team                                                      ║
╚═════════════════════════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('MCP Dashboard', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Navigate to the MCP dashboard before each test
   6 |     await page.goto('/mcp-test');
   7 |     // Wait for the page to load completely
   8 |     await page.waitForLoadState('networkidle');
   9 |   });
   10 |
   11 |   test('should load the MCP dashboard', async ({ page }) => {
   12 |     // Check if the page has loaded correctly
   13 |     await expect(page).toHaveTitle(/MCP Test/);
   14 |     
   15 |     // Check if the dashboard tabs are visible
   16 |     const tabs = page.locator('[role="tab"]');
   17 |     await expect(tabs).toHaveCount(3);
   18 |     
   19 |     // Check if the Skills Recommendation tab is active by default
   20 |     await expect(page.locator('button[aria-selected="true"]')).toHaveText('Skills Recommendation');
   21 |   });
   22 |
   23 |   test('should display trending skills', async ({ page }) => {
   24 |     // Wait for skills to load
   25 |     const skills = page.locator('.skill-item');
   26 |     await expect(skills.first()).toBeVisible({ timeout: 10000 });
   27 |     
   28 |     // Check if we have some skills displayed
   29 |     const skillCount = await skills.count();
   30 |     expect(skillCount).toBeGreaterThan(0);
   31 |     
   32 |     // Verify skill items have expected content
   33 |     for (let i = 0; i < Math.min(3, skillCount); i++) {
   34 |       const skillName = await skills.nth(i).textContent();
   35 |       expect(skillName).toBeTruthy();
   36 |     }
   37 |   });
   38 |
   39 |   test('should allow selecting skills', async ({ page }) => {
   40 |     // Wait for skills to load
   41 |     const skillCheckboxes = page.locator('.skill-checkbox');
   42 |     await expect(skillCheckboxes.first()).toBeVisible({ timeout: 10000 });
   43 |     
   44 |     // Select the first skill
   45 |     const firstCheckbox = skillCheckboxes.first();
   46 |     await firstCheckbox.check();
   47 |     await expect(firstCheckbox).toBeChecked();
   48 |     
   49 |     // Verify the apply button is enabled
   50 |     const applyButton = page.locator('button:has-text("Apply Selected Skills")');
   51 |     await expect(applyButton).toBeEnabled();
   52 |   });
   53 |
   54 |   test('should allow switching between tabs', async ({ page }) => {
   55 |     // Click on the Technical Context tab
   56 |     await page.click('button:has-text("Technical Context")');
   57 |     
   58 |     // Check if the tab is active
   59 |     await expect(page.locator('button[aria-selected="true"]')).toHaveText('Technical Context');
   60 |     
   61 |     // Verify content specific to Technical Context tab is visible
   62 |     await expect(page.locator('h2:has-text("Technical Enhancements")')).toBeVisible();
   63 |     
   64 |     // Click on the User Preferences tab
   65 |     await page.click('button:has-text("User Preferences")');
   66 |     
   67 |     // Check if the tab is active
   68 |     await expect(page.locator('button[aria-selected="true"]')).toHaveText('User Preferences');
   69 |     
   70 |     // Verify content specific to User Preferences tab is visible
   71 |     await expect(page.locator('h2:has-text("Your Preferences")')).toBeVisible();
   72 |   });
   73 |
>  74 |   test('should handle API errors gracefully', async ({ page }) => {
      |       ^ Error: browserType.launch: Executable doesn't exist at /home/gair_/.cache/ms-playwright/firefox-1482/firefox/firefox
   75 |     // Mock a failed API request
   76 |     await page.route('**/api/mcp/skills', route => {
   77 |       route.fulfill({
   78 |         status: 500,
   79 |         contentType: 'application/json',
   80 |         body: JSON.stringify({ error: 'Internal Server Error' })
   81 |       });
   82 |     });
   83 |     
   84 |     // Reload the page to trigger the API call
   85 |     await page.reload();
   86 |     
   87 |     // Verify error message is displayed
   88 |     await expect(page.locator('text=Failed to load skills')).toBeVisible();
   89 |   });
   90 |
   91 |   test('should apply selected skills', async ({ page }) => {
   92 |     // Wait for skills to load
   93 |     const skillCheckboxes = page.locator('.skill-checkbox');
   94 |     await expect(skillCheckboxes.first()).toBeVisible({ timeout: 10000 });
   95 |     
   96 |     // Select a skill
   97 |     const skillToSelect = skillCheckboxes.first();
   98 |     const skillName = await skillCheckboxes.first().locator('+ label').textContent();
   99 |     await skillToSelect.check();
  100 |     
  101 |     // Mock the API response for applying skills
  102 |     await page.route('**/api/mcp/apply-skills', route => {
  103 |       route.fulfill({
  104 |         status: 200,
  105 |         contentType: 'application/json',
  106 |         body: JSON.stringify({ success: true, appliedSkills: [skillName?.trim()] })
  107 |       });
  108 |     });
  109 |     
  110 |     // Click the apply button
  111 |     const applyButton = page.locator('button:has-text("Apply Selected Skills")');
  112 |     await applyButton.click();
  113 |     
  114 |     // Verify success message
  115 |     await expect(page.locator('text=Skills applied successfully')).toBeVisible();
  116 |   });
  117 | });
  118 |
```