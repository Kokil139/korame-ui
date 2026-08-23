import { useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import {
    motion,
    useScroll,
    useTransform,
    useReducedMotion,
} from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Aurora from '@/components/motion/Aurora';
import Magnetic from '@/components/motion/Magnetic';
import CountUp from '@/components/motion/CountUp';
import { springSnap, springSoft } from '@/lib/motion';

const STATS = [
    { value: 99.9, suffix: '%', decimals: 1, label: 'Uptime & speed' },
    { value: 50, suffix: '+', decimals: 0, label: 'Projects delivered' },
    { value: 100, prefix: '<', suffix: 'ms', decimals: 0, label: 'Interaction latency' },
    { value: 100, suffix: '%', decimals: 0, label: 'Client satisfaction' },
];

/* Headline words, revealed as a staggered 3D card flip. */
const LINE_ONE = ['We', 'build', 'web', 'solutions', 'that'];

const wordVariants = {
    hidden: { opacity: 0, y: 34, rotateX: -55 },
    visible: { opacity: 1, y: 0, rotateX: 0, transition: springSnap },
};

export default function Hero() {
    const ref = useRef(null);
    const reduced = useReducedMotion();

    /* Scroll-linked depth: the headline layer drifts up and dims slightly
       faster than the page, which reads as parallax without a scroll handler.
       Both offsets sit inside [0,1], so no clamping is needed here. */
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
    const ringScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

    const depthStyle = reduced ? undefined : { y: contentY, opacity: contentOpacity };

    return (
        <section
            id="home"
            ref={ref}
            className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6 pb-24 pt-32 sm:pt-36"
        >
            <Aurora grid intensity="medium" />

            <motion.div
                style={depthStyle}
                className="relative mx-auto max-w-5xl text-center"
            >
                {/* ---------------------------------------------------------
                    Eyebrow
                   --------------------------------------------------------- */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...springSnap, delay: 0.05 }}
                >
                    <Badge variant="glass" className="mb-14 sm:mb-20">
                        <span className="relative flex size-1.5">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-400 opacity-75" />
                            <span className="relative inline-flex size-1.5 rounded-full bg-brand-400" />
                        </span>
                        Available for new projects
                    </Badge>
                </motion.div>

                {/* ---------------------------------------------------------
                    Headline + the signature glowing lightning ring
                   --------------------------------------------------------- */}
                <div className="relative">
                    {/* Ring layer — kept from the original build, rebuilt to
                        scale with scroll and sit on its own composited layer. */}
                    <motion.div
                        aria-hidden="true"
                        style={reduced ? undefined : { scale: ringScale }}
                        /* -z-10 keeps the travelling arc behind the eyebrow
                           and headline; without it the arc paints over the
                           badge each time it comes round. It stays inside
                           this section's stacking context, which Motion's
                           transform on the parent already establishes. */
                        className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 flex items-center justify-center sm:-inset-x-16 sm:-inset-y-14 lg:-inset-x-28"
                    >
                        <div className="absolute inset-0 rounded-[100%] border border-brand-500/30 shadow-[0_0_60px_-10px_color-mix(in_oklch,var(--brand-500)_55%,transparent),inset_0_0_80px_-30px_color-mix(in_oklch,var(--brand-400)_60%,transparent)]" />

                        <svg
                            className="absolute size-full overflow-visible"
                            viewBox="0 0 1000 400"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <defs>
                                <linearGradient id="korame-arc" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="var(--cyan-glow)" />
                                    <stop offset="50%" stopColor="var(--brand-400)" />
                                    <stop offset="100%" stopColor="var(--violet-glow)" />
                                </linearGradient>
                                <filter id="korame-arc-glow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="6" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Travelling energy arc */}
                            <path
                                className="animate-orbit"
                                d="M 500,10 A 490,190 0 1,1 499.9,10"
                                fill="none"
                                stroke="url(#korame-arc)"
                                strokeWidth="4"
                                strokeLinecap="round"
                                pathLength="1000"
                                strokeDasharray="220 780"
                                filter="url(#korame-arc-glow)"
                            />

                            {/* Bright leading spark */}
                            <path
                                className="animate-orbit"
                                d="M 500,10 A 490,190 0 1,1 499.9,10"
                                fill="none"
                                stroke="oklch(1 0 0)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                pathLength="1000"
                                strokeDasharray="45 955"
                            />
                        </svg>
                    </motion.div>

                    <h1 className="relative z-10 text-balance font-heading text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[4.5rem]">
                        {/* Word-level 3D flip-in. The perspective lives on the
                            container so all words share one camera. */}
                        <motion.span
                            className="block perspective-far"
                            initial={reduced ? undefined : 'hidden'}
                            animate={reduced ? undefined : 'visible'}
                            transition={{ delayChildren: 0.12, staggerChildren: 0.055 }}
                        >
                            {LINE_ONE.map((word, i) => (
                                <motion.span
                                    key={i}
                                    variants={reduced ? undefined : wordVariants}
                                    className="mr-[0.25em] inline-block origin-bottom will-change-transform"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </motion.span>

                        <motion.span
                            initial={reduced ? undefined : { opacity: 0, y: 24, filter: 'blur(12px)' }}
                            animate={reduced ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ ...springSoft, delay: 0.42 }}
                            className="mt-1 block text-gradient-brand"
                        >
                            Captivate &amp; Convert.
                        </motion.span>
                    </h1>
                </div>

                {/* ---------------------------------------------------------
                    Subtitle
                   --------------------------------------------------------- */}
                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...springSnap, delay: 0.55 }}
                    className="mx-auto mt-12 max-w-2xl text-pretty text-lg font-light leading-relaxed text-muted-foreground sm:mt-16 md:text-xl"
                >
                    We build high-performance websites and AI-powered web applications
                    that help businesses grow.
                </motion.p>

                {/* ---------------------------------------------------------
                    Actions
                   --------------------------------------------------------- */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...springSnap, delay: 0.62 }}
                    className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4"
                >
                    <Magnetic className="w-full sm:w-auto">
                        <Button
                            asChild
                            variant="primary"
                            size="lg"
                            className="group w-full sm:w-auto"
                        >
                            <a href="#contact">
                                Start your project
                                <Sparkles className="transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                            </a>
                        </Button>
                    </Magnetic>

                    <Magnetic className="w-full sm:w-auto" strength={0.18}>
                        <Button
                            asChild
                            variant="glass"
                            size="lg"
                            className="group w-full sm:w-auto"
                        >
                            <a href="#services">
                                Explore work
                                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            </a>
                        </Button>
                    </Magnetic>
                </motion.div>

                {/* ---------------------------------------------------------
                    Stats
                   --------------------------------------------------------- */}
                <motion.dl
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.75 }}
                    className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-10 sm:mt-20 md:grid-cols-4"
                >
                    {STATS.map((stat) => (
                        <div key={stat.label} className="group">
                            <dt className="sr-only">{stat.label}</dt>
                            <dd>
                                <CountUp
                                    value={stat.value}
                                    prefix={stat.prefix}
                                    suffix={stat.suffix}
                                    decimals={stat.decimals}
                                    className="block font-heading text-3xl font-bold tabular-nums text-foreground transition-colors duration-300 group-hover:text-brand-300 md:text-4xl"
                                />
                                <span className="mt-1.5 block text-sm text-muted-foreground">
                                    {stat.label}
                                </span>
                            </dd>
                        </div>
                    ))}
                </motion.dl>
            </motion.div>
        </section>
    );
}
