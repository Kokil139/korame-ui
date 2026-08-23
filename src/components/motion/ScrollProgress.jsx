import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';

/**
 * Page-read progress bar pinned under the header.
 *
 * `scaleX` is driven straight from `scrollYProgress` through a spring, so the
 * bar runs on the compositor and never triggers layout. `skipInitialAnimation`
 * stops it sweeping 0→n on mount when the page loads already scrolled
 * (a refresh mid-page, or a deep link).
 */
export default function ScrollProgress() {
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll();

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 140,
        damping: 26,
        restDelta: 0.001,
        skipInitialAnimation: true,
    });

    if (reduced) return null;

    return (
        <motion.div
            aria-hidden="true"
            style={{ scaleX, willChange: 'transform' }}
            className="fixed left-0 top-20 z-50 h-px w-full origin-left bg-gradient-to-r from-cyan-glow via-brand-400 to-violet-glow"
        />
    );
}
