import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Seo from '@/components/Seo';
import PageHero from '@/components/page/PageHero';
import Section from '@/components/page/Section';
import FaqList from '@/components/page/FaqList';
import {
    CardGrid,
    CheckList,
    CtaBand,
    LinkCards,
    Prose,
    StepList,
    TechStrip,
} from '@/components/page/Blocks';
import Reveal from '@/components/motion/Reveal';
import TileImage from '@/components/motion/TileImage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NotFound from '@/pages/NotFound';
import { getService, servicePath } from '@/content/services';
import { getProject, projectPath } from '@/content/projects';
import {
    breadcrumbNode,
    faqNode,
    graph,
    organizationNode,
    serviceNode,
    webPageNode,
    websiteNode,
} from '@/lib/seo';

/**
 * One template, nine routes.
 *
 * Every service page is the same components fed a different content module,
 * which is what keeps them consistent as a set and what makes adding a tenth
 * service a content change rather than a design exercise.
 */
export default function ServicePage({ slug: slugProp }) {
    /* The nine service paths are declared explicitly in App.jsx rather than as
       one `:slug` catch-all, so the slug arrives as a prop. useParams is the
       fallback for any future nested form. */
    const params = useParams();
    const slug = slugProp ?? params.slug;
    const service = getService(slug);

    if (!service) return <NotFound />;

    const path = servicePath(service.slug);
    const trail = [
        { name: 'Services', path: '/services' },
        { name: service.nav, path },
    ];

    const jsonLd = graph(
        organizationNode(),
        websiteNode(),
        webPageNode({
            path,
            name: service.title,
            description: service.description,
            breadcrumbPath: path,
        }),
        breadcrumbNode(trail),
        serviceNode(service),
        service.faqs?.length ? faqNode(service.faqs, path) : null,
    );

    const relatedServices = service.related
        .map(getService)
        .filter(Boolean)
        .map((s) => ({ href: servicePath(s.slug), title: s.nav, body: s.short }));

    const relatedProjects = service.projects
        .map(getProject)
        .filter(Boolean);

    return (
        <>
            <Seo
                title={service.title}
                description={service.description}
                path={path}
                jsonLd={jsonLd}
            />

            <PageHero kicker={service.kicker} title={service.h1} lede={service.lede} trail={trail}>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild variant="primary" size="lg">
                        <Link to="/contact">
                            Discuss a {service.short.toLowerCase()} project
                            <ArrowUpRight />
                        </Link>
                    </Button>
                    <Button asChild variant="glass" size="lg">
                        <Link to="/projects">See how we build</Link>
                    </Button>
                </div>
            </PageHero>

            {/* ---------------------------------------------------------
                Definitional section — the "what is this" that a search
                result for the bare term is actually looking for.
               --------------------------------------------------------- */}
            <Section title={service.whatItIs.heading}>
                <Prose paragraphs={service.whatItIs.body} />
            </Section>

            {/* Optional build-vs-buy block; only custom software has one. */}
            {service.decision && (
                <Section kicker="The decision" title={service.decision.heading} width="max-w-5xl">
                    <div className="grid gap-6 md:grid-cols-2">
                        {[service.decision.buy, service.decision.build].map((column) => (
                            <Reveal key={column.title} y={22}>
                                <Card className="h-full p-8">
                                    <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
                                        {column.title}
                                    </h3>
                                    <CheckList items={column.points} className="mt-5" />
                                </Card>
                            </Reveal>
                        ))}
                    </div>
                    {service.decision.note && (
                        <Reveal y={18}>
                            <p className="mt-8 text-pretty leading-relaxed text-muted-foreground">
                                {service.decision.note}
                            </p>
                        </Reveal>
                    )}
                </Section>
            )}

            {/* ---------------------------------------------------------
                What Korame provides
               --------------------------------------------------------- */}
            <Section
                kicker="Capabilities"
                title={`What we provide`}
                width="max-w-6xl"
            >
                <CardGrid items={service.provide} columns={3} />
            </Section>

            {/* Artwork band — reuses the generated tile art, no network images. */}
            <section className="px-6 py-8">
                <div className="mx-auto max-w-6xl">
                    <Reveal y={24}>
                        <Card className="overflow-hidden p-0">
                            <TileImage
                                name={service.art}
                                alt={`${service.nav} at Korame — generated abstract artwork`}
                                className="h-56 sm:h-72"
                                sizes="(max-width: 1024px) 100vw, 72rem"
                                parallax={34}
                            />
                        </Card>
                    </Reveal>
                </div>
            </section>

            {/* ---------------------------------------------------------
                Who it is for / what it solves
               --------------------------------------------------------- */}
            <Section kicker="Who it is for" title="Who we do this for" width="max-w-6xl">
                <CardGrid items={service.audience} columns={3} />
            </Section>

            <Section kicker="Problems" title="What this solves" width="max-w-6xl">
                <CardGrid items={service.problems} columns={2} />
            </Section>

            {/* ---------------------------------------------------------
                How the work runs
               --------------------------------------------------------- */}
            <Section kicker="Approach" title="How we work">
                <StepList items={service.approach} />
            </Section>

            <Section kicker="Technology" title="What we build with" width="max-w-5xl">
                <TechStrip groups={service.tech} />
                <Reveal y={16}>
                    <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
                        This list is what we actually work in, not a catalogue. Where a project
                        needs something outside it, we will say so rather than learn it on your
                        budget.
                    </p>
                </Reveal>
            </Section>

            {/* ---------------------------------------------------------
                The engineering pillars — security, performance, cloud,
                testing, maintenance. Every service page answers these.
               --------------------------------------------------------- */}
            <Section
                kicker="Engineering standards"
                title="The parts nobody demos"
                lede="Security, performance, deployment, testing and maintenance decide whether a project is still working in two years. They are scoped in from the start rather than quoted as extras."
                width="max-w-5xl"
            >
                <div className="space-y-6">
                    {service.pillars.map((pillar, i) => (
                        <Reveal key={pillar.title} delay={Math.min(i, 4) * 0.04} y={20}>
                            <Card className="p-7">
                                <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
                                    {pillar.title}
                                </h3>
                                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                                    {pillar.body}
                                </p>
                            </Card>
                        </Reveal>
                    ))}
                </div>
            </Section>

            <Section kicker="Typical engagements" title="What people come to us with">
                <CheckList items={service.useCases} />
            </Section>

            {/* ---------------------------------------------------------
                Proof — real projects, cross-linked both ways.
               --------------------------------------------------------- */}
            {relatedProjects.length > 0 && (
                <Section
                    kicker="Project experience"
                    title="Where we have done this"
                    lede="Builds where this capability carried real weight. Each case study describes what was actually engineered."
                    width="max-w-6xl"
                >
                    <ul className="grid gap-6 md:grid-cols-3">
                        {relatedProjects.map((project, i) => (
                            <li key={project.slug} className="h-full">
                                <Reveal className="h-full" delay={i * 0.06} y={22}>
                                    <Link
                                        to={projectPath(project.slug)}
                                        className="group block h-full"
                                    >
                                        <Card className="flex h-full flex-col overflow-hidden p-0">
                                            <TileImage
                                                name={project.art}
                                                alt={project.artAlt}
                                                /* The brand tiles are light paper; the scrim fades into var(--card),
                                                   which on the dark theme would drop a shadow across the bottom of a
                                                   pale card. The border below the tile is the separator instead. */
                                                scrim={false}
                                                className="h-40 border-b border-border"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                            <div className="flex flex-1 flex-col gap-2 p-6">
                                                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-400">
                                                    {project.kind}
                                                </span>
                                                <span className="font-heading text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-brand-300">
                                                    {project.name}
                                                </span>
                                                <span className="text-pretty text-sm leading-relaxed text-muted-foreground">
                                                    {project.tagline}
                                                </span>
                                            </div>
                                        </Card>
                                    </Link>
                                </Reveal>
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {/* ---------------------------------------------------------
                FAQ — rendered and emitted as FAQPage structured data from
                the same array.
               --------------------------------------------------------- */}
            {service.faqs?.length > 0 && (
                <Section kicker="Questions" title={`${service.nav} questions we get asked`}>
                    <FaqList faqs={service.faqs} />
                </Section>
            )}

            <Section kicker="Related" title="Adjacent services" width="max-w-6xl">
                <LinkCards items={relatedServices} columns={4} />
            </Section>

            <CtaBand
                title={`Thinking about ${service.short.toLowerCase()}?`}
                secondary={{ href: '/services', label: 'All services' }}
            />
        </>
    );
}
