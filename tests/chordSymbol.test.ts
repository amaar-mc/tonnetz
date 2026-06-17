import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { chordCandidates, parseChord } from "../src/chordSymbol";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Sorted unique pitch classes mod 12 from a set of intervals above a root. */
function pcs(root: number, intervals: readonly number[]): readonly number[] {
  return [...new Set(intervals.map((i) => (((root + i) % 12) + 12) % 12))].sort((a, b) => a - b);
}

// ---------------------------------------------------------------------------
// parseChord -- pitch-class correctness per quality on C
// ---------------------------------------------------------------------------

describe("parseChord: pitch classes for each quality on C", () => {
  it("major", () => {
    expect(parseChord("C")?.pitchClasses).toEqual(pcs(0, [0, 4, 7]));
    expect(parseChord("Cmaj")?.pitchClasses).toEqual(pcs(0, [0, 4, 7]));
    expect(parseChord("CM")?.pitchClasses).toEqual(pcs(0, [0, 4, 7]));
  });

  it("minor", () => {
    expect(parseChord("Cm")?.pitchClasses).toEqual(pcs(0, [0, 3, 7]));
    expect(parseChord("Cmin")?.pitchClasses).toEqual(pcs(0, [0, 3, 7]));
    expect(parseChord("C-")?.pitchClasses).toEqual(pcs(0, [0, 3, 7]));
  });

  it("diminished", () => {
    expect(parseChord("Cdim")?.pitchClasses).toEqual(pcs(0, [0, 3, 6]));
    expect(parseChord("Co")?.pitchClasses).toEqual(pcs(0, [0, 3, 6]));
  });

  it("augmented", () => {
    expect(parseChord("Caug")?.pitchClasses).toEqual(pcs(0, [0, 4, 8]));
    expect(parseChord("C+")?.pitchClasses).toEqual(pcs(0, [0, 4, 8]));
  });

  it("dominant 7", () => {
    expect(parseChord("C7")?.pitchClasses).toEqual(pcs(0, [0, 4, 7, 10]));
  });

  it("major 7", () => {
    expect(parseChord("Cmaj7")?.pitchClasses).toEqual(pcs(0, [0, 4, 7, 11]));
    expect(parseChord("CM7")?.pitchClasses).toEqual(pcs(0, [0, 4, 7, 11]));
  });

  it("minor 7", () => {
    expect(parseChord("Cm7")?.pitchClasses).toEqual(pcs(0, [0, 3, 7, 10]));
    expect(parseChord("Cmin7")?.pitchClasses).toEqual(pcs(0, [0, 3, 7, 10]));
    expect(parseChord("C-7")?.pitchClasses).toEqual(pcs(0, [0, 3, 7, 10]));
  });

  it("half-diminished 7", () => {
    expect(parseChord("Cm7b5")?.pitchClasses).toEqual(pcs(0, [0, 3, 6, 10]));
    expect(parseChord("Cø7")?.pitchClasses).toEqual(pcs(0, [0, 3, 6, 10]));
    expect(parseChord("Cø")?.pitchClasses).toEqual(pcs(0, [0, 3, 6, 10]));
  });

  it("diminished 7", () => {
    expect(parseChord("Cdim7")?.pitchClasses).toEqual(pcs(0, [0, 3, 6, 9]));
    expect(parseChord("Co7")?.pitchClasses).toEqual(pcs(0, [0, 3, 6, 9]));
  });

  it("sus2", () => {
    expect(parseChord("Csus2")?.pitchClasses).toEqual(pcs(0, [0, 2, 7]));
  });

  it("sus4", () => {
    expect(parseChord("Csus4")?.pitchClasses).toEqual(pcs(0, [0, 5, 7]));
  });

  it("minor-major 7", () => {
    expect(parseChord("CmM7")?.pitchClasses).toEqual(pcs(0, [0, 3, 7, 11]));
    expect(parseChord("Cm(maj7)")?.pitchClasses).toEqual(pcs(0, [0, 3, 7, 11]));
  });
});

// ---------------------------------------------------------------------------
// parseChord -- all 12 roots for major and minor
// ---------------------------------------------------------------------------

describe("parseChord: all 12 roots, major and minor", () => {
  const roots = [
    ["C", 0],
    ["C#", 1],
    ["Db", 1],
    ["D", 2],
    ["D#", 3],
    ["Eb", 3],
    ["E", 4],
    ["F", 5],
    ["F#", 6],
    ["Gb", 6],
    ["G", 7],
    ["G#", 8],
    ["Ab", 8],
    ["A", 9],
    ["A#", 10],
    ["Bb", 10],
    ["B", 11],
  ] as const;

  for (const [name, pc] of roots) {
    it(`${name} major parses to root ${pc}`, () => {
      const result = parseChord(name);
      expect(result).not.toBeNull();
      expect(result?.root).toBe(pc);
      expect(result?.quality).toBe("major");
      expect(result?.pitchClasses).toEqual(pcs(pc, [0, 4, 7]));
    });

    it(`${name}m minor parses to root ${pc}`, () => {
      const result = parseChord(`${name}m`);
      expect(result).not.toBeNull();
      expect(result?.root).toBe(pc);
      expect(result?.quality).toBe("minor");
      expect(result?.pitchClasses).toEqual(pcs(pc, [0, 3, 7]));
    });
  }
});

// ---------------------------------------------------------------------------
// parseChord -- sharp and flat roots for non-major/minor qualities
// ---------------------------------------------------------------------------

describe("parseChord: sharp and flat roots, various qualities", () => {
  it("F# dominant 7", () => {
    const r = parseChord("F#7");
    expect(r?.root).toBe(6);
    expect(r?.quality).toBe("dominant7");
    expect(r?.pitchClasses).toEqual(pcs(6, [0, 4, 7, 10]));
  });

  it("Bb diminished", () => {
    const r = parseChord("Bbdim");
    expect(r?.root).toBe(10);
    expect(r?.quality).toBe("diminished");
    expect(r?.pitchClasses).toEqual(pcs(10, [0, 3, 6]));
  });

  it("Eb maj7", () => {
    const r = parseChord("Ebmaj7");
    expect(r?.root).toBe(3);
    expect(r?.quality).toBe("major7");
    expect(r?.pitchClasses).toEqual(pcs(3, [0, 4, 7, 11]));
  });

  it("Ab minor 7", () => {
    const r = parseChord("Abm7");
    expect(r?.root).toBe(8);
    expect(r?.quality).toBe("minor7");
    expect(r?.pitchClasses).toEqual(pcs(8, [0, 3, 7, 10]));
  });
});

// ---------------------------------------------------------------------------
// parseChord -- enharmonic equivalence
// ---------------------------------------------------------------------------

describe("parseChord: enharmonic equivalence", () => {
  it("C# and Db major parse to root pc 1", () => {
    expect(parseChord("C#")?.root).toBe(1);
    expect(parseChord("Db")?.root).toBe(1);
  });

  it("C# and Db have identical pitch-class sets", () => {
    expect(parseChord("C#")?.pitchClasses).toEqual(parseChord("Db")?.pitchClasses);
  });

  it("F# and Gb major are enharmonic", () => {
    expect(parseChord("F#")?.root).toBe(6);
    expect(parseChord("Gb")?.root).toBe(6);
    expect(parseChord("F#")?.pitchClasses).toEqual(parseChord("Gb")?.pitchClasses);
  });
});

// ---------------------------------------------------------------------------
// parseChord -- invalid input returns null
// ---------------------------------------------------------------------------

describe("parseChord: invalid inputs return null", () => {
  it("empty string", () => expect(parseChord("")).toBeNull());
  it("non-note letter H", () => expect(parseChord("H")).toBeNull());
  it("numeric junk", () => expect(parseChord("C99")).toBeNull());
  it("xyz", () => expect(parseChord("xyz")).toBeNull());
  it("lowercase root c", () => expect(parseChord("cm")).toBeNull());
  it("unsupported ninth Cm9", () => expect(parseChord("Cm9")).toBeNull());
  it("unsupported add9", () => expect(parseChord("Cadd9")).toBeNull());
  it("bare digit", () => expect(parseChord("7")).toBeNull());
});

// ---------------------------------------------------------------------------
// chordCandidates -- basic identification
// ---------------------------------------------------------------------------

describe("chordCandidates", () => {
  it("identifies C major triad", () => {
    const results = chordCandidates([0, 4, 7]);
    expect(results.some((r) => r.root === 0 && r.quality === "major")).toBe(true);
  });

  it("identifies C minor triad", () => {
    const results = chordCandidates([0, 3, 7]);
    expect(results.some((r) => r.root === 0 && r.quality === "minor")).toBe(true);
  });

  it("identifies C dominant 7", () => {
    const results = chordCandidates([0, 4, 7, 10]);
    expect(results.some((r) => r.root === 0 && r.quality === "dominant7")).toBe(true);
  });

  it("identifies C diminished 7 (symmetrical: 4 candidates)", () => {
    const results = chordCandidates([0, 3, 6, 9]);
    expect(results.length).toBe(4);
    expect(results.some((r) => r.root === 0 && r.quality === "diminished7")).toBe(true);
  });

  it("returns empty list for unrecognized pitch-class set", () => {
    expect(chordCandidates([0, 1, 2])).toHaveLength(0);
  });

  it("output is deterministically sorted by root then quality", () => {
    const r1 = chordCandidates([0, 4, 7]);
    const r2 = chordCandidates([0, 4, 7]);
    expect(r1).toEqual(r2);
  });

  it("symbol field is a parseable chord string", () => {
    const results = chordCandidates([0, 4, 7]);
    for (const c of results) {
      const parsed = parseChord(c.symbol);
      expect(parsed).not.toBeNull();
    }
  });
});

// ---------------------------------------------------------------------------
// Round-trip property test
// ---------------------------------------------------------------------------

describe("round-trip property", () => {
  // A representative set of chord symbols to round-trip.
  const ROUND_TRIP_SYMBOLS = [
    "C",
    "Cm",
    "C7",
    "Cmaj7",
    "Cm7",
    "Cm7b5",
    "Cdim7",
    "Csus2",
    "Csus4",
    "CmM7",
    "Caug",
    "Cdim",
    "F#",
    "Bbm",
    "Ebmaj7",
    "G7",
    "Abm7",
    "D#dim",
  ];

  it("parseChord then chordCandidates yields a result with the same pitch-class set", () => {
    for (const sym of ROUND_TRIP_SYMBOLS) {
      const parsed = parseChord(sym);
      expect(parsed, `parseChord("${sym}") should not be null`).not.toBeNull();
      if (parsed === null) continue;
      const candidates = chordCandidates(parsed.pitchClasses);
      expect(
        candidates.some((c) => {
          const p2 = parseChord(c.symbol);
          return (
            p2 !== null &&
            p2.pitchClasses.length === parsed.pitchClasses.length &&
            p2.pitchClasses.every((pc, i) => pc === parsed.pitchClasses[i])
          );
        }),
        `chordCandidates for "${sym}" should yield a symbol that parses to the same pcs`,
      ).toBe(true);
    }
  });

  it("property: any quality on any root round-trips through chordCandidates", () => {
    const qualities = [
      "major",
      "minor",
      "diminished",
      "augmented",
      "dominant7",
      "major7",
      "minor7",
      "halfDiminished7",
      "diminished7",
      "sus2",
      "sus4",
      "minorMajor7",
    ] as const;

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 11 }),
        fc.constantFrom(...qualities),
        (root, quality) => {
          // Build the canonical symbol and parse it.
          const suffixMap: Record<string, string> = {
            major: "",
            minor: "m",
            diminished: "dim",
            augmented: "aug",
            dominant7: "7",
            major7: "maj7",
            minor7: "m7",
            halfDiminished7: "m7b5",
            diminished7: "dim7",
            sus2: "sus2",
            sus4: "sus4",
            minorMajor7: "mM7",
          };
          const rootNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
          const sym = `${rootNames[root]}${suffixMap[quality]}`;
          const parsed = parseChord(sym);
          if (parsed === null) return false;

          const candidates = chordCandidates(parsed.pitchClasses);
          return candidates.some((c) => {
            const p2 = parseChord(c.symbol);
            return (
              p2 !== null &&
              p2.pitchClasses.length === parsed.pitchClasses.length &&
              p2.pitchClasses.every((pc, i) => pc === parsed.pitchClasses[i])
            );
          });
        },
      ),
    );
  });
});
