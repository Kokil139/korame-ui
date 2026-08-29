import { useState } from 'react';
import {
    Mail,
    Globe,
    Send,
    CheckCircle2,
    AlertCircle,
    MessageCircle,
    Instagram,
    Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import Aurora from '@/components/motion/Aurora';
import Magnetic from '@/components/motion/Magnetic';
import TileImage from '@/components/motion/TileImage';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label } from '@/components/ui/input';

const WEB3FORMS_KEY = 'beecaf36-e033-44d4-8b17-abbf268a7c05';

const CHANNELS = [
    {
        icon: Mail,
        tone: 'text-brand-300',
        label: 'letsbuild@korame.in',
        href: 'mailto:letsbuild@korame.in',
    },
    {
        icon: MessageCircle,
        tone: 'text-emerald-400',
        label: 'Chat with us on WhatsApp',
        href: 'https://wa.me/918826030869?text=Hello!!%20I%20would%20like%20to%20know%20more%20about%20your%20services.',
        external: true,
    },
    {
        icon: Instagram,
        tone: 'text-pink-400',
        label: 'Follow us on Instagram',
        href: 'https://www.instagram.com/korame.in/',
        external: true,
    },
    {
        icon: Globe,
        tone: 'text-cyan-glow',
        label: 'Worldwide / remote first',
    },
];

/**
 * The contact section.
 *
 * Used twice: as the closing section of the homepage, and as the body of
 * /contact. On the dedicated page the <h1> belongs to <PageHero>, so
 * `hideHeader` suppresses this section's own heading block rather than
 * shipping a second competing headline — two H-level headings saying the same
 * thing is a heading-hierarchy problem, not just a visual one.
 *
 * `defaultMessage` is how the free audit hands its result across. When the
 * audit tool is on this same document it writes into the field directly; from
 * /free-website-audit it cannot, so it navigates here with the message in
 * router state and <ContactPage> passes it down.
 */
export default function Contact({ hideHeader = false, defaultMessage = '' }) {
    const [status, setStatus] = useState('idle'); // idle | loading | success | error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.target);
        formData.append('access_key', WEB3FORMS_KEY);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.success) {
                setStatus('success');
                e.target.reset();
                setTimeout(() => setStatus('idle'), 6000);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <section
            id="contact"
            className="relative overflow-hidden border-t border-border bg-surface-0 px-6 py-28 sm:py-36"
        >
            <Aurora intensity="soft" />

            <div className="relative mx-auto max-w-6xl">
                {!hideHeader && (
                    <div className="mx-auto max-w-2xl text-center">
                        <Reveal>
                            <Badge>Get in touch</Badge>
                        </Reveal>

                        <Reveal delay={0.06}>
                            <h2 className="mt-6 text-balance font-heading text-4xl font-bold tracking-[-0.025em] text-foreground md:text-5xl lg:text-6xl">
                                Let&apos;s build something{' '}
                                <span className="text-gradient-brand">great</span>.
                            </h2>
                        </Reveal>

                        <Reveal delay={0.12}>
                            <p className="mt-5 text-pretty text-lg text-muted-foreground">
                                Have an idea, or a site that needs an overhaul? Send us a message
                                and we&apos;ll come back to you within 24 hours.
                            </p>
                        </Reveal>
                    </div>
                )}

                <div className="grid gap-12 pt-16 lg:grid-cols-2 lg:items-start">
                    {/* -------------------------------------------------
                        Left: channels + studio panel
                       ------------------------------------------------- */}
                    <div className="space-y-8">
                        <Reveal>
                            <TiltCard intensity={6} lift={10}>
                                <Card className="relative overflow-hidden p-0">
                                    <TileImage
                                        name="studio"
                                        alt="Korame studio — layered interface panels caught in a light beam"
                                        className="h-56 sm:h-64"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        scrim={false}
                                        parallax={30}
                                    />

                                    <div className="border-t border-border p-5 text-sm">
                                        <span className="font-semibold text-foreground">
                                            Korame Studio
                                        </span>
                                        <span className="text-muted-foreground">
                                            {' '}
                                            — crafting pixel-perfect web experiences.
                                        </span>
                                    </div>
                                </Card>
                            </TiltCard>
                        </Reveal>

                        <ul className="space-y-3">
                            {CHANNELS.map((channel, i) => {
                                const inner = (
                                    <>
                                        <span
                                            className={`grid size-12 shrink-0 place-items-center rounded-xl glass ${channel.tone} transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-105`}
                                        >
                                            <channel.icon className="size-5" aria-hidden="true" />
                                        </span>
                                        <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                                            {channel.label}
                                        </span>
                                    </>
                                );

                                return (
                                    <li key={channel.label}>
                                        <Reveal delay={0.05 * i}>
                                            {channel.href ? (
                                                <a
                                                    href={channel.href}
                                                    {...(channel.external
                                                        ? {
                                                              target: '_blank',
                                                              rel: 'noopener noreferrer',
                                                          }
                                                        : null)}
                                                    className="group flex items-center gap-4 rounded-2xl p-1"
                                                >
                                                    {inner}
                                                </a>
                                            ) : (
                                                <div className="group flex items-center gap-4 p-1">
                                                    {inner}
                                                </div>
                                            )}
                                        </Reveal>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* -------------------------------------------------
                        Right: form
                       ------------------------------------------------- */}
                    <Reveal delay={0.1} y={36}>
                        <Card lit={false} className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6" noValidate={false}>
                                {/* Honeypot — bots fill it, humans never see it. */}
                                <input
                                    type="checkbox"
                                    name="botcheck"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    className="hidden"
                                    aria-hidden="true"
                                />

                                <div>
                                    <Label htmlFor="contact-name">Your name</Label>
                                    <Input
                                        id="contact-name"
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="James Bond"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="contact-email">Email address</Label>
                                    <Input
                                        id="contact-email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="james@company.com"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="contact-phone">Contact number</Label>
                                    <Input
                                        id="contact-phone"
                                        name="contactNo"
                                        type="tel"
                                        required
                                        inputMode="numeric"
                                        autoComplete="tel"
                                        placeholder="9899999999"
                                        maxLength={10}
                                        pattern="[0-9]{10}"
                                        aria-describedby="contact-phone-hint"
                                        title="Please enter a valid 10-digit contact number"
                                        onInput={(e) => {
                                            // Digits only, capped at 10.
                                            e.currentTarget.value = e.currentTarget.value
                                                .replace(/\D/g, '')
                                                .slice(0, 10);
                                        }}
                                    />
                                    <p
                                        id="contact-phone-hint"
                                        className="mt-2 text-xs text-muted-foreground"
                                    >
                                        Enter a 10-digit contact number.
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="contact-message">
                                        Project scope / details
                                    </Label>
                                    {/* `defaultValue` rather than `value`: the
                                        field stays uncontrolled so the audit
                                        handoff can also write to it directly
                                        via the DOM when both are on the
                                        homepage. `key` forces a remount when a
                                        prefill arrives from another route,
                                        because React ignores a changed
                                        defaultValue on an existing input. */}
                                    <Textarea
                                        key={defaultMessage || 'blank'}
                                        id="contact-message"
                                        name="message"
                                        rows={4}
                                        required
                                        defaultValue={defaultMessage}
                                        placeholder="Tell us about your project requirements..."
                                    />
                                </div>

                                <Magnetic className="w-full" strength={0.12}>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        disabled={status === 'loading'}
                                        className="w-full"
                                    >
                                        {status === 'loading' ? (
                                            <>
                                                Sending
                                                <Loader2 className="animate-spin" />
                                            </>
                                        ) : (
                                            <>
                                                Send message
                                                <Send />
                                            </>
                                        )}
                                    </Button>
                                </Magnetic>

                                {/* Status is announced politely so a screen
                                    reader hears the result without stealing
                                    focus from the form. */}
                                <div aria-live="polite" aria-atomic="true">
                                    <AnimatePresence mode="wait">
                                        {status === 'success' && (
                                            <motion.p
                                                key="success"
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                className="flex items-center gap-2 text-sm font-medium text-emerald-400"
                                            >
                                                <CheckCircle2 className="size-4 shrink-0" />
                                                Message delivered. We&apos;ll be in touch shortly.
                                            </motion.p>
                                        )}

                                        {status === 'error' && (
                                            <motion.p
                                                key="error"
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                className="flex items-center gap-2 text-sm font-medium text-destructive"
                                            >
                                                <AlertCircle className="size-4 shrink-0" />
                                                Something went wrong. Please try again, or email
                                                us directly.
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </form>
                        </Card>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
