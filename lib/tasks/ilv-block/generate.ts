import { createRng, rngInt } from "@/lib/random";

export interface IlvBlockParams {
  /** Primärkosten V1, V2. */
  PK: [number, number];
  /** Leistungsabgabe V1: an V2, E1, E2 (Mengen). */
  v1: { v2: number; e1: number; e2: number };
  /** Leistungsabgabe V2: an V1, E1, E2 (Mengen). */
  v2: { v1: number; e1: number; e2: number };
}

export function generateIlvBlock(seed: number): IlvBlockParams {
  const rng = createRng(seed);
  return {
    PK: [
      rngInt(rng, 5, 30) * 1000,
      rngInt(rng, 5, 30) * 1000,
    ],
    v1: {
      v2: rngInt(rng, 50, 200),
      e1: rngInt(rng, 200, 600),
      e2: rngInt(rng, 200, 600),
    },
    v2: {
      v1: rngInt(rng, 50, 200),
      e1: rngInt(rng, 200, 600),
      e2: rngInt(rng, 200, 600),
    },
  };
}
