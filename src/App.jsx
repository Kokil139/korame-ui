import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/lib/theme';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';

import { SERVICE_LIST } from '@/content/service-list';
import { REDIRECTS } from '@/lib/routes';

/**
 * Inner pages are code-split; the homepage and the 404 are not.
 *
 * The homepage is the most common entry point, so its chunk should not cost a
 * second round trip, and the 404 has to render without one. Everything else
 * becomes a chunk that only the visitors who go there pay for  which matters
 * here because the nine service content modules are the largest body of text
 * on the site and no single visitor needs more than one of them.
 *
 * This costs nothing on first paint. Every route is pre-rendered, so the HTML
 * is complete when the document arrives; the chunk is needed only to hydrate
 * it, and React keeps the server markup in place inside the Suspense boundary
 * until it lands. `fallback={null}` is therefore never seen on a pre-rendered
 * load  only on an in-app navigation, where it is a frame.
 *
 * The pre-render itself uses renderToPipeableStream with `onAllReady`, which
 * waits for every lazy chunk before emitting, so splitting costs the static
 * HTML nothing either. See src/entry-server.jsx.
 */
const ServicesIndex = lazy(() => import('@/pages/ServicesIndex'));
const ServicePage = lazy(() => import('@/pages/ServicePage'));
const ProjectsIndex = lazy(() => import('@/pages/ProjectsIndex'));
const ProjectPage = lazy(() => import('@/pages/ProjectPage'));
const AuditPage = lazy(() => import('@/pages/AuditPage'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const BlogIndex = lazy(() => import('@/pages/BlogIndex'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));

/**
 * Reset scroll on navigation.
 *
 * The browser only restores scroll for history entries it created; a
 * client-side route change is not one, so without this every navigation lands
 * at whatever offset the previous page was scrolled to. Going *back* is left
 * alone  the browser's own restoration is correct there.
 *
 * `behavior: 'instant'` is required: `html { scroll-behavior: smooth }` is set
 * globally, and a smooth scroll on a page that has just swapped its entire
 * contents animates through content the reader never asked to see.
 */
function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const el = document.getElementById(hash.slice(1));
            if (el) {
                el.scrollIntoView({ behavior: 'instant', block: 'start' });
                return;
            }
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname, hash]);

    return null;
}

/**
 * Every service page is a separate route rather than one `:slug` catch-all.
 *
 * A catch-all would happily render for `/anything`, and the not-found branch
 * would then have to live inside the page component. Declaring the nine paths
 * explicitly means an unknown root path falls through to the 404 route, which
 * is what both a reader and a crawler should get.
 */
const SERVICE_ROUTES = SERVICE_LIST.map((s) => ({ path: `/${s.slug}`, slug: s.slug }));

export default function App() {
    return (
        <ThemeProvider>
            <div className="relative min-h-screen">
                {/* Skip link  first tab stop, hidden until focused. */}
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-full focus:bg-foreground focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-background"
                >
                    Skip to content
                </a>

                <ScrollToTop />
                <Navbar />

                <main id="main">
                    <Suspense fallback={null}>
                        <Routes>
                            <Route path="/" element={<Home />} />

                            <Route path="/services" element={<ServicesIndex />} />
                            {SERVICE_ROUTES.map((route) => (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={<ServicePage slug={route.slug} />}
                                />
                            ))}

                            <Route path="/pricing" element={<PricingPage />} />

                            <Route path="/projects" element={<ProjectsIndex />} />
                            <Route path="/projects/:slug" element={<ProjectPage />} />

                            <Route path="/free-website-audit" element={<AuditPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />

                            <Route path="/blog" element={<BlogIndex />} />
                            <Route path="/blog/:slug" element={<BlogPost />} />

                            {/* Legacy paths. The edge issues a real 301 for
                                these; this is the client-side equivalent, so an
                                in-app link to an old path still resolves. */}
                            {REDIRECTS.map((r) => (
                                <Route
                                    key={r.from}
                                    path={r.from}
                                    element={<Navigate to={r.to} replace />}
                                />
                            ))}

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </main>

                <Footer />
            </div>
        </ThemeProvider>
    );
}
