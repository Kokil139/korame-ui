import { Link, useParams } from 'react-router-dom';
import Seo from '@/components/Seo';
import PageHero from '@/components/page/PageHero';
import Section from '@/components/page/Section';
import { CtaBand, LinkCards } from '@/components/page/Blocks';
import Reveal from '@/components/motion/Reveal';
import { Badge } from '@/components/ui/badge';
import NotFound from '@/pages/NotFound';
import { formatDate } from '@/pages/BlogIndex';
import { getPost, postPath, POSTS } from '@/content/posts';
import { serviceBySlug, servicePath } from '@/content/service-list';
import {
    articleNode,
    breadcrumbNode,
    graph,
    organizationNode,
    webPageNode,
    websiteNode,
} from '@/lib/seo';

/**
 * Renders a post body from its block list.
 *
 * A block model rather than raw HTML strings, so headings stay in a
 * predictable order (every h2 here is a real h2 under the page's single h1),
 * lists stay semantic, and code samples are never accidentally interpreted as
 * markup. `text` allows a little inline HTML  <code>, <strong>  which is
 * the only place authored markup is trusted.
 */
function Block({ block }) {
    switch (block.type) {
        case 'h2':
            return (
                <Reveal y={18}>
                    <h2 className="mt-14 text-balance font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        {block.text}
                    </h2>
                </Reveal>
            );
        case 'h3':
            return (
                <Reveal y={16}>
                    <h3 className="mt-10 font-heading text-xl font-bold tracking-tight text-foreground">
                        {block.text}
                    </h3>
                </Reveal>
            );
        case 'ul':
            return (
                <Reveal y={16}>
                    <ul className="mt-5 space-y-2.5 pl-5">
                        {block.items.map((item, i) => (
                            <li
                                key={i}
                                className="list-disc text-pretty leading-relaxed text-muted-foreground marker:text-brand-400"
                                dangerouslySetInnerHTML={{ __html: item }}
                            />
                        ))}
                    </ul>
                </Reveal>
            );
        case 'ol':
            return (
                <Reveal y={16}>
                    <ol className="mt-5 space-y-2.5 pl-5">
                        {block.items.map((item, i) => (
                            <li
                                key={i}
                                className="list-decimal text-pretty leading-relaxed text-muted-foreground marker:font-semibold marker:text-brand-400"
                                dangerouslySetInnerHTML={{ __html: item }}
                            />
                        ))}
                    </ol>
                </Reveal>
            );
        case 'code':
            return (
                <Reveal y={16}>
                    {/* tabIndex makes the scroll container keyboard-reachable,
                        which it must be if it can scroll. */}
                    <pre
                        tabIndex={0}
                        className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface-2 p-5 text-sm leading-relaxed"
                    >
                        <code className="font-mono text-foreground/90">{block.code}</code>
                    </pre>
                </Reveal>
            );
        case 'note':
            return (
                <Reveal y={16}>
                    <p className="mt-6 rounded-2xl border-l-2 border-brand-500 bg-elevate px-6 py-5 text-pretty leading-relaxed text-foreground/90">
                        {block.text}
                    </p>
                </Reveal>
            );
        case 'p':
        default:
            return (
                <Reveal y={16}>
                    <p
                        className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: block.text }}
                    />
                </Reveal>
            );
    }
}

export default function BlogPost() {
    const { slug } = useParams();
    const post = getPost(slug);

    if (!post) return <NotFound />;

    const path = postPath(post.slug);
    const trail = [
        { name: 'Blog', path: '/blog' },
        { name: post.title, path },
    ];

    const jsonLd = graph(
        organizationNode(),
        websiteNode(),
        webPageNode({
            path,
            name: post.metaTitle || post.title,
            description: post.description,
            breadcrumbPath: path,
        }),
        breadcrumbNode(trail),
        articleNode(post),
    );

    const relatedServices = (post.services || [])
        .map(serviceBySlug)
        .filter(Boolean)
        .map((s) => ({ href: servicePath(s.slug), title: s.nav, body: s.short }));

    const relatedPosts = (post.related || [])
        .map((s) => POSTS.find((p) => p.slug === s))
        .filter(Boolean)
        .map((p) => ({ href: postPath(p.slug), title: p.title, body: p.excerpt }));

    return (
        <>
            <Seo
                title={post.metaTitle || post.title}
                description={post.description}
                path={path}
                type="article"
                publishedTime={post.date}
                modifiedTime={post.updated || post.date}
                jsonLd={jsonLd}
            />

            <PageHero kicker={post.topic} title={post.title} trail={trail}>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingTime} min read</span>
                    {post.updated && post.updated !== post.date && (
                        <>
                            <span aria-hidden="true">·</span>
                            <span>Updated {formatDate(post.updated)}</span>
                        </>
                    )}
                </div>
            </PageHero>

            <article className="px-6 pb-8">
                <div className="mx-auto max-w-3xl">
                    {post.body.map((block, i) => (
                        <Block key={i} block={block} />
                    ))}
                </div>
            </article>

            {relatedServices.length > 0 && (
                <Section
                    kicker="Related services"
                    title="If this is the problem you have"
                    width="max-w-5xl"
                >
                    <LinkCards items={relatedServices} columns={2} />
                </Section>
            )}

            {relatedPosts.length > 0 && (
                <Section kicker="Keep reading" title="Related articles" width="max-w-5xl">
                    <LinkCards items={relatedPosts} columns={2} />
                </Section>
            )}

            <Section width="max-w-3xl" className="pb-4">
                <Reveal y={16}>
                    <p className="text-sm text-muted-foreground">
                        Written by the Korame team.{' '}
                        <Link
                            to="/about"
                            className="font-semibold text-brand-400 underline-offset-4 hover:underline"
                        >
                            More about how we work
                        </Link>
                        .
                    </p>
                </Reveal>
            </Section>

            <CtaBand secondary={{ href: '/blog', label: 'All articles' }} />
        </>
    );
}
