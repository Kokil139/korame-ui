/**
 * GENERATED  do not edit.
 * Written by scripts/generate-art-manifest.mjs from the contents of
 * public/art/. Add or remove a file there and re-run `npm run artwork`.
 */
export const ART_MOTION = {
    "service-commerce": [
        "webm"
    ],
    "service-design": [
        "webm"
    ],
    "service-seo": [
        "webm"
    ],
    "work-ai": [
        "webm"
    ],
    "work-saas": [
        "webm"
    ]
};

/**
 * Content hash per tile, appended to every /art/ URL as a `?v=` query.
 *
 * These file names never change and /art/ is cached for thirty days, so
 * without this a replaced tile stays invisible to every returning visitor.
 * See the header of scripts/generate-art-manifest.mjs.
 */
export const ART_VERSION = {
    "project-kepaso": "6ec00c18",
    "project-nomadninja": "13b12911",
    "project-the-travellers-tribe": "50660e08",
    "service-app-development": "39e3c7fa",
    "service-cloud-solutions": "bd5c8ce1",
    "service-commerce": "d6ca8731",
    "service-custom-software-development": "9785b47a",
    "service-design": "ce901c87",
    "service-full-stack-development": "f5268562",
    "service-seo": "cc592d4e",
    "service-software-development": "29557b00",
    "service-web-app-development": "3b98a141",
    "service-web-design": "ccadedd5",
    "service-web-development": "fed29551",
    "streams": "a13b2c47",
    "studio": "700fa876",
    "work-ai": "83d7b75a",
    "work-saas": "d82dc478"
};

/** True when this tile has a motion file to play. */
export const hasMotion = (name) => Boolean(ART_MOTION[name]);

/**
 * Versioned URL for one file of a tile.
 * artUrl('studio.webp', 'studio') -> '/art/studio.webp?v=1a2b3c4d'
 */
export const artUrl = (file, name) => {
    const v = ART_VERSION[name];
    return v ? `/art/${file}?v=${v}` : `/art/${file}`;
};
