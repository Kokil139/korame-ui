import Reveal from '@/components/motion/Reveal';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * A titled content band.
 *
 * `id` is applied to the <section> so in-page anchors work and so the heading
 * is addressable. The heading level is a prop rather than fixed: inner pages
 * have exactly one H1 (in PageHero), and everything here is H2 unless it is
 * nested inside another section.
 */
export default function Section({
    id,
    kicker,
    title,
    lede,
    as: Heading = 'h2',
    width = 'max-w-4xl',
    className,
    headingClassName,
    children,
}) {
    return (
        <section id={id} className={cn('relative px-6 py-16 sm:py-20', className)}>
            <div className={cn('mx-auto', width)}>
                {(kicker || title) && (
                    <div className="mb-10">
                        {kicker && (
                            <Reveal>
                                <Badge variant="outline" size="sm">
                                    {kicker}
                                </Badge>
                            </Reveal>
                        )}

                        {title && (
                            <Reveal delay={0.05}>
                                <Heading
                                    className={cn(
                                        'text-balance font-heading text-3xl font-bold tracking-[-0.025em] text-foreground sm:text-4xl',
                                        kicker && 'mt-5',
                                        headingClassName,
                                    )}
                                >
                                    {title}
                                </Heading>
                            </Reveal>
                        )}

                        {lede && (
                            <Reveal delay={0.1}>
                                <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                                    {lede}
                                </p>
                            </Reveal>
                        )}
                    </div>
                )}

                {children}
            </div>
        </section>
    );
}
