import { createRng, rngInt } from "@/lib/random";

export const ABSCHREIBUNGS_METHODEN = [
  "linear",
  "geometrisch",
  "arithmetisch",
  "leistung",
] as const;
export type AbschreibungsMethode = (typeof ABSCHREIBUNGS_METHODEN)[number];

export const METHODE_LABEL: Record<AbschreibungsMethode, string> = {
  linear: "Linear",
  geometrisch: "Geometrisch-degressiv",
  arithmetisch: "Arithmetisch-degressiv (digital)",
  leistung: "Leistungsabhängig",
};

export interface AbschreibungsplanParams {
  AW: number;
  RW: number;
  T: number;
  /** Geometrisch-degressiver Satz, sodass es exakt aufgeht (z. B. 0.5). */
  q: number;
  /** Leistung pro Jahr (Summe = Gesamtleistung). */
  leistung: number[];
}

export function generateAbschreibungsplan(seed: number): AbschreibungsplanParams {
  const rng = createRng(seed);
  const T = (3 + rngInt(rng, 0, 2)) as 3 | 4 | 5;
  // Pick q ∈ {0.5} so that AW = RW · 2^T
  const q = 0.5;
  const RW = rngInt(rng, 1, 5) * 1000; // 1000..5000
  const AW = RW * Math.pow(2, T);
  // Leistung total in nice round number
  const total = rngInt(rng, 50, 200) * 100; // 5000..20000
  const leistung: number[] = [];
  let remaining = total;
  for (let i = 0; i < T - 1; i++) {
    const remainingYears = T - i;
    const avg = remaining / remainingYears;
    const min = Math.max(1, Math.round(avg * 0.6));
    const max = Math.round(avg * 1.4);
    const v = Math.round(rngInt(rng, min, max) / 10) * 10;
    leistung.push(v);
    remaining -= v;
  }
  leistung.push(remaining);
  return { AW, RW, T, q, leistung };
}
