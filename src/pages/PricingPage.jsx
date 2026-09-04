import Seo from '@/components/Seo';
import PageHero from '@/components/page/PageHero';
import Section from '@/components/page/Section';
import FaqList from '@/components/page/FaqList';
import { CardGrid, CtaBand, LinkCards } from '@/components/page/Blocks';
import Pricing from '@/components/Pricing';
import { PRICING, TIERS, CURRENCY, FACTORS, FAQS } from '@/content/pricing';
import { SERVICE_LIST, servicePath } from '@/content/service-list';
import {
    breadcrumbNode,
    faqNode,
    graph,
    offerCatalogNode,
    organizationNode,
    webPageNode,
    websiteNode,
} from '@/lib/seo';

const PATH = '/pricing';

/**
 * /pricing
 *
 * The tier cards are the restored <Pricing> section with its original
 * interaction model; everything around them is the standard page kit, so this
 * route reads like every other inner page.
 *
 * `heading={false}` because <PageHero> already states the h1  leaving the
 * section's own h2 in place would put "Clear scope, clear price" on the screen
 * twice within one viewport.
 *
 * The FAQ answers are rendered into the HTML rather than mounted on open:
 * `FaqList` height-animates and marks closed panels inert, because Google
 * requires FAQPage answer text to be present in the document it receives, and
 * with pre-rendering that document is the initial render.
 */
export default function PricingPage() {
    const trail = [{ name: 'Pricing', path: PATH }];

    const jsonLd = graph(
        organizationNode(),
        websiteNode(),
        webPageNode({
            path: PATH,
            name: PRICING.title,
            description: PRICING.description,
            breadcrumbPath: PATH,
        }),
        breadcrumbNode(trail),
        offerCatalogNode({ path: PATH, tiers: TIERS, currency: CURRENCY }),
        faqNode(FAQS, PATH),
    );

    return (
        <>
            <Seo
                title={PRICING.title}
                description={PRICING.description}
                path={PATH}
                jsonLd={jsonLd}
            />

            <PageHero
                kicker={PRICING.kicker}
                title={PRICING.h1}
                lede={PRICING.lede}
                trail={trail}
            />

            <Pricing heading={false} />

            <Section
                kicker="What moves the number"
                title="What a quote actually depends on"
                width="max-w-6xl"
            >
                <CardGrid items={FACTORS} columns={3} />
            </Section>

            <Section
                kicker="Questions"
                title="Pricing questions we get asked"
                width="max-w-4xl"
            >
                <FaqList faqs={FAQS} />
            </Section>

            <Section
                kicker="Services"
                title="What we build"
                lede="Every engagement above is one of these delivered end to end."
                width="max-w-6xl"
            >
                <LinkCards
                    columns={4}
                    items={SERVICE_LIST.map((s) => ({
                        title: s.nav,
                        href: servicePath(s.slug),
                    }))}
                />
            </Section>

            <CtaBand
                title="Tell us the scope and we will quote it."
                body="A short conversation is usually enough to put a real number against the work  including telling you when it is smaller than the tier you were looking at."
                primary={{ href: '/contact', label: 'Get a quote' }}
                secondary={{ href: '/projects', label: 'See our work' }}
            />
        </>
    );
}
