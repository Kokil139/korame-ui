import { motion, useReducedMotion } from 'motion/react';
import { springSnap, easeOptical, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Scroll entrance. Replaces the old global `.gsap-reveal` ScrollTrigger sweep.
 *
 * The GSAP version queried the DOM for every `.gsap-reveal` node on mount and
 * built one ScrollTrigger each; this scopes the animation to the component
 * that owns it, so a section can never animate an element it does not render.
 *
 * When reduced motion is set the content renders at its final state rather
 * than a degraded animation — no transform, no opacity ramp.
 */
export default function Reveal({
    children,
    className,
    delay = 0,
    y = 28,
    x = 0,
    scale = 1,
    blur = false,
    as = 'div',
    ...rest
}) {
    const reduced = useReducedMotion();
    const MotionTag = motion[as] ?? motion.div;

    if (reduced) {
        const Tag = as;
        return (
            <Tag className={className} {...rest}>
                {children}
            </Tag>
        );
    }

    return (
        <MotionTag
            className={cn(className)}
            initial={{
                opacity: 0,
                y,
                x,
                scale,
                ...(blur ? { filter: 'blur(10px)' } : null),
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                ...(blur ? { filter: 'blur(0px)' } : null),
            }}
            viewport={viewportOnce}
            transition={{
                ...springSnap,
                delay,
                opacity: { ...easeOptical, delay },
                ...(blur ? { filter: { ...easeOptical, delay } } : null),
            }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}
