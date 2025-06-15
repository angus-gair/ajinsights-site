const { chromium } = require('@playwright/test');

async function testResumeWorkflow() {
  console.log('🚀 Starting resume creation workflow test...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Step 1: Navigate to homepage
    console.log('📱 Navigating to homepage...');
    await page.goto('http://localhost:3001');
    await page.waitForTimeout(2000);
    
    // Check if homepage loaded
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Look for the "Start Creating Your Resume" button
    const startButton = page.locator('text=Start Creating Your Resume');
    await startButton.waitFor({ timeout: 5000 });
    console.log('✅ Found "Start Creating Your Resume" button');
    
    // Step 2: Click to start resume creation
    await startButton.click();
    console.log('🔄 Clicked start button, navigating to /create...');
    await page.waitForURL('**/create');
    
    // Step 3: Job Description Step
    console.log('📝 Step 1: Job Description');
    await page.waitForSelector('h2:has-text("Upload Job Description")', { timeout: 10000 });
    
    // Try to paste job description text instead of uploading file
    const textArea = page.locator('textarea').first();
    if (await textArea.isVisible()) {
      console.log('📝 Found textarea, pasting job description...');
      await textArea.fill(`Senior Software Engineer - AI/ML Platform
      
We are seeking a Senior Software Engineer to join our AI/ML platform team. You will be responsible for:

- Designing and implementing scalable AI/ML infrastructure
- Building APIs for machine learning model deployment
- Collaborating with data scientists and ML engineers
- Ensuring high performance and reliability of ML systems

Requirements:
- 5+ years of software engineering experience
- Experience with Python, TypeScript, and React
- Knowledge of ML frameworks like TensorFlow or PyTorch
- Experience with cloud platforms (AWS, GCP, or Azure)
- Strong problem-solving and communication skills`);
      
      console.log('✅ Job description added');
    }
    
    // Move to next step
    const nextButton = page.locator('button:has-text("Next")');
    await nextButton.click();
    console.log('⏭️ Moved to Step 2: Source Documents');
    
    // Step 4: Source Documents Step
    await page.waitForTimeout(2000);
    console.log('📁 Step 2: Source Documents');
    
    // Skip file upload for now and move to next step
    await nextButton.click();
    console.log('⏭️ Moved to Step 3: Configuration');
    
    // Step 5: Configuration Step
    await page.waitForTimeout(2000);
    console.log('⚙️ Step 3: Configuration');
    
    // Select AI model if available
    const modelSelect = page.locator('select').first();
    if (await modelSelect.isVisible()) {
      await modelSelect.selectOption({ index: 0 });
      console.log('🤖 Selected AI model');
    }
    
    await nextButton.click();
    console.log('⏭️ Moved to Step 4: Generation');
    
    // Step 6: Generation Step
    await page.waitForTimeout(2000);
    console.log('🎯 Step 4: Generation');
    
    // Look for generate button
    const generateButton = page.locator('button:has-text("Generate")');
    if (await generateButton.isVisible()) {
      await generateButton.click();
      console.log('🔄 Started resume generation...');
      await page.waitForTimeout(5000);
    }
    
    console.log('✅ Resume workflow test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'test-failure-screenshot.png' });
    console.log('📸 Screenshot saved as test-failure-screenshot.png');
  } finally {
    await browser.close();
  }
}

// Check if development server is running
async function checkServerRunning() {
  try {
    const response = await fetch('http://localhost:3001');
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServerRunning();
  if (!serverRunning) {
    console.log('❌ Development server not running on port 3001. Please start with: npm run dev');
    process.exit(1);
  }
  
  await testResumeWorkflow();
}

main().catch(console.error);