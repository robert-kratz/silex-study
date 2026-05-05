import { createRng, rngInt } from "@/lib/random";

export interface IlvTreppeParams {
  PK: { A: number; B: number; C: number };
  /** A → B, A → C, A → E1, A → E2 */
  A: { b: number; c: number; e1: number; e2: number };
  /** B → C, B → E1, B → E2 */
  B: { c: number; e1: number; e2: number };
  /** C → E1, C → E2 */
  C: { e1: number; e2: number };
}

export function generateIlvTreppe(seed: number): IlvTreppeParams {
  const rng = createRng(seed);
  return {
    PK: {
      A: rngInt(rng, 5, 25) * 1000,
      B: rngInt(rng, 5, 25) * 1000,
      C: rngInt(rng, 5, 25) * 1000,
    },
    A: {
      b: rngInt(rng, 50, 200),
      c: rngInt(rng, 50, 200),
      e1: rngInt(rng, 200, 500),
      e2: rngInt(rng, 200, 500),
    },
    B: {
      c: rngInt(rng, 50, 200),
      e1: rngInt(rng, 200, 500),
      e2: rngInt(rng, 200, 500),
    },
    C: {
      e1: rngInt(rng, 200, 500),
      e2: rngInt(rng, 200, 500),
    },
  };
}
