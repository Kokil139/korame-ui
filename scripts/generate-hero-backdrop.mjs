/**
 * Generates the hero backdrop  the pale-field filament bloom behind the
 * whole document  as a still poster and a looping clip from one definition.
 *
 * ── Why this is not a tile in generate-artwork.mjs ───────────────────────
 * Those pieces share `stage()`, which is a *deep-toned* ground: near-black
 * with two colour blooms, sized 1200x750 for a 16:10 card. This is the
 * opposite job. It is a pale, high-key field that fills the viewport at 16:9
 * and sits *behind live body copy* on every route, so it has its own stage
 * and its own palette. Folding it into `stage()` would have meant a second
 * ground, a second aspect and a second vignette inside a function whose whole
 * value is that every tile shares one.
 *
 * ── The palette is measured, not invented ────────────────────────────────
 * Sampled from the reference render this replaces (a 1920x1080 fibre-optic
 * bloom): field #b0c2d0-#b9cad9, filaments pure white, core amber #e07e1a
 * rising to #ffca00 at the hottest tips. The amber is within a hair of the
 * site's own --brand-500 hue, which is why the clip sat on-brand to begin
 * with and why the replacement can keep the same relationship to the tokens.
 *
 * ── Motion is displacement, so the loop cannot show a seam ───────────────
 * Every animated term is built from `dsin`/`dcos` (offset *from* rest, so
 * exactly 0 at t=0 for any phase) or from `env(t) = sin(pi*t)^2`, which is 0
 * with zero gradient at both ends. Two properties fall out, and both are
 * load-bearing:
 *
 *   1. Rendering at t=0 reproduces the still byte for byte, so the poster and
 *      frame 0 can never drift apart.
 *   2. The wrap is just another frame, so the clip can be scrubbed backwards
 *      past 0 or forwards past 1 without a pop.
 *
 * The arc this traces over one loop is deliberate: t=0 is a gathered bundle,
 * t=0.5 the full radial bloom, t=1 gathered again. Mapped onto the page that
 * means the hero opens on the bundle, the bloom peaks around mid-document and
 * settles back to rest at the footer.
 *
 * ── No grain here ────────────────────────────────────────────────────────
 * The reference is visibly grainy and it is tempting to reproduce that. Do
 * not: film grain is high-frequency noise, which is the single most expensive
 * thing you can hand a WebP encoder, and every frame of this clip is a
 * keyframe (see scripts/lib/webm.mjs). A grain pass measured +240% on output
 * size. The design system already lays grain over the page in CSS via the
 * `grain` utility, which costs nothing per frame and covers the video too.
 *
 * Run with: npm run artwork  (also part of `npm run assets`)
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { rng, dsin, dcos, env } from './generate-artwork.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'art');

export const NAME = 'hero-bloom';

/* 16:9, because this one fills the viewport rather than a card. */
const W = 1536;
const H = 864;

/* Frame budget. Every frame is a keyframe, so bytes scale linearly with this
   number and there is no GOP to amortise them over  see the header of
   generate-artwork-motion.mjs. 120 frames at 24fps is a 5s clip, which gives
   the hero's own autoplay leg (0 -> 0.2) 24 real frames, enough to read as
   motion rather than as a slideshow. Re-measure before raising any of these. */
const FPS = 16;
const FRAMES = 80;

/**
 * Two palettes, because this piece cannot be theme-neutral.
 *
 * The tile artwork in generate-artwork.mjs gets away with one set: those are
 * deep-toned compositions that sit inside a card, so they read as "a dark
 * picture" in either theme. This one *is* the page background, edge to edge,
 * and a pale blue-grey field behind a dark theme does not read as atmosphere
 * it reads as the wrong stylesheet having loaded. The first cut shipped the
 * light field to both themes and the dark homepage came out pale, with the
 * amber core smeared through the 0.72 scrim as an orange stain over the audit
 * and contact sections.
 *
 * Only the ground and the vignette really change. The filaments stay white and
 * the core stays amber in both, which is what keeps the two variants
 * recognisably the same artwork.
 */
const PALETTES = {
    /* Sampled from the reference render. */
    light: {
        fieldTop: '#c1d1de',
        fieldBottom: '#a8bbca',
        fibre: '#ffffff',
        amber: '#e07e1a',
        amberHot: '#ffca00',
        amberSoft: '#f6c797',
        fibreEdge: '#ffffff',
        count: 150,
        haloOpacity: 0.5,
        vignetteOpacity: 0.55,
        quality: 54,
    },
    /* Ground matched to the dark theme's --background, oklch(0.16 0.012 258).
       Glowing fibre on near-black needs no extra help: the same white strands
       and the same amber core simply read as emissive instead of lit. */
    dark: {
        fieldTop: '#1b1f27',
        fieldBottom: '#0f1116',
        fibre: '#ffffff',
        amber: '#e07e1a',
        amberHot: '#ffca00',
        amberSoft: '#f6c797',
        /* The strands fall off toward the ground at their far ends rather
           than staying pure white to the tip. That is how an emissive fibre
           actually reads  brightest at the source  and it is also the
           single biggest lever on the size of this variant: 150 full-white
           strands against near-black is maximum edge energy for the encoder,
           and the dark clip measured 2.1MB against the light one's 0.9MB
           before this stop existed. Lowering `quality` barely touched it
           (q54 49.7KB -> q24 33.0KB on the busiest frame); dimming the tips
           did. */
        fibreEdge: '#5b6675',
        count: 96,
        haloOpacity: 0.16,
        vignetteOpacity: 0.75,
        quality: 46,
    },
};

/* The bloom sits right of centre. The hero sets its display type bottom-left,
   so the busiest part of the picture is kept out from under the headline
   rather than scrimmed back down afterwards. */
const CX = W * 0.6;
const CY = H * 0.44;

/* Vertical foreshortening. The reference disc is seen a few degrees off axis;
   1.0 here would draw it face-on, which reads as a flat asterisk. */
const SQUASH = 0.82;

const TAU = Math.PI * 2;

/** Per-element phase from geometry, never from `rand()`.
    Pulling a fresh random here would reshuffle every later draw and silently
    relay out the whole piece  the same trap documented for the tile motifs. */
const phaseOf = (x, y) => (((x * 0.0131 + y * 0.0179) % 1) + 1) % 1;

const n = (v) => Number(v.toFixed(2));

/**
 * The filaments.
 *
 * Each is one quadratic stroke from an inner radius to an outer one, with a
 * perpendicular control point so it bows rather than spiking straight out.
 * They are stroked with a single radial gradient anchored at the bloom centre
 * (`url(#fibre)`), which is what puts amber at the core and white at the tips
 * without giving each strand its own gradient  1 gradient instead of 160.
 */
function filaments(rand, t, P) {
    const COUNT = P.count;
    const bloom = env(t);
    let out = '';
    let caps = '';

    for (let i = 0; i < COUNT; i += 1) {
        /* Five draws per filament, in a fixed order, so the layout is stable
           across runs and independent of anything drawn after it. */
        const jitterAngle = (rand() - 0.5) * 0.09;
        const lengthScale = 0.3 + rand() * 0.72;
        const widthScale = 0.4 + rand() * 0.6;
        const bowJitter = rand() - 0.5;
        const depth = rand();

        /* Non-uniform angular spacing. A perfectly even fan reads as a
           clip-art sunburst; bunching the strands into soft clusters is what
           makes it look like a bundle that has been fanned out. The sine term
           compresses spacing where its gradient is shallow. */
        const u = i / COUNT;
        const base = u * TAU + 0.3 * Math.sin(3 * u * TAU) + jitterAngle;

        /* Sway. Phase comes from the filament's resting endpoint, so
           neighbours drift apart instead of marching in lockstep. */
        const px = CX + Math.cos(base) * 200;
        const py = CY + Math.sin(base) * 200;
        const ph = phaseOf(px, py);
        const angle = base + 0.075 * dsin(t, ph);

        /* Gathered at t=0, fully fanned at t=0.5. The inner radius opens a
           little too, which is what turns a starburst into a ring. */
        const r0 = 16 + 30 * bloom;
        const r1 = r0 + (150 + 430 * bloom) * lengthScale * (1 + 0.07 * dcos(t, ph));

        /* Foreshortening. The reference is a disc seen a few degrees off
           axis, not face-on; squashing y is the whole difference between
           reading as a sphere of light and reading as a flat asterisk. */
        const x0 = CX + Math.cos(angle) * r0;
        const y0 = CY + Math.sin(angle) * r0 * SQUASH;
        const x1 = CX + Math.cos(angle) * r1;
        const y1 = CY + Math.sin(angle) * r1 * SQUASH;

        /* Control point pushed along the perpendicular, so the strand bows.
           The bias is deliberate and one-directional: a symmetric random bow
           averages out to a starburst, while a consistent lean makes the
           whole bloom turn like a pinwheel as it opens. */
        const mid = (r0 + r1) / 2;
        const curl = (0.42 + bowJitter * 0.85) * (14 + 52 * bloom);
        const cxp = CX + Math.cos(angle) * mid - Math.sin(angle) * curl;
        const cyp = (CY + Math.sin(angle) * mid * SQUASH) + Math.cos(angle) * curl;

        /* `depth` stands in for distance from camera: near strands are wider
           and brighter, far ones thin out into the field. It is what keeps a
           200-strand bloom from reading as a solid disc. */
        const width = (1.5 + 2.2 * widthScale) * (0.55 + 0.65 * depth) * (1 - 0.25 * bloom);
        const alpha = (0.3 + 0.42 * depth) * (0.5 + 0.5 * bloom);

        out += `<path d="M${n(x0)} ${n(y0)}Q${n(cxp)} ${n(cyp)} ${n(x1)} ${n(y1)}" fill="none" stroke="url(#fibre)" stroke-opacity="${n(alpha)}" stroke-width="${n(width)}" stroke-linecap="round"/>`;

        /* Bright cap on the nearest tips only. Capping all 210 would read as
           a dotted ring and cost three times the bytes for it. */
        if (depth > 0.62) {
            const r = (1.5 + 2.3 * widthScale) * (0.45 + 0.55 * bloom);
            caps += `<circle cx="${n(x1)}" cy="${n(y1)}" r="${n(r)}" fill="${P.fibre}" fill-opacity="${n(0.45 + 0.4 * bloom)}"/>`;
        }
    }

    return `<g>${out}</g><g filter="url(#tip)">${caps}</g>`;
}

/** Drifting bokeh. Depth cue, and it keeps the empty left field from reading
    as a flat plate behind the headline. */
function motes(rand, t, P) {
    const COUNT = 26;
    let out = '';
    for (let i = 0; i < COUNT; i += 1) {
        const bx = rand() * W;
        const by = rand() * H;
        const br = 2.5 + rand() * 11;
        const ba = 0.08 + rand() * 0.2;
        const ph = phaseOf(bx, by);
        const x = bx + 26 * dsin(t, ph);
        const y = by + 18 * dcos(t, ph * 0.7);
        out += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(br)}" fill="${P.fibre}" fill-opacity="${n(ba * (0.45 + 0.55 * env(t)))}"/>`;
    }
    return `<g filter="url(#soft)">${out}</g>`;
}

/**
 * One frame of the backdrop at loop position `t` in [0, 1).
 *
 * Exported so the still and the clip are two renders of one definition rather
 * than two drawings that can drift apart  the same contract `stage()` holds
 * for the tiles.
 */
export function heroStage(t = 0, variant = 'light', seed = 7) {
    const P = PALETTES[variant];
    if (!P) throw new Error(`unknown palette: ${variant}`);
    const rand = rng(seed);
    const bloom = env(t);

    /* Core glow radius. Rides the envelope so the centre lights up as the
       strands open and banks back down as they close. */
    const coreR = 62 + 96 * bloom;

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="field" x1="0" y1="0" x2="0.25" y2="1">
      <stop offset="0%" stop-color="${P.fieldTop}"/>
      <stop offset="100%" stop-color="${P.fieldBottom}"/>
    </linearGradient>

    <!-- One gradient for every strand. Anchored in user space at the bloom
         centre, so a strand is amber where it leaves the core and white by
         the time it reaches its tip, with no per-strand gradient needed. -->
    <radialGradient id="fibre" gradientUnits="userSpaceOnUse"
                    cx="${n(CX)}" cy="${n(CY)}" r="${n(560)}">
      <stop offset="0%" stop-color="${P.amberHot}"/>
      <stop offset="6%" stop-color="${P.amber}"/>
      <stop offset="13%" stop-color="${P.amberSoft}"/>
      <stop offset="26%" stop-color="${P.fibre}"/>
      <stop offset="62%" stop-color="${P.fibre}"/>
      <stop offset="100%" stop-color="${P.fibreEdge}"/>
    </radialGradient>

    <radialGradient id="core" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${P.amberHot}" stop-opacity="0.5"/>
      <stop offset="34%" stop-color="${P.amber}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${P.amber}" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="halo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${P.fibre}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${P.fibre}" stop-opacity="0"/>
    </radialGradient>

    <!-- Vignette in the field's own colour, not black. A black vignette on a
         pale blue-grey field turns the corners to mud; this just deepens the
         blue slightly and keeps the picture high-key. -->
    <radialGradient id="vig" cx="52%" cy="45%" r="76%">
      <stop offset="55%" stop-color="${P.fieldBottom}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${P.fieldBottom}" stop-opacity="${P.vignetteOpacity}"/>
    </radialGradient>

    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
    <filter id="tip" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.6"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#field)"/>

  <!-- Ambient depth. Both drift on displacement oscillators, so they are back
       where they started at the wrap. -->
  <ellipse cx="${n(W * 0.22 + 54 * dsin(t))}" cy="${n(H * 0.2 + 30 * dcos(t))}"
           rx="${n(W * 0.4)}" ry="${n(H * 0.45)}" fill="url(#halo)" opacity="${P.haloOpacity}"/>

  <!-- Core glow, behind the strands so they read as lit from within. -->
  <ellipse cx="${n(CX)}" cy="${n(CY)}" rx="${n(coreR)}" ry="${n(coreR * SQUASH)}" fill="url(#core)"/>

  ${filaments(rand, t, P)}

  <!-- Hot centre, over the strand roots. -->
  <ellipse cx="${n(CX)}" cy="${n(CY)}" rx="${n(26 + 30 * bloom)}" ry="${n((26 + 30 * bloom) * SQUASH)}" fill="url(#core)" opacity="0.45"/>
  <circle cx="${n(CX)}" cy="${n(CY)}" r="${n(3 + 5 * bloom)}" fill="${P.amberHot}" fill-opacity="${n(0.5 + 0.3 * bloom)}" filter="url(#tip)"/>

  ${motes(rand, t, P)}

  <rect width="${W}" height="${H}" fill="url(#vig)"/>
</svg>`;
}

/* ------------------------------------------------------------------ build */

/** Render one frame to a VP8 keyframe, via sharp-as-encoder. */
async function frame(t, variant) {
    const webp = await sharp(Buffer.from(heroStage(t, variant)))
        .resize(W, H)
        /* Opaque and non-animated: an alpha channel would make libwebp emit
           VP8X rather than a bare `VP8 ` chunk, which vp8FromWebP rejects. */
        .flatten({ background: PALETTES[variant].fieldBottom })
        .webp({ quality: PALETTES[variant].quality, effort: 6, alphaQuality: 0 })
        .toBuffer();
    return webp;
}

async function mapLimit(items, limit, fn) {
    const out = new Array(items.length);
    let next = 0;
    await Promise.all(
        Array.from({ length: Math.min(limit, items.length) }, async () => {
            while (next < items.length) {
                const i = next++;
                out[i] = await fn(items[i], i);
            }
        }),
    );
    return out;
}

/** Build one variant: the poster, its narrow srcSet twin, and the clip. */
async function build(variant, vp8FromWebP, muxWebM) {
    /* `hero-bloom` and `hero-bloom-dark`. The manifest generator keys tiles by
       file name, so these are two independent tiles with their own content
       hashes  which is what lets one be replaced without busting the other's
       thirty-day cache. */
    const name = variant === 'light' ? NAME : `${NAME}-${variant}`;

    /* Poster and narrow variant, both at t=0  which is exactly frame 0 of
       the clip, so playback starts without a pop. */
    const still = Buffer.from(heroStage(0, variant));
    await sharp(still).resize(W, H).webp({ quality: 82, effort: 6 })
        .toFile(path.join(OUT, `${name}.webp`));
    await sharp(still).resize(600, Math.round((600 * H) / W)).webp({ quality: 78, effort: 6 })
        .toFile(path.join(OUT, `${name}@600.webp`));

    const indices = Array.from({ length: FRAMES }, (_, i) => i);
    const webps = await mapLimit(indices, 4, (i) => frame(i / FRAMES, variant));
    const webm = muxWebM(webps.map(vp8FromWebP), { width: W, height: H, fps: FPS });
    await writeFile(path.join(OUT, `${name}.webm`), webm);

    console.log(
        `  ${name.padEnd(17)} ${W}x${H}, ${FRAMES} frames @ ${FPS}fps  ` +
        `${(webm.length / 1024).toFixed(0).padStart(4)} KB  ` +
        `(${(webm.length / FRAMES / 1024).toFixed(1)} KB/frame)`,
    );
    return webm.length;
}

async function main() {
    const { vp8FromWebP, muxWebM } = await import('./lib/webm.mjs');
    await mkdir(OUT, { recursive: true });

    let total = 0;
    for (const variant of Object.keys(PALETTES)) {
        // eslint-disable-next-line no-await-in-loop -- sharp is already saturated
        total += await build(variant, vp8FromWebP, muxWebM);
    }

    /* Only one of these is ever fetched. ScrollVideo mounts the <video> from
       an effect rather than in the pre-rendered markup, so by the time a
       source is chosen the theme has already resolved and the other variant is
       never requested. */
    console.log(`  ${(total / 1024 / 1024).toFixed(2)} MB generated, one variant fetched per visitor`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
