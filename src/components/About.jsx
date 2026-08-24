import { Zap, Smartphone, Search, Accessibility } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import CodeTypewriter from '@/components/motion/CodeTypewriter';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { springSnap, viewportOnce } from '@/lib/motion';

const PILLARS = [
    {
        icon: Zap,
        tone: 'text-brand-300 bg-brand-500/12',
        accent: 'var(--brand-500)',
        stat: '0.8s',
        title: 'Ultra performance',
        copy: 'Sub-second loads, budgeted from the first commit.',
    },
    {
        icon: Smartphone,
        tone: 'text-cyan-glow bg-cyan-glow/12',
        accent: 'var(--cyan-glow)',
        stat: '320px',
        title: 'Fluid responsiveness',
        copy: 'One layout system from 4K down to a 320px phone.',
    },
    {
        icon: Search,
        tone: 'text-violet-glow bg-violet-glow/12',
        accent: 'var(--violet-glow)',
        stat: 'JSON-LD',
        title: 'SEO by default',
        copy: 'Semantic markup, structured data, crawlable routes.',
    },
    {
        icon: Accessibility,
        tone: 'text-emerald-400 bg-emerald-500/12',
        accent: 'var(--success)',
        stat: 'WCAG AA',
        title: 'Accessible motion',
        copy: 'Every animation honours prefers-reduced-motion.',
    },
];

/* Rendered as real text, not an image, so it stays crawlable and selectable. */
const SPEC_LINES = [
    { indent: 0, tokens: [['const korameEngine = {', 'text-violet-glow']] },
    { indent: 1, tokens: [['framework: ', 'text-muted-foreground'], ["'React + Vite'", 'text-amber-300'], [',', 'text-muted-foreground']] },
    { indent: 1, tokens: [['styling: ', 'text-muted-foreground'], ["'Tailwind CSS v4'", 'text-amber-300'], [',', 'text-muted-foreground']] },
    { indent: 1, tokens: [['motion: ', 'text-muted-foreground'], ["'Motion + scroll-linked'", 'text-amber-300'], [',', 'text-muted-foreground']] },
    { indent: 1, tokens: [['components: ', 'text-muted-foreground'], ["'shadcn/ui'", 'text-amber-300'], [',', 'text-muted-foreground']] },
    { indent: 1, tokens: [['a11y: ', 'text-muted-foreground'], ["'WCAG 2.1 AA'", 'text-amber-300']] },
    { indent: 0, tokens: [['};', 'text-violet-glow']] },
];

export default function About() {
    return (
        <section id="about" className="relative overflow-hidden px-6 py-28 sm:py-36">
            <div className="mx-auto max-w-7xl">
                <div className="grid min-w-0 grid-cols-1 items-center gap-16 lg:grid-cols-2">
                    {/* ---------------------------------------------------------
                        Left: narrative
                       --------------------------------------------------------- */}
                    <div className="min-w-0">
                        <Reveal>
                            <Badge>About Korame</Badge>
                        </Reveal>

                        <Reveal delay={0.06}>
                            <h2 className="mt-6 text-balance font-heading text-3xl font-bold leading-[1.1] tracking-[-0.025em] text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                                Where aesthetics meet{' '}
                                <span className="text-gradient-brand">engineering precision</span>.
                            </h2>
                        </Reveal>

                        <Reveal delay={0.12}>
                            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                                Korame was founded on a simple principle: the web should be
                                both lightning-fast and visually mesmerising. We sit between
                                a creative design studio and a technical engineering shop,
                                and refuse to trade one for the other.
                            </p>
                        </Reveal>

                        <Reveal delay={0.18}>
                            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                                We eliminate bloat, budget every frame of animation, and
                                handcraft frontend architectures built for speed, search
                                visibility, and effortless cross-device behaviour.
                            </p>
                        </Reveal>

                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                            {PILLARS.map((pillar, i) => (
                                <PillarCard key={pillar.title} pillar={pillar} index={i} />
                            ))}
                        </div>
                    </div>

                    {/* ---------------------------------------------------------
                        Right: the stack spec, typing itself out on scroll
                       --------------------------------------------------------- */}
                    <Reveal delay={0.1} y={40}>
                        <TiltCard intensity={7} lift={14}>
                            <Card className="relative overflow-hidden p-8">
                                {/* Corner bloom */}
                                <div
                                    aria-hidden="true"
                                    className="absolute -right-16 -top-16 size-52 rounded-full opacity-60 blur-3xl"
                                    style={{
                                        background:
                                            'radial-gradient(circle, var(--brand-500), transparent 70%)',
                                    }}
                                />

                                <div className="relative flex items-center justify-between border-b border-border pb-4">
                                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                        stack_spec.json
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                                        <span className="relative flex size-1.5">
                                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                                        </span>
                                        Production ready
                                    </span>
                                </div>

                                <CodeTypewriter
                                    lines={SPEC_LINES}
                                    label="Korame engine specification"
                                    className="relative mt-6 overflow-x-auto font-mono text-[13px] leading-7"
                                />

                                <p className="relative mt-6 rounded-xl border border-border bg-field p-4 font-mono text-xs text-muted-foreground">
                                    <span className="text-emerald-400">&gt;</span> Scales without
                                    dynamic server overhead.
                                </p>
                            </Card>
                        </TiltCard>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */

/**
 * A capability card that actually does something.
 *
 * These previously carried their only interest on hover — so on a phone the
 * grid was four static text boxes. The entrance now does the work: the card
 * lifts in, an accent hairline sweeps across its top edge, and the icon pops
 * a beat later. All of it is `whileInView`, which fires identically on touch.
 */
function PillarCard({ pillar, index }) {
    const reduced = useReducedMotion();

    if (reduced) {
        return (
            <Card className="flex h-full items-start gap-4 p-5">
                <span
                    className={`grid size-11 shrink-0 place-items-center rounded-xl ${pillar.tone}`}
                >
                    <pillar.icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                    <span className="block font-semibold text-foreground">
                        {pillar.title}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                        {pillar.copy}
                    </span>
                </span>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ ...springSnap, delay: index * 0.09 }}
            className="h-full"
        >
            <Card className="group relative flex h-full items-start gap-4 overflow-hidden p-5">
                {/* Accent hairline sweeping across the top edge as it lands. */}
                <motion.span
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={viewportOnce}
                    transition={{
                        duration: 0.7,
                        delay: index * 0.09 + 0.15,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ background: pillar.accent }}
                    className="absolute inset-x-0 top-0 h-px origin-left"
                />

                {/* Corner bloom, for pointers that can hover. */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
                    style={{ background: pillar.accent }}
                />

                <motion.span
                    initial={{ scale: 0.5, rotate: -25, opacity: 0 }}
                    whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                    viewport={viewportOnce}
                    transition={{ ...springSnap, delay: index * 0.09 + 0.12 }}
                    className={`relative grid size-11 shrink-0 place-items-center rounded-xl ${pillar.tone}`}
                >
                    <pillar.icon className="size-5" aria-hidden="true" />
                </motion.span>

                <span className="relative">
                    <span className="flex flex-wrap items-center gap-x-2">
                        <span className="font-semibold text-foreground">{pillar.title}</span>
                        <span
                            className="font-mono text-[10px] uppercase tracking-wider"
                            style={{ color: pillar.accent }}
                        >
                            {pillar.stat}
                        </span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                        {pillar.copy}
                    </span>
                </span>
            </Card>
        </motion.div>
    );
}
