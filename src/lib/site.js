/**
 * Single source of truth for everything that has to agree across the
 * document head, the JSON-LD graph, the sitemap and the footer.
 *
 * Anything hardcoded in two places eventually disagrees in one of them, and
 * a canonical URL that disagrees with the sitemap is the kind of bug that
 * costs you an index entry without ever throwing.
 */

export const SITE = {
    name: 'Korame',
    legalName: 'Korame',
    /** No trailing slash — `url()` below adds exactly one separator. */
    origin: 'https://korame.in',
    email: 'letsbuild@korame.in',
    phone: '+91-88260-30869',
    /** wa.me wants the number bare, with country code and no punctuation. */
    whatsapp: '918826030869',
    instagram: 'https://www.instagram.com/korame.in/',
    locale: 'en_IN',
    lang: 'en',
    country: 'IN',
    tagline: 'Software engineering studio',
};

/** Absolute URL for a site-relative path. `/` in, `https://korame.in/` out. */
export const url = (path = '/') =>
    path === '/' ? `${SITE.origin}/` : `${SITE.origin}${path.startsWith('/') ? path : `/${path}`}`;

/**
 * The default social card. Per-page images can be added later by passing
 * `image` to <Seo>; until then one card is better than a broken one.
 */
export const OG_IMAGE = {
    url: url('/og-image.png'),
    width: 1200,
    height: 630,
    alt: 'Korame — web, application and cloud engineering.',
};

/**
 * What Korame actually works with. This feeds the Organization `knowsAbout`
 * and the technology strips on the service pages, so it must stay honest —
 * every entry here is something represented in the shipped projects or in
 * this site's own build.
 */
export const STACK = {
    frontend: ['React', 'Vite', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Motion'],
    backend: ['Node.js', 'REST APIs', 'Serverless functions'],
    data: ['PostgreSQL', 'SQL Server', 'Document stores'],
    cloud: ['Azure Static Web Apps', 'Azure Functions', 'GitHub Actions', 'CDN & edge caching'],
    practice: ['Core Web Vitals', 'WCAG 2.2 AA', 'Structured data', 'CI/CD'],
};

/** Primary navigation. Order is the order a first-time visitor should meet it. */
export const NAV = [
    { name: 'Services', href: '/services' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Projects', href: '/projects' },
    { name: 'Free audit', href: '/free-website-audit' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
];
