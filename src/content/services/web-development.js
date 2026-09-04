export default {
    slug: 'web-development',
    nav: 'Web Development',
    short: 'Web development',
    title: 'Web Development Services | Custom Websites & Web Apps | Korame',
    description:
        'Custom web development from Korame: hand-built React frontends, Node APIs, cloud deployment and Core Web Vitals held to a budget. No templates, no page builders.',
    h1: 'Web development that is engineered, not assembled',
    kicker: 'Web development',
    art: 'service-web-development',
    serviceType: 'Web development',
    lede: 'Most of what gets called web development is configuration  a theme, a page builder, a pile of plugins holding each other up. We write the site instead. That costs more upfront and it is the only way to control what a page weighs, how fast it paints, and whether a search engine can read it.',

    whatItIs: {
        heading: 'What web development actually covers',
        body: [
            'Web development is the engineering half of a website: the markup a browser parses, the styles it paints, the JavaScript it runs, the API the page talks to, the database behind that API, and the infrastructure the whole thing is served from. Design decides what a page should look like; development decides whether it loads in 800ms or four seconds, whether it works on a three-year-old Android, and whether Google can index it at all.',
            'The distinction matters commercially because the failures are invisible until they are expensive. A site can look finished and still ship 2MB of unused JavaScript, block its own indexing with a stray directive, or lose every keyboard user at the navigation. None of that shows up in a design review. All of it shows up in analytics.',
        ],
    },

    provide: [
        {
            title: 'Frontend engineering',
            body: 'Semantic HTML, a component architecture that stays legible after the third feature request, and CSS built on design tokens rather than one-off values. React where interactivity earns it; plain markup where it does not.',
        },
        {
            title: 'Backend and APIs',
            body: 'Node services and serverless functions, REST endpoints with real validation at the boundary, and error handling that distinguishes "the user typed something wrong" from "the database is down".',
        },
        {
            title: 'Data modelling',
            body: 'Schema design, indexes chosen against the queries you actually run, and migrations that can be rolled forward in CI rather than applied by hand on a Friday.',
        },
        {
            title: 'Authentication and access control',
            body: 'Session or token-based auth, password and provider sign-in, role checks enforced on the server rather than hidden in the UI, and a considered answer to what happens when a token expires mid-action.',
        },
        {
            title: 'Responsive implementation',
            body: 'One layout system that holds from a 320px phone to an ultrawide, built with fluid type and container-aware components instead of four fixed breakpoints and a prayer.',
        },
        {
            title: 'Cloud deployment and CI',
            body: 'Build, test and deploy wired into a pipeline, preview environments per pull request, and a rollback that takes one click rather than one incident.',
        },
    ],

    audience: [
        {
            title: 'Businesses whose site is the product surface',
            body: 'If people decide whether to trust you on the homepage, the homepage is infrastructure, not marketing collateral.',
        },
        {
            title: 'Teams outgrowing a template',
            body: 'The point where every new requirement means another plugin, and the plugin conflicts with two others, is the point where custom is cheaper.',
        },
        {
            title: 'Founders who need to move without a full team',
            body: 'One engineering partner who can take a problem from schema to deployment, rather than three vendors negotiating a handoff.',
        },
    ],

    problems: [
        {
            title: 'The site is slow and nobody can say why',
            body: 'Usually render-blocking third-party scripts, unoptimised images, and a JavaScript bundle nobody has looked at since launch. We measure first, then cut  and put a budget in CI so it cannot creep back.',
        },
        {
            title: 'Search engines are not seeing the pages',
            body: 'Client-rendered content with no server HTML, missing or duplicated canonicals, and a sitemap that disagrees with the site. Every one of these is fixable and none of them are visible to a human visitor.',
        },
        {
            title: 'Every change needs a developer',
            body: 'Content that lives in code becomes a bottleneck. Where it makes sense we move copy into structured data or a headless CMS so editing is not a deployment.',
        },
        {
            title: 'The codebase has become frightening',
            body: 'No tests, no types, no conventions, and a build only one person understands. That is recoverable, and the first step is making it observable rather than rewriting it.',
        },
    ],

    approach: [
        {
            title: 'Understand the constraint',
            body: 'Before any code: what is this page for, who reaches it, on what device and connection, and what does success actually look like. A brochure site and a checkout have almost nothing in common technically.',
        },
        {
            title: 'Set the budgets first',
            body: 'Performance and accessibility targets are agreed at the start and enforced in the pipeline, because a budget added at the end is a wish, not a constraint.',
        },
        {
            title: 'Build in vertical slices',
            body: 'One complete, deployed, working path through the system before the second one starts. You see running software early, and integration problems surface while they are still cheap.',
        },
        {
            title: 'Harden, then hand over',
            body: 'Error states, empty states, offline behaviour, and a repository you own with the documentation to run it without us.',
        },
    ],

    tech: [
        { group: 'Frontend', items: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Motion'] },
        { group: 'Backend', items: ['Node.js', 'REST APIs', 'Serverless functions'] },
        { group: 'Data', items: ['PostgreSQL', 'SQL Server', 'Document stores'] },
        { group: 'Delivery', items: ['Azure Static Web Apps', 'GitHub Actions', 'CDN caching'] },
    ],

    pillars: [
        {
            title: 'Security',
            body: 'Input validated on the server, output encoded on the way out, secrets in the platform rather than the repository, dependencies pinned and audited, HTTPS with a sane Content-Security-Policy, and authorisation checked at the API rather than assumed by the UI.',
        },
        {
            title: 'Performance',
            body: 'A real budget for Largest Contentful Paint, Interaction to Next Paint and Cumulative Layout Shift. Images in modern formats with explicit dimensions, self-hosted subset fonts, code split by route, and animation restricted to transform and opacity so it stays on the compositor.',
        },
        {
            title: 'Cloud and deployment',
            body: 'Static output on a CDN wherever the content allows it, serverless functions for the parts that need a server, and infrastructure that costs close to nothing at low traffic and does not fall over at high traffic.',
        },
        {
            title: 'Testing',
            body: 'Unit tests on the logic that would be expensive to get wrong, integration tests across the API boundary, and a production build that runs in CI on every pull request  because a build that only works on one laptop is not a build.',
        },
        {
            title: 'Maintenance',
            body: 'Dependency updates on a schedule rather than in a panic, uptime and error monitoring wired up at launch, and a support window after handover. You own the repository and every account from day one.',
        },
    ],

    useCases: [
        'Replacing a template or page-builder site that has stopped scaling',
        'A marketing site where load time and search visibility drive revenue',
        'A content-heavy site that needs structured data and a real information architecture',
        'A frontend rebuild on top of an existing backend or CMS',
        'Recovering a site whose organic traffic dropped after a migration',
    ],

    faqs: [
        {
            q: 'How much does custom web development cost compared with a template?',
            a: 'More upfront, and less over a few years if the site is doing commercial work. A template is the right answer for a simple brochure site and we will say so. Custom development pays for itself when speed, distinctive design, accessibility or fine control over technical SEO affect what you earn.',
        },
        {
            q: 'Do you work with an existing codebase, or only new builds?',
            a: 'Both. Taking over an existing project starts with an audit  dependencies, build, test coverage, performance and accessibility baseline  so we can tell you what is worth keeping before anyone proposes a rewrite.',
        },
        {
            q: 'Which frontend framework do you use?',
            a: 'React with Vite by default, because the ecosystem and hiring pool are the deepest and the build tooling is fast. Where a page has no interactive requirement we ship static HTML instead  the fastest framework is the one you did not load.',
        },
        {
            q: 'Will I be able to edit content without a developer?',
            a: 'Where that is a requirement, yes: we integrate a headless CMS so copy, images and pages are editable without touching code. It is a deliberate scope decision rather than a default, because a CMS adds moving parts a small site may not need.',
        },
        {
            q: 'Who owns the code?',
            a: 'You do, from the first commit. The repository, the cloud accounts and the domain are yours. There is no proprietary layer you would have to license to keep the site running.',
        },
    ],

    projects: ['nomadninja', 'the-travellers-tribe', 'kepaso'],
    related: ['web-design', 'web-app-development', 'full-stack-development', 'cloud-solutions'],
};
