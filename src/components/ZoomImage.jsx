import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ZoomImage({
                                      src,
                                      alt,
                                      className = "",
                                      mode = "scrub" // "scrub" (zooms continuously as you scroll) or "reveal" (zooms in once when scrolled into view)
                                  }) {
    const containerRef = useRef(null);
    const imgRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (mode === "scrub") {
                // Smoothly scales down from 1.35x to 1.0x tied directly to scroll position
                gsap.fromTo(
                    imgRef.current,
                    { scale: 1.35 },
                    {
                        scale: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top bottom', // Starts when top of image enters bottom of screen
                            end: 'bottom top',   // Ends when bottom of image leaves top of screen
                            scrub: 1,            // Smooth 1-second lag for fluid motion
                        },
                    }
                );
            } else {
                // Entrance Reveal: Zooms up from 0.85x to 1.0x with an opacity fade
                gsap.fromTo(
                    imgRef.current,
                    { scale: 0.85, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 1.2,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            }
        }, containerRef);

        return () => ctx.revert(); // Clean up GSAP memory on component unmount
    }, [mode]);

    return (
        <div ref={containerRef} className={`overflow-hidden rounded-3xl ${className}`}>
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className="w-full h-full object-cover will-change-transform"
            />
        </div>
    );
}