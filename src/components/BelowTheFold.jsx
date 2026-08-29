import Marquee from '@/components/Marquee';
import About from '@/components/About';
import DeviceShowcase from '@/components/DeviceShowcase';
import Vision from '@/components/Vision';
import Process from '@/components/Process';
import Services from '@/components/Services';
import SelectedWork from '@/components/SelectedWork';
import AuditTool from '@/components/AuditTool';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import CircuitDivider from '@/components/motion/CircuitDivider';

/**
 * Everything below the homepage's first screen, in one lazily-loaded chunk.
 *
 * Why this is split out: the Hero is the only section whose entrance runs on
 * mount rather than on scroll, so it is the only one that can be starved by
 * the initial commit. Measured on the production build at 6x CPU throttle,
 * mounting the whole document in one go was a 1295ms task before first paint
 * followed by work landing directly on top of the Hero's entrance.
 *
 * With pre-rendering, this markup is already in the served HTML, so the
 * reader sees it immediately regardless. React 18 keeps the server HTML
 * inside a Suspense boundary in place while the lazy chunk loads and hydrates
 * that boundary separately — so the split now buys hydration priority for the
 * Hero rather than paint priority, and costs the reader nothing either way.
 *
 * ── Two sections were removed rather than migrated ───────────────────────
 * `Reviews` shipped three testimonials with invented names, invented
 * companies and an invented metric ("bounce rate dropped 45%"). `Pricing`
 * shipped invented figures that were also being fed to search engines as
 * Offer structured data. Both are fabrications; neither is restorable
 * without real material. See the SEO report for what to put back.
 *
 * Ordering follows the argument: who we are -> proof of craft -> how we work
 * -> what we make -> proof of work -> a reason to act now -> objections ->
 * contact.
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
            <SelectedWork />
            <AuditTool />
            <CircuitDivider />
            <Faq />
            <Contact />
        </>
    );
}
