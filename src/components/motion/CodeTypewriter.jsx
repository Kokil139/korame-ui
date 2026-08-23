import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { clamp01, cn } from '@/lib/utils';

/**
 * Code that types itself out as the reader scrolls.
 *
 * Each line is revealed by animating `clip-path: inset(0 X% 0 0)` from 100%
 * to 0%, with a caret tracking the reveal edge. Two reasons for clip rather
 * than per-character rendering:
 *
 * 1. `clip-path` is compositor-friendly. Slicing the source into ~250 spans
 *    and toggling their visibility would mean hundreds of style recalcs per
 *    scroll, for an effect the eye reads identically.
 * 2. The full text stays in the DOM the whole time, so it is selectable and
 *    readable to a screen reader even mid-animation.
 *
 * Lines reveal in sequence across the scroll range, with a slight overlap so
 * the caret never appears to stall between lines.
 */
function Line({ tokens, indent, progress, index, count }) {
    // Each line owns a band of the scroll range; bands overlap by ~25%.
    const span = 1 / count;
    const start = clamp01(index * span * 0.85);
    const end = clamp01(start + span);

    const clip = useTransform(
        progress,
        [start, end],
        ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
    );
    const caretLeft = useTransform(progress, [start, end], ['0%', '100%']);
    // The caret only exists while this line is the one being written.
    const caretOpacity = useTransform(
        progress,
        [
            clamp01(start - 0.001),
            clamp01(start + 0.001),
            clamp01(end - 0.001),
            clamp01(end + 0.02),
        ],
        [0, 1, 1, 0],
    );

    /* Two nested spans on purpose. The outer one is a block so each line
       occupies its own row; the inner one is inline-block so it hugs the
       text. The caret is positioned against the inner span, so `left: 100%`
       means "end of this line's text" rather than "right edge of the card" —
       which is both where a caret belongs and what stops it overflowing the
       container and summoning a horizontal scrollbar. */
    return (
        <span className="block">
            <span className="relative inline-block whitespace-pre">
                <motion.span style={{ clipPath: clip }} className="inline-block">
                    {indent ? '  ' : ''}
                    {tokens.map(([text, tone], i) => (
                        <span key={i} className={tone}>
                            {text}
                        </span>
                    ))}
                </motion.span>

                <motion.span
                    aria-hidden="true"
                    style={{ left: caretLeft, opacity: caretOpacity }}
                    className="absolute top-1/2 h-[1.15em] w-[2px] -translate-y-1/2 bg-brand-400"
                />
            </span>
        </span>
    );
}

export default function CodeTypewriter({ lines, className, label }) {
    const ref = useRef(null);
    const reduced = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 0.85', 'end 0.65'],
    });

    if (reduced) {
        return (
            <pre className={cn(className)} aria-label={label}>
                <code>
                    {lines.map((line, i) => (
                        <span key={i} className="block whitespace-pre">
                            {line.indent ? '  ' : ''}
                            {line.tokens.map(([text, tone], j) => (
                                <span key={j} className={tone}>
                                    {text}
                                </span>
                            ))}
                        </span>
                    ))}
                </code>
            </pre>
        );
    }

    return (
        <pre ref={ref} className={cn(className)} aria-label={label}>
            <code>
                {lines.map((line, i) => (
                    <Line
                        key={i}
                        tokens={line.tokens}
                        indent={line.indent}
                        progress={scrollYProgress}
                        index={i}
                        count={lines.length}
                    />
                ))}
            </code>
        </pre>
    );
}
