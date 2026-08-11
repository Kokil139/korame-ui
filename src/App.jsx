import React, { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import DeviceShowcase from './components/DeviceShowcase';
import Vision from './components/Vision';
import Services from './components/Services';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
    useLayoutEffect(() => {
        // Global ScrollTrigger entrance animations for elements with .gsap-reveal
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.gsap-reveal').forEach((element) => {
                gsap.to(element, {
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                });
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-20">
                <Hero />
                <About />
                <DeviceShowcase />
                <Vision />
                <Services />
                <Reviews />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}