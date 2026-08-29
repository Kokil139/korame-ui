import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Seo from '@/components/Seo';
import PageHero from '@/components/page/PageHero';
import Section from '@/components/page/Section';
import { CtaBand } from '@/components/page/Blocks';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { POSTS_BY_DATE, postPath } from '@/content/posts';
import {
    breadcrumbNode,
    graph,
    itemListNode,
    organizationNode,
    webPageNode,
    websiteNode,
} from '@/lib/seo';

const TITLE = 'Blog | Web, Software & Cloud Engineering Notes | Korame';
const DESCRIPTION =
    'Practical writing on web and software engineering: choosing between a website and an application, custom software versus off-the-shelf, and Azure Static Web Apps configuration.';

/** Dates are authored as ISO strings so they sort and format predictably. */
export const formatDate = (iso) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    });

export default function BlogIndex() {
    const trail = [{ name: 'Blog', path: '/blog' }];

    const jsonLd = graph(
        organizationNode(),
        websiteNode(),
        webPageNode({
            path: '/blog',
            name: TITLE,
            description: DESCRIPTION,
            breadcrumbPath: '/blog',
        }),
        breadcrumbNode(trail),
        itemListNode({
            path: '/blog',
            name: 'Korame articles',
            items: POSTS_BY_DATE.map((p) => ({ name: p.title, path: postPath(p.slug) })),
        }),
    );

    return (
        <>
            <Seo title={TITLE} description={DESCRIPTION} path="/blog" jsonLd={jsonLd} />

            <PageHero
                kicker="Writing"
                title="Notes from the build"
                lede="A small number of articles we actually wanted to write, on questions we answer often enough to be tired of answering by email. No publishing schedule, and nothing here to hit a word count."
                trail={trail}
            />

            <Section width="max-w-5xl">
                <ul className="space-y-6">
                    {POSTS_BY_DATE.map((post, i) => (
                        <li key={post.slug}>
                            <Reveal delay={Math.min(i, 4) * 0.05} y={24}>
                                <Link to={postPath(post.slug)} className="group block">
                                    <TiltCard intensity={4} lift={7}>
                                        <Card className="p-8 sm:p-10">
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                <Badge variant="outline" size="sm">
                                                    {post.topic}
                                                </Badge>
                                                <time dateTime={post.date}>
                                                    {formatDate(post.date)}
                                                </time>
                                                <span aria-hidden="true">·</span>
                                                <span>{post.readingTime} min read</span>
                                            </div>

                                            <h2 className="mt-4 text-balance font-heading text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand-300 sm:text-3xl">
                                                {post.title}
                                            </h2>

                                            <p className="mt-4 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
                                                {post.excerpt}
                                            </p>

                                            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                                                Read the article
                                                <ArrowUpRight
                                                    aria-hidden="true"
                                                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                />
                                            </span>
                                        </Card>
                                    </TiltCard>
                                </Link>
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </Section>

            <CtaBand
                title="Got a question none of these answer?"
                body="We would rather answer it than write around it. There is no obligation attached to asking."
                secondary={{ href: '/services', label: 'What we do' }}
            />
        </>
    );
}
