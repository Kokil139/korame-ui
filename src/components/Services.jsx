import { Link } from 'react-router-dom';
import { Code2, LayoutDashboard, Cloud, ArrowUpRight, ArrowRight } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import Aurora from '@/components/motion/Aurora';
import TileImage from '@/components/motion/TileImage';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SERVICE_LIST, serviceBySlug, servicePath } from '@/content/service-list';

/**
 * Capability cards.
 *
 * Three featured services carry the artwork; the remaining five are a compact
 * link list underneath. Every service page is therefore linked from the
 * homepage  which is what makes the site's link graph shallow  without
 * putting eight full-bleed cards on one screen.
 *
 * The tiles are one image per service, generated from the source renders in
 * scripts/tile-art/  see scripts/generate-tile-art.mjs. They are
 * lazy-loaded below the fold and served through a srcSet, so nothing here
 * blocks the first paint.
 */
const FEATURED = [
    {
        slug: 'web-development',
        icon: Code2,
        tone: 'text-brand-300',
    },
    {
        slug: 'web-app-development',
        icon: LayoutDashboard,
        tone: 'text-cyan-glow',
    },
    {
        slug: 'cloud-solutions',
        icon: Cloud,
        tone: 'text-violet-glow',
    },
];

const FEATURED_SLUGS = FEATURED.map((f) => f.slug);

export default function Services() {
    const rest = SERVICE_LIST.filter((s) => !FEATURED_SLUGS.includes(s.slug));

    return (
        <section id="services" className="relative overflow-hidden px-6 py-28 sm:py-36">
            <Aurora intensity="soft" grid />

            <div className="relative mx-auto max-w-7xl">
                <div className="text-center">
                    <Reveal>
                        <Badge>Capabilities</Badge>
                    </Reveal>

                    <Reveal delay={0.06}>
                        <h2 className="mt-6 text-balance font-heading text-4xl font-bold tracking-[-0.025em] text-foreground md:text-5xl lg:text-6xl">
                            What we <span className="text-gradient-brand">build for you</span>
                        </h2>
                    </Reveal>

                    <Reveal delay={0.12}>
                        <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
                            One standard across all of it. Everything ships fast, accessible and
                            search-ready, and you own the result.
                        </p>
                    </Reveal>
                </div>

                <div className="mt-16 grid gap-7 md:grid-cols-3">
                    {FEATURED.map((entry, i) => {
                        const item = serviceBySlug(entry.slug);
                        if (!item) return null;

                        return (
                            <Reveal key={item.slug} className="h-full" delay={i * 0.1} y={36}>
                                <Link
                                    to={servicePath(item.slug)}
                                    className="group block h-full"
                                    aria-label={`${item.nav}  read more`}
                                >
                                    <TiltCard
                                        className="h-full"
                                        wrapperClassName="h-full"
                                        intensity={8}
                                        lift={12}
                                    >
                                        <Card className="flex h-full flex-col overflow-hidden p-0">
                                            <TileImage
                                                name={item.art}
                                                alt={`${item.nav} at Korame`}
                                                className="h-48 border-b border-border"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            >
                                                {/* Icon badge, lifted on hover */}
                                                <span
                                                    className={`absolute bottom-5 left-6 grid size-12 place-items-center rounded-2xl border border-border bg-card/90 backdrop-blur-xl ${entry.tone} shadow-lg transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1 group-hover:scale-105`}
                                                >
                                                    <entry.icon className="size-5" aria-hidden="true" />
                                                </span>

                                                <ArrowUpRight className="absolute right-6 top-6 size-5 text-white/70 opacity-0 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                                            </TileImage>

                                            <div className="flex flex-1 flex-col justify-between gap-6 p-7">
                                                <div>
                                                    <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand-200">
                                                        {item.nav}
                                                    </h3>
                                                    <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                <ul className="flex flex-wrap gap-2">
                                                    {item.chips.map((tag) => (
                                                        <li key={tag}>
                                                            <Badge variant="outline" size="sm">
                                                                {tag}
                                                            </Badge>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </Card>
                                    </TiltCard>
                                </Link>
                            </Reveal>
                        );
                    })}
                </div>

                {/* The remaining services, as a compact row of links. Keeps
                    every service page one hop from the homepage. */}
                <Reveal delay={0.1} y={26}>
                    <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {rest.map((item) => (
                            <li key={item.slug}>
                                <Link
                                    to={servicePath(item.slug)}
                                    className="group flex items-center justify-between gap-3 rounded-2xl border border-border px-5 py-4 glow-interactive hover:border-brand-400/50 hover:bg-elevate"
                                >
                                    <span className="font-heading text-base font-bold tracking-tight text-foreground">
                                        {item.nav}
                                    </span>
                                    <ArrowRight
                                        aria-hidden="true"
                                        className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-300"
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Reveal>

                <Reveal delay={0.14}>
                    <div className="mt-12 text-center">
                        <Button asChild variant="glass" size="lg" className="group">
                            <Link to="/services">
                                Compare all services
                                <ArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </Link>
                        </Button>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
