# Charter

## Purpose

Provide a correct, small, dependency-free engine for neo-Riemannian music theory that
runs in the browser and in Node, so that interactive Tonnetz tools and transformational
analysis can be built on a trustworthy core.

## Scope

- Consonant triads and their pitch-class content.
- The P, L, R transformations and their compositions.
- Hexatonic and octatonic cycles, and the hexatonic pole.
- Common-tone counts and shortest transformation paths.
- The Tonnetz lattice coordinate map.

## Non-goals

- A full musicology framework. This is not a competitor to music21.
- Audio synthesis or playback. Tone.js covers that ground.
- Tonal harmony by chord name (keys, functions, voice-leading rules). The tonal library
  covers that, and tonnetz works alongside it.

## Principles

- Correctness first. Every transformation is tested against its textbook result and the
  invariants it must satisfy.
- Small, stable public API. Pure functions only.
- Zero runtime dependencies.
- Honest documentation of each transformation, including the minor-triad case.

## Audience

Music theory students and educators, composers working with chromatic harmony,
developers of Tonnetz visualizers, and computational musicologists.
