import { createRng, rngInt } from "@/lib/random";

export interface IlvGleichungParams {
  PK: [number, number];
  /** Gesamtleistung V1, V2 (Eigenproduktion). */
  x: [number, number];
  /** V1 → V2 Menge. */
  x12: number;
  /** V2 → V1 Menge. */
  x21: number;
  /** Endstellen: V1 → E1, V1 → E2. */
  v1End: [number, number];
  /** Endstellen: V2 → E1, V2 → E2. */
  v2End: [number, number];
}

export function generateIlvGleichung(seed: number): IlvGleichungParams {
  const rng = createRng(seed);
  // Pick "schöne" Verrechnungspreise und leite PK ab.
  const k1 = rngInt(rng, 8, 25);
  const k2 = rngInt(rng, 8, 25);
  const x12 = rngInt(rng, 30, 100);
  const x21 = rngInt(rng, 30, 100);
  const v1End: [number, number] = [rngInt(rng, 200, 500), rngInt(rng, 200, 500)];
  const v2End: [number, number] = [rngInt(rng, 200, 500), rngInt(rng, 200, 500)];
  const x: [number, number] = [
    x12 + v1End[0] + v1End[1],
    x21 + v2End[0] + v2End[1],
  ];
  const PK1 = x[0] * k1 - x21 * k2;
  const PK2 = x[1] * k2 - x12 * k1;
  return {
    PK: [PK1, PK2],
    x,
    x12,
    x21,
    v1End,
    v2End,
  };
}
