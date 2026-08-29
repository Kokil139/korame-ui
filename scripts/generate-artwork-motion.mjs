/**
 * Renders the looping tile clips.
 *
 * The artwork itself is not defined here — `stage()` and `PIECES` come from
 * generate-artwork.mjs, so the clip and its poster still are two renders of one
 * definition rather than two drawings that can drift apart. Frame 0 is rendered
 * at t=0, which is exactly what the poster is, so playback starts without a pop.
 *
 * Encoding, since this machine has no ffmpeg and adding an encoder dependency
 * for a build-time asset step is not justified: each frame is encoded to lossy
 * WebP by sharp, and a lossy WebP *is* a VP8 keyframe in a RIFF wrapper — so
 * the frames are unwrapped and muxed straight into WebM. See scripts/lib/webm.mjs.
 *
 * Because every frame is a keyframe there is no inter-frame prediction, so the
 * knobs below are chosen against measured output rather than taste. Raising
 * SIZE, FPS or QUALITY costs bytes roughly linearly — re-measure if you change
 * them. The artwork is dark, flat and gradient-based, which is the only reason
 * an all-keyframe clip is affordable at all.
 *
 * Run with: npm run artwork
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { stage, PIECES } from './generate-artwork.mjs';
import { vp8FromWebP, muxWebM } from './lib/webm.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'art');

/* 16:10, matching the tile ratio exactly so `object-cover` crops nothing.
   960px covers a ~420px card at 2x DPR, which is the widest the three-column
   grid gets; the clip sits behind a scrim and a 1.18 scale, so going higher
   buys nothing visible and costs bytes on every frame. */
const W = 960;
const H = 600;

/* 5s at 12fps. The motion is slow ambient drift, where 12fps is indistinguishable
   from 24 and exactly half the size. */
const FPS = 12;
const SECONDS = 5;
const FRAMES = FPS * SECONDS;

const QUALITY = 52;

/* The clips are only worth their bytes on tiles that actually render one.
   `streams` is drawn by generate-artwork.mjs but no tile uses it, and
   `studio` is a photograph now — a clip beside it would make TileImage render
   the abstract video with the photo as nothing but a poster. */
const TILES = new Set([
    'service-commerce',
    'service-design',
    'service-seo',
    'work-commerce',
    'work-saas',
    'work-ai',
    'work-seo',
]);

/** Render one frame of a piece to a VP8 keyframe. */
async function frame(piece, i) {
    const svg = stage({ ...piece, t: i / FRAMES });
    const webp = await sharp(Buffer.from(svg))
        .resize(W, H)
        // Opaque and non-animated, so sharp emits a bare `VP8 ` chunk — an
        // alpha channel would produce VP8X, which vp8FromWebP rejects.
        .flatten({ background: '#07080c' })
        .webp({ quality: QUALITY, effort: 6, alphaQuality: 0 })
        .toBuffer();
    return vp8FromWebP(webp);
}

/** Bounded concurrency — sharp is happy in parallel, the box has finite cores. */
async function mapLimit(items, limit, fn) {
    const out = new Array(items.length);
    let next = 0;
    await Promise.all(
        Array.from({ length: Math.min(limit, items.length) }, async () => {
            while (next < items.length) {
                const i = next++;
                out[i] = await fn(items[i], i);
            }
        }),
    );
    return out;
}

async function main() {
    await mkdir(OUT, { recursive: true });

    const pieces = PIECES.filter((p) => TILES.has(p.name));
    const missing = [...TILES].filter((n) => !pieces.some((p) => p.name === n));
    if (missing.length) throw new Error(`no artwork defined for: ${missing.join(', ')}`);

    let total = 0;
    for (const piece of pieces) {
        const indices = Array.from({ length: FRAMES }, (_, i) => i);
        const frames = await mapLimit(indices, 4, (i) => frame(piece, i));

        const webm = muxWebM(frames, { width: W, height: H, fps: FPS });
        await writeFile(path.join(OUT, `${piece.name}.webm`), webm);

        total += webm.length;
        console.log(`  ${piece.name.padEnd(18)} ${(webm.length / 1024).toFixed(0).padStart(4)} KB`);
    }

    console.log(
        `Generated ${pieces.length} clips (${W}x${H}, ${SECONDS}s @ ${FPS}fps) — ${(
            total / 1024 / 1024
        ).toFixed(2)} MB total`,
    );
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
