import type { Quality, Triad } from "./types";

const MOD = 12;
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const mod = (n: number): number => ((n % MOD) + MOD) % MOD;

/** Construct a triad, reducing the root modulo 12. */
export function triad(root: number, quality: Quality): Triad {
  if (!Number.isInteger(root)) {
    throw new TypeError(`root must be an integer, received ${String(root)}`);
  }
  return { root: mod(root), quality };
}

/** The three pitch classes of a triad, ascending from the root. */
export function triadToPitchClasses(t: Triad): number[] {
  const third = t.quality === "major" ? 4 : 3;
  return [t.root, mod(t.root + third), mod(t.root + 7)].sort((a, b) => a - b);
}

/** Identify a three-note pitch-class set as a major or minor triad, or null if neither. */
export function isConsonantTriad(pcs: readonly number[]): Triad | null {
  const set = new Set(pcs.map(mod));
  if (set.size !== 3) return null;
  for (let root = 0; root < MOD; root++) {
    if (set.has(root) && set.has(mod(root + 4)) && set.has(mod(root + 7))) {
      return { root, quality: "major" };
    }
    if (set.has(root) && set.has(mod(root + 3)) && set.has(mod(root + 7))) {
      return { root, quality: "minor" };
    }
  }
  return null;
}

/** A readable name such as "C major" or "G# minor". */
export function triadName(t: Triad): string {
  return `${NOTE_NAMES[mod(t.root)]} ${t.quality}`;
}

/** All 24 consonant triads (12 major, 12 minor). */
export function allTriads(): Triad[] {
  const out: Triad[] = [];
  for (let root = 0; root < MOD; root++) {
    out.push({ root, quality: "major" });
    out.push({ root, quality: "minor" });
  }
  return out;
}

/** True when two triads have the same root and quality. */
export function triadsEqual(a: Triad, b: Triad): boolean {
  return a.root === b.root && a.quality === b.quality;
}
