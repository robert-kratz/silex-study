import type { IlvBlockParams } from "./generate";

export interface IlvBlockSolution {
  k1: number;
  k2: number;
  /** Belastung E1 und E2. */
  E1: number;
  E2: number;
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveIlvBlock(p: IlvBlockParams): IlvBlockSolution {
  // Block: ignoriere V↔V; verteile PK_j auf nur Endstellen-Mengen
  const k1 = p.PK[0] / (p.v1.e1 + p.v1.e2);
  const k2 = p.PK[1] / (p.v2.e1 + p.v2.e2);
  const E1 = p.v1.e1 * k1 + p.v2.e1 * k2;
  const E2 = p.v1.e2 * k1 + p.v2.e2 * k2;
  return { k1: r2(k1), k2: r2(k2), E1: r2(E1), E2: r2(E2) };
}
