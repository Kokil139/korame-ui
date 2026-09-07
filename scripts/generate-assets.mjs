/**
 * Generates the raster brand assets that have to be PNG:
 *   public/apple-touch-icon.png  (180x180)
 *   public/og-image.png          (1200x630)
 *
 * Social scrapers do not render SVG, and iOS ignores an SVG touch icon, so
 * these two cannot simply reuse favicon.svg. Everything else on the site
 * stays vector.
 *
 * Run with: npm run assets
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

/* The logo tile and the wordmark's full stop are the mark and keep their
   original indigo -> cyan gradient (see --logo-* in src/index.css). Everything
   else on the card follows the brand spectrum, which is orange. Values are the
   dark-theme --brand-* / --coral-glow steps, since the card is near-black. */
const BRAND = {
    logo600: '#4f46e5',
    logo500: '#6366f1',
    logoCyan: '#22d3ee',
    brand300: '#fea761',
    brand400: '#f08516',
    brand500: '#cf7210',
    coral: '#fd8775',
    cyan: '#22d3ee',
    canvas: '#08090d',
};

/** The K mark, as a standalone rounded tile. */
const iconSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BRAND.logo600}"/>
      <stop offset="55%" stop-color="${BRAND.logo500}"/>
      <stop offset="100%" stop-color="${BRAND.logoCyan}"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <path d="M20 15h7.5v14.6L40.4 15H49L35.6 30.2 49.6 49H40.6L30.4 35.1l-2.9 3.2V49H20z" fill="#fff"/>
</svg>`;

/**
 * Open Graph card, 1200x630.
 *
 * Text is drawn as SVG paths-free <text> using a generic family  the
 * rasteriser has no access to the site's webfonts, so this deliberately
 * relies on weight and scale for impact rather than the exact brand face.
 */
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="tile" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BRAND.logo600}"/>
      <stop offset="55%" stop-color="${BRAND.logo500}"/>
      <stop offset="100%" stop-color="${BRAND.logoCyan}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${BRAND.brand300}"/>
      <stop offset="50%" stop-color="${BRAND.brand400}"/>
      <stop offset="100%" stop-color="${BRAND.coral}"/>
    </linearGradient>
    <radialGradient id="bloomA" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${BRAND.brand500}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${BRAND.brand500}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bloomB" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${BRAND.cyan}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${BRAND.cyan}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="${BRAND.canvas}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <ellipse cx="330" cy="120" rx="520" ry="380" fill="url(#bloomA)"/>
  <ellipse cx="1030" cy="560" rx="420" ry="320" fill="url(#bloomB)"/>

  <!-- Logo lockup -->
  <g transform="translate(88, 92)">
    <rect width="64" height="64" rx="15" fill="url(#tile)"/>
    <path d="M20 15h7.5v14.6L40.4 15H49L35.6 30.2 49.6 49H40.6L30.4 35.1l-2.9 3.2V49H20z" fill="#fff"/>
    <text x="86" y="46" font-family="Verdana, DejaVu Sans, sans-serif" font-size="38" font-weight="700" letter-spacing="3" fill="#ffffff">KORAME</text>
    <text x="278" y="46" font-family="Verdana, DejaVu Sans, sans-serif" font-size="38" font-weight="700" fill="${BRAND.logo500}">.</text>
  </g>

  <!-- Headline -->
  <text x="88" y="316" font-family="Verdana, DejaVu Sans, sans-serif" font-size="72" font-weight="700" fill="#ffffff">We build web solutions</text>
  <text x="88" y="404" font-family="Verdana, DejaVu Sans, sans-serif" font-size="72" font-weight="700" fill="url(#accent)">that captivate &amp; convert.</text>

  <!-- Supporting line -->
  <text x="88" y="474" font-family="Verdana, DejaVu Sans, sans-serif" font-size="27" fill="#9ca3af">Websites, web apps, full-stack systems and custom software.</text>

  <!-- Footer rule + domain -->
  <rect x="88" y="524" width="1024" height="1" fill="#ffffff" fill-opacity="0.12"/>
  <text x="88" y="572" font-family="Verdana, DejaVu Sans, sans-serif" font-size="24" font-weight="700" fill="#ffffff">korame.in</text>
  <text x="1112" y="572" text-anchor="end" font-family="Verdana, DejaVu Sans, sans-serif" font-size="22" fill="#9ca3af">Design · Build · Rank</text>
</svg>`;

async function main() {
    await sharp(Buffer.from(iconSvg(180)))
        .png({ compressionLevel: 9 })
        .toFile(path.join(PUBLIC, 'apple-touch-icon.png'));

    await sharp(Buffer.from(ogSvg))
        .png({ compressionLevel: 9 })
        .toFile(path.join(PUBLIC, 'og-image.png'));

    // Keep a legacy 32px ICO-substitute for crawlers that ask for /favicon.png
    await sharp(Buffer.from(iconSvg(32)))
        .png({ compressionLevel: 9 })
        .toFile(path.join(PUBLIC, 'favicon-32.png'));

    console.log('Generated apple-touch-icon.png, og-image.png, favicon-32.png');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
