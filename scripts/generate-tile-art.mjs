/**
 * Photographic tiles.
 *
 * The eight service pages used to share five pieces of generated abstract
 * artwork between them — `work-saas` appeared on two pages, `work-ai` on two,
 * `service-seo` on two. A visitor comparing two services saw the same picture
 * twice, which told them nothing. These are one image per tile, so a tile is
 * recognisably the thing it belongs to.
 *
 * ── Why the sources live here and not in public/ ─────────────────────────
 * Vite copies `public/` into `dist/` verbatim. The source renders are ~2MB
 * PNGs each; left in `public/art/` they would ship to every visitor's CDN
 * origin alongside the WebP the site actually requests — 15.7MB of files
 * nothing links to. They are build input, so they live beside the script that
 * consumes them, exactly like `scripts/brand/` does for the project tiles.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * ── The source file name IS the tile name ────────────────────────────────
 * `service-web-development.png` in here becomes `service-web-development.webp`
 * in public/art/, which is the `art` key /web-development declares, and
 * `studio.png` becomes the `studio` tile on the contact page. No mapping
 * table, no prefixing rule to remember, and nothing to keep in step. The old
 * names (`work-saas`, `service-commerce`) were decoupled from the pages that
 * used them, which is how two services ended up sharing one picture without
 * anyone noticing.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * ── Framing ──────────────────────────────────────────────────────────────
 * Sources are 3:2 (1536x1024); tiles are 16:10, the ratio `TileImage`
 * declares. That is a centre crop of 32px from the top and bottom — small,
 * because the subject of every source render sits in the middle.
 *
 * Be careful raising the crop: `TileImage` renders `object-cover` with a
 * permanent `scale-[1.18]`, and every container these land in is wider than
 * 16:10, so only a middle band of the image survives. The contact page's
 * studio card is the tightest at roughly 2.3:1. Anything that has to stay
 * visible must sit near the centre; the lettered posters in the top corner of
 * the service renders are decoration and are expected to be cut.
 *
 * FOCUS lets one source pull its crop off centre when the composition needs
 * it — `sharp`'s `position` on a cover resize, so it is the crop that moves,
 * not the framing of the output.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Stills only — these are photographs of a desk, not motion pieces, and
 * `TileImage` renders an `<img>` for any tile with no `.webm` beside it. A
 * tile moving from generated art to a photograph therefore has to lose its
 * clip from public/art/ *and* its entry in generate-artwork.mjs, or the next
 * `npm run artwork` puts the abstract version back.
 *
 * Run with `npm run tile-art` (also part of `npm run assets`).
 */
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'tile-art');
const OUT = path.join(__dirname, '..', 'public', 'art');

/* 16:10, matching the width/height TileImage renders on the element. The
   @600 variant is the narrow-viewport half of the srcSet. */
const WIDE = { w: 1200, h: 750, quality: 78 };
const NARROW = { w: 600, h: 375, quality: 72 };

/** Per-tile crop anchor, for sources whose subject is not centred. */
const FOCUS = {};

const kb = (n) => `${(n / 1024).toFixed(1)}kB`;

async function main() {
    await mkdir(OUT, { recursive: true });

    const sources = (await readdir(SRC))
        .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
        .sort();

    if (!sources.length) {
        console.log('Tile art: no sources in scripts/tile-art/, nothing to do.');
        return;
    }

    let total = 0;

    for (const file of sources) {
        const name = path.basename(file, path.extname(file));

        for (const [suffix, size] of [['', WIDE], ['@600', NARROW]]) {
            const buf = await sharp(path.join(SRC, file))
                .resize(size.w, size.h, { fit: 'cover', position: FOCUS[name] ?? 'centre' })
                /* Opaque: these are photographic and an alpha channel would
                   only add weight. */
                .flatten({ background: '#ffffff' })
                .webp({ quality: size.quality, effort: 6 })
                .toBuffer();

            await writeFile(path.join(OUT, `${name}${suffix}.webp`), buf);
            total += buf.length;
            if (!suffix) process.stdout.write(`  ${name}.webp`.padEnd(46) + kb(buf.length));
            else console.log(`   +${suffix} ${kb(buf.length)}`);
        }
    }

    console.log(`Tile art: ${sources.length} tiles, ${kb(total)} total.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
