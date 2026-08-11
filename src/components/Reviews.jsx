import React from 'react';
import { Star } from 'lucide-react';

export default function Reviews() {
    const reviews = [
        {
            quote: "Korame completely reshaped our online brand. The animation details blew our investors away and our bounce rate dropped by 45% immediately.",
            name: "Alex Rivera",
            title: "CEO, Nexus AI Studio",
            initials: "AR",
            gradient: "from-purple-500 to-indigo-500"
        },
        {
            quote: "The execution speed and fluid animations are unmatched. Hosting on GitHub Pages saved us thousands in hosting while maintaining 100/100 Lighthouse scores.",
            name: "Sarah Chen",
            title: "Founder, Solana Pay",
            initials: "SK",
            gradient: "from-cyan-500 to-blue-500"
        },
        {
            quote: "Working with Korame was smooth from day one. Responsive, detail-oriented, and genuinely passionate about modern frontend technology.",
            name: "Marcus Vance",
            title: "Product Lead, Elevate Tech",
            initials: "MD",
            gradient: "from-brand-500 to-pink-500"
        }
    ];

    return (
        <section id="reviews" className="py-28 px-6 glow-bg-1">
            <div className="max-w-7xl mx-auto space-y-16">
                <div className="gsap-reveal">
                    <span className="text-brand-500 font-semibold tracking-wider uppercase text-sm">Client Feedback</span>
                    <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mt-2">What Founders Say</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((rev, i) => (
                        <div key={i} className="glass-card p-8 rounded-3xl space-y-6 gsap-reveal">
                            <div className="flex items-center gap-1 text-yellow-400">
                                {[...Array(5)].map((_, s) => (
                                    <Star key={s} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-300 leading-relaxed text-sm italic">"{rev.quote}"</p>
                            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${rev.gradient} flex items-center justify-center font-bold text-white text-sm`}>
                                    {rev.initials}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                                    <p className="text-xs text-gray-400">{rev.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}