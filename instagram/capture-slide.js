#!/usr/bin/env node
/**
 * Captures slide-have-khafi.html to slide-have-khafi.png at 1080×1080.
 * Run: node instagram/capture-slide.js
 * Requires: npm install puppeteer (one-time)
 */
const path = require('path');
const fs = require('fs');

const dir = __dirname;
const htmlPath = path.join(dir, 'slide-have-khafi.html');
const outPath = path.join(dir, 'slide-have-khafi.png');

if (!fs.existsSync(htmlPath)) {
  console.error('slide-have-khafi.html not found');
  process.exit(1);
}

async function main() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (_) {
    console.error('Puppeteer not found. Run: npm install puppeteer --save-dev');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });

  await page.screenshot({
    path: outPath,
    type: 'png',
    clip: { x: 0, y: 0, width: 1080, height: 1080 },
  });

  await browser.close();
  console.log('Saved:', outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
