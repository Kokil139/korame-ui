/**
 * Verify the built output before it is deployed.
 *
 * scripts/verify-content.mjs checks the source data. This checks what
 * actually came out the other end, which is where the interesting failures
 * live: a route that silently rendered the empty SPA shell, a page that lost
 * its canonical, two pages that ended up with the same title, JSON-LD that
 * does not parse.
 *
 * All of those are invisible in a browser and expensive in a search index,
 * which is exactly the class of bug worth failing a build over.
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ROUTES, REDIRECTS } from '../src/lib/routes.js';
import { url } from '../src/lib/site.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, '..', 'dist');

const errors = [];
const fail = (route, message) => errors.push(`${route}: ${message}`);

const fileFor = (route) =>
    route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html');

const stripTags = (html) =>
    html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const titles = new Map();
const descriptions = new Map();

/**
 * Internal link targets, collected as we go and checked at the end.
 *
 * A broken internal link is the cheapest SEO mistake to make and one of the
 * more expensive to leave: it wastes crawl budget, it strands whatever it
 * pointed at, and nothing in a normal build ever mentions it.
 */
const knownRoutes = new Set(ROUTES.map((r) => r.path));
const redirectSources = new Set(REDIRECTS.map((r) => r.from));
const linkTargets = new Map(); // href -> route that links to it

for (const { path: route } of ROUTES) {
    const file = fileFor(route);

    if (!existsSync(file)) {
        fail(route, 'no HTML file was written for this route');
        continue;
    }

    const html = await readFile(file, 'utf8');

    /* 1. The route actually rendered. An unrendered SPA shell is a few
       hundred bytes and would otherwise deploy without complaint. */
    if (html.includes('<!--app-html-->')) {
        fail(route, 'the app placeholder was never replaced  this route did not render');
    }
    if (html.includes('<!--SEO:START-->')) {
        fail(route, 'the SEO placeholder was never replaced  this route has the fallback head');
    }

    const text = stripTags(html);
    if (text.length < 600) {
        fail(route, `only ${text.length} characters of text  the page looks empty`);
    }

    /* 2. Exactly one <h1>. */
    const h1s = [...html.matchAll(/<h1[\b>][\s\S]*?<\/h1>/gi)];
    if (h1s.length !== 1) fail(route, `${h1s.length} <h1> elements (expected exactly 1)`);

    /* 3. Unique title and description. Duplicates are what make Google
       collapse two URLs into one result. */
    const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
    if (!title) {
        fail(route, 'no <title>');
    } else if (titles.has(title)) {
        fail(route, `duplicate <title>, shared with ${titles.get(title)}`);
    } else {
        titles.set(title, route);
    }

    const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1];
    if (!description) {
        fail(route, 'no meta description');
    } else if (descriptions.has(description)) {
        fail(route, `duplicate meta description, shared with ${descriptions.get(description)}`);
    } else {
        descriptions.set(description, route);
    }

    /* 4. Canonical points at this route, on the production origin. */
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/i)?.[1];
    if (!canonical) {
        fail(route, 'no canonical link');
    } else if (canonical !== url(route)) {
        fail(route, `canonical is "${canonical}", expected "${url(route)}"`);
    }

    /* 5. Open Graph essentials, which social scrapers read and never
       execute JavaScript to find. */
    for (const property of ['og:title', 'og:description', 'og:url', 'og:image']) {
        if (!html.includes(`property="${property}"`)) fail(route, `missing ${property}`);
    }

    /* 6. Structured data parses. A JSON-LD block with a syntax error is
       ignored in full and reports nothing in the browser. */
    /* `[^>]*` because the pre-rendered tag carries data-seo  see the note in
       scripts/prerender.mjs on why it has to. */
    const blocks = [
        ...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
    ];
    if (!blocks.length) {
        fail(route, 'no JSON-LD');
    }
    for (const [, body] of blocks) {
        try {
            const parsed = JSON.parse(body);
            if (!parsed['@context']) fail(route, 'JSON-LD has no @context');
        } catch (error) {
            fail(route, `JSON-LD does not parse: ${error.message}`);
        }
    }

    /* 7. The robots directive must not be noindex on an indexable route. */
    const robots = html.match(/<meta name="robots" content="([^"]*)"/i)?.[1] ?? '';
    if (robots.includes('noindex')) fail(route, 'marked noindex but listed in the sitemap');

    /* 8. Collect internal links for the cross-check below. */
    for (const [, href] of html.matchAll(/<a\s[^>]*href="(\/[^"#?]*)"/g)) {
        const target = href.length > 1 && href.endsWith('/') ? href.slice(0, -1) : href;
        if (!linkTargets.has(target)) linkTargets.set(target, route);
    }
}

/* 9. Every internal link resolves  to a route, a declared redirect, or a
   real file in dist (favicon, manifest, artwork). */
for (const [href, from] of linkTargets) {
    if (knownRoutes.has(href) || redirectSources.has(href)) continue;
    if (existsSync(path.join(dist, href.slice(1)))) continue;
    fail(from, `links to "${href}", which is neither a route nor a file in dist/`);
}

/* 10. The 404 document exists and is noindex  it is referenced by
   responseOverrides in staticwebapp.config.json. */
const notFound = path.join(dist, '404.html');
if (!existsSync(notFound)) {
    fail('/404', '404.html was not written');
} else {
    const html = await readFile(notFound, 'utf8');
    if (!/<meta name="robots" content="[^"]*noindex/i.test(html)) {
        fail('/404', '404.html is not marked noindex');
    }
}

/* 11. sitemap.xml and robots.txt made it into the output. */
for (const asset of ['sitemap.xml', 'robots.txt', 'staticwebapp.config.json']) {
    if (!existsSync(path.join(dist, asset))) fail('/', `${asset} is missing from dist/`);
}

/**
 * 12. The Azure config is present, parseable and carries the security headers.
 *
 * Azure does not reject a malformed staticwebapp.config.json  it ignores it.
 * The site deploys with no headers, no navigation fallback and no redirects,
 * and nothing anywhere says so. That is worth failing a build over.
 */
const configPath = path.join(dist, 'staticwebapp.config.json');
if (existsSync(configPath)) {
    const raw = await readFile(configPath, 'utf8');

    if (raw.includes('__INLINE_SCRIPT_HASHES__')) {
        fail('/', 'staticwebapp.config.json still contains the CSP hash placeholder');
    }

    let config;
    try {
        config = JSON.parse(raw);
    } catch (error) {
        fail('/', `staticwebapp.config.json is not valid JSON: ${error.message}`);
    }

    if (config) {
        const headers = config.globalHeaders ?? {};

        /* Header names are matched case-insensitively so a rename cannot slip
           past this check by changing capitalisation. */
        const lower = Object.fromEntries(
            Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]),
        );

        const csp = lower['content-security-policy'];
        if (!csp) {
            fail('/', 'no Content-Security-Policy in globalHeaders');
        } else {
            /* Each of these is a directive the scanner scores, or one whose
               absence quietly widens the policy. */
            for (const directive of [
                'default-src',
                'base-uri',
                'object-src',
                'frame-ancestors',
                'form-action',
                'script-src',
                'upgrade-insecure-requests',
            ]) {
                if (!csp.includes(directive)) fail('/', `CSP is missing ${directive}`);
            }

            /* The whole point of hashing the theme script is to avoid these. */
            if (/script-src[^;]*'unsafe-inline'/.test(csp)) {
                fail('/', "CSP allows 'unsafe-inline' in script-src");
            }
            if (csp.includes("'unsafe-eval'")) fail('/', "CSP allows 'unsafe-eval'");

            if (!/script-src[^;]*'sha256-/.test(csp)) {
                fail('/', 'CSP script-src carries no hash  the inline theme script would be blocked');
            }
        }

        const hsts = lower['strict-transport-security'] ?? '';
        const maxAge = Number(hsts.match(/max-age=(\d+)/)?.[1] ?? 0);
        if (maxAge < 31536000) {
            fail('/', `HSTS max-age is ${maxAge || 'unset'}, needs at least 31536000`);
        }
        if (!/includeSubDomains/i.test(hsts)) fail('/', 'HSTS is missing includeSubDomains');
        if (!/preload/i.test(hsts)) fail('/', 'HSTS is missing preload');

        if ((lower['x-frame-options'] ?? '').toUpperCase() !== 'SAMEORIGIN') {
            fail('/', 'x-frame-options is not SAMEORIGIN');
        }
        if ((lower['x-content-type-options'] ?? '') !== 'nosniff') {
            fail('/', 'x-content-type-options is not nosniff');
        }
        if (!lower['referrer-policy']) fail('/', 'no referrer-policy');

        /* A navigation fallback that catches assets serves HTML with a 200 for
           every missing file  the soft-404 pattern. */
        const exclude = config.navigationFallback?.exclude ?? [];
        if (!config.navigationFallback?.rewrite) {
            fail('/', 'no navigationFallback  deep links would 404 on refresh');
        } else if (!exclude.length) {
            fail('/', 'navigationFallback has no exclude list  missing assets would return 200 HTML');
        }
    }
}

if (errors.length) {
    console.error('\nBuild verification failed:\n');
    for (const message of errors) console.error(`  error  ${message}`);
    console.error('');
    process.exit(1);
}

console.log(`build ok  ${ROUTES.length} routes verified, plus 404, sitemap and robots`);
