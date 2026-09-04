import { useSyncExternalStore } from 'react';

/**
 * Subscribe to a CSS media query.
 *
 * `useSyncExternalStore` rather than useState + useEffect: the value is read
 * during render from the same source the browser is using, so the first paint
 * already matches the device instead of rendering the desktop branch and
 * swapping on the next frame.
 */
export function useMediaQuery(query) {
    return useSyncExternalStore(
        (onChange) => {
            if (typeof window === 'undefined') return () => {};
            const mql = window.matchMedia(query);
            mql.addEventListener('change', onChange);
            return () => mql.removeEventListener('change', onChange);
        },
        () => (typeof window === 'undefined' ? false : window.matchMedia(query).matches),
        () => false,
    );
}

/**
 * True on a touch screen  no hover, no fine pointer.
 *
 * Everything gated on this is pointer-driven decoration (tilt, specular
 * glare, hover zoom) that can never fire on a touch device, but whose
 * compositing cost  a permanent `will-change` layer, a `preserve-3d`
 * context, a `mix-blend-mode` overlay per card  is paid on every scroll
 * frame regardless. iOS Safari is where that bill actually lands.
 */
export const COARSE_POINTER = '(hover: none) and (pointer: coarse)';

/** Coarse pointer *and* phone-sized  tablets keep the richer treatment. */
export const TOUCH_PHONE = '(hover: none) and (pointer: coarse) and (max-width: 767px)';
