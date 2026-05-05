import { createRng, rngInt } from "@/lib/random";

export interface GutschriftLastschriftParams {
  PK: [number, number];
  /** Plan-Verrechnungspreise. */
  vp: [number, number];
  /** Gesamt-Eigenleistung x_1, x_2. */
  x: [number, number];
  /** Wechselseitige Mengen V1 → V2 und V2 → V1. */
  x12: number;
  x21: number;
}

export function generateGutschriftLastschrift(
  seed: number,
): GutschriftLastschriftParams {
  const rng = createRng(seed);
  const vp: [number, number] = [rngInt(rng, 8, 25), rngInt(rng, 8, 25)];
  const x12 = rngInt(rng, 30, 100);
  const x21 = rngInt(rng, 30, 100);
  const x: [number, number] = [
    x12 + rngInt(rng, 300, 700),
    x21 + rngInt(rng, 300, 700),
  ];
  // PK so wählen, dass realistische Salden entstehen (kann positiv oder negativ sein).
  const PK: [number, number] = [
    rngInt(rng, 4, 20) * 1000,
    rngInt(rng, 4, 20) * 1000,
  ];
  return { PK, vp, x, x12, x21 };
}
