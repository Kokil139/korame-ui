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
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'art');

const W = 1200;
const H = 750;

const C = {
    ink: '#07080c',
    ink2: '#0d1018',
    indigo: '#6366f1',
    indigoDeep: '#4f46e5',
    cyan: '#22d3ee',
    violet: '#c084fc',
    white: '#ffffff',
};

/** Deterministic PRNG so re-running the script produces identical files. */
function rng(seed) {
    let s = seed >>> 0;
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
    };
}

/**
 * Shared stage: deep ground, two colour blooms, a faint grid and a vignette.
 * `motif` draws the piece-specific geometry on top.
 */
function stage({ a, b, motif, seed = 1 }) {
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
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
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
  <ellipse cx="${W * 0.24}" cy="${H * 0.16}" rx="${W * 0.44}" ry="${H * 0.52}" fill="url(#bloomA)"/>
  <ellipse cx="${W * 0.84}" cy="${H * 0.88}" rx="${W * 0.38}" ry="${H * 0.46}" fill="url(#bloomB)"/>

  ${motif(rng(seed))}

  <rect width="${W}" height="${H}" fill="url(#vig)"/>
</svg>`;
}

/* ---------------------------------------------------------------- motifs */

/** Stacked storefront cards receding in isometric space. */
const commerce = () => {
    let out = '';
    for (let i = 0; i < 4; i++) {
        const w = 420 - i * 34;
        const h = 250 - i * 20;
        const x = 250 + i * 70;
        const y = 190 + i * 62;
        const o = 0.9 - i * 0.18;
        out += `
      <g transform="translate(${x} ${y}) skewY(-14)" opacity="${o}">
        <rect width="${w}" height="${h}" rx="18" fill="${C.ink2}" fill-opacity="0.92"
              stroke="${C.white}" stroke-opacity="0.14"/>
        <rect x="22" y="22" width="${w * 0.42}" height="12" rx="6" fill="${C.white}" fill-opacity="0.4"/>
        <rect x="22" y="46" width="${w * 0.24}" height="10" rx="5" fill="${C.white}" fill-opacity="0.16"/>
        <rect x="22" y="${h - 78}" width="${w - 44}" height="56" rx="12"
              fill="url(#edge)" fill-opacity="${0.5 - i * 0.09}"/>
      </g>`;
    }
    return out;
};

/** Overlapping translucent discs — a colour/type system. */
const design = () => {
    const discs = [
        [430, 330, 168, C.cyan],
        [575, 400, 168, C.indigo],
        [500, 265, 168, C.violet],
    ];
    let out = discs
        .map(
            ([cx, cy, r, fill]) =>
                `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" fill-opacity="0.5" style="mix-blend-mode:screen"/>`,
        )
        .join('');
    for (let i = 0; i < 5; i++) {
        out += `<rect x="800" y="${210 + i * 62}" width="${300 - i * 44}" height="${
            30 - i * 3
        }" rx="6" fill="${C.white}" fill-opacity="${0.3 - i * 0.045}"/>`;
    }
    return out;
};

/** Node graph — search / distribution. */
const network = (rand) => {
    const nodes = Array.from({ length: 22 }, () => [
        120 + rand() * (W - 240),
        110 + rand() * (H - 220),
        3 + rand() * 6,
    ]);
    let edges = '';
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i][0] - nodes[j][0];
            const dy = nodes[i][1] - nodes[j][1];
            if (Math.hypot(dx, dy) < 230) {
                edges += `<line x1="${nodes[i][0]}" y1="${nodes[i][1]}" x2="${nodes[j][0]}" y2="${nodes[j][1]}" stroke="url(#edge)" stroke-opacity="0.32" stroke-width="1.2"/>`;
            }
        }
    }
    const dots = nodes
        .map(
            ([x, y, r]) =>
                `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.white}" fill-opacity="0.85"/>
         <circle cx="${x}" cy="${y}" r="${r * 3}" fill="${C.indigo}" fill-opacity="0.22" filter="url(#soft)"/>`,
        )
        .join('');
    return edges + dots;
};

/** Layered neural mesh with a bright signal path. */
const neural = (rand) => {
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
                    out += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${C.indigo}" stroke-opacity="0.3" stroke-width="1"/>`;
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
    out += pts
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${C.white}" fill-opacity="0.55"/>`)
        .join('');
    return out;
};

/** Analytics: rising bars behind a trend line. */
const analytics = (rand) => {
    let out = '';
    const n = 14;
    const pts = [];
    for (let i = 0; i < n; i++) {
        const h = 60 + (i / n) * 300 + rand() * 90;
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
    return out;
};

/** Abstracted product dashboard. */
const dashboard = () => {
    let out = `<g transform="translate(150 120)">
    <rect width="900" height="510" rx="24" fill="${C.ink2}" fill-opacity="0.95" stroke="${C.white}" stroke-opacity="0.14"/>
    <rect x="0" y="0" width="900" height="54" rx="24" fill="${C.white}" fill-opacity="0.05"/>
    <circle cx="34" cy="27" r="6" fill="#ff5f57"/><circle cx="56" cy="27" r="6" fill="#febc2e"/><circle cx="78" cy="27" r="6" fill="#28c840"/>
    <rect x="30" y="86" width="240" height="150" rx="16" fill="url(#edge)" fill-opacity="0.55"/>
    <rect x="292" y="86" width="240" height="150" rx="16" fill="${C.white}" fill-opacity="0.08"/>
    <rect x="554" y="86" width="316" height="150" rx="16" fill="${C.white}" fill-opacity="0.08"/>`;
    for (let i = 0; i < 5; i++) {
        out += `<rect x="30" y="${268 + i * 46}" width="${760 - i * 90}" height="20" rx="10" fill="${C.white}" fill-opacity="${0.16 - i * 0.02}"/>`;
    }
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
const studio = () => `
  <g opacity="0.95">
    <path d="M 240 -60 L 640 -60 L 340 810 L -60 810 Z" fill="url(#edge)" fill-opacity="0.14"/>
    <path d="M 700 -60 L 860 -60 L 560 810 L 400 810 Z" fill="${C.white}" fill-opacity="0.05"/>
  </g>
  <g transform="translate(300 170) rotate(-8)">
    <rect width="380" height="250" rx="22" fill="${C.ink2}" fill-opacity="0.9" stroke="${C.white}" stroke-opacity="0.16"/>
    <rect x="26" y="26" width="180" height="14" rx="7" fill="${C.white}" fill-opacity="0.45"/>
    <rect x="26" y="52" width="110" height="12" rx="6" fill="${C.white}" fill-opacity="0.2"/>
    <rect x="26" y="150" width="328" height="70" rx="14" fill="url(#edge)" fill-opacity="0.5"/>
  </g>
  <g transform="translate(600 300) rotate(6)">
    <rect width="330" height="220" rx="22" fill="${C.ink2}" fill-opacity="0.94" stroke="${C.white}" stroke-opacity="0.18"/>
    <circle cx="165" cy="110" r="62" fill="none" stroke="url(#edge)" stroke-width="3"/>
    <circle cx="165" cy="110" r="30" fill="none" stroke="${C.white}" stroke-opacity="0.35" stroke-width="2"/>
    <circle cx="165" cy="110" r="6" fill="${C.white}"/>
  </g>`;

/* ------------------------------------------------------------------ build */

const PIECES = [
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

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
