import webDevelopment from './web-development.js';
import webDesign from './web-design.js';
import webAppDevelopment from './web-app-development.js';
import fullStackDevelopment from './full-stack-development.js';
import appDevelopment from './app-development.js';
import softwareDevelopment from './software-development.js';
import customSoftwareDevelopment from './custom-software-development.js';
import cloudSolutions from './cloud-solutions.js';

/**
 * The service pages, in the order they should be presented.
 *
 * Each module is the single source of truth for its page: the copy, the
 * metadata, the FAQ (which also becomes FAQPage structured data) and the
 * cross-links to related services and projects. Adding a service means
 * adding a module here — the route, the sitemap entry, the services index
 * and the footer all derive from this array.
 *
 * Shape (see any module for a worked example):
 *   slug, nav, short, title, description, h1, kicker, art, serviceType, lede
 *   whatItIs  { heading, body[] }        the definitional section
 *   provide[] { title, body }            what Korame does
 *   audience[] { title, body }           who it is for
 *   problems[] { title, body }           what it solves
 *   approach[] { title, body }           how the work runs
 *   tech[]    { group, items[] }         technologies, honestly scoped
 *   pillars[] { title, body }            security / performance / cloud / testing / maintenance
 *   useCases[]                           typical engagements
 *   faqs[]    { q, a }                   also emitted as FAQPage JSON-LD
 *   projects[]                           project slugs demonstrating this service
 *   related[]                            other service slugs
 *   decision? { heading, buy, build, note }   optional build-vs-buy block
 */
export const SERVICES = [
    webDevelopment,
    webDesign,
    webAppDevelopment,
    fullStackDevelopment,
    appDevelopment,
    softwareDevelopment,
    customSoftwareDevelopment,
    cloudSolutions,
];

export const SERVICE_BY_SLUG = Object.fromEntries(SERVICES.map((s) => [s.slug, s]));

export const getService = (slug) => SERVICE_BY_SLUG[slug];

/** Service pages sit at the root: /web-development, not /services/web-development. */
export const servicePath = (slug) => `/${slug}`;
