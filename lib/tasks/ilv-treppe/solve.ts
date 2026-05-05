import type { IlvTreppeParams } from "./generate";

export interface IlvTreppeSolution {
  kA: number;
  kB: number;
  kC: number;
  E1: number;
  E2: number;
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveIlvTreppe(p: IlvTreppeParams): IlvTreppeSolution {
  const totalA = p.A.b + p.A.c + p.A.e1 + p.A.e2;
  const kA = p.PK.A / totalA;
  const totalB = p.B.c + p.B.e1 + p.B.e2;
  const kB = (p.PK.B + p.A.b * kA) / totalB;
  const totalC = p.C.e1 + p.C.e2;
  const kC = (p.PK.C + p.A.c * kA + p.B.c * kB) / totalC;
  const E1 = p.A.e1 * kA + p.B.e1 * kB + p.C.e1 * kC;
  const E2 = p.A.e2 * kA + p.B.e2 * kB + p.C.e2 * kC;
  return { kA: r2(kA), kB: r2(kB), kC: r2(kC), E1: r2(E1), E2: r2(E2) };
}
