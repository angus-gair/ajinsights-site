# Test info

- Name: Resume Creation on ajinsights.com.au >> Create resume using agentic-devv job description
- Location: /mnt/c/dev/v0-resume-creation-framework/tests/e2e/resume-creation-test.spec.ts:5:7

# Error details

```
Error: locator.setInputFiles: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[type="file"]').first()

    at /mnt/c/dev/v0-resume-creation-framework/tests/e2e/resume-creation-test.spec.ts:18:5
```

# Page snapshot

```yaml
- banner:
  - img
  - heading "ResumeAI" [level=1]
  - navigation:
    - link "Features":
      - /url: "#features"
    - link "How it Works":
      - /url: "#how-it-works"
    - button "Sign In"
- heading "Create the Perfect Resume for Any Job" [level=2]
- paragraph: Our AI-powered platform analyzes job descriptions and tailors your resume to match exactly what employers are looking for. Stand out from the crowd with personalized, professional resumes.
- link "Start Creating Your Resume":
  - /url: /create
  - button "Start Creating Your Resume":
    - text: Start Creating Your Resume
    - img
- heading "How It Works" [level=3]
- paragraph: Our streamlined 6-step process ensures you get a perfectly tailored resume every time
- img
- text: Step 1
- img
- text: Upload Job Description Upload the job posting and select an AI model to extract key requirements
- img
- text: Step 2
- img
- text: Add Source Documents Upload your CV, cover letters, and portfolio documents
- img
- text: Step 3
- img
- text: Configure Generation Choose AI model, template, language style, and preferences
- img
- text: Step 4
- img
- text: Generate Resume AI creates your tailored resume based on job requirements
- img
- text: Step 5
- img
- text: Review & Edit Preview and make final adjustments to your resume
- img
- text: Step 6 Export Download your resume as HTML or PDF
- link "Try It Now - It's Free":
  - /url: /create
  - button "Try It Now - It's Free":
    - text: Try It Now - It's Free
    - img
- heading "Why Choose ResumeAI?" [level=3]
- img
- text: AI-Powered Matching
- paragraph: Advanced AI analyzes job descriptions and optimizes your resume for maximum impact.
- img
- text: Fully Customizable
- paragraph: Choose from multiple templates, languages, and styling options to match your preferences.
- img
- text: Multiple Export Formats
- paragraph: Download your resume as HTML for web use or PDF for traditional applications.
- contentinfo:
  - img
  - text: ResumeAI
  - paragraph: Create perfect resumes with AI assistance.
  - heading "Product" [level=4]
  - list:
    - listitem:
      - link "Features":
        - /url: "#"
    - listitem:
      - link "Templates":
        - /url: "#"
    - listitem:
      - link "Pricing":
        - /url: "#"
  - heading "Support" [level=4]
  - list:
    - listitem:
      - link "Help Center":
        - /url: "#"
    - listitem:
      - link "Contact":
        - /url: "#"
    - listitem:
      - link "Privacy":
        - /url: "#"
  - heading "Company" [level=4]
  - list:
    - listitem:
      - link "About":
        - /url: "#"
    - listitem:
      - link "Blog":
        - /url: "#"
    - listitem:
      - link "Careers":
        - /url: "#"
  - paragraph: © 2024 ResumeAI. All rights reserved.
- alert
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import path from 'path';
   3 |
   4 | test.describe('Resume Creation on ajinsights.com.au', () => {
   5 |   test('Create resume using agentic-devv job description', async ({ page }) => {
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
> 18 |     await jobUploadInput.setInputFiles(jobDescriptionPath);
     |     ^ Error: locator.setInputFiles: Test timeout of 30000ms exceeded.
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