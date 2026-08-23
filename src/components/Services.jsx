import { ShoppingCart, Sparkles, Globe, ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import Aurora from '@/components/motion/Aurora';
import TileImage from '@/components/motion/TileImage';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const SERVICES = [
    {
        icon: ShoppingCart,
        tone: 'text-brand-300 bg-brand-500/15 border-brand-500/25',
        art: 'service-commerce',
        artAlt: 'Layered storefront interfaces receding in isometric space',
        title: 'Full-stack & e-commerce',
        desc: 'End-to-end builds, from high-converting storefronts to scalable web applications with secure payment gateways and frictionless checkout.',
        tags: ['E-commerce', 'Full-stack apps', 'Payment integration'],
    },
    {
        icon: Sparkles,
        tone: 'text-cyan-glow bg-cyan-glow/15 border-cyan-glow/25',
        art: 'service-design',
        artAlt: 'Overlapping translucent colour discs beside a type scale',
        title: 'Bespoke UI/UX & motion',
        desc: 'Custom design systems and high-frame-rate scroll choreography tuned to your brand — built to hold attention and convert it.',
        tags: ['Design systems', 'Motion design', 'Conversion optimisation'],
    },
    {
        icon: Globe,
        tone: 'text-violet-glow bg-violet-glow/15 border-violet-glow/25',
        art: 'service-seo',
        artAlt: 'A glowing node graph representing search and distribution',
        title: 'Hosting, domains & SEO',
        desc: 'The whole technical footing: domain configuration, cloud hosting, SSL, structured data and Core Web Vitals tuned for search visibility.',
        tags: ['Domain setup', 'Cloud hosting', 'Technical SEO'],
    },
];

/**
 * Capability cards.
 *
 * The old version pulled three Unsplash photos plus a 2000px background image
 * — roughly 1.5MB of decorative network requests on a page whose pitch is
 * sub-second loads. They are replaced with generated CSS/SVG artwork: no
 * requests, no layout shift, and it themes with the design tokens.
 */
export default function Services() {
    return (
        <section id="services" className="relative overflow-hidden px-6 py-28 sm:py-36">
            <Aurora intensity="soft" grid />

            <div className="relative mx-auto max-w-7xl">
                <div className="text-center">
                    <Reveal>
                        <Badge>Capabilities</Badge>
                    </Reveal>

                    <Reveal delay={0.06}>
                        <h2 className="mt-6 text-balance font-heading text-4xl font-bold tracking-[-0.025em] text-foreground md:text-5xl lg:text-6xl">
                            What we <span className="text-gradient-brand">build for you</span>
                        </h2>
                    </Reveal>

                    <Reveal delay={0.12}>
                        <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
                            Three services, one standard. Everything ships fast, accessible
                            and search-ready.
                        </p>
                    </Reveal>
                </div>

                <div className="mt-16 grid gap-7 md:grid-cols-3">
                    {SERVICES.map((item, i) => (
                        <Reveal key={item.title} className="h-full" delay={i * 0.1} y={36}>
                            <TiltCard
                                className="h-full"
                                wrapperClassName="h-full"
                                intensity={8}
                                lift={12}
                            >
                                <Card className="group flex h-full flex-col overflow-hidden p-0">
                                    <TileImage
                                        name={item.art}
                                        alt={item.artAlt}
                                        className="h-48 border-b border-border"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    >
                                        {/* Icon badge, lifted on hover */}
                                        <span
                                            className={`absolute bottom-5 left-6 grid size-12 place-items-center rounded-2xl border border-border bg-card/90 backdrop-blur-xl ${item.tone.split(" ")[0]} shadow-lg transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1 group-hover:scale-105`}
                                        >
                                            <item.icon className="size-5" aria-hidden="true" />
                                        </span>

                                        <ArrowUpRight className="absolute right-6 top-6 size-5 text-white/70 opacity-0 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                                    </TileImage>

                                    {/* -------------------------------------
                                        Body
                                       ------------------------------------- */}
                                    <div className="flex flex-1 flex-col justify-between gap-6 p-7">
                                        <div>
                                            <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand-200">
                                                {item.title}
                                            </h3>
                                            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                                                {item.desc}
                                            </p>
                                        </div>

                                        <ul className="flex flex-wrap gap-2">
                                            {item.tags.map((tag) => (
                                                <li key={tag}>
                                                    <Badge variant="outline" size="sm">
                                                        {tag}
                                                    </Badge>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </Card>
                            </TiltCard>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
