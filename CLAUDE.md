# tonnetz

TypeScript library for neo-Riemannian music theory. Zero runtime dependencies.

## Commands

- Install: `npm install`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint` (Biome); fix with `npm run format`
- Test: `npm test` (Vitest)
- Build: `npm run build` (tsup, dual ESM and CJS plus type declarations)
- Example: `npm run example`

## Architecture

Small pure modules under `src/`:
- `types.ts` the Triad type and Quality
- `triad.ts` construction, pitch-class conversion, consonant-triad detection, naming
- `transform.ts` P, L, R, arbitrary compositions, hexatonic pole
- `cycles.ts` hexatonic and octatonic cycles
- `path.ts` shortest P, L, R path by breadth-first search over the 24 triads
- `relations.ts` common-tone count
- `lattice.ts` Tonnetz coordinate map
- `index.ts` public surface

See `docs/architecture.md` for the transformation definitions.

## Conventions

- All functions pure and strictly typed. No default parameter values.
- Triads are `{ root, quality }`; roots are reduced modulo 12.
- The minor-triad case of L and R differs from the major-triad case; keep both correct.
- No runtime dependencies. Keep the public API small.

## Testing rules

- Exact textbook values for each transformation, both qualities.
- Property tests for invariants: involutions, two common tones, path reachability.
- Bug fixes start with a failing test.

## Release

- Semantic versioning. Update `CHANGELOG.md`.
- Gates: `npm run typecheck && npm run lint && npm test && npm run build && npm pack --dry-run`.
- Tag `vX.Y.Z`, then `npm publish` (needs npm auth) and a GitHub release.

## Style

- No em dash characters in docs, comments, or commit messages.
- Comments explain non-obvious reasoning only.
