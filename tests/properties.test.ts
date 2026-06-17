import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { pathBetween } from "../src/path";
import { commonTones } from "../src/relations";
import { l, p, r, transform } from "../src/transform";
import { triadsEqual } from "../src/triad";
import type { Quality, Triad } from "../src/types";

const triadArb: fc.Arbitrary<Triad> = fc.record({
  root: fc.integer({ min: 0, max: 11 }),
  quality: fc.constantFrom<Quality>("major", "minor"),
});

describe("group invariants", () => {
  it("P, L, R are involutions", () => {
    fc.assert(
      fc.property(triadArb, (t) => {
        expect(triadsEqual(p(p(t)), t)).toBe(true);
        expect(triadsEqual(l(l(t)), t)).toBe(true);
        expect(triadsEqual(r(r(t)), t)).toBe(true);
      }),
    );
  });

  it("each transformation preserves exactly two common tones", () => {
    fc.assert(
      fc.property(triadArb, (t) => {
        expect(commonTones(t, p(t))).toBe(2);
        expect(commonTones(t, l(t))).toBe(2);
        expect(commonTones(t, r(t))).toBe(2);
      }),
    );
  });

  it("pathBetween yields a sequence mapping source onto target", () => {
    fc.assert(
      fc.property(triadArb, triadArb, (from, to) => {
        expect(triadsEqual(transform(from, pathBetween(from, to)), to)).toBe(true);
      }),
    );
  });
});
