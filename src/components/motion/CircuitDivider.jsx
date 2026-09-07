import { useRef, useId } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Circuit-board divider: traces that draw themselves as the divider scrolls
 * into view, with pulses travelling along them afterwards.
 *
 * Two mechanisms, deliberately split:
 * - The *draw* is scroll-linked (`pathLength` from `scrollYProgress`), so the
 *   reader's scroll physically lays the copper down.
 * - The *pulses* are a CSS animation on `stroke-dashoffset`, because they
 *   should keep running on their own once drawn, and a continuous rAF loop
 *   for purely ambient motion is waste. That animation's keyframes must use
 *   literal lengths, not a custom property  see index.css.
 *
 * `pathLength` is normalised 0-1 by SVG regardless of the real path length,
 * which is why the same transform works for every trace.
 *
 * Ids are generated with `useId`  hardcoded gradient/filter ids collide the
 * moment the component is used twice on one page, and the second instance
 * silently steals the first's paint server.
 */

/* Hand-authored traces on a 1200x160 board. Right angles and 45s only 
   that constraint is what makes it read as a PCB rather than a squiggle. */
const TRACES = [
    { d: 'M0 80 H240 L280 40 H520 L560 80 H1200', delay: 0 },
    { d: 'M0 120 H180 L220 80 H430', delay: 0.6 },
    { d: 'M1200 40 H980 L940 80 H700', delay: 1.2 },
    { d: 'M0 40 H120 L150 70 H330', delay: 1.8 },
    { d: 'M1200 120 H860 L820 80 H620', delay: 0.9 },
];

/* Solder pads at trace junctions. */
const NODES = [
    [280, 40],
    [560, 80],
    [220, 80],
    [940, 80],
    [820, 80],
];

export default function CircuitDivider({ className, height = 'h-28 sm:h-36' }) {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    const uid = useId().replace(/:/g, '');

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 0.95', 'end 0.55'],
    });

    // pathLength is 0-1; both offsets are literals inside [0,1].
    const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const nodeOpacity = useTransform(scrollYProgress, [0.55, 1], [0, 1]);

    const gradId = `circuit-grad-${uid}`;
    const glowId = `circuit-glow-${uid}`;

    return (
        <div
            ref={ref}
            aria-hidden="true"
            className={cn('pointer-events-none relative w-full', height, className)}
        >
            <svg
                viewBox="0 0 1200 160"
                preserveAspectRatio="none"
                className="size-full"
                style={{
                    maskImage:
                        'linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)',
                    WebkitMaskImage:
                        'linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)',
                }}
            >
                <defs>
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--brand-500)" />
                        <stop offset="50%" stopColor="var(--brand-400)" />
                        <stop offset="100%" stopColor="var(--coral-glow)" />
                    </linearGradient>

                    <filter id={glowId} x="-20%" y="-200%" width="140%" height="500%">
                        <feGaussianBlur stdDeviation="3" result="b" />
                        <feMerge>
                            <feMergeNode in="b" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Base copper  faint, always present once drawn. */}
                {TRACES.map((trace, i) => (
                    <motion.path
                        key={`base-${i}`}
                        d={trace.d}
                        fill="none"
                        stroke="var(--grid-line)"
                        strokeWidth="1.5"
                        strokeLinecap="square"
                        style={reduced ? undefined : { pathLength }}
                    />
                ))}

                {/* Travelling pulses. dasharray is a short lit segment against a
                    long gap; the CSS animation slides it along the trace. */}
                {!reduced &&
                    TRACES.map((trace, i) => (
                        <path
                            key={`pulse-${i}`}
                            className="animate-trace"
                            d={trace.d}
                            fill="none"
                            stroke={`url(#${gradId})`}
                            strokeWidth="2"
                            strokeLinecap="round"
                            filter={`url(#${glowId})`}
                            pathLength="100"
                            strokeDasharray="14 86"
                            /* pathLength normalises this trace to 100 user
                               units, which is what makes one dasharray and
                               one keyframe pair fit every trace. The 100 is
                               written literally in the @keyframes rather than
                               passed down as a custom property  see the note
                               on korame-trace in index.css for why that
                               froze the whole animation in Blink. */
                            style={{
                                '--trace-duration': `${4.5 + i * 0.7}s`,
                                animationDelay: `${trace.delay}s`,
                            }}
                        />
                    ))}

                {/* Solder pads */}
                {NODES.map(([cx, cy], i) => (
                    <motion.circle
                        key={`node-${i}`}
                        cx={cx}
                        cy={cy}
                        r="4"
                        fill="var(--background)"
                        stroke="var(--brand-400)"
                        strokeWidth="1.5"
                        style={reduced ? undefined : { opacity: nodeOpacity }}
                    />
                ))}
            </svg>
        </div>
    );
}
