const MOD = 12;
const mod = (n: number): number => ((n % MOD) + MOD) % MOD;

/** Pitch class for each root letter and accidental, C = 0. */
const ROOT_PCS: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

/** Canonical symbol for each pitch class (sharp spelling). */
const PC_TO_NAME: readonly string[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

/** Quality labels recognized by this module. */
export type ChordQuality =
  | "major"
  | "minor"
  | "diminished"
  | "augmented"
  | "dominant7"
  | "major7"
  | "minor7"
  | "halfDiminished7"
  | "diminished7"
  | "sus2"
  | "sus4"
  | "minorMajor7";

/** Intervals above the root (in semitones, reduced mod 12) for each quality. */
const QUALITY_INTERVALS: Record<ChordQuality, readonly number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
  dominant7: [0, 4, 7, 10],
  major7: [0, 4, 7, 11],
  minor7: [0, 3, 7, 10],
  halfDiminished7: [0, 3, 6, 10],
  diminished7: [0, 3, 6, 9],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  minorMajor7: [0, 3, 7, 11],
};

/** Canonical symbol suffix for each quality, used by chordCandidates. */
const QUALITY_SUFFIX: Record<ChordQuality, string> = {
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

/**
 * Suffixes recognized for each quality, tried in order (longest first to prevent
 * "maj7" being partially matched by "maj").
 */
const QUALITY_PATTERNS: readonly [string, ChordQuality][] = [
  // 7-chord with explicit suffixes
  ["mM7", "minorMajor7"],
  ["m(maj7)", "minorMajor7"],
  ["min(maj7)", "minorMajor7"],
  ["maj7", "major7"],
  ["M7", "major7"],
  ["m7b5", "halfDiminished7"],
  ["ø7", "halfDiminished7"], // ø7
  ["ø", "halfDiminished7"], // ø (without the 7)
  ["dim7", "diminished7"],
  ["o7", "diminished7"],
  ["m7", "minor7"],
  ["min7", "minor7"],
  ["-7", "minor7"],
  // Triads
  ["sus4", "sus4"],
  ["sus2", "sus2"],
  ["aug", "augmented"],
  ["+", "augmented"],
  ["dim", "diminished"],
  ["o", "diminished"],
  ["min", "minor"],
  ["m", "minor"],
  ["-", "minor"],
  ["maj", "major"],
  ["M", "major"],
  // Dominant 7 (must follow all quality patterns that could precede "7")
  ["7", "dominant7"],
  // Empty string means plain major; handled separately after everything else fails
];

/** Parse a chord symbol into root pitch class, quality label, and pitch classes.
 * Returns null for any input that cannot be recognized. */
export function parseChord(
  symbol: string,
): { root: number; quality: ChordQuality; pitchClasses: readonly number[] } | null {
  if (symbol.length === 0) return null;

  // Extract root: letter (A-G) optionally followed by # or b.
  const firstChar = symbol[0];
  if (firstChar === undefined || !/^[A-G]$/.test(firstChar)) return null;

  let rootStr: string;
  let suffix: string;
  if (symbol.length >= 2 && (symbol[1] === "#" || symbol[1] === "b")) {
    rootStr = symbol.slice(0, 2);
    suffix = symbol.slice(2);
  } else {
    rootStr = symbol.slice(0, 1);
    suffix = symbol.slice(1);
  }

  const rootPc = ROOT_PCS[rootStr];
  if (rootPc === undefined) return null;

  // Match quality from suffix.
  let quality: ChordQuality | null = null;
  for (const [pattern, q] of QUALITY_PATTERNS) {
    if (suffix === pattern) {
      quality = q;
      suffix = "";
      break;
    }
  }

  // If no quality matched but suffix is empty, it is a plain major.
  if (quality === null && suffix === "") {
    quality = "major";
  }

  // Anything left in suffix means the symbol was not fully consumed.
  if (quality === null || suffix !== "") return null;

  const pitchClasses = QUALITY_INTERVALS[quality].map((i) => mod(rootPc + i)).sort((a, b) => a - b);

  return { root: rootPc, quality, pitchClasses };
}

/** Build a sorted unique pitch-class set (0..11) from an array, for comparison. */
function normalizePcs(pcs: readonly number[]): readonly number[] {
  return [...new Set(pcs.map(mod))].sort((a, b) => a - b);
}

/**
 * Given a pitch-class set, return all chord symbols whose pitch-class content
 * exactly matches the input. The result is deterministically sorted by root then quality.
 */
export function chordCandidates(
  pcs: readonly number[],
): readonly { root: number; quality: ChordQuality; symbol: string }[] {
  const target = normalizePcs(pcs);
  const out: { root: number; quality: ChordQuality; symbol: string }[] = [];

  const qualities = Object.keys(QUALITY_INTERVALS) as ChordQuality[];

  for (let root = 0; root < MOD; root++) {
    for (const quality of qualities) {
      const candidate = QUALITY_INTERVALS[quality].map((i) => mod(root + i)).sort((a, b) => a - b);
      if (candidate.length === target.length && candidate.every((pc, i) => pc === target[i])) {
        out.push({ root, quality, symbol: `${PC_TO_NAME[root]}${QUALITY_SUFFIX[quality]}` });
      }
    }
  }

  // Sort by root then quality label for deterministic output.
  out.sort((a, b) => a.root - b.root || a.quality.localeCompare(b.quality));
  return out;
}
