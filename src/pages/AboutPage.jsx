import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';
import PageHero from '@/components/page/PageHero';
import Section from '@/components/page/Section';
import { CardGrid, CheckList, CtaBand, LinkCards, StepList, TechStrip } from '@/components/page/Blocks';
import Reveal from '@/components/motion/Reveal';
import { Card } from '@/components/ui/card';
import { SERVICE_LIST, servicePath } from '@/content/service-list';
import { PROJECTS, projectPath } from '@/content/projects';
import { STACK } from '@/lib/site';
import {
    breadcrumbNode,
    graph,
    organizationNode,
    webPageNode,
    websiteNode,
} from '@/lib/seo';

const TITLE = 'About Korame | Software Engineering Studio';
const DESCRIPTION =
    'Korame is a remote-first software engineering studio. How we work, what we are good at, what we deliberately do not do, and what you own at the end of a project.';

const PRINCIPLES = [
    {
        title: 'Design and engineering are one job',
        body: 'The same people draw it and build it. That removes the most expensive conversation in this industry — the one after a handoff, about what was actually possible.',
    },
    {
        title: 'Budgets, not aspirations',
        body: 'Performance and accessibility targets are agreed at the start and enforced in the pipeline. A target that lives in a proposal is a wish; one checked on every pull request is a constraint.',
    },
    {
        title: 'Boring technology, applied carefully',
        body: 'Nearly every rescue project we take on was made fragile by something being more clever than the problem required. Complexity has to be earned by a requirement, not chosen by preference.',
    },
    {
        title: 'You own everything',
        body: 'Repository, cloud accounts, domain, documentation — yours from the first commit. There is no proprietary layer you would have to keep licensing to keep your site running.',
    },
    {
        title: 'We will tell you not to build it',
        body: 'If an off-the-shelf product covers your requirement, or the feature will not pay for itself, that is the advice you get. A project that should not exist is the most expensive kind.',
    },
    {
        title: 'Accessibility is not a phase',
        body: 'Semantic markup, keyboard operability, visible focus and contrast checked against the tokens, done while building. Retrofitted accessibility is always worse and always costs more.',
    },
];

const HOW_WE_WORK = [
    {
        title: 'Discovery',
        body: 'Time with the people who will use the thing, including the exceptions they currently handle by hand. Output is a written scope, an architecture and an honest estimate — including a recommendation not to proceed if that is the truthful one.',
    },
    {
        title: 'Design system first',
        body: 'Colour, type, spacing, motion and both themes defined as tokens in code before screens are drawn, so the visual language is a system rather than a set of pictures.',
    },
    {
        title: 'Vertical slices',
        body: 'One complete path through the system — interface, API, data, deployed — before the second one starts. Integration risk surfaces in week one rather than week nine.',
    },
    {
        title: 'Continuous deployment',
        body: 'Every pull request builds, tests and gets a preview URL. Every merge deploys. Releases are small enough to be uninteresting, which is the point.',
    },
    {
        title: 'Handover',
        body: 'Documentation, runbooks and architecture decisions with their reasoning. Continuing without us should always be a live option, not a renegotiation.',
    },
];

const NOT_US = [
    'Native iOS and Android development — we build for the web platform and the APIs behind native clients.',
    'Azure consultancy for networking, Kubernetes, identity governance or data-platform engineering.',
    'Paid media, brand strategy or content marketing as standalone services.',
    'Large enterprise ERP or SAP implementation programmes.',
    'Anything we would have to learn on your budget without telling you first.',
];

export default function AboutPage() {
    const trail = [{ name: 'About', path: '/about' }];

    const jsonLd = graph(
        organizationNode(),
        websiteNode(),
        webPageNode({
            path: '/about',
            name: TITLE,
            description: DESCRIPTION,
            breadcrumbPath: '/about',
        }),
        breadcrumbNode(trail),
    );

    return (
        <>
            <Seo title={TITLE} description={DESCRIPTION} path="/about" jsonLd={jsonLd} />

            <PageHero
                kicker="About"
                title="A small studio that builds the whole thing"
                lede="Korame is a remote-first software engineering studio. We design, build and deploy websites, web applications, full-stack systems and custom software — the same people from the data model to the focus ring."
                trail={trail}
            />

            <Section title="What we actually are">
                <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
                    <Reveal y={18}>
                        <p className="text-pretty">
                            Korame is small on purpose. The work we are good at — systems where
                            design, frontend, API and infrastructure decisions have to agree with
                            each other — is work that gets worse when it is divided between
                            people who meet at a handoff.
                        </p>
                    </Reveal>
                    <Reveal y={18} delay={0.05}>
                        <p className="text-pretty">
                            That shape has consequences we would rather state than let you
                            discover. We take on a limited number of projects at a time. We are
                            not the right choice for a programme that needs twelve engineers next
                            month. And there are whole categories of work we turn down, listed
                            further down this page, because taking work you cannot do well is how
                            studios acquire the reputation they deserve.
                        </p>
                    </Reveal>
                    <Reveal y={18} delay={0.1}>
                        <p className="text-pretty">
                            We are based in India and work remotely with clients across time
                            zones, mostly asynchronously over shared documents and deployed
                            previews, with a regular call in a window that suits you.
                        </p>
                    </Reveal>
                </div>
            </Section>

            <Section
                kicker="Principles"
                title="How we make decisions"
                width="max-w-6xl"
            >
                <CardGrid items={PRINCIPLES} columns={3} />
            </Section>

            <Section kicker="Methodology" title="How a project runs">
                <StepList items={HOW_WE_WORK} />
            </Section>

            <Section
                kicker="Capability"
                title="What we build with"
                lede="This is the working set, not a catalogue. If your project needs something outside it, we will say so."
                width="max-w-5xl"
            >
                <TechStrip
                    groups={[
                        { group: 'Frontend', items: STACK.frontend },
                        { group: 'Backend', items: STACK.backend },
                        { group: 'Data', items: STACK.data },
                        { group: 'Cloud & delivery', items: STACK.cloud },
                        { group: 'Standards', items: STACK.practice },
                    ]}
                />
            </Section>

            <Section
                kicker="Boundaries"
                title="What we do not do"
                lede="Every studio has a list like this. Most do not publish it."
                width="max-w-4xl"
            >
                <Reveal y={20}>
                    <Card className="p-8">
                        <CheckList items={NOT_US} />
                        <p className="mt-6 text-pretty text-sm leading-relaxed text-muted-foreground">
                            Where a requirement falls outside this, we will say so in the first
                            conversation and point you at the right kind of specialist. That is
                            cheaper for everyone than finding out in month three.
                        </p>
                    </Card>
                </Reveal>
            </Section>

            <Section
                kicker="Evidence"
                title="Judge it by the work"
                lede="Three builds, written up with what was actually engineered rather than what it achieved commercially — because we do not publish figures we cannot substantiate."
                width="max-w-6xl"
            >
                <LinkCards
                    items={PROJECTS.map((p) => ({
                        href: projectPath(p.slug),
                        title: p.name,
                        body: p.tagline,
                    }))}
                    columns={3}
                />

                <Reveal y={18}>
                    <p className="mt-8 text-pretty leading-relaxed text-muted-foreground">
                        This site is also part of the evidence. Every route is pre-rendered to
                        static HTML at build time, the artwork is generated rather than
                        downloaded, the fonts are self-hosted and subset, and every animation
                        respects{' '}
                        <code className="rounded bg-elevate px-1.5 py-0.5 font-mono text-sm">
                            prefers-reduced-motion
                        </code>
                        .{' '}
                        <Link
                            to="/web-development"
                            className="font-semibold text-brand-400 underline-offset-4 hover:underline"
                        >
                            The web development page
                        </Link>{' '}
                        explains why each of those decisions was made.
                    </p>
                </Reveal>
            </Section>

            <Section kicker="Services" title="What we can take on" width="max-w-6xl">
                <LinkCards
                    items={SERVICE_LIST.map((s) => ({
                        href: servicePath(s.slug),
                        title: s.nav,
                        body: s.short,
                    }))}
                    columns={3}
                />
            </Section>

            <CtaBand
                title="Work with us"
                body="Tell us what you are trying to build and what has to be true for it to be worth building. We answer within a working day."
                secondary={{ href: '/blog', label: 'Read our writing' }}
            />
        </>
    );
}
