/** Triad quality. Neo-Riemannian theory acts on the consonant triads. */
export type Quality = "major" | "minor";

/** A consonant triad: a root pitch class (0..11, C = 0) and a quality. */
export interface Triad {
  /** Root pitch class, 0..11. */
  readonly root: number;
  /** Major or minor. */
  readonly quality: Quality;
}
