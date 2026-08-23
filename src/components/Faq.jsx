import { useState, useId } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import Reveal from '@/components/motion/Reveal';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * FAQ content.
 *
 * This array is the single source of truth: `scripts/generate-faq-schema.mjs`
 * reads it and rewrites the FAQPage JSON-LD block in index.html, so the
 * structured data can never drift from what is on the page. Google treats a
 * mismatch as a rich-result violation, and hand-syncing two copies always
 * loses eventually.
 */
export const FAQS = [
    {
        q: 'How long does a website take to build?',
        a: 'A focused marketing site is typically 3–4 weeks from kickoff to launch. Larger builds with a custom design system, CMS or e-commerce run 6–10 weeks. We agree the timeline in the discovery stage and you see working software at the end of every stage, so progress is never a surprise.',
    },
    {
        q: 'What does the free website audit actually include?',
        a: 'We run your current site through Core Web Vitals and Lighthouse, check the technical SEO basics — indexability, structured data, metadata, heading structure, broken links — and review the conversion path. You get a written summary of what is costing you traffic or sales, whether or not you hire us.',
    },
    {
        q: 'Do you work with clients outside India?',
        a: 'Yes. We are remote-first and work with founders across time zones. Most collaboration happens asynchronously over shared documents and previews, with a weekly call scheduled in a window that suits you.',
    },
    {
        q: 'Will I be able to edit the content myself?',
        a: 'On Scale and Partner engagements, yes — we integrate a headless CMS so you can edit copy, images and pages without touching code. On Launch projects content edits come back to us, which keeps that tier cheaper; you can add a CMS later without a rebuild.',
    },
    {
        q: 'What happens after the site launches?',
        a: 'Every engagement includes a support window — 30 days on Launch, 90 on Scale — covering bug fixes and small adjustments. After that you can move to a retainer, or simply own the code outright. There is no lock-in: the repository is yours.',
    },
    {
        q: 'Why not just use a website builder or a template?',
        a: 'For a simple brochure site, a builder is often the right call and we will tell you so. What builders cannot give you is a distinctive design, a fast bespoke frontend, or fine control over technical SEO and accessibility. If those things affect your revenue, a handcrafted build pays for itself.',
    },
    {
        q: 'Do you handle hosting and domains?',
        a: 'Yes — domain registration or transfer, DNS, SSL certificates and cloud hosting are configured as part of every project. We prefer static or edge-rendered deployments, which are fast and inexpensive to run. You own every account; we are never a middleman on your infrastructure.',
    },
];

export default function Faq() {
    const [open, setOpen] = useState(0);
    const reduced = useReducedMotion();
    const baseId = useId().replace(/:/g, '');

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

                <dl className="mt-14 divide-y divide-border border-y border-border">
                    {FAQS.map((item, i) => {
                        const isOpen = open === i;
                        const panelId = `${baseId}-panel-${i}`;
                        const buttonId = `${baseId}-button-${i}`;

                        return (
                            <div key={item.q}>
                                <dt>
                                    <button
                                        id={buttonId}
                                        type="button"
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        onClick={() => setOpen(isOpen ? -1 : i)}
                                        className="group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors hover:text-brand-400"
                                    >
                                        <span className="font-heading text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-brand-400 sm:text-xl">
                                            {item.q}
                                        </span>

                                        {/* One icon rotated 45° to become a close
                                            affordance — cheaper than swapping nodes
                                            and it animates continuously. */}
                                        <motion.span
                                            animate={{ rotate: isOpen ? 45 : 0 }}
                                            transition={
                                                reduced
                                                    ? { duration: 0 }
                                                    : { type: 'spring', bounce: 0.3, visualDuration: 0.3 }
                                            }
                                            className={cn(
                                                'mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-border transition-colors',
                                                isOpen
                                                    ? 'border-brand-500/50 bg-brand-500/10 text-brand-400'
                                                    : 'text-muted-foreground group-hover:border-brand-500/40',
                                            )}
                                        >
                                            <Plus className="size-4" aria-hidden="true" />
                                        </motion.span>
                                    </button>
                                </dt>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.dd
                                            id={panelId}
                                            aria-labelledby={buttonId}
                                            initial={reduced ? false : { height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={reduced ? undefined : { height: 0, opacity: 0 }}
                                            transition={{
                                                type: 'spring',
                                                bounce: 0,
                                                visualDuration: 0.32,
                                                opacity: { duration: 0.2 },
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <p className="max-w-3xl pb-7 pr-14 text-pretty leading-relaxed text-muted-foreground">
                                                {item.a}
                                            </p>
                                        </motion.dd>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </dl>

                <Reveal delay={0.1}>
                    <p className="mt-10 text-center text-muted-foreground">
                        Still unsure?{' '}
                        <a
                            href="#contact"
                            className="font-semibold text-brand-400 underline-offset-4 hover:underline"
                        >
                            Ask us directly
                        </a>{' '}
                        — we answer within 24 hours.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
