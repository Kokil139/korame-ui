import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Zap, ShieldCheck, Menu, ArrowRight, Sparkles } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';
import {
    ScreenBoot,
    BootItem,
    ScreenWake,
    BootProgress,
} from '@/components/motion/ScreenBoot';
import { Badge } from '@/components/ui/badge';

/**
 * Omnichannel device showcase.
 *
 * Rebuilt as a real 3D scene rather than three flat divs: one shared camera
 * (`perspective-far`) on the stage, `preserve-3d` on the rig, and each device
 * placed at a different `translateZ` so parallax between them is produced by
 * the projection itself  the depth is genuine, not faked with offsets.
 *
 * The rig's rotateX eases from tilted to flat as the section scrolls through
 * the viewport, so the hardware appears to stand up to meet the reader.
 */
export default function DeviceShowcase() {
    const ref = useRef(null);
    const reduced = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 0.9', 'end 0.35'],
    });

    const rigRotateX = useTransform(scrollYProgress, [0, 1], [16, 0]);
    const rigScale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
    const phoneZ = useTransform(scrollYProgress, [0, 1], [40, 130]);
    const tabletZ = useTransform(scrollYProgress, [0, 1], [30, 100]);

    const rigStyle = reduced
        ? undefined
        : { rotateX: rigRotateX, scale: rigScale, transformStyle: 'preserve-3d', willChange: 'transform' };

    return (
        <section
            aria-labelledby="devices-heading"
            className="relative overflow-hidden border-y border-border bg-surface-0 px-6 py-24 sm:py-32"
        >
            {/* Ambient blooms */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-[130px]" />
                <div className="absolute right-[8%] top-1/3 size-[320px] rounded-full bg-cyan-glow/10 blur-[110px]" />
            </div>

            <div className="relative mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <Reveal>
                        <Badge>
                            <Zap className="size-3.5" aria-hidden="true" />
                            Omnichannel responsiveness
                        </Badge>
                    </Reveal>

                    <Reveal delay={0.06}>
                        <h2
                            id="devices-heading"
                            className="mt-6 text-balance font-heading text-4xl font-bold tracking-[-0.025em] text-foreground md:text-5xl lg:text-6xl"
                        >
                            Flawless on every{' '}
                            <span className="text-gradient-brand">screen &amp; device</span>.
                        </h2>
                    </Reveal>

                    <Reveal delay={0.12}>
                        <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
                            Korame layouts adapt fluidly across desktop, tablet and mobile
                            with hardware-accelerated motion and sub-second load performance.
                        </p>
                    </Reveal>
                </div>

                {/* =====================================================
                    3D STAGE
                   ===================================================== */}
                <div
                    ref={ref}
                    className="perspective-far relative mt-20 flex min-h-[540px] items-center justify-center sm:min-h-[540px]"
                >
                    {/* The rig spans the full stage width, not just the
                        laptop's  the phone and tablet anchor to its edges, so
                        a narrower rig would park them on top of the laptop
                        screen and cover the content they exist to frame. */}
                    <motion.div
                        style={rigStyle}
                        className="preserve-3d relative flex w-full justify-center"
                    >
                        {/* -------------------------------------------------
                            Laptop  the base plane, z = 0
                           ------------------------------------------------- */}
                        <div className="relative z-10">
                            <div className="relative flex h-[230px] w-[248px] flex-col overflow-hidden rounded-t-2xl border-[6px] border-surface-3 bg-surface-1 shadow-[0_40px_80px_-30px_var(--shadow-tint-strong)] sm:h-[360px] sm:w-[580px] sm:border-[10px] lg:h-[440px] lg:w-[720px]">
                                {/* Browser chrome */}
                                <div className="flex h-6 select-none items-center justify-between border-b border-border bg-surface-2 px-3 sm:h-8">
                                    <div className="flex items-center gap-1.5">
                                        <span className="size-2.5 rounded-full bg-red-500/80" />
                                        <span className="size-2.5 rounded-full bg-amber-500/80" />
                                        <span className="size-2.5 rounded-full bg-emerald-500/80" />
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-md bg-field px-3 py-0.5 font-mono text-[9px] text-muted-foreground sm:text-xs">
                                        <ShieldCheck className="size-3 text-emerald-400" />
                                        https://korame.in
                                    </div>
                                    <span className="w-8" />
                                </div>

                                {/* Screen content  boots like a real page load */}
                                <ScreenBoot base={0.15} className="flex-1 overflow-hidden bg-gradient-to-b from-background to-surface-1 p-4 sm:p-8">
                                    <ScreenWake base={0.15} />
                                    <BootProgress base={0.15} />

                                    <BootItem step={0.35} skeleton className="relative flex items-center justify-between border-b border-border pb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="grid size-5 place-items-center rounded-md bg-brand-500 text-[10px] font-bold text-white">
                                                K
                                            </span>
                                            <span className="font-heading text-xs font-extrabold text-foreground sm:text-sm">
                                                KORAME
                                            </span>
                                        </div>
                                        <div className="hidden items-center gap-4 text-[10px] font-medium text-muted-foreground sm:flex">
                                            <span className="text-foreground">Home</span>
                                            <span>About</span>
                                            <span>Services</span>
                                            <span>Contact</span>
                                        </div>
                                        <span className="rounded-full bg-foreground px-2.5 py-1 text-[9px] font-bold text-background">
                                            Let&apos;s talk
                                        </span>
                                    </BootItem>

                                    <BootItem step={0.55} className="relative mt-5 space-y-2 sm:space-y-3">
                                        <span className="inline-block rounded-full bg-brand-500/20 px-2 py-0.5 text-[9px] font-semibold text-brand-300">
                                            NEXT-GEN FRONTEND
                                        </span>
                                        <p className="font-heading text-sm font-extrabold leading-tight text-foreground sm:text-2xl">
                                            Crafting animated
                                            <br />
                                            <span className="text-gradient-brand">
                                                digital experiences
                                            </span>
                                        </p>
                                        <p className="max-w-sm text-[10px] text-muted-foreground sm:text-xs">
                                            High-performance applications built with React,
                                            Motion and Tailwind.
                                        </p>
                                    </BootItem>

                                    <BootItem step={0.78} className="relative mt-4 grid grid-cols-3 gap-2">
                                        {[
                                            ['99.9%', 'Performance', 'text-foreground'],
                                            ['<100ms', 'Latency', 'text-brand-300'],
                                            ['Zero', 'Server overhead', 'text-cyan-glow'],
                                        ].map(([v, l, tone]) => (
                                            <div
                                                key={l}
                                                className="rounded-lg border border-border bg-elevate p-2"
                                            >
                                                <div className={`text-[9px] font-bold ${tone}`}>
                                                    {v}
                                                </div>
                                                <div className="text-[8px] text-muted-foreground">
                                                    {l}
                                                </div>
                                            </div>
                                        ))}
                                    </BootItem>
                                </ScreenBoot>
                            </div>

                            {/* Hinge / base */}
                            <div className="relative -ml-[16px] flex h-3 w-[292px] items-center justify-center rounded-b-xl border-t border-border bg-[linear-gradient(90deg,var(--surface-3),var(--surface-1),var(--surface-3))] shadow-2xl sm:-ml-[45px] sm:h-[18px] sm:w-[670px] lg:-ml-[50px] lg:w-[820px]">
                                <span className="h-1 w-12 rounded-full bg-elevate-strong sm:w-20" />
                            </div>

                            {/* Contact shadow on the "desk" */}
                            <div
                                aria-hidden="true"
                                className="mx-auto mt-1 h-5 w-[248px] rounded-full bg-brand-500/25 blur-xl sm:w-[600px]"
                            />
                        </div>

                        {/* -------------------------------------------------
                            Tablet  pushed forward in Z, right of the laptop
                           ------------------------------------------------- */}
                        <motion.div
                            style={reduced ? undefined : { translateZ: tabletZ }}
                            className="absolute bottom-6 right-0 z-20 hidden animate-float md:block lg:right-4"
                        >
                            <div className="flex h-[240px] w-[160px] flex-col overflow-hidden rounded-2xl border-[6px] border-surface-3 bg-surface-1 shadow-[0_30px_60px_-20px_var(--shadow-tint-strong)] lg:h-[300px] lg:w-[200px]">
                                <div className="flex h-4 items-center justify-center bg-surface-2">
                                    <span className="size-2 rounded-full bg-black/70" />
                                </div>

                                <ScreenBoot base={0.75} className="flex-1 space-y-3 bg-background p-3">
                                    <ScreenWake base={0.75} />
                                    <BootProgress base={0.75} />

                                    <BootItem step={0.3} skeleton className="flex items-center justify-between border-b border-border pb-2">
                                        <span className="font-heading text-[10px] font-bold text-foreground">
                                            KORAME.
                                        </span>
                                        <span className="rounded bg-brand-500/20 px-1.5 py-0.5 font-mono text-[8px] text-brand-300">
                                            TAB_UI
                                        </span>
                                    </BootItem>

                                    <BootItem step={0.45}>
                                        <p className="text-[10px] font-bold leading-tight text-foreground">
                                            Responsive layouts
                                        </p>
                                    </BootItem>

                                    <BootItem step={0.6} skeleton className="flex h-12 items-center rounded-lg border border-brand-500/30 bg-gradient-to-r from-brand-600/30 to-violet-glow/25 p-2">
                                        <Sparkles className="size-4 text-brand-300" />
                                    </BootItem>

                                    <BootItem step={0.75} className="space-y-1">
                                        <div className="h-1.5 w-3/4 rounded bg-elevate-strong" />
                                        <div className="h-1.5 w-1/2 rounded bg-elevate" />
                                    </BootItem>
                                </ScreenBoot>
                            </div>
                        </motion.div>

                        {/* -------------------------------------------------
                            Phone  furthest forward, left of the laptop
                           ------------------------------------------------- */}
                        {/* animationDelay sits on the element that actually
                            carries animate-float, and is offset so the two
                            devices never bob in lockstep  that sync reads
                            as fake. */}
                        <motion.div
                            style={{
                                animationDelay: '-1.4s',
                                ...(reduced ? null : { translateZ: phoneZ }),
                            }}
                            className="absolute -bottom-32 -left-1 z-30 animate-float sm:bottom-2 sm:left-0 lg:left-4"
                        >
                            <div className="flex h-[168px] w-[104px] flex-col overflow-hidden rounded-[24px] border-[5px] border-surface-3 bg-surface-1 shadow-[0_30px_60px_-20px_var(--shadow-tint-strong)] sm:h-[250px] sm:w-[130px] lg:h-[280px] lg:w-[150px]">
                                <div className="flex h-5 items-center justify-center bg-surface-2">
                                    <span className="h-2 w-8 rounded-full bg-black/80" />
                                </div>

                                <ScreenBoot base={1.25} className="flex-1 space-y-2.5 bg-background p-2.5">
                                    <ScreenWake base={1.25} />
                                    <BootProgress base={1.25} />

                                    <BootItem step={0.28} skeleton className="flex items-center justify-between border-b border-border pb-1.5">
                                        <span className="grid size-3.5 place-items-center rounded bg-brand-500 text-[8px] font-bold text-white">
                                            K
                                        </span>
                                        <Menu className="size-3 text-muted-foreground" />
                                    </BootItem>

                                    <BootItem step={0.42}>
                                        <p className="text-[9px] font-bold leading-tight text-foreground">
                                            Mobile optimised
                                        </p>
                                        <p className="text-[7px] leading-tight text-muted-foreground">
                                            60fps touch transitions
                                        </p>
                                    </BootItem>

                                    <BootItem step={0.56} skeleton className="space-y-1 rounded-lg border border-border bg-elevate p-1.5">
                                        <div className="text-[8px] font-bold text-cyan-glow">
                                            100/100
                                        </div>
                                        <div className="text-[6px] text-muted-foreground">
                                            Lighthouse score
                                        </div>
                                    </BootItem>

                                    <BootItem step={0.7} className="flex items-center justify-center gap-1 rounded-full bg-brand-600 px-2 py-1 text-[7px] font-bold text-white">
                                        Explore
                                        <ArrowRight className="size-2" />
                                    </BootItem>
                                </ScreenBoot>

                                <div className="flex h-3 items-center justify-center bg-background">
                                    <span className="h-0.5 w-10 rounded-full bg-elevate-strong" />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
