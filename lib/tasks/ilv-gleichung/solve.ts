import { solve2x2 } from "@/lib/tasks/_shared/linalg";
import type { IlvGleichungParams } from "./generate";

export interface IlvGleichungSolution {
  k1: number;
  k2: number;
  E1: number;
  E2: number;
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveIlvGleichung(p: IlvGleichungParams): IlvGleichungSolution {
  // x1·k1 - x21·k2 = PK1
  // -x12·k1 + x2·k2 = PK2
  const sol = solve2x2(
    [
      [p.x[0], -p.x21],
      [-p.x12, p.x[1]],
    ],
    [p.PK[0], p.PK[1]],
  );
  if (!sol) throw new Error("Singular system");
  const [k1, k2] = sol;
  const E1 = p.v1End[0] * k1 + p.v2End[0] * k2;
  const E2 = p.v1End[1] * k1 + p.v2End[1] * k2;
  return { k1: r2(k1), k2: r2(k2), E1: r2(E1), E2: r2(E2) };
}
