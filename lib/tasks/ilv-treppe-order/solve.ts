import type { IlvTreppeOrderParams } from "./generate";

export interface IlvTreppeOrderSolution {
  /** Optimale Reihenfolge der Stationsindizes (0..3). */
  order: number[];
  /** Zeilensummen (Abgaben an andere Vorstellen) pro Index. */
  rowSums: number[];
}

export function solveIlvTreppeOrder(p: IlvTreppeOrderParams): IlvTreppeOrderSolution {
  const rowSums = p.matrix.map((row) => row.reduce((a, b) => a + b, 0));
  const order = rowSums
    .map((s, i) => ({ s, i }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.i);
  return { order, rowSums };
}
