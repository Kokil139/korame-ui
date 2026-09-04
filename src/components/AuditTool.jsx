import { useState, useRef, useCallback, useEffect } from 'react';
import {
    Gauge,
    Search,
    Accessibility,
    ShieldCheck,
    Loader2,
    AlertTriangle,
    ArrowRight,
    ExternalLink,
    Timer,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import Reveal from '@/components/motion/Reveal';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { springSnap } from '@/lib/motion';
import { cn } from '@/lib/utils';
import {
    hasPsi,
    normaliseUrl,
    gradeToScore,
    runObservatory,
    runPageSpeed,
    measureResponse,
} from '@/lib/audit';

const TIMEOUT_MS = 70_000;

const PSI_LABELS = {
    performance: { label: 'Performance', icon: Gauge },
    accessibility: { label: 'Accessibility', icon: Accessibility },
    'best-practices': { label: 'Best practices', icon: ShieldCheck },
    seo: { label: 'SEO', icon: Search },
};

/** Lighthouse's own banding, so the colours mean what people expect. */
function bandOf(score) {
    if (score >= 90) return 'var(--success)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--destructive)';
}

function ScoreRing({ score, label, icon: Icon, caption, delay = 0 }) {
    const reduced = useReducedMotion();
    const tone = bandOf(score);
    const R = 34;
    const C = 2 * Math.PI * R;

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative size-24">
                <svg viewBox="0 0 80 80" className="size-full -rotate-90">
                    <circle cx="40" cy="40" r={R} fill="none" stroke="var(--border)" strokeWidth="6" />
                    <motion.circle
                        cx="40"
                        cy="40"
                        r={R}
                        fill="none"
                        stroke={tone}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={C}
                        initial={reduced ? false : { strokeDashoffset: C }}
                        animate={{ strokeDashoffset: C - (C * score) / 100 }}
                        transition={
                            reduced
                                ? { duration: 0 }
                                : { type: 'spring', bounce: 0, visualDuration: 0.9, delay }
                        }
                    />
                </svg>

                <span
                    className="absolute inset-0 grid place-items-center font-heading text-2xl font-extrabold tabular-nums"
                    style={{ color: tone }}
                >
                    {caption ?? score}
                </span>
            </div>

            <span className="flex items-center gap-1.5 text-center text-xs font-medium text-muted-foreground">
                <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                {label}
            </span>
        </div>
    );
}

/* -------------------------------------------------------------------- */

/**
 * The live audit.
 *
 * Rendered twice: as a section on the homepage, and as the body of
 * /free-website-audit. `hideHeader` suppresses this section's own heading on
 * the dedicated page, where the <h1> belongs to <PageHero>  two headings
 * saying the same thing is a heading-hierarchy problem, not just a visual one.
 */
export default function AuditTool({ hideHeader = false }) {
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('idle'); // idle | running | done | error
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const abortRef = useRef(null);

    useEffect(() => () => abortRef.current?.abort(), []);

    const runAudit = useCallback(
        async (e) => {
            e.preventDefault();

            const target = normaliseUrl(url);
            if (!target) {
                setStatus('error');
                setError('That does not look like a public website address.');
                return;
            }

            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;
            const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

            setStatus('running');
            setError('');
            setResult(null);

            try {
                /* The security scan is the one that must succeed  it is the
                   keyless source. Performance and timing are enrichments, so
                   they run in parallel and are allowed to fail on their own
                   without taking the whole report down. */
                const [security, performanceResult, responseMs] = await Promise.all([
                    runObservatory(target.hostname, controller.signal),
                    hasPsi
                        ? runPageSpeed(target.href, controller.signal).catch(() => null)
                        : Promise.resolve(null),
                    measureResponse(target.href, controller.signal).catch(() => null),
                ]);

                setResult({ target, security, performance: performanceResult, responseMs });
                setStatus('done');
            } catch (err) {
                setError(
                    err.name === 'AbortError'
                        ? 'The audit timed out. Large sites can take a while.'
                        : err.message || 'Something went wrong running the audit.',
                );
                setStatus('error');
            } finally {
                clearTimeout(timer);
            }
        },
        [url],
    );

    /**
     * Hand the audited URL to the contact form so the lead arrives with
     * context.
     *
     * The form is on the same document on the homepage, and on a different
     * route at /free-website-audit. When it is not here, navigate to /contact
     * and carry the URL in the router state rather than dropping the handoff
     * silently  the whole point of the button is that the visitor does not
     * have to retype what they just scanned.
     */
    const handoff = useCallback(() => {
        const target = result?.target?.href ?? normaliseUrl(url)?.href ?? url;
        const message = `Please send me the full written audit for ${target}.`;

        const field = document.querySelector('#contact-message');
        if (field) {
            field.value = message;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            document
                .getElementById('contact')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        navigate('/contact', { state: { message } });
    }, [navigate, result, url]);

    return (
        <section
            id="audit"
            className="relative overflow-hidden border-y border-border bg-surface-0 px-6 py-28 sm:py-36"
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 dot-field" />

            <div className="relative mx-auto max-w-4xl">
                {!hideHeader && (
                    <div className="text-center">
                        <Reveal>
                            <Badge>Free website audit</Badge>
                        </Reveal>

                        <Reveal delay={0.06}>
                            <h2 className="mt-6 text-balance font-heading text-4xl font-bold tracking-[-0.025em] text-foreground md:text-5xl lg:text-6xl">
                                How healthy is your site,{' '}
                                <span className="text-gradient-brand">really?</span>
                            </h2>
                        </Reveal>

                        <Reveal delay={0.12}>
                            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
                                Enter your address for a live scan of your security headers,
                                response time{hasPsi ? ' and Lighthouse scores' : ''}. No email
                                required to see the numbers.
                            </p>
                        </Reveal>
                    </div>
                )}

                <Reveal delay={0.16}>
                    <Card lit={false} className="mt-12 p-6 sm:p-9">
                        <form onSubmit={runAudit} className="flex flex-col gap-3 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="audit-url" className="sr-only">
                                    Website address
                                </label>
                                <Input
                                    id="audit-url"
                                    name="auditUrl"
                                    type="text"
                                    inputMode="url"
                                    autoComplete="url"
                                    spellCheck="false"
                                    placeholder="yourcompany.com"
                                    value={url}
                                    onChange={(ev) => setUrl(ev.target.value)}
                                    aria-describedby="audit-status"
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                disabled={status === 'running'}
                                className="sm:w-auto"
                            >
                                {status === 'running' ? (
                                    <>
                                        Scanning
                                        <Loader2 className="animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        Run audit
                                        <Gauge />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div id="audit-status" aria-live="polite" aria-atomic="false">
                            <AnimatePresence mode="wait">
                                {status === 'running' && (
                                    <motion.div
                                        key="running"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="mt-7"
                                    >
                                        <ScanningState />
                                    </motion.div>
                                )}

                                {status === 'error' && (
                                    <motion.div
                                        key="error"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="mt-7 rounded-2xl border border-border bg-elevate p-5"
                                    >
                                        <p className="flex items-start gap-2.5 text-sm text-foreground">
                                            <AlertTriangle
                                                className="mt-0.5 size-4 shrink-0 text-warning"
                                                aria-hidden="true"
                                            />
                                            <span>
                                                {error}{' '}
                                                <button
                                                    type="button"
                                                    onClick={handoff}
                                                    className="font-semibold text-brand-400 underline-offset-4 hover:underline"
                                                >
                                                    Have us run it by hand instead
                                                </button>{' '}
                                                and we&apos;ll email the full report.
                                            </span>
                                        </p>
                                    </motion.div>
                                )}

                                {status === 'done' && result && (
                                    <motion.div
                                        key="done"
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={springSnap}
                                        className="mt-8"
                                    >
                                        <Report result={result} onHandoff={handoff} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <p className="mt-6 text-center text-xs text-muted-foreground">
                            Security grading by the MDN HTTP Observatory
                            {hasPsi ? ', performance by Google PageSpeed Insights' : ''}. We
                            don&apos;t store the addresses you enter.
                        </p>
                    </Card>
                </Reveal>
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------- */

function Report({ result, onHandoff }) {
    const { target, security, performance: perf, responseMs } = result;

    const rings = [];

    if (perf) {
        for (const [id, meta] of Object.entries(PSI_LABELS)) {
            rings.push(
                <ScoreRing
                    key={id}
                    score={perf.scores[id]}
                    label={meta.label}
                    icon={meta.icon}
                    delay={rings.length * 0.1}
                />,
            );
        }
    }

    rings.push(
        <ScoreRing
            key="security"
            score={gradeToScore(security.grade)}
            caption={security.grade}
            label="Security headers"
            icon={ShieldCheck}
            delay={rings.length * 0.1}
        />,
    );

    return (
        <>
            <p className="truncate text-center font-mono text-xs text-muted-foreground">
                {perf?.finalUrl ?? target.href}
            </p>

            {/* Column count follows the number of rings. Without a PSI key
                there is only the security ring, and a fixed 2-column grid
                would park it off to one side. */}
            <div
                className={cn(
                    'mt-6 grid justify-items-center gap-6',
                    rings.length === 1 && 'grid-cols-1',
                    rings.length > 1 && 'grid-cols-2 sm:grid-cols-5',
                )}
            >
                {rings}
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
                <Metric
                    label="Security tests passed"
                    value={`${security.testsPassed}/${security.testsQuantity}`}
                />
                <Metric label="Server response" value={security.statusCode} />
                {responseMs != null && (
                    <Metric label="Round trip" value={`${responseMs} ms`} icon={Timer} />
                )}
                {perf?.metrics?.slice(0, responseMs != null ? 1 : 2).map(([label, value]) => (
                    <Metric key={label} label={label} value={value} />
                ))}
            </dl>

            {perf && perf.metrics.length > 0 && (
                <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {perf.metrics.slice(responseMs != null ? 1 : 2).map(([label, value]) => (
                        <Metric key={label} label={label} value={value} />
                    ))}
                </dl>
            )}

            <div className="mt-8 flex flex-col items-center gap-3 border-t border-border pt-7">
                <p className="max-w-lg text-center text-sm text-muted-foreground">
                    Scores are a symptom. The written audit tells you what is causing them,
                    what it costs you, and what to fix first.
                </p>

                <Button type="button" variant="primary" size="lg" onClick={onHandoff}>
                    Get the full written audit
                    <ArrowRight />
                </Button>

                <a
                    href={security.detailsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                    See the full security breakdown on MDN
                    <ExternalLink className="size-3" aria-hidden="true" />
                </a>
            </div>
        </>
    );
}

function Metric({ label, value, icon: Icon }) {
    return (
        <div>
            <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                {Icon && <Icon className="size-3" aria-hidden="true" />}
                {label}
            </dt>
            <dd className="mt-1 font-heading text-lg font-bold tabular-nums text-foreground">
                {value}
            </dd>
        </div>
    );
}

/* -------------------------------------------------------------------- */

const SCAN_STEPS = [
    'Resolving the host',
    'Inspecting security headers',
    'Measuring the round trip',
    ...(hasPsi ? ['Running Lighthouse'] : []),
    'Scoring the results',
];

/**
 * Progress for a request with no progress events.
 *
 * Neither source streams intermediate state, so this walks the real stages on
 * a timer. The steps are named honestly  it reports what is being done, it
 * does not invent a percentage.
 */
function ScanningState() {
    const [step, setStep] = useState(0);
    const reduced = useReducedMotion();

    useEffect(() => {
        const t = setInterval(
            () => setStep((s) => Math.min(SCAN_STEPS.length - 1, s + 1)),
            hasPsi ? 4200 : 2200,
        );
        return () => clearInterval(t);
    }, []);

    return (
        <div className="rounded-2xl border border-border bg-elevate p-6">
            <ul className="space-y-3">
                {SCAN_STEPS.map((label, i) => (
                    <li
                        key={label}
                        className={cn(
                            'flex items-center gap-3 text-sm transition-colors duration-500',
                            i <= step ? 'text-foreground' : 'text-muted-foreground/50',
                        )}
                    >
                        <span
                            className={cn(
                                'grid size-5 shrink-0 place-items-center rounded-full border',
                                i < step && 'border-brand-500 bg-brand-500',
                                i === step && 'border-brand-500',
                                i > step && 'border-border',
                            )}
                        >
                            {i < step && (
                                <motion.span
                                    initial={reduced ? false : { scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="size-1.5 rounded-full bg-primary-foreground"
                                />
                            )}
                            {i === step && (
                                <span className="size-1.5 animate-ping rounded-full bg-brand-500" />
                            )}
                        </span>
                        {label}
                    </li>
                ))}
            </ul>

            <p className="mt-5 text-xs text-muted-foreground">
                {hasPsi
                    ? 'A full scan usually takes 20–40 seconds.'
                    : 'This usually takes 5–15 seconds.'}
            </p>
        </div>
    );
}
