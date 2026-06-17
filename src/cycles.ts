import { l, p, r } from "./transform";
import type { Triad } from "./types";

/**
 * Hexatonic cycle through a triad: alternate P and L (starting with P). The six triads
 * returned share a single hexatonic (augmented) collection and close back on the seed.
 */
export function hexatonicCycle(t: Triad): Triad[] {
  const operations = [p, l];
  const cycle: Triad[] = [t];
  let current = t;
  for (let i = 0; i < 5; i++) {
    current = operations[i % 2](current);
    cycle.push(current);
  }
  return cycle;
}

/**
 * Octatonic cycle through a triad: alternate R and P (starting with R). The eight triads
 * returned share a single octatonic collection and close back on the seed.
 */
export function octatonicCycle(t: Triad): Triad[] {
  const operations = [r, p];
  const cycle: Triad[] = [t];
  let current = t;
  for (let i = 0; i < 7; i++) {
    current = operations[i % 2](current);
    cycle.push(current);
  }
  return cycle;
}
