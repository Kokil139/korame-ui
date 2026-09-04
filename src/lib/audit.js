/**
 * Website audit sources.
 *
 * This site is a static deploy with no backend, so everything here has to be
 * callable directly from the browser  which means CORS-enabled and, ideally,
 * keyless.
 *
 * Two sources, deliberately:
 *
 * 1. MDN HTTP Observatory (keyless, CORS `*`). Always runs. Returns a real
 *    security grade for the host. This is what makes the section work out of
 *    the box.
 *
 * 2. Google PageSpeed Insights. Only runs when `VITE_PSI_API_KEY` is set.
 *    PSI's keyless quota is a single pool shared by every anonymous caller on
 *    the internet and is permanently exhausted  a keyless request returns
 *    429 immediately, not under load  so calling it without a key is not a
 *    degraded path, it is a guaranteed failure. We do not attempt it.
 */

const OBSERVATORY = 'https://observatory-api.mdn.mozilla.net/api/v2/scan';
const PSI = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export const PSI_KEY = import.meta.env.VITE_PSI_API_KEY ?? '';
export const hasPsi = Boolean(PSI_KEY);

/** Accept "example.com" as well as a full URL. Returns null if unusable. */
export function normaliseUrl(raw) {
    const trimmed = String(raw ?? '').trim();
    if (!trimmed) return null;

    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
        const u = new URL(withScheme);
        if (!u.hostname.includes('.')) return null;
        if (u.hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(u.hostname)) return null;
        return { href: u.toString(), hostname: u.hostname, origin: u.origin };
    } catch {
        return null;
    }
}

/** Observatory grades map onto the same three bands Lighthouse uses. */
export function gradeToScore(grade) {
    const table = {
        'A+': 100, A: 95, 'A-': 90,
        'B+': 85, B: 80, 'B-': 75,
        'C+': 70, C: 65, 'C-': 60,
        'D+': 55, D: 50, 'D-': 45,
        F: 25,
    };
    return table[grade] ?? 0;
}

/**
 * Security + headers grade. Free, keyless, and the reason this section works
 * without any configuration.
 */
export async function runObservatory(hostname, signal) {
    const res = await fetch(
        `${OBSERVATORY}?host=${encodeURIComponent(hostname)}`,
        { method: 'POST', signal },
    );

    if (!res.ok) throw new Error(`Security scan failed (${res.status}).`);

    const data = await res.json();
    if (data.error) throw new Error(String(data.error));

    return {
        grade: data.grade,
        score: data.score,
        testsPassed: data.tests_passed,
        testsQuantity: data.tests_quantity,
        statusCode: data.status_code,
        detailsUrl: data.details_url,
        scannedAt: data.scanned_at,
    };
}

/** Full Lighthouse run. Only reachable when a key is configured. */
export async function runPageSpeed(href, signal) {
    const params = new URLSearchParams({ url: href, strategy: 'mobile', key: PSI_KEY });
    ['performance', 'accessibility', 'best-practices', 'seo'].forEach((c) =>
        params.append('category', c),
    );

    const res = await fetch(`${PSI}?${params}`, { signal });
    if (!res.ok) {
        throw new Error(
            res.status === 429
                ? 'The performance scanner is rate-limited right now.'
                : `The performance scanner returned ${res.status}.`,
        );
    }

    const data = await res.json();
    const cats = data?.lighthouseResult?.categories;
    if (!cats) throw new Error('That site could not be analysed.');

    const audits = data.lighthouseResult.audits ?? {};
    const pick = (id) => Math.round((cats[id]?.score ?? 0) * 100);

    return {
        finalUrl: data.lighthouseResult.finalDisplayedUrl ?? href,
        scores: {
            performance: pick('performance'),
            accessibility: pick('accessibility'),
            'best-practices': pick('best-practices'),
            seo: pick('seo'),
        },
        metrics: [
            ['Largest Contentful Paint', audits['largest-contentful-paint']?.displayValue],
            ['Cumulative Layout Shift', audits['cumulative-layout-shift']?.displayValue],
            ['Total Blocking Time', audits['total-blocking-time']?.displayValue],
            ['Speed Index', audits['speed-index']?.displayValue],
        ].filter(([, v]) => v),
    };
}

/**
 * Best-effort round-trip timing.
 *
 * A cross-origin `no-cors` fetch returns an opaque response  we cannot read
 * its status  but the request still happens and still produces a
 * PerformanceResourceTiming entry. Without `Timing-Allow-Origin` the detailed
 * phases are zeroed, but `duration` is exposed, and that is a real number for
 * how long the document took to come back.
 *
 * Treated as a nice-to-have: it is omitted from the report rather than shown
 * as an error if the browser or the target refuses.
 */
export async function measureResponse(href, signal) {
    const bust = `${href}${href.includes('?') ? '&' : '?'}_korame=${Date.now()}`;
    const started = performance.now();

    try {
        await fetch(bust, { mode: 'no-cors', cache: 'no-store', signal });
    } catch {
        return null;
    }

    const wall = Math.round(performance.now() - started);

    const entry = performance
        .getEntriesByType('resource')
        .reverse()
        .find((e) => e.name.startsWith(bust.split('?')[0]));

    const measured = entry?.duration ? Math.round(entry.duration) : wall;
    // A number that large is almost certainly a redirect chain or a timeout;
    // reporting it as "response time" would be misleading.
    return measured > 0 && measured < 30_000 ? measured : null;
}
