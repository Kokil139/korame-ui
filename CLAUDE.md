# Project guide — Korame marketing site

## Standing rules

- Use Tailwind.
- Use Motion for UI animation. **Never** `framer-motion`.
- Do not introduce dependencies without justification.
- Follow the design system (tokens in `src/index.css`).
- Never rewrite working components unnecessarily.

## Actual stack

**Verify before assuming.** This file previously described a completely
different project — Tailwind v4 + React 19 + shadcn + R3F + `lenis`, with
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
| 3D | CSS 3D only — perspective + `preserve-3d`. No WebGL, no three.js |
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
  components/*.jsx       the page sections
scripts/
  generate-assets.mjs        og-image.png + apple-touch-icon.png
  generate-artwork.mjs       the artwork itself: stage() + motifs, and the
                             public/art/*.webp stills. Exports stage()/PIECES.
  generate-artwork-motion.mjs public/art/*.webm looping clips, from the same
                             stage() — so a clip and its poster cannot drift
  lib/webm.mjs               WebM muxer (see "Encoding video with no ffmpeg")
  generate-faq-schema.mjs  FAQPage JSON-LD, from the FAQS array
```

Entrance motion is owned by each section through `<Reveal>`. There is no
global animation sweep — an earlier version ran one GSAP ScrollTrigger over
every `.gsap-reveal` in the document, which meant any component could animate
a node it did not render.

## Skills and tools to use

**`motion` skill + Motion MCP — required before writing any animation.**
Call `mcp__motion__search-motion-docs` first and build on what it returns;
read the `motion://docs/...` resource links with the MCP resource reader.
`mcp__motion__generate-css-easing` produces CSS `linear()` springs. Some
results are Motion+ and return metadata only — describe and link those, do
not reconstruct their source. Best practices are also on disk at
`~/.claude/skills/motion/best-practices/` and work with no server.

**shadcn CLI** for registry components. `npx shadcn@latest init` is already
done; add with `npx shadcn@latest add <name>`. Note the CLI's preset list is
`nova, vega, maia, lyra, mira, luma, sera, rhea` — there is no `base-nova`
preset even though that is what lands in `components.json` as the style;
`-b base -p nova` is the invocation that produced this config.

**`sharp`** for any image work (`npm run assets`). This machine has no
ImageMagick, no PIL, no `cwebp`. `convert` on PATH is Windows' filesystem
tool (`C:\Windows\system32\convert`) — never call it.

## Traps hit on this build

**`--virtual-time-budget` freezes Motion entrances.** Headless Chrome with
`--virtual-time-budget` (and equally a minimised or occluded tab, where
`document.visibilityState` is `"hidden"`) starves `requestAnimationFrame`.
Every Motion entrance stays pinned at its `initial` value, so the page
screenshots half-empty and looks like a bug that is not there — 64 elements
sat at `opacity: 0` in a dump that was actually fine. **Drive the page over
CDP on real wall-clock time instead**, with
`Emulation.setFocusEmulationEnabled`. Scratch scripts for this pattern are in
the session scratchpad (`shots.mjs`, `reduced.mjs`).

**WAAPI rejects scroll offsets outside `[0,1]`.** Motion hands scroll-linked
`useTransform` input ranges to `ScrollTimeline` as keyframe offsets. Any range
built by padding a slice (`start - fade`, `end + fade`) throws
`Offsets must be null or in the range [0,1]` and blanks the page. Use
`clamp01()` from `src/lib/utils.js` — `WordReveal.jsx` does.

**`useTransform(value, callback)` is deprecated.** Use
`useTransform(value, inputRange, outputRange)` — it is also the form that can
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
`{ clamp: false }` on the marquee's velocity factor is right — momentum should
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
issued the scroll against a still-locked body and it was silently dropped —
every mobile nav link did nothing while desktop worked fine. `Navbar`
releases the lock explicitly and scrolls on the next frame.

**React synthesises `pointerenter` from `pointerover`.** A hand-dispatched
non-bubbling `PointerEvent('pointerenter')` never reaches React's delegated
root listener, so a hover test built that way reports a false failure. Drive
hover with CDP `Input.dispatchMouseEvent` instead.

**Tailwind arbitrary-property overrides are order-dependent.** Passing
`className="[--gap:1rem]"` against a component's own `[--gap:3rem]` is equal
specificity — the winner depends on stylesheet order, not call order. Expose a
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
reduced motion renders the **final** state rather than a degraded animation —
scroll-linked transforms are skipped entirely, not slowed. Verified: with the
media feature forced on, no element anywhere on the page is left below 0.4
opacity.

## Commands

```
npm run dev      # vite dev server
npm run build    # production build
npm run assets   # regenerate public/og-image.png + apple-touch-icon.png
```

`npm run lint` is declared in `package.json` but **eslint is not installed**
— that was already true before the redesign. Either add eslint or drop the
script.

## Tile artwork

Everything lives in `public/art/`, keyed by tile name:

| Tile | name |
|---|---|
| Services — full-stack & e-commerce | `service-commerce` |
| Services — bespoke UI/UX & motion | `service-design` |
| Services — hosting, domains & SEO | `service-seo` |
| Work — project 1 | `work-commerce` |
| Work — project 2 | `work-saas` |
| Work — project 3 | `work-ai` |
| Work — project 4 | `work-seo` |
| Contact — studio card | `studio` |

```
public/art/<name>.webm    motion, preferred (best compression)
public/art/<name>.mp4     motion, fallback for older Safari
public/art/<name>.webp    still — poster frame + reduced-motion fallback
public/art/<name>@600.webp  narrow-viewport still (srcSet)
```

The still is **required**; the motion files are optional per tile. Ratio
16:10 (1200×750). Keep clips short (3–6s), seamlessly looping, and silent —
they are rendered muted and audio would be dead weight.

`src/lib/art-manifest.js` is **generated** by
`scripts/generate-art-manifest.mjs` from the contents of that directory, and
runs in `prebuild`. Drop a file in, rebuild, done — no code edit. The
manifest exists because a `<video>` whose `<source>` 404s still fires the
request, so letting the component try-and-fail would log a network error for
every still tile on every page load.

The `.webp` stills **and** the `.webm` clips are **generated placeholders**
from `npm run artwork` — edit `scripts/generate-artwork.mjs`, never the output
files. Replace them with real work when you have it.

Clips are 960x600 (the tile's own 16:10, so `object-cover` crops nothing),
5s at 12fps, silent, ~2.4MB for all eight.

**Motion is written as displacement, so the loop cannot show a seam.** Every
animated term in `generate-artwork.mjs` is built from `dsin`/`dcos` — which
return the offset *from* the resting position and so are exactly 0 at t=0 for
any phase — or from `env(t)`, a `sin^2` envelope that is 0 at both ends and
carries the travelling highlights. Two properties fall out and are worth
keeping: rendering at t=0 reproduces the still byte for byte (so the poster and
frame 0 can never drift), and the wrap is just another frame — measured at
0.5-1.3 grey levels against 2.2-9.4 for an ordinary mid-loop step.

Adding a `rand()` call inside a motif reshuffles every later draw and silently
relays out the whole piece. Derive per-element phase from geometry with
`phaseOf(x, y)` instead — that is why it exists.

`TileImage` handles playback: muted + `playsInline` (iOS refuses inline
autoplay otherwise), play/pause driven by an IntersectionObserver so
off-screen clips do not decode, and no video at all under reduced motion.
Either way the artwork drifts against scroll — that parallax is the point on
touch, where hover tilt and hover zoom do nothing.

**Animated WebP/GIF also works** if dropped in as `<name>.webp`, since an
`<img>` plays it — but it cannot be paused, so it ignores
`prefers-reduced-motion`. Prefer video.

## Encoding video with no ffmpeg

This machine has no ffmpeg, no ImageMagick and no encoder library, and adding
one for a build-time asset step was not justified. `scripts/lib/webm.mjs`
closes the gap: a lossy WebP file *is* a single VP8 keyframe in a RIFF
wrapper, so `sharp` is used as the video encoder — each frame is encoded to
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
`POST https://observatory-api.mdn.mozilla.net/api/v2/scan?host=…` — free, no
key, `access-control-allow-origin: *`. Returns a real security grade, score,
tests passed and the host's status code. This is what makes the section work
with zero configuration. Note v2 exposes **only** the summary; there is no
per-test endpoint (`/api/v2/tests` 404s), so specific findings link out to
`details_url` on MDN.

**Optional: Google PageSpeed Insights.** Only attempted when
`VITE_PSI_API_KEY` is set, and adds the four Lighthouse scores plus Core Web
Vitals. **Do not call PSI keyless.** Its anonymous quota is one pool shared by
every anonymous caller on the internet and is permanently exhausted — a
keyless request returns `429 RESOURCE_EXHAUSTED` immediately, not under load.
That is a guaranteed failure, not a degraded path.

The security scan is awaited as the required source; performance and the
timing probe run alongside it and are allowed to fail individually without
taking the report down.

## Placeholder content — replace before launch

- `src/components/Work.jsx` — invented projects and em-dash metrics.
- `src/components/Pricing.jsx` — invented figures, mirrored by the `Offer`
  entries in `index.html`. Change both, or neither.

Publishing invented client work or prices you do not honour misrepresents the
business to its visitors, and the pricing is quoted to search engines through
structured data.

Debug: the site is a single page; there are no routes.
