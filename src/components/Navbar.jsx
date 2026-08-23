import { useState, useEffect, useCallback } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { springSnap } from '@/lib/motion';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
    { name: 'Process', href: '#process' },
    { name: 'Services', href: '#services' },
    { name: 'Work', href: '#work' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
];

/** Section ids observed for the active-link indicator. */
const SECTION_IDS = [
    'home',
    'about',
    'vision',
    ...NAV_LINKS.map((l) => l.href.slice(1)),
    'audit',
    'reviews',
    'contact',
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState('home');
    const reduced = useReducedMotion();

    /* Condense the header once the hero starts leaving. Passive listener +
       a boolean state means at most one re-render per threshold crossing. */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Active section via IntersectionObserver rather than scroll math —
       no layout reads on the scroll thread. */
    useEffect(() => {
        const targets = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
        if (!targets.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible) setActive(visible.target.id);
            },
            { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
        );

        targets.forEach((t) => observer.observe(t));
        return () => observer.disconnect();
    }, []);

    /* Lock body scroll while the mobile drawer is open. */
    useEffect(() => {
        if (!isOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, [isOpen]);

    /* Close the drawer on Escape. */
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen]);

    const handleNavigation = useCallback((e, href) => {
        e.preventDefault();
        const element = document.getElementById(href.slice(1));

        setIsOpen(false);
        if (!element) return;

        /**
         * The drawer locks page scroll with `body { overflow: hidden }`, and
         * React only restores that on its next commit — which happens after
         * this handler returns. Calling scrollIntoView here would be issued
         * against a scroll-locked body and silently swallowed, which is
         * exactly why every mobile nav link did nothing.
         *
         * So: release the lock explicitly, then scroll on the next frame.
         * The effect cleanup still runs afterwards and is a harmless no-op.
         */
        requestAnimationFrame(() => {
            document.body.style.overflow = '';
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Keep the hash out of the URL, as the original build did.
            window.history.replaceState(
                null,
                '',
                window.location.pathname + window.location.search,
            );
        });
    }, []);

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-out-expo)]',
                scrolled
                    ? 'border-b border-border bg-background/70 backdrop-blur-2xl backdrop-saturate-150'
                    : 'border-b border-transparent bg-transparent',
            )}
        >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                {/* ---------------------------------------------------------
                    Logo — the original K tile and KORAME. wordmark, kept.
                   --------------------------------------------------------- */}
                <a
                    href="#home"
                    onClick={(e) => handleNavigation(e, '#home')}
                    className="group flex items-center gap-2.5"
                    aria-label="Korame — home"
                >
                    <span className="relative grid size-10 place-items-center overflow-hidden rounded-xl bg-[linear-gradient(135deg,var(--brand-600),var(--brand-500)_50%,var(--cyan-glow))] font-heading text-xl font-bold text-white shadow-[0_6px_20px_-6px_color-mix(in_oklch,var(--brand-500)_80%,transparent)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-105">
                        K
                        {/* Sheen sweep on hover */}
                        <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,oklch(1_0_0/0.45),transparent)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-full" />
                    </span>

                    <span className="font-heading text-2xl font-extrabold tracking-wide text-foreground">
                        KORAME<span className="text-brand-400">.</span>
                    </span>
                </a>

                {/* ---------------------------------------------------------
                    Desktop nav — the active pill is a shared layout element,
                    so it slides between links instead of cross-fading.
                   --------------------------------------------------------- */}
                <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
                    {NAV_LINKS.map((link) => {
                        const isActive = active === link.href.slice(1);
                        return (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleNavigation(e, link.href)}
                                aria-current={isActive ? 'true' : undefined}
                                className={cn(
                                    'relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300',
                                    isActive
                                        ? 'text-foreground'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId={reduced ? undefined : 'nav-pill'}
                                        className="absolute inset-0 -z-10 rounded-full bg-elevate ring-1 ring-border"
                                        transition={springSnap}
                                    />
                                )}
                                {link.name}
                            </a>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    <Button
                        asChild
                        variant="contrast"
                        size="md"
                        className="group hidden sm:inline-flex"
                    >
                        <a href="#audit" onClick={(e) => handleNavigation(e, '#audit')}>
                            Free Website Audit
                            <ArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                    </Button>

                    <button
                        onClick={() => setIsOpen((v) => !v)}
                        className="grid size-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-elevate hover:text-foreground md:hidden"
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
                        className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-2xl md:hidden"
                    >
                        <nav className="flex flex-col gap-1 px-6 py-6" aria-label="Mobile">
                            {NAV_LINKS.map((link, i) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleNavigation(e, link.href)}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ ...springSnap, delay: 0.04 * i }}
                                    className="rounded-xl px-3 py-3 text-lg font-medium text-muted-foreground transition-colors hover:bg-elevate hover:text-foreground"
                                >
                                    {link.name}
                                </motion.a>
                            ))}

                            <Button
                                asChild
                                variant="primary"
                                size="lg"
                                className="mt-3 w-full"
                            >
                                <a href="#audit" onClick={(e) => handleNavigation(e, '#audit')}>
                                    Free Website Audit
                                    <ArrowUpRight />
                                </a>
                            </Button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
