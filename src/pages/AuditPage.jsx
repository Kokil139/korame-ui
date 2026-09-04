import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';
import PageHero from '@/components/page/PageHero';
import Section from '@/components/page/Section';
import FaqList from '@/components/page/FaqList';
import { CardGrid, CheckList, CtaBand, LinkCards } from '@/components/page/Blocks';
import AuditTool from '@/components/AuditTool';
import Reveal from '@/components/motion/Reveal';
import { Card } from '@/components/ui/card';
import { hasPsi } from '@/lib/audit';
import { SITE, url } from '@/lib/site';
import {
    breadcrumbNode,
    faqNode,
    graph,
    organizationNode,
    serviceNode,
    webPageNode,
    websiteNode,
} from '@/lib/seo';

const PATH = '/free-website-audit';

const TITLE = 'Free Website Audit | Live Security, Speed & SEO Check | Korame';
const DESCRIPTION =
    'Run a free live audit of your site: security headers, response time and Core Web Vitals, scored in the browser. No email required to see the numbers.';

/**
 * What the tool measures, stated plainly.
 *
 * Every claim here has to match what src/lib/audit.js actually calls. The
 * Lighthouse row is conditional for the same reason: it only runs when a
 * PageSpeed Insights key is configured, and promising a score the deployment
 * cannot produce is a promise broken in front of the visitor.
 */
const MEASURES = [
    {
        title: 'Security headers',
        body: 'A real MDN HTTP Observatory scan: Content-Security-Policy, HSTS, X-Content-Type-Options, referrer policy, cookie flags and the rest, with a grade and a score you can check yourself.',
    },
    {
        title: 'Response time',
        body: 'How long your origin takes to answer a request, measured from the browser rather than quoted from a synthetic lab.',
    },
    {
        title: 'HTTP status',
        body: 'Whether the host actually answers cleanly  redirects, mixed content and a homepage returning something other than 200 are all findings.',
    },
    hasPsi
        ? {
              title: 'Lighthouse scores',
              body: 'Performance, accessibility, best practices and SEO from Google PageSpeed Insights, plus Core Web Vitals from real Chrome users where Google has enough traffic to report them.',
          }
        : {
              title: 'Lighthouse scores',
              body: 'Available when a PageSpeed Insights key is configured on this deployment. Without one the scan skips it rather than calling the API keyless  the anonymous quota is permanently exhausted and would fail every time.',
          },
];

const MANUAL = [
    'Indexability  robots.txt, meta robots, canonical tags and whether your sitemap agrees with the site.',
    'Structured data, and whether it matches what is actually rendered on the page.',
    'Heading hierarchy, image alt text and keyboard operability.',
    'Broken internal links and redirect chains.',
    'The conversion path: what a visitor is asked to do, and how much work it takes them.',
    'JavaScript bundle size, and what is in it that nobody needs.',
];

const FAQS = [
    {
        q: 'Is the free website audit actually free?',
        a: 'The live scan on this page is free, instant and requires no email  you see the numbers whether or not you ever speak to us. The written review that goes beyond what a scan can measure is also free, and it is the part where you have to give us an address to send it to.',
    },
    {
        q: 'What is the difference between the live scan and the written audit?',
        a: 'The scan is automated: security headers, response time and, where configured, Lighthouse scores. The written audit is a person looking at the things a scanner cannot judge  whether your structured data matches the page, whether the heading order makes sense, whether the conversion path asks for too much. Most of the useful findings are in the second one.',
    },
    {
        q: 'Do I have to hire you afterwards?',
        a: 'No, and most people do not. The audit is written so that your own developer can act on it. If we are not the right people to fix what we found, we will say so.',
    },
    {
        q: 'Will the scan slow my site down or change anything?',
        a: 'No. It makes a small number of ordinary public requests, the same as any visitor. Nothing is written, nothing is logged on your side beyond a normal request, and no credentials are involved.',
    },
    {
        q: 'Why does the scan sometimes take a while?',
        a: 'The Observatory runs a fresh scan rather than returning a cached grade, and on a large site that can take the better part of a minute. If it times out entirely, that is itself worth knowing.',
    },
    {
        q: 'Can you audit a site that is behind a login?',
        a: 'Not with the live scan  it only sees what a public visitor sees. Authenticated areas are covered in the written review, which is one of the reasons that part is not automated.',
    },
];

export default function AuditPage() {
    const trail = [{ name: 'Free website audit', path: PATH }];

    const jsonLd = graph(
        organizationNode(),
        websiteNode(),
        webPageNode({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            breadcrumbPath: PATH,
        }),
        breadcrumbNode(trail),
        /* Declared as a free Service rather than an Offer with a price. The
           price is genuinely zero and saying so in the graph is honest; a
           priced Offer here would be a fabrication. */
        {
            ...serviceNode({
                slug: 'free-website-audit',
                nav: 'Free website audit',
                serviceType: 'Website audit',
                description: DESCRIPTION,
                useCases: [],
            }),
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
                availability: 'https://schema.org/InStock',
                url: url(PATH),
            },
        },
        faqNode(FAQS, PATH),
    );

    return (
        <>
            <Seo title={TITLE} description={DESCRIPTION} path={PATH} jsonLd={jsonLd} />

            <PageHero
                kicker="Free website audit"
                title="How healthy is your site, really?"
                lede="Run a live scan of your security headers, response time and speed scores  in the browser, in about a minute, with no email required to see the result. Then, if you want it, a written review of the things a scanner cannot judge."
                trail={trail}
            />

            {/* The tool itself. Its own heading is suppressed; this page has an
                <h1> and does not need a second one saying the same thing. */}
            <AuditTool hideHeader />

            <Section
                kicker="What the scan measures"
                title="What you get instantly"
                lede="Everything below runs against your live site the moment you press the button. Nothing is estimated."
                width="max-w-6xl"
            >
                <CardGrid items={MEASURES} columns={2} />
            </Section>

            <Section
                kicker="The written review"
                title="What a scanner cannot tell you"
                lede="Automated scores are a starting point. These are the findings that actually move revenue, and every one of them needs a person to look."
                width="max-w-4xl"
            >
                <Reveal y={20}>
                    <Card className="p-8">
                        <CheckList items={MANUAL} />
                        <p className="mt-6 text-pretty text-sm leading-relaxed text-muted-foreground">
                            Run the scan above, then ask for the written version  the button on
                            your result carries the address across so you do not have to type it
                            again. We come back within one working day.
                        </p>
                    </Card>
                </Reveal>
            </Section>

            <Section kicker="Questions" title="About the audit">
                <FaqList faqs={FAQS} />
            </Section>

            <Section kicker="Then what" title="Where the findings usually lead" width="max-w-6xl">
                <LinkCards
                    items={[
                        {
                            href: '/web-development',
                            title: 'Web Development',
                            body: 'When the fix is the frontend: bundle size, render-blocking requests, images nobody sized.',
                        },
                        {
                            href: '/cloud-solutions',
                            title: 'Cloud Solutions',
                            body: 'When the fix is at the edge: caching, redirects, security headers, soft 404s on refresh.',
                        },
                        {
                            href: '/web-design',
                            title: 'Web Design',
                            body: 'When the scores are fine and the page still does not convert.',
                        },
                    ]}
                    columns={3}
                />
            </Section>

            <CtaBand
                title="Want the written audit?"
                body={`Send us the address and we will come back within a working day  whether or not there is a project in it. Or email ${SITE.email} directly.`}
                primary={{ href: '/contact', label: 'Request the written audit' }}
                secondary={{ href: '/services', label: 'What we do' }}
            />

            <Section width="max-w-3xl" className="pb-4">
                <Reveal y={16}>
                    <p className="text-sm text-muted-foreground">
                        The scan is powered by the MDN HTTP Observatory and, where configured,
                        Google PageSpeed Insights. Both are public tools  you can run them
                        yourself, and we would rather you knew that.{' '}
                        <Link
                            to="/blog"
                            className="font-semibold text-brand-400 underline-offset-4 hover:underline"
                        >
                            More on how we work
                        </Link>
                        .
                    </p>
                </Reveal>
            </Section>
        </>
    );
}
