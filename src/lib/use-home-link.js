import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';

/**
 * Props for a logo that always returns the reader to the top of the homepage.
 *
 * ── Why this is not just <Link to="/"> ───────────────────────────────────
 * React Router treats a navigation to the path you are already on as a no-op.
 * On every other route the logo worked; on the homepage itself — the one place
 * a reader is most likely to have scrolled a long way down — clicking it did
 * nothing at all, which reads as a broken link rather than as a deliberate
 * decision. `ScrollToTop` in App.jsx cannot help, because it keys off
 * `pathname` and the pathname has not changed.
 *
 * So on `/` we take the click ourselves and scroll instead. Everywhere else
 * the handler returns without touching the event and the router navigates
 * normally, which keeps the logo a real crawlable <a href="/"> in both cases.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * ── Why the scroll waits a frame ─────────────────────────────────────────
 * The mobile drawer sets `body { overflow: hidden }`, and React restores it
 * on its *next commit* — which is after this handler returns. Scrolling
 * inline would issue the scroll against a still-locked body and it would be
 * silently dropped, which is the same trap that once made every mobile nav
 * link do nothing. `onNavigate` closes the drawer and the scroll goes out on
 * the following frame, by which point the lock is gone.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Reduced motion jumps rather than glides. `html { scroll-behavior: smooth }`
 * is set globally and the reduced-motion block already overrides it to `auto`,
 * but this call passes `behavior` explicitly and would win over the
 * stylesheet, so it has to make the same decision itself.
 *
 * @param {object}   [options]
 * @param {Function} [options.onNavigate] Run on every logo click — used to
 *   close the mobile drawer before the scroll goes out.
 */
export function useHomeLink({ onNavigate } = {}) {
    const { pathname } = useLocation();
    const reduced = useReducedMotion();

    const onClick = useCallback(
        (event) => {
            onNavigate?.();

            /* Not on the homepage: let the router do its job. */
            if (pathname !== '/') return;

            event.preventDefault();
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: reduced ? 'instant' : 'smooth',
                });
            });
        },
        [pathname, reduced, onNavigate],
    );

    return { to: '/', onClick };
}
