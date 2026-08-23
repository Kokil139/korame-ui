/**
 * Generates the tile artwork for Services, Work and the Contact studio card.
 *
 * These are drawn here rather than pulled from a stock library for three
 * reasons: they are on-brand (same spectrum as the design tokens), they cost
 * no third-party request on a site whose pitch is sub-second loads, and stock
 * photography in an agency portfolio reads as filler.
 *
 * Each piece is a deep-toned composition so it sits correctly in both the
 * light and the dark theme without needing two sets.
 *
 * Run with: npm run artwork  (also part of `npm run assets`)
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'art');

const W = 1200;
const H = 750;

export const C = {
    ink: '#07080c',
    ink2: '#0d1018',
    indigo: '#6366f1',
    indigoDeep: '#4f46e5',
    cyan: '#22d3ee',
    violet: '#c084fc',
    white: '#ffffff',
};

/** Deterministic PRNG so re-running the script produces identical files. */
export function rng(seed) {
    let s = seed >>> 0;
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
    };
}

/**
 * Time is a normalised loop position, t in [0, 1). Every piece of motion below
 * is built from these three helpers, which is what makes the clips loop with
 * no visible seam and keeps frame 0 identical to the still poster:
 *
 * - `dsin`/`dcos` are *displacement* oscillators. They return the offset from
 *   the resting position, so they are exactly 0 at t=0 whatever their phase,
 *   and period-1 in t. Geometry therefore starts and ends at the still.
 * - `env` is a pulse envelope: 0 at t=0 and t=1, peaking mid-loop, with zero
 *   gradient at both ends. Travelling highlights ride it, so they fade in and
 *   back out within one loop instead of popping at the wrap.
 *
 * Consequence worth preserving: rendering at t=0 reproduces the static artwork
 * byte for byte, so the poster and the first video frame cannot drift apart.
 */
const TAU = Math.PI * 2;
export const dsin = (t, phase = 0) => Math.sin(TAU * (t + phase)) - Math.sin(TAU * phase);
export const dcos = (t, phase = 0) => Math.cos(TAU * (t + phase)) - Math.cos(TAU * phase);
export const env = (t) => Math.sin(Math.PI * t) ** 2;

/** Stable per-element phase derived from geometry, so it never disturbs the
    PRNG call order — adding a rand() call here would reshuffle every layout. */
const phaseOf = (x, y) => (((x * 0.0131 + y * 0.0179) % 1) + 1) % 1;

/**
 * Shared stage: deep ground, two colour blooms, a faint grid and a vignette.
 * `motif` draws the piece-specific geometry on top.
 */
export function stage({ a, b, motif, seed = 1, t = 0 }) {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="${C.ink2}"/>
      <stop offset="100%" stop-color="${C.ink}"/>
    </linearGradient>
    <radialGradient id="bloomA" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${a}" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="${a}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bloomB" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${b}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${b}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${C.cyan}"/>
      <stop offset="55%" stop-color="${C.indigo}"/>
      <stop offset="100%" stop-color="${C.violet}"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="translate(${40 * t} ${40 * t})">
      <path d="M40 0H0V40" fill="none" stroke="${C.white}" stroke-opacity="0.07" stroke-width="1"/>
    </pattern>
    <pattern id="ticks" width="200" height="200" patternUnits="userSpaceOnUse">
      <path d="M0 0H10M0 0V10" fill="none" stroke="${C.white}" stroke-opacity="0.22" stroke-width="1.5"/>
    </pattern>
    <radialGradient id="vig" cx="50%" cy="45%" r="75%">
      <stop offset="60%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.5"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="14"/></filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#ground)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#ticks)"/>
  <ellipse cx="${W * 0.24 + 44 * dsin(t)}" cy="${H * 0.16 + 28 * dcos(t)}"
           rx="${W * 0.44 + 26 * dsin(t, 0.25)}" ry="${H * 0.52 + 22 * dcos(t, 0.15)}" fill="url(#bloomA)"/>
  <ellipse cx="${W * 0.84 + 38 * dsin(t, 0.5)}" cy="${H * 0.88 + 24 * dcos(t, 0.35)}"
           rx="${W * 0.38 + 20 * dsin(t, 0.6)}" ry="${H * 0.46 + 18 * dcos(t, 0.7)}" fill="url(#bloomB)"/>

  ${motif(rng(seed), t)}

  <rect width="${W}" height="${H}" fill="url(#vig)"/>
</svg>`;
}

/* ---------------------------------------------------------------- motifs */

/** Stacked storefront cards receding in isometric space. */
const commerce = (rand, t) => {
    let out = '';
    for (let i = 0; i < 4; i++) {
        const w = 420 - i * 34;
        const h = 250 - i * 20;
        // Staggered phase down the stack, so the cards swell as a wave
        // travelling into the depth rather than moving as one slab.
        const x = 250 + i * 70 + 10 * dcos(t, i * 0.11);
        const y = 190 + i * 62 + 16 * dsin(t, i * 0.14);
        const o = 0.9 - i * 0.18;
        out += `
      <g transform="translate(${x} ${y}) skewY(-14)" opacity="${o}">
        <rect width="${w}" height="${h}" rx="18" fill="${C.ink2}" fill-opacity="0.92"
              stroke="${C.white}" stroke-opacity="0.14"/>
        <rect x="22" y="22" width="${w * 0.42}" height="12" rx="6" fill="${C.white}" fill-opacity="0.4"/>
        <rect x="22" y="46" width="${w * 0.24}" height="10" rx="5" fill="${C.white}" fill-opacity="0.16"/>
        <rect x="22" y="${h - 78}" width="${w - 44}" height="56" rx="12"
              fill="url(#edge)" fill-opacity="${(0.5 - i * 0.09) * (1 + 0.4 * dsin(t, i * 0.2))}"/>
      </g>`;
    }
    return out;
};

/** Overlapping translucent discs — a colour/type system. */
const design = (rand, t) => {
    const discs = [
        [430, 330, 168, C.cyan],
        [575, 400, 168, C.indigo],
        [500, 265, 168, C.violet],
    ];
    // Each disc walks a small circle a third of a turn out of phase with the
    // next, so the overlaps — where the screen blend actually reads — keep
    // shifting instead of the trio sliding around rigidly.
    let out = discs
        .map(
            ([cx, cy, r, fill], i) =>
                `<circle cx="${cx + 34 * dcos(t, i / 3)}" cy="${cy + 34 * dsin(t, i / 3)}" r="${
                    r + 10 * dsin(t, i / 3 + 0.25)
                }" fill="${fill}" fill-opacity="0.5" style="mix-blend-mode:screen"/>`,
        )
        .join('');
    for (let i = 0; i < 5; i++) {
        out += `<rect x="800" y="${210 + i * 62}" width="${
            (300 - i * 44) * (1 + 0.16 * dsin(t, i * 0.13))
        }" height="${30 - i * 3}" rx="6" fill="${C.white}" fill-opacity="${0.3 - i * 0.045}"/>`;
    }
    return out;
};

/** Node graph — search / distribution. */
const network = (rand, t) => {
    const nodes = Array.from({ length: 22 }, () => [
        120 + rand() * (W - 240),
        110 + rand() * (H - 220),
        3 + rand() * 6,
    ]);

    // Drifted positions for drawing. The adjacency test below deliberately
    // uses the resting positions: deciding it from the drifted ones would let
    // edges cross the 230px threshold mid-loop and flicker in and out.
    const pos = nodes.map(([x, y, r]) => [
        x + 11 * dsin(t, phaseOf(x, y)),
        y + 11 * dcos(t, phaseOf(y, x)),
        r,
    ]);

    let edges = '';
    let pulses = '';
    const glow = env(t);
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i][0] - nodes[j][0];
            const dy = nodes[i][1] - nodes[j][1];
            if (Math.hypot(dx, dy) < 230) {
                const len = Math.hypot(pos[i][0] - pos[j][0], pos[i][1] - pos[j][1]);
                const geom = `x1="${pos[i][0]}" y1="${pos[i][1]}" x2="${pos[j][0]}" y2="${pos[j][1]}"`;
                edges += `<line ${geom} stroke="url(#edge)" stroke-opacity="0.32" stroke-width="1.2"/>`;
                // A short dash chasing one full edge-length per loop reads as a
                // packet running the wire; the envelope hides the wrap.
                pulses += `<line ${geom} stroke="${C.white}" stroke-opacity="${0.55 * glow}" stroke-width="2"
                      stroke-linecap="round" stroke-dasharray="14 ${len}" stroke-dashoffset="${-(len + 14) * t}"/>`;
            }
        }
    }

    const dots = pos
        .map(
            ([x, y, r]) =>
                `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.white}" fill-opacity="0.85"/>
         <circle cx="${x}" cy="${y}" r="${
             r * 3 * (1 + 0.3 * dsin(t, phaseOf(x, y)))
         }" fill="${C.indigo}" fill-opacity="0.22" filter="url(#soft)"/>`,
        )
        .join('');
    return edges + pulses + dots;
};

/** Layered neural mesh with a bright signal path. */
const neural = (rand, t) => {
    const cols = 5;
    const rows = 5;
    const pts = [];
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            pts.push([200 + c * 200, 130 + r * 120 + (rand() - 0.5) * 40]);
        }
    }
    let out = '';
    for (let c = 0; c < cols - 1; c++) {
        for (let r = 0; r < rows; r++) {
            for (let r2 = 0; r2 < rows; r2++) {
                if (rand() > 0.72) {
                    const a = pts[c * rows + r];
                    const b = pts[(c + 1) * rows + r2];
                    out += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${
                        C.indigo
                    }" stroke-opacity="${0.3 * (1 + 0.5 * dsin(t, phaseOf(a[0], b[1])))}" stroke-width="1"/>`;
                }
            }
        }
    }
    // One lit path through the network.
    let path = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let c = 1; c < cols; c++) {
        const p = pts[c * rows + Math.floor(rand() * rows)];
        path += ` L ${p[0]} ${p[1]}`;
    }
    out += `<path d="${path}" fill="none" stroke="url(#edge)" stroke-width="3.5" stroke-linecap="round" filter="url(#soft)"/>`;
    out += `<path d="${path}" fill="none" stroke="${C.white}" stroke-width="1.6" stroke-linecap="round" stroke-opacity="0.9"/>`;
    // The inference itself: one bright packet running the lit path. 4000 is
    // comfortably longer than the path, so exactly one packet is in flight.
    out += `<path d="${path}" fill="none" stroke="${C.white}" stroke-width="7" stroke-linecap="round"
                  stroke-opacity="${0.85 * env(t)}" stroke-dasharray="30 4000" stroke-dashoffset="${-4030 * t}"
                  filter="url(#soft)"/>`;
    out += pts
        .map(
            ([x, y]) =>
                `<circle cx="${x}" cy="${y}" r="4" fill="${C.white}" fill-opacity="${
                    0.55 * (1 + 0.6 * dsin(t, phaseOf(x, y)))
                }"/>`,
        )
        .join('');
    return out;
};

/** Analytics: rising bars behind a trend line. */
const analytics = (rand, t) => {
    let out = '';
    const n = 14;
    const pts = [];
    for (let i = 0; i < n; i++) {
        // The wave runs left to right across the series; the trend line is
        // rebuilt from these same animated heights, so it never detaches from
        // the bar tops the way a separately animated polyline would.
        const h = (60 + (i / n) * 300 + rand() * 90) * (1 + 0.12 * dsin(t, -i * 0.055));
        const x = 150 + i * 66;
        out += `<rect x="${x}" y="${H - 130 - h}" width="34" height="${h}" rx="8" fill="url(#edge)" fill-opacity="${
            0.18 + (i / n) * 0.45
        }"/>`;
        pts.push([x + 17, H - 150 - h]);
    }
    out += `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${C.white}" stroke-opacity="0.85" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
    out += pts
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${C.cyan}"/>`)
        .join('');
    // A read-head sweeping the series, hidden at the wrap by the envelope.
    const head = pts[Math.min(pts.length - 1, Math.floor(t * pts.length))];
    out += `<circle cx="${head[0]}" cy="${head[1]}" r="${13 * env(t)}" fill="${C.white}" fill-opacity="0.9"/>
            <circle cx="${head[0]}" cy="${head[1]}" r="${34 * env(t)}" fill="${C.cyan}" fill-opacity="0.3" filter="url(#soft)"/>`;
    return out;
};

/** Abstracted product dashboard. */
const dashboard = (rand, t) => {
    let out = `<g transform="translate(150 120)">
    <rect width="900" height="510" rx="24" fill="${C.ink2}" fill-opacity="0.95" stroke="${C.white}" stroke-opacity="0.14"/>
    <rect x="0" y="0" width="900" height="54" rx="24" fill="${C.white}" fill-opacity="0.05"/>
    <circle cx="34" cy="27" r="6" fill="#ff5f57"/><circle cx="56" cy="27" r="6" fill="#febc2e"/><circle cx="78" cy="27" r="6" fill="#28c840"/>
    <rect x="30" y="86" width="240" height="150" rx="16" fill="url(#edge)" fill-opacity="${0.55 * (1 + 0.3 * dsin(t))}"/>
    <rect x="292" y="86" width="240" height="150" rx="16" fill="${C.white}" fill-opacity="0.08"/>
    <rect x="554" y="86" width="316" height="150" rx="16" fill="${C.white}" fill-opacity="0.08"/>`;
    for (let i = 0; i < 5; i++) {
        out += `<rect x="30" y="${268 + i * 46}" width="${
            (760 - i * 90) * (1 + 0.07 * dsin(t, i * 0.16))
        }" height="20" rx="10" fill="${C.white}" fill-opacity="${0.16 - i * 0.02}"/>`;
    }
    // Sheen travelling the full panel width once per loop — the one cue that
    // says "live data" without any element having to change shape.
    out += `<rect x="${-260 + 1160 * t}" y="0" width="180" height="510" fill="${C.white}" fill-opacity="${
        0.05 * env(t)
    }" transform="skewX(-12)"/>`;
    return out + '</g>';
};

/** Data streams flowing left to right. */
const streams = (rand) => {
    let out = '';
    for (let i = 0; i < 9; i++) {
        const y = 90 + i * 72;
        const amp = 26 + rand() * 40;
        const d = `M -50 ${y} C ${W * 0.3} ${y - amp}, ${W * 0.66} ${y + amp}, ${W + 50} ${y}`;
        out += `<path d="${d}" fill="none" stroke="url(#edge)" stroke-opacity="${0.22 + rand() * 0.4}" stroke-width="${1 + rand() * 3}"/>`;
    }
    for (let i = 0; i < 26; i++) {
        out += `<circle cx="${rand() * W}" cy="${90 + Math.floor(rand() * 9) * 72}" r="${2 + rand() * 3}" fill="${C.white}" fill-opacity="0.8"/>`;
    }
    return out;
};

/** Studio: layered glass panels caught in a light beam. */
const studio = (rand, t) => {
    /* Lens ring. A dash-array equal to the exact circumference leaves a
       hairline seam where the dash meets its own start, and rotating a
       fully-drawn circle is invisible anyway — so the gap is opened by the
       envelope instead: closed (and the attribute omitted entirely) at t=0
       and t=1, widest mid-loop, sweeping round as it goes. */
    const circ = 2 * Math.PI * 62;
    const gap = 150 * env(t);
    const ring =
        gap > 0.01
            ? `stroke-dasharray="${circ - gap} ${gap}" stroke-dashoffset="${-circ * t}"`
            : '';

    return `
  <g opacity="0.95" transform="translate(${90 * dsin(t)} 0)">
    <path d="M 240 -60 L 640 -60 L 340 810 L -60 810 Z" fill="url(#edge)" fill-opacity="0.14"/>
    <path d="M 700 -60 L 860 -60 L 560 810 L 400 810 Z" fill="${C.white}" fill-opacity="0.05"/>
  </g>
  <g transform="translate(${300 + 14 * dcos(t)} ${170 + 12 * dsin(t)}) rotate(${-8 + 1.6 * dsin(t, 0.2)})">
    <rect width="380" height="250" rx="22" fill="${C.ink2}" fill-opacity="0.9" stroke="${C.white}" stroke-opacity="0.16"/>
    <rect x="26" y="26" width="180" height="14" rx="7" fill="${C.white}" fill-opacity="0.45"/>
    <rect x="26" y="52" width="110" height="12" rx="6" fill="${C.white}" fill-opacity="0.2"/>
    <rect x="26" y="150" width="328" height="70" rx="14" fill="url(#edge)" fill-opacity="0.5"/>
  </g>
  <g transform="translate(${600 + 12 * dsin(t, 0.5)} ${300 + 14 * dcos(t, 0.4)}) rotate(${6 + 1.8 * dsin(t, 0.6)})">
    <rect width="330" height="220" rx="22" fill="${C.ink2}" fill-opacity="0.94" stroke="${C.white}" stroke-opacity="0.18"/>
    <circle cx="165" cy="110" r="62" fill="none" stroke="url(#edge)" stroke-width="3" ${ring}/>
    <circle cx="165" cy="110" r="${30 + 5 * dsin(t, 0.25)}" fill="none" stroke="${C.white}" stroke-opacity="0.35" stroke-width="2"/>
    <circle cx="165" cy="110" r="6" fill="${C.white}"/>
  </g>`;
};

/* ------------------------------------------------------------------ build */

export const PIECES = [
    { name: 'service-commerce', a: C.indigoDeep, b: C.violet, motif: commerce, seed: 11 },
    { name: 'service-design', a: C.cyan, b: C.violet, motif: design, seed: 22 },
    { name: 'service-seo', a: C.violet, b: C.cyan, motif: network, seed: 33 },
    { name: 'work-commerce', a: C.indigo, b: C.cyan, motif: dashboard, seed: 44 },
    { name: 'work-saas', a: C.cyan, b: C.indigoDeep, motif: design, seed: 55 },
    { name: 'work-ai', a: C.violet, b: C.indigo, motif: neural, seed: 66 },
    { name: 'work-seo', a: C.indigoDeep, b: C.cyan, motif: analytics, seed: 77 },
    { name: 'studio', a: C.indigo, b: C.cyan, motif: studio, seed: 88 },
    { name: 'streams', a: C.cyan, b: C.violet, motif: streams, seed: 99 },
];

async function main() {
    await mkdir(OUT, { recursive: true });

    for (const piece of PIECES) {
        const svg = stage(piece);
        const buf = Buffer.from(svg);

        // Full size for the wide cards…
        await sharp(buf)
            .webp({ quality: 74, effort: 6 })
            .toFile(path.join(OUT, `${piece.name}.webp`));

        // …and a half-width variant for the narrow ones, so a 400px slot does
        // not download a 1200px image.
        await sharp(buf)
            .resize(600)
            .webp({ quality: 72, effort: 6 })
            .toFile(path.join(OUT, `${piece.name}@600.webp`));
    }

    console.log(`Generated ${PIECES.length * 2} artwork files in public/art/`);
}

/* Only draw the stills when run directly. generate-artwork-motion.mjs imports
   stage() and PIECES from here so the clips and the posters come from one
   definition of the artwork rather than two that can drift apart. */
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    main().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
