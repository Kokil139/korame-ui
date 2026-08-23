import { cn } from '@/lib/utils';

/**
 * Ambient background field: slow-drifting colour blooms over an optional
 * grid, finished with film grain.
 *
 * Pure CSS on purpose. These are large, heavily-blurred surfaces — driving
 * them from JS would mean compositing multi-megapixel layers every frame for
 * motion nobody consciously registers. `korame-drift` animates only
 * `transform`, so each bloom stays on its own compositor layer.
 *
 * `aria-hidden` throughout: this is atmosphere, not content.
 */
export default function Aurora({
    className,
    grid = false,
    intensity = 'medium',
}) {
    const bloom = {
        soft: ['opacity-40', 'blur-[130px]'],
        medium: ['opacity-60', 'blur-[110px]'],
        strong: ['opacity-80', 'blur-[100px]'],
    }[intensity];

    return (
        <div
            aria-hidden="true"
            className={cn(
                'pointer-events-none absolute inset-0 overflow-hidden grain',
                className,
            )}
        >
            {grid && <div className="absolute inset-0 grid-field" />}

            {/* Indigo core bloom */}
            <div
                className={cn(
                    'absolute left-1/2 top-[-10%] h-[520px] w-[720px] -translate-x-1/2 rounded-full animate-drift',
                    bloom[0],
                    bloom[1],
                )}
                style={{
                    background:
                        'radial-gradient(circle, var(--brand-500) 0%, transparent 68%)',
                }}
            />

            {/* Cyan counterweight, offset in phase */}
            <div
                className={cn(
                    'absolute right-[-8%] top-[35%] h-[420px] w-[420px] rounded-full animate-drift',
                    bloom[0],
                    bloom[1],
                )}
                style={{
                    background:
                        'radial-gradient(circle, var(--cyan-glow) 0%, transparent 70%)',
                    animationDelay: '-7s',
                }}
            />

            {/* Violet low bloom */}
            <div
                className={cn(
                    'absolute bottom-[-12%] left-[-6%] h-[400px] w-[520px] rounded-full animate-drift',
                    bloom[0],
                    bloom[1],
                )}
                style={{
                    background:
                        'radial-gradient(circle, var(--violet-glow) 0%, transparent 70%)',
                    animationDelay: '-14s',
                }}
            />

            {/* Vignette so the blooms never touch the section edge */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_50%,transparent_35%,var(--background)_100%)]" />
        </div>
    );
}
