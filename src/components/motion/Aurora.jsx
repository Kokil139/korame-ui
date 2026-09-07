import { cn } from '@/lib/utils';

/**
 * Ambient background texture: an optional dot grid, film grain, and a
 * vignette that settles the whole field into the page background.
 *
 * This used to carry three large drifting colour blooms as well. They were
 * removed  on a light canvas a heavily blurred brand-coloured disc does not
 * read as atmosphere, it reads as a stain on the page. What is left is the
 * texture, which is what was actually doing the work.
 *
 * Pure CSS on purpose, and `aria-hidden` throughout: this is atmosphere, not
 * content.
 */
export default function Aurora({ className, grid = false }) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                'pointer-events-none absolute inset-0 overflow-hidden grain',
                className,
            )}
        >
            {grid && <div className="absolute inset-0 grid-field" />}

            {/* Vignette, so the grid never runs hard into the section edge */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_50%,transparent_35%,var(--background)_100%)]" />
        </div>
    );
}
