export default {
    slug: 'custom-software-development',
    nav: 'Custom Software',
    short: 'Custom software development',
    title: 'Custom Software Development Services | Korame',
    description:
        'Bespoke software shaped around how your business actually works — plus an honest assessment of when off-the-shelf is the better buy. Discovery to handover.',
    h1: 'Custom software — and when you should not buy it',
    kicker: 'Custom software',
    art: 'service-custom-software-development',
    serviceType: 'Custom software development',
    lede: 'Custom software is worth building when the way you work is the advantage. It is a poor purchase when you are paying six figures to rebuild something you could licence for a few hundred a month. Most of the value we add on these projects happens before any code exists, in getting that judgement right.',

    whatItIs: {
        heading: 'Custom software versus off-the-shelf',
        body: [
            'Off-the-shelf software encodes somebody else\'s idea of how the work should be done. That is usually a bargain: you get years of development, a support team and a security posture for a subscription. The cost is that your process has to bend to the product, and you inherit its roadmap and its pricing decisions.',
            'Custom software inverts both. You own the roadmap, the data and the process, and the system can encode the specific thing you do better than your competitors. In exchange you take on the full cost of building, hosting, securing and maintaining it — which is not a project cost, it is an ongoing one. The question is never "which is better". It is whether the difference between the two is worth what it costs you every year.',
        ],
    },

    decision: {
        heading: 'A straight answer on build versus buy',
        buy: {
            title: 'Buy off-the-shelf when',
            points: [
                'The process is genuinely standard — accounting, payroll, email, CRM basics.',
                'A mature product covers 80% or more of what you need without heavy configuration.',
                'The capability is not a competitive differentiator, just a cost of doing business.',
                'You do not have, and do not want, the ongoing budget to maintain a system.',
                'Compliance certifications you would otherwise have to obtain yourself come with the product.',
            ],
        },
        build: {
            title: 'Build custom when',
            points: [
                'The workflow is the advantage, and forcing it into a generic product would destroy the thing that works.',
                'You are paying for several tools plus manual work to bridge the gaps between them.',
                'Per-seat licensing has grown into a cost that a build would amortise within a few years.',
                'Your data is the asset and you need it in a shape no vendor exposes.',
                'The integration work needed to make a bought product fit is approaching the cost of building.',
            ],
        },
        note: 'The most common right answer is neither purely one nor the other: buy the commodity pieces, build the part that is genuinely yours, and integrate them properly. We are happy to be told the answer is "buy" — a project that should not exist is the most expensive kind.',
    },

    provide: [
        {
            title: 'Discovery and requirements',
            body: 'Time with the people doing the work, including the exceptions they handle by hand. A written specification of what the system must do and — just as usefully — what it will not.',
        },
        {
            title: 'Build-versus-buy assessment',
            body: 'An honest comparison against real products in your category, with total cost of ownership over three to five years rather than a project quote against a monthly fee.',
        },
        {
            title: 'Bespoke business applications',
            body: 'Systems shaped around your process: the entities you actually track, the states they move through, and the rules that govern them.',
        },
        {
            title: 'Integrations',
            body: 'Connecting the custom part to the bought parts — accounting, CRM, payments, messaging — so data moves automatically instead of by export and re-import.',
        },
        {
            title: 'Data migration',
            body: 'Getting years of history out of the old system and into the new one, with reconciliation you can verify rather than trust.',
        },
        {
            title: 'Handover and ownership',
            body: 'Repository, infrastructure, accounts and documentation are yours throughout, so continuing without us is always a live option.',
        },
    ],

    audience: [
        {
            title: 'Businesses running on stitched-together tools',
            body: 'Four subscriptions and a person whose job is moving data between them is a system — an expensive, fragile, undocumented one.',
        },
        {
            title: 'Companies whose process is their advantage',
            body: 'If what you do differently is the reason customers choose you, generic software will slowly erode it.',
        },
        {
            title: 'Teams facing a licensing wall',
            body: 'Per-seat pricing that has outgrown its value, or a vendor changing terms on a product you now depend on.',
        },
    ],

    problems: [
        {
            title: 'The tool almost fits',
            body: '"Almost" is where the manual work lives. Quantifying the hours spent bridging that gap usually settles the build-versus-buy question on its own.',
        },
        {
            title: 'The data is trapped',
            body: 'Reporting that requires three exports and a spreadsheet means the information exists but is not usable. Often solvable without a full replacement.',
        },
        {
            title: 'Requirements were never written down',
            body: 'Projects fail far more often from unclear scope than from technical difficulty. Discovery is not overhead; it is the risk-reduction step.',
        },
        {
            title: 'The previous custom build was abandoned',
            body: 'Usually because it was scoped as one enormous delivery with no working software until the end. Incremental delivery is the structural fix.',
        },
    ],

    approach: [
        {
            title: 'Discovery before commitment',
            body: 'A short, paid, fixed-scope phase producing a specification, an architecture and a realistic estimate — including the recommendation not to build, if that is the honest one.',
        },
        {
            title: 'Deliver in usable increments',
            body: 'Working software in production early, adopted by real users in stages. Nothing about a custom build should require a year of faith.',
        },
        {
            title: 'Run the old and new together',
            body: 'Parallel running through the transition, with reconciliation, rather than a switchover weekend that has to go perfectly.',
        },
        {
            title: 'Plan the second year',
            body: 'Maintenance, hosting and support costs are stated at the start, because the true cost of custom software is the running of it.',
        },
    ],

    tech: [
        { group: 'Application', items: ['React', 'TypeScript', 'Node.js'] },
        { group: 'Data', items: ['PostgreSQL', 'SQL Server', 'Reporting views'] },
        { group: 'Integration', items: ['REST APIs', 'Webhooks', 'Scheduled jobs'] },
        { group: 'Platform', items: ['Azure', 'GitHub Actions', 'Monitoring'] },
    ],

    pillars: [
        {
            title: 'Security',
            body: 'Custom systems do not inherit a vendor\'s security team, so it has to be designed in: role-based access enforced server-side, encryption in transit and at rest, audit trails on anything touching money, permissions or personal data, secrets in a managed vault, and dependency scanning on every build.',
        },
        {
            title: 'Scalability',
            body: 'Sized honestly against your real numbers. Most business systems will never need distributed architecture, and building for imagined scale is the most reliable way to make a project late.',
        },
        {
            title: 'Testing',
            body: 'Automated coverage on business rules — the calculations, state transitions and permission checks where a silent error is worse than a crash — plus reconciliation testing on any data migration.',
        },
        {
            title: 'Cloud deployment',
            body: 'Managed cloud services rather than servers you have to patch, so the operational burden stays proportionate to a business that does not employ a platform team.',
        },
        {
            title: 'Maintenance',
            body: 'A support arrangement stated in the proposal, scheduled dependency updates, monitoring from day one, and documentation good enough for an internal team to take over.',
        },
    ],

    useCases: [
        'Replacing several overlapping subscriptions and the manual work between them',
        'A quoting, pricing or scheduling engine encoding rules no product supports',
        'A customer or partner portal on top of an existing internal system',
        'Compliance and audit requirements that off-the-shelf reporting cannot satisfy',
        'Migrating off a legacy system whose vendor is winding it down',
    ],

    faqs: [
        {
            q: 'When is custom software actually worth it?',
            a: 'When the process is a competitive advantage, when licensing plus the manual work bridging tool gaps already approaches the build cost, or when your data needs to be in a shape no vendor exposes. If a mature product covers most of the requirement and the capability is not a differentiator, buy it — we will say so.',
        },
        {
            q: 'What does custom software cost to run after launch?',
            a: 'Hosting for a typical business application on managed cloud services is usually modest. The larger ongoing line is maintenance: dependency and security updates, monitoring, and change requests as the business moves. We state both in the proposal, because a build cost quoted without a running cost is not a real number.',
        },
        {
            q: 'How long does discovery take?',
            a: 'Typically one to three weeks depending on how many processes are involved. It produces a written specification, an architecture, an estimate and a build-versus-buy recommendation, and it is deliberately a separate commitment from the build.',
        },
        {
            q: 'What if we start and then decide to buy instead?',
            a: 'Then discovery did its job. Everything produced in that phase is yours, and a specification is exactly what you need to evaluate vendors properly.',
        },
    ],

    projects: ['kepaso', 'nomadninja'],
    related: ['software-development', 'web-app-development', 'full-stack-development', 'cloud-solutions'],
};
