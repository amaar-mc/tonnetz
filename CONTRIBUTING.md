# Contributing to tonnetz

Thanks for your interest. This project values correctness, a small surface area,
and zero runtime dependencies.

## Development

```sh
npm install
npm run typecheck
npm run lint
npm test
npm run build
```

## Guidelines

- Keep the public API small and stable. New functions should be pure and typed.
- Every behavior change needs a test. A bug fix starts with a failing test.
- Theory claims must be backed by exact reference values (the textbook result of a
  transformation) or by a group-theoretic invariant (involution, common-tone count,
  reachability).
- No runtime dependencies.
- Run `npm run format` before committing.
- Commit messages follow `type(scope): description`, for example
  `feat(transform): add the Nebenverwandt transformation`.

## Adding a transformation

State its definition in the docstring, give an exact example in a test (both the
major-triad and minor-triad cases), and add the relevant invariants.

## Reporting issues

Open an issue with the input triad, the operation, the expected result with a source,
and the result you observed.
