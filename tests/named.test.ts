import { describe, expect, it } from "vitest";
import { commonTones } from "../src/relations";
import { n, s, transform } from "../src/transform";
import { allTriads, triad, triadsEqual } from "../src/triad";

describe("n (Nebenverwandt)", () => {
  it("maps major to subdominant minor and minor to dominant major", () => {
    expect(n(triad(0, "major"))).toEqual(triad(5, "minor")); // C major to F minor
    expect(n(triad(0, "minor"))).toEqual(triad(7, "major")); // C minor to G major
  });

  it("is an involution that keeps one common tone, and equals the R, L, P composition", () => {
    for (const t of allTriads()) {
      expect(triadsEqual(n(n(t)), t)).toBe(true);
      expect(commonTones(t, n(t))).toBe(1);
      expect(n(t)).toEqual(transform(t, "RLP"));
    }
  });
});

describe("s (Slide)", () => {
  it("maps major up a semitone to minor and minor down a semitone to major", () => {
    expect(s(triad(0, "major"))).toEqual(triad(1, "minor")); // C major to C# minor
    expect(s(triad(0, "minor"))).toEqual(triad(11, "major")); // C minor to B major
  });

  it("is an involution that shares the third, and equals the L, P, R composition", () => {
    for (const t of allTriads()) {
      expect(triadsEqual(s(s(t)), t)).toBe(true);
      expect(commonTones(t, s(t))).toBe(1);
      expect(s(t)).toEqual(transform(t, "LPR"));
    }
  });
});
