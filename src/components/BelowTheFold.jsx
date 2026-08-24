import Marquee from '@/components/Marquee';
import About from '@/components/About';
import DeviceShowcase from '@/components/DeviceShowcase';
import Vision from '@/components/Vision';
import Process from '@/components/Process';
import Services from '@/components/Services';
import Work from '@/components/Work';
import Pricing from '@/components/Pricing';
import AuditTool from '@/components/AuditTool';
import Reviews from '@/components/Reviews';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CircuitDivider from '@/components/motion/CircuitDivider';

/**
 * Everything below the first screen, in one lazily-loaded chunk.
 *
 * Why this is split out at all: the page is a single route, so every section
 * used to mount in the same commit as the Hero. Measured on the production
 * build at 6x CPU throttle, that was one 1295ms task before first paint,
 * followed by 365ms and 151ms tasks that landed exactly on top of the Hero's
 * entrance — a 367ms frame in the middle of the headline animation.
 *
 * The Hero is the only section that animates on mount; every other one waits
 * for a scroll that cannot happen until the main thread is already idle.
 * That asymmetry is the whole reason the home screen was the one that
 * stuttered on refresh while the rest of the page felt fine.
 *
 * Ordering follows the sales argument: who we are -> proof of craft -> how we
 * work -> what we make -> proof of work -> what it costs -> a reason to act
 * now (the live audit) -> social proof -> objections -> contact.
 */
export default function BelowTheFold() {
    return (
        <>
            <Marquee />
            <About />
            <DeviceShowcase />
            <Vision />
            <Process />
            <CircuitDivider />
            <Services />
            <Work />
            <Pricing />
            <AuditTool />
            <Reviews />
            <CircuitDivider />
            <Faq />
            <Contact />
        </>
    );
}

/* Same chunk, so pulling this in costs no extra request. */
export { Footer as SiteFooter };
