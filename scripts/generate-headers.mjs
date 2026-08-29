/**
 * Finish the Content-Security-Policy in the deployed Azure config.
 *
 * ── Why this is generated rather than written by hand ─────────────────────
 * `index.html` carries one inline script: the blocking snippet that applies
 * the theme class before first paint. It has to stay inline — moving it to a
 * file would add a blocking round trip in front of the paint it exists to
 * protect — so the CSP has to allow it by hash.
 *
 * A hash pasted into the config by hand stops matching the moment anyone edits
 * that script by a single character, and the failure is silent and severe: the
 * script is blocked, the theme class is never applied, and every dark-mode
 * visitor gets a white flash on every navigation. Computing it from the built
 * HTML means the two cannot drift.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * `<script type="application/ld+json">` blocks are deliberately NOT hashed.
 * They are data blocks, not scripts: the HTML spec returns from "prepare the
 * script element" before the CSP check for any non-JavaScript type, so
 * script-src never applies to them. Hashing them would be impossible anyway —
 * the graph differs per route and this config is global.
 *
 * Runs after prerender, against dist/. See the `build` script in package.json.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, '..', 'dist');

const PLACEHOLDER = '__INLINE_SCRIPT_HASHES__';

/** Matches a <script> with no `src`, capturing its attributes and body. */
const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;

/**
 * A script element only runs as JavaScript when it has no `type`, or a type
 * the HTML spec recognises as classic or module. Anything else — importmap,
 * application/ld+json, text/template — is a data block the parser never
 * executes, so script-src does not govern it.
 */
function isExecutable(attrs) {
    const type = attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i)?.[1]?.toLowerCase();
    if (!type) return true;
    return type === 'module' || type === 'text/javascript' || type === 'application/javascript';
}

/**
 * CSP hashes the *exact* bytes between the tags, with no trimming. Getting
 * this wrong by one whitespace character produces a hash that never matches.
 */
const sha256 = (source) => `'sha256-${createHash('sha256').update(source, 'utf8').digest('base64')}'`;

async function main() {
    const configPath = path.join(dist, 'staticwebapp.config.json');
    const htmlPath = path.join(dist, 'index.html');

    if (!existsSync(configPath)) {
        throw new Error(
            'dist/staticwebapp.config.json is missing. It should have been copied from public/ ' +
                'by `vite build` — check that it still exists in public/.',
        );
    }
    if (!existsSync(htmlPath)) {
        throw new Error('dist/index.html is missing — run the build before this script.');
    }

    const html = await readFile(htmlPath, 'utf8');

    const hashes = [];
    for (const [, attrs, body] of html.matchAll(INLINE_SCRIPT)) {
        if (!isExecutable(attrs)) continue;
        if (!body.trim()) continue;
        const hash = sha256(body);
        if (!hashes.includes(hash)) hashes.push(hash);
    }

    if (!hashes.length) {
        /* Not an error in itself, but it almost certainly means the regex
           stopped matching rather than that the script genuinely went away —
           and the result would be a CSP that blocks a script nobody noticed. */
        console.warn(
            '  warn  no executable inline scripts found in dist/index.html. If the theme ' +
                'script is still there, the extraction is broken.',
        );
    }

    const raw = await readFile(configPath, 'utf8');
    if (!raw.includes(PLACEHOLDER)) {
        throw new Error(
            `${PLACEHOLDER} is not present in dist/staticwebapp.config.json. The CSP in ` +
                'public/staticwebapp.config.json must contain it so the hashes can be injected.',
        );
    }

    const filled = raw.split(PLACEHOLDER).join(hashes.join(' '));

    /* Parse before writing: an unparseable config is not rejected by Azure, it
       is ignored — the site would deploy with no headers, no fallback and no
       redirects, and nothing would say so. */
    let parsed;
    try {
        parsed = JSON.parse(filled);
    } catch (error) {
        throw new Error(`generated config is not valid JSON: ${error.message}`);
    }

    const csp = parsed.globalHeaders?.['content-security-policy'];
    if (!csp || csp.includes(PLACEHOLDER)) {
        throw new Error('the CSP still contains the placeholder after substitution.');
    }

    await writeFile(configPath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');

    console.log(`  inline script hashes: ${hashes.length || 'none'}`);
    for (const hash of hashes) console.log(`    ${hash}`);
    console.log('  dist/staticwebapp.config.json written with the final CSP.');
}

main().catch((error) => {
    console.error(`\ngenerate-headers failed: ${error.message}\n`);
    process.exit(1);
});
