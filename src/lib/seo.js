import { SITE, url, STACK } from '@/lib/site';

/**
 * Structured data builders.
 *
 * Everything here is generated from the same content modules that render the
 * page, so the markup and the JSON-LD cannot drift. Google treats a mismatch
 * between them as a rich-result violation, and hand-maintaining two copies of
 * the same facts loses eventually.
 *
 * Nothing in this file invents reviews, ratings, awards, client names,
 * certifications or statistics. Those are the fabrications that get
 * structured data penalised, and they are trivially disprovable.
 */

const ORG_ID = `${SITE.origin}/#organization`;
const SITE_ID = `${SITE.origin}/#website`;

/** The publisher node. Referenced by @id everywhere else rather than repeated. */
export function organizationNode() {
    return {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: SITE.name,
        legalName: SITE.legalName,
        url: url('/'),
        logo: url('/favicon.svg'),
        image: url('/og-image.png'),
        description:
            'Korame is a software engineering studio building websites, web applications, full-stack systems, custom software and cloud-deployed digital products.',
        email: SITE.email,
        telephone: SITE.phone,
        areaServed: { '@type': 'Place', name: 'Worldwide' },
        address: { '@type': 'PostalAddress', addressCountry: SITE.country },
        sameAs: [SITE.instagram],
        knowsAbout: [
            'Web development',
            'Web design',
            'Web application development',
            'Full-stack development',
            'Application development',
            'Software development',
            'Custom software development',
            'Cloud development',
            'Azure development',
            ...STACK.frontend,
            ...STACK.cloud,
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'sales',
            email: SITE.email,
            telephone: SITE.phone,
            areaServed: 'Worldwide',
            availableLanguage: ['English', 'Hindi'],
        },
    };
}

export function websiteNode() {
    return {
        '@type': 'WebSite',
        '@id': SITE_ID,
        url: url('/'),
        name: SITE.name,
        publisher: { '@id': ORG_ID },
        inLanguage: SITE.lang,
    };
}

/**
 * BreadcrumbList. `trail` is [{ name, path }] from the site root inward,
 * excluding the home entry, which is prepended here.
 */
export function breadcrumbNode(trail) {
    const items = [{ name: 'Home', path: '/' }, ...trail];
    return {
        '@type': 'BreadcrumbList',
        '@id': `${url(items[items.length - 1].path)}#breadcrumb`,
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: url(item.path),
        })),
    };
}

export function webPageNode({ path, name, description, breadcrumbPath }) {
    return {
        '@type': 'WebPage',
        '@id': `${url(path)}#webpage`,
        url: url(path),
        name,
        description,
        isPartOf: { '@id': SITE_ID },
        about: { '@id': ORG_ID },
        inLanguage: SITE.lang,
        ...(breadcrumbPath ? { breadcrumb: { '@id': `${url(breadcrumbPath)}#breadcrumb` } } : null),
    };
}

/** A single service offering. `provider` points at the org node. */
export function serviceNode(service) {
    return {
        '@type': 'Service',
        '@id': `${url(`/${service.slug}`)}#service`,
        name: service.nav,
        serviceType: service.serviceType,
        description: service.description,
        url: url(`/${service.slug}`),
        provider: { '@id': ORG_ID },
        areaServed: { '@type': 'Place', name: 'Worldwide' },
        ...(service.useCases?.length
            ? {
                  hasOfferCatalog: {
                      '@type': 'OfferCatalog',
                      name: `${service.nav} engagements`,
                      itemListElement: service.useCases.map((useCase) => ({
                          '@type': 'Offer',
                          itemOffered: { '@type': 'Service', name: useCase },
                      })),
                  },
              }
            : null),
    };
}

/**
 * FAQPage, generated from the same array the page renders.
 *
 * Google requires the answer text to be visible on the page, which is why
 * this can only ever be built from the rendered content.
 */
export function faqNode(faqs, path) {
    return {
        '@type': 'FAQPage',
        '@id': `${url(path)}#faq`,
        mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    };
}

/**
 * A project case study. CreativeWork rather than Article: these describe a
 * thing that was built, and the author is the studio rather than a person.
 */
export function creativeWorkNode(project) {
    return {
        '@type': 'CreativeWork',
        '@id': `${url(`/projects/${project.slug}`)}#project`,
        name: project.name,
        headline: project.title,
        description: project.description,
        url: url(`/projects/${project.slug}`),
        creator: { '@id': ORG_ID },
        author: { '@id': ORG_ID },
        dateCreated: project.year,
        inLanguage: SITE.lang,
        keywords: project.stack.join(', '),
        ...(project.liveUrl ? { sameAs: [project.liveUrl] } : null),
    };
}

export function articleNode(post) {
    return {
        '@type': 'Article',
        '@id': `${url(`/blog/${post.slug}`)}#article`,
        headline: post.title,
        description: post.description,
        url: url(`/blog/${post.slug}`),
        datePublished: post.date,
        dateModified: post.updated || post.date,
        author: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        isPartOf: { '@id': SITE_ID },
        inLanguage: SITE.lang,
        articleSection: post.topic,
        image: url('/og-image.png'),
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${url(`/blog/${post.slug}`)}#webpage` },
    };
}

export function itemListNode({ path, name, items }) {
    return {
        '@type': 'ItemList',
        '@id': `${url(path)}#list`,
        name,
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            url: url(item.path),
        })),
    };
}

/** Wrap nodes into the @graph envelope that goes in a single script tag. */
export const graph = (...nodes) => ({
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
});
