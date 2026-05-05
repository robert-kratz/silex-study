import { solveLinear } from "@/lib/tasks/_shared/linalg";
import type { IlvAufstellenParams } from "./generate";

export interface IlvAufstellenSolution {
  /** Korrekt ausgewählte Bausteine pro Gleichung (Set von Block-IDs). */
  correctBlocks: [Set<string>, Set<string>, Set<string>];
  k: [number, number, number];
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveIlvAufstellen(p: IlvAufstellenParams): IlvAufstellenSolution {
  // Equation für V_j: total[j]·k_j = PK_j + Σ_{i≠j} cross[i][j]·k_i
  // → total[j]·k_j − Σ_{i≠j} cross[i][j]·k_i = PK_j
  const A: number[][] = [];
  const b: number[] = [];
  for (let j = 0; j < 3; j++) {
    const row = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      if (i === j) row[i] = p.total[j];
      else row[i] = -p.cross[i][j];
    }
    A.push(row);
    b.push(p.PK[j]);
  }
  const sol = solveLinear(A, b);
  if (!sol) throw new Error("Singular system in ilv-aufstellen");

  // Korrekte Bausteine pro Gleichung: { "PK<j+1>" } ∪ { `${i+1}${j+1}` für i ≠ j }
  const correctBlocks: [Set<string>, Set<string>, Set<string>] = [
    new Set<string>(),
    new Set<string>(),
    new Set<string>(),
  ];
  for (let j = 0; j < 3; j++) {
    correctBlocks[j].add(`PK${j + 1}`);
    for (let i = 0; i < 3; i++) {
      if (i !== j) correctBlocks[j].add(`${i + 1}${j + 1}`);
    }
  }
  return {
    correctBlocks,
    k: [r2(sol[0]), r2(sol[1]), r2(sol[2])],
  };
}
