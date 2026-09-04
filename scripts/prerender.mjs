/**
 * Pre-render every route to static HTML.
 *
 * ── Why ──────────────────────────────────────────────────────────────────
 * A client-rendered SPA ships one document  `<div id="root"></div>`  with
 * one title for every URL. Google will execute the JavaScript eventually, but
 * "eventually" is a queue, and social card scrapers do not execute it at all,
 * so an Open Graph title injected at runtime is invisible to every one of them.
 *
 * This script renders each route in Node and writes it as its own file, so
 * Azure serves a complete document with the correct <head> straight from the
 * CDN edge. React then hydrates that markup rather than building it.
 *
 * It also means the navigation fallback in staticwebapp.config.json only ever
 * catches genuine mistakes: every real URL is a real file on disk.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Runs after `vite build` and after the SSR bundle is built. See the `build`
 * script in package.json for the ordering.
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, '.ssr');

const SEO_MARKER = /<!--SEO:START-->[\s\S]*?<!--SEO:END-->/;
const APP_MARKER = '<!--app-html-->';

/** Escape for an HTML attribute value. */
const attr = (value) =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

/** Escape for text content inside <title>. */
const escapeText = (value) =>
    String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Serialise the JSON-LD graph for embedding in a <script> block.
 *
 * Two hazards, both of which produce a broken page rather than a warning:
 * a literal `</script>` inside any string would close the tag early and dump
 * the rest of the graph into the document as markup, and U+2028 / U+2029 are
 * legal in JSON but terminate a line in JavaScript.
 */
const jsonForScript = (value) =>
    JSON.stringify(value)
        .replace(/</g, '\\u003c')
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');

function headToHtml(head) {
    const lines = [`<title>${escapeText(head.title)}</title>`];

    for (const tag of head.meta) {
        if (tag.content == null) continue;
        const key = tag.name ? `name="${attr(tag.name)}"` : `property="${attr(tag.property)}"`;
        lines.push(`<meta ${key} content="${attr(tag.content)}" />`);
    }

    lines.push(`<link rel="canonical" href="${attr(head.canonical)}" data-seo />`);

    /**
     * `data-seo` is not decoration.
     *
     * <Seo>'s client path removes `script[type="application/ld+json"][data-seo]`
     * before writing the new route's graph. Without the attribute here, the
     * pre-rendered block is not recognised as ours, so hydration leaves it in
     * place and appends a second one  every page would then ship two copies
     * of the graph, with duplicate @id nodes.
     */
    if (head.jsonLd) {
        lines.push(
            `<script type="application/ld+json" data-seo>${jsonForScript(head.jsonLd)}</script>`,
        );
    }

    return lines.map((line) => `    ${line}`).join('\n');
}

/** `/` -> dist/index.html, `/blog/x` -> dist/blog/x/index.html */
function outputPathFor(route) {
    if (route === '/') return path.join(dist, 'index.html');
    return path.join(dist, route.replace(/^\//, ''), 'index.html');
}

async function main() {
    const templatePath = path.join(dist, 'index.html');
    if (!existsSync(templatePath)) {
        throw new Error('dist/index.html not found  run `vite build` first.');
    }

    const template = await readFile(templatePath, 'utf8');

    if (!SEO_MARKER.test(template)) {
        throw new Error(
            'The <!--SEO:START--> / <!--SEO:END--> markers are missing from index.html. ' +
                'Without them every route would ship the same <head>.',
        );
    }
    if (!template.includes(APP_MARKER)) {
        throw new Error(`The ${APP_MARKER} marker is missing from index.html.`);
    }

    /* The SSR bundle re-exports ROUTES so the list is read from source rather
       than duplicated here  a route added to the registry is pre-rendered and
       sitemapped without touching this file. */
    const entry = pathToFileURL(path.join(ssrDir, 'entry-server.js')).href;
    const { render, ROUTES } = await import(entry);

    let written = 0;
    const failures = [];

    for (const { path: route } of ROUTES) {
        try {
            const { html, head } = await render(route);

            if (!head) throw new Error('no <Seo> descriptor was produced for this route');

            const document = template
                .replace(SEO_MARKER, headToHtml(head).trimStart())
                .replace(APP_MARKER, html);

            const outPath = outputPathFor(route);
            await mkdir(path.dirname(outPath), { recursive: true });
            await writeFile(outPath, document, 'utf8');

            written += 1;
            console.log(`  ${route.padEnd(34)} -> ${path.relative(root, outPath)}`);
        } catch (error) {
            failures.push({ route, error });
            console.error(`  ${route.padEnd(34)} FAILED: ${error.message}`);
        }
    }

    /**
     * A 404 document, rendered from the same app so a missing page still
     * carries the site's design and navigation rather than the host's default
     * page. Referenced by responseOverrides in staticwebapp.config.json, which
     * is what makes it return an actual 404 status.
     */
    try {
        const { html, head } = await render('/__not-found__');
        await writeFile(
            path.join(dist, '404.html'),
            template.replace(SEO_MARKER, headToHtml(head).trimStart()).replace(APP_MARKER, html),
            'utf8',
        );
        console.log(`  ${'404'.padEnd(34)} -> dist/404.html`);
    } catch (error) {
        failures.push({ route: '/404', error });
        console.error(`  404 FAILED: ${error.message}`);
    }

    await rm(ssrDir, { recursive: true, force: true });

    if (failures.length) {
        console.error(`\nPre-render failed for ${failures.length} route(s).`);
        process.exit(1);
    }

    console.log(`\nPre-rendered ${written} routes + 404.`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
