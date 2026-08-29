/**
 * Pricing — the source of truth for /pricing.
 *
 * ── These figures are quoted to search engines ───────────────────────────
 * `offerCatalogNode()` in src/lib/seo.js turns `TIERS` into `Offer` nodes with
 * `priceCurrency: "INR"`, and Google may surface them in a result. A price
 * published this way is one you have to honour: change it here and it changes
 * in the schema, the page and the sitemap's lastmod together, which is the
 * whole reason the numbers live in one module rather than being typed into a
 * component and a JSON-LD block separately. That split is exactly how the
 * previous build ended up quoting figures nobody had agreed to.
 *
 * A tier with `price: null` is deliberately unpriced — it renders as
 * `priceLabel` and is emitted as an Offer with no price rather than being
 * omitted, so the catalogue still describes the whole ladder.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const PRICING = {
    title: 'Pricing & Engagements | Korame',
    description:
        'What a Korame project costs: fixed-scope Launch and Scale builds quoted up front, and a monthly retainer for ongoing product work. What is included, and what moves the number.',
    h1: 'Clear scope, clear price',
    kicker: 'Pricing',
    lede: 'Fixed-scope projects are quoted up front — no hourly billing surprises and no change-request games. The figures below are starting points for the shape of work each tier describes; the quote you get is written against your actual scope.',
};

export const CURRENCY = 'INR';

export const TIERS = [
    {
        name: 'Launch',
        price: 45000,
        priceLabel: '₹45,000',
        cadence: 'one-off',
        blurb: 'A fast, credible presence for a new business or a product launch.',
        features: [
            'Up to 5 pages',
            'Bespoke design, no templates',
            'Mobile-first & accessible',
            'On-page SEO + structured data',
            'Domain, SSL & hosting setup',
            '30 days post-launch support',
        ],
        cta: 'Start a Launch project',
        popular: false,
    },
    {
        name: 'Scale',
        price: 120000,
        priceLabel: '₹1,20,000',
        cadence: 'one-off',
        blurb: 'The full studio treatment for a business the site has to carry.',
        features: [
            'Up to 15 pages',
            'Custom design system',
            'Scroll & motion choreography',
            'CMS so you can edit content',
            'Technical SEO + analytics',
            'Performance budgets in CI',
            '90 days support',
        ],
        cta: 'Start a Scale project',
        popular: true,
    },
    {
        name: 'Partner',
        price: null,
        priceLabel: 'Custom',
        cadence: 'monthly retainer',
        blurb: 'An embedded frontend team for ongoing product and growth work.',
        features: [
            'Dedicated engineering time',
            'E-commerce & web apps',
            'AI feature integration',
            'Continuous CRO experiments',
            'Priority response SLA',
            'Quarterly roadmap reviews',
        ],
        cta: 'Talk about a retainer',
        popular: false,
    },
];

/** What actually moves a quote — the questions every enquiry ends up asking. */
export const FACTORS = [
    {
        title: 'Page count and template count',
        body: 'Ten pages built from three templates is a smaller job than five pages that are all different. What drives the number is how many distinct layouts have to be designed and built, not how many URLs exist.',
    },
    {
        title: 'Whether content is ready',
        body: 'Copy, images and product data arriving late is the single most common reason a fixed-scope project slips. If you want us to shape the content as well, that is scope worth pricing in rather than absorbing.',
    },
    {
        title: 'Application behaviour',
        body: 'Accounts, roles, payments, dashboards and anything with a database behind it move a project from a site to an application. That is the Scale tier at minimum, and often a retainer.',
    },
    {
        title: 'Integrations',
        body: 'A CMS, a payment provider, a CRM or an existing internal API each add a surface that has to be designed, built and tested against something we do not control.',
    },
    {
        title: 'Migration from an existing site',
        body: 'Preserving URLs, redirects and search rankings is real work, and skipping it is how a redesign loses traffic. We price it explicitly rather than discovering it in week three.',
    },
    {
        title: 'How long you want us after launch',
        body: 'Every tier includes a support window. Beyond it you can move to a retainer or simply take the code — there is no arrangement that requires us to stay.',
    },
];

export const FAQS = [
    {
        q: 'Are these prices fixed?',
        a: 'The tier figures are starting points for the shape of work each one describes. Once we have your scope in writing you get a fixed quote against it, and that quote does not move unless the scope does — in which case you approve the change before any work happens.',
    },
    {
        q: 'What do you need before you can quote?',
        a: 'Roughly: what the site or application has to do, who it is for, whether content exists, and any system it has to talk to. A single conversation is usually enough. If we cannot quote responsibly from that, we will say what is missing rather than pad the number to cover the unknown.',
    },
    {
        q: 'Do you take payment in stages?',
        a: 'Yes. Fixed-scope projects are normally split across kickoff, an agreed midpoint and launch, so payment tracks delivered work. Retainers are billed monthly in advance.',
    },
    {
        q: 'Is there anything not included?',
        a: 'Third-party costs are yours and are billed to your own accounts, not through us: domain registration, cloud hosting, a CMS subscription, paid fonts or stock imagery. We tell you what they will come to before you commit, and they are typically small — this site\'s own hosting is inside a free tier.',
    },
    {
        q: 'What if the project turns out to be smaller than the tier?',
        a: 'Then you are quoted less. The tiers describe common shapes of work, not a floor we hold you to, and we would rather scope a project honestly than sell you a size you do not need.',
    },
    {
        q: 'Do you work with an existing team?',
        a: 'Often. That is usually a retainer rather than a fixed-scope build, because the work is continuous and the priorities are yours. We can take the frontend, the infrastructure, or both.',
    },
];
