/**
 * Lightweight service index — navigation metadata only.
 *
 * ── Why this exists separately ───────────────────────────────────────────
 * The navbar, the footer, the homepage capability cards and the 404 all need
 * to *list* the services. If they import the full content modules to do it,
 * every page on the site ships all eight service pages' worth of prose in the
 * main bundle, because the array references every module and there is nothing
 * for the bundler to tree-shake.
 *
 * So the shell reads this file, and only <ServicePage> — which is lazily
 * loaded per route — reads the full modules.
 *
 * The duplication is deliberate and it is checked: scripts/verify-content.mjs
 * imports both this file and the full modules and fails the build if any
 * field disagrees, so drift cannot reach production.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const SERVICE_LIST = [
    {
        slug: 'web-development',
        nav: 'Web Development',
        short: 'Web development',
        art: 'service-web-development',
        description:
            'Custom web development from Korame: hand-built React frontends, Node APIs, cloud deployment and Core Web Vitals held to a budget. No templates, no page builders.',
        chips: ['React', 'Vite', 'TypeScript'],
    },
    {
        slug: 'web-design',
        nav: 'Web Design',
        short: 'Web design',
        art: 'service-web-design',
        description:
            'Design systems, interaction and motion design, accessibility and responsive layout — drawn by the engineers who build it, against what browsers render fast.',
        chips: ['CSS custom properties', 'Tailwind CSS v4', 'Design tokens'],
    },
    {
        slug: 'web-app-development',
        nav: 'Web App Development',
        short: 'Web app development',
        art: 'service-web-app-development',
        description:
            'Custom web application development: SaaS products, dashboards, customer portals and internal tools, with authentication, roles and cloud deployment built in.',
        chips: ['React', 'TypeScript', 'Client + server state'],
    },
    {
        slug: 'full-stack-development',
        nav: 'Full-Stack Development',
        short: 'Full-stack development',
        art: 'service-full-stack-development',
        description:
            'Full-stack development from one team: React frontends, Node APIs, schema design, authentication, cloud deployment and monitoring — owned end to end.',
        chips: ['React', 'Vite', 'TypeScript'],
    },
    {
        slug: 'app-development',
        nav: 'App Development',
        short: 'App development',
        art: 'service-app-development',
        description:
            'Application development: installable web apps, cross-platform interfaces, and the APIs, authentication and cloud infrastructure behind them.',
        chips: ['React', 'Progressive Web App', 'Service workers'],
    },
    {
        slug: 'software-development',
        nav: 'Software Development',
        short: 'Software development',
        art: 'service-software-development',
        description:
            'Software engineering services: application architecture, backend systems, APIs, data modelling, integrations and cloud deployment — built to be maintained.',
        chips: ['JavaScript', 'TypeScript', 'SQL'],
    },
    {
        slug: 'custom-software-development',
        nav: 'Custom Software',
        short: 'Custom software development',
        art: 'service-custom-software-development',
        description:
            'Bespoke software shaped around how your business actually works — plus an honest assessment of when off-the-shelf is the better buy. Discovery to handover.',
        chips: ['React', 'TypeScript', 'Node.js'],
    },
    {
        slug: 'cloud-solutions',
        nav: 'Cloud Solutions',
        short: 'Cloud solutions',
        art: 'service-cloud-solutions',
        description:
            'Cloud solutions on Azure: static-first hosting on a CDN, serverless APIs, GitHub Actions pipelines, custom domains and infrastructure sized to real traffic.',
        chips: ['Azure Static Web Apps', 'CDN / edge caching', 'Managed TLS'],
    },
];

export const SERVICE_SLUGS = SERVICE_LIST.map((s) => s.slug);

export const serviceBySlug = (slug) => SERVICE_LIST.find((s) => s.slug === slug);

/** Service pages sit at the root: /web-development, not /services/web-development. */
export const servicePath = (slug) => `/${slug}`;
