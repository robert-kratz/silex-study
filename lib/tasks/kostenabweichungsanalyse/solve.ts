import type { KostenabwParams } from "./generate";

export interface KostenabwSolution {
  /** Verrechnete Gemeinkosten = Ist-Bezugsgröße · Plan-Zuschlagssatz. */
  verrechneteGk: number;
  /** Vorzeichenbehaftete Differenz: verrechnet − ist. */
  signedDiff: number;
  /** Betrag der Abweichung. */
  diff: number;
  /** Art der Abweichung. */
  art: "ueberdeckung" | "unterdeckung";
  /** Korrekte Vorgehensweise beim Writeoff Approach. */
  writeoff: "umsatzkosten";
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveKostenabweichung(p: KostenabwParams): KostenabwSolution {
  const verrechneteGk = p.istEinzelkosten * p.planSatz;
  const signedDiff = verrechneteGk - p.istGemeinkosten;
  return {
    verrechneteGk: r2(verrechneteGk),
    signedDiff: r2(signedDiff),
    diff: r2(Math.abs(signedDiff)),
    art: signedDiff >= 0 ? "ueberdeckung" : "unterdeckung",
    writeoff: "umsatzkosten",
  };
}
