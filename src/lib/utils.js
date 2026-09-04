import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Clamp to [0, 1].
 *
 * Scroll-linked `useTransform` input ranges are handed to WAAPI as
 * ScrollTimeline keyframe offsets, which reject anything outside [0,1] with
 * "Offsets must be null or in the range [0,1]"  and that throw blanks the
 * page. Any range built by padding a slice (`start - fade`, `end + fade`)
 * must go through this.
 */
export const clamp01 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Linear interpolation. */
export const lerp = (a, b, t) => a + (b - a) * t;
