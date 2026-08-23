/**
 * GENERATED — do not edit.
 * Written by scripts/generate-art-manifest.mjs from the contents of
 * public/art/. Add or remove a .webm/.mp4 there and re-run `npm run artwork`.
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
    "studio": [
        "webm"
    ],
    "work-ai": [
        "webm"
    ],
    "work-commerce": [
        "webm"
    ],
    "work-saas": [
        "webm"
    ],
    "work-seo": [
        "webm"
    ]
};

/** True when this tile has a motion file to play. */
export const hasMotion = (name) => Boolean(ART_MOTION[name]);
