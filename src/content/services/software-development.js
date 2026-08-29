export default {
    slug: 'software-development',
    nav: 'Software Development',
    short: 'Software development',
    title: 'Software Development Services | Korame',
    description:
        'Software engineering services: application architecture, backend systems, APIs, data modelling, integrations and cloud deployment — built to be maintained.',
    h1: 'Software development as an engineering discipline',
    kicker: 'Software development',
    art: 'service-software-development',
    serviceType: 'Software development',
    lede: 'The hard part of software is never the first version. It is the fourth change request, made by someone who was not in the original conversation, against code the original author has left. Everything we do about architecture, tests and documentation is aimed at that moment.',

    whatItIs: {
        heading: 'What the work consists of',
        body: [
            'Software development is the whole path from an ambiguous business problem to a running system somebody depends on: understanding the domain, choosing an architecture proportionate to it, modelling the data, writing and reviewing the code, testing it, deploying it repeatably, and operating it once real users arrive.',
            'The discipline is mostly about restraint. Almost every serious failure we are asked to rescue was caused by something being more clever than the problem required — a distributed architecture for one server\'s worth of traffic, an abstraction built for a second use case that never arrived, a framework chosen because it was new. Boring, well-understood technology applied carefully outperforms novelty almost every time.',
        ],
    },

    provide: [
        {
            title: 'Application architecture',
            body: 'Choosing the shape of the system — where boundaries go, what is synchronous, what can fail independently — sized against the load and the team you actually have.',
        },
        {
            title: 'Backend systems',
            body: 'Business logic that lives in one place, service layers with clear responsibilities, and jobs, queues and scheduled work for the things that must not happen inside a request.',
        },
        {
            title: 'APIs',
            body: 'Versioned, documented interfaces with consistent error handling and idempotency on writes — designed so a second consumer does not force a redesign.',
        },
        {
            title: 'Databases and data modelling',
            body: 'Normalised where correctness matters and denormalised where reads demand it, with the trade-off written down rather than discovered.',
        },
        {
            title: 'Integrations',
            body: 'Payment providers, CRMs, ERPs, messaging and third-party APIs — with retries, backoff, webhook verification and a plan for the day the other side is down.',
        },
        {
            title: 'Legacy modernisation',
            body: 'Incremental replacement of systems that still work but have become expensive to change, without a big-bang rewrite that stops delivery for a year.',
        },
    ],

    audience: [
        {
            title: 'Businesses whose processes have outgrown their tools',
            body: 'Where the workaround has become the process, and the spreadsheet has become the database.',
        },
        {
            title: 'Companies with software they cannot safely change',
            body: 'A system that works but that nobody dares touch is a liability accumulating interest.',
        },
        {
            title: 'Teams that need engineering capacity, not headcount',
            body: 'A partner who can own a piece of the system end to end, including the parts that are not fun.',
        },
    ],

    problems: [
        {
            title: 'Every change breaks something else',
            body: 'Logic duplicated across layers with no tests to catch the divergence. The fix is not a rewrite; it is characterisation tests and consolidation, one behaviour at a time.',
        },
        {
            title: 'The system cannot be reasoned about',
            body: 'No documentation, no types, no consistent conventions. Making it legible is cheaper than replacing it, and it is the prerequisite for deciding whether replacement is even warranted.',
        },
        {
            title: 'Integrations fail silently',
            body: 'Fire-and-forget calls with no retry, no dead-letter handling and no alerting, so a partner outage becomes missing data discovered weeks later.',
        },
        {
            title: 'Only one person can deploy it',
            body: 'Undocumented manual steps are an availability risk disguised as a process. Automating them is usually a few days\' work and removes a genuine single point of failure.',
        },
    ],

    approach: [
        {
            title: 'Understand the domain first',
            body: 'Time with the people who do the work today, including the exceptions they handle manually. The exceptions are where the real requirements hide.',
        },
        {
            title: 'Choose the least clever architecture that works',
            body: 'Complexity is a permanent cost paid by everyone who touches the code afterwards. It has to be earned by a requirement, not chosen by preference.',
        },
        {
            title: 'Make it observable early',
            body: 'Logging, error tracking and metrics before the first real user, so the first production surprise is diagnosable rather than theoretical.',
        },
        {
            title: 'Hand over properly',
            body: 'Repository, documentation, runbooks, architecture decisions with their reasoning, and access to every account. Nothing about the system should depend on us being reachable.',
        },
    ],

    tech: [
        { group: 'Languages', items: ['JavaScript', 'TypeScript', 'SQL'] },
        { group: 'Runtime', items: ['Node.js', 'Serverless functions', 'Background jobs'] },
        { group: 'Data', items: ['PostgreSQL', 'SQL Server', 'Document stores', 'Blob storage'] },
        { group: 'Practice', items: ['CI/CD', 'Automated testing', 'Code review', 'Monitoring'] },
    ],

    pillars: [
        {
            title: 'Security',
            body: 'Threat-modelled at design time rather than audited at the end: validation at every trust boundary, least-privilege service identities, secrets managed by the platform, dependency scanning in CI, encrypted data in transit and at rest, and audit logging on anything that changes money, permissions or personal data.',
        },
        {
            title: 'Scalability',
            body: 'Understanding where the load actually is before optimising for it. Caching, indexing and asynchronous processing applied where measurement says they are needed, and horizontal headroom designed in even when it is not yet used.',
        },
        {
            title: 'Testing',
            body: 'Automated tests on the logic that would be expensive to get wrong, integration tests at system boundaries, and a full build and test run on every pull request. Tests are documentation that cannot go stale.',
        },
        {
            title: 'Cloud deployment',
            body: 'Reproducible environments, deployment as an automated pipeline rather than a procedure, and rollback as a first-class operation rather than an emergency improvisation.',
        },
        {
            title: 'Maintenance',
            body: 'Scheduled dependency updates, monitoring and alerting configured at launch, and an architecture decision record so the next engineer inherits the reasoning as well as the code.',
        },
    ],

    useCases: [
        'Replacing a manual process that has become a bottleneck or a risk',
        'Building the backend and integrations behind an existing product',
        'Modernising a working but unchangeable legacy system incrementally',
        'Connecting systems that currently exchange data by export and re-import',
        'Adding engineering rigour — tests, CI, monitoring — to a product built at speed',
    ],

    faqs: [
        {
            q: 'What is the difference between software development and web development?',
            a: 'Web development is a subset — software delivered through a browser. Software development is the wider practice: the same engineering applied to backends, integrations, data pipelines and internal systems that may have no interface at all. Most of our work is delivered on the web, but the discipline behind it is not web-specific.',
        },
        {
            q: 'Do you write tests?',
            a: 'On the logic where a defect would be expensive, and at system boundaries. We do not chase a coverage percentage — tests written to satisfy a metric tend to test implementation rather than behaviour, and they make refactoring harder rather than safer.',
        },
        {
            q: 'How do you handle a system nobody understands any more?',
            a: 'Make it observable before changing it. Logging and characterisation tests that pin down current behaviour come first, so subsequent changes have something to fail against. Rewrites are the last option, not the first, and they are proposed with a migration path rather than a big-bang date.',
        },
        {
            q: 'What happens if we want to bring the work in-house later?',
            a: 'That is a normal and healthy outcome. Everything — repository, infrastructure, accounts, documentation — is yours throughout, and handover to an internal team is a planned piece of work rather than a negotiation.',
        },
    ],

    projects: ['kepaso', 'nomadninja', 'the-travellers-tribe'],
    related: ['custom-software-development', 'full-stack-development', 'web-app-development', 'cloud-solutions'],
};
