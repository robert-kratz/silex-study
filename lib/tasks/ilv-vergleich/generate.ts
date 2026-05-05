import { createRng, rngInt } from "@/lib/random";

export interface IlvVergleichParams {
  /** Primärkosten V1, V2. */
  PK: [number, number];
  /** Wechselseitige Mengen. */
  x12: number; // V1 → V2
  x21: number; // V2 → V1
  /** V1 → E1, V1 → E2 */
  v1End: [number, number];
  /** V2 → E1, V2 → E2 */
  v2End: [number, number];
}

export function generateIlvVergleich(seed: number): IlvVergleichParams {
  const rng = createRng(seed);
  return {
    PK: [rngInt(rng, 8, 30) * 1000, rngInt(rng, 8, 30) * 1000],
    x12: rngInt(rng, 60, 180),
    x21: rngInt(rng, 60, 180),
    v1End: [rngInt(rng, 200, 500), rngInt(rng, 200, 500)],
    v2End: [rngInt(rng, 200, 500), rngInt(rng, 200, 500)],
  };
}
