import React from 'react';
import { Zap, Smartphone } from 'lucide-react';

export default function About() {
    return (
        <section id="about" className="py-28 px-6 relative glow-bg-2">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <div className="space-y-6 gsap-reveal">
                        <div className="text-brand-500 font-semibold tracking-wider uppercase text-sm">About Korame</div>
                        <h2 class="text-4xl md:text-6xl font-heading font-bold text-white leading-tight">
                            Where Aesthetics Meet Engineering Precision.
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Founded on the principle that the web should be both lightning-fast and visually mesmerizing, Korame bridges the gap between creative design agency and technical powerhouse.
                        </p>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            We eliminate bloat, optimize every frame of animation, and handcraft clean frontend architectures designed for speed, SEO dominance, and effortless cross-device compatibility.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4 pt-4">
                            <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-brand-500/20 text-brand-500">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Ultra Performance</h4>
                                    <p className="text-xs text-gray-400 mt-1">Sub-second page load times out of the box.</p>
                                </div>
                            </div>

                            <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Fluid Responsiveness</h4>
                                    <p className="text-xs text-gray-400 mt-1">Perfect UX from 4K displays down to mobiles.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="gsap-reveal relative">
                        <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl"></div>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <span className="text-xs font-mono text-gray-400">STACK_SPEC.JSON</span>
                                    <span className="inline-flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    Production Ready
                  </span>
                                </div>
                                <div className="font-mono text-sm space-y-2 text-indigo-200">
                                    <p className="text-purple-400">const korameEngine = &#123;</p>
                                    <p className="pl-4">framework: <span className="text-yellow-300">'React.js + Vite'</span>,</p>
                                    <p className="pl-4">styling: <span className="text-yellow-300">'Tailwind CSS JIT'</span>,</p>
                                    <p className="pl-4">animations: <span className="text-yellow-300">'GSAP + ScrollTrigger'</span>,</p>
                                    <p className="pl-4">deployment: <span className="text-yellow-300">'Cloud'</span>,</p>
                                    <p className="pl-4">accessibility: <span className="text-yellow-300">'WCAG 2.1 Compliant'</span></p>
                                    <p className="text-purple-400">&#125;;</p>
                                </div>
                                <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-400">
                                    &gt; Ready to scale without dynamic server overhead.
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}