import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';
import Aurora from '@/components/motion/Aurora';
import Reveal from '@/components/motion/Reveal';
import { Button } from '@/components/ui/button';
import { SERVICE_LIST, servicePath } from '@/content/service-list';

/**
 * 404.
 *
 * Marked noindex rather than left to chance. The other half of getting this
 * right lives in staticwebapp.config.json, where the navigation fallback
 * excludes asset paths so a missing file returns a real 404 status instead of
 * this page with a 200  which is the soft-404 pattern that fills Search
 * Console with URLs nobody ever created.
 */
export default function NotFound() {
    return (
        <>
            <Seo
                title="Page not found | Korame"
                description="That page does not exist. Here is the way back."
                path="/404"
                noindex
            />

            <section className="relative flex min-h-[80vh] items-center overflow-hidden px-6 pt-32">
                <Aurora grid />

                <div className="relative mx-auto max-w-3xl text-center">
                    <Reveal>
                        <p className="font-mono text-sm uppercase tracking-[0.2em] text-brand-400">
                            404
                        </p>
                    </Reveal>

                    <Reveal delay={0.06}>
                        <h1 className="mt-6 text-balance font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl">
                            That page isn&apos;t here.
                        </h1>
                    </Reveal>

                    <Reveal delay={0.12}>
                        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
                            The link may be out of date, or the address may have a typo in it.
                            Everything the site has is one of these.
                        </p>
                    </Reveal>

                    <Reveal delay={0.18}>
                        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button asChild variant="primary" size="lg">
                                <Link to="/">Back to the homepage</Link>
                            </Button>
                            <Button asChild variant="glass" size="lg">
                                <Link to="/services">Browse services</Link>
                            </Button>
                        </div>
                    </Reveal>

                    <Reveal delay={0.24}>
                        <ul className="mt-14 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-border pt-8 text-sm">
                            {SERVICE_LIST.map((s) => (
                                <li key={s.slug}>
                                    <Link
                                        to={servicePath(s.slug)}
                                        className="text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {s.nav}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    to="/projects"
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </Reveal>
                </div>
            </section>
        </>
    );
}
