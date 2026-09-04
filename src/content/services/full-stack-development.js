export default {
    slug: 'full-stack-development',
    nav: 'Full-Stack Development',
    short: 'Full-stack development',
    title: 'Full-Stack Development Services | Korame',
    description:
        'Full-stack development from one team: React frontends, Node APIs, schema design, authentication, cloud deployment and monitoring  owned end to end.',
    h1: 'Full-stack development, owned end to end',
    kicker: 'Full-stack development',
    art: 'service-full-stack-development',
    serviceType: 'Full-stack development',
    lede: 'Splitting a system across a frontend vendor and a backend vendor moves the hardest problems into the gap between them. Full-stack means one team is accountable from the database index to the focus ring  and nobody gets to call an integration failure somebody else\'s ticket.',

    whatItIs: {
        heading: 'What "full-stack" should mean',
        body: [
            'Full-stack development is building every layer a feature passes through: the interface, the client state, the API contract, the business logic, the data model, and the infrastructure it all runs on. It is not a claim to be equally expert at every layer  it is a commitment that no layer is somebody else\'s problem.',
            'The practical value is in the seams. Most defects in a working system live at boundaries: an API returning a shape the client did not expect, a timezone converted twice, a validation rule enforced in the form but not on the server, a cache nobody invalidated. When one team owns both sides of a boundary, those defects get designed out instead of discovered in production.',
        ],
    },

    provide: [
        {
            title: 'Frontend',
            body: 'Component architecture, client state, routing, forms and validation, and the loading and error states that separate a demo from a product.',
        },
            {
            title: 'API design',
            body: 'Resource modelling, versioning, pagination, idempotency on anything that writes, and consistent error shapes so the client can handle failure without string matching.',
        },
        {
            title: 'Databases',
            body: 'Schema design against real access patterns, indexes chosen from query plans, and migrations that run in the pipeline rather than by hand.',
        },
        {
            title: 'Authentication and authorisation',
            body: 'Sign-in, sessions or tokens, refresh and revocation, and role or permission checks enforced server-side where they cannot be bypassed by a devtools console.',
        },
        {
            title: 'Cloud and CI/CD',
            body: 'Environments per branch, automated build and test on every pull request, deploys that are boring, and rollbacks that do not require a person to remember the previous version.',
        },
        {
            title: 'Monitoring',
            body: 'Uptime checks, error tracking with real stack traces, and enough logging to answer "what happened to this one user" without redeploying.',
        },
    ],

    audience: [
        {
            title: 'Founders building a first product',
            body: 'One team that can take a feature from idea to production, rather than coordinating three specialists on a schedule none of them share.',
        },
        {
            title: 'Companies with a frontend and no backend (or the reverse)',
            body: 'Half a system is common. Completing it well means respecting what already exists rather than restarting.',
        },
        {
            title: 'Teams whose integration keeps slipping',
            body: 'When "it works locally" and "it works in staging" are different sentences, the fix is usually structural.',
        },
    ],

    problems: [
        {
            title: 'The frontend and backend disagree',
            body: 'Contracts that live in a chat thread instead of in code. We define the shape once and validate against it on both sides, so a mismatch fails a build rather than a customer.',
        },
        {
            title: 'It works until it has real data',
            body: 'Queries with no index, lists with no pagination, and joins nobody profiled. All of these look fine on a seed database of forty rows.',
        },
        {
            title: 'Deploys are events',
            body: 'If shipping requires a calendar entry, the pipeline is the bug. Automated build, test and deploy makes releases small enough to be uninteresting.',
        },
        {
            title: 'Nobody knows when it breaks',
            body: 'Systems without monitoring are debugged by customers. Error tracking and uptime checks belong in the launch scope, not the next quarter.',
        },
    ],

    approach: [
        {
            title: 'Model the domain before the screens',
            body: 'What the entities are, how they relate, and which operations must be atomic. Getting this wrong is the one mistake a UI cannot paper over.',
        },
        {
            title: 'Define the contract',
            body: 'The API shape is agreed and typed before either side is built, so frontend and backend can proceed in parallel without inventing each other.',
        },
        {
            title: 'Ship a vertical slice',
            body: 'One feature working all the way through  UI, API, database, deployed  before the second starts. Integration risk surfaces in week one, not week nine.',
        },
        {
            title: 'Instrument before scaling',
            body: 'Monitoring and error tracking go in before load does, because the first scaling problem you meet is always the one you did not predict.',
        },
    ],

    tech: [
        { group: 'Frontend', items: ['React', 'Vite', 'TypeScript', 'Tailwind CSS'] },
        { group: 'Backend', items: ['Node.js', 'REST APIs', 'Azure Functions'] },
        { group: 'Data', items: ['PostgreSQL', 'SQL Server', 'Document stores'] },
        { group: 'Operations', items: ['GitHub Actions', 'Preview environments', 'Error tracking'] },
    ],

    pillars: [
        {
            title: 'Security',
            body: 'Server-side validation on every input, parameterised queries, secrets held by the platform, least-privilege service identities, dependency auditing in CI, and authorisation enforced at the API layer  the client is a convenience, never a control.',
        },
        {
            title: 'Scalability',
            body: 'Stateless request handling so instances can be added freely, caching at the edge for anything that is not per-user, background jobs for work that must not block a response, and indexes chosen from measured query plans rather than guesses.',
        },
        {
            title: 'Testing',
            body: 'Unit tests on business logic, integration tests across the API boundary, and a full production build in CI on every pull request. The goal is not a coverage number; it is that a regression in the parts that would be expensive to break fails loudly.',
        },
        {
            title: 'Deployment',
            body: 'Every branch gets a preview environment, every merge deploys automatically, and every deploy can be rolled back. Database migrations run as part of the pipeline with a forward path defined before the change ships.',
        },
        {
            title: 'Monitoring',
            body: 'Uptime, error rates and Core Web Vitals from real users, plus structured logs with enough context to trace a single request end to end.',
        },
    ],

    useCases: [
        'A first version of a product that has to be credible with real users, not a prototype',
        'A customer portal with sign-in, roles and per-account data',
        'An internal tool replacing a spreadsheet that has become load-bearing',
        'Adding a real backend to a frontend that has been running on mock data',
        'Taking over a half-finished build and getting it to production',
    ],

    faqs: [
        {
            q: 'What is the difference between full-stack development and web development?',
            a: 'Web development is often used for the site itself  the pages a visitor sees. Full-stack is the wider commitment: the same team also owns the API, the data model and the deployment. A brochure site needs web development. Anything with accounts, saved state or integrations needs full-stack.',
        },
        {
            q: 'Do you build the database as well?',
            a: 'Yes. Schema design, indexing, migrations and the queries the application runs. On projects with an existing database we work with it rather than around it, and say plainly when a schema change is the cheaper option.',
        },
        {
            q: 'Can you take over a project someone else started?',
            a: 'Frequently. It starts with an audit  dependencies, build, tests, security posture, performance  so you get an honest picture of what is worth keeping before anyone proposes a rewrite. Rewrites are usually the most expensive answer and rarely the necessary one.',
        },
        {
            q: 'How do you handle authentication?',
            a: 'By default we use a managed identity provider rather than storing passwords ourselves, because credential storage is a liability with no upside. Where a custom implementation is genuinely required, it uses modern password hashing, short-lived tokens and server-side revocation.',
        },
    ],

    projects: ['kepaso', 'nomadninja'],
    related: ['web-app-development', 'web-development', 'software-development', 'cloud-solutions'],
};
