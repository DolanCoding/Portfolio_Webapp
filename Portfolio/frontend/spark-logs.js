#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function captureSparkLogs() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const logFile = path.join('Debug logs', `spark-logs-${timestamp}.txt`);

  console.log(`🎯 Capturing SparkOverlay console logs to ${logFile}...\n`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const logs = [];

  // Capture all SparkOverlay logs
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Spark:') || text.includes('Arc:') || text.includes('Angle:')) {
      console.log(text);
      logs.push(`[${new Date().toISOString()}] ${text}`);
    }
  });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });

    // Trigger animations
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 100));

    // Wait for full animation cycle
    await page.waitForTimeout(20000);

    // Save logs to file
    fs.writeFileSync(logFile, logs.join('\n'));
    console.log(`\n✅ Spark logs saved to: ${logFile}`);
    console.log(`📊 Captured ${logs.length} log entries`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

captureSparkLogs().catch(console.error);
