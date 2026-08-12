import React, { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', target: 'home' },
        { name: 'About', target: 'about' },
        { name: 'Vision', target: 'vision' },
        { name: 'Services', target: 'services' },
        { name: 'Reviews', target: 'reviews' },
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);

        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }

        setIsOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-[#08090d]/80 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}
                <button
                    onClick={() => scrollToSection('home')}
                    className="flex items-center gap-2 group"
                    aria-label="Go to Home"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-accent flex items-center justify-center font-heading font-bold text-white text-xl shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                        K
                    </div>

                    <span className="font-heading font-extrabold text-2xl tracking-wider text-white">
                        KORAME<span className="text-brand-500">.</span>
                    </span>
                </button>

                {/* Desktop Links */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-gray-300">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => scrollToSection(link.target)}
                            className="hover:text-white transition-colors"
                        >
                            {link.name}
                        </button>
                    ))}
                </nav>

                {/* Action Button & Toggle */}
                <div className="flex items-center gap-4">

                    {/* Let's Talk */}
                    <button
                        onClick={() => scrollToSection('contact')}
                        className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-all hover:shadow-lg hover:shadow-white/10"
                    >
                        <span>Let's Talk</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </button>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-gray-300 hover:text-white"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="md:hidden bg-[#0d0f17] border-b border-white/10 px-6 py-6 flex flex-col gap-4 text-gray-300">

                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => scrollToSection(link.target)}
                            className="text-lg py-1 text-left hover:text-white"
                        >
                            {link.name}
                        </button>
                    ))}

                    <button
                        onClick={() => scrollToSection('contact')}
                        className="text-lg py-2 text-left text-brand-500 font-bold"
                    >
                        Contact Us &rarr;
                    </button>

                </div>
            )}
        </header>
    );
}