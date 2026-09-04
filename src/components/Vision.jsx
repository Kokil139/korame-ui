import Reveal from '@/components/motion/Reveal';
import WordReveal from '@/components/motion/WordReveal';
import Aurora from '@/components/motion/Aurora';
import { Badge } from '@/components/ui/badge';

const STATEMENT =
    'We envision a web free of slow templates, clunky animations and uninspired interfaces. Korame exists to craft distinctive digital identities that leave a lasting impression and drive real economic outcomes.';

export default function Vision() {
    return (
        <section
            id="vision"
            className="relative overflow-hidden border-y border-border bg-surface-0 px-6 py-32 sm:py-40"
        >
            <Aurora intensity="soft" />

            <div className="relative mx-auto max-w-5xl text-center">
                <Reveal>
                    <Badge variant="cyan">Our core vision</Badge>
                </Reveal>

                <Reveal delay={0.08}>
                    <blockquote className="mt-8">
                        <p className="text-balance font-heading text-3xl font-extrabold leading-[1.12] tracking-[-0.03em] text-foreground sm:text-4xl md:text-6xl">
                            &ldquo;Websites should not just be visited.
                            <br className="hidden sm:block" /> They should be{' '}
                            <span className="text-gradient-brand">experienced</span>.&rdquo;
                        </p>
                    </blockquote>
                </Reveal>

                {/* Scroll-linked word-by-word reveal  the reader's scroll
                    position controls the pace of the sentence. */}
                <WordReveal
                    text={STATEMENT}
                    className="mx-auto mt-12 max-w-3xl text-pretty text-xl font-light leading-relaxed text-foreground md:text-2xl"
                />
            </div>
        </section>
    );
}
