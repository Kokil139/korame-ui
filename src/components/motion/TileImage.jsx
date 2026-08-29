import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ART_MOTION, artUrl } from '@/lib/art-manifest';
import { useMediaQuery, TOUCH_PHONE } from '@/lib/use-media-query';
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
 * Every URL goes through `artUrl`, which appends the tile's content hash.
 * /art/ is cached for thirty days on file names that never change, so a
 * replaced tile would otherwise stay invisible to returning visitors for a
 * month — which is exactly what happened when these became photographs.
 *
 * Playback rules:
 * - Muted + playsInline, or iOS refuses to autoplay inline at all.
 * - Play/pause driven by an IntersectionObserver. Decoding several clips
 *   off-screen is wasted CPU and, on a phone, wasted battery.
 * - Reduced motion never plays; the poster still is shown instead.
 * - The still is always the poster, so the tile is never blank while the
 *   clip buffers.
 * - Phones get the still, not the clip. The clips are muxed by
 *   scripts/lib/webm.mjs, which has no inter-frame prediction — every frame
 *   is a VP8 keyframe. That is affordable on a desktop and it is not on a
 *   phone: iOS has no hardware VP8 path at all, so each of these is a full
 *   intra-frame decode, twelve times a second, for however many tiles are on
 *   screen. There is also no MP4 alongside them, so iOS below 17.4 has been
 *   falling back to the poster regardless. The scroll parallax — the reason
 *   these tiles move on touch, where hover does nothing — is on the <img>
 *   too, so nothing is lost but the loop.
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
    const phone = useMediaQuery(TOUCH_PHONE);
    const [failed, setFailed] = useState(false);

    const formats = ART_MOTION[name];
    const useVideo = Boolean(formats) && !reduced && !phone && !failed;

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
                    poster={artUrl(`${name}.webp`, name)}
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
                        <source
                            key={ext}
                            src={artUrl(`${name}.${ext}`, name)}
                            type={`video/${ext}`}
                        />
                    ))}
                </motion.video>
            ) : (
                <motion.img
                    src={artUrl(`${name}.webp`, name)}
                    srcSet={`${artUrl(`${name}@600.webp`, name)} 600w, ${artUrl(`${name}.webp`, name)} 1200w`}
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
