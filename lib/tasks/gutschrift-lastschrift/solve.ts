import type { GutschriftLastschriftParams } from "./generate";

export interface GutschriftLastschriftSolution {
  /** Gutschrift V1, V2 (Plan-VP × Eigenleistung). */
  G: [number, number];
  /** Lastschrift V1, V2 (PK + Bezug von anderer V-Stelle zum Plan-VP). */
  L: [number, number];
  /** Saldo V1, V2 = L − G (positiv = Unterdeckung). */
  S: [number, number];
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveGutschriftLastschrift(
  p: GutschriftLastschriftParams,
): GutschriftLastschriftSolution {
  const G1 = p.vp[0] * p.x[0];
  const G2 = p.vp[1] * p.x[1];
  const L1 = p.PK[0] + p.x21 * p.vp[1];
  const L2 = p.PK[1] + p.x12 * p.vp[0];
  return {
    G: [r2(G1), r2(G2)],
    L: [r2(L1), r2(L2)],
    S: [r2(L1 - G1), r2(L2 - G2)],
  };
}
