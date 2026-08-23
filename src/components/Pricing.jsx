import { useState, useRef, useEffect, useCallback } from 'react';
import { Check, Sparkles } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import Magnetic from '@/components/motion/Magnetic';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * ⚠️ PLACEHOLDER PRICING — set real numbers before this goes live.
 *
 * These figures are structural stand-ins. Pricing is a commercial decision,
 * not a design one, and the Offer schema in index.html quotes these same
 * numbers to search engines — publishing prices you do not honour is worse
 * than publishing none. Either set real values in both places, or switch the
 * tiers to "from" / "on enquiry" and drop the priceRange from the schema.
 */
const TIERS = [
    {
        name: 'Launch',
        price: '₹45,000',
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
        price: '₹1,20,000',
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
        price: 'Custom',
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

export default function Pricing() {
    /* Three independent sources of "which tier is lit", in priority order.
       A pinned click beats a hover, and a hover beats whatever scrolled into
       view — otherwise moving the mouse away would snap the highlight to a
       card the reader is not looking at. */
    const [pinned, setPinned] = useState(null);
    const [hovered, setHovered] = useState(null);
    const [scrolled, setScrolled] = useState(null);

    const active = pinned ?? hovered ?? scrolled;
    const listRef = useRef(null);

    /**
     * Scroll-driven highlight, stacked layouts only.
     *
     * Once the three tiers sit side by side they are all in view at once, so
     * a scroll highlight would be meaningless — and it would fight the
     * pointer. The observer is therefore only attached below `lg`.
     */
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)');

        let io = null;
        const attach = () => {
            io?.disconnect();
            io = null;
            setScrolled(null);

            if (mq.matches || !listRef.current) return;

            const cards = [...listRef.current.querySelectorAll('[data-tier]')];
            io = new IntersectionObserver(
                (entries) => {
                    const best = entries
                        .filter((e) => e.isIntersecting)
                        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                    if (best) setScrolled(Number(best.target.dataset.tier));
                },
                { rootMargin: '-35% 0px -35% 0px', threshold: [0, 0.3, 0.6, 1] },
            );
            cards.forEach((c) => io.observe(c));
        };

        attach();
        mq.addEventListener('change', attach);
        return () => {
            mq.removeEventListener('change', attach);
            io?.disconnect();
        };
    }, []);

    /* Tapping a card pins it; tapping the pinned one again releases it. */
    const togglePin = useCallback((i) => {
        setPinned((prev) => (prev === i ? null : i));
    }, []);

    return (
        <section
            id="pricing"
            className="relative overflow-hidden border-y border-border bg-surface-0 px-6 py-28 sm:py-36"
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-field" />

            <div className="relative mx-auto max-w-7xl">
                <div className="mx-auto max-w-2xl text-center">
                    <Reveal>
                        <Badge>Engagements</Badge>
                    </Reveal>

                    <Reveal delay={0.06}>
                        <h2 className="mt-6 text-balance font-heading text-4xl font-bold tracking-[-0.025em] text-foreground md:text-5xl lg:text-6xl">
                            Clear scope, <span className="text-gradient-brand">clear price</span>
                        </h2>
                    </Reveal>

                    <Reveal delay={0.12}>
                        <p className="mt-5 text-pretty text-lg text-muted-foreground">
                            Fixed-scope projects are quoted up front. No hourly billing
                            surprises, no change-request games.
                        </p>
                    </Reveal>
                </div>

                <ul ref={listRef} className="mt-16 grid items-start gap-7 lg:grid-cols-3">
                    {TIERS.map((tier, i) => {
                        const isActive = active === i;
                        const isPinned = pinned === i;

                        return (
                            /* Hit area lives on the <li>, which never moves.
                               The Card inside lifts on hover; if the Card also
                               owned the pointer handlers, that lift would slide
                               it out from under the cursor, fire pointerleave,
                               drop the lift, slide it back — flickering several
                               times a second. Same reason Magnetic splits its
                               wrapper from the element it translates. */
                            <li
                                key={tier.name}
                                data-tier={i}
                                className="h-full"
                                onPointerEnter={() => setHovered(i)}
                                onPointerLeave={() =>
                                    setHovered((prev) => (prev === i ? null : prev))
                                }
                                onClick={() => togglePin(i)}
                            >
                                <Reveal className="h-full" delay={i * 0.08} y={34}>
                                    <TiltCard
                                        className="h-full"
                                        wrapperClassName="h-full"
                                        intensity={5}
                                        lift={10}
                                    >
                                        {/*
                                          Highlight is state-driven, not a :hover
                                          rule, so pointer, tap and scroll can all
                                          light the same card. No tier is lit at
                                          rest — nothing is pre-selected for the
                                          reader.

                                          onClick sits on the card rather than a
                                          wrapping <button>, because the card
                                          already contains a link and nesting
                                          interactive elements breaks keyboard and
                                          screen-reader semantics. Keyboard users
                                          get the same highlight via focus-within.
                                        */}
                                        <Card
                                            className={cn(
                                                'group relative flex h-full cursor-pointer flex-col p-8',
                                                'transition-[border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-expo)]',
                                                'focus-within:border-brand-500/50',
                                                isActive
                                                    ? 'border-brand-500/55 shadow-[0_24px_70px_-24px_color-mix(in_oklch,var(--brand-500)_50%,transparent)] lg:-translate-y-1'
                                                    : 'lg:translate-y-0',
                                            )}
                                        >
                                            {/* Accent rail down the left edge of the lit card. */}
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    'absolute inset-y-8 left-0 w-[3px] origin-center rounded-full',
                                                    'bg-[linear-gradient(180deg,var(--cyan-glow),var(--brand-400),var(--violet-glow))]',
                                                    'transition-transform duration-500 ease-[var(--ease-out-expo)]',
                                                    isActive ? 'scale-y-100' : 'scale-y-0',
                                                )}
                                            />

                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                                                        {tier.name}
                                                    </h3>
                                                    <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                                                        {tier.blurb}
                                                    </p>
                                                </div>

                                                {tier.popular && (
                                                    <Badge
                                                        variant="outline"
                                                        size="sm"
                                                        className="shrink-0 bg-card"
                                                    >
                                                        <Sparkles className="size-3" aria-hidden="true" />
                                                        Most chosen
                                                    </Badge>
                                                )}
                                            </div>

                                            <p className="mt-7 flex items-baseline gap-2">
                                                <span className="font-heading text-4xl font-extrabold tracking-tight text-foreground">
                                                    {tier.price}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {tier.cadence}
                                                </span>
                                            </p>

                                            <ul className="mt-7 flex-1 space-y-3">
                                                {tier.features.map((f) => (
                                                    <li
                                                        key={f}
                                                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                                                    >
                                                        <Check
                                                            className="mt-0.5 size-4 shrink-0 text-brand-400"
                                                            aria-hidden="true"
                                                        />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>

                                            <Magnetic className="mt-8 w-full" strength={0.1}>
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="lg"
                                                    className={cn(
                                                        'w-full transition-colors duration-400',
                                                        isActive &&
                                                            'border-transparent text-white bg-[linear-gradient(100deg,var(--brand-600),var(--brand-500)_45%,var(--violet-glow))]',
                                                    )}
                                                >
                                                    <a href="#contact">{tier.cta}</a>
                                                </Button>
                                            </Magnetic>

                                            {/* Only rendered once pinned, so the copy
                                                never claims a selection the reader
                                                did not make. */}
                                            <span
                                                aria-live="polite"
                                                className={cn(
                                                    'mt-3 block text-center text-xs transition-opacity duration-300',
                                                    isPinned
                                                        ? 'text-brand-400 opacity-100'
                                                        : 'opacity-0',
                                                )}
                                            >
                                                {isPinned ? 'Selected — tap again to clear' : ' '}
                                            </span>
                                        </Card>
                                    </TiltCard>
                                </Reveal>
                            </li>
                        );
                    })}
                </ul>

                <Reveal delay={0.2}>
                    <p className="mt-10 text-center text-sm text-muted-foreground">
                        All engagements include accessibility to WCAG 2.1 AA and a
                        Core&nbsp;Web&nbsp;Vitals pass before launch.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
