export default {
    slug: 'cloud-development',
    nav: 'Cloud Development',
    short: 'Cloud development',
    title: 'Cloud Development Services | Korame',
    description:
        'Cloud application development and deployment: static-first architecture on a CDN, serverless APIs, CI/CD pipelines, and infrastructure sized to real traffic.',
    h1: 'Cloud development, sized to the actual problem',
    kicker: 'Cloud development',
    art: 'service-seo',
    serviceType: 'Cloud application development',
    lede: 'Most business applications do not need a cluster. They need static assets on a CDN, a handful of functions that scale to zero, a managed database, and a deployment pipeline nobody has to think about. That architecture costs very little at low traffic and does not need replacing at high traffic.',

    whatItIs: {
        heading: 'What cloud development means in practice',
        body: [
            'Cloud development is building applications that assume managed infrastructure rather than servers you own. Instead of provisioning a machine, patching it, and hoping it is sized correctly, you assemble managed services — static hosting on a global CDN, serverless compute that scales with requests, a managed database with backups handled for you — and connect them with a deployment pipeline.',
            'The engineering shift is that infrastructure becomes part of the codebase. Environments are defined in configuration, deployments are triggered by merges, and rebuilding the whole stack from an empty account is a documented procedure rather than an archaeology project. That is what makes an application recoverable, auditable and transferable — and it is why "it runs on a server someone set up in 2019" is a risk rather than an architecture.',
        ],
    },

    provide: [
        {
            title: 'Cloud architecture',
            body: 'Choosing the services and the boundaries between them, sized against your actual traffic and your actual team — not a reference architecture for a company a hundred times larger.',
        },
        {
            title: 'Static-first hosting',
            body: 'Pre-rendered HTML and assets served from a CDN edge, so the common path never touches an origin server. Fastest, cheapest and most resilient option available for anything that can use it.',
        },
        {
            title: 'Serverless APIs',
            body: 'Functions for the parts that genuinely need a server, scaling to zero between requests so idle capacity is not something you pay for.',
        },
        {
            title: 'CI/CD pipelines',
            body: 'Build, test and deploy on every push, preview environments per pull request, and a rollback that is one action rather than one incident.',
        },
        {
            title: 'Domains, DNS and TLS',
            body: 'Custom domain configuration, DNS records, managed certificates with automatic renewal, and redirects that resolve to a single canonical hostname.',
        },
        {
            title: 'Monitoring and cost control',
            body: 'Uptime and error monitoring wired in at launch, plus budgets and alerts so a misconfiguration surfaces as a notification rather than an invoice.',
        },
    ],

    audience: [
        {
            title: 'Businesses on ageing hosting',
            body: 'Shared hosting or a virtual machine somebody configured years ago, with no pipeline, no backups you have tested, and no one who remembers how it was set up.',
        },
        {
            title: 'Teams whose cloud bill has drifted',
            body: 'Always-on capacity for bursty traffic is the most common cause, and it is usually an architecture question rather than a negotiation with the vendor.',
        },
        {
            title: 'Products that need to be fast globally',
            body: 'A single-region server is slow for most of the world. Edge delivery fixes that without a rewrite.',
        },
    ],

    problems: [
        {
            title: 'Deployment is a manual ritual',
            body: 'Files copied over FTP, or a build run on one laptop. Automating it removes both a bottleneck and a single point of failure.',
        },
        {
            title: 'The site is slow far from the server',
            body: 'Every request crossing an ocean. Static output on a CDN removes that round trip for most of the page.',
        },
        {
            title: 'Nobody has tested the backups',
            body: 'A backup you have never restored is a hypothesis. Restore procedure and recovery time belong in the launch scope.',
        },
        {
            title: 'Costs scale with time, not usage',
            body: 'Reserved capacity idling overnight. Serverless and static delivery align spend with actual demand.',
        },
    ],

    approach: [
        {
            title: 'Start from the traffic shape',
            body: 'Bursty, steady, global or regional, read-heavy or write-heavy. That shape, not fashion, decides the architecture.',
        },
        {
            title: 'Push work to build time',
            body: 'Anything that can be computed during the build should be. A pre-rendered page is faster, cheaper and more reliable than the fastest possible server-rendered one.',
        },
        {
            title: 'Make environments reproducible',
            body: 'Configuration in the repository, secrets in the platform, and a documented path from an empty cloud account to a running system.',
        },
        {
            title: 'Set the budget and the alarm',
            body: 'Spend limits and alerts configured before launch, so surprises arrive as warnings rather than bills.',
        },
    ],

    tech: [
        { group: 'Hosting', items: ['Azure Static Web Apps', 'CDN / edge caching', 'Managed TLS'] },
        { group: 'Compute', items: ['Azure Functions', 'Node.js', 'Scheduled jobs'] },
        { group: 'Data', items: ['Managed PostgreSQL', 'SQL Server', 'Blob storage'] },
        { group: 'Pipeline', items: ['GitHub Actions', 'Preview environments', 'Automated rollback'] },
    ],

    pillars: [
        {
            title: 'Security',
            body: 'TLS everywhere with managed certificate renewal, secrets in the platform rather than the repository, managed identities in place of long-lived keys, least-privilege access on every service, and security headers configured at the edge rather than hoped for in the application.',
        },
        {
            title: 'Scalability',
            body: 'Static assets scale to any traffic level by definition. Serverless compute scales with request volume and back down again. The database is normally the first real limit, which is why connection handling and indexing get attention before anything else does.',
        },
        {
            title: 'Resilience',
            body: 'Global CDN distribution so a regional problem is not a total outage, automated backups with a tested restore procedure, health checks, and deployments that can be reversed immediately.',
        },
        {
            title: 'CI/CD',
            body: 'Every pull request builds, tests and gets its own preview URL. Every merge to the main branch deploys. No step in that chain depends on a specific person being available.',
        },
        {
            title: 'Cost',
            body: 'Static-first architecture means most requests are served from cache at near-zero marginal cost. Budgets and alerts are configured at launch, and we size for the traffic you have with headroom, not for a hypothetical.',
        },
    ],

    useCases: [
        'Migrating a site or application off ageing shared hosting or an unmanaged VM',
        'Adding a real CI/CD pipeline to a project deployed by hand',
        'Restructuring an application whose hosting costs have outgrown its traffic',
        'Global delivery for a product currently served from one region',
        'Setting up domains, DNS, certificates and redirects correctly for a launch',
    ],

    faqs: [
        {
            q: 'Which cloud provider do you use?',
            a: 'Microsoft Azure by default — it is where our shipped projects run and where our operational depth is. The architecture principles are portable, and we will work with an existing AWS or Google Cloud footprint rather than insisting on a migration you have no reason to want.',
        },
        {
            q: 'Is serverless actually cheaper?',
            a: 'For bursty or low-to-moderate traffic, substantially — you pay per request instead of per hour. For sustained high throughput a reserved instance can win. The larger saving is usually operational: no servers to patch, monitor or size.',
        },
        {
            q: 'Can you move an existing site to the cloud without downtime?',
            a: 'Yes. The new environment is built and verified in parallel on a temporary hostname, then DNS is cut over with a low TTL set in advance. Rollback is a DNS change back.',
        },
        {
            q: 'Who owns the cloud account?',
            a: 'You do. Infrastructure is built in your subscription with your billing, and we work inside it with scoped access. You are never renting your own infrastructure back from us.',
        },
    ],

    projects: ['nomadninja', 'the-travellers-tribe', 'kepaso'],
    related: ['azure-development', 'web-app-development', 'full-stack-development', 'software-development'],
};
