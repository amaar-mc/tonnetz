import { describe, expect, it } from "vitest";
import { hexatonicCycle, octatonicCycle } from "../src/cycles";
import { commonTones } from "../src/relations";
import { triad, triadsEqual, triadToPitchClasses } from "../src/triad";

const union = (cycle: ReturnType<typeof hexatonicCycle>): Set<number> => {
  const all = new Set<number>();
  for (const t of cycle) for (const pc of triadToPitchClasses(t)) all.add(pc);
  return all;
};

const distinctCount = (cycle: ReturnType<typeof hexatonicCycle>): number =>
  new Set(cycle.map((t) => `${t.root}${t.quality}`)).size;

describe("hexatonicCycle", () => {
  const cycle = hexatonicCycle(triad(0, "major"));

  it("has six distinct triads spanning a hexatonic collection", () => {
    expect(cycle).toHaveLength(6);
    expect(distinctCount(cycle)).toBe(6);
    expect(union(cycle).size).toBe(6);
  });

  it("keeps two common tones between adjacent triads", () => {
    for (let i = 1; i < cycle.length; i++) {
      expect(commonTones(cycle[i - 1], cycle[i])).toBe(2);
    }
  });
});

describe("octatonicCycle", () => {
  const cycle = octatonicCycle(triad(0, "major"));

  it("has eight distinct triads spanning an octatonic collection", () => {
    expect(cycle).toHaveLength(8);
    expect(distinctCount(cycle)).toBe(8);
    expect(union(cycle).size).toBe(8);
  });

  it("starts on the seed triad", () => {
    expect(triadsEqual(cycle[0], triad(0, "major"))).toBe(true);
  });
});
