import type { VollTeilkostenParams } from "./generate";

export interface VollTeilkostenSolution {
  gewinnVoll: number;
  gewinnTeil: number;
  deltaG: number;
  ursache: "fixkosten-aktivierung";
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveVollTeilkosten(p: VollTeilkostenParams): VollTeilkostenSolution {
  let erloese = 0;
  let HKAbsatzVoll = 0;
  let varHKAbsatz = 0;
  let varVtAbsatz = 0;
  let fixGesamt = 0;
  let deltaGSum = 0;
  for (const x of p.produkte) {
    const HKjeStk = (x.kVarHK * x.produktion + x.KFixHK) / x.produktion;
    const dB = x.produktion - x.absatz;
    erloese += x.preis * x.absatz;
    HKAbsatzVoll += HKjeStk * x.absatz;
    varHKAbsatz += x.kVarHK * x.absatz;
    varVtAbsatz += x.kVarVt * x.absatz;
    fixGesamt += x.KFixHK + x.KFixVt;
    const kFixHKjeStk = x.KFixHK / x.produktion;
    deltaGSum += dB * kFixHKjeStk;
  }
  const vertriebTotal = varVtAbsatz + p.produkte.reduce((a, x) => a + x.KFixVt, 0);
  const gewinnVoll = erloese - HKAbsatzVoll - vertriebTotal;
  const gewinnTeil = erloese - varHKAbsatz - varVtAbsatz - fixGesamt;
  return {
    gewinnVoll: r2(gewinnVoll),
    gewinnTeil: r2(gewinnTeil),
    deltaG: r2(deltaGSum),
    ursache: "fixkosten-aktivierung",
  };
}
