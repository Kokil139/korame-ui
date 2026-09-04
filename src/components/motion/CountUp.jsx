import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * `useLayoutEffect` warns during pre-rendering, because a layout effect
 * cannot be encoded into a string. It is genuinely the right hook on the
 * client  see the comment on its use below  so alias it to `useEffect` on
 * the server, where neither one runs and the distinction is meaningless.
 */
const useIsomorphicLayoutEffect =
    typeof window === 'undefined' ? useEffect : useLayoutEffect;
import {
    useInView,
    useMotionValue,
    useSpring,
    useReducedMotion,
} from 'motion/react';

/**
 * Counts a numeric stat up when it scrolls into view.
 *
 * The DOM text is written from a MotionValue subscription rather than React
 * state, so the count does not re-render the component on every frame.
 *
 * The element's *initial* markup is the final value, so a crawler or a
 * reduced-motion user reads the real number. The zero is written in a layout
 * effect at the moment the animation starts, which lands in the same paint
 * as the first animated frame  no flash of the final value.
 */
export default function CountUp({
    value,
    prefix = '',
    suffix = '',
    decimals = 0,
    className,
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.5 });
    const reduced = useReducedMotion();

    const mv = useMotionValue(0);
    const spring = useSpring(mv, { stiffness: 90, damping: 24, mass: 1 });

    const format = (n) => prefix + n.toFixed(decimals) + suffix;
    const shouldAnimate = inView && !reduced;

    useIsomorphicLayoutEffect(() => {
        if (!shouldAnimate) return;
        const node = ref.current;
        if (node) node.textContent = format(0);
    }, [shouldAnimate]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!shouldAnimate) return;

        const unsubscribe = spring.on('change', (latest) => {
            const node = ref.current;
            if (node) node.textContent = format(latest);
        });

        mv.set(value);

        return unsubscribe;
    }, [shouldAnimate, spring, mv, value]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <span ref={ref} className={className}>
            {format(value)}
        </span>
    );
}
