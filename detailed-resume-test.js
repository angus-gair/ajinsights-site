const { chromium } = require('@playwright/test');
const path = require('path');

async function createResumeDetailed() {
  console.log('🚀 Starting detailed resume creation workflow...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Step 1: Navigate to homepage
    console.log('📱 Step 1: Navigating to homepage...');
    await page.goto('http://localhost:3001');
    await page.waitForTimeout(3000);
    
    // Take screenshot of homepage
    await page.screenshot({ path: 'homepage-screenshot.png' });
    console.log('📸 Homepage screenshot saved');
    
    // Click "Start Creating Your Resume"
    const startButton = page.locator('text=Start Creating Your Resume');
    await startButton.click();
    console.log('✅ Clicked "Start Creating Your Resume"');
    
    await page.waitForURL('**/create');
    await page.waitForTimeout(2000);
    
    // Step 2: Job Description
    console.log('📝 Step 2: Adding Job Description...');
    await page.screenshot({ path: 'step1-job-description.png' });
    
    // Look for job description input methods
    const fileInput = page.locator('input[type="file"]').first();
    const textarea = page.locator('textarea');
    const textInput = page.locator('input[type="text"]');
    
    console.log('🔍 Looking for job description input...');
    
    // Try to find and fill job description
    if (await textarea.count() > 0 && await textarea.first().isVisible()) {
      console.log('📝 Found textarea, filling job description...');
      await textarea.first().fill(`Senior Full Stack Developer - AI Resume Platform

We are looking for a Senior Full Stack Developer to join our innovative team building AI-powered resume creation tools.

Key Responsibilities:
- Develop and maintain React/Next.js applications
- Build scalable Node.js backend services
- Integrate AI/ML APIs for resume generation
- Design responsive user interfaces
- Collaborate with product and design teams

Required Skills:
- 5+ years experience with React and TypeScript
- Strong background in Node.js and Express
- Experience with databases (PostgreSQL, MongoDB)
- Knowledge of AI/ML integration
- Excellent problem-solving skills
- Strong communication abilities

Preferred Qualifications:
- Experience with Next.js and Vercel
- Knowledge of Python for AI/ML tasks
- Background in UX/UI design
- Previous work with resume/career platforms`);
      
      console.log('✅ Job description filled');
    } else {
      console.log('⚠️ No textarea found, looking for other input methods...');
    }
    
    // Click Next
    await page.locator('button:has-text("Next")').click();
    console.log('⏭️ Moving to Step 2: Source Documents');
    await page.waitForTimeout(2000);
    
    // Step 3: Source Documents  
    console.log('📁 Step 3: Source Documents...');
    await page.screenshot({ path: 'step2-source-documents.png' });
    
    // For now, skip file upload and go to next step
    await page.locator('button:has-text("Next")').click();
    console.log('⏭️ Moving to Step 3: Configuration');
    await page.waitForTimeout(2000);
    
    // Step 4: Configuration
    console.log('⚙️ Step 4: Configuration...');
    await page.screenshot({ path: 'step3-configuration.png' });
    
    // Try to configure settings
    const selects = page.locator('select');
    const selectCount = await selects.count();
    console.log(`🔧 Found ${selectCount} configuration selects`);
    
    if (selectCount > 0) {
      // Select AI model
      await selects.first().selectOption({ index: 1 });
      console.log('🤖 Selected AI model');
      
      if (selectCount > 1) {
        // Select template
        await selects.nth(1).selectOption({ index: 1 });
        console.log('📄 Selected template');
      }
      
      if (selectCount > 2) {
        // Select language style
        await selects.nth(2).selectOption({ index: 1 });
        console.log('🗣️ Selected language style');
      }
    }
    
    await page.locator('button:has-text("Next")').click();
    console.log('⏭️ Moving to Step 4: Generation');
    await page.waitForTimeout(2000);
    
    // Step 5: Generation
    console.log('🎯 Step 5: Resume Generation...');
    await page.screenshot({ path: 'step4-generation.png' });
    
    // Look for generate button
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Generate Resume")');
    
    if (await generateButton.count() > 0) {
      console.log('🔄 Found Generate button, starting generation...');
      await generateButton.first().click();
      
      // Wait for generation to complete
      console.log('⏳ Waiting for resume generation...');
      await page.waitForTimeout(10000);
      
      // Look for generated content
      const generatedContent = page.locator('.prose, .generated-resume, .resume-preview');
      if (await generatedContent.count() > 0) {
        console.log('✅ Resume generated successfully!');
        await page.screenshot({ path: 'step4-generated.png' });
        
        // Try to move to review step
        const nextButton = page.locator('button:has-text("Next"), button:has-text("Review")');
        if (await nextButton.count() > 0) {
          await nextButton.first().click();
          console.log('⏭️ Moving to Step 5: Review');
          await page.waitForTimeout(2000);
          
          // Step 6: Review
          console.log('👀 Step 6: Review...');
          await page.screenshot({ path: 'step5-review.png' });
          
          // Try to move to export
          const exportButton = page.locator('button:has-text("Next"), button:has-text("Export")');
          if (await exportButton.count() > 0) {
            await exportButton.first().click();
            console.log('⏭️ Moving to Step 6: Export');
            await page.waitForTimeout(2000);
            
            // Step 7: Export
            console.log('📤 Step 7: Export...');
            await page.screenshot({ path: 'step6-export.png' });
            
            console.log('🎉 Full resume creation workflow completed!');
          }
        }
      } else {
        console.log('⚠️ No generated content found');
      }
    } else {
      console.log('⚠️ No Generate button found');
    }
    
    // Final screenshot
    await page.screenshot({ path: 'final-state.png' });
    console.log('📸 Final state screenshot saved');
    
    console.log('✅ Resume creation test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'error-screenshot.png' });
    console.log('📸 Error screenshot saved');
  } finally {
    console.log('🔚 Closing browser...');
    await browser.close();
  }
}

async function main() {
  await createResumeDetailed();
}

main().catch(console.error);