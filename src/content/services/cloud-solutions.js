/**
 * Cloud Solutions — the merge of the former /cloud-development and
 * /azure-development pages.
 *
 * The two pages described one practice from two angles: the general
 * architecture argument (static-first, serverless, pipelines) and the
 * platform specifics (Static Web Apps, Functions, routing config). Split
 * across two URLs they competed with each other for the same queries and each
 * told half the story. Both old paths 301 here — see REDIRECTS in
 * src/lib/routes.js and the matching rules in public/staticwebapp.config.json.
 *
 * The Azure specifics are kept rather than generalised away: the
 * 404-on-refresh problem, custom-domain validation and the deployment-token
 * mistake are the things people actually search for, and they are what
 * /blog/azure-static-web-apps-404-on-refresh links back to.
 */
export default {
    slug: 'cloud-solutions',
    nav: 'Cloud Solutions',
    short: 'Cloud solutions',
    title: 'Cloud Solutions & Azure Development | Korame',
    description:
        'Cloud solutions on Azure: static-first hosting on a CDN, serverless APIs, GitHub Actions pipelines, custom domains and infrastructure sized to real traffic.',
    h1: 'Cloud solutions, sized to the actual problem',
    kicker: 'Cloud solutions',
    art: 'service-cloud-solutions',
    serviceType: 'Cloud application development',
    lede: 'Most business applications do not need a cluster. They need static assets on a CDN, a handful of functions that scale to zero, a managed database, and a deployment pipeline nobody has to think about. That architecture costs very little at low traffic and does not need replacing at high traffic. Every project on this site runs on it.',

    whatItIs: {
        heading: 'What cloud solutions mean in practice',
        body: [
            'Cloud development is building applications that assume managed infrastructure rather than servers you own. Instead of provisioning a machine, patching it, and hoping it is sized correctly, you assemble managed services — static hosting on a global CDN, serverless compute that scales with requests, a managed database with backups handled for you — and connect them with a deployment pipeline.',
            'The engineering shift is that infrastructure becomes part of the codebase. Environments are defined in configuration, deployments are triggered by merges, and rebuilding the whole stack from an empty account is a documented procedure rather than an archaeology project. That is what makes an application recoverable, auditable and transferable — and it is why "it runs on a server someone set up in 2019" is a risk rather than an architecture.',
            'In practice that means Microsoft Azure for us: Azure Static Web Apps for hosting, Azure Functions for the API layer, GitHub Actions for the pipeline, and Azure\'s managed certificates and custom domain handling for the front door. It is a narrow slice of a very large platform, and it is the slice that covers most web and web-application workloads properly. We are not an Azure consultancy for identity governance, virtual network design, Kubernetes or data-platform engineering — if your project needs those you want a Microsoft partner with that specialisation, and we would rather say so now than discover it in month three. The architecture principles here are portable, and we will work inside an existing AWS or Google Cloud footprint rather than insisting on a migration you have no reason to want.',
        ],
    },

    provide: [
        {
            title: 'Cloud architecture',
            body: 'Choosing the services and the boundaries between them, sized against your actual traffic and your actual team — not a reference architecture for a company a hundred times larger.',
        },
        {
            title: 'Static-first hosting',
            body: 'Pre-rendered HTML and assets served from a CDN edge on Azure Static Web Apps, so the common path never touches an origin server. Fastest, cheapest and most resilient option available for anything that can use it.',
        },
        {
            title: 'Serverless APIs',
            body: 'Azure Functions for the parts that genuinely need a server — either the managed API that ships with Static Web Apps or a separate Function App where the workload warrants isolation — scaling to zero between requests.',
        },
        {
            title: 'CI/CD pipelines',
            body: 'GitHub Actions building, testing and deploying on every push, a real preview URL per pull request with automatic teardown when it closes, and a rollback that is one action rather than one incident.',
        },
        {
            title: 'Routing and headers',
            body: 'staticwebapp.config.json done deliberately: navigation fallback that does not swallow real 404s, cache-control tuned per asset class, and security headers set at the edge rather than hoped for in the application.',
        },
        {
            title: 'Domains, DNS and TLS',
            body: 'Apex and subdomain configuration, validation records, managed certificates with automatic renewal, and a single canonical hostname with everything else redirected to it.',
        },
        {
            title: 'Storage and data',
            body: 'Blob storage for user uploads and generated assets, and managed database services connected through platform-managed identity rather than connection strings in a repository.',
        },
        {
            title: 'Migration and cutover',
            body: 'The new environment built and verified in parallel on a temporary hostname, then a DNS cut-over with a low TTL set in advance — so the rollback is a DNS change rather than a rebuild.',
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
        {
            title: 'Microsoft-aligned organisations',
            body: 'Companies already invested in Azure and Microsoft 365 who want their web presence in the same tenant, under the same billing and access controls.',
        },
        {
            title: 'Teams deploying by hand',
            body: 'A Static Web App created through the portal and deployed by dragging a folder, with no pipeline and no reproducible configuration.',
        },
        {
            title: 'Projects with a platform mandate',
            body: 'Where the cloud is fixed by procurement or policy and the requirement is simply to build well within it.',
        },
    ],

    problems: [
        {
            title: 'Refreshing a deep link returns 404',
            body: 'The single most common Azure Static Web Apps issue: a client-routed application with no navigation fallback configured. The fix is a few lines of routing config — and the correct fix still lets genuinely missing paths return a real 404 rather than serving the homepage with a 200.',
        },
        {
            title: 'Deployment is a manual ritual',
            body: 'Files copied over FTP, or a build run on one laptop. Automating it removes both a bottleneck and a single point of failure.',
        },
        {
            title: 'The custom domain never validated',
            body: 'Apex domains need the right record type and the platform\'s validation token. It is a five-minute fix that has stalled plenty of launches for a week.',
        },
        {
            title: 'Assets are not cached',
            body: 'Default cache headers on fingerprinted build output waste the CDN entirely. Immutable caching on hashed assets and short caching on HTML is the correct split.',
        },
        {
            title: 'Nobody has tested the backups',
            body: 'A backup you have never restored is a hypothesis. Restore procedure and recovery time belong in the launch scope, not in the first incident.',
        },
        {
            title: 'Costs scale with time, not usage',
            body: 'Reserved capacity idling overnight, or deployment credentials and connection strings living in the repository because nobody set up secrets. Serverless and static delivery align spend with demand; managed identity removes the credential entirely.',
        },
    ],

    approach: [
        {
            title: 'Start from the traffic shape',
            body: 'Bursty, steady, global or regional, read-heavy or write-heavy. That shape, not fashion, decides the architecture.',
        },
        {
            title: 'Push work to build time',
            body: 'Anything that can be computed during the build should be. A pre-rendered page is faster, cheaper and more reliable than the fastest possible server-rendered one — and it means crawlers get real HTML without waiting for JavaScript.',
        },
        {
            title: 'Configuration lives in the repository',
            body: 'Routing, headers, redirects and the workflow are versioned files, so the environment can be rebuilt from an empty subscription and reviewed like any other change.',
        },
        {
            title: 'Use the preview environments',
            body: 'Every pull request gets a real deployed URL. Reviewing a running build rather than a description removes most late surprises.',
        },
        {
            title: 'Set headers at the edge',
            body: 'Caching and security headers configured in platform routing rather than application code, so they apply to every asset including the ones nobody thought about.',
        },
        {
            title: 'Set the budget and the alarm',
            body: 'Spend limits and alerts configured before launch, so surprises arrive as warnings rather than bills.',
        },
    ],

    tech: [
        { group: 'Hosting', items: ['Azure Static Web Apps', 'CDN / edge caching', 'Managed TLS'] },
        { group: 'Compute', items: ['Azure Functions', 'Node.js', 'Scheduled jobs'] },
        {
            group: 'Storage & data',
            items: ['Azure Blob Storage', 'Azure SQL', 'Managed PostgreSQL', 'Managed identity'],
        },
        {
            group: 'Pipeline',
            items: ['GitHub Actions', 'Preview environments', 'Automated rollback'],
        },
    ],

    pillars: [
        {
            title: 'Security',
            body: 'TLS everywhere with managed certificate renewal, deployment tokens as repository secrets rather than committed values, managed identity in place of connection strings wherever the service supports it, least-privilege access on every resource, and security headers configured in platform routing rather than hoped for in the application.',
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
            body: 'Every pull request builds, tests and gets its own preview URL, and is torn down when the pull request closes. Every merge to the main branch deploys. Nothing is deployed from a laptop, and no step in that chain depends on a specific person being available.',
        },
        {
            title: 'Routing and SPA behaviour',
            body: 'Navigation fallback configured so direct URL access and refreshes work on every route, with the fallback excluding asset paths so a missing file still returns 404 rather than an HTML page with a 200 status. Search engines are extremely sensitive to that distinction.',
        },
        {
            title: 'Cost',
            body: 'Static-first architecture means most requests are served from cache at near-zero marginal cost, and functions bill per execution. For most business sites and small applications the monthly cost is a rounding error compared with a virtual machine sized for peak. Budgets and alerts are configured at launch, and we size for the traffic you have with headroom, not for a hypothetical.',
        },
    ],

    useCases: [
        'Migrating a site or application off ageing shared hosting or an unmanaged VM',
        'Deploying a React or static site to Azure Static Web Apps with a proper pipeline',
        'Fixing 404s on refresh, custom domain validation or caching on an existing Static Web App',
        'Adding a real CI/CD pipeline to a project deployed by hand',
        'Adding a serverless API to a site that is already hosted in the cloud',
        'Restructuring an application whose hosting costs have outgrown its traffic',
        'Global delivery for a product currently served from one region',
        'Configuring domains, DNS, certificates, redirects and security headers correctly for a launch',
    ],

    faqs: [
        {
            q: 'Which cloud provider do you use?',
            a: 'Microsoft Azure by default — it is where our shipped projects run and where our operational depth is. The architecture principles are portable, and we will work with an existing AWS or Google Cloud footprint rather than insisting on a migration you have no reason to want.',
        },
        {
            q: 'Why does my Azure Static Web App return 404 when I refresh a page?',
            a: 'Because the requested path exists in your client-side router but not as a file on disk, and no navigation fallback is configured. Adding a navigationFallback to staticwebapp.config.json fixes it. Configure the exclusion list carefully — a fallback that catches everything will serve HTML with a 200 status for missing assets, which confuses both browsers and crawlers.',
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
            q: 'Do you work with Azure services beyond Static Web Apps and Functions?',
            a: 'We use Blob Storage, Azure SQL and managed identity as part of application delivery. We do not present ourselves as an Azure consultancy for networking, Kubernetes, identity governance or data-platform work — that is a different specialisation and you should hire for it directly.',
        },
        {
            q: 'Can Azure Static Web Apps serve a server-rendered site?',
            a: 'It serves static files and serverless functions. For search visibility the effective approach is pre-rendering routes at build time so real HTML is served from the edge, which is what this site does. Full per-request server rendering is a different hosting model.',
        },
        {
            q: 'Who owns the cloud account?',
            a: 'You do. Infrastructure is built in your subscription under your billing, and we work inside it with scoped access. Ownership and continuity never depend on us, and you are never renting your own infrastructure back from us.',
        },
    ],

    projects: ['nomadninja', 'the-travellers-tribe', 'kepaso'],
    related: [
        'web-app-development',
        'full-stack-development',
        'software-development',
        'web-development',
    ],
};
