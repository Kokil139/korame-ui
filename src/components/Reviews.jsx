import { Star, Quote } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const REVIEWS = [
    {
        quote: 'Korame completely reshaped our online brand. The animation detail blew our investors away, and our bounce rate dropped 45% in the first month.',
        name: 'Alex Rivera',
        title: 'CEO, Nexus AI Studio',
        initials: 'AR',
        gradient: 'from-violet-glow to-brand-500',
    },
    {
        quote: 'The execution speed and fluid motion are unmatched. A fully static deploy saved us thousands in hosting while holding 100/100 Lighthouse scores.',
        name: 'Sarah Chen',
        title: 'Founder, Solana Pay',
        initials: 'SC',
        gradient: 'from-cyan-glow to-brand-500',
    },
    {
        quote: 'Working with Korame was smooth from day one. Responsive, detail-oriented, and genuinely passionate about modern frontend engineering.',
        name: 'Marcus Vance',
        title: 'Product Lead, Elevate Tech',
        initials: 'MV',
        gradient: 'from-brand-500 to-pink-500',
    },
];

export default function Reviews() {
    return (
        <section id="reviews" className="relative overflow-hidden px-6 py-28 sm:py-36">
            <div className="mx-auto max-w-7xl">
                <div className="max-w-2xl">
                    <Reveal>
                        <Badge variant="cyan">Client feedback</Badge>
                    </Reveal>

                    <Reveal delay={0.06}>
                        <h2 className="mt-6 text-balance font-heading text-4xl font-bold tracking-[-0.025em] text-foreground md:text-5xl lg:text-6xl">
                            What founders <span className="text-gradient-brand">say</span>
                        </h2>
                    </Reveal>
                </div>

                <ul className="mt-16 grid gap-7 md:grid-cols-3">
                    {REVIEWS.map((rev, i) => (
                        <li key={rev.name} className="h-full">
                            <Reveal className="h-full" delay={i * 0.1} y={34}>
                                <TiltCard
                                    className="h-full"
                                    wrapperClassName="h-full"
                                    intensity={6}
                                    lift={10}
                                >
                                    <Card className="relative flex h-full flex-col gap-6 overflow-hidden p-8">
                                        <Quote
                                            aria-hidden="true"
                                            className="absolute -right-3 -top-3 size-24 text-ghost"
                                        />

                                        <div
                                            className="flex items-center gap-1 text-amber-400"
                                            aria-label={`${rev.name} rated Korame 5 out of 5`}
                                        >
                                            {Array.from({ length: 5 }).map((_, s) => (
                                                <Star
                                                    key={s}
                                                    aria-hidden="true"
                                                    className="size-4 fill-current"
                                                />
                                            ))}
                                        </div>

                                        <blockquote className="relative flex-1 text-pretty leading-relaxed text-foreground/90">
                                            &ldquo;{rev.quote}&rdquo;
                                        </blockquote>

                                        <div className="flex items-center gap-4 border-t border-border pt-5">
                                            <span
                                                aria-hidden="true"
                                                className={`grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-tr ${rev.gradient} text-sm font-bold text-white`}
                                            >
                                                {rev.initials}
                                            </span>
                                            <span>
                                                <span className="block text-sm font-semibold text-foreground">
                                                    {rev.name}
                                                </span>
                                                <span className="block text-xs text-muted-foreground">
                                                    {rev.title}
                                                </span>
                                            </span>
                                        </div>
                                    </Card>
                                </TiltCard>
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
