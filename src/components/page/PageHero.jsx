import Reveal from '@/components/motion/Reveal';
import Aurora from '@/components/motion/Aurora';
import Breadcrumbs from '@/components/page/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * The opening block of every inner page.
 *
 * One H1 per document, always here, so heading order can never be argued
 * about further down the page. The ambient Aurora is the same component the
 * homepage uses, at `soft`, which keeps inner pages recognisably part of the
 * same site without competing with the content.
 */
export default function PageHero({ kicker, title, lede, trail, children, className }) {
    return (
        <section className={cn('relative overflow-hidden px-6 pb-16 pt-32 sm:pt-40', className)}>
            <Aurora grid />

            <div className="relative mx-auto max-w-4xl">
                {trail && <Breadcrumbs trail={trail} />}

                {kicker && (
                    <Reveal>
                        <Badge>{kicker}</Badge>
                    </Reveal>
                )}

                <Reveal delay={0.06}>
                    <h1 className="mt-6 text-balance font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl">
                        {title}
                    </h1>
                </Reveal>

                {lede && (
                    <Reveal delay={0.12}>
                        <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
                            {lede}
                        </p>
                    </Reveal>
                )}

                {children && (
                    <Reveal delay={0.18}>
                        <div className="mt-10">{children}</div>
                    </Reveal>
                )}
            </div>
        </section>
    );
}
