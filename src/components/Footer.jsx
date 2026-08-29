import { Link } from 'react-router-dom';
import { useHomeLink } from '@/lib/use-home-link';
import { Mail, Instagram, MessageCircle } from 'lucide-react';
import { SERVICE_LIST, servicePath } from '@/content/service-list';
import { PROJECTS, projectPath } from '@/content/projects';
import { SITE } from '@/lib/site';

/**
 * Footer.
 *
 * This is also the site's internal linking backbone. Every service page and
 * every case study is reachable in one hop from any page on the site, which
 * is the cheapest possible way to make a small site fully crawlable — no
 * page ends up more than two clicks from the homepage.
 *
 * The oversized clipped wordmark is kept from the original build; it is a
 * text node, so it costs nothing.
 */
export default function Footer() {
    const homeLink = useHomeLink();

    const socials = [
        { icon: Mail, label: 'Email Korame', href: `mailto:${SITE.email}` },
        {
            icon: MessageCircle,
            label: 'Korame on WhatsApp',
            href: `https://wa.me/${SITE.whatsapp}`,
            external: true,
        },
        { icon: Instagram, label: 'Korame on Instagram', href: SITE.instagram, external: true },
    ];

    return (
        <footer className="relative overflow-hidden border-t border-border bg-background px-6 pb-10 pt-20">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -bottom-6 select-none text-center font-heading text-[15vw] font-extrabold leading-none tracking-tighter text-ghost"
            >
                KORAME
            </div>

            <div className="relative mx-auto max-w-7xl">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                    {/* Brand */}
                    <div>
                        <Link
                            {...homeLink}
                            className="group inline-flex items-center gap-2.5 rounded-2xl glow-interactive"
                            aria-label="Korame — home"
                        >
                            <span className="grid size-9 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--brand-600),var(--brand-500)_50%,var(--cyan-glow))] font-heading text-lg font-bold text-white transition-transform duration-500 group-hover:scale-105">
                                K
                            </span>
                            <span className="font-heading text-xl font-extrabold tracking-wide text-foreground">
                                KORAME<span className="text-brand-400">.</span>
                            </span>
                        </Link>

                        <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
                            A software engineering studio building websites, web applications,
                            full-stack systems and custom software — designed, built and
                            deployed by the same people.
                        </p>

                        <ul className="mt-6 flex items-center gap-3">
                            {socials.map((s) => (
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

                    {/* Services — the full list, so every service page is one hop away. */}
                    <nav aria-label="Services">
                        <h2 className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">
                            Services
                        </h2>
                        <ul className="mt-5 space-y-3">
                            {SERVICE_LIST.map((s) => (
                                <li key={s.slug}>
                                    <Link
                                        to={servicePath(s.slug)}
                                        className="text-sm text-muted-foreground glow-text hover:text-foreground"
                                    >
                                        {s.nav}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Work + company */}
                    <nav aria-label="Projects and company">
                        <h2 className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">
                            Work
                        </h2>
                        <ul className="mt-5 space-y-3">
                            <li>
                                <Link
                                    to="/projects"
                                    className="text-sm text-muted-foreground glow-text hover:text-foreground"
                                >
                                    All projects
                                </Link>
                            </li>
                            {PROJECTS.map((p) => (
                                <li key={p.slug}>
                                    <Link
                                        to={projectPath(p.slug)}
                                        className="text-sm text-muted-foreground glow-text hover:text-foreground"
                                    >
                                        {p.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <h2 className="mt-8 font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">
                            Company
                        </h2>
                        <ul className="mt-5 space-y-3">
                            {[
                                { name: 'Pricing', href: '/pricing' },
                                { name: 'About', href: '/about' },
                                { name: 'Free website audit', href: '/free-website-audit' },
                                { name: 'Blog', href: '/blog' },
                                { name: 'Contact', href: '/contact' },
                            ].map((l) => (
                                <li key={l.href}>
                                    <Link
                                        to={l.href}
                                        className="text-sm text-muted-foreground glow-text hover:text-foreground"
                                    >
                                        {l.name}
                                    </Link>
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
                                    href={`mailto:${SITE.email}`}
                                    className="transition-colors hover:text-foreground"
                                >
                                    {SITE.email}
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`tel:${SITE.phone.replace(/-/g, '')}`}
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
                    <p>&copy; {new Date().getFullYear()} Korame. All rights reserved.</p>
                    <p>A digital experience by Korame.</p>
                </div>
            </div>
        </footer>
    );
}
