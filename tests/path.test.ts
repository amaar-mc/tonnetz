import { describe, expect, it } from "vitest";
import { pathBetween } from "../src/path";
import { transform } from "../src/transform";
import { allTriads, triad, triadsEqual } from "../src/triad";

describe("pathBetween", () => {
  it("returns an empty path between equal triads", () => {
    expect(pathBetween(triad(0, "major"), triad(0, "major"))).toBe("");
  });

  it("finds single-step transformations", () => {
    expect(pathBetween(triad(0, "major"), triad(0, "minor"))).toBe("P");
    expect(pathBetween(triad(0, "major"), triad(9, "minor"))).toBe("R");
    expect(pathBetween(triad(0, "major"), triad(4, "minor"))).toBe("L");
  });

  it("produces a path that actually maps source to target for all triad pairs", () => {
    const triads = allTriads();
    for (const from of triads) {
      for (const to of triads) {
        const path = pathBetween(from, to);
        expect(triadsEqual(transform(from, path), to)).toBe(true);
      }
    }
  });
});
