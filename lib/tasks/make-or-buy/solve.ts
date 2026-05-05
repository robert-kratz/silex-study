import type { MakeOrBuyParams, MakeOrBuySolution } from "./generate";

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveMakeOrBuy(p: MakeOrBuyParams): MakeOrBuySolution {
  const Keigen = p.kVarEigen * p.menge + p.KfixAbbaubar;
  const Kfremd = p.pExtern * p.menge;
  const entscheidung: "eigen" | "fremd" = Keigen <= Kfremd ? "eigen" : "fremd";
  const vorteil = Math.abs(Keigen - Kfremd);
  return { Keigen: r2(Keigen), Kfremd: r2(Kfremd), entscheidung, vorteil: r2(vorteil) };
}
