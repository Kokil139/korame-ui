# Project guide  Korame marketing site

## Standing rules

- Use Tailwind.
- Use Motion for UI animation. **Never** `framer-motion`.
- Do not introduce dependencies without justification.
- Follow the design system (tokens in `src/index.css`).
- Never rewrite working components unnecessarily.

## Actual stack

**Verify before assuming.** This file previously described a completely
different project  Tailwind v4 + React 19 + shadcn + R3F + `lenis`, with
traps about `src/components/three/Scene.jsx`, `Harvest.jsx` and
`public/journey/`. None of that exists here; it was copied from
`Documents/3d` (the Kepaso build). Check `package.json` before trusting any
stack claim, including this table.

| | |
|---|---|
| Build | **Vite 5** |
| Language | **JSX**, not TypeScript (`jsconfig.json`, `@/*` → `./src/*`) |
| React | **18.3** |
| CSS | **Tailwind v4** via `@tailwindcss/vite`. No `tailwind.config.js`, no `postcss.config.js`, no `autoprefixer` |
| Components | shadcn v4, `base-nova` style, Base UI, `tsx: false` (see `components.json`) |
| Animation | `motion` v13 → import from `motion/react`. **No GSAP** |
| 3D | CSS 3D only  perspective + `preserve-3d`. No WebGL, no three.js |
| Theme | **Light-first** with a dark toggle. `ThemeProvider` in `src/lib/theme.jsx`; a blocking script in `index.html` applies the class pre-paint |
| Fonts | Self-hosted via `@fontsource-variable/{syne,plus-jakarta-sans}` |
| Assets | `sharp` (devDependency, build-time only) |
| Deploy | GitHub Pages via `.github/workflows/deploy.yml`, custom domain `korame.in` (`public/CNAME`) |

Tailwind v4 notes: tokens live in `:root`/`.dark` and are mapped into the
theme with `@theme inline` in `src/index.css`. Custom utilities use
`@utility`, not `@layer utilities`. Without the `@theme inline` map,
`bg-background` / `border-border` do not exist and the build fails.

## Layout of the source

```
src/
  index.css              design system: tokens, @theme inline, @utility, keyframes
  lib/utils.js           cn(), clamp01(), lerp()
  lib/motion.js          shared springs + viewport config
  lib/theme.jsx          ThemeProvider / useTheme (light | dark | system)
  components/ui/         shadcn-idiom primitives (button, badge, card, input)
  lib/audit.js           audit sources (Observatory, PSI, timing probe)
  components/motion/     Reveal, TiltCard, Magnetic, CountUp, WordReveal,
                         Aurora, ScrollProgress, CircuitDivider, TileImage,
                         CodeTypewriter, ScreenBoot, useScrollVelocityFactor
  components/*.jsx       the homepage sections
  components/page/       Breadcrumbs, PageHero, Section, FaqList, Blocks
                         (CardGrid, StepList, Prose, TechStrip, CheckList,
                         LinkCards, CtaBand)  the inner pages are these
                         components fed different data
  components/Seo.jsx     per-route <head>; collects on the server, patches
                         the live document on client navigation
  pages/*.jsx            one file per route template
  content/service-list.js  nav metadata for the 8 services (see its header
                         for why it is split from the content modules)
  content/services/*.js  one module per service page  the source of truth
                         for its copy, metadata, FAQ and cross-links
  content/projects.js    the three case studies
  content/posts.js       blog articles, as typed content blocks
  lib/site.js            origin, contact details, nav, technology stack
  lib/routes.js          THE route registry  router, sitemap and pre-render
                         all read this one array
  lib/seo.js             JSON-LD builders (Organization, Service, Article,
                         BreadcrumbList, FAQPage, ItemList …)
  entry-server.jsx       pre-render entry (renderToPipeableStream)
scripts/
  prerender.mjs              writes one static HTML file per route
  generate-sitemap.mjs       sitemap.xml + robots.txt, from lib/routes.js
  verify-content.mjs         fails the build on content drift, dead
                             cross-links, duplicate titles/descriptions
  verify-build.mjs           fails the build on an unrendered route, a missing
                             canonical, duplicate metadata or bad JSON-LD
  generate-assets.mjs        og-image.png + apple-touch-icon.png
  generate-artwork.mjs       the artwork itself: stage() + motifs, and the
                             public/art/*.webp stills. Exports stage()/PIECES.
  generate-artwork-motion.mjs public/art/*.webm looping clips, from the same
                             stage()  so a clip and its poster cannot drift
  lib/webm.mjs               WebM muxer (see "Encoding video with no ffmpeg")
```

Entrance motion is owned by each section through `<Reveal>`. There is no
global animation sweep  an earlier version ran one GSAP ScrollTrigger over
every `.gsap-reveal` in the document, which meant any component could animate
a node it did not render.

## Skills and tools to use

**`motion` skill + Motion MCP  required before writing any animation.**
Call `mcp__motion__search-motion-docs` first and build on what it returns;
read the `motion://docs/...` resource links with the MCP resource reader.
`mcp__motion__generate-css-easing` produces CSS `linear()` springs. Some
results are Motion+ and return metadata only  describe and link those, do
not reconstruct their source. Best practices are also on disk at
`~/.claude/skills/motion/best-practices/` and work with no server.

**shadcn CLI** for registry components. `npx shadcn@latest init` is already
done; add with `npx shadcn@latest add <name>`. Note the CLI's preset list is
`nova, vega, maia, lyra, mira, luma, sera, rhea`  there is no `base-nova`
preset even though that is what lands in `components.json` as the style;
`-b base -p nova` is the invocation that produced this config.

**`sharp`** for any image work (`npm run assets`). This machine has no
ImageMagick, no PIL, no `cwebp`. `convert` on PATH is Windows' filesystem
tool (`C:\Windows\system32\convert`)  never call it.

## Traps hit on this build

**`--virtual-time-budget` freezes Motion entrances.** Headless Chrome with
`--virtual-time-budget` (and equally a minimised or occluded tab, where
`document.visibilityState` is `"hidden"`) starves `requestAnimationFrame`.
Every Motion entrance stays pinned at its `initial` value, so the page
screenshots half-empty and looks like a bug that is not there  64 elements
sat at `opacity: 0` in a dump that was actually fine. **Drive the page over
CDP on real wall-clock time instead**, with
`Emulation.setFocusEmulationEnabled`. Scratch scripts for this pattern are in
the session scratchpad (`shots.mjs`, `reduced.mjs`).

**WAAPI rejects scroll offsets outside `[0,1]`.** Motion hands scroll-linked
`useTransform` input ranges to `ScrollTimeline` as keyframe offsets. Any range
built by padding a slice (`start - fade`, `end + fade`) throws
`Offsets must be null or in the range [0,1]` and blanks the page. Use
`clamp01()` from `src/lib/utils.js`  `WordReveal.jsx` does.

**`useTransform(value, callback)` is deprecated.** Use
`useTransform(value, inputRange, outputRange)`  it is also the form that can
run on the compositor. Motion's own published examples still use the old form;
do not copy it.

**Hooks cannot sit behind a feature flag.** `TiltCard`'s glare gradient is a
`useTransform` that must be hoisted above the `{glare && ...}` JSX, or the
hook order changes with the prop.

**`overflow-hidden` flattens `preserve-3d`.** A `translateZ` on a child of a
clipped card silently does nothing. Sell the depth with the tilt and a hover
lift instead.

**Absolute children anchor to their positioned ancestor, not the visual
centre.** In `DeviceShowcase` the phone and tablet are positioned against the
3D rig; when the rig was only as wide as the laptop, both devices parked on
top of the laptop screen and covered the content they exist to frame. The rig
is `w-full` for that reason.

**Grid cards need `h-full` on every link in the chain.** `Reveal` →
`TiltCard`'s perspective wrapper → `TiltCard`'s inner div → `Card`. Miss one
and the row stops matching heights. `TiltCard` takes `wrapperClassName` for
the outer element.

**`html { scroll-behavior: smooth }` breaks scripted scrolling.** Repeated
`window.scrollTo(0, y)` calls each restart a smooth scroll, so the page never
actually moves and `window.scrollY` stays 0. That made the velocity marquee
look broken when it was fine. Always pass `behavior: 'instant'` when driving
scroll from a test.

**Unbounded `useTransform` is for magnitude, not for legibility.**
`{ clamp: false }` on the marquee's velocity factor is right  momentum should
be allowed to keep accelerating the track. Feeding that same unbounded value
into `skewX` pushed it past 20deg on a hard flick and the words stopped being
readable. Clamp anything that affects whether text can be read.

**Syne's digits are meant to look like that.** The 7.5rem stage number in
`Process.jsx` reads as clipped in a downscaled screenshot; it is not. Syne has
a very squat `0` and a flat-footed `1`. Crop and magnify before "fixing" a
gradient-clipped glyph.

**`background-clip: text` needs the caret's own box.** In `CodeTypewriter`
the caret is positioned against an `inline-block` that hugs the text, not the
block-level line. Against the block, `left: 100%` means "right edge of the
card" rather than "end of this line", which both misplaces the caret and
overflows the container into a stray horizontal scrollbar.

**A theme swap wants View Transitions, not a CSS transition.**
`document.startViewTransition` cross-fades a snapshot of the whole page, so
gradients, shadows and images fade too. A CSS `transition` can only
interpolate the properties you list and pops everything else. `flushSync` is
required around the React state change, or the update lands after the "after"
snapshot is taken.

**Bulk find-and-replace invalidates your literals.** The light-theme
tokenisation pass rewrote `bg-white/10` and `bg-white/20` to the same
`bg-elevate-strong`, so a later patch script written against remembered
markup failed to match. Re-read the file before writing a replacement
literal.

**A scroll-locked body swallows `scrollIntoView`.** The mobile drawer sets
`body { overflow: hidden }`; React restores it on its *next commit*, which is
after the click handler returns. Calling `scrollIntoView` inside the handler
issued the scroll against a still-locked body and it was silently dropped 
every mobile nav link did nothing while desktop worked fine. `Navbar`
releases the lock explicitly and scrolls on the next frame.

**React synthesises `pointerenter` from `pointerover`.** A hand-dispatched
non-bubbling `PointerEvent('pointerenter')` never reaches React's delegated
root listener, so a hover test built that way reports a false failure. Drive
hover with CDP `Input.dispatchMouseEvent` instead.

**A frosted surface cannot be faded.** Per the Filter Effects spec, an
ancestor with `opacity < 1`  or `will-change: opacity`  becomes a *backdrop
root*. While the services dropdown faded in, the only thing behind it for
`backdrop-filter` to sample was its own animating wrapper, which is empty; on
the frame opacity reached 1 the backdrop root disappeared and the blur snapped
to sampling the real page. That snap reads as a flicker, and no amount of
layer promotion, `transform-gpu` or `will-change` fixes it, because it is not
a rasterisation problem. Either drop the blur on that surface
(`--glass-bg-flat` is the token this design system already switches to on
touch) or animate nothing but its descendants. The nav dropdown took the first
option, which is also better for legibility over arbitrary page content.

**An unregistered custom property inside @keyframes animates discretely in
Blink.** `korame-trace` interpolated `stroke-dashoffset` from
`var(--trace-len)` to `calc(var(--trace-len) * -1)`, with `--trace-len: 100`
set inline. An unregistered custom property is an untyped token stream, so
after substitution Blink saw a bare `<number>` at one end and a `calc()`
yielding a `<number>` at the other, could not resolve a common interpolable
type, and fell back to a **discrete** animation: the value flipped at the
midpoint instead of sweeping. The circuit pulse sat at one end of the trace,
jumped to the other, and read as frozen. WebKit interpolates the same
declaration happily  so it was flawless on iPhone and stuck on Android,
reported as an Android bug when it was every Blink browser including the
desktop Chrome it could have been caught in. Use literal values with units in
keyframes, or register the property with `@property` so it has a type. A var
that is only ever read once  `animation-duration`  is fine.

Symptom to recognise: the animation's `playState` is `running` and other
properties in the same keyframes interpolate normally, while the one fed by a
var reports exactly two computed values. `getComputedStyle` showing
`calc(-100px)` rather than `-100px` is the tell that a value came through
untyped var substitution.

**A fluid font size needs a fluid offset.** The footer watermark is
`text-[15vw]` and was positioned `-bottom-6`  a fixed 24px. The fraction of
the wordmark cut off therefore grew as the viewport shrank: 24px of a 216px
glyph at 1440 is the intended 11% bleed, but 24px of a 54px glyph on a 360px
phone is 44%, so half the letterforms were gone. It is `-bottom-[0.11em]` now,
which resolves against the element's own font size and holds the proportion at
every width. Anything pairing a `vw` font size with a `px` offset, inset or
translate has this bug waiting in it.

**Replacing a tile is invisible in production without a new URL.** Files
under `/art/` have stable names and are served `cache-control: public,
max-age=2592000`, so swapping `studio.webp` changes the bytes behind a URL
every returning visitor already holds  they keep the old artwork for up to
thirty days. The CDN was correct, the markup was correct, the bytes matched by
md5, and the page still showed the old art. A hard refresh fixes it for one
person and for nobody else. `generate-art-manifest.mjs` now emits
`ART_VERSION`, a content hash per tile, and `TileImage` appends it as `?v=` to
every src, srcSet candidate, poster and `<source>`. The query string is part of
the HTTP cache key, so new bytes mean a new URL; unchanged tiles keep their
thirty days. Anything else that starts serving mutable content from a stable
`public/` path needs the same treatment  Vite fingerprints `/assets/` for you,
and `public/` is copied verbatim, so it gets nothing.

**A media query cannot gate a Motion `animate` key on a pre-rendered page.**
`useMediaQuery` has no media query to read on the server, so its server
snapshot is `false` and the pre-rendered HTML always ships the *desktop*
branch's `initial` inline  the hero headline went out as
`style="opacity:0;filter:blur(12px)"` on every device. The real value only
arrives on the re-render after hydration, and by then `coarse` had removed
`filter` from `animate`: Motion stops owning the value and never writes it
again, so that pre-rendered blur stayed on `Captivate & Convert.` for good on
every phone and tablet, while desktop was fine. Keep every animated key
present in `animate` on all devices and vary the *value* (`blur(0px)`), and
express "no entrance" as `initial={false}`  which snaps to the animate state
 never as `initial`/`animate`/`variants` set to `undefined`, which leaves
the pre-rendered hidden state in the DOM with nothing to clear it. Verify with
CDP `Emulation.setEmulatedMedia` `hover: none` + `pointer: coarse`; dev mode
cannot show this, because a client-only mount reads the query correctly on the
first render.

**Motion writes `transform`, so nothing else may own it.** The same dropdown
carried `-translate-x-1/2` for centring on the very element Motion was
animating `y` and `scale` on. Put positioning transforms on a separate,
static wrapper.

**Tailwind arbitrary-property overrides are order-dependent.** Passing
`className="[--gap:1rem]"` against a component's own `[--gap:3rem]` is equal
specificity  the winner depends on stylesheet order, not call order. Expose a
prop and set it via inline `style`.

## Performance posture

- No decorative network images. The previous build pulled four Unsplash photos
  (including one 2000px background) purely for decoration on a page that
  advertises sub-second loads. Section artwork is generated CSS/SVG.
- Fonts are self-hosted and subset by `@fontsource`, not a render-blocking
  Google Fonts `<link>`.
- Ambient background motion (`Aurora`) is CSS animating `transform` only, so
  each bloom stays on its own compositor layer.
- Pointer-driven motion (`TiltCard`, `Magnetic`) stores position in
  MotionValues and measures the rect on `pointerenter`, never per frame.

## Theming

**Every colour must come from a token in `src/index.css`.** A hardcoded
`bg-white/5` or `oklch(0 0 0 / .4)` looks right in exactly one theme and
silently breaks the other; the first light-mode pass had 52 of them to unpick.
Use `bg-elevate` / `bg-elevate-strong` / `bg-field` / `border-border` /
`text-ghost` and the `--shadow-tint*` variables rather than raw white/black
alphas. Light and dark also differ in `--aurora-alpha`, `--grain-alpha` and
`--grain-blend`, because ambient blooms that read as atmosphere on black turn
to mud on white.

The theme class is applied by a **blocking inline script in `index.html`**,
not by React. Deciding it in a component would paint the default palette
first and flash white for dark-mode users on every load. `ThemeProvider`
adopts whatever that script already decided rather than re-applying it.

## Accessibility baseline

Every animation respects `useReducedMotion()` / `prefers-reduced-motion`, and
reduced motion renders the **final** state rather than a degraded animation 
scroll-linked transforms are skipped entirely, not slowed. Verified: with the
media feature forced on, no element anywhere on the page is left below 0.4
opacity.

## Commands

```
npm run dev      # vite dev server (one HTML file, no pre-render)
npm run build    # client bundle -> SSR bundle -> pre-render -> verify
npm run verify   # content + built-output checks, without rebuilding
npm run sitemap  # regenerate public/sitemap.xml + robots.txt
npm run assets   # regenerate og-image, apple-touch-icon and the artwork
```

`npm run build` is four steps and every one of them matters:

1. `vite build`  the client bundle.
2. `vite build --ssr src/entry-server.jsx --outDir .ssr`  a Node-loadable
   copy of the app, used once and deleted by the pre-render script.
3. `scripts/prerender.mjs`  renders every route in `lib/routes.js` and writes
   it as its own `index.html`.
4. `scripts/verify-build.mjs`  refuses to ship an unrendered route.

`prebuild` regenerates the art manifest, runs `verify-content.mjs` and
regenerates the sitemap, so none of those can be stale in a build.

The `lint` script was **removed**: it invoked eslint, which is not installed,
so it failed on every run. Add eslint and put it back, or leave it out.

## Tile artwork

Everything lives in `public/art/`, keyed by tile name.

The **eight service tiles and the contact page's studio card are photographs**,
not generated artwork, and each owns its own image.
`scripts/generate-tile-art.mjs` builds them from the source renders in
`scripts/tile-art/`, where **the source file name is the tile name**:
`service-web-development.png` becomes `service-web-development.webp`, which is
the `art` key `/web-development` declares, and `studio.png` becomes the
`studio` tile. No mapping table to keep in step.

The sources live outside `public/` because `public/` is copied into `dist/`
verbatim  a 2MB source PNG left in `public/art/` ships to the CDN origin with
nothing linking to it.

They are stills. Sources are 3:2 and the tiles are 16:10, so the generator
centre-crops 32px off the top and bottom  but every container these land in
is wider still, so only a middle band survives: the contact card is about
2.3:1 and shows roughly the middle 55% of the source height. Anything that
must stay visible has to sit near the centre. `FOCUS` in the generator moves
one tile's crop anchor when a composition needs it.

**A tile moving from generated art to a photograph has to lose its `.webm`
too.** `TileImage` renders `<video>` whenever the manifest lists a clip for
that name, so leaving `studio.webm` in place would have played the old
abstract animation with the new photograph demoted to its poster. Its entry in
`generate-artwork.mjs` and `generate-artwork-motion.mjs` has to go as well, or
the next `npm run artwork` puts both back.

**Nothing references the generated abstract artwork any more.**
`service-commerce`, `service-design`, `service-seo`, `work-saas`, `work-ai`
and `streams` are all orphaned  1.62MB still shipping in `dist/art/`.
`generate-artwork.mjs` and `generate-artwork-motion.mjs` still emit them, and
`scripts/lib/webm.mjs` exists only for those clips.

The three case-study tiles are **not** generated abstract artwork. They are
each project's own logo on a paper field, built by
`scripts/generate-project-tiles.mjs` from the source marks in `scripts/brand/`:

| Tile | name |
|---|---|
| Kepaso | `project-kepaso` |
| NomadNinja | `project-nomadninja` |
| The Travellers Tribe | `project-the-travellers-tribe` |

Three things about those tiles are load-bearing:

- **They are light, not deep-toned.** NomadNinja's mark is an ink-brush drawing
  in near-black; on a dark field it vanishes. Paper is the only background all
  three marks read on, and it is what they were drawn for.
- **The field is a half-step deeper than each brand's real paper.** The light
  theme's `--card` is pure white, and at the brands' true paper values the
  Tribe tile was indistinguishable from the card containing it.
- **`LOGO_HEIGHT` is capped at 230px of the 750px tile.** `TileImage` renders
  `object-cover` with a permanent `scale-[1.18]`, and the case-study hero is
  roughly 3.6:1 against a 16:10 image  only the middle ~37% of the image
  height survives there. A larger logo looks fine on the homepage grid and is
  cut in half on the case-study page. Check both.

These tiles are stills only. They are logos; they should not animate, and
having no `.webm` beside them is what makes `TileImage` render an `<img>`.

`work-commerce` and `work-seo` were removed from `PIECES` when the case
studies stopped using them  607 kB of artwork that nothing referenced. Pieces
are independent (`stage()` calls `rng(seed)` per piece), so dropping one
cannot change how the others render. `streams` is still generated and still
unreferenced; drop it too if nothing claims it.

```
public/art/<name>.webm    motion, preferred (best compression)
public/art/<name>.mp4     motion, fallback for older Safari
public/art/<name>.webp    still  poster frame + reduced-motion fallback
public/art/<name>@600.webp  narrow-viewport still (srcSet)
```

The still is **required**; the motion files are optional per tile. Ratio
16:10 (1200×750). Keep clips short (3–6s), seamlessly looping, and silent 
they are rendered muted and audio would be dead weight.

`src/lib/art-manifest.js` is **generated** by
`scripts/generate-art-manifest.mjs` from the contents of that directory, and
runs in `prebuild`. Drop a file in, rebuild, done  no code edit. The
manifest exists because a `<video>` whose `<source>` 404s still fires the
request, so letting the component try-and-fail would log a network error for
every still tile on every page load.

The `.webp` stills **and** the `.webm` clips are **generated placeholders**
from `npm run artwork`  edit `scripts/generate-artwork.mjs`, never the output
files. Replace them with real work when you have it.

Clips are 960x600 (the tile's own 16:10, so `object-cover` crops nothing),
5s at 12fps, silent, ~2.4MB for all eight.

**Motion is written as displacement, so the loop cannot show a seam.** Every
animated term in `generate-artwork.mjs` is built from `dsin`/`dcos`  which
return the offset *from* the resting position and so are exactly 0 at t=0 for
any phase  or from `env(t)`, a `sin^2` envelope that is 0 at both ends and
carries the travelling highlights. Two properties fall out and are worth
keeping: rendering at t=0 reproduces the still byte for byte (so the poster and
frame 0 can never drift), and the wrap is just another frame  measured at
0.5-1.3 grey levels against 2.2-9.4 for an ordinary mid-loop step.

Adding a `rand()` call inside a motif reshuffles every later draw and silently
relays out the whole piece. Derive per-element phase from geometry with
`phaseOf(x, y)` instead  that is why it exists.

`TileImage` handles playback: muted + `playsInline` (iOS refuses inline
autoplay otherwise), play/pause driven by an IntersectionObserver so
off-screen clips do not decode, and no video at all under reduced motion.
Either way the artwork drifts against scroll  that parallax is the point on
touch, where hover tilt and hover zoom do nothing.

**Animated WebP/GIF also works** if dropped in as `<name>.webp`, since an
`<img>` plays it  but it cannot be paused, so it ignores
`prefers-reduced-motion`. Prefer video.

## Encoding video with no ffmpeg

This machine has no ffmpeg, no ImageMagick and no encoder library, and adding
one for a build-time asset step was not justified. `scripts/lib/webm.mjs`
closes the gap: a lossy WebP file *is* a single VP8 keyframe in a RIFF
wrapper, so `sharp` is used as the video encoder  each frame is encoded to
WebP, the `VP8 ` chunk is unwrapped, and the frames are muxed straight into a
WebM container. `npm run artwork` therefore regenerates the clips with no new
dependency and no external tool.

The trade-off is that every frame is a keyframe: no inter-frame prediction, so
size scales with resolution x fps x duration far more steeply than a real
encode. It is affordable only because the artwork is dark, flat and
gradient-based (~4-6KB a frame). **Re-measure before raising `SIZE`, `FPS` or
`QUALITY`** in `generate-artwork-motion.mjs`. One upside: every frame is
independently decodable, so looping and seeking never stall.

Encode opaque and non-animated. An alpha channel or animation makes libwebp
emit `VP8X` rather than a bare `VP8 ` chunk, and `vp8FromWebP` rejects it
rather than write a file that will not decode.

## Live audit tool

Sources live in `src/lib/audit.js`. Everything must be callable from the
browser, so: CORS-enabled and ideally keyless.

**Primary (keyless, always runs): MDN HTTP Observatory.**
`POST https://observatory-api.mdn.mozilla.net/api/v2/scan?host=…`  free, no
key, `access-control-allow-origin: *`. Returns a real security grade, score,
tests passed and the host's status code. This is what makes the section work
with zero configuration. Note v2 exposes **only** the summary; there is no
per-test endpoint (`/api/v2/tests` 404s), so specific findings link out to
`details_url` on MDN.

**Optional: Google PageSpeed Insights.** Only attempted when
`VITE_PSI_API_KEY` is set, and adds the four Lighthouse scores plus Core Web
Vitals. **Do not call PSI keyless.** Its anonymous quota is one pool shared by
every anonymous caller on the internet and is permanently exhausted  a
keyless request returns `429 RESOURCE_EXHAUSTED` immediately, not under load.
That is a guaranteed failure, not a degraded path.

The security scan is awaited as the required source; performance and the
timing probe run alongside it and are allowed to fail individually without
taking the report down.

## Fabricated content that was removed

Three things on the old build asserted facts that were not true:

- `src/components/Reviews.jsx`  three testimonials with invented names,
  invented companies and an invented metric ("bounce rate dropped 45%").
  **Still removed.** Real testimonials need real permission.
- `src/components/Work.jsx`  "Project One" … "Project Four" with em-dash
  metrics, replaced by `SelectedWork.jsx` and the three real case studies.
  **Still removed.**
- `src/components/Pricing.jsx`  **restored**, at the owner's explicit
  instruction and with the figures confirmed as the ones to publish. See
  below.

The Hero stat row asserted "50+ projects delivered", "99.9% uptime" and
"100% client satisfaction". It now shows facts about the site itself, all of
which are derived from the code so they cannot go stale.

### Pricing

`/pricing` publishes ₹45,000 (Launch) and ₹1,20,000 (Scale) as `Offer` nodes
with `priceCurrency: "INR"`, which Google may surface in a result. **These are
prices the business has to honour.** They were flagged before restoring, and
restoring them was the answer.

The numbers live in `src/content/pricing.js` and nowhere else.
`offerCatalogNode()` in `lib/seo.js` builds the schema from the same array the
page renders, so the two cannot disagree  which is exactly how the previous
build ended up quoting figures its own file header described as placeholders.
Change a price there and the page, the schema and the sitemap's lastmod all
move together.

`verify-content.mjs` will not catch a fabrication or a stale price  that is a
judgement, not a check.

## Routing and pre-rendering

The site is **23 routes plus a 404**, not a single page.

`src/lib/routes.js` is the registry. The router, `generate-sitemap.mjs` and
`prerender.mjs` all read it, so a page cannot exist without a sitemap entry,
and a sitemap entry cannot 404.

**Every route is pre-rendered to its own `index.html`.** `/about` is
`dist/about/index.html`, served straight from the CDN with complete markup and
its own `<head>`. React hydrates that markup rather than building it.

Traps in this area, all of which cost real time:

**`renderToString` cannot resolve `React.lazy`.** It renders the Suspense
fallback and returns, which produced 21 empty documents and no `<Seo>`
descriptor. `renderToPipeableStream` with `onAllReady` waits for every
boundary to settle, so code splitting costs the static HTML nothing.

**`vite preview` cannot be used to check this build.** It runs in SPA mode and
history-falls-back every extensionless path to `index.html`, so every route
serves the *homepage's* markup and then hydrates a different tree. That looks
exactly like a hydration bug and is not one. Serve `dist/` with something that
resolves `<path>/index.html` the way Azure does.

**A minified React hydration error tells you nothing.** "Minified React error
#418" carries no component stack. Build the client once through a throwaway
config with `define: { 'process.env.NODE_ENV': '"development"' }` and
`build.minify: false` to get the real message and the offending component.

**The pre-rendered JSON-LD needs `data-seo` on its `<script>`.** Without it
`<Seo>` does not recognise the block as its own, leaves it in place and
appends a second copy on hydration  every page then ships the graph twice,
with duplicate `@id` nodes.

**Anything the app shell imports lands in the entry bundle.** The navbar and
footer list all eight services; importing the full content modules to do that
put every service page's prose into the bundle every visitor downloads.
`content/service-list.js` exists for that reason, and `verify-content.mjs`
fails the build if the light list and the full modules disagree.

**Pre-rendered HTML is produced with the light palette.** `ThemeProvider`
therefore starts `resolved` at `'light'` on both sides of hydration and adopts
the real value in an effect. Reading the document class in the state
initialiser instead makes a dark-mode visitor hydrate a tree that disagrees
with the markup React is attaching to. The palette itself never flashes  the
blocking script in `index.html` still applies `.dark` before first paint.

**Collapsed FAQ answers must stay in the DOM.** Google requires FAQPage answer
text to be present in the HTML it receives, and with pre-rendering that HTML
is the initial render. `FaqList` height-animates instead of unmounting, and
marks closed panels `inert`.

**`trailingSlash` must be `"never"`** in `staticwebapp.config.json`. Every
canonical this site emits is slash-free; under `"auto"` Azure would 301 each
canonical URL to its trailing-slash form.

**The navigation fallback must exclude asset paths.** A fallback that catches
everything serves `index.html` with a 200 for any missing file, which is the
soft-404 pattern that fills Search Console with URLs nobody created. See
`/blog/azure-static-web-apps-404-on-refresh`, which is about exactly this.

## Deployment  unresolved

Two workflows deploy this repository on every push to `main`:
`azure-static-web-apps-black-tree-0042fdd00.yml` and `deploy.yml` (GitHub
Pages). `public/CNAME` claims `korame.in` for GitHub Pages.

Only one host can own `korame.in`, and the other is then serving a full copy
of the site on a domain the canonical tags all point away from. The Azure
workflow has been updated to build and verify explicitly (`skip_app_build`,
because Oryx would otherwise rebuild in an image we do not control and a
failed pre-render would be invisible). **Pick a host and delete the other
workflow.** If Azure wins, `public/CNAME` should go too.
