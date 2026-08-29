import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

/**
 * Client entry.
 *
 * Every route is pre-rendered to static HTML at build time, so the normal
 * path here is hydration rather than a fresh render — the document already
 * has its content and React is only attaching behaviour to it. `createRoot`
 * is kept as the fallback for the dev server, where `#root` is empty.
 */
const container = document.getElementById('root');

/**
 * The v7 future flags are opted into deliberately rather than left to warn on
 * every page load. `v7_startTransition` wraps router state updates in a
 * transition, which is what keeps a lazy route's chunk load from blocking the
 * current page; `v7_relativeSplatPath` fixes relative resolution under the
 * catch-all route. Both are the behaviour we already want, and enabling them
 * now means the eventual v7 upgrade is not also a behaviour change.
 */
const future = { v7_startTransition: true, v7_relativeSplatPath: true };

const app = (
    <React.StrictMode>
        <BrowserRouter future={future}>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);

/**
 * `firstElementChild`, not `hasChildNodes()`.
 *
 * In development Vite serves index.html untouched, so `#root` still contains
 * the literal `<!--app-html-->` placeholder — which is a child *node*. Testing
 * for any child would take the hydration path against a container holding
 * nothing but a comment, and every dev session would open on a hydration
 * mismatch. An element child only exists when the pre-render actually ran.
 */
if (container.firstElementChild) {
    ReactDOM.hydrateRoot(container, app);
} else {
    ReactDOM.createRoot(container).render(app);
}
