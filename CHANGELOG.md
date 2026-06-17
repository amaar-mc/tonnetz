# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Named compound transformations (N, S).
- Seventh-chord transformations.
- Triad and chord name parsing.
- Tonnetz triangle coordinates for rendering.

## [0.1.0]

### Added
- Triad type with `triad`, `triadToPitchClasses`, `isConsonantTriad`, `triadName`, `allTriads`, `triadsEqual`.
- Neo-Riemannian transformations `p`, `l`, `r`, arbitrary `transform`, and `hexatonicPole`.
- `hexatonicCycle` and `octatonicCycle`.
- `pathBetween` shortest P, L, R path via breadth-first search.
- `commonTones` and the `pitchAtLattice` Tonnetz coordinate map.
- Test suite: exact transformations plus group-theoretic property tests.
