import { Link, useParams } from 'react-router-dom';
import { ExternalLink, Info } from 'lucide-react';
import Seo from '@/components/Seo';
import PageHero from '@/components/page/PageHero';
import Section from '@/components/page/Section';
import { CardGrid, CtaBand, LinkCards, Prose } from '@/components/page/Blocks';
import Reveal from '@/components/motion/Reveal';
import TileImage from '@/components/motion/TileImage';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NotFound from '@/pages/NotFound';
import { PROJECTS, getProject, projectPath } from '@/content/projects';
import { serviceBySlug, servicePath } from '@/content/service-list';
import {
    breadcrumbNode,
    creativeWorkNode,
    graph,
    organizationNode,
    webPageNode,
    websiteNode,
} from '@/lib/seo';

/**
 * A case study.
 *
 * Structure follows the shape a reader evaluating a studio actually reads in:
 * what it is, what was hard, what we did about it, what that required, and
 * what came out. No invented metrics  see the header comment in
 * content/projects.js for why that constraint is enforced at the data layer.
 */
export default function ProjectPage() {
    const { slug } = useParams();
    const project = getProject(slug);

    if (!project) return <NotFound />;

    const path = projectPath(project.slug);
    const trail = [
        { name: 'Projects', path: '/projects' },
        { name: project.name, path },
    ];

    const jsonLd = graph(
        organizationNode(),
        websiteNode(),
        webPageNode({
            path,
            name: project.title,
            description: project.description,
            breadcrumbPath: path,
        }),
        breadcrumbNode(trail),
        creativeWorkNode(project),
    );

    const relatedServices = project.services
        .map(serviceBySlug)
        .filter(Boolean)
        .map((s) => ({ href: servicePath(s.slug), title: s.nav, body: s.short }));

    const otherProjects = PROJECTS.filter((p) => p.slug !== project.slug);

    return (
        <>
            <Seo
                title={project.title}
                description={project.description}
                path={path}
                type="article"
                jsonLd={jsonLd}
            />

            <PageHero
                kicker={`${project.kind} · ${project.year}`}
                title={project.name}
                lede={project.tagline}
                trail={trail}
            >
                <div className="flex flex-wrap items-center gap-3">
                    {project.liveUrl ? (
                        <Button asChild variant="primary" size="lg">
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View live project
                                <ExternalLink />
                            </a>
                        </Button>
                    ) : null}

                    <Button asChild variant="glass" size="lg">
                        <Link to="/projects">All projects</Link>
                    </Button>
                </div>

                {project.liveNote && (
                    <p className="mt-5 flex max-w-2xl items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-400" />
                        {project.liveNote}
                    </p>
                )}
            </PageHero>

            <section className="px-6 pb-4">
                <div className="mx-auto max-w-6xl">
                    <Reveal y={26}>
                        <Card className="overflow-hidden p-0">
                            <TileImage
                                name={project.art}
                                alt={project.artAlt}
                                /* The brand tiles are light paper; the scrim fades into var(--card),
                                   which on the dark theme would drop a shadow across the bottom of a
                                   pale card. The border below the tile is the separator instead. */
                                scrim={false}
                                className="h-60 sm:h-80"
                                sizes="(max-width: 1024px) 100vw, 72rem"
                                parallax={36}
                            />
                        </Card>
                    </Reveal>
                </div>
            </section>

            {/* Fact strip  capabilities and stack, both verifiable. */}
            <Section width="max-w-5xl">
                <div className="grid gap-8 sm:grid-cols-2">
                    <Reveal y={20}>
                        <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-400">
                            Capabilities demonstrated
                        </h2>
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {project.capabilities.map((c) => (
                                <li key={c}>
                                    <Badge size="sm">{c}</Badge>
                                </li>
                            ))}
                        </ul>
                    </Reveal>

                    <Reveal y={20} delay={0.05}>
                        <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-400">
                            Stack
                        </h2>
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {project.stack.map((t) => (
                                <li key={t}>
                                    <Badge variant="outline" size="sm">
                                        {t}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </Section>

            <Section kicker="Overview" title="What it is">
                <Prose paragraphs={project.overview} />
            </Section>

            <Section kicker="Challenge" title="What made it hard">
                <Prose paragraphs={project.challenge} />
            </Section>

            <Section kicker="Solution" title="How we approached it">
                <Prose paragraphs={project.solution} />
            </Section>

            <Section
                kicker="Key features"
                title="What was built"
                width="max-w-6xl"
            >
                <CardGrid items={project.features} columns={3} />
            </Section>

            <Section kicker="Engineering" title="Under the hood" width="max-w-5xl">
                <div className="space-y-6">
                    {project.engineering.map((item, i) => (
                        <Reveal key={item.title} delay={Math.min(i, 4) * 0.04} y={20}>
                            <Card className="p-7">
                                <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
                                    {item.title}
                                </h3>
                                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                                    {item.body}
                                </p>
                            </Card>
                        </Reveal>
                    ))}
                </div>
            </Section>

            <Section kicker="Experience & design" title="How it feels to use">
                <Prose paragraphs={project.experience} />
            </Section>

            <Section kicker="Outcome" title="What came out of it">
                <Prose paragraphs={project.outcome} />
            </Section>

            <Section kicker="Services" title="Capabilities this draws on" width="max-w-6xl">
                <LinkCards items={relatedServices} columns={3} />
            </Section>

            <Section kicker="More work" title="Other projects" width="max-w-6xl">
                <LinkCards
                    items={otherProjects.map((p) => ({
                        href: projectPath(p.slug),
                        title: p.name,
                        body: p.tagline,
                    }))}
                    columns={2}
                />
            </Section>

            <CtaBand secondary={{ href: '/services', label: 'What we do' }} />
        </>
    );
}
