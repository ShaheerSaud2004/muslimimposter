#!/usr/bin/env node
/**
 * Resize screenshots to App Store / Google Play dimensions and optionally add a phone frame.
 * Required sizes (Apple): 1242×2688, 2688×1242, 1284×2778, 2778×1284
 * Default output: 1284×2778 (portrait, iPhone 6.7").
 *
 * Usage:
 *   node scripts/resize-app-previews.js [inputDir] [outputDir]
 *   node scripts/resize-app-previews.js --frame   # also write framed versions
 *
 * Input: PNGs in assets/screenshots (or first arg). Creates dir if missing.
 * Output: assets/app-previews/ (or second arg). With --frame also: assets/app-previews-with-frame/
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const W = 1284;
const H = 2778;
const FRAME_PAD = 48;
const FRAME_BG = '#1c1c1e';
const WITH_FRAME = process.argv.includes('--frame');

const projectRoot = path.resolve(__dirname, '..');
const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const inputDir = path.resolve(projectRoot, args[0] || 'assets/screenshots');
const outputDir = path.resolve(projectRoot, args[1] || 'assets/app-previews');
const frameOutputDir = path.resolve(projectRoot, 'assets/app-previews-with-frame');

if (!fs.existsSync(inputDir)) {
  fs.mkdirSync(inputDir, { recursive: true });
  console.log('Created', inputDir, '(add PNG screenshots there and run again)');
  process.exit(0);
}

fs.mkdirSync(outputDir, { recursive: true });
if (WITH_FRAME) fs.mkdirSync(frameOutputDir, { recursive: true });

const files = fs.readdirSync(inputDir).filter((f) => /\.png$/i.test(f));
if (files.length === 0) {
  console.log('No PNG files in', inputDir);
  process.exit(0);
}

async function processFile(name) {
  const src = path.join(inputDir, name);
  const base = path.basename(name, path.extname(name));

  const img = sharp(src);
  const meta = await img.metadata();
  const isLandscape = (meta.width || 0) > (meta.height || 0);

  const targetW = isLandscape ? H : W;
  const targetH = isLandscape ? W : H;

  const outPath = path.join(outputDir, `${base}-${targetW}x${targetH}.png`);

  const resized = await img
    .resize(targetW, targetH, { fit: 'cover', position: 'center' })
    .png()
    .toBuffer();

  await fs.promises.writeFile(outPath, resized);

  console.log('Written', path.relative(projectRoot, outPath));

  if (WITH_FRAME) {
    const framePath = path.join(frameOutputDir, `${base}-${targetW}x${targetH}-frame.png`);

    await sharp(resized)
      .extend({
        top: FRAME_PAD,
        bottom: FRAME_PAD,
        left: FRAME_PAD,
        right: FRAME_PAD,
        background: { r: 28, g: 28, b: 30 },
      })
      .png()
      .toFile(framePath);
    console.log('Written', path.relative(projectRoot, framePath));
  }
}

(async () => {
  for (const name of files) {
    try {
      await processFile(name);
    } catch (e) {
      console.error(name, e.message);
    }
  }
  console.log('Done. Use', W, '×', H, 'images for App Store (iPhone 6.7") or Google Play.');
})();
