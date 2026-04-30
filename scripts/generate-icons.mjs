

import sharp from "sharp";
import { readFileSync, writeFileSync, copyFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pngToIco from "png-to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const APP = join(ROOT, "app");
const SVG_SOURCE = join(PUBLIC, "safari-pinned-tab.svg");

const BG_COLOR = "#0a0a0a";
const ACCENT_COLOR = "#3b82f6";


const ICON_SIZES = [16, 32, 48, 64, 96, 128, 150, 180, 192, 256, 384, 512];

async function generatePngFromSvg(size, padding = 0) {
  const svgBuffer = readFileSync(SVG_SOURCE);
  const innerSize = size - padding * 2;

  if (padding > 0) {

    const inner = await sharp(svgBuffer)
      .resize(innerSize, innerSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: BG_COLOR,
      },
    })
      .composite([{ input: inner, gravity: "center" }])
      .png()
      .toBuffer();
  }

  return sharp(svgBuffer)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function generateStandardIcons() {
  console.log("Generating standard PNG icons...");

  for (const size of ICON_SIZES) {
    const buffer = await generatePngFromSvg(size);
    const filename = size === 180 ? "apple-touch-icon.png" :
                     size === 150 ? "mstile-150x150.png" :
                     `icon-${size === 192 ? "192" : size === 512 ? "512" : `${size}x${size}`}.png`;

    writeFileSync(join(PUBLIC, filename), buffer);
    console.log(`  ${filename} (${size}x${size})`);


    if (existsSync(APP)) {
      copyToApp(filename, buffer);
    }
  }
}

async function generateMaskableIcon() {
  console.log("Generating maskable icon (512x512 with safe zone padding)...");

  const buffer = await generatePngFromSvg(512, 51);
  writeFileSync(join(PUBLIC, "icon-maskable-512.png"), buffer);
  copyToApp("icon-maskable-512.png", buffer);
  console.log("  icon-maskable-512.png");
}

async function generateFavicon() {
  console.log("Generating favicon.ico (multi-size)...");
  const sizes = [16, 32, 48];
  const pngs = [];

  for (const size of sizes) {
    const buffer = await generatePngFromSvg(size);
    pngs.push(buffer);
  }

  const ico = await pngToIco(pngs);
  writeFileSync(join(PUBLIC, "favicon.ico"), ico);
  writeFileSync(join(APP, "favicon.ico"), ico);
  console.log("  favicon.ico (16+32+48)");
}

async function generateOgImage() {
  console.log("Generating OG image (1200x630)...");
  const logoSize = 300;
  const logoBuffer = await generatePngFromSvg(logoSize);


  const width = 1200;
  const height = 630;


  const textSvg = Buffer.from(`
    <svg width="${width}" height="${height}">
      <text x="${width / 2}" y="${height / 2 + logoSize / 2 + 50}"
            font-family="Arial, sans-serif" font-size="48" font-weight="bold"
            fill="white" text-anchor="middle" letter-spacing="4">
        BUNSHIN<tspan fill="${ACCENT_COLOR}">3D</tspan>
      </text>
    </svg>
  `);

  const ogBuffer = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: BG_COLOR,
    },
  })
    .composite([
      {
        input: logoBuffer,
        top: Math.round((height - logoSize) / 2 - 40),
        left: Math.round((width - logoSize) / 2),
      },
      { input: textSvg, top: 0, left: 0 },
    ])
    .jpeg({ quality: 90 })
    .toBuffer();

  writeFileSync(join(PUBLIC, "og-image.jpg"), ogBuffer);
  writeFileSync(join(APP, "og-image.jpg"), ogBuffer);


  const ogPng = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: BG_COLOR,
    },
  })
    .composite([
      {
        input: logoBuffer,
        top: Math.round((height - logoSize) / 2 - 40),
        left: Math.round((width - logoSize) / 2),
      },
      { input: textSvg, top: 0, left: 0 },
    ])
    .png()
    .toBuffer();

  writeFileSync(join(PUBLIC, "og-image.png"), ogPng);
  console.log("  og-image.jpg + og-image.png (1200x630)");
}

async function generateMonochromeSvg() {
  console.log("Generating monochrome Safari pinned tab SVG...");
  let svg = readFileSync(SVG_SOURCE, "utf8");


  svg = svg.replace(/<style>[\s\S]*?<\/style>/g, `<style>
      path, g path { fill: #000000; }
    </style>`);

  svg = svg.replace(/<linearGradient[\s\S]*?<\/linearGradient>/g, "");

  svg = svg.replace(/class="cls-\d+"/g, 'fill="#000000"');
  svg = svg.replace(/fill="url\([^)]+\)"/g, 'fill="#000000"');

  writeFileSync(join(PUBLIC, "safari-pinned-tab-mono.svg"), svg);
  console.log("  safari-pinned-tab-mono.svg");
}

async function generateWebpIcons() {
  console.log("Generating WebP icons...");
  const webpSizes = [192, 512];
  for (const size of webpSizes) {
    const svgBuffer = readFileSync(SVG_SOURCE);
    const buffer = await sharp(svgBuffer)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 90 })
      .toBuffer();

    const filename = `icon-${size}.webp`;
    writeFileSync(join(PUBLIC, filename), buffer);
    console.log(`  ${filename}`);
  }
}

async function generateAvifIcons() {
  console.log("Generating AVIF icons...");
  const avifSizes = [192, 512];
  for (const size of avifSizes) {
    const svgBuffer = readFileSync(SVG_SOURCE);
    const buffer = await sharp(svgBuffer)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .avif({ quality: 80 })
      .toBuffer();

    const filename = `icon-${size}.avif`;
    writeFileSync(join(PUBLIC, filename), buffer);
    console.log(`  ${filename}`);
  }
}

function copyToApp(filename, buffer) {
  try {
    writeFileSync(join(APP, filename), buffer);
  } catch {

  }
}

async function main() {
  console.log(`\nSource SVG: ${SVG_SOURCE}`);
  console.log(`Output dirs: ${PUBLIC} + ${APP}\n`);

  await generateStandardIcons();
  await generateMaskableIcon();
  await generateFavicon();
  await generateOgImage();
  await generateMonochromeSvg();
  await generateWebpIcons();
  await generateAvifIcons();

  console.log("\nAll icons generated successfully!");
  console.log("\nGenerated files:");
  console.log("  PNG:  icon-16x16, icon-32x32, icon-48x48, icon-64x64, icon-96x96,");
  console.log("        icon-128x128, icon-192, icon-256x256, icon-384x384, icon-512,");
  console.log("        apple-touch-icon (180), mstile-150x150, icon-maskable-512");
  console.log("  ICO:  favicon.ico (16+32+48)");
  console.log("  JPG:  og-image.jpg (1200x630)");
  console.log("  PNG:  og-image.png (1200x630)");
  console.log("  WebP: icon-192.webp, icon-512.webp");
  console.log("  AVIF: icon-192.avif, icon-512.avif");
  console.log("  SVG:  safari-pinned-tab-mono.svg (monochrome)");
}

main().catch((err) => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
