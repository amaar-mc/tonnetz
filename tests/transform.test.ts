import { describe, expect, it } from "vitest";
import { commonTones } from "../src/relations";
import { hexatonicPole, l, p, r, transform } from "../src/transform";
import { triad } from "../src/triad";

describe("P, L, R", () => {
  it("computes the textbook transformations from C major", () => {
    expect(p(triad(0, "major"))).toEqual(triad(0, "minor"));
    expect(l(triad(0, "major"))).toEqual(triad(4, "minor")); // E minor
    expect(r(triad(0, "major"))).toEqual(triad(9, "minor")); // A minor
  });

  it("computes the minor-triad cases", () => {
    expect(p(triad(0, "minor"))).toEqual(triad(0, "major"));
    expect(l(triad(9, "minor"))).toEqual(triad(5, "major")); // A minor to F major
    expect(r(triad(9, "minor"))).toEqual(triad(0, "major")); // A minor to C major
  });

  it("each transformation keeps exactly two common tones", () => {
    const t = triad(3, "major");
    expect(commonTones(t, p(t))).toBe(2);
    expect(commonTones(t, l(t))).toBe(2);
    expect(commonTones(t, r(t))).toBe(2);
  });
});

describe("transform", () => {
  it("applies operations left to right", () => {
    expect(transform(triad(0, "major"), "PL")).toEqual(l(p(triad(0, "major"))));
  });

  it("rejects unknown operations", () => {
    expect(() => transform(triad(0, "major"), "PX")).toThrow();
  });
});

describe("hexatonicPole", () => {
  it("maps C major to G# minor with no common tones", () => {
    const pole = hexatonicPole(triad(0, "major"));
    expect(pole).toEqual(triad(8, "minor"));
    expect(commonTones(triad(0, "major"), pole)).toBe(0);
  });

  it("equals the LPL composition", () => {
    const t = triad(7, "minor");
    expect(hexatonicPole(t)).toEqual(transform(t, "LPL"));
  });
});
