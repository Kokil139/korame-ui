import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ART_MOTION } from '@/lib/art-manifest';
import { cn } from '@/lib/utils';

/**
 * Artwork header for a card. Renders a looping clip when one exists for this
 * tile, otherwise the still.
 *
 * Drop files in `public/art/` — see scripts/generate-art-manifest.mjs for the
 * naming convention. The manifest is generated from that directory, so no
 * code changes are needed to animate a tile.
 *
 * Either way the artwork drifts against scroll. That matters most on touch:
 * hover tilt and hover zoom do nothing on a phone, so without a scroll-linked
 * effect these tiles would be completely static for mobile readers.
 *
 * Playback rules:
 * - Muted + playsInline, or iOS refuses to autoplay inline at all.
 * - Play/pause driven by an IntersectionObserver. Decoding several clips
 *   off-screen is wasted CPU and, on a phone, wasted battery.
 * - Reduced motion never plays; the poster still is shown instead.
 * - The still is always the poster, so the tile is never blank while the
 *   clip buffers.
 */
export default function TileImage({
    name,
    alt,
    className,
    sizes = '(max-width: 768px) 100vw, 33vw',
    scrim = true,
    parallax = 26,
    children,
}) {
    const ref = useRef(null);
    const videoRef = useRef(null);
    const reduced = useReducedMotion();
    const [failed, setFailed] = useState(false);

    const formats = ART_MOTION[name];
    const useVideo = Boolean(formats) && !reduced && !failed;

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], [-parallax, parallax]);

    /* Only decode while on screen. */
    useEffect(() => {
        if (!useVideo) return;
        const el = videoRef.current;
        const frame = ref.current;
        if (!el || !frame) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Autoplay can still be refused; that is not an error worth
                    // surfacing, the poster simply stays.
                    el.play().catch(() => {});
                } else {
                    el.pause();
                }
            },
            { rootMargin: '200px 0px', threshold: 0.01 },
        );

        io.observe(frame);
        return () => io.disconnect();
    }, [useVideo]);

    const mediaClass =
        'absolute inset-0 size-full scale-[1.18] object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.26]';

    return (
        <div
            ref={ref}
            className={cn('relative overflow-hidden bg-surface-2', className)}
        >
            {useVideo ? (
                <motion.video
                    ref={videoRef}
                    poster={`/art/${name}.webp`}
                    width={1200}
                    height={750}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={alt}
                    onError={() => setFailed(true)}
                    style={reduced ? undefined : { y, willChange: 'transform' }}
                    className={mediaClass}
                >
                    {formats.map((ext) => (
                        <source key={ext} src={`/art/${name}.${ext}`} type={`video/${ext}`} />
                    ))}
                </motion.video>
            ) : (
                <motion.img
                    src={`/art/${name}.webp`}
                    srcSet={`/art/${name}@600.webp 600w, /art/${name}.webp 1200w`}
                    sizes={sizes}
                    width={1200}
                    height={750}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    style={reduced ? undefined : { y, willChange: 'transform' }}
                    className={mediaClass}
                />
            )}

            {/* Scrim: the artwork is deep-toned, so on the light theme the card
                needs a fade into its own surface or the join reads as a hard
                seam. Uses the card token, not a hardcoded colour. */}
            {scrim && (
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(to_top,var(--card)_0%,color-mix(in_oklch,var(--card)_35%,transparent)_18%,transparent_42%)]"
                />
            )}

            {children}
        </div>
    );
}
