import React from 'react';

export default function Vision() {
    return (
        <section id="vision" className="py-28 px-6 bg-[#0a0c14] border-y border-white/5">
            <div className="max-w-5xl mx-auto text-center space-y-10 gsap-reveal">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 text-xs font-semibold uppercase tracking-widest">
                    Our Core Vision
                </div>
                <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-white leading-tight">
                    "Websites Should Not Just Be Visited. They Should Be <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-500">Experienced.</span>"
                </h2>
                <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-4xl mx-auto">
                    We envision a web devoid of slow-loading templates, clunky animations, and uninspired interfaces. Korame exists to craft distinctive digital identities that leave lasting impressions and drive real economic outcomes for our clients.
                </p>
            </div>
        </section>
    );
}