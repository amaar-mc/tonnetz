import { triadToPitchClasses } from "./triad";
import type { Triad } from "./types";

/** Number of pitch classes shared by two triads (0 to 3). */
export function commonTones(a: Triad, b: Triad): number {
  const pcsB = new Set(triadToPitchClasses(b));
  let count = 0;
  for (const pc of triadToPitchClasses(a)) if (pcsB.has(pc)) count++;
  return count;
}
