import type { DivisionskalkulationParams } from "./generate";

export interface DivisionskalkulationSolution {
  /** Stückkosten Stufe 1 = PK1 / M1 */
  k1: number;
  /** Eingangsmenge Stufe 2 = M1 − dL1 */
  M2in: number;
  /** Stückkosten Stufe 2 (kumuliert) */
  k2: number;
  /** Absatzmenge = M2in − dL2 */
  absatz: number;
  /** Selbstkosten je Einheit (inkl. Vertrieb) */
  kVertrieb: number;
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveDivisionskalkulation(
  p: DivisionskalkulationParams,
): DivisionskalkulationSolution {
  const k1 = p.PK1 / p.M1;
  const M2in = p.M1 - p.dL1;
  // Ausgangsmenge Stufe 2 = eingangsmenge (kein interner ausschuss)
  const k2 = (p.PK2 + k1 * M2in) / M2in;
  const absatz = M2in - p.dL2;
  const kVertrieb = k2 + p.PKv / absatz;
  return {
    k1: r2(k1),
    M2in: r2(M2in),
    k2: r2(k2),
    absatz: r2(absatz),
    kVertrieb: r2(kVertrieb),
  };
}
