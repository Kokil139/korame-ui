import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Seo from '@/components/Seo';
import PageHero from '@/components/page/PageHero';
import Section from '@/components/page/Section';
import { CtaBand } from '@/components/page/Blocks';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import TileImage from '@/components/motion/TileImage';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SERVICE_LIST, servicePath } from '@/content/service-list';
import {
    breadcrumbNode,
    graph,
    itemListNode,
    organizationNode,
    webPageNode,
    websiteNode,
} from '@/lib/seo';

const TITLE = 'Services | Web, Application, Software & Cloud Engineering | Korame';
const DESCRIPTION =
    'What Korame builds: web development, web design, web and mobile-adjacent applications, full-stack systems, custom software, and cloud and Azure deployment.';

/**
 * The services hub.
 *
 * Its job in the link graph is to be the single parent every service page
 * points back to, so the nine service URLs read as one coherent section
 * rather than nine unrelated landing pages.
 */
export default function ServicesIndex() {
    const trail = [{ name: 'Services', path: '/services' }];

    const jsonLd = graph(
        organizationNode(),
        websiteNode(),
        webPageNode({
            path: '/services',
            name: TITLE,
            description: DESCRIPTION,
            breadcrumbPath: '/services',
        }),
        breadcrumbNode(trail),
        itemListNode({
            path: '/services',
            name: 'Korame services',
            items: SERVICE_LIST.map((s) => ({ name: s.nav, path: servicePath(s.slug) })),
        }),
    );

    return (
        <>
            <Seo title={TITLE} description={DESCRIPTION} path="/services" jsonLd={jsonLd} />

            <PageHero
                kicker="Services"
                title="What we build"
                lede="Nine ways of describing one practice: designing, engineering and deploying software that runs on the web. Each page below says plainly what the work involves, what it costs you to skip, and where we have done it."
                trail={trail}
            />

            <Section width="max-w-7xl">
                <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {SERVICE_LIST.map((service, i) => (
                        <li key={service.slug} className="h-full">
                            <Reveal className="h-full" delay={Math.min(i, 5) * 0.05} y={26}>
                                <Link
                                    to={servicePath(service.slug)}
                                    className="group block h-full"
                                    aria-label={`${service.nav}  read more`}
                                >
                                    <TiltCard
                                        className="h-full"
                                        wrapperClassName="h-full"
                                        intensity={7}
                                        lift={11}
                                    >
                                        <Card className="flex h-full flex-col overflow-hidden p-0">
                                            <TileImage
                                                name={service.art}
                                                alt={`${service.nav} at Korame`}
                                                className="h-40 border-b border-border"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            >
                                                <ArrowUpRight className="absolute right-5 top-5 size-5 text-white/70 opacity-0 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                                            </TileImage>

                                            <div className="flex flex-1 flex-col justify-between gap-5 p-7">
                                                <div>
                                                    <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand-300">
                                                        {service.nav}
                                                    </h2>
                                                    <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                                                        {service.description}
                                                    </p>
                                                </div>

                                                <ul className="flex flex-wrap gap-2">
                                                    {service.chips.map((t) => (
                                                        <li key={t}>
                                                            <Badge variant="outline" size="sm">
                                                                {t}
                                                            </Badge>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </Card>
                                    </TiltCard>
                                </Link>
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section
                kicker="How we scope"
                title="One team, from the schema to the focus ring"
                width="max-w-4xl"
            >
                <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
                    <Reveal y={18}>
                        <p className="text-pretty">
                            These are not nine separate departments. Most engagements draw on
                            several of them at once  a web application needs design, frontend,
                            an API, a data model and somewhere to run, and splitting those across
                            vendors moves the hardest problems into the gaps between them.
                        </p>
                    </Reveal>
                    <Reveal y={18} delay={0.05}>
                        <p className="text-pretty">
                            The pages are separate because the questions people arrive with are
                            separate. Someone comparing custom software against an off-the-shelf
                            product needs a different answer from someone whose Azure deployment
                            returns 404 on refresh  and both deserve a real one.
                        </p>
                    </Reveal>
                </div>
            </Section>

            <CtaBand secondary={{ href: '/projects', label: 'See project experience' }} />
        </>
    );
}
