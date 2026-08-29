import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import Seo from '@/components/Seo';
import PageHero from '@/components/page/PageHero';
import Section from '@/components/page/Section';
import { CtaBand } from '@/components/page/Blocks';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import TileImage from '@/components/motion/TileImage';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PROJECTS, projectPath } from '@/content/projects';
import {
    breadcrumbNode,
    graph,
    itemListNode,
    organizationNode,
    webPageNode,
    websiteNode,
} from '@/lib/seo';

const TITLE = 'Projects & Case Studies | Korame';
const DESCRIPTION =
    'Project experience from Korame: real-time 3D on the web, scroll-driven narrative sites and programmatic brand animation — each written up with what was actually engineered.';

export default function ProjectsIndex() {
    const trail = [{ name: 'Projects', path: '/projects' }];

    const jsonLd = graph(
        organizationNode(),
        websiteNode(),
        webPageNode({
            path: '/projects',
            name: TITLE,
            description: DESCRIPTION,
            breadcrumbPath: '/projects',
        }),
        breadcrumbNode(trail),
        itemListNode({
            path: '/projects',
            name: 'Korame project experience',
            items: PROJECTS.map((p) => ({ name: p.name, path: projectPath(p.slug) })),
        }),
    );

    return (
        <>
            <Seo title={TITLE} description={DESCRIPTION} path="/projects" jsonLd={jsonLd} />

            <PageHero
                kicker="Project experience"
                title="Things we have actually built"
                lede="Three builds, written up honestly. Each one exists because it forced a specific engineering problem to be solved properly — real-time 3D that does not melt a laptop, a video narrative that only ever decodes one clip, a brand intro that weighs a few kilobytes."
                trail={trail}
            />

            <Section width="max-w-6xl">
                <ul className="space-y-8">
                    {PROJECTS.map((project, i) => (
                        <li key={project.slug}>
                            <Reveal delay={Math.min(i, 3) * 0.06} y={28}>
                                <TiltCard intensity={4} lift={8}>
                                    <Card className="overflow-hidden p-0">
                                        <div className="grid md:grid-cols-2">
                                            <TileImage
                                                name={project.art}
                                                alt={project.artAlt}
                                                /* The brand tiles are light paper; the scrim fades into var(--card),
                                                   which on the dark theme would drop a shadow across the bottom of a
                                                   pale card. The border below the tile is the separator instead. */
                                                scrim={false}
                                                className="h-56 border-b border-border md:h-full md:min-h-[22rem] md:border-b-0 md:border-r"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                parallax={30}
                                            />

                                            <div className="flex flex-col justify-between gap-6 p-8 sm:p-10">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-400">
                                                            {project.kind}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {project.year}
                                                        </span>
                                                    </div>

                                                    <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-foreground">
                                                        {project.name}
                                                    </h2>
                                                    <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                                                        {project.tagline}
                                                    </p>

                                                    <ul className="mt-6 flex flex-wrap gap-2">
                                                        {project.capabilities.map((c) => (
                                                            <li key={c}>
                                                                <Badge variant="outline" size="sm">
                                                                    {c}
                                                                </Badge>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                                                    <Link
                                                        to={projectPath(project.slug)}
                                                        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground"
                                                    >
                                                        Read the case study
                                                        <ArrowUpRight
                                                            aria-hidden="true"
                                                            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                        />
                                                    </Link>

                                                    {project.liveUrl ? (
                                                        <a
                                                            href={project.liveUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                                        >
                                                            View live project
                                                            <ExternalLink
                                                                aria-hidden="true"
                                                                className="size-3.5"
                                                            />
                                                        </a>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">
                                                            Live demo currently offline
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
            </Section>

            <Section kicker="A note on these" title="Why they are studio builds" width="max-w-4xl">
                <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
                    <Reveal y={18}>
                        <p className="text-pretty">
                            All three are Korame builds rather than client engagements, and they
                            say so. Presenting our own work as somebody else&apos;s commission
                            would be a fabrication, and it would be an unnecessary one — the
                            engineering is the same either way, and it is what these pages are
                            about.
                        </p>
                    </Reveal>
                    <Reveal y={18} delay={0.05}>
                        <p className="text-pretty">
                            You will also not find conversion percentages or traffic multiples
                            here. We do not publish metrics we cannot substantiate, which rules
                            out most of what agency case studies usually claim. What you get
                            instead is a description of what was built and why, specific enough
                            to be checked.
                        </p>
                    </Reveal>
                </div>
            </Section>

            <CtaBand
                title="Want something built to this standard?"
                secondary={{ href: '/services', label: 'Browse services' }}
            />
        </>
    );
}
