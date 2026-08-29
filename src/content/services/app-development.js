export default {
    slug: 'app-development',
    nav: 'App Development',
    short: 'App development',
    title: 'App Development Services | Custom Applications | Korame',
    description:
        'Application development: installable web apps, cross-platform interfaces, and the APIs, authentication and cloud infrastructure behind them.',
    h1: 'Application development, without the platform theatre',
    kicker: 'App development',
    art: 'service-app-development',
    serviceType: 'Application development',
    lede: 'Plenty of things sold as "an app" should not be one. An installable web application reaches every platform from one codebase, ships fixes the moment they are ready, and skips the app-store review queue entirely. We will tell you when that is the right answer, and when it genuinely is not.',

    whatItIs: {
        heading: 'Being straight about what we build',
        body: [
            'Korame builds applications for the web platform: React interfaces, Node and serverless APIs, and the cloud infrastructure underneath. That includes installable Progressive Web Apps — applications a user adds to a home screen, that launch without browser chrome, work from a cached shell, and update silently on next load.',
            'What we do not do is claim a native iOS or Android practice we do not have. If your requirements genuinely need a native runtime — deep hardware integration, background location, App Store or Play Store distribution as a business requirement — the honest answer is a specialist studio for the client, and we are well placed to build and own the API, data model and cloud infrastructure it runs against. Overstating capability is how projects end up half-delivered, and it is not a trade we make.',
        ],
    },

    provide: [
        {
            title: 'Installable web applications',
            body: 'Progressive Web Apps with a web app manifest, a service worker for the cached shell and offline reads, and an install prompt on Android, Windows and macOS.',
        },
        {
            title: 'Cross-platform interfaces',
            body: 'One responsive codebase that adapts from phone to desktop, with touch treated as a primary input rather than a degraded mouse.',
        },
        {
            title: 'Backend and API integration',
            body: 'The API your application talks to — designed, versioned and documented — whether the client is ours or somebody else\'s.',
        },
        {
            title: 'Authentication',
            body: 'Sign-in through managed identity providers, session persistence across launches, and a defined path for what happens when a token expires while the app is open.',
        },
        {
            title: 'Notifications',
            body: 'Web push where the platform supports it, and email or messaging fallbacks where it does not — chosen against where your users actually are.',
        },
        {
            title: 'Cloud infrastructure',
            body: 'Hosting, storage, functions, CI/CD and monitoring, sized so the bill tracks usage rather than ambition.',
        },
    ],

    audience: [
        {
            title: 'Businesses told they need a native app',
            body: 'Often the requirement is "our customers need this on their phone", which a good installable web app satisfies for a fraction of the cost and none of the review latency.',
        },
        {
            title: 'Teams with a native client and no backend',
            body: 'A mobile team that needs an API, data model and cloud platform built properly behind it.',
        },
        {
            title: 'Field and operations teams',
            body: 'Applications used on a phone in poor connectivity, where offline reads and reliable sync matter more than platform polish.',
        },
    ],

    problems: [
        {
            title: 'Paying twice for the same product',
            body: 'Separate iOS and Android codebases plus a web version is three implementations of one set of rules, and three places for them to diverge.',
        },
        {
            title: 'Fixes stuck in review',
            body: 'A critical bug behind a store approval queue is a business risk. Web deployment removes the queue.',
        },
        {
            title: 'It falls over on a bad connection',
            body: 'No cached shell, no retry, no idempotency, so a dropped request becomes a duplicate record or lost work.',
        },
        {
            title: 'Nobody installs it',
            body: 'Install friction is real. If the value can be delivered in the browser without an install step, requiring one costs you users.',
        },
    ],

    approach: [
        {
            title: 'Question the platform requirement',
            body: 'What does this need that the web cannot do? Sometimes the answer is real and specific. Often it is a distribution assumption worth revisiting before it costs six figures.',
        },
        {
            title: 'Design for the worst device',
            body: 'A mid-range Android on a poor connection, not the newest phone on office wifi. Everything above that baseline is free.',
        },
        {
            title: 'Make the API the product',
            body: 'A clean, versioned API means the client can be replaced or added to later without touching the system behind it.',
        },
        {
            title: 'Instrument real usage',
            body: 'Crash and error reporting, plus performance from real devices, because synthetic testing never finds the phone that actually struggles.',
        },
    ],

    tech: [
        { group: 'Client', items: ['React', 'Progressive Web App', 'Service workers', 'TypeScript'] },
        { group: 'API', items: ['Node.js', 'REST', 'Azure Functions'] },
        { group: 'Data', items: ['PostgreSQL', 'SQL Server', 'Blob storage'] },
        { group: 'Delivery', items: ['Azure Static Web Apps', 'GitHub Actions', 'Web push'] },
    ],

    pillars: [
        {
            title: 'Security',
            body: 'HTTPS everywhere, tokens in secure storage rather than accessible script state where the platform allows, server-side authorisation on every call, certificate and dependency hygiene, and no secrets shipped in the client bundle.',
        },
        {
            title: 'Offline and resilience',
            body: 'A cached application shell so launch never shows a blank screen, read-only offline where the data allows, request retry with idempotency keys so a flaky network cannot duplicate a write, and honest UI about what is and is not synced.',
        },
        {
            title: 'Performance',
            body: 'Budgets set against a mid-range device, code split by route, images sized and modern-format, and interaction latency measured rather than assumed.',
        },
        {
            title: 'Deployment and updates',
            body: 'Continuous deployment, staged rollout where it matters, and service worker updates that take effect predictably instead of stranding users on a stale build.',
        },
        {
            title: 'Maintenance',
            body: 'Monitoring and error tracking from launch, scheduled dependency updates, and a documented runbook so the application is not dependent on one person\'s memory.',
        },
    ],

    useCases: [
        'A customer-facing application that must work on a phone without an install step',
        'An internal tool for staff working in the field on unreliable connectivity',
        'A booking, ordering or scheduling application shared across devices',
        'The API, data model and cloud platform behind an existing native client',
        'Replacing three divergent platform codebases with one web application',
    ],

    faqs: [
        {
            q: 'Do you build native iOS and Android apps?',
            a: 'No, and we would rather say so than take the work and subcontract it quietly. We build web-platform applications, including installable Progressive Web Apps, and we build the APIs, data models and cloud infrastructure that native clients run against. If you need true native, we will say so early.',
        },
        {
            q: 'Can a Progressive Web App be installed like a normal app?',
            a: 'On Android, Windows and macOS, yes — it installs to the home screen or dock and launches without browser chrome. On iOS it can be added to the home screen and runs standalone, though Apple restricts some capabilities, notably around push notifications and background work. We scope against those limits explicitly rather than discovering them late.',
        },
        {
            q: 'Will it work offline?',
            a: 'The application shell and read-only data, reliably. Offline writes with conflict resolution are a much larger piece of engineering, so we build them only where the workflow genuinely requires it — and we say which of the two you are buying.',
        },
        {
            q: 'Can you take over an existing application?',
            a: 'Yes, starting with an audit of the codebase, build, dependencies, security posture and performance, so you get a clear picture of what is salvageable before anyone recommends a rewrite.',
        },
    ],

    projects: ['nomadninja', 'kepaso'],
    related: ['web-app-development', 'full-stack-development', 'cloud-solutions', 'software-development'],
};
