import { lazy, Suspense, useEffect, useState } from 'react';
import { ThemeProvider } from './lib/theme';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollProgress from './components/motion/ScrollProgress';

/* Both resolve to the same module, so this is one chunk and one request. */
const BelowTheFold = lazy(() => import('./components/BelowTheFold'));
const SiteFooter = lazy(() =>
    import('./components/BelowTheFold').then((m) => ({ default: m.SiteFooter })),
);

/**
 * Hold the rest of the document back until the Hero has had the main thread
 * to itself.
 *
 * The Hero is the only section whose entrance runs on mount rather than on
 * scroll, so it is the only one that can be starved by the initial commit —
 * which is exactly the shape of the bug this fixes: refresh the home screen
 * and the headline drags, while every section below it, animating later
 * against an idle thread, looks fine.
 *
 * Deferring is skipped whenever the reader is not actually starting at the
 * top: a deep link (`/#pricing`) or a scroll position the browser restored
 * on refresh both need the whole document present immediately, and there is
 * no entrance to protect in either case.
 */
function useBelowTheFold() {
    const [ready, setReady] = useState(
        () =>
            typeof window !== 'undefined' &&
            (window.location.hash !== '' || window.scrollY > 0),
    );

    useEffect(() => {
        if (ready) return undefined;

        const show = () => setReady(true);
        /* Long enough to clear the entrance — the last child starts at 0.75s
           and its spring settles about 0.6s after that — and short enough
           that the content is there long before a reader could reach it. */
        const timer = setTimeout(show, 1500);
        /* ...unless they move first, in which case they need it now. */
        const opts = { once: true, passive: true };
        window.addEventListener('scroll', show, opts);
        window.addEventListener('pointerdown', show, opts);
        window.addEventListener('keydown', show, opts);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', show);
            window.removeEventListener('pointerdown', show);
            window.removeEventListener('keydown', show);
        };
    }, [ready]);

    return ready;
}

/**
 * Entrance motion is owned by each section through <Reveal>. There is no
 * global animation sweep, so no component can animate a node it does not
 * render.
 */
export default function App() {
    const ready = useBelowTheFold();

    return (
        <ThemeProvider>
            <div className="relative min-h-screen">
                {/* Skip link — first tab stop, hidden until focused. */}
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-full focus:bg-foreground focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-background"
                >
                    Skip to content
                </a>

                <Navbar />
                <ScrollProgress />

                <main id="main">
                    <Hero />
                    <Suspense fallback={null}>{ready && <BelowTheFold />}</Suspense>
                </main>

                <Suspense fallback={null}>{ready && <SiteFooter />}</Suspense>
            </div>
        </ThemeProvider>
    );
}
