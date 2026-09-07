import { lazy, Suspense } from 'react';
import Seo from '@/components/Seo';
import Hero from '@/components/Hero';
import { FAQS } from '@/components/Faq';
import { SERVICE_LIST, servicePath } from '@/content/service-list';
import { PROJECTS, projectPath } from '@/content/projects';
import {
    faqNode,
    graph,
    itemListNode,
    organizationNode,
    webPageNode,
    websiteNode,
} from '@/lib/seo';

/**
 * The homepage.
 *
 * Below-the-fold content is code-split so the Hero  the only section that
 * animates on mount  gets the main thread to itself while the rest of the
 * document hydrates.
 *
 * The pre-render waits for this chunk (renderToPipeableStream + onAllReady),
 * so the served HTML contains the whole page regardless; on the client React
 * keeps that markup in place inside the Suspense boundary and hydrates the
 * boundary separately when the chunk arrives.
 */
const BelowTheFold = lazy(() => import('@/components/BelowTheFold'));

const TITLE = 'Korame | Web Development, Full-Stack & Software Engineering';
const DESCRIPTION =
    'Korame is a software engineering studio building websites, web applications, full-stack systems, custom software and cloud-deployed products.';

export default function Home() {
    const jsonLd = graph(
        organizationNode(),
        websiteNode(),
        webPageNode({ path: '/', name: TITLE, description: DESCRIPTION }),
        itemListNode({
            path: '/',
            name: 'Korame services',
            items: SERVICE_LIST.map((s) => ({ name: s.nav, path: servicePath(s.slug) })),
        }),
        /* An ItemList of the services rather than nine full Service nodes.
           Each service page declares its own Service node with its own
           serviceType and offer catalogue, and repeating them here would both
           duplicate entities across the graph and pull all nine content
           modules into the entry bundle. */
        itemListNode({
            path: '/projects',
            name: 'Korame project experience',
            items: PROJECTS.map((p) => ({ name: p.name, path: projectPath(p.slug) })),
        }),
        faqNode(FAQS, '/'),
    );

    return (
        <>
            <Seo title={TITLE} description={DESCRIPTION} path="/" jsonLd={jsonLd} />

            <Hero />

            <Suspense fallback={null}>
                <BelowTheFold />
            </Suspense>
        </>
    );
}
