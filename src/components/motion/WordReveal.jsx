import { Fragment, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { clamp01, cn } from '@/lib/utils';

const START_OPACITY = 0.14;
const SPREAD = 0.75;   // last word starts at 75% of the scroll range
const WORD_DURATION = 0.22;

/**
 * Word-by-word reveal driven by the section's scroll progress.
 *
 * Adapted from Motion's scroll word-reveal example, with two changes:
 *
 * 1. Opacity uses the *range* form `useTransform(v, inputRange, outputRange)`
 *    rather than the deprecated callback form. The range form is also the one
 *    that can be handed to the compositor.
 * 2. Every offset goes through `clamp01`. Ranges built by padding a slice can
 *    land outside [0,1], and WAAPI rejects those as ScrollTimeline keyframe
 *    offsets with "Offsets must be null or in the range [0,1]" — which throws
 *    and blanks the page.
 */
function Word({ children, progress, index, count }) {
    const start = count <= 1 ? 0 : (index / (count - 1)) * SPREAD;

    const opacity = useTransform(
        progress,
        [clamp01(start), clamp01(start + WORD_DURATION)],
        [START_OPACITY, 1],
    );

    // A touch of blur burn-off makes the reveal feel optical rather than
    // like a plain fade. Kept to 4px so it stays cheap.
    const filter = useTransform(
        progress,
        [clamp01(start), clamp01(start + WORD_DURATION)],
        ['blur(4px)', 'blur(0px)'],
    );

    return (
        <motion.span style={{ opacity, filter }} className="inline-block">
            {children}
        </motion.span>
    );
}

export default function WordReveal({ text, className, as: Tag = 'p' }) {
    const ref = useRef(null);
    const reduced = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 0.85', 'end 0.45'],
    });

    const words = text.split(' ');

    // Reduced motion: skip the scroll link entirely rather than degrade it.
    if (reduced) {
        return <Tag className={cn(className)}>{text}</Tag>;
    }

    return (
        <Tag ref={ref} className={cn(className)} aria-label={text}>
            <span aria-hidden="true">
                {words.map((word, i) => (
                    <Fragment key={`${word}-${i}`}>
                        <Word
                            progress={scrollYProgress}
                            index={i}
                            count={words.length}
                        >
                            {word}
                        </Word>
                        {i < words.length - 1 ? ' ' : null}
                    </Fragment>
                ))}
            </span>
        </Tag>
    );
}
