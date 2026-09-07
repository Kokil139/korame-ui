import { useRef, useState } from 'react';
import {
    motion,
    useScroll,
    useTransform,
    useMotionValueEvent,
    useReducedMotion,
} from 'motion/react';
import { Compass, PenTool, Code2, Rocket, Check } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';
import { Badge } from '@/components/ui/badge';
import { clamp01, cn } from '@/lib/utils';
import { springSnap } from '@/lib/motion';

const STEPS = [
    {
        icon: Compass,
        title: 'Discover',
        copy: 'We audit your current site, map competitors, and agree the commercial outcome the project has to move  before a pixel is drawn.',
        deliverable: 'Audit + scope',
        checks: ['Technical audit', 'Competitor teardown', 'Success metrics agreed'],
    },
    {
        icon: PenTool,
        title: 'Design',
        copy: 'A bespoke design system in Figma: type scale, colour, motion language and component states, prototyped so you can feel it before we build it.',
        deliverable: 'Design system',
        checks: ['Design system', 'Interactive prototype', 'Motion language'],
    },
    {
        icon: Code2,
        title: 'Build',
        copy: 'Component-driven frontend with performance budgets enforced in CI. Accessibility and structured data go in as we build, never bolted on.',
        deliverable: 'Production build',
        checks: ['Component library', 'Perf budgets in CI', 'WCAG 2.1 AA'],
    },
    {
        icon: Rocket,
        title: 'Launch & grow',
        copy: 'Domain, SSL and cloud hosting configured, Core Web Vitals verified in the field, then iterative improvements against real analytics.',
        deliverable: 'Live + monitored',
        checks: ['Domain + SSL', 'Field CWV verified', 'Analytics loop'],
    },
];

/**
 * Delivery process as a pinned scrollytelling section.
 *
 * The section is N screens tall; the visual column is `sticky` so it holds
 * still while the copy column scrolls past it. Scroll progress across the
 * whole section is divided into N bands, and the active band drives the
 * pinned visual.
 *
 * `useMotionValueEvent` is what keeps this cheap: the index is the *only*
 * thing that becomes React state, and it changes four times across the entire
 * section rather than every frame.
 *
 * Reduced motion collapses the whole mechanism to a plain stacked list  a
 * pinned section that cannot animate is just a very tall page.
 */
export default function Process() {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    const [active, setActive] = useState(0);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end end'],
    });

    useMotionValueEvent(scrollYProgress, 'change', (p) => {
        const i = Math.min(STEPS.length - 1, Math.floor(clamp01(p) * STEPS.length));
        setActive((prev) => (prev === i ? prev : i));
    });

    const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

    /* ---------------------------------------------------------------- */
    if (reduced) {
        return (
            <section id="process" className="px-6 py-28 sm:py-36">
                <div className="mx-auto max-w-5xl">
                    <Header />
                    <ol className="mt-16 space-y-8">
                        {STEPS.map((step, i) => (
                            <li
                                key={step.title}
                                className="glass rounded-3xl p-7"
                            >
                                <StepHeading step={step} index={i} />
                                <p className="mt-3 leading-relaxed text-muted-foreground">
                                    {step.copy}
                                </p>
                                <ChecksList checks={step.checks} />
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
        );
    }

    return (
        <section id="process" className="relative px-6 pt-28 sm:pt-36">
            <div className="mx-auto max-w-6xl">
                <Header />
            </div>

            {/* Each step gets a viewport of scroll to itself. */}
            <div
                ref={ref}
                className="relative mx-auto mt-16 max-w-6xl"
                style={{ height: `${STEPS.length * 100}vh` }}
            >
                <div className="sticky top-24 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                    {/* ---------------------------------------------------
                        Pinned visual  the stage indicator
                       --------------------------------------------------- */}
                    <div className="relative hidden lg:block">
                        <div className="glass relative aspect-square overflow-hidden rounded-[2rem] p-10">
                            <div aria-hidden="true" className="absolute inset-0 dot-field" />

                            {/* Stage number, morphing between steps */}
                            <div className="relative flex h-full flex-col justify-between">
                                <div className="flex items-start justify-between">
                                    <motion.span
                                        key={`num-${active}`}
                                        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                        transition={springSnap}
                                        className="font-heading text-[7.5rem] font-extrabold leading-[1.18] tracking-tighter text-gradient-brand"
                                    >
                                        {String(active + 1).padStart(2, '0')}
                                    </motion.span>

                                    <motion.span
                                        key={`icon-${active}`}
                                        initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        transition={springSnap}
                                        className="grid size-16 place-items-center rounded-2xl border border-border bg-elevate text-brand-400"
                                    >
                                        {(() => {
                                            const Icon = STEPS[active].icon;
                                            return <Icon className="size-7" aria-hidden="true" />;
                                        })()}
                                    </motion.span>
                                </div>

                                {/* Deliverable checklist for the active stage */}
                                <div>
                                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                                        Deliverable
                                    </p>
                                    <motion.p
                                        key={`del-${active}`}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={springSnap}
                                        className="mt-2 font-heading text-2xl font-bold text-foreground"
                                    >
                                        {STEPS[active].deliverable}
                                    </motion.p>

                                    <ul className="mt-5 space-y-2">
                                        {STEPS[active].checks.map((check, i) => (
                                            <motion.li
                                                key={`${active}-${check}`}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ ...springSnap, delay: 0.06 * i }}
                                                className="flex items-center gap-2.5 text-sm text-muted-foreground"
                                            >
                                                <Check className="size-4 shrink-0 text-brand-400" />
                                                {check}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ---------------------------------------------------
                        Copy column  all steps present, inactive ones dim
                       --------------------------------------------------- */}
                    <div className="flex items-center">
                        <div className="relative w-full">
                            {/* Progress rail */}
                            <div
                                aria-hidden="true"
                                className="absolute bottom-0 left-0 top-0 w-px bg-border"
                            >
                                <motion.div
                                    style={{ scaleY: railScale }}
                                    className="h-full w-full origin-top bg-[linear-gradient(180deg,var(--brand-500),var(--brand-400),var(--coral-glow))] will-change-transform"
                                />
                            </div>

                            <ol className="space-y-5 pl-8">
                                {STEPS.map((step, i) => {
                                    const isActive = i === active;
                                    return (
                                        <motion.li
                                            key={step.title}
                                            animate={{
                                                opacity: isActive ? 1 : 0.32,
                                                scale: isActive ? 1 : 0.97,
                                            }}
                                            transition={springSnap}
                                            className={cn(
                                                'origin-left rounded-2xl p-5 transition-colors duration-500',
                                                isActive && 'bg-elevate',
                                            )}
                                        >
                                            <StepHeading step={step} index={i} />
                                            <p className="mt-2.5 text-pretty leading-relaxed text-muted-foreground">
                                                {step.copy}
                                            </p>
                                        </motion.li>
                                    );
                                })}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */

function Header() {
    return (
        <div className="text-center">
            <Reveal>
                <Badge>How we work</Badge>
            </Reveal>

            <Reveal delay={0.06}>
                <h2 className="mt-6 text-balance font-heading text-4xl font-bold tracking-[-0.025em] text-foreground md:text-5xl lg:text-6xl">
                    Four steps from brief to{' '}
                    <span className="text-gradient-brand">measurable growth</span>.
                </h2>
            </Reveal>

            <Reveal delay={0.12}>
                <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
                    No black boxes and no surprise invoices. You see working software at
                    the end of every stage.
                </p>
            </Reveal>
        </div>
    );
}

function StepHeading({ step, index }) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-400">
                {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                {step.title}
            </h3>
            <Badge variant="outline" size="sm" className="ml-auto">
                {step.deliverable}
            </Badge>
        </div>
    );
}

function ChecksList({ checks }) {
    return (
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {checks.map((c) => (
                <li
                    key={c}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                    <Check className="size-4 shrink-0 text-brand-400" />
                    {c}
                </li>
            ))}
        </ul>
    );
}
