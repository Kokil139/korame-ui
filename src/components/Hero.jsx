import React, { useLayoutEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
    const comp = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from('.hero-title-container', {
                scale: 0.9,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            })
                .from(
                    '.hero-sub',
                    {
                        y: 20,
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power3.out'
                    },
                    '-=0.6'
                )
                .from(
                    '.hero-actions',
                    {
                        y: 20,
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power3.out'
                    },
                    '-=0.6'
                )
                .from(
                    '.hero-stats',
                    {
                        opacity: 0,
                        duration: 1,
                        ease: 'power3.out'
                    },
                    '-=0.4'
                );
        }, comp);

        return () => ctx.revert();
    }, []);

    // Scroll to a section without adding #section to the URL
    const scrollToSection = (id) => {
        const element = document.getElementById(id);

        if (!element) return;

        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        window.history.replaceState(
            null,
            '',
            window.location.pathname + window.location.search
        );
    };

    return (
        <section
            id="home"
            ref={comp}
            className="
                min-h-[90vh]
                flex
                items-center
                justify-center
                relative
                px-6
                py-20
                glow-bg-1
                overflow-hidden
            "
        >
            {/* Lightning animation */}
            <style>{`
                @keyframes lightningFlow {
                    0% {
                        stroke-dashoffset: 0;
                    }

                    100% {
                        stroke-dashoffset: -1000;
                    }
                }

                .hero-lightning-main {
                    animation: lightningFlow 3.2s linear infinite;
                }

                .hero-lightning-spark {
                    animation: lightningFlow 3.2s linear infinite;
                }

                /*
                 * Mobile optimization:
                 * Slower animation = less visual work over time.
                 */
                @media (max-width: 640px) {
                    .hero-lightning-main {
                        animation-duration: 4s;
                    }

                    .hero-lightning-spark {
                        animation-duration: 4s;
                    }

                    .hero-ambient-ring {
                        box-shadow: 0 0 45px rgba(99, 102, 241, 0.22);
                    }
                }

                /*
                 * Accessibility:
                 * Disable continuous animation when the user
                 * has requested reduced motion.
                 */
                @media (prefers-reduced-motion: reduce) {
                    .hero-lightning-main,
                    .hero-lightning-spark {
                        animation: none !important;
                    }
                }
            `}</style>

            <div className="max-w-5xl mx-auto text-center space-y-8 relative">

                {/* =========================================
                    HERO TITLE + GLOWING OVAL
                ========================================== */}

                <div className="hero-title-container relative inline-block w-full">

                    {/* Glowing Oval */}
                    <div
                        className="
                            absolute
                            -inset-y-8
                            sm:-inset-y-12
                            lg:-inset-y-14
                            -inset-x-8
                            sm:-inset-x-16
                            lg:-inset-x-24
                            pointer-events-none
                            flex
                            items-center
                            justify-center
                        "
                    >

                        {/* Ambient Glow Ring */}
                        <div
                            className="
                                hero-ambient-ring
                                absolute
                                inset-0
                                rounded-[100%]
                                border
                                border-brand-500/35
                                shadow-[0_0_55px_rgba(99,102,241,0.25)]
                                sm:shadow-[0_0_80px_rgba(99,102,241,0.3)]
                            "
                        />

                        {/* SVG LIGHTNING */}
                        <svg
                            className="
                                absolute
                                w-full
                                h-full
                                overflow-visible
                            "
                            viewBox="0 0 1000 400"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <defs>
                                <linearGradient
                                    id="lightningGrad"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#38bdf8"
                                    />

                                    <stop
                                        offset="50%"
                                        stopColor="#818cf8"
                                    />

                                    <stop
                                        offset="100%"
                                        stopColor="#c084fc"
                                    />
                                </linearGradient>
                            </defs>

                            {/* MAIN ELECTRIC BEAM */}
                            <path
                                className="hero-lightning-main"
                                d="M 500,10 A 490,190 0 1,1 499.9,10"
                                fill="none"
                                stroke="url(#lightningGrad)"
                                strokeWidth="4"
                                strokeLinecap="round"
                                pathLength="1000"
                                strokeDasharray="220 780"
                            />

                            {/* WHITE ENERGY SPARK */}
                            <path
                                className="hero-lightning-spark"
                                d="M 500,10 A 490,190 0 1,1 499.9,10"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="2"
                                strokeLinecap="round"
                                pathLength="1000"
                                strokeDasharray="45 955"
                            />
                        </svg>
                    </div>

                    {/* HEADLINE */}
                    <h1
                        className="
                            hero-title
                            relative
                            z-10
                            text-5xl
                            md:text-7xl
                            lg:text-8xl
                            font-heading
                            font-extrabold
                            tracking-tight
                            leading-[1.08]
                            py-4
                        "
                    >
                        We Build Web Solutions That{' '}
                        <br className="hidden sm:inline" />

                        <span
                            className="
                                text-transparent
                                bg-clip-text
                                bg-gradient-to-r
                                from-brand-500
                                via-indigo-300
                                to-brand-accent
                            "
                        >
                            Captivate & Convert.
                        </span>
                    </h1>
                </div>

                {/* SUBTITLE */}
                <p
                    className="
                        hero-sub
                        text-lg
                        md:text-2xl
                        text-gray-400
                        max-w-3xl
                        mx-auto
                        font-light
                        leading-relaxed
                        pt-8
                        sm:pt-14
                    "
                >
                    Korame engineers high-performance static sites,
                    interactive web applications, and immersive visual
                    journeys tailored for forward-thinking brands.
                </p>

                {/* CTA BUTTONS */}
                <div
                    className="
                        hero-actions
                        flex
                        flex-col
                        sm:flex-row
                        items-center
                        justify-center
                        gap-4
                        pt-2
                    "
                >
                    {/* Start Your Project */}
                    <button
                        type="button"
                        onClick={() => scrollToSection('contact')}
                        className="
                            w-full
                            sm:w-auto
                            px-8
                            py-4
                            rounded-full
                            bg-gradient-to-r
                            from-brand-600
                            to-brand-500
                            text-white
                            font-bold
                            text-lg
                            hover:opacity-90
                            transition-all
                            shadow-xl
                            shadow-brand-500/25
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >
                        Start Your Project

                        <Sparkles className="w-5 h-5" />
                    </button>

                    {/* Explore Work */}
                    <button
                        type="button"
                        onClick={() => scrollToSection('services')}
                        className="
                            w-full
                            sm:w-auto
                            px-8
                            py-4
                            rounded-full
                            glass-card
                            text-white
                            font-semibold
                            text-lg
                            hover:bg-white/10
                            transition-all
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >
                        Explore Work
                    </button>
                </div>

                {/* STATS */}
                <div
                    className="
                        hero-stats
                        pt-16
                        grid
                        grid-cols-2
                        md:grid-cols-4
                        gap-6
                        max-w-4xl
                        mx-auto
                        border-t
                        border-white/10
                    "
                >
                    <div>
                        <div
                            className="
                                text-3xl
                                md:text-4xl
                                font-heading
                                font-bold
                                text-white
                            "
                        >
                            99.9%
                        </div>

                        <div className="text-sm text-gray-400 mt-1">
                            Uptime & Speed
                        </div>
                    </div>

                    <div>
                        <div
                            className="
                                text-3xl
                                md:text-4xl
                                font-heading
                                font-bold
                                text-white
                            "
                        >
                            50+
                        </div>

                        <div className="text-sm text-gray-400 mt-1">
                            Projects Delivered
                        </div>
                    </div>

                    <div>
                        <div
                            className="
                                text-3xl
                                md:text-4xl
                                font-heading
                                font-bold
                                text-white
                            "
                        >
                            &lt;100ms
                        </div>

                        <div className="text-sm text-gray-400 mt-1">
                            Interaction Latency
                        </div>
                    </div>

                    <div>
                        <div
                            className="
                                text-3xl
                                md:text-4xl
                                font-heading
                                font-bold
                                text-white
                            "
                        >
                            100%
                        </div>

                        <div className="text-sm text-gray-400 mt-1">
                            Client Satisfaction
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}