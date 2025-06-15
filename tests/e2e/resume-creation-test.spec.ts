import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Resume Creation on ajinsights.com.au', () => {
  test('Create resume using agentic-devv job description', async ({ page }) => {
    // Navigate to the website
    await page.goto('https://www.ajinsights.com.au/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Step 1: Upload Job Description
    console.log('Step 1: Uploading job description...');
    const jobDescriptionPath = path.join(__dirname, '../../test data/agentic-devv.txt');
    
    // Look for job description upload input
    const jobUploadInput = await page.locator('input[type="file"]').first();
    await jobUploadInput.setInputFiles(jobDescriptionPath);
    
    // Wait for processing
    await page.waitForTimeout(2000);
    
    // Click next/continue button if exists
    const nextButton = page.locator('button:has-text("Next"), button:has-text("Continue")').first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
    }
    
    // Step 2: Upload Source Documents
    console.log('Step 2: Uploading resume document...');
    const resumePath = path.join(__dirname, '../../test data/mega-resume-angus-james - Copy.txt');
    
    // Look for document upload input (might be on a different step)
    await page.waitForTimeout(1000);
    const documentUploadInput = await page.locator('input[type="file"]').nth(1);
    if (await documentUploadInput.isVisible()) {
      await documentUploadInput.setInputFiles(resumePath);
    } else {
      // Try first input again if we're on same page
      const firstInput = await page.locator('input[type="file"]').first();
      await firstInput.setInputFiles(resumePath);
    }
    
    // Wait for upload to complete
    await page.waitForTimeout(3000);
    
    // Move to next step
    const nextButton2 = page.locator('button:has-text("Next"), button:has-text("Continue"), button:has-text("Generate")').first();
    if (await nextButton2.isVisible()) {
      await nextButton2.click();
    }
    
    // Step 3: Configure Generation (if needed)
    console.log('Step 3: Configuring generation settings...');
    await page.waitForTimeout(2000);
    
    // Look for generate button
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Create Resume")').first();
    if (await generateButton.isVisible()) {
      await generateButton.click();
    }
    
    // Wait for generation to complete (this might take a while)
    console.log('Waiting for resume generation...');
    await page.waitForTimeout(10000);
    
    // Step 4: Export the resume
    console.log('Step 4: Looking for export options...');
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Download")').first();
    if (await exportButton.isVisible()) {
      // Set up download promise before clicking
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      // Wait for download
      const download = await downloadPromise;
      const fileName = download.suggestedFilename();
      const filePath = path.join(__dirname, '../../test data/generated-resume-' + Date.now() + '.pdf');
      await download.saveAs(filePath);
      console.log(`Resume downloaded to: ${filePath}`);
    }
    
    // Take screenshot of final result
    await page.screenshot({ 
      path: path.join(__dirname, '../../test data/resume-creation-result.png'),
      fullPage: true 
    });
    
    console.log('Resume creation test completed!');
  });
});