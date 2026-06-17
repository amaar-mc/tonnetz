import { describe, expect, it } from "vitest";
import { allTriads, isConsonantTriad, triad, triadName, triadToPitchClasses } from "../src/triad";

describe("triad", () => {
  it("reduces the root modulo 12", () => {
    expect(triad(12, "major")).toEqual(triad(0, "major"));
    expect(triad(-1, "minor")).toEqual(triad(11, "minor"));
  });

  it("rejects non-integer roots", () => {
    expect(() => triad(1.5, "major")).toThrow(TypeError);
  });
});

describe("triadToPitchClasses", () => {
  it("spells major and minor triads", () => {
    expect(triadToPitchClasses(triad(0, "major"))).toEqual([0, 4, 7]);
    expect(triadToPitchClasses(triad(0, "minor"))).toEqual([0, 3, 7]);
    expect(triadToPitchClasses(triad(9, "minor"))).toEqual([0, 4, 9]);
  });
});

describe("isConsonantTriad", () => {
  it("recognizes major and minor triads in any order", () => {
    expect(isConsonantTriad([7, 0, 4])).toEqual(triad(0, "major"));
    expect(isConsonantTriad([7, 3, 0])).toEqual(triad(0, "minor"));
    expect(isConsonantTriad([0, 4, 9])).toEqual(triad(9, "minor"));
  });

  it("rejects non-triads", () => {
    expect(isConsonantTriad([0, 4, 8])).toBeNull(); // augmented
    expect(isConsonantTriad([0, 3, 6])).toBeNull(); // diminished
    expect(isConsonantTriad([0, 4])).toBeNull(); // too few
    expect(isConsonantTriad([0, 1, 4, 7])).toBeNull(); // four distinct pitch classes
  });

  it("tolerates duplicate pitch classes", () => {
    expect(isConsonantTriad([0, 0, 4, 7])).toEqual(triad(0, "major"));
  });
});

describe("triadName and allTriads", () => {
  it("names triads", () => {
    expect(triadName(triad(0, "major"))).toBe("C major");
    expect(triadName(triad(8, "minor"))).toBe("G# minor");
  });

  it("lists all 24 consonant triads", () => {
    const all = allTriads();
    expect(all).toHaveLength(24);
    expect(new Set(all.map((t) => `${t.root}${t.quality}`)).size).toBe(24);
  });
});
