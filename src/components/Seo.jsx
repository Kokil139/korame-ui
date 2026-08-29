import { createContext, useContext, useEffect } from 'react';
import { SITE, url, OG_IMAGE } from '@/lib/site';

/**
 * Per-route document head, without a head-management dependency.
 *
 * Two modes, one component:
 *
 * - **Pre-render (server).** A collector object is provided through context.
 *   <Seo> writes its descriptor into it during render, and
 *   scripts/prerender.mjs turns that into real tags in the emitted HTML. This
 *   is the mode that matters: social crawlers do not execute JavaScript at
 *   all, and a title injected at runtime is invisible to them.
 *
 * - **Client navigation.** No collector, so the effect below patches the live
 *   document instead — for the reader, for the tab title, and for anything
 *   that reads the DOM after hydration.
 *
 * Tags this component owns are marked with `data-seo`, so a route change can
 * remove exactly what the previous route added and nothing else.
 */

export const HeadCollectorContext = createContext(null);

/** Build the descriptor once so both modes emit identical output. */
export function buildHead({
    title,
    description,
    path,
    image,
    type = 'website',
    noindex = false,
    jsonLd = null,
    publishedTime,
    modifiedTime,
}) {
    const canonical = url(path);
    const img = image || OG_IMAGE;

    const meta = [
        { name: 'description', content: description },
        {
            name: 'robots',
            content: noindex
                ? 'noindex, follow'
                : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        },
        { property: 'og:type', content: type },
        { property: 'og:site_name', content: SITE.name },
        { property: 'og:locale', content: SITE.locale },
        { property: 'og:url', content: canonical },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: img.url },
        { property: 'og:image:width', content: String(img.width) },
        { property: 'og:image:height', content: String(img.height) },
        { property: 'og:image:alt', content: img.alt },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: img.url },
    ];

    if (publishedTime) meta.push({ property: 'article:published_time', content: publishedTime });
    if (modifiedTime) meta.push({ property: 'article:modified_time', content: modifiedTime });

    return { title, canonical, meta, jsonLd };
}

/** Insert or update a single meta tag, keyed on name/property. */
function upsertMeta({ name, property, content }) {
    if (content == null) return;
    const key = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
    let el = document.head.querySelector(key);
    if (!el) {
        el = document.createElement('meta');
        if (name) el.setAttribute('name', name);
        else el.setAttribute('property', property);
        el.setAttribute('data-seo', '');
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function applyHead(head) {
    document.title = head.title;

    head.meta.forEach(upsertMeta);

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('data-seo', '');
        document.head.appendChild(link);
    }
    link.setAttribute('href', head.canonical);

    /* Structured data is replaced wholesale rather than patched: the graph
       for a service page and the graph for an article share almost no nodes,
       and a leftover node from the previous route is a validation error. */
    document.head
        .querySelectorAll('script[type="application/ld+json"][data-seo]')
        .forEach((s) => s.remove());

    if (head.jsonLd) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo', '');
        script.textContent = JSON.stringify(head.jsonLd);
        document.head.appendChild(script);
    }
}

export default function Seo(props) {
    const collector = useContext(HeadCollectorContext);
    const head = buildHead(props);

    /* Pre-render pass: hand the descriptor to the build script. Writing to a
       plain object during render is safe here because this tree is rendered
       exactly once, to a string, in Node. */
    if (collector) collector.head = head;

    const serialised = JSON.stringify(head);
    useEffect(() => {
        applyHead(JSON.parse(serialised));
    }, [serialised]);

    return null;
}
