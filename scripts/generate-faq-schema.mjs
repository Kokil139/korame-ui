/**
 * Regenerates the FAQPage JSON-LD block in index.html from the FAQS array in
 * src/components/Faq.jsx.
 *
 * Google treats structured data that does not match the visible page as a
 * rich-result violation, and two hand-maintained copies of the same content
 * always diverge eventually. This makes the component the single source of
 * truth and the markup a build artefact.
 *
 * Runs as part of `npm run assets`, and standalone via `npm run faq-schema`.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const START = '<!-- FAQ_SCHEMA:START -->';
const END = '<!-- FAQ_SCHEMA:END -->';

/**
 * Pull the FAQS array out of the component without importing it — the file
 * is JSX and imports React, so it cannot be `import()`ed from plain Node.
 */
function extractFaqs(source) {
    const start = source.indexOf('export const FAQS = [');
    if (start === -1) throw new Error('FAQS array not found in Faq.jsx');

    // Walk brackets to find the matching close, so nested braces are safe.
    const open = source.indexOf('[', start);
    let depth = 0;
    let end = -1;
    for (let i = open; i < source.length; i++) {
        if (source[i] === '[') depth++;
        else if (source[i] === ']') {
            depth--;
            if (depth === 0) {
                end = i;
                break;
            }
        }
    }
    if (end === -1) throw new Error('Unterminated FAQS array');

    const literal = source.slice(open, end + 1);
    // The array is plain data (string literals only), so this is safe to eval
    // in-process. It is our own source file, not user input.
    return Function(`"use strict"; return (${literal});`)();
}

const escapeJson = (s) => JSON.stringify(s).slice(1, -1);

async function main() {
    const faqSource = await readFile(
        path.join(ROOT, 'src/components/Faq.jsx'),
        'utf8',
    );
    const faqs = extractFaqs(faqSource);

    if (!faqs.length) throw new Error('No FAQs to emit');

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': 'https://korame.in/#faq',
        mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    };

    const block = [
        START,
        '    <script type="application/ld+json">',
        JSON.stringify(schema, null, 2)
            .split('\n')
            .map((l) => `    ${l}`)
            .join('\n'),
        '    </script>',
        `    ${END}`,
    ].join('\n');

    const htmlPath = path.join(ROOT, 'index.html');
    const html = await readFile(htmlPath, 'utf8');

    const s = html.indexOf(START);
    const e = html.indexOf(END);
    if (s === -1 || e === -1) {
        throw new Error(
            `Markers ${START} / ${END} not found in index.html — add them inside <head>.`,
        );
    }

    const next = html.slice(0, s) + block + html.slice(e + END.length);
    await writeFile(htmlPath, next, 'utf8');

    console.log(`FAQ schema written: ${faqs.length} questions`);
    void escapeJson;
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
