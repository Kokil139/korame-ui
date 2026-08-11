import React, { useState } from 'react';
import { Mail, Globe, Send, CheckCircle, AlertCircle } from 'lucide-react';
import ZoomImage from './ZoomImage';

export default function Contact() {
    const [status, setStatus] = useState({ loading: false, success: false, error: false });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: false });

        const formData = new FormData(e.target);
        // Replace with your Web3Forms access key from https://web3forms.com
        formData.append("access_key", "YOUR_ACCESS_KEY_HERE");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setStatus({ loading: false, success: true, error: false });
                e.target.reset();
                setTimeout(() => setStatus({ loading: false, success: false, error: false }), 5000);
            } else {
                setStatus({ loading: false, success: false, error: true });
            }
        } catch (err) {
            setStatus({ loading: false, success: false, error: true });
        }
    };

    return (
        <section id="contact" className="py-28 px-6 bg-[#0a0c14] border-t border-white/5">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* Header */}
                <div className="text-center space-y-4 gsap-reveal">
                    <span className="text-brand-500 font-semibold tracking-wider uppercase text-sm">Get In Touch</span>
                    <h2 className="text-4xl md:text-6xl font-heading font-bold text-white">Let's Build Something Great.</h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Info & Scroll Zoom Studio Image */}
                    <div className="space-y-8 gsap-reveal">
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Have an idea or need a website overhaul? Send us a message and our team will get back to you within 24 hours.
                        </p>

                        {/* Scroll-Driven Zoom Image */}
                        <div className="relative group">
                            <ZoomImage
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                                alt="Korame Design Studio"
                                mode="scrub"
                                className="h-64 sm:h-80 w-full border border-white/10 shadow-2xl"
                            />
                            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl glass-card text-xs text-gray-300 backdrop-blur-md">
                                <span className="font-semibold text-white">Korame Studio HQ</span> — Crafting pixel-perfect web experiences.
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="p-3 rounded-xl glass-card text-brand-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <span>hello@korame.in</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="p-3 rounded-xl glass-card text-cyan-400">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <span>Worldwide / Remote First</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="glass-card p-8 rounded-3xl gsap-reveal">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Jane Doe"
                                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-brand-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="jane@company.com"
                                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-brand-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Project Scope / Details</label>
                                <textarea
                                    rows="4"
                                    name="message"
                                    required
                                    placeholder="Tell us about your project requirements..."
                                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-brand-500 transition-colors"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status.loading}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {status.loading ? 'Sending...' : 'Send Message'}
                                <Send className="w-4 h-4" />
                            </button>

                            {status.success && (
                                <div className="flex items-center gap-2 text-sm text-green-400 font-semibold pt-2">
                                    <CheckCircle className="w-4 h-4" /> Message delivered successfully! We'll be in touch.
                                </div>
                            )}

                            {status.error && (
                                <div className="flex items-center gap-2 text-sm text-red-400 font-semibold pt-2">
                                    <AlertCircle className="w-4 h-4" /> Something went wrong. Please try again.
                                </div>
                            )}
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}