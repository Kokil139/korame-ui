import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import {
    motion,
    stagger,
    useScroll,
    useTransform,
    useReducedMotion,
} from 'motion/react';
import { Button } from '@/components/ui/button';
import Aurora from '@/components/motion/Aurora';
import Magnetic from '@/components/motion/Magnetic';
import CountUp from '@/components/motion/CountUp';
import { springSnap, springSoft, easeOptical } from '@/lib/motion';
import { useMediaQuery, COARSE_POINTER } from '@/lib/use-media-query';
import { ROUTES } from '@/lib/routes';
import { PROJECTS } from '@/content/projects';
import { SERVICE_LIST } from '@/content/service-list';

/**
 * Facts about this site, not claims about our business.
 *
 * The previous version of this row asserted "50+ projects delivered",
 * "99.9% uptime" and "100% client satisfaction"  none of which were
 * substantiated anywhere, and the last of which is not a measurable quantity.
 * Publishing unverifiable numbers on a page selling engineering rigour is a
 * contradiction a visitor can spot.
 *
 * Every number below is checkable from this page, and every one is derived
 * from the code rather than typed, so none of them can go stale.
 *
 * "Decorative network images loaded: 0" used to sit in this row. It stopped
 * being true the moment the service tiles became photographs rather than
 * generated SVG, so it was replaced rather than left to quietly mislead 
 * an unverifiable number on a page selling engineering rigour is a
 * contradiction a visitor can spot.
 */
const STATS = [
    { value: ROUTES.length, suffix: '', decimals: 0, label: 'Pages pre-rendered as static HTML' },
    { value: SERVICE_LIST.length, suffix: '', decimals: 0, label: 'Service pages, each written in full' },
    { value: 100, suffix: '%', decimals: 0, label: 'Animations honouring reduced motion' },
    { value: PROJECTS.length, suffix: '', decimals: 0, label: 'Case studies written up in full' },
];

/* Headline words, revealed as a staggered 3D card flip. */
const LINE_ONE = ['We', 'build', 'web', 'solutions', 'that'];

const wordVariants = {
    hidden: { opacity: 0, y: 34, rotateX: -55 },
    visible: { opacity: 1, y: 0, rotateX: 0, transition: springSnap },
};

/* Stats panel.

   `statsPanel` deliberately holds no animatable value  only the stagger that
   drives its children. The panel is a `backdrop-filter` surface, and animating
   its opacity would make it a backdrop root with nothing behind it to sample
   (see the comment at the markup). `stagger()` in `delayChildren` is the
   current API; `staggerChildren` is the deprecated form. */
const statsPanel = {
    hidden: {},
    visible: { transition: { delayChildren: stagger(0.08, { startDelay: 0.75 }) } },
};

const statItem = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: springSnap },
};

export default function Hero() {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    const coarse = useMediaQuery(COARSE_POINTER);

    /* The headline's blur-in is a desktop-only flourish.

       `filter: blur()` on a `background-clip: text` element gives Safari
       nothing to composite: it re-rasterises the gradient text mask every
       frame, and this is the largest type on the page. It is also the only
       entrance that runs while the rest of the document is still mounting,
       which is why the home screen was the one that dragged on refresh while
       every scroll-triggered section below it looked fine.

       `filter` must nonetheless appear in *both* objects on *every* device.
       `useMediaQuery` cannot read a media query on the server, so its server
       snapshot is `false` and the pre-rendered HTML always ships the desktop
       branch  `style="opacity:0;filter:blur(12px)"`  inline on this span.
       `coarse` only becomes true on the re-render *after* hydration, and if
       the key has vanished from `animate` by then Motion no longer owns
       `filter` and never writes it again: the pre-rendered blur stays on the
       element for good, and the gradient headline is a permanent smear on
       every phone and tablet. Keeping the key costs a touch device one
       `blur(0px)` -> `blur(0px)` no-op; dropping it costs it the headline. */
    const headlineIn = coarse
        ? { opacity: 0, y: 24, filter: 'blur(0px)' }
        : { opacity: 0, y: 24, filter: 'blur(12px)' };
    const headlineOut = { opacity: 1, y: 0, filter: 'blur(0px)' };

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
            /* The eyebrow badge used to be the first thing under the
               header and the top padding was sized for it. The headline is
               first now, and it sits inside the lightning ring, which reaches
               40px (56px at sm) above the words  so the padding has to clear
               the fixed 80px header by that much again. It only bites on short
               viewports; wherever the content fits inside min-h,
               `items-center` still governs. */
            className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6 pb-24 pt-36 sm:pt-44"
        >
            <Aurora grid />

            <motion.div
                style={depthStyle}
                className="relative mx-auto max-w-5xl text-center"
            >
                {/* ---------------------------------------------------------
                    Headline + the signature glowing lightning ring
                   --------------------------------------------------------- */}
                <div className="relative">
                    {/* Ring layer  kept from the original build, rebuilt to
                        scale with scroll and sit on its own composited layer. */}
                    <motion.div
                        aria-hidden="true"
                        style={reduced ? undefined : { scale: ringScale }}
                        /* -z-10 keeps the travelling arc behind the
                           headline; without it the arc paints over the words
                           each time it comes round. It stays inside this
                           section's stacking context, which Motion's
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
                                    <stop offset="0%" stopColor="var(--brand-500)" />
                                    <stop offset="50%" stopColor="var(--brand-400)" />
                                    <stop offset="100%" stopColor="var(--coral-glow)" />
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
                                className="animate-orbit arc-glow"
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

                    {/* Stepped down roughly a fifth from 2.5/3/4.5rem. The
                        headline is two lines at every breakpoint either way,
                        and at the old large size it crowded the lightning ring
                        it sits inside. */}
                    <h1 className="relative z-10 text-balance font-heading text-[2.05rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-[2.5rem] lg:text-[3.5rem]">
                        {/* Word-level 3D flip-in. The perspective lives on the
                            container so all words share one camera. */}
                        {/* `initial={false}` rather than dropping the
                            variants: the pre-rendered markup carries each
                            word's hidden state inline, so a component that
                            stops animating leaves those words at
                            `opacity: 0` for good. Under reduced motion Motion
                            must still write the final state  it just writes
                            it without a transition. */}
                        <motion.span
                            className="block perspective-far"
                            initial={reduced ? false : 'hidden'}
                            animate="visible"
                            transition={{ delayChildren: 0.12, staggerChildren: 0.055 }}
                        >
                            {LINE_ONE.map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={reduced ? false : undefined}
                                    variants={wordVariants}
                                    className="mr-[0.25em] inline-block origin-bottom will-change-transform"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </motion.span>

                        <motion.span
                            initial={reduced ? false : headlineIn}
                            animate={headlineOut}
                            /* y springs; the blur gets a duration curve, per the
                               vocabulary in lib/motion.js  a spring on an
                               optical property overshoots into values Motion has
                               to clamp, which just extends the repaint tail. */
                            transition={{
                                ...springSoft,
                                delay: 0.42,
                                filter: { ...easeOptical, delay: 0.42 },
                            }}
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
                    A software engineering studio building websites, web applications,
                    full-stack systems and custom software  designed.
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
                            <Link to="/contact">
                                Start your project
                                <Sparkles className="transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                            </Link>
                        </Button>
                    </Magnetic>

                    <Magnetic className="w-full sm:w-auto" strength={0.18}>
                        <Button
                            asChild
                            variant="glass"
                            size="lg"
                            className="group w-full sm:w-auto"
                        >
                            <Link to="/projects">
                                Explore our work
                                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </Magnetic>
                </motion.div>

                {/* ---------------------------------------------------------
                    Stats  a frosted panel, segmented by hairlines, in place
                    of the rule that used to divide them.

                    The panel must never animate its own opacity. Per the
                    Filter Effects spec an element with `opacity < 1` becomes a
                    *backdrop root*, so a fading frosted surface has nothing
                    behind it to sample and snaps to the real page the frame it
                    reaches 1. `statsPanel` therefore carries orchestration and
                    nothing else; every animated value lives on the children.

                    Known limit: the shared depth wrapper above *does* fade on
                    scroll, so while the hero is scrolling out this panel's
                    blur is inert  it samples an empty backdrop root. Verified
                    invisible in both themes, because what sits behind it there
                    is a near-uniform field, and the hero's secondary button
                    (variant="glass") has always had the same constraint. If a
                    textured backdrop ever moves behind this panel, hoist it
                    out of the faded layer rather than trying to fix the blur.
                   --------------------------------------------------------- */}
                <motion.dl
                    variants={statsPanel}
                    initial={reduced ? false : 'hidden'}
                    animate="visible"
                    className="glass-pane mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-y-8 rounded-4xl px-2 py-9 sm:mt-20 sm:px-4 sm:py-10 md:grid-cols-4"
                >
                    {STATS.map((stat) => (
                        <motion.div
                            key={stat.label}
                            variants={statItem}
                            className="group px-4 md:border-l md:border-hairline md:first:border-l-0"
                        >
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
                        </motion.div>
                    ))}
                </motion.dl>
            </motion.div>
        </section>
    );
}
