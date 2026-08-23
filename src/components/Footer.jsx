import { ArrowUp, Mail, Instagram, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
    { name: 'About', href: '#about' },
    { name: 'Process', href: '#process' },
    { name: 'Services', href: '#services' },
    { name: 'Work', href: '#work' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Free audit', href: '#audit' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
];

const SOCIALS = [
    { icon: Mail, label: 'Email Korame', href: 'mailto:letsbuild@korame.in' },
    {
        icon: MessageCircle,
        label: 'Korame on WhatsApp',
        href: 'https://wa.me/918826030869',
        external: true,
    },
    {
        icon: Instagram,
        label: 'Korame on Instagram',
        href: 'https://www.instagram.com/korame.in/',
        external: true,
    },
];

export default function Footer() {
    const scrollTo = (e, href) => {
        e.preventDefault();
        const el = document.getElementById(href.slice(1));
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
    };

    return (
        <footer className="relative overflow-hidden border-t border-border bg-background px-6 pb-10 pt-20">
            {/* Oversized wordmark, clipped by the section — a wide-canvas
                signature that costs nothing but a text node. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -bottom-6 select-none text-center font-heading text-[15vw] font-extrabold leading-none tracking-tighter text-ghost"
            >
                KORAME
            </div>

            <div className="relative mx-auto max-w-7xl">
                <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
                    {/* Brand */}
                    <div>
                        <a
                            href="#home"
                            onClick={(e) => scrollTo(e, '#home')}
                            className="group inline-flex items-center gap-2.5"
                        >
                            <span className="grid size-9 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--brand-600),var(--brand-500)_50%,var(--cyan-glow))] font-heading text-lg font-bold text-white transition-transform duration-500 group-hover:scale-105">
                                K
                            </span>
                            <span className="font-heading text-xl font-extrabold tracking-wide text-foreground">
                                KORAME<span className="text-brand-400">.</span>
                            </span>
                        </a>

                        <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
                            A web studio building high-performance websites and AI-powered
                            applications that captivate visitors and convert them into
                            customers.
                        </p>

                        <ul className="mt-6 flex items-center gap-3">
                            {SOCIALS.map((s) => (
                                <li key={s.label}>
                                    <a
                                        href={s.href}
                                        aria-label={s.label}
                                        {...(s.external
                                            ? { target: '_blank', rel: 'noopener noreferrer' }
                                            : null)}
                                        className="grid size-10 place-items-center rounded-xl glass text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:text-foreground"
                                    >
                                        <s.icon className="size-4" aria-hidden="true" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Navigate */}
                    <nav aria-label="Footer">
                        <h2 className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">
                            Navigate
                        </h2>
                        <ul className="mt-5 space-y-3">
                            {NAV.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => scrollTo(e, link.href)}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Contact */}
                    <div>
                        <h2 className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">
                            Contact
                        </h2>
                        <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                            <li>
                                <a
                                    href="mailto:letsbuild@korame.in"
                                    className="transition-colors hover:text-foreground"
                                >
                                    letsbuild@korame.in
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+918826030869"
                                    className="transition-colors hover:text-foreground"
                                >
                                    +91 88260 30869
                                </a>
                            </li>
                            <li>Worldwide / remote first</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
                    <p>
                        &copy; {new Date().getFullYear()} Korame Web Agency. All rights
                        reserved.
                    </p>

                    <button
                        onClick={(e) => scrollTo(e, '#home')}
                        className={cn(
                            'group inline-flex items-center gap-2 rounded-full px-4 py-2',
                            'transition-colors hover:bg-elevate hover:text-foreground',
                        )}
                    >
                        Back to top
                        <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                    </button>
                </div>
            </div>
        </footer>
    );
}
