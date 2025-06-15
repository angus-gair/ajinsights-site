# Test info

- Name: Resume Creation on ajinsights.com.au >> Create resume using agentic-devv job description
- Location: /mnt/c/dev/v0-resume-creation-framework/tests/e2e/resume-creation-test.spec.ts:5:7

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
   2 | import path from 'path';
   3 |
   4 | test.describe('Resume Creation on ajinsights.com.au', () => {
>  5 |   test('Create resume using agentic-devv job description', async ({ page }) => {
     |       ^ Error: browserType.launch: Executable doesn't exist at /home/gair_/.cache/ms-playwright/firefox-1482/firefox/firefox
   6 |     // Navigate to the website
   7 |     await page.goto('https://www.ajinsights.com.au/');
   8 |     
   9 |     // Wait for the page to load
  10 |     await page.waitForLoadState('networkidle');
  11 |     
  12 |     // Step 1: Upload Job Description
  13 |     console.log('Step 1: Uploading job description...');
  14 |     const jobDescriptionPath = path.join(__dirname, '../../test data/agentic-devv.txt');
  15 |     
  16 |     // Look for job description upload input
  17 |     const jobUploadInput = await page.locator('input[type="file"]').first();
  18 |     await jobUploadInput.setInputFiles(jobDescriptionPath);
  19 |     
  20 |     // Wait for processing
  21 |     await page.waitForTimeout(2000);
  22 |     
  23 |     // Click next/continue button if exists
  24 |     const nextButton = page.locator('button:has-text("Next"), button:has-text("Continue")').first();
  25 |     if (await nextButton.isVisible()) {
  26 |       await nextButton.click();
  27 |     }
  28 |     
  29 |     // Step 2: Upload Source Documents
  30 |     console.log('Step 2: Uploading resume document...');
  31 |     const resumePath = path.join(__dirname, '../../test data/mega-resume-angus-james - Copy.txt');
  32 |     
  33 |     // Look for document upload input (might be on a different step)
  34 |     await page.waitForTimeout(1000);
  35 |     const documentUploadInput = await page.locator('input[type="file"]').nth(1);
  36 |     if (await documentUploadInput.isVisible()) {
  37 |       await documentUploadInput.setInputFiles(resumePath);
  38 |     } else {
  39 |       // Try first input again if we're on same page
  40 |       const firstInput = await page.locator('input[type="file"]').first();
  41 |       await firstInput.setInputFiles(resumePath);
  42 |     }
  43 |     
  44 |     // Wait for upload to complete
  45 |     await page.waitForTimeout(3000);
  46 |     
  47 |     // Move to next step
  48 |     const nextButton2 = page.locator('button:has-text("Next"), button:has-text("Continue"), button:has-text("Generate")').first();
  49 |     if (await nextButton2.isVisible()) {
  50 |       await nextButton2.click();
  51 |     }
  52 |     
  53 |     // Step 3: Configure Generation (if needed)
  54 |     console.log('Step 3: Configuring generation settings...');
  55 |     await page.waitForTimeout(2000);
  56 |     
  57 |     // Look for generate button
  58 |     const generateButton = page.locator('button:has-text("Generate"), button:has-text("Create Resume")').first();
  59 |     if (await generateButton.isVisible()) {
  60 |       await generateButton.click();
  61 |     }
  62 |     
  63 |     // Wait for generation to complete (this might take a while)
  64 |     console.log('Waiting for resume generation...');
  65 |     await page.waitForTimeout(10000);
  66 |     
  67 |     // Step 4: Export the resume
  68 |     console.log('Step 4: Looking for export options...');
  69 |     const exportButton = page.locator('button:has-text("Export"), button:has-text("Download")').first();
  70 |     if (await exportButton.isVisible()) {
  71 |       // Set up download promise before clicking
  72 |       const downloadPromise = page.waitForEvent('download');
  73 |       await exportButton.click();
  74 |       
  75 |       // Wait for download
  76 |       const download = await downloadPromise;
  77 |       const fileName = download.suggestedFilename();
  78 |       const filePath = path.join(__dirname, '../../test data/generated-resume-' + Date.now() + '.pdf');
  79 |       await download.saveAs(filePath);
  80 |       console.log(`Resume downloaded to: ${filePath}`);
  81 |     }
  82 |     
  83 |     // Take screenshot of final result
  84 |     await page.screenshot({ 
  85 |       path: path.join(__dirname, '../../test data/resume-creation-result.png'),
  86 |       fullPage: true 
  87 |     });
  88 |     
  89 |     console.log('Resume creation test completed!');
  90 |   });
  91 | });
```