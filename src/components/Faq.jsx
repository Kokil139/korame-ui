import { Link } from 'react-router-dom';
import Reveal from '@/components/motion/Reveal';
import FaqList from '@/components/page/FaqList';
import { Badge } from '@/components/ui/badge';

/**
 * Homepage FAQ content.
 *
 * This array is the single source of truth: the FAQPage JSON-LD for the
 * homepage is generated from it in pages/Home.jsx, so the structured data can
 * never drift from what is rendered. Google treats a mismatch as a
 * rich-result violation, and hand-syncing two copies always loses eventually.
 *
 * Two answers previously referenced the "Launch / Scale / Partner" pricing
 * tiers. Those tiers were invented figures and have been removed from the
 * site, so the answers no longer cite them.
 */
export const FAQS = [
    {
        q: 'How long does a website take to build?',
        a: 'A focused marketing site is typically 3–4 weeks from kickoff to launch. Larger builds with a custom design system, CMS or an application layer run 6–10 weeks. We agree the timeline in discovery and you see working software at the end of every stage, so progress is never a surprise.',
    },
    {
        q: 'What does the free website audit actually include?',
        a: 'We run your current site through Core Web Vitals and Lighthouse, check the technical SEO basics — indexability, structured data, metadata, heading structure, broken links — and review the conversion path. You get a written summary of what is costing you traffic or sales, whether or not you hire us.',
    },
    {
        q: 'Do you work with clients outside India?',
        a: 'Yes. We are remote-first and work with founders across time zones. Most collaboration happens asynchronously over shared documents and deployed previews, with a weekly call scheduled in a window that suits you.',
    },
    {
        q: 'Will I be able to edit the content myself?',
        a: 'Where that is a requirement, yes — we integrate a headless CMS so you can edit copy, images and pages without touching code. It is a deliberate scope decision rather than a default, because a CMS adds moving parts a small site may not need, and one you never use is cost and attack surface. You can add it later without a rebuild.',
    },
    {
        q: 'What happens after the site launches?',
        a: 'Every engagement includes a support window covering bug fixes and small adjustments, agreed in the proposal. After that you can move to a retainer, or simply own the code outright. There is no lock-in: the repository, the cloud accounts and the domain are yours throughout.',
    },
    {
        q: 'Why not just use a website builder or a template?',
        a: 'For a simple brochure site, a builder is often the right call and we will tell you so. What builders cannot give you is a distinctive design, a fast bespoke frontend, or fine control over technical SEO and accessibility. If those things affect your revenue, a handcrafted build pays for itself.',
    },
    {
        q: 'Do you handle hosting and domains?',
        a: 'Yes — domain registration or transfer, DNS, SSL certificates and cloud hosting are configured as part of every project. We prefer static or edge-delivered deployments, which are fast and inexpensive to run. You own every account; we are never a middleman on your infrastructure.',
    },
];

export default function Faq() {
    return (
        <section id="faq" className="relative px-6 py-28 sm:py-36">
            <div className="mx-auto max-w-4xl">
                <div className="text-center">
                    <Reveal>
                        <Badge variant="cyan">Questions</Badge>
                    </Reveal>

                    <Reveal delay={0.06}>
                        <h2 className="mt-6 text-balance font-heading text-4xl font-bold tracking-[-0.025em] text-foreground md:text-5xl lg:text-6xl">
                            Things founders <span className="text-gradient-brand">ask us</span>
                        </h2>
                    </Reveal>
                </div>

                <div className="mt-14">
                    <FaqList faqs={FAQS} />
                </div>

                <Reveal delay={0.1}>
                    <p className="mt-10 text-center text-muted-foreground">
                        Still unsure?{' '}
                        <Link
                            to="/contact"
                            className="font-semibold text-brand-400 underline-offset-4 hover:underline"
                        >
                            Ask us directly
                        </Link>{' '}
                        — we answer within one working day.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
