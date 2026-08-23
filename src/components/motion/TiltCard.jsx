import { useRef, useCallback } from 'react';
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useReducedMotion,
} from 'motion/react';
import { springTrail } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Pointer-tracked 3D tilt with a specular highlight that follows the cursor.
 *
 * The card rotates about X/Y from the pointer's normalised offset, and a
 * radial "sheen" layer tracks the same position so the surface reads as lit
 * rather than merely rotated — that pairing is what sells the depth.
 *
 * Implementation notes:
 * - Pointer position is stored in MotionValues, never React state, so a
 *   pointermove never re-renders the tree.
 * - `useSpring` smooths the raw pointer so the card trails the cursor
 *   slightly instead of snapping to it.
 * - The rect is measured on pointerenter, not per move, to avoid forcing
 *   layout on every frame.
 * - Independent transforms (rotateX/rotateY) are used rather than a
 *   `transform` string because they are driven by MotionValues.
 */
export default function TiltCard({
    children,
    className,
    /* Applied to the outer perspective wrapper. Grid children need `h-full`
       here as well as on the card, or the perspective div collapses to its
       content and the cards in a row stop matching heights. */
    wrapperClassName,
    intensity = 9,
    glare = true,
    lift = 8,
    ...rest
}) {
    const ref = useRef(null);
    const rect = useRef(null);
    const reduced = useReducedMotion();

    // Normalised pointer offset from card centre, -0.5 .. 0.5
    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const active = useMotionValue(0);

    const sx = useSpring(px, springTrail);
    const sy = useSpring(py, springTrail);
    const sActive = useSpring(active, { stiffness: 200, damping: 30 });

    const rotateX = useTransform(sy, [-0.5, 0.5], [intensity, -intensity]);
    const rotateY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);
    const translateZ = useTransform(sActive, [0, 1], [0, lift]);

    // Specular highlight position, as a percentage of the card box
    const glareX = useTransform(sx, [-0.5, 0.5], ['15%', '85%']);
    const glareY = useTransform(sy, [-0.5, 0.5], ['15%', '85%']);
    const glareOpacity = useTransform(sActive, [0, 1], [0, 1]);

    // Hoisted out of the JSX: hooks must not sit behind the `glare` flag.
    const glareBackground = useTransform(
        [glareX, glareY],
        ([x, y]) =>
            `radial-gradient(420px circle at ${x} ${y}, var(--glare-ink), transparent 55%)`,
    );

    const handleEnter = useCallback(() => {
        if (!ref.current) return;
        // Measure once per hover rather than once per frame.
        rect.current = ref.current.getBoundingClientRect();
        active.set(1);
    }, [active]);

    const handleMove = useCallback(
        (e) => {
            const r = rect.current;
            if (!r) return;
            px.set((e.clientX - r.left) / r.width - 0.5);
            py.set((e.clientY - r.top) / r.height - 0.5);
        },
        [px, py],
    );

    const handleLeave = useCallback(() => {
        px.set(0);
        py.set(0);
        active.set(0);
    }, [px, py, active]);

    // Reduced motion: render a plain card, no perspective wrapper at all.
    if (reduced) {
        return (
            <div className={cn(wrapperClassName, className)} {...rest}>
                {children}
            </div>
        );
    }

    return (
        <div className={cn('perspective-near', wrapperClassName)} {...rest}>
            <motion.div
                ref={ref}
                onPointerEnter={handleEnter}
                onPointerMove={handleMove}
                onPointerLeave={handleLeave}
                style={{
                    rotateX,
                    rotateY,
                    translateZ,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                }}
                className={cn('relative', className)}
            >
                {children}

                {glare && (
                    <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
                        style={{
                            opacity: glareOpacity,
                            background: glareBackground,
                        }}
                    />
                )}
            </motion.div>
        </div>
    );
}
