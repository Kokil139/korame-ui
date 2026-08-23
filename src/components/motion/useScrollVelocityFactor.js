import {
    useScroll,
    useSpring,
    useTransform,
    useVelocity,
} from 'motion/react';

/**
 * A smoothed, signed measure of how hard the page is being scrolled.
 *
 * `useVelocity(scrollY)` is raw pixels-per-second and extremely spiky, so it
 * goes through a soft spring before anything reads it. `clamp: false` on the
 * transform is deliberate: a violent flick should be allowed to exceed the
 * nominal range rather than saturating, which is what makes the effect feel
 * like momentum instead of an on/off switch.
 *
 * Returns a MotionValue centred on 0 at rest, negative scrolling up.
 *
 * @param {number} max  velocity in px/s that maps to a factor of 1
 */
export default function useScrollVelocityFactor(max = 1600) {
    const { scrollY } = useScroll();
    const velocity = useVelocity(scrollY);

    const smooth = useSpring(velocity, {
        stiffness: 260,
        damping: 46,
        mass: 0.4,
        restDelta: 0.5,
    });

    return useTransform(smooth, [-max, 0, max], [-1, 0, 1], { clamp: false });
}
