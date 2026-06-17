import { l, p, r } from "./transform";
import { triadsEqual } from "./triad";
import type { Triad } from "./types";

const key = (t: Triad): string => `${t.root}${t.quality === "major" ? "M" : "m"}`;

const OPERATIONS: ReadonlyArray<readonly [string, (t: Triad) => Triad]> = [
  ["P", p],
  ["L", l],
  ["R", r],
];

/**
 * Shortest sequence of P, L, R operations that maps `from` onto `to`, found by
 * breadth-first search over the 24 triads. Returns "" when the triads are equal.
 * The PLR group acts transitively, so a path always exists.
 */
export function pathBetween(from: Triad, to: Triad): string {
  if (triadsEqual(from, to)) return "";
  const visited = new Set<string>([key(from)]);
  const queue: Array<{ triad: Triad; path: string }> = [{ triad: from, path: "" }];
  while (queue.length > 0) {
    const node = queue.shift() as { triad: Triad; path: string };
    for (const [name, fn] of OPERATIONS) {
      const next = fn(node.triad);
      if (triadsEqual(next, to)) return node.path + name;
      const k = key(next);
      if (!visited.has(k)) {
        visited.add(k);
        queue.push({ triad: next, path: node.path + name });
      }
    }
  }
  throw new Error("no path found between triads");
}
