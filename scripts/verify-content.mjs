/**
 * Guard the one place this codebase duplicates data.
 *
 * `src/content/service-list.js` carries navigation metadata for the eight
 * services so the app shell can list them without importing eight full content
 * modules — see the header comment there for why that split exists. The cost
 * is that a handful of fields appear twice.
 *
 * This script imports both and fails the build if they disagree, which turns
 * the one drift risk in the design into a build error rather than a page that
 * quietly describes itself two different ways.
 *
 * It also checks the things that are cheap to get wrong and expensive to
 * notice: duplicate slugs, cross-links pointing at content that does not
 * exist, missing metadata, and titles or descriptions outside the lengths
 * search engines will actually render.
 */
import { SERVICE_LIST } from '../src/content/service-list.js';
import { SERVICES } from '../src/content/services/index.js';
import { PROJECTS } from '../src/content/projects.js';
import { POSTS } from '../src/content/posts.js';

const errors = [];
const warnings = [];

const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);

/* ---------------------------------------------------------------------
   1. service-list.js must agree with the full modules.
   --------------------------------------------------------------------- */
const MIRRORED = ['nav', 'short', 'art', 'description'];

if (SERVICE_LIST.length !== SERVICES.length) {
    fail(
        `service-list.js has ${SERVICE_LIST.length} entries but there are ${SERVICES.length} service modules.`,
    );
}

for (const entry of SERVICE_LIST) {
    const full = SERVICES.find((s) => s.slug === entry.slug);
    if (!full) {
        fail(`service-list.js lists "${entry.slug}", which has no content module.`);
        continue;
    }

    for (const field of MIRRORED) {
        if (entry[field] !== full[field]) {
            fail(
                `${entry.slug}: "${field}" differs between service-list.js and the content module.\n` +
                    `    list:   ${JSON.stringify(entry[field])}\n` +
                    `    module: ${JSON.stringify(full[field])}`,
            );
        }
    }

    /* The homepage and services index render these chips; they are a slice of
       the module's first technology group. */
    const expectedChips = full.tech[0].items.slice(0, 3);
    if (JSON.stringify(entry.chips) !== JSON.stringify(expectedChips)) {
        fail(
            `${entry.slug}: "chips" should be the first three items of tech[0].\n` +
                `    list:   ${JSON.stringify(entry.chips)}\n` +
                `    module: ${JSON.stringify(expectedChips)}`,
        );
    }
}

for (const service of SERVICES) {
    if (!SERVICE_LIST.some((s) => s.slug === service.slug)) {
        fail(`Service module "${service.slug}" is missing from service-list.js.`);
    }
}

/* ---------------------------------------------------------------------
   2. Slugs are unique, and every cross-link resolves.
   --------------------------------------------------------------------- */
const assertUnique = (items, label) => {
    const seen = new Set();
    for (const item of items) {
        if (seen.has(item.slug)) fail(`Duplicate ${label} slug: "${item.slug}".`);
        seen.add(item.slug);
    }
};

assertUnique(SERVICES, 'service');
assertUnique(PROJECTS, 'project');
assertUnique(POSTS, 'post');

const serviceSlugs = new Set(SERVICES.map((s) => s.slug));
const projectSlugs = new Set(PROJECTS.map((p) => p.slug));
const postSlugs = new Set(POSTS.map((p) => p.slug));

const checkRefs = (owner, refs, valid, label) => {
    for (const ref of refs ?? []) {
        if (!valid.has(ref)) fail(`${owner} links to ${label} "${ref}", which does not exist.`);
    }
};

for (const service of SERVICES) {
    checkRefs(`Service "${service.slug}"`, service.related, serviceSlugs, 'service');
    checkRefs(`Service "${service.slug}"`, service.projects, projectSlugs, 'project');
    if (service.related?.includes(service.slug)) {
        fail(`Service "${service.slug}" lists itself as a related service.`);
    }
}

for (const project of PROJECTS) {
    checkRefs(`Project "${project.slug}"`, project.services, serviceSlugs, 'service');
}

for (const post of POSTS) {
    checkRefs(`Post "${post.slug}"`, post.services, serviceSlugs, 'service');
    checkRefs(`Post "${post.slug}"`, post.related, postSlugs, 'post');
    if (post.related?.includes(post.slug)) {
        fail(`Post "${post.slug}" lists itself as a related article.`);
    }
}

/* ---------------------------------------------------------------------
   3. Metadata that search engines will actually render.

   Titles over ~60 characters and descriptions over ~160 get truncated in the
   results page. These are warnings, not errors — the limits are soft and
   pixel-based rather than exact — but a title nobody can read to the end of
   is a wasted result.
   --------------------------------------------------------------------- */
const pages = [
    ...SERVICES.map((s) => ({ id: `/${s.slug}`, title: s.title, description: s.description })),
    ...PROJECTS.map((p) => ({
        id: `/projects/${p.slug}`,
        title: p.title,
        description: p.description,
    })),
    ...POSTS.map((p) => ({
        id: `/blog/${p.slug}`,
        title: p.metaTitle || p.title,
        description: p.description,
    })),
];

const seenTitles = new Map();
const seenDescriptions = new Map();

for (const page of pages) {
    if (!page.title) fail(`${page.id} has no title.`);
    if (!page.description) fail(`${page.id} has no meta description.`);

    if (page.title && page.title.length > 65) {
        warn(`${page.id}: title is ${page.title.length} chars — likely truncated in results.`);
    }
    if (page.description && page.description.length > 165) {
        warn(
            `${page.id}: description is ${page.description.length} chars — likely truncated in results.`,
        );
    }
    if (page.description && page.description.length < 70) {
        warn(`${page.id}: description is only ${page.description.length} chars — thin.`);
    }

    /* Duplicate titles and descriptions across pages are a real ranking
       problem, not a style issue: they are what makes Google collapse two
       pages into one result. */
    if (seenTitles.has(page.title)) {
        fail(`Duplicate title on ${page.id} and ${seenTitles.get(page.title)}.`);
    }
    seenTitles.set(page.title, page.id);

    if (seenDescriptions.has(page.description)) {
        fail(`Duplicate meta description on ${page.id} and ${seenDescriptions.get(page.description)}.`);
    }
    seenDescriptions.set(page.description, page.id);
}

/* ---------------------------------------------------------------------
   4. Projects must not publish a broken live link.
   --------------------------------------------------------------------- */
for (const project of PROJECTS) {
    if (project.liveUrl && !/^https:\/\//.test(project.liveUrl)) {
        fail(`Project "${project.slug}" has a live URL that is not https.`);
    }
    if (!project.liveUrl && !project.liveNote) {
        warn(
            `Project "${project.slug}" has no live URL and no note explaining why — readers will wonder.`,
        );
    }
}

/* --------------------------------------------------------------------- */
for (const message of warnings) console.warn(`  warn  ${message}`);

if (errors.length) {
    console.error('\nContent verification failed:\n');
    for (const message of errors) console.error(`  error  ${message}`);
    console.error('');
    process.exit(1);
}

console.log(
    `content ok — ${SERVICES.length} services, ${PROJECTS.length} projects, ${POSTS.length} posts` +
        (warnings.length ? ` (${warnings.length} warning${warnings.length > 1 ? 's' : ''})` : ''),
);
