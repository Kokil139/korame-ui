import React from 'react';
import { Sparkles, Zap, ShieldCheck, Menu, ArrowRight } from 'lucide-react';

export default function DeviceShowcase() {
    return (
        <section className="py-24 px-6 relative overflow-hidden bg-[#05060a] border-y border-white/5">

            {/* Background Ambient Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-16">

                {/* Section Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto gsap-reveal">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 text-xs font-semibold uppercase tracking-widest border border-brand-500/20">
                        <Zap className="w-3.5 h-3.5" /> Omnichannel Responsiveness
                    </div>
                    <h2 className="text-4xl md:text-6xl font-heading font-bold text-white">
                        Flawless on Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-indigo-300 to-brand-accent">Screen & Device.</span>
                    </h2>
                    <p className="text-gray-400 text-base md:text-lg">
                        Korame layouts fluidly adapt across desktop, tablet, and mobile viewports with hardware-accelerated animations and sub-second load performance.
                    </p>
                </div>

                {/* MULTI-DEVICE SHOWCASE CONTAINER */}
                <div className="relative pt-8 pb-12 flex items-center justify-center min-h-[480px] sm:min-h-[580px]">

                    {/* =========================================================
             1. LAPTOP MOCKUP (CENTER / MAIN STAGE)
             ========================================================= */}
                    <div className="relative z-10 transform hover:scale-[1.03] transition-transform duration-500 cursor-pointer">

                        {/* Screen Frame */}
                        <div className="w-[320px] sm:w-[580px] lg:w-[720px] h-[210px] sm:h-[360px] lg:h-[440px] bg-[#0c0e17] rounded-t-2xl border-[6px] sm:border-[10px] border-[#1e202e] hover:border-brand-500/40 transition-colors duration-500 shadow-2xl relative overflow-hidden flex flex-col">

                            {/* Laptop Screen Top Bar */}
                            <div className="h-6 sm:h-8 bg-[#141622] px-3 flex items-center justify-between border-b border-white/5 select-none">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                                </div>
                                <div className="px-3 py-0.5 rounded-md bg-black/40 text-[9px] sm:text-xs text-gray-400 font-mono flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-green-400" />
                                    https://korame.in
                                </div>
                                <div className="w-8"></div>
                            </div>

                            {/* Laptop Screen Content Preview */}
                            <div className="flex-1 p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-hidden relative bg-gradient-to-b from-[#08090d] to-[#0c0e18]">

                                {/* Animated Scanner Ray */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/5 to-transparent animate-pulse pointer-events-none"></div>

                                {/* Simulated Mini Nav */}
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-md bg-brand-500 flex items-center justify-center font-bold text-[10px] text-white">K</div>
                                        <span className="font-heading font-extrabold text-xs sm:text-sm text-white">KORAME</span>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-4 text-[10px] text-gray-400 font-medium">
                                        <span className="text-white">Home</span>
                                        <span>About</span>
                                        <span>Services</span>
                                        <span>Contact</span>
                                    </div>
                                    <div className="px-2.5 py-1 rounded-full bg-white text-black font-bold text-[9px]">Let's Talk</div>
                                </div>

                                {/* Simulated Hero */}
                                <div className="space-y-2 sm:space-y-3 pt-2 text-center sm:text-left">
                                    <div className="inline-block px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-[9px] font-semibold">
                                        NEXT-GEN FRONTEND
                                    </div>
                                    <h3 className="text-sm sm:text-2xl font-heading font-extrabold text-white leading-tight">
                                        Crafting Animated <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-cyan-400">Digital Experiences</span>
                                    </h3>
                                    <p className="text-[10px] sm:text-xs text-gray-400 max-w-sm">
                                        High-performance static applications built with React, GSAP, and Tailwind.
                                    </p>
                                </div>

                                {/* Mini Cards Grid */}
                                <div className="grid grid-cols-3 gap-2 pt-2">
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[9px]">
                                        <div className="font-bold text-white">99.9%</div>
                                        <div className="text-[8px] text-gray-400">Performance</div>
                                    </div>
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[9px]">
                                        <div className="font-bold text-brand-400">&lt;100ms</div>
                                        <div className="text-[8px] text-gray-400">Latency</div>
                                    </div>
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[9px]">
                                        <div className="font-bold text-cyan-400">Zero</div>
                                        <div className="text-[8px] text-gray-400">Server Overhead</div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Laptop Base Keyboard */}
                        <div className="w-[370px] sm:w-[670px] lg:w-[820px] -ml-[25px] sm:-ml-[45px] lg:-ml-[50px] h-[12px] sm:h-[18px] bg-gradient-to-r from-[#2a2c3d] via-[#1a1c28] to-[#2a2c3d] rounded-b-xl border-t border-white/10 shadow-2xl flex items-center justify-center relative">
                            <div className="w-12 sm:w-20 h-1 bg-gray-600 rounded-full"></div>
                        </div>

                        {/* Laptop Base Reflection Shadow */}
                        <div className="w-[320px] sm:w-[600px] h-4 bg-brand-500/20 blur-xl mx-auto mt-1 rounded-full"></div>
                    </div>

                    {/* =========================================================
             2. TABLET MOCKUP (RIGHT SIDE - FLOATING + HOVER ZOOM)
             ========================================================= */}
                    <div className="absolute right-2 sm:right-6 lg:right-12 bottom-4 sm:bottom-10 z-20 animate-[float_6s_ease-in-out_infinite] hidden md:block">
                        <div className="transform hover:scale-110 transition-transform duration-500 cursor-pointer">
                            <div className="w-[160px] lg:w-[200px] h-[240px] lg:h-[300px] bg-[#0c0e17] rounded-2xl border-[6px] border-[#1e202e] hover:border-brand-500/50 transition-colors duration-500 shadow-2xl overflow-hidden flex flex-col relative group">

                                {/* Tablet Camera Notch */}
                                <div className="h-4 bg-[#141622] flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                                </div>

                                {/* Tablet Screen Content */}
                                <div className="flex-1 p-3 space-y-3 bg-[#08090d]">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                        <span className="font-heading font-bold text-[10px] text-white">KORAME.</span>
                                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 font-mono">TAB_UI</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-[10px] font-bold text-white leading-tight">Responsive Layouts</div>
                                        <div className="w-full h-12 rounded-lg bg-gradient-to-r from-brand-600/30 to-purple-600/30 border border-brand-500/30 p-2 flex items-center">
                                            <Sparkles className="w-4 h-4 text-brand-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="h-1.5 w-3/4 bg-white/20 rounded"></div>
                                        <div className="h-1.5 w-1/2 bg-white/10 rounded"></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* =========================================================
             3. MOBILE PHONE MOCKUP (LEFT SIDE - FLOATING + HOVER ZOOM)
             ========================================================= */}
                    <div className="absolute left-2 sm:left-6 lg:left-12 bottom-2 sm:bottom-8 z-30 animate-[float_5s_ease-in-out_infinite_1s]">
                        <div className="transform hover:scale-110 transition-transform duration-500 cursor-pointer">
                            <div className="w-[110px] sm:w-[130px] lg:w-[150px] h-[210px] sm:h-[250px] lg:h-[280px] bg-[#0c0e17] rounded-[24px] border-[5px] border-[#1e202e] hover:border-brand-500/50 transition-colors duration-500 shadow-2xl overflow-hidden flex flex-col relative">

                                {/* Dynamic Island / Speaker */}
                                <div className="h-5 bg-[#141622] flex items-center justify-center">
                                    <div className="w-8 h-2 rounded-full bg-black/80"></div>
                                </div>

                                {/* Mobile Screen Content */}
                                <div className="flex-1 p-2.5 space-y-2.5 bg-[#08090d] text-left">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                                        <div className="w-3.5 h-3.5 rounded bg-brand-500 flex items-center justify-center font-bold text-[8px] text-white">K</div>
                                        <Menu className="w-3 h-3 text-gray-400" />
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-[9px] font-bold text-white leading-tight">Mobile Optimized</div>
                                        <div className="text-[7px] text-gray-400 leading-tight">60FPS touch transitions</div>
                                    </div>

                                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 space-y-1">
                                        <div className="text-[8px] font-bold text-cyan-400">100/100</div>
                                        <div className="text-[6px] text-gray-400">Lighthouse Score</div>
                                    </div>

                                    <div className="py-1 px-2 rounded-full bg-brand-600 text-white font-bold text-[7px] text-center flex items-center justify-center gap-1">
                                        <span>Explore</span>
                                        <ArrowRight className="w-2 h-2" />
                                    </div>
                                </div>

                                {/* Home Bar Indicator */}
                                <div className="h-3 bg-[#08090d] flex items-center justify-center">
                                    <div className="w-10 h-0.5 bg-white/30 rounded-full"></div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}