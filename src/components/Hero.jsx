import React, { useLayoutEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
    const comp = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline();
            tl.from('.hero-title-container', { scale: 0.9, opacity: 0, duration: 1, ease: 'power3.out' })
                .from('.hero-sub', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
                .from('.hero-actions', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
                .from('.hero-stats', { opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.4');
        }, comp);

        return () => ctx.revert();
    }, []);

    return (
        <section id="home" ref={comp} className="min-h-[90vh] flex items-center justify-center relative px-6 py-20 glow-bg-1 overflow-hidden">

            {/* Embedded Keyframes for Seamless Lightning Flow Animation */}
            <style>{`
                @keyframes lightningFlow {
                    0% {
                        stroke-dashoffset: 0;
                    }
                    100% {
                        stroke-dashoffset: -1000;
                    }
                }
            `}</style>

            <div className="max-w-5xl mx-auto text-center space-y-8 relative">

                {/* 1. HEADLINE TEXT WITH EXPANDED OVAL & LIGHTNING */}
                <div className="hero-title-container relative inline-block w-full">

                    {/* Elliptical Lightning Container */}
                    <div className="absolute -inset-y-8 sm:-inset-y-12 lg:-inset-y-14 -inset-x-8 sm:-inset-x-16 lg:-inset-x-24 pointer-events-none flex items-center justify-center">

                        {/* Base Ambient Glow Ring */}
                        <div className="absolute inset-0 rounded-[100%] border border-brand-500/35 shadow-[0_0_80px_rgba(99,102,241,0.3)] animate-pulse"></div>

                        {/* SVG Path Lightning Flow Overlay */}
                        <svg className="absolute w-full h-full overflow-visible" viewBox="0 0 1000 400" preserveAspectRatio="none">
                            <defs>
                                {/* Electric Cyan to Purple Gradient */}
                                <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
                                    <stop offset="50%" stopColor="#818cf8" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#c084fc" stopOpacity="1" />
                                </linearGradient>

                                {/* Electric Arc Glow Filter */}
                                <filter id="electricGlow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="6" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Main Electric Beam Pulse Travelling Clockwise */}
                            <path
                                d="M 500,10 A 490,190 0 1,1 499.9,10"
                                fill="none"
                                stroke="url(#lightningGrad)"
                                strokeWidth="4"
                                strokeLinecap="round"
                                filter="url(#electricGlow)"
                                pathLength="1000"
                                strokeDasharray="220 780"
                                style={{
                                    animation: 'lightningFlow 2.8s linear infinite'
                                }}
                            />

                            {/* Secondary Intense White Spark Tracer (Leading Edge Energy) */}
                            <path
                                d="M 500,10 A 490,190 0 1,1 499.9,10"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                filter="url(#electricGlow)"
                                pathLength="1000"
                                strokeDasharray="60 940"
                                style={{
                                    animation: 'lightningFlow 2.8s linear infinite'
                                }}
                            />
                        </svg>
                    </div>

                    {/* Headline Text */}
                    <h1 className="hero-title relative z-10 text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight leading-[1.08] py-4">
                        We Build Web Solutions That <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-indigo-300 to-brand-accent">
                            Captivate & Convert.
                        </span>
                    </h1>
                </div>

                {/* 2. SUBTITLE (POSITIONED CLEARLY BELOW THE GLOWING OVAL) */}
                <p className="hero-sub text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed pt-8 sm:pt-14">
                    Korame engineers high-performance static sites, interactive web applications, and immersive visual journeys tailored for forward-thinking brands.
                </p>

                {/* 3. CTA BUTTONS */}
                <div className="hero-actions flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <a
                        href="#contact"
                        className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2"
                    >
                        Start Your Project
                        <Sparkles className="w-5 h-5" />
                    </a>
                    <a
                        href="#services"
                        className="w-full sm:w-auto px-8 py-4 rounded-full glass-card text-white font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        Explore Work
                    </a>
                </div>

                {/* 4. STATS */}
                <div className="hero-stats pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-white/10">
                    <div>
                        <div className="text-3xl md:text-4xl font-heading font-bold text-white">99.9%</div>
                        <div className="text-sm text-gray-400 mt-1">Uptime & Speed</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-heading font-bold text-white">50+</div>
                        <div className="text-sm text-gray-400 mt-1">Projects Delivered</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-heading font-bold text-white">&lt;100ms</div>
                        <div className="text-sm text-gray-400 mt-1">Interaction Latency</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-heading font-bold text-white">100%</div>
                        <div className="text-sm text-gray-400 mt-1">Client Satisfaction</div>
                    </div>
                </div>

            </div>
        </section>
    );
}