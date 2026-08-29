export default {
    slug: 'azure-development',
    nav: 'Azure Development',
    short: 'Azure development',
    title: 'Azure Development Services | Korame',
    description:
        'Azure development and deployment: Azure Static Web Apps, Azure Functions, GitHub Actions pipelines, custom domains and routing configuration done properly.',
    h1: 'Azure development, from the platform we deploy on daily',
    kicker: 'Azure development',
    art: 'service-seo',
    serviceType: 'Azure development',
    lede: 'Every project on this site is deployed to Azure Static Web Apps through GitHub Actions. This page describes the parts of Azure we work in every week — not a catalogue of services we could resell you.',

    whatItIs: {
        heading: 'What we actually do on Azure',
        body: [
            'Our Azure practice is focused: static and serverless application delivery. That means Azure Static Web Apps for hosting, Azure Functions for the API layer, GitHub Actions for the build and deployment pipeline, and Azure\'s managed certificates and custom domain handling for the front door. It is a narrow slice of a very large platform, and it is the slice that covers most web and web-application workloads properly.',
            'We are not an Azure consultancy for identity governance, virtual network design, Kubernetes or data-platform engineering. If your project needs those, you want a Microsoft partner with that specialisation, and we would rather tell you now than discover it in month three. What we will do well is design, build, deploy and operate a web application on Azure so that it is fast, cheap to run, and recoverable.',
        ],
    },

    provide: [
        {
            title: 'Azure Static Web Apps',
            body: 'Global static hosting with managed TLS, staging environments per pull request, and route, header and fallback configuration handled explicitly rather than left to defaults.',
        },
        {
            title: 'Azure Functions',
            body: 'The API layer as serverless functions — either the managed API that ships with Static Web Apps or a separate Function App where the workload warrants isolation.',
        },
        {
            title: 'GitHub Actions pipelines',
            body: 'Build, test and deploy on every push, with preview URLs on pull requests and automatic teardown when they close.',
        },
        {
            title: 'Custom domains and DNS',
            body: 'Apex and subdomain configuration, validation records, managed certificates with automatic renewal, and a single canonical hostname with everything else redirected to it.',
        },
        {
            title: 'Routing and headers',
            body: 'staticwebapp.config.json done deliberately: SPA fallback that does not swallow real 404s, cache-control tuned per asset class, and security headers set at the edge.',
        },
        {
            title: 'Storage and data',
            body: 'Blob storage for user uploads and generated assets, and managed database services connected through platform-managed identity rather than connection strings in a repository.',
        },
    ],

    audience: [
        {
            title: 'Microsoft-aligned organisations',
            body: 'Companies already invested in Azure and Microsoft 365 who want their web presence in the same tenant, under the same billing and access controls.',
        },
        {
            title: 'Teams deploying to Azure by hand',
            body: 'A Static Web App created through the portal, deployed by dragging a folder, with no pipeline and no reproducible configuration.',
        },
        {
            title: 'Projects with an Azure mandate',
            body: 'Where the platform is fixed by procurement or policy and the requirement is to build well within it.',
        },
    ],

    problems: [
        {
            title: 'Refreshing a deep link returns 404',
            body: 'The single most common Azure Static Web Apps issue: a client-routed application with no navigation fallback configured. The fix is a few lines of routing config — and the correct fix still lets genuinely missing paths return a real 404 rather than serving the homepage with a 200.',
        },
        {
            title: 'The custom domain never validated',
            body: 'Apex domains need the right record type and Azure\'s validation token. It is a five-minute fix that has stalled plenty of launches for a week.',
        },
        {
            title: 'Assets are not cached',
            body: 'Default cache headers on fingerprinted build output waste the CDN entirely. Immutable caching on hashed assets and short caching on HTML is the correct split.',
        },
        {
            title: 'Deployment tokens in the repository',
            body: 'Deployment credentials committed rather than held as repository secrets, and connection strings in application configuration rather than managed identity.',
        },
    ],

    approach: [
        {
            title: 'Configuration lives in the repository',
            body: 'Routing, headers, redirects and the workflow are versioned files, so the environment can be rebuilt from an empty subscription and reviewed like any other change.',
        },
        {
            title: 'Use the preview environments',
            body: 'Every pull request gets a real Azure URL. Reviewing a deployed build rather than a description removes most late surprises.',
        },
        {
            title: 'Pre-render where possible',
            body: 'Static Web Apps is at its best serving real HTML from the edge. Pre-rendering routes at build time means crawlers and first-time visitors get content without waiting for JavaScript.',
        },
        {
            title: 'Set headers at the edge',
            body: 'Caching and security headers configured in platform routing rather than in application code, so they apply to every asset including the ones nobody thought about.',
        },
    ],

    tech: [
        { group: 'Hosting', items: ['Azure Static Web Apps', 'Managed certificates', 'Custom domains'] },
        { group: 'Compute', items: ['Azure Functions', 'Node.js', 'Managed API'] },
        { group: 'Storage & data', items: ['Azure Blob Storage', 'Azure SQL', 'Managed identity'] },
        { group: 'Pipeline', items: ['GitHub Actions', 'Preview environments', 'Deployment tokens'] },
    ],

    pillars: [
        {
            title: 'Security',
            body: 'Deployment tokens as repository secrets rather than committed values, managed identity in place of connection strings wherever the service supports it, security headers configured in platform routing, TLS enforced with automatic certificate renewal, and role-based access on the subscription itself.',
        },
        {
            title: 'CI/CD',
            body: 'The Azure Static Web Apps GitHub Action builds and deploys on every push to the main branch, opens a staging environment for each pull request, and tears it down when the pull request closes. Nothing is deployed from a laptop.',
        },
        {
            title: 'Routing and SPA behaviour',
            body: 'Navigation fallback configured so direct URL access and refreshes work on every route, with the fallback excluding asset paths so a missing file still returns 404 rather than an HTML page with a 200 status. Search engines are extremely sensitive to that distinction.',
        },
        {
            title: 'Performance',
            body: 'Immutable cache headers on fingerprinted assets, short revalidating cache on HTML, global edge distribution as standard, and pre-rendered routes so the first paint does not wait on a JavaScript bundle.',
        },
        {
            title: 'Cost',
            body: 'Static Web Apps has a genuinely usable free tier and a modest standard tier; functions bill per execution. For most business sites and small applications the monthly cost is a rounding error compared with a virtual machine sized for peak.',
        },
    ],

    useCases: [
        'Deploying a React or static site to Azure Static Web Apps with a proper pipeline',
        'Fixing 404s on refresh, custom domain validation or caching on an existing Static Web App',
        'Adding a serverless API to a site already hosted on Azure',
        'Moving a manually deployed Azure site onto GitHub Actions with preview environments',
        'Configuring security headers, redirects and canonical hostname handling at the edge',
    ],

    faqs: [
        {
            q: 'Why does my Azure Static Web App return 404 when I refresh a page?',
            a: 'Because the requested path exists in your client-side router but not as a file on disk, and no navigation fallback is configured. Adding a navigationFallback to staticwebapp.config.json fixes it. Configure the exclusion list carefully — a fallback that catches everything will serve HTML with a 200 status for missing assets, which confuses both browsers and crawlers.',
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
            q: 'Whose Azure subscription does this run in?',
            a: 'Yours. We build in your subscription under your billing with scoped access, so ownership and continuity never depend on us.',
        },
    ],

    projects: ['nomadninja', 'the-travellers-tribe', 'kepaso'],
    related: ['cloud-development', 'web-development', 'web-app-development', 'full-stack-development'],
};
