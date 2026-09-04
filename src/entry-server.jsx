import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';
import { HeadCollectorContext } from './components/Seo.jsx';

/* Re-exported so scripts/prerender.mjs reads the route list from source
   rather than keeping a second copy of it. */
export { ROUTES, NOINDEX_ROUTES, REDIRECTS } from './lib/routes.js';

/**
 * Pre-render entry.
 *
 * Called once per route by scripts/prerender.mjs. Returns the rendered markup
 * plus the head descriptor <Seo> wrote into the collector during the render,
 * so the build script can emit a document with the correct title, canonical,
 * Open Graph tags and JSON-LD baked in.
 *
 * ── Why streaming and not renderToString ─────────────────────────────────
 * Every inner page is a React.lazy chunk. `renderToString` cannot resolve a
 * lazy component: it hits the Suspense boundary, renders the fallback, and
 * returns  which produced twenty-one empty documents and no <Seo> descriptor
 * before this was switched over.
 *
 * `renderToPipeableStream` with `onAllReady` waits for every boundary to
 * settle before emitting anything, so the output is the complete page with
 * all lazy chunks resolved. It also means the code-splitting that keeps the
 * entry bundle small costs the pre-rendered HTML nothing.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * No StrictMode: it double-renders, which would have <Seo> write to the
 * collector twice for no benefit in a single-pass render.
 */
export function render(path) {
    return new Promise((resolve, reject) => {
        const collector = {};
        const chunks = [];

        const sink = new Writable({
            write(chunk, _encoding, callback) {
                chunks.push(Buffer.from(chunk));
                callback();
            },
        });

        sink.on('finish', () =>
            resolve({
                html: Buffer.concat(chunks).toString('utf8'),
                head: collector.head ?? null,
            }),
        );
        sink.on('error', reject);

        const stream = renderToPipeableStream(
            <HeadCollectorContext.Provider value={collector}>
                {/* Same future flags as the client router in main.jsx, so
                    the pre-rendered tree and the hydrated tree resolve routes
                    identically. */}
                <StaticRouter
                    location={path}
                    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
                >
                    <App />
                </StaticRouter>
            </HeadCollectorContext.Provider>,
            {
                /* Fire only once the whole tree  every lazy chunk included 
                   has resolved. `onShellReady` would emit the shell with
                   Suspense fallbacks still in place, which is the streaming
                   behaviour we specifically do not want from a build step. */
                onAllReady() {
                    stream.pipe(sink);
                },
                onError(error) {
                    reject(error);
                },
            },
        );
    });
}
