export default {
    slug: 'web-app-development',
    nav: 'Web App Development',
    short: 'Web app development',
    title: 'Web App Development Services | Custom Web Applications | Korame',
    description:
        'Custom web application development: SaaS products, dashboards, customer portals and internal tools, with authentication, roles and cloud deployment built in.',
    h1: 'Web applications that behave under real use',
    kicker: 'Web app development',
    art: 'work-saas',
    serviceType: 'Web application development',
    lede: 'A website presents. An application does work — it holds state, enforces rules, and has to be correct when two people touch the same record at once. The engineering difference is not cosmetic, and pretending otherwise is how projects end up rewritten a year after launch.',

    whatItIs: {
        heading: 'Where a website ends and an application begins',
        body: [
            'The line is state. If the page shows the same thing to everyone and nothing the visitor does persists, it is a website, and the right architecture is static output on a CDN. The moment there are accounts, saved records, permissions or workflows, it becomes an application, and the questions change: who is allowed to see this, what happens on a conflicting write, how does this behave when the network drops halfway through a save.',
            'Web applications get built in the browser rather than installed, which means one deployment for every platform and no app-store review between a fix and your users. The trade is that you carry the responsibilities a native runtime would otherwise handle — session management, offline behaviour, and performance on hardware you do not control.',
        ],
    },

    provide: [
        {
            title: 'SaaS products',
            body: 'Multi-tenant data separation, subscription and plan state, onboarding, and an admin surface for the people who have to support it.',
        },
        {
            title: 'Dashboards and analytics',
            body: 'Query-backed views that stay responsive at real data volume — server-side aggregation, pagination, and charts that do not re-render the world on every filter change.',
        },
        {
            title: 'Customer portals',
            body: 'Authenticated areas where customers see their own orders, documents, invoices or cases, with access enforced per record rather than per page.',
        },
        {
            title: 'Internal and admin platforms',
            body: 'Tools for the team: bulk actions, audit trails, permissions, and the unglamorous screens that decide whether staff actually use the system.',
        },
        {
            title: 'API-driven applications',
            body: 'Front ends built against a clear API contract, so the same backend can later serve a mobile client or a partner integration without a rewrite.',
        },
        {
            title: 'Enterprise applications',
            body: 'Role hierarchies, single sign-on, exportable audit logs, and the integration work that connects a new system to the ones already running.',
        },
    ],

    audience: [
        {
            title: 'Software businesses shipping their first real product',
            body: 'The version customers pay for, which is a different engineering problem from the version that won the pitch.',
        },
        {
            title: 'Operations teams running on spreadsheets',
            body: 'When a shared workbook has become the system of record, the failure modes are silent and the recovery is manual.',
        },
        {
            title: 'Companies serving customers over email',
            body: 'A portal turns a support queue into self-service, and turns your team\'s time back into capacity.',
        },
    ],

    problems: [
        {
            title: 'It slows to a crawl once the data is real',
            body: 'Unpaginated lists, aggregation done in the browser, and no indexes. Fixable, and much cheaper to design correctly than to retrofit.',
        },
        {
            title: 'Permissions are enforced in the UI',
            body: 'A hidden button is not a permission. If the API will answer the request, the control does not exist. Authorisation belongs on the server, checked per record.',
        },
        {
            title: 'Losing work on a bad connection',
            body: 'Long forms with no draft state, saves with no retry, and actions with no idempotency key, so a flaky network turns into a duplicate record.',
        },
        {
            title: 'Nobody can support it',
            body: 'No audit trail, no admin view, no way to answer "why does this account look like this" without database access.',
        },
    ],

    approach: [
        {
            title: 'Map the workflows, not the screens',
            body: 'What a user is actually trying to finish, and what state the system must hold between steps. Screens fall out of that; the reverse produces applications that look complete and cannot complete a task.',
        },
        {
            title: 'Design the permission model early',
            body: 'Roles, ownership and visibility are structural. Adding them later touches every query in the system.',
        },
        {
            title: 'Build the hardest screen first',
            body: 'The densest, most stateful view, at realistic data volume. If the architecture survives that, the rest is straightforward.',
        },
        {
            title: 'Ship behind a flag',
            body: 'Features reach production early and are enabled deliberately, so releasing is a decision rather than an event.',
        },
    ],

    tech: [
        { group: 'Application', items: ['React', 'TypeScript', 'Client + server state'] },
        { group: 'API', items: ['Node.js', 'REST', 'Azure Functions'] },
        { group: 'Data', items: ['PostgreSQL', 'SQL Server', 'Redis / caching'] },
        { group: 'Platform', items: ['Azure Static Web Apps', 'GitHub Actions', 'Managed identity'] },
    ],

    pillars: [
        {
            title: 'Authentication and authorisation',
            body: 'Managed identity providers rather than home-grown credential storage, short-lived tokens with server-side revocation, session handling that survives a refresh, and per-record authorisation checked in the API on every request.',
        },
        {
            title: 'Security',
            body: 'Server-side validation, parameterised queries, output encoding, rate limiting on anything expensive or guessable, a Content-Security-Policy that actually restricts something, secrets in the platform vault, and dependency auditing on every build.',
        },
        {
            title: 'Scalability',
            body: 'Stateless request handling, pagination and cursor-based lists by default, server-side aggregation, caching separated into per-user and shared layers, and background jobs for anything that must not hold a request open.',
        },
        {
            title: 'Cloud deployment',
            body: 'Static assets on a CDN, API on serverless functions that scale to zero between bursts, environments per branch, and infrastructure that is inexpensive while you are small and does not need re-architecting when you are not.',
        },
        {
            title: 'Reliability',
            body: 'Error tracking with stack traces, structured request logging, uptime monitoring, and defined behaviour for the failure cases most projects skip — expired session mid-action, duplicate submit, partial network failure.',
        },
    ],

    useCases: [
        'A SaaS product with accounts, plans and a billing state to respect',
        'A customer portal for orders, documents or case history',
        'An internal admin platform replacing manual processes',
        'An operations dashboard aggregating data from several systems',
        'A booking, scheduling or approval workflow with roles and notifications',
    ],

    faqs: [
        {
            q: 'What is the difference between web development and web app development?',
            a: 'Web development covers sites that present information; the architecture optimises for load speed and search visibility. Web app development covers systems that hold state and enforce rules for signed-in users; the architecture optimises for correctness, permissions and behaviour under concurrent use. Most projects are clearly one or the other, and the cost of guessing wrong is a rebuild.',
        },
        {
            q: 'Can a web app work offline?',
            a: 'Partly, and it is worth scoping deliberately. Caching the shell and read-only data is straightforward. Offline writes with conflict resolution are a substantial piece of engineering, so we only build them where the use case genuinely demands it.',
        },
        {
            q: 'How do you handle multi-tenancy?',
            a: 'Tenant identity is part of the data model and every query is scoped to it at the API layer, not by filtering in the client. Which isolation model — shared schema, schema per tenant, or database per tenant — depends on your compliance requirements and expected scale.',
        },
        {
            q: 'Do you integrate payments?',
            a: 'Yes, through established providers. Card data never touches your servers: the provider hosts the sensitive fields and your application handles the resulting tokens and webhooks. That is both safer and dramatically less compliance work.',
        },
    ],

    projects: ['kepaso', 'nomadninja'],
    related: ['full-stack-development', 'software-development', 'cloud-development', 'app-development'],
};
