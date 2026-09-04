/**
 * Project experience.
 *
 * ── Rules for this file ──────────────────────────────────────────────────
 * Everything here must be verifiable from the shipped code or from the live
 * deployment. No invented business metrics, no invented clients, no
 * testimonials. Where a project is a Korame studio build rather than client
 * work, it says so  presenting a self-initiated build as a client engagement
 * would be a fabrication, and the engineering on display is the point either
 * way.
 *
 * `liveUrl: null` means there is deliberately no live link. Publishing a
 * button that leads to a 404 is worse than omitting it.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const PROJECTS = [
    {
        slug: 'kepaso',
        name: 'Kepaso',
        nav: 'Kepaso',
        kind: 'Korame studio build',
        year: '2025',
        title: 'Kepaso  Case Study | Real-Time 3D on the Web | Korame',
        description:
            'How Korame built Kepaso: a procedurally generated 3D coffee bean in WebGL, a resolution budget instead of a fixed pixel ratio, and a render loop that pauses.',
        h1: 'Kepaso',
        tagline: 'A brand site built around real-time 3D that does not cost you the frame budget',
        art: 'project-kepaso',
        artAlt: 'The Kepaso logo  a coffee bean on a dark rounded badge',
        liveUrl: 'https://victorious-ground-0327f1100.7.azurestaticapps.net',
        liveNote: null,
        capabilities: ['Web Development', 'Web Design', 'Full-Stack Development'],
        services: ['web-development', 'web-design', 'full-stack-development'],
        stack: [
            'React 19',
            'Vite 5',
            'three.js',
            'React Three Fiber',
            'Motion',
            'Tailwind CSS v4',
            'Lenis',
            'sharp',
            'Azure Static Web Apps',
        ],

        overview: [
            'Kepaso is a single-origin coffee roaster brand site: a long, editorial page that follows one bean from a hillside in Yirgacheffe to the cup, through the craft, the menu, the origins and the cafés.',
            'It is a Korame studio build rather than client work  a concept brand used to solve a specific engineering problem properly, which is what makes it worth publishing as a case study. The problem is real-time 3D on a marketing site, and the reason most sites that attempt it feel broken.',
        ],

        challenge: [
            'A rotating 3D object is one of the few things on the web that can look genuinely expensive. It is also one of the easiest ways to destroy a page. A WebGL canvas will happily render at whatever resolution the display asks for, at whatever framerate it can manage, forever  including while it is scrolled three screens out of view, on a laptop running on battery.',
            'The naive implementation of this page renders a 4K framebuffer continuously for the entire session. That is why "3D website" and "my fan turned on" tend to arrive in the same sentence. The requirement was a scene that reads as a premium product render and behaves like a static image when nobody is looking at it.',
        ],

        solution: [
            'The bean is generated in code rather than loaded as a model. A sphere is deformed in three passes: squashed into an ellipsoid, then pressed with a gaussian valley along one axis to form the bean\'s signature crease, then given a slight wave so the crease is not a dead-straight line. The geometry is built once, memoised, and never rebuilt  only its transform changes per frame.',
            'That choice removes an asset download entirely. There is no .glb to fetch, no loader, no decode step and no draco dependency; the mesh exists a few milliseconds after the JavaScript parses.',
            'Resolution is then governed by a pixel budget instead of a device pixel ratio. Rather than rendering at 2× on any display that claims it, the canvas measures its own box with a ResizeObserver and solves for the ratio that keeps the total framebuffer at roughly 2.4 million pixels, clamped between 0.75× and 2×. A small canvas on a 4K monitor gets crisp rendering; a full-bleed canvas on the same monitor quietly steps down instead of asking the GPU for four times the work.',
            'Finally the render loop is gated by an IntersectionObserver, so it stops when the canvas leaves the viewport, and by prefers-reduced-motion, which drops the animation entirely rather than slowing it.',
        ],

        features: [
            {
                title: 'Procedural bean geometry',
                body: 'The mesh is mathematics, not an asset  no model download, no loader, no decode, and it is trivially tunable.',
            },
            {
                title: 'Pixel-budget resolution scaling',
                body: 'A ResizeObserver plus a fixed framebuffer budget replaces the usual fixed DPR multiplier, so GPU cost stays bounded across every display.',
            },
            {
                title: 'Visibility-gated render loop',
                body: 'The scene stops rendering when scrolled out of view, which is most of the session on a long editorial page.',
            },
            {
                title: 'Scroll-driven narrative',
                body: 'Harvest, origins and menu sections are choreographed against scroll position with Motion, with Lenis smoothing the scroll itself.',
            },
            {
                title: 'Build-time image preparation',
                body: 'A sharp-based script processes the journey photography at build time, so responsive variants are generated rather than resized in the browser.',
            },
            {
                title: 'Accessibility baked in',
                body: 'Skip link as the first tab stop, and every animation  including the 3D scene  respects prefers-reduced-motion.',
            },
        ],

        engineering: [
            {
                title: 'Frontend',
                body: 'React 19 on Vite 5, Tailwind CSS v4 with tokens defined as CSS custom properties, and shadcn-idiom component primitives over Base UI.',
            },
            {
                title: '3D pipeline',
                body: 'three.js through React Three Fiber. Geometry built with BufferGeometry vertex manipulation and cached with useMemo; per-frame work is limited to transforms inside useFrame.',
            },
            {
                title: 'Motion',
                body: 'Motion for scroll-linked and entrance animation, including a spring-smoothed page read-progress bar driven from useScroll.',
            },
            {
                title: 'Performance strategy',
                body: 'Capped device pixel ratio, off-screen render pause, memoised geometry, and static asset preparation moved to build time via sharp.',
            },
            {
                title: 'Deployment',
                body: 'Static build deployed to Azure Static Web Apps.',
            },
        ],

        experience: [
            'The page is structured as a single vertical narrative rather than a set of marketing modules. Scroll is the only navigation the content needs, so the header stays minimal and the reading position is communicated by a thin progress bar rather than a menu highlight.',
            'Lenis smooths the scroll itself, which matters specifically because the 3D scene and the parallax layers are driven from scroll position  an unsmoothed wheel event produces visible stepping in anything tied to it.',
            'Colour is warm and very dark, and the document background is painted by an inline style in the head so the near-black hero does not flash white before the stylesheet arrives.',
        ],

        outcome: [
            'The result is a marketing page carrying a live WebGL scene whose GPU cost is bounded by design: resolution is capped by a pixel budget, rendering stops when the canvas is not visible, and the whole effect is removed rather than degraded for anyone who has asked for reduced motion.',
            'The technique transfers directly. The same pattern  generate geometry rather than download it, budget resolution rather than trust the display, and gate the loop on visibility  is what makes 3D viable on a commercial site instead of a demo.',
        ],
    },

    {
        slug: 'nomadninja',
        name: 'NomadNinja',
        nav: 'NomadNinja',
        kind: 'Korame studio build',
        year: '2025',
        title: 'NomadNinja  Scroll Narrative Case Study | Korame',
        description:
            'How Korame built NomadNinja: an eight-chapter scroll narrative that mounts one video at a time, and a Remotion title sequence kept off the critical path.',
        h1: 'NomadNinja',
        tagline: 'An eight-chapter scroll narrative that only ever decodes one video',
        art: 'project-nomadninja',
        artAlt: 'The NomadNinja logo  an ink-brush circle of a climber beneath a red sun',
        liveUrl: 'https://gentle-sea-076984400.7.azurestaticapps.net',
        liveNote: null,
        capabilities: ['Web Development', 'Web Design', 'Interactive Web Experiences'],
        services: ['web-development', 'web-design', 'app-development'],
        stack: [
            'React 18',
            'Vite 5',
            'Motion',
            'Tailwind CSS v4',
            'Remotion',
            'sharp',
            'Azure Static Web Apps',
        ],

        overview: [
            'NomadNinja is a small-group expedition brand for Japan  twelve travellers, one country, six routes. The site is built as an editorial piece rather than a catalogue: its centrepiece is an eight-chapter scroll sequence that walks through a single trip minute by minute, and its argument is that almost none of a route is the summit photograph.',
            'It is a Korame studio build. The brand is a vehicle for the engineering: a media-heavy narrative site that still has to load quickly and behave on a phone.',
        ],

        challenge: [
            'The centrepiece section is eight video chapters. The obvious implementation puts eight <video> elements on the page and lets the browser sort it out  which means eight decoders competing for frames, seven of which nobody is watching, plus eight sets of network requests on a page that is already carrying thirty images.',
            'The second problem was the title sequence. The brand opens with an animated mark, and the natural tool for that is Remotion  but @remotion/player plus its runtime is roughly 95kB gzipped, close to the size of the entire site bundle again. Loading that in front of first paint, in order to cover first paint, is self-defeating.',
        ],

        solution: [
            'The journey section is a tall container with a sticky stage inside it. Scroll position selects the active chapter, and only the active chapter is mounted and playing  the other seven do not exist in the DOM. Each chapter owns slightly less than one screen of scroll, so the reader is always moving rather than waiting for the next beat to arrive.',
            'Critically, nothing is scroll-jacked. The wheel, the scrollbar, the keyboard and a trackpad fling all behave exactly as they do everywhere else on the page. Hijacking scroll is the obvious way to build a sequence like this and it breaks every one of those inputs.',
            'The intro is code-split away from the critical path. The preloader shell paints the storyboard\'s opening beat  a mark on bare paper  with no extra JavaScript at all, and the Remotion player arrives during it. The composition is transparent where the paper tears away, so what shows through the tear is the real hero section underneath rather than a picture of it. That is the reason the finale cannot simply be a video file: a video has no hole in it.',
        ],

        features: [
            {
                title: 'Eight-chapter sticky scroll narrative',
                body: 'Scroll-position-driven chapter selection with only the active clip mounted, so decode cost stays at one video regardless of section length.',
            },
            {
                title: 'No scroll-jacking',
                body: 'Native scroll throughout  keyboard, scrollbar, wheel and trackpad momentum all behave normally.',
            },
            {
                title: 'Code-split Remotion title sequence',
                body: 'A programmatic intro rendered by the Remotion player, deliberately kept out of the first-paint bundle and loaded behind a zero-JavaScript shell.',
            },
            {
                title: 'Transparent reveal onto live DOM',
                body: 'The intro composition tears away to expose the actual hero section beneath it, not a rendered image of it.',
            },
            {
                title: 'Bilingual editorial typography',
                body: 'Japanese and English set together throughout the navigation and section labels as a deliberate typographic system.',
            },
            {
                title: 'Generated media pipeline',
                body: 'Build-time scripts produce the responsive imagery, the logo assets and the video posters, so nothing is hand-exported and nothing drifts.',
            },
            {
                title: 'Structured data generated from content',
                body: 'The FAQPage JSON-LD is generated from the same array that renders the FAQ, so the markup and the structured data cannot disagree.',
            },
        ],

        engineering: [
            {
                title: 'Frontend',
                body: 'React 18 on Vite 5 with Tailwind CSS v4. Below-the-fold content is code-split into a separate chunk so the hero is not competing with the rest of the document for the main thread.',
            },
            {
                title: 'Motion',
                body: 'Motion throughout  useScroll and useTransform for the scroll-linked chapter machinery, AnimatePresence for chapter transitions, and useReducedMotion respected at every point.',
            },
            {
                title: 'Video',
                body: 'Muted, looping, playsInline video with poster frames, mounted one at a time and paused when off-screen. playsInline is not optional; iOS refuses inline autoplay without it.',
            },
            {
                title: 'Build pipeline',
                body: 'Node scripts using sharp generate responsive imagery, brand assets, video posters and the FAQ structured data as part of the prebuild step.',
            },
            {
                title: 'SEO',
                body: 'Unique title and description, canonical URL, Open Graph tags, and a JSON-LD graph including TravelAgency and FAQPage  all present in the served HTML rather than injected at runtime.',
            },
            {
                title: 'Deployment',
                body: 'Static build deployed to Azure Static Web Apps and served from the CDN edge.',
            },
        ],

        experience: [
            'Navigation is a single-page anchor system with bilingual labels  "The Days 日", "Places 地", "Routes 道"  which doubles as the site\'s typographic signature rather than being decoration bolted on.',
            'The journey section is the emotional centre and it is deliberately slow: eight beats, each under a screen of scroll, showing the unphotogenic minutes between the highlights. The design argument and the engineering constraint point the same way, because mounting one chapter at a time is both cheaper and more focused.',
            'Everything below the first screen is deferred, so the opening animation gets the main thread to itself rather than competing with the rest of the document mounting.',
        ],

        outcome: [
            'A media-dense narrative site  thirty images, multiple video sequences and a programmatic title sequence  that still ships as a single JavaScript bundle and a single stylesheet, with the heaviest dependency loaded off the critical path.',
            'The scroll narrative pattern is the reusable result: sticky stage, scroll-derived index, one mounted child. It gives the feel of a bespoke scroll experience without the two costs those usually carry, which are broken scrolling and a decoder per section.',
        ],
    },

    {
        slug: 'the-travellers-tribe',
        name: 'The Travellers Tribe',
        nav: 'The Travellers Tribe',
        kind: 'Korame studio build',
        year: '2025',
        title: 'The Travellers Tribe  Brand Intro Case Study | Korame',
        description:
            'How Korame built The Travellers Tribe: an SVG brand intro animated from a single motion value, deferred below-the-fold loading, and generated media assets.',
        h1: 'The Travellers Tribe',
        tagline: 'A brand opening built from one motion value, so no beat can drift',
        art: 'project-the-travellers-tribe',
        artAlt: 'The Travellers Tribe logo  a sun rising over two horizon lines',
        liveUrl: 'https://mango-dune-0649ec100.7.azurestaticapps.net',
        liveNote: null,
        capabilities: ['Web Development', 'Web Design', 'Responsive Web Applications'],
        services: ['web-design', 'web-development'],
        stack: [
            'React 18',
            'Vite 5',
            'Motion',
            'Tailwind CSS v4',
            'sharp',
            'Azure Static Web Apps',
        ],

        overview: [
            'The Travellers Tribe is a small-group journey brand  sixteen travellers, guides who live where you are walking, routes through the Dolomites, Nepal, Morocco, Switzerland, Portugal and the Rockies. The site is a single editorial page: destinations, journeys, the manifesto, questions and a way to get in touch.',
            'It is a Korame studio build, developed from the same architectural foundation as NomadNinja and then taken in a different visual direction  warm and sunlit rather than cool and graphic. That reuse is itself the point: a design system that can carry two distinct brands is a system rather than a skin.',
        ],

        challenge: [
            'The brief was an opening title sequence that establishes the brand before the site does  but a preloader is a toll booth. Every millisecond it holds is a millisecond a visitor spends looking at something they did not ask for, and most implementations make it worse by loading a video or an animation library in front of first paint.',
            'The second challenge is the one every multi-beat animation has: keeping the beats synchronised. A sequence assembled from independent timers, transitions and delays drifts the moment one of them is affected by a slow frame, and the failure looks like a bug rather than a timing issue.',
        ],

        solution: [
            'The whole opening hangs off a single 0–100 MotionValue. The loading line filling with ember, the mark pulling towards the viewer, and the screen parting down the middle are all derived from that one value with useTransform, so no two beats can drift apart regardless of frame timing. The sequence is 3.2 seconds  long enough to land the movement, short enough not to become a toll booth.',
            'The animation itself is SVG and CSS rather than video or an imported animation runtime. The gradient sun, sky and rim elements are inline SVG driven by Motion, which means the sequence is a few kilobytes of markup rather than a media download, scales to any viewport without a resolution decision, and adapts to the theme.',
            'Colour was chosen against the brand rather than from defaults: the unlit end of the loading line is a warm paper white rather than pure white, because the site contains no pure white and paper against black is the difference between a title card and a system dialog. The lit end is the exact ember the wordmark is set in, so the line finishes on the logo\'s own colour.',
            'Below-the-fold content is deferred and code-split, so the intro and the hero have the main thread while the rest of the document waits.',
        ],

        features: [
            {
                title: 'Single-motion-value intro sequence',
                body: 'Every beat of the 3.2-second opening derives from one 0–100 value, which makes drift structurally impossible.',
            },
            {
                title: 'SVG brand animation, not video',
                body: 'Inline SVG with gradient sun, sky and rim layers  kilobytes rather than a media file, resolution-independent and theme-aware.',
            },
            {
                title: 'Deferred below-the-fold architecture',
                body: 'The document below the first screen is split into its own chunk so the opening is not competing with it for the main thread.',
            },
            {
                title: 'Reduced-motion path',
                body: 'The opening sequence is skipped rather than slowed when the visitor has asked for reduced motion.',
            },
            {
                title: 'Generated brand and media assets',
                body: 'Logo variants, responsive imagery and social cards are produced by sharp-based build scripts rather than exported by hand.',
            },
            {
                title: 'Complete technical SEO',
                body: 'Canonical URL, Open Graph and Twitter cards, a TravelAgency and FAQPage JSON-LD graph, robots.txt and sitemap.xml  all shipped, all in the served HTML.',
            },
        ],

        engineering: [
            {
                title: 'Frontend',
                body: 'React 18 on Vite 5 with Tailwind CSS v4 and a tokenised design system, producing a single JavaScript bundle and a single stylesheet.',
            },
            {
                title: 'Motion',
                body: 'Motion with useMotionValue and useTransform as the sequencing primitive, AnimatePresence for the intro teardown, and useReducedMotion honoured throughout.',
            },
            {
                title: 'Media',
                body: 'A muted, looping, playsInline hero video with a poster frame, and responsive imagery generated at build time.',
            },
            {
                title: 'Accessibility',
                body: 'Skip-to-content as the first tab stop, semantic landmarks, and motion that renders its final state rather than a degraded animation under reduced-motion preferences.',
            },
            {
                title: 'Deployment',
                body: 'Static build deployed to Azure Static Web Apps, with robots.txt and sitemap.xml served correctly from the CDN.',
            },
        ],

        experience: [
            'The opening sets the brand\'s temperature before a single word of copy is read  a black screen, a line filling with ember, and the screen parting onto a sunlit hero. It resolves quickly and it never repeats within a session.',
            'The page then behaves conventionally: a single-page anchor nav across Destinations, Journeys, The Tribe and Questions, with a contact section at the end. That conventionality is deliberate. The distinctive part is the entrance; the reading experience afterwards should not make anybody work.',
            'Typography pairs a serif display face with a variable sans for body copy, both self-hosted and subset, so the editorial tone does not cost a render-blocking font request.',
        ],

        outcome: [
            'A brand-led site whose most memorable element  the opening sequence  is a few kilobytes of SVG and one motion value rather than a media download or an animation runtime.',
            'It also demonstrates the value of a real design system: the same architecture underneath NomadNinja carries a completely different visual identity without a rebuild, which is exactly the property that makes a system worth investing in.',
        ],
    },
];

export const PROJECT_BY_SLUG = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]));

export const getProject = (slug) => PROJECT_BY_SLUG[slug];

export const projectPath = (slug) => `/projects/${slug}`;
