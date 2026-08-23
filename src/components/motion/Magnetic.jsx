import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Magnetic pull: the element chases the pointer within its own bounds, then
 * springs back on leave.
 *
 * Two elements, deliberately. The outer wrapper receives the pointer events
 * and never moves; only the inner span is translated.
 *
 * Putting both on one element — which is the obvious way to write this —
 * creates a feedback loop: the element translates away from the cursor, hit
 * testing then finds the cursor is no longer over it, `pointerleave` fires,
 * the spring returns it to centre, which puts it back under the cursor,
 * `pointerenter` fires, and it lurches away again. At the edges of the
 * element that oscillates several times a second and reads as flicker.
 * A stationary hit area cannot do that.
 *
 * Kept subtle (`strength` ~0.25): a button that runs away from the cursor is
 * a usability problem, not a delight.
 */
export default function Magnetic({
    children,
    className,
    strength = 0.25,
    as: Tag = 'div',
    ...rest
}) {
    const ref = useRef(null);
    const rect = useRef(null);
    const reduced = useReducedMotion();

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 220, damping: 20, mass: 0.5 });
    const sy = useSpring(y, { stiffness: 220, damping: 20, mass: 0.5 });

    const handleEnter = useCallback(() => {
        if (ref.current) rect.current = ref.current.getBoundingClientRect();
    }, []);

    const handleMove = useCallback(
        (e) => {
            const r = rect.current;
            if (!r) return;
            x.set((e.clientX - (r.left + r.width / 2)) * strength);
            y.set((e.clientY - (r.top + r.height / 2)) * strength);
        },
        [x, y, strength],
    );

    const handleLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    if (reduced) {
        return (
            <Tag className={className} {...rest}>
                {children}
            </Tag>
        );
    }

    return (
        <Tag
            ref={ref}
            onPointerEnter={handleEnter}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            className={cn('inline-flex', className)}
            {...rest}
        >
            <motion.span
                style={{ x: sx, y: sy, willChange: 'transform' }}
                className="inline-flex w-full"
            >
                {children}
            </motion.span>
        </Tag>
    );
}
