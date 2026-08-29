export default {
    slug: 'web-design',
    nav: 'Web Design',
    short: 'Web design',
    title: 'Web Design Services | Design Systems & Motion | Korame',
    description:
        'Design systems, interaction and motion design, accessibility and responsive layout — drawn by the engineers who build it, against what browsers render fast.',
    h1: 'Web design, drawn by the people who have to build it',
    kicker: 'Web design',
    art: 'service-design',
    serviceType: 'Web design',
    lede: 'A design that cannot be built at sixty frames per second is not finished, it is a proposal. We design and engineer in the same room, which removes the most expensive conversation in this industry — the one where a handoff turns into a negotiation about what was actually possible.',

    whatItIs: {
        heading: 'Design and development are one discipline here',
        body: [
            'The traditional split — an agency designs, a development shop builds — creates a gap that somebody pays for. Shadows that cost a repaint on every scroll frame, a hero image nobody sized, type that reflows on a narrow viewport, a hover state that means nothing on a phone: none of these are design mistakes or engineering mistakes. They are handoff mistakes.',
            'We treat the design system and the component library as the same artefact. A colour is a token in the stylesheet before it is a swatch in a mockup. A motion curve is a shared constant rather than a description. When the design changes, the code changes with it, because there is only one definition of either.',
        ],
    },

    provide: [
        {
            title: 'Design systems',
            body: 'Tokenised colour, type, spacing and elevation scales that exist as CSS variables, not as a document. Both themes defined together, so nothing looks correct in one and broken in the other.',
        },
        {
            title: 'Interface design',
            body: 'Layout, hierarchy and typography for the pages that carry the argument — landing pages, product surfaces, forms and the states around them.',
        },
        {
            title: 'Interaction design',
            body: 'What happens on hover, focus, press, drag and scroll, plus the states most projects forget: loading, empty, partial, error and offline.',
        },
        {
            title: 'Motion design',
            body: 'Motion as a shared vocabulary — a small set of springs and easing curves reused everywhere — so the whole product moves like one thing rather than eleven.',
        },
        {
            title: 'Responsive design',
            body: 'Fluid type and spacing scales and container-aware components, so layouts hold at any width instead of only at the four you tested.',
        },
        {
            title: 'Accessible visual design',
            body: 'Contrast checked against WCAG at design time, focus states drawn deliberately rather than inherited from the browser, and hit targets sized for a thumb.',
        },
    ],

    audience: [
        {
            title: 'Companies whose brand looks generic online',
            body: 'The template look is a competitive problem when every rival in the search results bought the same one.',
        },
        {
            title: 'Product teams without a design system',
            body: 'When every screen re-invents its own buttons and spacing, shipping gets slower each quarter. A system reverses that curve.',
        },
        {
            title: 'Teams whose design keeps not surviving the build',
            body: 'If the shipped product never quite matches the mockup, the problem is the seam. Removing the seam fixes it.',
        },
    ],

    problems: [
        {
            title: 'It looks fine and converts badly',
            body: 'Usually hierarchy: three competing primary actions, a value proposition below the fold, and a form asking for six fields when two would do.',
        },
        {
            title: 'The animation makes it feel slow',
            body: 'Motion that animates layout properties, or entrances that hold content back for a second before revealing it. Motion should acknowledge an action, not delay it.',
        },
        {
            title: 'It falls apart on a phone',
            body: 'Desktop-first design that gets squeezed rather than reconsidered, hover-only affordances that touch devices never see, and text set too small to read.',
        },
        {
            title: 'Nobody can extend it',
            body: 'A visual language that exists only as flat images has no rules to follow, so every new page drifts a little further from the last.',
        },
    ],

    approach: [
        {
            title: 'Establish the tokens',
            body: 'Colour, type, spacing, radius, elevation and motion, defined once as variables. Both light and dark are specified together; a theme retrofitted later always leaves hardcoded values behind.',
        },
        {
            title: 'Design the hard screens first',
            body: 'The densest, most stateful screen, not the marketing hero. If the system survives that, the easy pages are free.',
        },
        {
            title: 'Prototype in the browser',
            body: 'Motion and interaction are judged in a real browser on a real device, because a video of an animation cannot tell you it drops frames on a mid-range Android.',
        },
        {
            title: 'Specify the states',
            body: 'Every interactive element gets its focus, disabled, loading, error and empty treatment defined, not discovered during QA.',
        },
    ],

    tech: [
        { group: 'Design system', items: ['CSS custom properties', 'Tailwind CSS v4', 'Design tokens'] },
        { group: 'Motion', items: ['Motion', 'CSS animation', 'View Transitions API'] },
        { group: 'Components', items: ['React', 'shadcn idiom', 'Base UI primitives'] },
        { group: 'Accessibility', items: ['WCAG 2.2 AA', 'prefers-reduced-motion', 'Keyboard-first'] },
    ],

    pillars: [
        {
            title: 'Accessibility',
            body: 'Contrast ratios verified against the tokens rather than eyeballed, a visible focus ring on every interactive element, correct heading order, real labels on form fields, and motion that respects prefers-reduced-motion by rendering the final state rather than a slower animation.',
        },
        {
            title: 'Performance-aware design',
            body: 'Effects are chosen with their compositing cost in mind. Transform and opacity animate on the GPU; box-shadow, filter and layout properties do not. Decorative imagery is generated CSS or SVG wherever it can be, so a page selling fast load times does not open with a megabyte of decoration.',
        },
        {
            title: 'Responsive behaviour',
            body: 'Fluid scales rather than fixed steps, images with intrinsic dimensions so nothing shifts as they arrive, and touch treated as a first-class input rather than a degraded mouse.',
        },
        {
            title: 'Consistency',
            body: 'One motion vocabulary, one spacing rhythm, one elevation model. Consistency is what makes an interface feel considered; novelty per screen is what makes it feel assembled.',
        },
        {
            title: 'Handover',
            body: 'The design system ships as running code with the tokens documented in the stylesheet, so your team extends the system rather than guessing at it.',
        },
    ],

    useCases: [
        'A rebrand that needs to reach the website without a full rebuild',
        'A first design system for a product team that has outgrown ad-hoc screens',
        'A marketing site that needs to look distinctive in a crowded search result',
        'Adding considered motion to an interface that currently feels static or abrupt',
        'An accessibility and contrast pass across an existing product',
    ],

    faqs: [
        {
            q: 'Can you design without also building it?',
            a: 'Yes, and we will hand over tokens and component specifications your developers can implement directly. But the value we add is largest when design and implementation are the same engagement, because that is where the handoff losses disappear.',
        },
        {
            q: 'Do you work in Figma?',
            a: 'For layout exploration and stakeholder review, yes. Motion and interaction move to a browser prototype early, because a static tool cannot tell you whether an animation drops frames on the device your customers actually use.',
        },
        {
            q: 'Will heavy animation hurt my Core Web Vitals?',
            a: 'It can, and it usually does when animation is added late. Animating transform and opacity keeps work on the compositor; animating layout or paint properties does not. Entrance animation that delays content also damages Largest Contentful Paint, so on this site the first screen animates and the rest waits for a scroll.',
        },
        {
            q: 'How do you handle dark mode?',
            a: 'Both themes are defined at the token layer from the start. Retrofitting dark mode means hunting down every hardcoded colour someone wrote when only one theme existed — it is much more expensive than doing it once.',
        },
    ],

    projects: ['the-travellers-tribe', 'nomadninja', 'kepaso'],
    related: ['web-development', 'web-app-development', 'app-development'],
};
