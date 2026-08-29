/* Relative paths with explicit extensions, not the `@/` alias: this module is
   also imported directly by scripts/generate-sitemap.mjs running under plain
   Node, which has no knowledge of Vite's resolver. */
import { SERVICE_LIST, servicePath } from '../content/service-list.js';
import { PROJECTS, projectPath } from '../content/projects.js';
import { POSTS, postPath } from '../content/posts.js';

/**
 * Every indexable URL on the site, derived from the content modules.
 *
 * This is the single list the router, the sitemap generator and the
 * pre-render script all read. Deriving them from one array is the only
 * reliable way to stop a page existing that the sitemap does not know about,
 * or a sitemap entry that 404s — both of which are silent failures that only
 * show up weeks later in Search Console.
 */

/** `priority` and `changefreq` are hints only; Google largely ignores them. */
export const ROUTES = [
    { path: '/', priority: 1.0, changefreq: 'monthly' },
    { path: '/services', priority: 0.9, changefreq: 'monthly' },
    ...SERVICE_LIST.map((s) => ({
        path: servicePath(s.slug),
        priority: 0.9,
        changefreq: 'monthly',
    })),
    { path: '/pricing', priority: 0.8, changefreq: 'monthly' },
    { path: '/projects', priority: 0.8, changefreq: 'monthly' },
    ...PROJECTS.map((p) => ({
        path: projectPath(p.slug),
        priority: 0.7,
        changefreq: 'yearly',
    })),
    { path: '/free-website-audit', priority: 0.8, changefreq: 'monthly' },
    { path: '/about', priority: 0.7, changefreq: 'yearly' },
    { path: '/contact', priority: 0.7, changefreq: 'yearly' },
    { path: '/blog', priority: 0.6, changefreq: 'weekly' },
    ...POSTS.map((p) => ({
        path: postPath(p.slug),
        priority: 0.6,
        changefreq: 'yearly',
        lastmod: p.updated || p.date,
    })),
];

/** Paths that must resolve but must never be indexed or listed in the sitemap. */
export const NOINDEX_ROUTES = ['/404'];

/**
 * Permanent redirects.
 *
 * `/case-studies` was in the original information architecture; publishing it
 * as a second page listing the same projects would be duplicate content, so it
 * redirects to the canonical one instead.
 *
 * `/cloud-development` and `/azure-development` were two pages describing one
 * practice from two angles, competing with each other for the same queries.
 * They are now /cloud-solutions. Both were indexed and linked, so both keep
 * resolving — a 301 passes the ranking on, a 404 throws it away.
 *
 * Every entry here needs a matching rule in public/staticwebapp.config.json:
 * this array is the client-side equivalent, so an in-app link to an old path
 * still resolves, but only the edge can issue a real 301 to a crawler.
 */
export const REDIRECTS = [
    { from: '/case-studies', to: '/projects' },
    { from: '/cloud-development', to: '/cloud-solutions' },
    { from: '/azure-development', to: '/cloud-solutions' },
];

export const ALL_PATHS = ROUTES.map((r) => r.path);
