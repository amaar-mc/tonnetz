const MOD = 12;

/**
 * Pitch class at a Tonnetz lattice coordinate. One step along the fifths axis adds a
 * perfect fifth (7 semitones); one step along the major-thirds axis adds a major third
 * (4 semitones). The lattice wraps on a torus, so many coordinates map to each pitch.
 */
export function pitchAtLattice(fifths: number, majorThirds: number): number {
  if (!Number.isInteger(fifths) || !Number.isInteger(majorThirds)) {
    throw new TypeError("lattice coordinates must be integers");
  }
  return (((7 * fifths + 4 * majorThirds) % MOD) + MOD) % MOD;
}
