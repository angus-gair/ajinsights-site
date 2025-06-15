const { chromium } = require('@playwright/test');

async function directTest() {
  console.log('🚀 Testing direct navigation to /create...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Try direct navigation to create page
    console.log('📱 Navigating directly to /create...');
    await page.goto('http://localhost:3001/create', { waitUntil: 'networkidle' });
    
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    // Take screenshot
    await page.screenshot({ path: 'create-direct.png', fullPage: true });
    console.log('📸 Create page screenshot saved');
    
    // Look for key elements
    console.log('🔍 Looking for resume creation elements...');
    
    const headers = page.locator('h1, h2, h3');
    const headerCount = await headers.count();
    console.log(`📊 Found ${headerCount} headers`);
    
    for (let i = 0; i < Math.min(headerCount, 5); i++) {
      try {
        const text = await headers.nth(i).textContent();
        console.log(`  📝 Header ${i + 1}: "${text}"`);
      } catch (e) {
        console.log(`  📝 Header ${i + 1}: [Error reading text]`);
      }
    }
    
    // Look for form elements
    const inputs = page.locator('input, textarea, select, button');
    const inputCount = await inputs.count();
    console.log(`🔧 Found ${inputCount} form elements`);
    
    // Check for progress indicators
    const progress = page.locator('[class*="progress"], [class*="step"], .step');
    const progressCount = await progress.count();
    console.log(`📊 Found ${progressCount} progress indicators`);
    
    // Look for specific resume creation text
    const resumeText = page.locator('text=resume, text=Resume, text=job, text=Job');
    const resumeCount = await resumeText.count();
    console.log(`💼 Found ${resumeCount} resume-related text elements`);
    
    // Check if this is the loading state
    const loading = page.locator('text=Loading, .loading, [class*="loading"]');
    const loadingCount = await loading.count();
    console.log(`⏳ Found ${loadingCount} loading indicators`);
    
    if (loadingCount > 0) {
      console.log('⏳ Page seems to be in loading state, waiting...');
      await page.waitForTimeout(5000);
      await page.screenshot({ path: 'create-after-wait.png', fullPage: true });
    }
    
    // Try to interact with the form
    const fileInputs = page.locator('input[type="file"]');
    const fileCount = await fileInputs.count();
    console.log(`📁 Found ${fileCount} file inputs`);
    
    const textareas = page.locator('textarea');
    const textareaCount = await textareas.count();
    console.log(`📝 Found ${textareaCount} textareas`);
    
    if (textareaCount > 0) {
      console.log('📝 Trying to fill job description...');
      await textareas.first().fill('Test job description for software engineer position');
      console.log('✅ Job description filled');
      
      await page.screenshot({ path: 'after-fill.png', fullPage: true });
    }
    
    console.log('✅ Direct navigation test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'direct-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

directTest().catch(console.error);