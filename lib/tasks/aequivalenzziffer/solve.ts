import type { AequivalenzzifferParams } from "./generate";

export interface AequivalenzzifferSolutionRow {
  /** Äquivalenzziffer ÄZ_i = (L_i·B_i) / (L_grund·B_grund). */
  AZ: number;
  /** Schlüsselzahl S_i = menge_i · ÄZ_i. */
  S: number;
  /** Stückkosten Sorte i = (K / Σ S) · ÄZ_i. */
  k: number;
}

export interface AequivalenzzifferSolution {
  rows: AequivalenzzifferSolutionRow[];
  sumS: number;
  /** Stückkosten-Bezugswert k_grund = K / Σ S. */
  kBezug: number;
}

const r4 = (n: number): number => Math.round(n * 10000) / 10000;
const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveAequivalenzziffer(
  p: AequivalenzzifferParams,
): AequivalenzzifferSolution {
  const grund = p.sorten[p.grundIdx];
  const grundProd = grund.L * grund.B;
  const azRaw = p.sorten.map((s) => (s.L * s.B) / grundProd);
  const sRaw = p.sorten.map((s, i) => s.menge * azRaw[i]);
  const sumS = sRaw.reduce((a, b) => a + b, 0);
  const kBezug = p.K / sumS;
  const rows = p.sorten.map((_, i) => ({
    AZ: r4(azRaw[i]),
    S: r2(sRaw[i]),
    k: r2(kBezug * azRaw[i]),
  }));
  return { rows, sumS: r2(sumS), kBezug: r2(kBezug) };
}
