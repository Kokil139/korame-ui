/**
 * Shared motion vocabulary.
 *
 * One set of springs so every section moves like the same product. Physical
 * properties (x, y, scale, rotate) use physics springs; purely optical ones
 * (opacity, filter) use a duration + easing curve, which reads more
 * predictably and never overshoots.
 */

/** Snappy, near-critically damped. Default for entrances. */
export const springSnap = {
    type: 'spring',
    stiffness: 320,
    damping: 32,
    mass: 0.9,
};

/** Softer settle, for larger surfaces travelling further. */
export const springSoft = {
    type: 'spring',
    stiffness: 180,
    damping: 26,
    mass: 1,
};

/** Pointer-tracking spring  low stiffness so the element trails the cursor. */
export const springTrail = {
    stiffness: 260,
    damping: 26,
    mass: 0.6,
};

/**
 * Optical fades. No overshoot: this is an agency site selling engineering
 * precision, so the easing should not read as bouncy.
 */
export const easeOptical = {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1],
};

/**
 * Standard viewport config: fire once, a third of the way in.
 *
 * `once` matters  re-triggering an entrance on every scroll pass is the
 * single most common way a "premium" site starts feeling cheap.
 */
export const viewportOnce = { once: true, amount: 0.3 };
