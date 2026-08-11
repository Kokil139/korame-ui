import React from 'react';
import { ShoppingCart, Sparkles, Globe } from 'lucide-react';

export default function Services() {
    const servicesData = [
        {
            icon: <ShoppingCart className="w-5 h-5 text-brand-500" />,
            bg: 'bg-brand-500/20',
            image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=800&auto=format&fit=crop',
            title: 'Full-Stack & E-Commerce',
            desc: 'End-to-end digital solutions from high-converting e-commerce storefronts to scalable web applications with secure payment gateways and smooth checkout flows.',
            tags: ['E-Commerce', 'Full-Stack Apps', 'Payment Integration']
        },
        {
            icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
            bg: 'bg-cyan-500/20',
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
            title: 'Bespoke UI/UX & Motion',
            desc: 'Custom design systems and high-frame-rate GSAP scroll animations tailored to your brand identity, built to captivate visitors and drive conversions.',
            tags: ['Figma Design', 'GSAP Motion', 'Conversion Optimization']
        },
        {
            icon: <Globe className="w-5 h-5 text-purple-400" />,
            bg: 'bg-purple-500/20',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
            title: 'Hosting, Domains & SEO',
            desc: 'Complete technical setup including domain configuration, high-speed cloud hosting, SSL certificates, and built-in SEO optimization for maximum search visibility.',
            tags: ['Domain Setup', 'Cloud Hosting', 'SEO Enabled']
        }
    ];

    return (
        <section id="services" className="py-28 px-6 relative overflow-hidden bg-[#08090d]">

            {/* Embedded Keyframes for Continuous Background Zoom */}
            <style>{`
                @keyframes bgSlowZoom {
                    0% {
                        transform: scale(1);
                    }
                    100% {
                        transform: scale(1.15);
                    }
                }
            `}</style>

            {/* =========================================================
               1. THEMED DARK BACKGROUND IMAGE (DARK & MATCHING)
               ========================================================= */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Dark Abstract Network Nodes Image */}
                <img
                    src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop"
                    alt="Dark Tech Background"
                    className="w-full h-full object-cover opacity-20 filter brightness-75 contrast-125 saturate-50 mix-blend-screen"
                    style={{
                        animation: 'bgSlowZoom 18s ease-in-out infinite alternate'
                    }}
                />

                {/* Ambient Brand Glow Spotlights */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]"></div>

                {/* Dark Gradient Vignette Overlay to blend seamlessly with surrounding sections */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#08090d] via-[#08090d]/80 to-[#08090d]"></div>
            </div>

            {/* =========================================================
               2. MAIN CONTENT & CAPABILITY CARDS
               ========================================================= */}
            <div className="max-w-7xl mx-auto space-y-16 relative z-10">
                <div className="text-center space-y-4 gsap-reveal">
                    <span className="text-brand-500 font-semibold tracking-wider uppercase text-sm">Capabilities</span>
                    <h2 className="text-4xl md:text-6xl font-heading font-bold text-white">What we build for you</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {servicesData.map((item, idx) => (
                        /* Outer GSAP Wrapper */
                        <div key={idx} className="gsap-reveal">
                            <div className="glass-card rounded-3xl overflow-hidden group transform hover:-translate-y-2 hover:scale-[1.03] hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-500/25 transition-all duration-300 ease-out cursor-pointer h-full backdrop-blur-xl bg-[#0c0e17]/80 border border-white/10 flex flex-col">

                                {/* Card Header Image with Zoom on Hover */}
                                <div className="relative h-48 w-full overflow-hidden bg-white/5">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100 filter brightness-90 saturate-90"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e17] via-[#0c0e17]/40 to-transparent"></div>

                                    {/* Floating Icon Badge */}
                                    <div className={`absolute bottom-4 left-6 w-10 h-10 rounded-xl ${item.bg} backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg`}>
                                        {item.icon}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-8 pt-4 space-y-4 flex-1 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-heading font-bold text-white group-hover:text-brand-400 transition-colors duration-300">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {item.tags.map((tag, tIdx) => (
                                            <span
                                                key={tIdx}
                                                className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5 group-hover:border-white/10 transition-colors"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}