import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * The repeating layout blocks the content pages are assembled from.
 *
 * Keeping these in one module is what stops nine service pages drifting into
 * nine slightly different designs — every page is the same components fed
 * different data.
 */

/** A responsive grid of titled cards. Used for capabilities, problems, audiences. */
export function CardGrid({ items, columns = 2, numbered = false }) {
    return (
        <ul
            className={cn(
                'grid gap-5',
                columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2',
            )}
        >
            {items.map((item, i) => (
                <li key={item.title} className="h-full">
                    <Reveal className="h-full" delay={Math.min(i, 4) * 0.05} y={24}>
                        <TiltCard className="h-full" wrapperClassName="h-full" intensity={5} lift={8}>
                            <Card className="flex h-full flex-col gap-3 p-7">
                                {numbered && (
                                    <span
                                        aria-hidden="true"
                                        className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-400"
                                    >
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                )}
                                <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
                                    {item.title}
                                </h3>
                                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                                    {item.body}
                                </p>
                            </Card>
                        </TiltCard>
                    </Reveal>
                </li>
            ))}
        </ul>
    );
}

/** A numbered vertical list with a rule down the left. Used for process steps. */
export function StepList({ items }) {
    return (
        <ol className="relative space-y-8 border-l border-border pl-8">
            {items.map((item, i) => (
                <li key={item.title}>
                    <Reveal delay={Math.min(i, 4) * 0.05} y={20}>
                        <span
                            aria-hidden="true"
                            className="absolute -left-[9px] grid size-[18px] place-items-center rounded-full border border-border bg-background"
                        >
                            <span className="size-1.5 rounded-full bg-brand-500" />
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-400">
                            Step {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className="mt-2 font-heading text-xl font-bold tracking-tight text-foreground">
                            {item.title}
                        </h3>
                        <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                            {item.body}
                        </p>
                    </Reveal>
                </li>
            ))}
        </ol>
    );
}

/** Prose paragraphs. `html` allows the small amount of inline markup in copy. */
export function Prose({ paragraphs, className }) {
    return (
        <div className={cn('space-y-5', className)}>
            {paragraphs.map((text, i) => (
                <Reveal key={i} delay={Math.min(i, 3) * 0.05} y={18}>
                    <p
                        className="text-pretty text-lg leading-relaxed text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: text }}
                    />
                </Reveal>
            ))}
        </div>
    );
}

/** Grouped technology chips. */
export function TechStrip({ groups }) {
    return (
        <ul className="grid gap-6 sm:grid-cols-2">
            {groups.map((group, i) => (
                <li key={group.group}>
                    <Reveal delay={Math.min(i, 4) * 0.05} y={18}>
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-400">
                            {group.group}
                        </h3>
                        <ul className="mt-3 flex flex-wrap gap-2">
                            {group.items.map((item) => (
                                <li key={item}>
                                    <Badge variant="outline" size="sm">
                                        {item}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </li>
            ))}
        </ul>
    );
}

/** A checked list. Used for use cases and build-vs-buy criteria. */
export function CheckList({ items, className }) {
    return (
        <ul className={cn('space-y-3', className)}>
            {items.map((item, i) => (
                <li key={item} className="flex gap-3">
                    <Reveal delay={Math.min(i, 5) * 0.04} y={12} className="flex gap-3">
                        <Check
                            aria-hidden="true"
                            className="mt-1 size-4 shrink-0 text-brand-400"
                        />
                        <span className="text-pretty leading-relaxed text-muted-foreground">
                            {item}
                        </span>
                    </Reveal>
                </li>
            ))}
        </ul>
    );
}

/** Cross-links to other pages. The internal-linking workhorse. */
export function LinkCards({ items, columns = 3 }) {
    return (
        <ul
            className={cn(
                'grid gap-5',
                columns === 4
                    ? 'sm:grid-cols-2 lg:grid-cols-4'
                    : columns === 2
                      ? 'sm:grid-cols-2'
                      : 'sm:grid-cols-2 lg:grid-cols-3',
            )}
        >
            {items.map((item, i) => (
                <li key={item.href} className="h-full">
                    <Reveal className="h-full" delay={Math.min(i, 4) * 0.05} y={20}>
                        <Link to={item.href} className="group block h-full">
                            <TiltCard
                                className="h-full"
                                wrapperClassName="h-full"
                                intensity={5}
                                lift={8}
                            >
                                <Card className="flex h-full flex-col gap-2 p-6">
                                    <span className="flex items-start justify-between gap-3">
                                        <span className="font-heading text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-brand-300">
                                            {item.title}
                                        </span>
                                        <ArrowUpRight
                                            aria-hidden="true"
                                            className="mt-1 size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-300"
                                        />
                                    </span>
                                    {item.body && (
                                        <span className="text-pretty text-sm leading-relaxed text-muted-foreground">
                                            {item.body}
                                        </span>
                                    )}
                                </Card>
                            </TiltCard>
                        </Link>
                    </Reveal>
                </li>
            ))}
        </ul>
    );
}

/** Closing call to action. Every content page ends with one. */
export function CtaBand({
    title = 'Tell us what you are trying to build.',
    body = 'A short conversation is usually enough to tell you whether this is a week of work or a quarter of it — and whether you should be building it at all.',
    primary = { href: '/contact', label: 'Start a project' },
    secondary = { href: '/projects', label: 'See our work' },
}) {
    return (
        <section className="px-6 py-20">
            <div className="mx-auto max-w-4xl">
                <Reveal y={24}>
                    <Card className="relative overflow-hidden p-10 text-center sm:p-14">
                        <h2 className="text-balance font-heading text-3xl font-bold tracking-[-0.025em] text-foreground sm:text-4xl">
                            {title}
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                            {body}
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button asChild variant="primary" size="lg" className="w-full sm:w-auto">
                                <Link to={primary.href}>
                                    {primary.label}
                                    <ArrowUpRight />
                                </Link>
                            </Button>
                            {secondary && (
                                <Button
                                    asChild
                                    variant="glass"
                                    size="lg"
                                    className="w-full sm:w-auto"
                                >
                                    <Link to={secondary.href}>{secondary.label}</Link>
                                </Button>
                            )}
                        </div>
                    </Card>
                </Reveal>
            </div>
        </section>
    );
}
