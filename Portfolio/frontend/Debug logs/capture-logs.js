import { chromium } from 'playwright';

async function captureConsoleLogs() {
  console.log('🚀 Launching browser to capture console logs...');

  try {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('✅ Browser launched successfully');

    const page = await browser.newPage();
    console.log('✅ New page created');

    // Listen for console messages
    page.on('console', msg => {
      console.log(`[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
    });

    // Listen for page errors
    page.on('pageerror', error => {
      console.log(`[PAGE ERROR] ${error.message}`);
    });

    console.log('📄 Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Page loaded successfully');

    console.log('⏳ Waiting for spark animations to run...');
    // Wait a bit for initial load
    await page.waitForTimeout(5000);

    // Try to trigger animations by scrolling or clicking
    await page.evaluate(() => {
      window.scrollTo(0, 100);
      // Try to trigger any lazy loading or animations
      const event = new Event('scroll');
      window.dispatchEvent(event);
    });

    // Wait for animations to run
    await page.waitForTimeout(25000); // 25 seconds for animations
    console.log('✅ Wait complete');

    console.log('✅ Console log capture complete!');
    await browser.close();
  } catch (error) {
    console.error('❌ Error during capture:', error);
  }
}

captureConsoleLogs().catch(console.error);
