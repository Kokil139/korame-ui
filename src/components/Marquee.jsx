import { useRef } from 'react';
import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useTransform,
    useReducedMotion,
} from 'motion/react';
import useScrollVelocityFactor from '@/components/motion/useScrollVelocityFactor';

const ITEMS = [
    'React',
    'Vite',
    'Tailwind CSS',
    'Motion',
    'Node.js',
    'TypeScript',
    'Next.js',
    'Shopify',
    'Core Web Vitals',
    'Technical SEO',
    'Cloud Hosting',
    'AI Integration',
];

const BASE_SPEED = 22; // px per second at rest

/**
 * Capability ticker whose speed and skew are driven by scroll velocity.
 *
 * Rather than a fixed CSS animation, the track's position is advanced by hand
 * each frame so scrolling can push it: flick down and the words accelerate and
 * lean; scroll up and they reverse. That coupling is what makes the page feel
 * physical rather than decorative.
 *
 * Implementation notes:
 * - Position is a MotionValue advanced in `useAnimationFrame`; it never
 *   touches React state, so this does not re-render while scrolling.
 * - `wrap` is done manually against half the track width, because the track
 *   holds exactly two copies of the list  so -50% is one full copy.
 * - The duplicate copy is `aria-hidden`; a screen reader hears the list once.
 */
export default function Marquee() {
    const trackRef = useRef(null);
    const reduced = useReducedMotion();

    const baseX = useMotionValue(0);
    const velocityFactor = useScrollVelocityFactor();

    /* Lean into the direction of travel.
       Clamped deliberately, unlike the speed below: the velocity factor is
       unbounded so momentum can keep accelerating the track, but letting the
       skew ride that same unbounded value pushed it past 20deg on a hard
       flick, at which point the words stop being readable. Speed may run
       away; legibility may not. */
    const skewX = useTransform(velocityFactor, [-1, 0, 1], [5, 0, -5]);

    useAnimationFrame((_, delta) => {
        if (reduced || !trackRef.current) return;

        // Half the track is one full copy of the list.
        const wrapWidth = trackRef.current.scrollWidth / 2;
        if (!wrapWidth) return;

        const v = velocityFactor.get();
        // Direction flips when scrolling up; magnitude scales with velocity.
        const speed = BASE_SPEED + BASE_SPEED * 6 * Math.abs(v);
        const direction = v < -0.02 ? 1 : -1;

        let next = baseX.get() + (direction * speed * delta) / 1000;

        // Keep the value inside one copy so it never drifts to huge numbers.
        if (next <= -wrapWidth) next += wrapWidth;
        if (next > 0) next -= wrapWidth;

        baseX.set(next);
    });

    return (
        <section
            aria-label="Technologies we work with"
            className="relative overflow-hidden border-y border-border bg-surface-0 py-6"
        >
            <div
                className="flex overflow-hidden"
                style={{
                    maskImage:
                        'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
                    WebkitMaskImage:
                        'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
                }}
            >
                <motion.div
                    ref={trackRef}
                    style={reduced ? undefined : { x: baseX, skewX, willChange: 'transform' }}
                    className="flex shrink-0"
                >
                    {[0, 1].map((copy) => (
                        <ul
                            key={copy}
                            aria-hidden={copy === 1 ? 'true' : undefined}
                            className="flex shrink-0 items-center gap-12 pr-12"
                        >
                            {ITEMS.map((item) => (
                                <li
                                    key={item}
                                    className="flex shrink-0 items-center gap-3 font-heading text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="size-1 rounded-full bg-brand-400"
                                    />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
