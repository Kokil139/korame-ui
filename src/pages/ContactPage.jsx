import { useLocation } from 'react-router-dom';
import Seo from '@/components/Seo';
import PageHero from '@/components/page/PageHero';
import Section from '@/components/page/Section';
import Contact from '@/components/Contact';
import FaqList from '@/components/page/FaqList';
import { CheckList } from '@/components/page/Blocks';
import Reveal from '@/components/motion/Reveal';
import { Card } from '@/components/ui/card';
import { SITE, url } from '@/lib/site';
import {
    breadcrumbNode,
    faqNode,
    graph,
    organizationNode,
    webPageNode,
    websiteNode,
} from '@/lib/seo';

const TITLE = 'Contact Korame | Start a Web, App or Software Project';
const DESCRIPTION =
    'Talk to Korame about a web, application, software or cloud project. Email, WhatsApp or the form — we answer within one working day.';

const WHAT_TO_SEND = [
    'What you are trying to build, in whatever detail you have — a paragraph is enough to start.',
    'What has to be true for it to be worth building. This is usually the most useful thing you can tell us.',
    'Any deadline that is real, and why it is real.',
    'A link to what exists today, if anything does.',
    'A budget range, if you have one. It changes what we recommend, not whether we reply.',
];

const CONTACT_FAQS = [
    {
        q: 'How quickly do you reply?',
        a: 'Within one working day, to every genuine enquiry, including the ones we are not the right fit for. If we cannot help we will say so and point you somewhere more useful.',
    },
    {
        q: 'Do you work with clients outside India?',
        a: 'Yes. We are remote-first and work across time zones. Most collaboration happens asynchronously over shared documents and deployed previews, with a regular call scheduled in a window that suits you.',
    },
    {
        q: 'What happens after I get in touch?',
        a: 'A short call to understand the problem and decide whether we are the right people for it. If we are, you get a written scope with an architecture, an estimate and what it will cost to run afterwards. If we are not, you get that answer quickly rather than a proposal.',
    },
    {
        q: 'Do you charge for the first conversation?',
        a: 'No. Discovery — the structured phase that produces a specification and an estimate — is a paid piece of work on larger projects, and it is agreed separately. The conversation that decides whether that is even worth doing is not.',
    },
    {
        q: 'Can you take over an existing project?',
        a: 'Frequently. It starts with an audit of the codebase, build, dependencies, security posture and performance, so you get an honest picture of what is worth keeping before anyone proposes a rewrite.',
    },
];

export default function ContactPage() {
    /* The free audit navigates here with a prefilled message when the tool is
       on its own route and cannot write into this form directly. */
    const { state } = useLocation();
    const prefill = typeof state?.message === 'string' ? state.message : '';

    const trail = [{ name: 'Contact', path: '/contact' }];

    const jsonLd = graph(
        organizationNode(),
        websiteNode(),
        {
            '@type': 'ContactPage',
            '@id': `${url('/contact')}#webpage`,
            url: url('/contact'),
            name: TITLE,
            description: DESCRIPTION,
            isPartOf: { '@id': `${SITE.origin}/#website` },
            about: { '@id': `${SITE.origin}/#organization` },
            breadcrumb: { '@id': `${url('/contact')}#breadcrumb` },
            inLanguage: SITE.lang,
        },
        breadcrumbNode(trail),
        faqNode(CONTACT_FAQS, '/contact'),
    );

    return (
        <>
            <Seo title={TITLE} description={DESCRIPTION} path="/contact" jsonLd={jsonLd} />

            <PageHero
                kicker="Contact"
                title="Tell us what you are trying to build"
                lede="Email, WhatsApp or the form below — all three reach the same people. We answer every genuine enquiry within one working day, including the ones where the answer is that you should hire somebody else."
                trail={trail}
            />

            <Section
                kicker="Before you write"
                title="What is useful to include"
                width="max-w-4xl"
            >
                <Reveal y={20}>
                    <Card className="p-8">
                        <CheckList items={WHAT_TO_SEND} />
                    </Card>
                </Reveal>
            </Section>

            {/* The section owns the form, the channels and the studio panel;
                its own heading is suppressed because this page has an H1. */}
            <Contact hideHeader defaultMessage={prefill} />

            <Section kicker="Questions" title="Before you get in touch">
                <FaqList faqs={CONTACT_FAQS} />
            </Section>
        </>
    );
}
