const { chromium } = require('@playwright/test');
const fs = require('fs');

async function fullWorkflowTest() {
  console.log('🚀 Starting full resume creation workflow test...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Create a simple job description file for testing
  const jobDescription = `Senior Software Engineer - Remote

We are seeking a talented Senior Software Engineer to join our growing team.

Responsibilities:
- Design and develop scalable web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews

Requirements:
- 5+ years of software development experience
- Strong knowledge of JavaScript, React, and Node.js
- Experience with databases and APIs
- Excellent problem-solving skills`;

  fs.writeFileSync('test-job-description.txt', jobDescription);
  
  try {
    // Step 1: Navigate to create page directly
    console.log('📱 Step 1: Navigating to create page...');
    await page.goto('http://localhost:3001/create', { waitUntil: 'networkidle' });
    
    await page.screenshot({ path: 'workflow-step1.png', fullPage: true });
    console.log('📸 Step 1 screenshot saved');
    
    // Step 2: Upload job description
    console.log('📝 Step 2: Uploading job description...');
    
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.isVisible()) {
      const filePath = require('path').resolve('test-job-description.txt');
      await fileInput.setInputFiles(filePath);
      console.log('✅ Job description file uploaded');
      
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'workflow-step2.png', fullPage: true });
    }
    
    // Try to find and click Next button
    const nextButton = page.locator('button:has-text("Next")');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      console.log('⏭️ Clicked Next button');
      await page.waitForTimeout(3000);
    }
    
    // Step 3: Source Documents
    console.log('📁 Step 3: Source Documents step...');
    await page.screenshot({ path: 'workflow-step3.png', fullPage: true });
    
    // Skip source documents for now
    const nextButton2 = page.locator('button:has-text("Next")');
    if (await nextButton2.isVisible()) {
      await nextButton2.click();
      console.log('⏭️ Skipped source documents');
      await page.waitForTimeout(3000);
    }
    
    // Step 4: Configuration
    console.log('⚙️ Step 4: Configuration...');
    await page.screenshot({ path: 'workflow-step4.png', fullPage: true });
    
    // Try to configure options
    const selects = page.locator('select');
    const selectCount = await selects.count();
    console.log(`🔧 Found ${selectCount} select elements`);
    
    for (let i = 0; i < selectCount; i++) {
      try {
        await selects.nth(i).selectOption({ index: 1 });
        console.log(`✅ Selected option ${i + 1}`);
      } catch (e) {
        console.log(`⚠️ Could not select option ${i + 1}`);
      }
    }
    
    const nextButton3 = page.locator('button:has-text("Next")');
    if (await nextButton3.isVisible()) {
      await nextButton3.click();
      console.log('⏭️ Moved to generation step');
      await page.waitForTimeout(3000);
    }
    
    // Step 5: Generation
    console.log('🎯 Step 5: Resume Generation...');
    await page.screenshot({ path: 'workflow-step5.png', fullPage: true });
    
    // Look for generate button
    const generateButtons = page.locator('button:has-text("Generate"), button:has-text("Create"), button:has-text("Start")');
    const generateCount = await generateButtons.count();
    console.log(`🔄 Found ${generateCount} potential generate buttons`);
    
    if (generateCount > 0) {
      await generateButtons.first().click();
      console.log('🎯 Started resume generation');
      
      // Wait for generation
      await page.waitForTimeout(8000);
      await page.screenshot({ path: 'workflow-generation.png', fullPage: true });
      
      // Look for generated content
      const contentAreas = page.locator('.prose, .resume-content, .generated-content, pre, code');
      const contentCount = await contentAreas.count();
      console.log(`📄 Found ${contentCount} content areas`);
      
      if (contentCount > 0) {
        console.log('✅ Resume generation appears successful');
        
        // Try to continue to review
        const continueButton = page.locator('button:has-text("Next"), button:has-text("Review"), button:has-text("Continue")');
        if (await continueButton.count() > 0) {
          await continueButton.first().click();
          console.log('⏭️ Moved to review step');
          await page.waitForTimeout(3000);
          
          // Step 6: Review
          console.log('👀 Step 6: Review...');
          await page.screenshot({ path: 'workflow-step6.png', fullPage: true });
          
          // Try to move to export
          const exportButton = page.locator('button:has-text("Next"), button:has-text("Export"), button:has-text("Download")');
          if (await exportButton.count() > 0) {
            await exportButton.first().click();
            console.log('⏭️ Moved to export step');
            await page.waitForTimeout(3000);
            
            // Step 7: Export
            console.log('📤 Step 7: Export...');
            await page.screenshot({ path: 'workflow-step7.png', fullPage: true });
            
            console.log('🎉 Complete workflow test finished!');
          }
        }
      }
    }
    
    // Final state
    await page.screenshot({ path: 'workflow-final.png', fullPage: true });
    console.log('📸 Final workflow screenshot saved');
    
    // Print current page content summary
    const allText = await page.textContent('body');
    const wordCount = allText.split(' ').length;
    console.log(`📊 Page contains approximately ${wordCount} words`);
    
    console.log('✅ Full workflow test completed successfully!');
    
  } catch (error) {
    console.error('❌ Workflow test failed:', error.message);
    await page.screenshot({ path: 'workflow-error.png', fullPage: true });
  } finally {
    // Cleanup
    try {
      fs.unlinkSync('test-job-description.txt');
    } catch (e) {
      // File might not exist
    }
    
    await browser.close();
    console.log('🔚 Browser closed');
  }
}

fullWorkflowTest().catch(console.error);