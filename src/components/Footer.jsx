import React from 'react';

export default function Footer() {

    const scrollToHome = () => {
        const element = document.getElementById('home');

        if (!element) return;

        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });

        window.history.replaceState(
            null,
            '',
            window.location.pathname + window.location.search
        );
    };

    return (
        <footer className="border-t border-white/10 py-12 px-6 bg-[#050508]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">

                <div className="flex items-center gap-2 font-heading font-bold text-white">
                    <span>
                        KORAME<span className="text-brand-500">.</span>
                    </span>

                    <span className="text-xs text-gray-500 font-normal">
                        &copy; 2026 Korame Web Agency. All rights reserved.
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={scrollToHome}
                        className="hover:text-white transition-colors"
                    >
                        Back to Top &uarr;
                    </button>
                </div>

            </div>
        </footer>
    );
}