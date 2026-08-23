import { ThemeProvider } from './lib/theme';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import DeviceShowcase from './components/DeviceShowcase';
import Vision from './components/Vision';
import Process from './components/Process';
import Services from './components/Services';
import Work from './components/Work';
import Pricing from './components/Pricing';
import AuditTool from './components/AuditTool';
import Reviews from './components/Reviews';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/motion/ScrollProgress';
import CircuitDivider from './components/motion/CircuitDivider';

/**
 * Entrance motion is owned by each section through <Reveal>. There is no
 * global animation sweep, so no component can animate a node it does not
 * render.
 *
 * Section order follows the sales argument: who we are → proof of craft →
 * how we work → what we make → proof of work → what it costs → a reason to
 * act now (the live audit) → social proof → objections → contact.
 */
export default function App() {
    return (
        <ThemeProvider>
            <div className="relative min-h-screen">
                {/* Skip link — first tab stop, hidden until focused. */}
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-full focus:bg-foreground focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-background"
                >
                    Skip to content
                </a>

                <Navbar />
                <ScrollProgress />

                <main id="main">
                    <Hero />
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
                </main>

                <Footer />
            </div>
        </ThemeProvider>
    );
}
