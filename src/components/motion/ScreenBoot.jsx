import { createContext, useContext } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Boot sequence for a device screen: the Korame page "loads in" the way a
 * real page does  skeleton first, then content settling into place.
 *
 * Apple's device films sell hardware by letting software arrive on it, and
 * the specific thing that reads as "loading" rather than "fading" is the
 * order: surface wakes, wireframe appears, content replaces wireframe, chrome
 * last. A single fade of the whole screen reads as a slideshow.
 *
 * A context carries the per-device base delay so each device can be staggered
 * (laptop, then tablet, then phone) without every child taking a prop.
 */
const BootContext = createContext({ base: 0, reduced: false });

export function ScreenBoot({ base = 0, children, className }) {
    const reduced = useReducedMotion();
    return (
        <BootContext.Provider value={{ base, reduced }}>
            <div className={cn('relative', className)}>{children}</div>
        </BootContext.Provider>
    );
}

/**
 * One element of the booting page.
 *
 * `step` is its position in the sequence, in seconds after the device's base
 * delay. `skeleton` renders a placeholder block that dissolves as the real
 * content arrives, which is what makes it read as loading.
 */
export function BootItem({
    step = 0,
    children,
    className,
    from = 8,
    skeleton = false,
}) {
    const { base, reduced } = useContext(BootContext);

    if (reduced) {
        return <div className={className}>{children}</div>;
    }

    const delay = base + step;

    return (
        <motion.div
            initial={{ opacity: 0, y: from, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={viewportOnce}
            transition={{
                type: 'spring',
                bounce: 0,
                visualDuration: 0.45,
                delay,
                opacity: { duration: 0.35, delay },
                filter: { duration: 0.4, delay },
            }}
            className={cn('relative', className)}
        >
            {children}

            {/* Skeleton shimmer that clears exactly as the content lands. */}
            {skeleton && (
                <motion.span
                    aria-hidden="true"
                    initial={{ opacity: 1 }}
                    whileInView={{ opacity: 0 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.4, delay: delay + 0.12 }}
                    className="absolute inset-0 rounded-[inherit] bg-elevate-strong"
                />
            )}
        </motion.div>
    );
}

/**
 * The screen surface waking up: black → content, with a single light sweep
 * across the glass. This is the beat that sells "a device turning on".
 */
export function ScreenWake({ base = 0, className }) {
    const reduced = useReducedMotion();
    if (reduced) return null;

    return (
        <>
            {/* Panel still dark, clearing as the page paints. */}
            <motion.div
                aria-hidden="true"
                initial={{ opacity: 1 }}
                whileInView={{ opacity: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.55, delay: base, ease: [0.16, 1, 0.3, 1] }}
                className={cn('absolute inset-0 z-20 bg-[#05060a]', className)}
            />

            {/* Specular sweep across the glass, once. */}
            <motion.div
                aria-hidden="true"
                initial={{ x: '-120%' }}
                whileInView={{ x: '120%' }}
                viewport={viewportOnce}
                transition={{
                    duration: 1.1,
                    delay: base + 0.25,
                    ease: [0.16, 1, 0.3, 1],
                }}
                className="pointer-events-none absolute inset-y-0 z-30 w-1/2 -skew-x-12 bg-[linear-gradient(100deg,transparent,oklch(1_0_0/0.13),transparent)]"
            />
        </>
    );
}

/** A thin progress bar that fills once, like a page load indicator. */
export function BootProgress({ base = 0, className }) {
    const reduced = useReducedMotion();
    if (reduced) return null;

    return (
        <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0, opacity: 1 }}
            whileInView={{ scaleX: 1, opacity: 0 }}
            viewport={viewportOnce}
            transition={{
                scaleX: { duration: 0.9, delay: base + 0.1, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.3, delay: base + 1.0 },
            }}
            className={cn(
                'absolute inset-x-0 top-0 z-30 h-[2px] origin-left',
                'bg-[linear-gradient(90deg,var(--cyan-glow),var(--brand-400),var(--violet-glow))]',
                className,
            )}
        />
    );
}
