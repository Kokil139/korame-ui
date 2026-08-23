/**
 * Scans public/art/ and records which tiles have a motion file.
 *
 * Why a generated manifest rather than letting <video> try and fail: a
 * <video> whose <source> 404s still fires the request, so every tile without
 * a clip would log a network error on every page load. The manifest lets the
 * component render <img> for stills and <video> only where a clip exists.
 *
 * Drop files into public/art/, run `npm run artwork` (or just build — this
 * also runs in `prebuild`), and the manifest updates itself.
 *
 * Naming convention:
 *   public/art/<name>.webm   motion, preferred (smaller)
 *   public/art/<name>.mp4    motion, fallback for older Safari
 *   public/art/<name>.webp   still — poster frame, and what shows under
 *                            reduced motion. Always keep one.
 */
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ART = path.join(__dirname, '..', 'public', 'art');
const OUT = path.join(__dirname, '..', 'src', 'lib', 'art-manifest.js');

const MOTION_EXT = ['.webm', '.mp4'];

async function main() {
    let files = [];
    try {
        files = await readdir(ART);
    } catch {
        // No art directory yet — emit an empty manifest so the build works.
    }

    /** name -> ['webm', 'mp4'] */
    const motion = {};

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!MOTION_EXT.includes(ext)) continue;
        // Ignore the @600 responsive variants; motion files are single-size.
        const name = path.basename(file, ext);
        if (name.includes('@')) continue;
        (motion[name] ??= []).push(ext.slice(1));
    }

    // webm before mp4: the browser picks the first it can play.
    for (const key of Object.keys(motion)) {
        motion[key].sort((a, b) => (a === 'webm' ? -1 : b === 'webm' ? 1 : 0));
    }

    const names = Object.keys(motion).sort();

    const body = `/**
 * GENERATED — do not edit.
 * Written by scripts/generate-art-manifest.mjs from the contents of
 * public/art/. Add or remove a .webm/.mp4 there and re-run \`npm run artwork\`.
 */
export const ART_MOTION = ${JSON.stringify(
        Object.fromEntries(names.map((n) => [n, motion[n]])),
        null,
        4,
    )};

/** True when this tile has a motion file to play. */
export const hasMotion = (name) => Boolean(ART_MOTION[name]);
`;

    await writeFile(OUT, body, 'utf8');
    console.log(
        names.length
            ? `Art manifest: ${names.length} animated tile(s) — ${names.join(', ')}`
            : 'Art manifest: no motion files found (all tiles render as stills)',
    );
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
