import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { SERVICE_LIST, servicePath } from '@/content/service-list';
import { NAV } from '@/lib/site';
import { useHomeLink } from '@/lib/use-home-link';
import { springSnap } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Primary navigation.
 *
 * The visual language is unchanged from the single-page build — the K tile,
 * the wordmark, the sliding active pill, the frosted drawer. What changed is
 * what the links are: real routes rather than in-page anchors, so every one
 * of them is a crawlable <a href> that a search engine can follow to a
 * separate document.
 *
 * The services dropdown is deliberately a list of plain links rather than a
 * JavaScript-driven mega menu. Crawlers follow anchors; they do not open
 * menus.
 */
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const reduced = useReducedMotion();
    const { pathname } = useLocation();
    const servicesRef = useRef(null);
    const closeTimer = useRef(null);

    /* Condense the header once the hero starts leaving. Passive listener +
       a boolean state means at most one re-render per threshold crossing. */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Any navigation closes everything. Without this the drawer survives a
       route change and covers the page it just navigated to. */
    useEffect(() => {
        setIsOpen(false);
        setServicesOpen(false);
        setMobileServicesOpen(false);
    }, [pathname]);

    /* Lock body scroll while the mobile drawer is open. */
    useEffect(() => {
        if (!isOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, [isOpen]);

    /* Escape closes whichever surface is open. */
    useEffect(() => {
        const onKey = (e) => {
            if (e.key !== 'Escape') return;
            setIsOpen(false);
            setServicesOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    /* Click outside closes the services panel. Pointerdown rather than click
       so it fires before a link inside the panel navigates. */
    useEffect(() => {
        if (!servicesOpen) return;
        const onDown = (e) => {
            if (!servicesRef.current?.contains(e.target)) setServicesOpen(false);
        };
        document.addEventListener('pointerdown', onDown);
        return () => document.removeEventListener('pointerdown', onDown);
    }, [servicesOpen]);

    /* Hover intent: a short grace period on leave, so crossing the gap
       between the trigger and the panel does not dismiss it. */
    const openServices = useCallback(() => {
        clearTimeout(closeTimer.current);
        setServicesOpen(true);
    }, []);
    const scheduleClose = useCallback(() => {
        clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setServicesOpen(false), 140);
    }, []);
    useEffect(() => () => clearTimeout(closeTimer.current), []);

    /* Closing the drawer here matters even on the homepage branch: the
       handler scrolls on the next frame, and the body lock has to be gone by
       then. */
    const homeLink = useHomeLink({ onNavigate: useCallback(() => setIsOpen(false), []) });

    const isServiceRoute =
        pathname === '/services' || SERVICE_LIST.some((s) => servicePath(s.slug) === pathname);

    const linkIsActive = (href) =>
        href === '/services' ? isServiceRoute : pathname === href || pathname.startsWith(`${href}/`);

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-out-expo)]',
                scrolled || isOpen
                    ? 'border-b border-border bg-background/70 backdrop-blur-2xl backdrop-saturate-150'
                    : 'border-b border-transparent bg-transparent',
            )}
        >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                {/* ---------------------------------------------------------
                    Logo — the original K tile and KORAME. wordmark, kept.
                   --------------------------------------------------------- */}
                <Link
                    {...homeLink}
                    className="group flex shrink-0 items-center gap-2.5 rounded-2xl glow-interactive"
                    aria-label="Korame — home"
                >
                    <span className="relative grid size-10 place-items-center overflow-hidden rounded-xl bg-[linear-gradient(135deg,var(--brand-600),var(--brand-500)_50%,var(--cyan-glow))] font-heading text-xl font-bold text-white shadow-[0_6px_20px_-6px_color-mix(in_oklch,var(--brand-500)_80%,transparent)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-105">
                        K
                        {/* Sheen sweep on hover */}
                        <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,oklch(1_0_0/0.45),transparent)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-full" />
                    </span>

                    <span className="font-heading text-xl font-extrabold tracking-wide text-foreground sm:text-2xl">
                        KORAME<span className="text-brand-400">.</span>
                    </span>
                </Link>

                {/* ---------------------------------------------------------
                    Desktop nav — the active pill is a shared layout element,
                    so it slides between links instead of cross-fading.
                   --------------------------------------------------------- */}
                <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
                    {NAV.map((link) => {
                        const isActive = linkIsActive(link.href);
                        const isServices = link.href === '/services';

                        const pill = isActive && (
                            <motion.span
                                layoutId={reduced ? undefined : 'nav-pill'}
                                className="absolute inset-0 -z-10 rounded-full bg-elevate ring-1 ring-border"
                                transition={springSnap}
                            />
                        );

                        const classes = cn(
                            'relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium glow-interactive',
                            isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                        );

                        if (!isServices) {
                            return (
                                <NavLink
                                    key={link.name}
                                    to={link.href}
                                    className={classes}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {pill}
                                    {link.name}
                                </NavLink>
                            );
                        }

                        return (
                            <div
                                key={link.name}
                                ref={servicesRef}
                                className="relative"
                                onMouseEnter={openServices}
                                onMouseLeave={scheduleClose}
                            >
                                <Link
                                    to="/services"
                                    className={classes}
                                    aria-current={isActive ? 'page' : undefined}
                                    aria-expanded={servicesOpen}
                                    aria-haspopup="true"
                                    onFocus={openServices}
                                >
                                    {pill}
                                    {link.name}
                                    <ChevronDown
                                        aria-hidden="true"
                                        className={cn(
                                            'size-3.5 transition-transform duration-300',
                                            servicesOpen && 'rotate-180',
                                        )}
                                    />
                                </Link>

                                {/**
                                 * Positioning is a separate, always-mounted
                                 * element from the one Motion animates.
                                 *
                                 * Two things were making this panel flicker.
                                 * This splits the first:
                                 *
                                 * `-translate-x-1/2` sat on the same node
                                 * Motion writes `transform` to, so the two
                                 * fought over one property every frame.
                                 * Centring lives here now and nothing animates
                                 * it.
                                 *
                                 * The second is why the panel below is opaque
                                 * rather than frosted — see the note on it.
                                 *
                                 * The wrapper is inert while closed; it is
                                 * empty then, but it is still a 34rem box under
                                 * the trigger and would otherwise swallow
                                 * pointer events meant for the nav.
                                 */}
                                <div
                                    className={cn(
                                        'absolute left-1/2 top-full w-[34rem] -translate-x-1/2 pt-3',
                                        servicesOpen ? 'pointer-events-auto' : 'pointer-events-none',
                                    )}
                                >
                                <AnimatePresence>
                                    {servicesOpen && (
                                        <motion.div
                                            initial={reduced ? false : { opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={reduced ? undefined : { opacity: 0, y: -6 }}
                                            transition={{ type: 'spring', bounce: 0, visualDuration: 0.22 }}
                                            /* Promoted for the duration of the
                                               animation so Chrome composites the
                                               fade instead of repainting the
                                               backdrop behind it. */
                                            style={{ willChange: 'transform, opacity' }}
                                            className="origin-top"
                                        >
                                            {/**
                                             * Opaque, not frosted — and that is
                                             * the actual cure for the flicker.
                                             *
                                             * Per the Filter Effects spec, an
                                             * ancestor with `opacity < 1` (or
                                             * `will-change: opacity`) becomes a
                                             * *backdrop root*. So while this
                                             * panel faded in, the only thing
                                             * behind it for `backdrop-filter`
                                             * to sample was its own animating
                                             * wrapper — empty. On the frame
                                             * opacity reached 1 the backdrop
                                             * root disappeared and the blur
                                             * snapped to sampling the real page
                                             * instead. That snap is the flicker,
                                             * and no amount of layer promotion
                                             * removes it: a frosted surface
                                             * cannot be faded without it.
                                             *
                                             * `--glass-bg-flat` is the token
                                             * this design system already
                                             * switches to when it drops the
                                             * blur on touch devices, so the
                                             * opaque treatment is on-system and
                                             * themes correctly. It is also the
                                             * better call for a menu floating
                                             * over arbitrary page content.
                                             *
                                             * Set inline because `.glass-lit`
                                             * declares `backdrop-filter` in the
                                             * same cascade layer as the
                                             * utilities that would override it,
                                             * and equal specificity means the
                                             * winner depends on stylesheet
                                             * order rather than call order.
                                             */}
                                            <div
                                                style={{
                                                    background: 'var(--glass-bg-flat)',
                                                    backdropFilter: 'none',
                                                    WebkitBackdropFilter: 'none',
                                                }}
                                                className="glass-lit rounded-3xl p-3 shadow-[0_24px_60px_-24px_var(--shadow-tint-strong)]"
                                            >
                                                <ul className="grid grid-cols-2 gap-1">
                                                    {SERVICE_LIST.map((s) => (
                                                        <li key={s.slug}>
                                                            <Link
                                                                to={servicePath(s.slug)}
                                                                className={cn(
                                                                    'block rounded-2xl px-4 py-2.5 text-sm glow-interactive',
                                                                    pathname === servicePath(s.slug)
                                                                        ? 'bg-elevate text-foreground'
                                                                        : 'text-muted-foreground hover:bg-elevate hover:text-foreground',
                                                                )}
                                                            >
                                                                <span className="block font-medium">{s.nav}</span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <Link
                                                    to="/services"
                                                    className="mt-1 flex items-center justify-between rounded-2xl border-t border-border px-4 py-3 text-sm font-semibold text-foreground glow-interactive hover:bg-elevate"
                                                >
                                                    All services
                                                    <ArrowUpRight className="size-4" aria-hidden="true" />
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                </div>
                            </div>
                        );
                    })}
                </nav>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <ThemeToggle />

                    <Button asChild variant="contrast" size="md" className="group hidden sm:inline-flex">
                        <Link to="/contact">
                            Start a project
                            <ArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                    </Button>

                    <button
                        onClick={() => setIsOpen((v) => !v)}
                        className="grid size-10 place-items-center rounded-xl text-muted-foreground glow-interactive hover:bg-elevate hover:text-foreground xl:hidden"
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                    >
                        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>
                </div>
            </div>

            {/* ---------------------------------------------------------
                Mobile drawer
               --------------------------------------------------------- */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', bounce: 0, visualDuration: 0.35 }}
                        className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-2xl xl:hidden"
                    >
                        <nav
                            className="flex max-h-[calc(100dvh-5rem)] flex-col gap-1 overflow-y-auto px-6 py-6"
                            aria-label="Mobile"
                        >
                            {NAV.map((link, i) => {
                                const isServices = link.href === '/services';
                                const row = (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ ...springSnap, delay: 0.04 * i }}
                                    >
                                        <div className="flex items-center">
                                            <Link
                                                to={link.href}
                                                className="flex-1 rounded-xl px-3 py-3 text-lg font-medium text-muted-foreground glow-interactive hover:bg-elevate hover:text-foreground"
                                            >
                                                {link.name}
                                            </Link>

                                            {isServices && (
                                                <button
                                                    type="button"
                                                    onClick={() => setMobileServicesOpen((v) => !v)}
                                                    aria-expanded={mobileServicesOpen}
                                                    aria-label={
                                                        mobileServicesOpen
                                                            ? 'Hide service pages'
                                                            : 'Show service pages'
                                                    }
                                                    className="grid size-10 place-items-center rounded-xl text-muted-foreground glow-interactive hover:bg-elevate hover:text-foreground"
                                                >
                                                    <ChevronDown
                                                        className={cn(
                                                            'size-4 transition-transform duration-300',
                                                            mobileServicesOpen && 'rotate-180',
                                                        )}
                                                    />
                                                </button>
                                            )}
                                        </div>

                                        {isServices && (
                                            <AnimatePresence initial={false}>
                                                {mobileServicesOpen && (
                                                    <motion.ul
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{
                                                            type: 'spring',
                                                            bounce: 0,
                                                            visualDuration: 0.3,
                                                        }}
                                                        className="overflow-hidden pl-3"
                                                    >
                                                        {SERVICE_LIST.map((s) => (
                                                            <li key={s.slug}>
                                                                <Link
                                                                    to={servicePath(s.slug)}
                                                                    className="block rounded-xl px-3 py-2.5 text-base text-muted-foreground glow-interactive hover:bg-elevate hover:text-foreground"
                                                                >
                                                                    {s.nav}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </motion.ul>
                                                )}
                                            </AnimatePresence>
                                        )}
                                    </motion.div>
                                );
                                return row;
                            })}

                            <Button asChild variant="primary" size="lg" className="mt-3 w-full">
                                <Link to="/contact">
                                    Start a project
                                    <ArrowUpRight />
                                </Link>
                            </Button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
