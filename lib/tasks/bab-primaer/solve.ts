import type { BabPrimaerParams } from "./generate";

export interface BabPrimaerSolution {
  /** matrix[ka][stelle]. */
  matrix: number[][];
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveBabPrimaer(p: BabPrimaerParams): BabPrimaerSolution {
  const matrix = p.kostenarten.map((ka, i) => {
    const sum = p.schluessel[i].reduce((a, b) => a + b, 0);
    const u = ka.betrag / sum;
    return p.schluessel[i].map((s) => r2(u * s));
  });
  return { matrix };
}
