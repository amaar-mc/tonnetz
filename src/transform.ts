import type { Triad } from "./types";

const MOD = 12;
const mod = (n: number): number => ((n % MOD) + MOD) % MOD;

/**
 * Parallel (P): exchange a triad for the one of opposite quality on the same root,
 * for example C major to C minor. P preserves the root and the fifth.
 */
export function p(t: Triad): Triad {
  return { root: t.root, quality: t.quality === "major" ? "minor" : "major" };
}

/**
 * Leittonwechsel (L): for a major triad, replace the root by the pitch a semitone
 * below it, giving the minor triad a major third above (C major to E minor); the inverse
 * for a minor triad (A minor to F major). L preserves the third and the fifth.
 */
export function l(t: Triad): Triad {
  return t.quality === "major"
    ? { root: mod(t.root + 4), quality: "minor" }
    : { root: mod(t.root - 4), quality: "major" };
}

/**
 * Relative (R): exchange a triad for its relative, for example C major to A minor and
 * A minor to C major. R preserves the root and the third.
 */
export function r(t: Triad): Triad {
  return t.quality === "major"
    ? { root: mod(t.root + 9), quality: "minor" }
    : { root: mod(t.root + 3), quality: "major" };
}

/**
 * Apply a sequence of P, L, and R operations, left to right. For example
 * transform(t, "LPL") applies L, then P, then L.
 */
export function transform(t: Triad, operations: string): Triad {
  let current = t;
  for (const ch of operations) {
    const op = ch.toUpperCase();
    if (op === "P") current = p(current);
    else if (op === "L") current = l(current);
    else if (op === "R") current = r(current);
    else throw new Error(`unknown operation ${JSON.stringify(ch)}, expected P, L, or R`);
  }
  return current;
}

/**
 * Hexatonic pole (LPL): the maximally distant triad sharing no common tones, for
 * example C major to G# minor.
 */
export function hexatonicPole(t: Triad): Triad {
  return transform(t, "LPL");
}

/**
 * Nebenverwandt (N): exchange a major triad for its subdominant minor (C major to F
 * minor) and a minor triad for its dominant major (C minor to G major). Equal to applying
 * R, then L, then P; it preserves one common tone.
 */
export function n(t: Triad): Triad {
  return t.quality === "major"
    ? { root: mod(t.root + 5), quality: "minor" }
    : { root: mod(t.root + 7), quality: "major" };
}

/**
 * Slide (S): exchange two triads that share their third, shifting the root by a semitone
 * and flipping quality (C major to C# minor, C minor to B major). Equal to applying L,
 * then P, then R; it preserves one common tone (the shared third).
 */
export function s(t: Triad): Triad {
  return t.quality === "major"
    ? { root: mod(t.root + 1), quality: "minor" }
    : { root: mod(t.root - 1), quality: "major" };
}
