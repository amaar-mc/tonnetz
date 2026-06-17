# tonnetz

<p align="center">
  <img src="assets/logo.png" alt="tonnetz logo" width="160">
</p>

[![CI](https://github.com/amaar-mc/tonnetz/actions/workflows/ci.yml/badge.svg)](https://github.com/amaar-mc/tonnetz/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Neo-Riemannian music theory for JavaScript and TypeScript: the P, L, R transformations, hexatonic and octatonic cycles, the Tonnetz lattice, and shortest transformation paths between triads. Typed, zero runtime dependencies, runs in the browser and in Node.

## Install

```sh
npm install tonnetz
```

## 30-second example

```ts
import { triad, p, l, r, transform, hexatonicPole, pathBetween, triadName } from "tonnetz";

const c = triad(0, "major");        // C major

p(c);                                // { root: 0, quality: "minor" }   C minor
l(c);                                // { root: 4, quality: "minor" }   E minor
r(c);                                // { root: 9, quality: "minor" }   A minor

triadName(hexatonicPole(c));         // "G# minor"  (no common tones)
triadName(transform(c, "LPR"));      // "C# minor"  (apply L, then P, then R)

pathBetween(c, triad(5, "minor"));   // "PLR"  shortest route to F minor
```

### Chord symbol parsing (v0.3.0)

```ts
import { parseChord, chordCandidates } from "tonnetz";

parseChord("C");       // { root: 0, quality: "major",    pitchClasses: [0, 4, 7] }
parseChord("Cm7");     // { root: 0, quality: "minor7",   pitchClasses: [0, 3, 7, 10] }
parseChord("F#maj7");  // { root: 6, quality: "major7",   pitchClasses: [1, 6, 10, 11] }
parseChord("Bbdim7");  // { root: 10, quality: "diminished7", pitchClasses: [0, 3, 6, 10] }
parseChord("Csus4");   // { root: 0, quality: "sus4",     pitchClasses: [0, 5, 7] }
parseChord("xyz");     // null

// Identify all chords that contain the pitch classes 0, 4, 7 (C major triad).
chordCandidates([0, 4, 7]);
// [{ root: 0, quality: "major", symbol: "C" }, ...]
```

Triads are `{ root, quality }` with root a pitch class (0..11, C = 0). All functions are pure.

## Why this exists

Neo-Riemannian theory (the PLR transformations and the Tonnetz) is standard in modern
music theory, but there is no JavaScript or TypeScript library for it. `tonal` covers
tonal harmony but not transformational theory; `Tone.js` is for audio; `music21` is a
large Python framework that does not run in a browser. `tonnetz` fills that gap with a
small, correct, dependency-free engine, well suited to interactive teaching tools and
analysis.

## Comparison

| Capability                  | tonnetz | tonal | music21 |
|-----------------------------|:-------:|:-----:|:-------:|
| P, L, R transformations     |   yes   |  no   |   yes   |
| Compound transformations    |   yes   |  no   |   yes   |
| Hexatonic / octatonic cycles|   yes   |  no   | partial |
| Shortest PLR path           |   yes   |  no   |   no    |
| Tonnetz lattice coordinates |   yes   |  no   |   no    |
| Common chord symbol parsing |   yes   |  yes  |   yes   |
| Zero runtime dependencies   |   yes   |  yes  |   no    |
| Runs in the browser         |   yes   |  yes  |   no    |
| Language                    |   TS    | JS/TS | Python  |

## API

### Triads

- `triad(root, quality)` constructs a triad, reducing the root modulo 12.
- `triadToPitchClasses(t)` returns the three pitch classes.
- `isConsonantTriad(pcs)` identifies a pitch-class set as a major or minor triad, or null.
- `triadName(t)` returns a readable name such as "C major".
- `allTriads()` returns all 24 consonant triads.
- `triadsEqual(a, b)` compares root and quality.

### Transformations

- `p(t)`, `l(t)`, `r(t)` are the Parallel, Leittonwechsel, and Relative transformations.
- `n(t)` (Nebenverwandt) and `s(t)` (Slide) are the named compound transformations.
- `transform(t, "LPR")` applies a sequence of operations, left to right.
- `hexatonicPole(t)` returns the maximally distant triad (LPL).

### Cycles and paths

- `hexatonicCycle(t)` returns the six triads of the hexatonic cycle.
- `octatonicCycle(t)` returns the eight triads of the octatonic cycle.
- `pathBetween(from, to)` returns the shortest P, L, R sequence mapping one triad to another.

### Geometry and relations

- `commonTones(a, b)` counts shared pitch classes.
- `pitchAtLattice(fifths, majorThirds)` maps a Tonnetz lattice coordinate to a pitch class.

### Chord symbol parsing

- `parseChord(symbol)` parses a standard chord symbol string (e.g. `"Cm7"`, `"F#maj7"`, `"Bbdim7"`,
  `"Csus4"`, `"CmM7"`) into `{ root, quality, pitchClasses }`. Root is a pitch class (C = 0,
  C# = 1, ..., B = 11). Accepts all 12 roots with sharps and flats. Returns `null` for
  unrecognized input.
- `chordCandidates(pcs)` is the inverse: given a pitch-class array, returns all recognized chord
  symbols whose pitch-class content exactly matches, sorted deterministically by root then quality.
- `ChordQuality` is the type for the quality field, a union of string literals.

Supported quality labels and the spellings accepted for each:

| Quality label      | Accepted suffixes                        | Example    |
|--------------------|------------------------------------------|------------|
| `major`            | (none), `maj`, `M`                       | `C`, `Cmaj`|
| `minor`            | `m`, `min`, `-`                          | `Cm`, `Cmin`|
| `diminished`       | `dim`, `o`                               | `Cdim`, `Co`|
| `augmented`        | `aug`, `+`                               | `Caug`, `C+`|
| `dominant7`        | `7`                                      | `C7`       |
| `major7`           | `maj7`, `M7`                             | `Cmaj7`    |
| `minor7`           | `m7`, `min7`, `-7`                       | `Cm7`      |
| `halfDiminished7`  | `m7b5`, `ø7`, `ø`                        | `Cm7b5`    |
| `diminished7`      | `dim7`, `o7`                             | `Cdim7`    |
| `sus2`             | `sus2`                                   | `Csus2`    |
| `sus4`             | `sus4`                                   | `Csus4`    |
| `minorMajor7`      | `mM7`, `m(maj7)`, `min(maj7)`            | `CmM7`     |

## The transformations

- P (Parallel) swaps quality on the same root: C major to C minor.
- L (Leittonwechsel): C major to E minor, A minor to F major.
- R (Relative): C major to A minor, A minor to C major.

Each preserves exactly two common tones, and each is its own inverse. Together they
generate the dihedral group of order 24 acting on the 24 consonant triads, which is why
a path always exists between any two triads. These properties are tested.

## Roadmap

- Seventh-chord transformations (Childs/Gollin neo-Riemannian operations on seventh chords).
- Tonnetz triangle coordinates for rendering.

## Examples

```sh
npm run example
```

## Testing

```sh
npm test
```

Tests cover the exact textbook transformations and group-theoretic invariants
(involutions, the two-common-tone property, and that every shortest path actually maps
its source onto its target across all 24 triads).

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT. See [LICENSE](./LICENSE).
