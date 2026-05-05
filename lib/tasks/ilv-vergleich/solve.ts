import { solve2x2 } from "@/lib/tasks/_shared/linalg";
import type { IlvVergleichParams } from "./generate";

export interface IlvVergleichSolution {
  /** Block-Verfahren */
  block: { k1: number; k2: number; E1: number; E2: number };
  /** Treppen-Verfahren in Reihenfolge V1 → V2 */
  treppe: { k1: number; k2: number; E1: number; E2: number };
  /** Gleichungs-Verfahren */
  gleichung: { k1: number; k2: number; E1: number; E2: number };
  /** Verfahrenscode für die exakte Lösung. */
  exakt: "gleichung";
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveIlvVergleich(p: IlvVergleichParams): IlvVergleichSolution {
  // Block: ignoriere V↔V, nur Endstellenmengen
  const kB1 = p.PK[0] / (p.v1End[0] + p.v1End[1]);
  const kB2 = p.PK[1] / (p.v2End[0] + p.v2End[1]);
  const block = {
    k1: r2(kB1),
    k2: r2(kB2),
    E1: r2(p.v1End[0] * kB1 + p.v2End[0] * kB2),
    E2: r2(p.v1End[1] * kB1 + p.v2End[1] * kB2),
  };

  // Treppe (V1 zuerst): kT1 = PK1 / (x12 + v1End)
  // V2 → V1 wird ignoriert.
  const kT1 = p.PK[0] / (p.x12 + p.v1End[0] + p.v1End[1]);
  const kT2 = (p.PK[1] + p.x12 * kT1) / (p.v2End[0] + p.v2End[1]);
  const treppe = {
    k1: r2(kT1),
    k2: r2(kT2),
    E1: r2(p.v1End[0] * kT1 + p.v2End[0] * kT2),
    E2: r2(p.v1End[1] * kT1 + p.v2End[1] * kT2),
  };

  // Gleichungsverfahren: x1·k1 - x21·k2 = PK1; -x12·k1 + x2·k2 = PK2
  const x1 = p.x12 + p.v1End[0] + p.v1End[1];
  const x2 = p.x21 + p.v2End[0] + p.v2End[1];
  const sol = solve2x2(
    [
      [x1, -p.x21],
      [-p.x12, x2],
    ],
    [p.PK[0], p.PK[1]],
  );
  if (!sol) throw new Error("Singular system");
  const [kG1, kG2] = sol;
  const gleichung = {
    k1: r2(kG1),
    k2: r2(kG2),
    E1: r2(p.v1End[0] * kG1 + p.v2End[0] * kG2),
    E2: r2(p.v1End[1] * kG1 + p.v2End[1] * kG2),
  };

  return { block, treppe, gleichung, exakt: "gleichung" };
}
