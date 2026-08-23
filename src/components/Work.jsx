import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import TileImage from '@/components/motion/TileImage';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { springSnap } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * ⚠️ PLACEHOLDER CONTENT — replace before this goes live.
 *
 * These are structural stand-ins so the section can be designed and shipped.
 * Publishing invented client names or invented metrics on a real agency site
 * would misrepresent the business to its visitors. Swap in real projects, or
 * cut the section, before deploying.
 *
 * `accent` drives the generated cover art; there are no image files.
 */
const PROJECTS = [
    {
        slug: 'placeholder-commerce',
        art: 'work-commerce',
        artAlt: 'Abstract storefront dashboard interface',
        client: 'Project One',
        title: 'Headless storefront rebuild',
        summary:
            'Replatformed a legacy storefront onto a headless stack with an edge-cached catalogue and a two-step checkout.',
        tags: ['E-commerce', 'Full-stack'],
        category: 'E-commerce',
        metrics: [
            ['—', 'Conversion lift'],
            ['—', 'LCP'],
        ],
        accent: 'var(--brand-500)',
    },
    {
        slug: 'placeholder-saas',
        art: 'work-saas',
        artAlt: 'Overlapping colour system and type scale',
        client: 'Project Two',
        title: 'SaaS marketing site & design system',
        summary:
            'A component library and motion language shared between the marketing site and the in-product onboarding flow.',
        tags: ['Design system', 'Motion'],
        category: 'Design',
        metrics: [
            ['—', 'Bounce rate'],
            ['—', 'Components'],
        ],
        accent: 'var(--cyan-glow)',
    },
    {
        slug: 'placeholder-ai',
        art: 'work-ai',
        artAlt: 'A neural mesh with one lit signal path',
        client: 'Project Three',
        title: 'AI-assisted client portal',
        summary:
            'A document portal with retrieval-backed search and streamed summaries, built against a strict latency budget.',
        tags: ['AI integration', 'Full-stack'],
        category: 'AI',
        metrics: [
            ['—', 'Time to first token'],
            ['—', 'Docs indexed'],
        ],
        accent: 'var(--violet-glow)',
    },
    {
        slug: 'placeholder-seo',
        art: 'work-seo',
        artAlt: 'Rising analytics bars behind a trend line',
        client: 'Project Four',
        title: 'Technical SEO recovery',
        summary:
            'Diagnosed a traffic collapse from a botched migration: restored routing, structured data and Core Web Vitals.',
        tags: ['Technical SEO', 'Performance'],
        category: 'SEO',
        metrics: [
            ['—', 'Organic sessions'],
            ['—', 'Indexed pages'],
        ],
        accent: 'var(--brand-400)',
    },
];

const FILTERS = ['All', 'E-commerce', 'Design', 'AI', 'SEO'];

export default function Work() {
    const [filter, setFilter] = useState('All');
    const reduced = useReducedMotion();

    const visible =
        filter === 'All'
            ? PROJECTS
            : PROJECTS.filter((p) => p.category === filter);

    return (
        <section id="work" className="relative overflow-hidden px-6 py-28 sm:py-36">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <Reveal>
                            <Badge>Selected work</Badge>
                        </Reveal>

                        <Reveal delay={0.06}>
                            <h2 className="mt-6 text-balance font-heading text-4xl font-bold tracking-[-0.025em] text-foreground md:text-5xl lg:text-6xl">
                                Things we&apos;ve <span className="text-gradient-brand">shipped</span>
                            </h2>
                        </Reveal>
                    </div>

                    {/* Filter pills. The active indicator is a shared layout
                        element, so it slides between pills instead of fading. */}
                    <Reveal delay={0.1}>
                        <div
                            role="tablist"
                            aria-label="Filter work by category"
                            className="flex flex-wrap gap-1.5"
                        >
                            {FILTERS.map((f) => {
                                const isActive = filter === f;
                                return (
                                    <button
                                        key={f}
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setFilter(f)}
                                        className={cn(
                                            'relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300',
                                            isActive
                                                ? 'text-primary-foreground'
                                                : 'text-muted-foreground hover:text-foreground',
                                        )}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId={reduced ? undefined : 'work-filter'}
                                                transition={springSnap}
                                                className="absolute inset-0 -z-10 rounded-full bg-brand-500"
                                            />
                                        )}
                                        {f}
                                    </button>
                                );
                            })}
                        </div>
                    </Reveal>
                </div>

                {/* `layout` on the list lets surviving cards glide to their new
                    slot when the filter changes, rather than snapping. */}
                <motion.ul layout={!reduced} className="mt-14 grid gap-7 md:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                        {visible.map((project, i) => (
                            <motion.li
                                key={project.slug}
                                layout={!reduced}
                                initial={reduced ? false : { opacity: 0, scale: 0.94 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={reduced ? undefined : { opacity: 0, scale: 0.94 }}
                                transition={{ ...springSnap, delay: reduced ? 0 : i * 0.04 }}
                                className="h-full"
                            >
                                <TiltCard
                                    className="h-full"
                                    wrapperClassName="h-full"
                                    intensity={6}
                                    lift={10}
                                >
                                    <Card className="group flex h-full flex-col overflow-hidden p-0">
                                        <TileImage
                                            name={project.art}
                                            alt={project.artAlt}
                                            className="h-52 border-b border-border sm:h-60"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            parallax={32}
                                        >
                                            <ArrowUpRight className="absolute right-5 top-5 size-5 text-white/70 opacity-0 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                                        </TileImage>

                                        <div className="flex flex-1 flex-col justify-between gap-6 p-7">
                                            <div>
                                                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-400">
                                                    {project.client}
                                                </p>
                                                <h3 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground">
                                                    {project.title}
                                                </h3>
                                                <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                                                    {project.summary}
                                                </p>
                                            </div>

                                            <div>
                                                <dl className="grid grid-cols-2 gap-4 border-t border-border pt-5">
                                                    {project.metrics.map(([value, label]) => (
                                                        <div key={label}>
                                                            <dt className="text-xs text-muted-foreground">
                                                                {label}
                                                            </dt>
                                                            <dd className="mt-0.5 font-heading text-xl font-bold text-foreground">
                                                                {value}
                                                            </dd>
                                                        </div>
                                                    ))}
                                                </dl>

                                                <ul className="mt-5 flex flex-wrap gap-2">
                                                    {project.tags.map((tag) => (
                                                        <li key={tag}>
                                                            <Badge variant="outline" size="sm">
                                                                {tag}
                                                            </Badge>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </Card>
                                </TiltCard>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </motion.ul>
            </div>
        </section>
    );
}
