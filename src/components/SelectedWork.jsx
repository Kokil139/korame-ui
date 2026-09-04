import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import TileImage from '@/components/motion/TileImage';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PROJECTS, projectPath } from '@/content/projects';

/**
 * Selected work.
 *
 * Replaces the placeholder `Work` section, which shipped four invented
 * projects ("Project One" … "Project Four") with em-dash metrics standing in
 * for numbers that were never going to exist. These are the three real
 * builds, each linking to a case study and  where the deployment is
 * actually up  to the live site.
 *
 * The live link stays conditional on purpose. All three deployments are up
 * today, but a "View live project" button that lands on a 404 is worse than
 * no button  so the link is driven by `liveUrl` in content/projects.js and
 * simply disappears if one goes down again.
 */
export default function SelectedWork() {
    return (
        <section id="work" className="relative overflow-hidden px-6 py-28 sm:py-36">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <Reveal>
                            <Badge>Project experience</Badge>
                        </Reveal>

                        <Reveal delay={0.06}>
                            <h2 className="mt-6 text-balance font-heading text-4xl font-bold tracking-[-0.025em] text-foreground md:text-5xl lg:text-6xl">
                                Things we&apos;ve <span className="text-gradient-brand">shipped</span>
                            </h2>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <p className="mt-5 text-pretty text-lg text-muted-foreground">
                                Three builds, each written up with what was actually engineered 
                                no invented metrics, no borrowed logos.
                            </p>
                        </Reveal>
                    </div>

                    <Reveal delay={0.14}>
                        <Button asChild variant="glass" size="md" className="group">
                            <Link to="/projects">
                                All projects
                                <ArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </Link>
                        </Button>
                    </Reveal>
                </div>

                <ul className="mt-14 grid gap-7 md:grid-cols-3">
                    {PROJECTS.map((project, i) => (
                        <li key={project.slug} className="h-full">
                            <Reveal className="h-full" delay={i * 0.08} y={32}>
                                <TiltCard
                                    className="h-full"
                                    wrapperClassName="h-full"
                                    intensity={6}
                                    lift={10}
                                >
                                    <Card className="group flex h-full flex-col overflow-hidden p-0">
                                        <Link
                                            to={projectPath(project.slug)}
                                            className="block"
                                            tabIndex={-1}
                                            aria-hidden="true"
                                        >
                                            <TileImage
                                                name={project.art}
                                                alt={project.artAlt}
                                                /* The brand tiles are light paper; the scrim fades into var(--card),
                                                   which on the dark theme would drop a shadow across the bottom of a
                                                   pale card. The border below the tile is the separator instead. */
                                                scrim={false}
                                                className="h-52 border-b border-border sm:h-56"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                parallax={32}
                                            >
                                                <ArrowUpRight className="absolute right-5 top-5 size-5 text-white/70 opacity-0 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                                            </TileImage>
                                        </Link>

                                        <div className="flex flex-1 flex-col justify-between gap-6 p-7">
                                            <div>
                                                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-400">
                                                    {project.kind} · {project.year}
                                                </p>

                                                <h3 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground">
                                                    <Link
                                                        to={projectPath(project.slug)}
                                                        className="transition-colors duration-300 hover:text-brand-300"
                                                    >
                                                        {project.name}
                                                    </Link>
                                                </h3>

                                                <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                                                    {project.tagline}
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="sr-only">Capabilities demonstrated</h4>
                                                <ul className="flex flex-wrap gap-2 border-t border-border pt-5">
                                                    {project.capabilities.map((c) => (
                                                        <li key={c}>
                                                            <Badge variant="outline" size="sm">
                                                                {c}
                                                            </Badge>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                                                    <Link
                                                        to={projectPath(project.slug)}
                                                        className="font-semibold text-foreground underline-offset-4 hover:underline"
                                                    >
                                                        View case study
                                                    </Link>

                                                    {project.liveUrl ? (
                                                        <a
                                                            href={project.liveUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                                                        >
                                                            View live project
                                                            <ExternalLink
                                                                aria-hidden="true"
                                                                className="size-3.5"
                                                            />
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            Live demo offline
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
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
