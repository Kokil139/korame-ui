/**
 * Scans public/art/ and records what the app needs to know about each tile.
 *
 * Why a generated manifest rather than letting <video> try and fail: a
 * <video> whose <source> 404s still fires the request, so every tile without
 * a clip would log a network error on every page load. The manifest lets the
 * component render <img> for stills and <video> only where a clip exists.
 *
 * Drop files into public/art/, run `npm run artwork` (or just build  this
 * also runs in `prebuild`), and the manifest updates itself.
 *
 * Naming convention:
 *   public/art/<name>.webm   motion, preferred (smaller)
 *   public/art/<name>.mp4    motion, fallback for older Safari
 *   public/art/<name>.webp   still  poster frame, and what shows under
 *                            reduced motion. Always keep one.
 *   public/art/<name>@600.webp  narrow-viewport still (srcSet)
 *
 * ── ART_VERSION: why these URLs carry a content hash ─────────────────────
 * Everything under /art/ is served with `cache-control: public,
 * max-age=2592000` and the file names are stable  `studio.webp` is
 * `studio.webp` forever. Replacing a tile therefore changes the bytes behind
 * a URL that returning visitors already hold, and they keep seeing the old
 * artwork for up to thirty days.
 *
 * That is not hypothetical. It is what happened when the studio card and the
 * eight service tiles became photographs: correct bytes on the CDN, correct
 * markup in the HTML, and still the old abstract art in any browser that had
 * visited before. A hard refresh fixes it for one person and for nobody else.
 *
 * The Vite bundle never has this problem because its file names are
 * fingerprinted. These are not, so the fingerprint goes in the query string
 * instead  it is part of the HTTP cache key, so new bytes mean a new URL and
 * a guaranteed refetch, while an unchanged tile keeps its full thirty days.
 *
 * The hash covers every file belonging to a tile  still, @600 variant and
 * clips together  so one version busts all of that tile's URLs at once. That
 * over-invalidates slightly when only the clip changes, which costs one
 * still refetch and is not worth a second hash to avoid.
 * ─────────────────────────────────────────────────────────────────────────
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ART = path.join(__dirname, '..', 'public', 'art');
const OUT = path.join(__dirname, '..', 'src', 'lib', 'art-manifest.js');

const MOTION_EXT = ['.webm', '.mp4'];
const ASSET_EXT = ['.webm', '.mp4', '.webp', '.png', '.jpg', '.jpeg', '.avif', '.gif'];

async function main() {
    let files = [];
    try {
        files = await readdir(ART);
    } catch {
        // No art directory yet  emit an empty manifest so the build works.
    }

    /** name -> ['webm', 'mp4'] */
    const motion = {};
    /** name -> every file belonging to that tile */
    const members = {};

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!ASSET_EXT.includes(ext)) continue;

        // `work-ai@600.webp` belongs to the `work-ai` tile.
        const base = path.basename(file, ext);
        const name = base.split('@')[0];

        (members[name] ??= []).push(file);

        if (!MOTION_EXT.includes(ext)) continue;
        // Ignore the @600 responsive variants; motion files are single-size.
        if (base.includes('@')) continue;
        (motion[name] ??= []).push(ext.slice(1));
    }

    // webm before mp4: the browser picks the first it can play.
    for (const key of Object.keys(motion)) {
        motion[key].sort((a, b) => (a === 'webm' ? -1 : b === 'webm' ? 1 : 0));
    }

    /* Short content hash per tile. Eight hex characters is ample for a couple
       of dozen files; the file name is hashed alongside the bytes so that
       renaming a variant also moves the version. */
    const version = {};
    for (const name of Object.keys(members).sort()) {
        const hash = createHash('sha256');
        for (const file of members[name].sort()) {
            hash.update(file);
            hash.update(await readFile(path.join(ART, file)));
        }
        version[name] = hash.digest('hex').slice(0, 8);
    }

    const names = Object.keys(motion).sort();

    const body = `/**
 * GENERATED  do not edit.
 * Written by scripts/generate-art-manifest.mjs from the contents of
 * public/art/. Add or remove a file there and re-run \`npm run artwork\`.
 */
export const ART_MOTION = ${JSON.stringify(
        Object.fromEntries(names.map((n) => [n, motion[n]])),
        null,
        4,
    )};

/**
 * Content hash per tile, appended to every /art/ URL as a \`?v=\` query.
 *
 * These file names never change and /art/ is cached for thirty days, so
 * without this a replaced tile stays invisible to every returning visitor.
 * See the header of scripts/generate-art-manifest.mjs.
 */
export const ART_VERSION = ${JSON.stringify(version, null, 4)};

/** True when this tile has a motion file to play. */
export const hasMotion = (name) => Boolean(ART_MOTION[name]);

/**
 * Versioned URL for one file of a tile.
 * artUrl('studio.webp', 'studio') -> '/art/studio.webp?v=1a2b3c4d'
 */
export const artUrl = (file, name) => {
    const v = ART_VERSION[name];
    return v ? \`/art/\${file}?v=\${v}\` : \`/art/\${file}\`;
};
`;

    await writeFile(OUT, body, 'utf8');

    const tiles = Object.keys(version).length;
    console.log(
        names.length
            ? `Art manifest: ${tiles} tile(s) versioned, ${names.length} animated  ${names.join(', ')}`
            : `Art manifest: ${tiles} tile(s) versioned, none animated (all render as stills)`,
    );
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
