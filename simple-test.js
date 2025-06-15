const { chromium } = require('@playwright/test');

async function simpleTest() {
  console.log('🚀 Starting simple navigation test...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to homepage
    console.log('📱 Navigating to homepage...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Take screenshot
    await page.screenshot({ path: 'homepage.png', fullPage: true });
    console.log('📸 Homepage screenshot saved');
    
    // Look for the button with more flexible selector
    console.log('🔍 Looking for create button...');
    const createButton = await page.locator('a[href="/create"]').first();
    
    if (await createButton.isVisible()) {
      console.log('✅ Found create button, clicking...');
      await createButton.click();
      
      // Wait for navigation with longer timeout
      await page.waitForURL('**/create', { timeout: 10000 });
      console.log('✅ Successfully navigated to /create');
      
      await page.screenshot({ path: 'create-page.png', fullPage: true });
      console.log('📸 Create page screenshot saved');
      
      // Check current URL
      const currentUrl = page.url();
      console.log('📍 Current URL:', currentUrl);
      
      // Look for step indicators
      const stepIndicators = page.locator('[class*="step"], .progress, h1, h2');
      const count = await stepIndicators.count();
      console.log(`📊 Found ${count} potential step indicators`);
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        try {
          const text = await stepIndicators.nth(i).textContent();
          console.log(`  ${i + 1}. "${text}"`);
        } catch (e) {
          console.log(`  ${i + 1}. [Error reading text]`);
        }
      }
      
    } else {
      console.log('❌ Create button not found');
      const allLinks = await page.locator('a').count();
      console.log(`🔍 Found ${allLinks} links total`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'error.png', fullPage: true });
  } finally {
    console.log('🔚 Test completed');
    await browser.close();
  }
}

simpleTest().catch(console.error);