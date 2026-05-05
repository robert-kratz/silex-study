import { createRng, rngInt, rngPick } from "@/lib/random";

export interface AequivalenzzifferSorte {
  /** Sorten-Bezeichnung (A, B, C). */
  name: string;
  /** Länge in cm. */
  L: number;
  /** Breite in cm. */
  B: number;
  /** Stückzahl in der Periode. */
  menge: number;
}

export interface AequivalenzzifferParams {
  sorten: AequivalenzzifferSorte[];
  /** Index der Grundsorte (immer 0). */
  grundIdx: number;
  /** Gesamte Periodenkosten (€). */
  K: number;
}

export function generateAequivalenzziffer(seed: number): AequivalenzzifferParams {
  const rng = createRng(seed);
  // Grundsorte A: L=10, B=10 ⇒ ÄZ_A = 1
  const ratios = [0.5, 0.8, 1.2, 1.5, 2.0] as const;
  const a = rngPick(rng, ratios);
  const b = rngPick(rng, ratios);
  const c = rngPick(rng, ratios);
  const d = rngPick(rng, ratios);
  const sorten: AequivalenzzifferSorte[] = [
    { name: "A", L: 10, B: 10, menge: rngInt(rng, 200, 800) },
    { name: "B", L: 10 * a, B: 10 * b, menge: rngInt(rng, 200, 800) },
    { name: "C", L: 10 * c, B: 10 * d, menge: rngInt(rng, 200, 800) },
  ];
  return {
    sorten,
    grundIdx: 0,
    K: rngInt(rng, 30, 250) * 1000,
  };
}
