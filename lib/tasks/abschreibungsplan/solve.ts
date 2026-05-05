import {
  ABSCHREIBUNGS_METHODEN,
  type AbschreibungsMethode,
  type AbschreibungsplanParams,
} from "./generate";

const r2 = (n: number): number => Math.round(n * 100) / 100;

export interface AbschreibungsplanSolution {
  /** AfA pro Methode pro Jahr [t=1..T]. */
  afa: Record<AbschreibungsMethode, number[]>;
}

export function solveAbschreibungsplan(
  p: AbschreibungsplanParams,
): AbschreibungsplanSolution {
  const linear: number[] = Array.from({ length: p.T }, () =>
    r2((p.AW - p.RW) / p.T),
  );

  // Geometrisch-degressiv: AfA_t = q · BW_{t-1}
  const geometrisch: number[] = [];
  let bw = p.AW;
  for (let t = 0; t < p.T; t++) {
    const afa = bw * p.q;
    geometrisch.push(r2(afa));
    bw = bw - afa;
  }

  // Arithmetisch-degressiv: digital
  const sumOneToT = (p.T * (p.T + 1)) / 2;
  const d = (p.AW - p.RW) / sumOneToT;
  const arithmetisch: number[] = [];
  for (let t = 1; t <= p.T; t++) {
    arithmetisch.push(r2((p.T - t + 1) * d));
  }

  // Leistungsabhängig
  const total = p.leistung.reduce((a, b) => a + b, 0);
  const leistung: number[] = p.leistung.map((l) => r2(((p.AW - p.RW) / total) * l));

  const afa: Record<AbschreibungsMethode, number[]> = {
    linear,
    geometrisch,
    arithmetisch,
    leistung,
  };
  void ABSCHREIBUNGS_METHODEN;
  return { afa };
}
