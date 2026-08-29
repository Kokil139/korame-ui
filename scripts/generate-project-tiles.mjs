/**
 * Brand tiles for the three case-study cards.
 *
 * The project tiles used to show the same generated abstract artwork as
 * everything else, which told a visitor nothing about which project they were
 * looking at. These composite each project's **own logo** onto a card in that
 * project's own paper colour, so the tile is recognisably the thing it links
 * to.
 *
 * ── Why paper and not the site's usual deep-toned artwork ────────────────
 * NomadNinja's mark is an ink-brush drawing: near-black line work with one red
 * sun. On a dark field it disappears. Kepaso's mark is a dark badge and the
 * Tribe's is a bright gradient badge, so those two survive either way — but a
 * set of three tiles has to be one design, and paper is the only background
 * all three read on. It also happens to be each brand's actual background
 * colour, which is why the marks were drawn for it.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * ── Why the logo is small ────────────────────────────────────────────────
 * `TileImage` renders with `object-cover` and a permanent `scale-[1.18]`, and
 * the tile is 16:10 while the containers it lands in are much wider than that
 * — the case-study hero is roughly 3.6:1. Cover therefore crops the top and
 * bottom hard: only about the middle 37% of the image height survives in the
 * worst case, and the scroll parallax moves that window another ±32px.
 *
 * LOGO_HEIGHT is set so the mark stays inside the middle third and is never
 * clipped in any of the four places these tiles are used. Raising it will look
 * fine on the homepage grid and cut the logo in half on the case-study page —
 * check both before changing it.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Source logos live in scripts/brand/ and were taken from each project's
 * deployed favicon or brand asset. Run with `npm run project-tiles`.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brandDir = path.join(__dirname, 'brand');
const outDir = path.resolve(__dirname, '..', 'public', 'art');

/** Same 16:10 as every other tile, so nothing in the grid changes shape. */
const WIDTH = 1200;
const HEIGHT = 750;
const NARROW = 600;

/** Kept inside the middle third — see the header note on cropping. */
const LOGO_HEIGHT = 230;

const QUALITY = 88;

/**
 * One entry per case study.
 *
 * The field colours are a half-step deeper than each brand's own paper. The
 * light theme's card is pure white (`--card: oklch(1 0 0)`), and at the true
 * paper values the Tribe tile was indistinguishable from the card it sits in.
 */
const PROJECTS = [
    {
        /* Must match `art` in src/content/projects.js. */
        name: 'project-kepaso',
        logo: 'kepaso.svg',
        /* Crema — the colour of the pour, and the light end of Kepaso's own
           espresso palette. The mark is a dark badge, so it needs a light
           field to sit on. */
        top: '#ecdfca',
        bottom: '#d9c4a2',
        glow: '#ffffff',
    },
    {
        name: 'project-nomadninja',
        logo: 'nomadninja.webp',
        /* NomadNinja's actual page background (#ede5db) and a half-step
           darker, so the ink mark sits on the paper it was drawn for. */
        top: '#ede5db',
        bottom: '#dccfbc',
        glow: '#ffffff',
    },
    {
        name: 'project-the-travellers-tribe',
        logo: 'the-travellers-tribe.svg',
        /* The Tribe's paper (#fbf8f3) warmed towards its sun palette. */
        top: '#f6e9d2',
        bottom: '#eddcbe',
        glow: '#ffffff',
    },
];

/**
 * The background: a vertical brand gradient, a soft radial highlight behind
 * where the logo sits, and a light inner vignette so the tile does not read as
 * a flat rectangle when it butts against the card body.
 */
function backgroundSvg({ top, bottom, glow }) {
    return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="field" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${top}"/>
      <stop offset="100%" stop-color="${bottom}"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="50%" r="42%">
      <stop offset="0%" stop-color="${glow}" stop-opacity="0.85"/>
      <stop offset="65%" stop-color="${glow}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="78%">
      <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.10"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#field)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#halo)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#vignette)"/>
</svg>`);
}

async function renderLogo(file) {
    const source = path.join(brandDir, file);
    /* `density` only affects vector input; sharp ignores it for the raster
       mark, which is 256px against a 230px target and so needs no upscale. */
    return sharp(source, { density: 900 })
        .resize({ height: LOGO_HEIGHT, fit: 'inside', withoutEnlargement: false })
        .png()
        .toBuffer();
}

async function build(project) {
    const logo = await renderLogo(project.logo);

    const composed = sharp(backgroundSvg(project)).composite([
        { input: logo, gravity: 'center' },
    ]);

    const full = await composed.webp({ quality: QUALITY }).toBuffer();
    await writeFile(path.join(outDir, `${project.name}.webp`), full);

    /* The narrow variant referenced by TileImage's srcSet. */
    const narrow = await sharp(full)
        .resize(NARROW)
        .webp({ quality: QUALITY })
        .toBuffer();
    await writeFile(path.join(outDir, `${project.name}@600.webp`), narrow);

    return { name: project.name, full: full.length, narrow: narrow.length };
}

async function main() {
    await mkdir(outDir, { recursive: true });

    for (const project of PROJECTS) {
        const { name, full, narrow } = await build(project);
        console.log(
            `  ${name.padEnd(32)} ${(full / 1024).toFixed(1)} kB + ${(narrow / 1024).toFixed(1)} kB`,
        );
    }

    console.log(`\nWrote ${PROJECTS.length} project tiles to public/art/.`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
