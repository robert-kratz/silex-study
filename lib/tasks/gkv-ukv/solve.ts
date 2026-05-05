import type { GkvUkvParams } from "./generate";

export interface GkvUkvProduktSolution {
  HKjeStk: number;
  bestandsAenderung: number;
  /** Wert der Bestandsänderung zu HK (vorzeichenbehaftet). */
  bestandsWert: number;
  HKAbsatz: number;
}

export interface GkvUkvSolution {
  rows: GkvUkvProduktSolution[];
  erloeseSumme: number;
  /** Σ HK gesamt + Vertriebskosten gesamt. */
  gesamtkostenSumme: number;
  vertriebTotal: number;
  /** Periodenerfolg (gilt für GKV und UKV). */
  gewinn: number;
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveGkvUkv(p: GkvUkvParams): GkvUkvSolution {
  const rows: GkvUkvProduktSolution[] = [];
  let erloese = 0;
  let HKgesamt = 0;
  let vertrieb = 0;
  let HKAbsatzSum = 0;
  for (const x of p.produkte) {
    const HKtotal = x.kVarHK * x.produktion + x.KFixHK;
    const HKjeStk = HKtotal / x.produktion;
    const dB = x.produktion - x.absatz;
    const bw = dB * HKjeStk;
    const HKAbs = HKjeStk * x.absatz;
    erloese += x.preis * x.absatz;
    HKgesamt += HKtotal;
    vertrieb += x.kVarVt * x.absatz + x.KFixVt;
    HKAbsatzSum += HKAbs;
    rows.push({
      HKjeStk: r2(HKjeStk),
      bestandsAenderung: dB,
      bestandsWert: r2(bw),
      HKAbsatz: r2(HKAbs),
    });
  }
  const gewinn = erloese - HKAbsatzSum - vertrieb;
  return {
    rows,
    erloeseSumme: r2(erloese),
    gesamtkostenSumme: r2(HKgesamt + vertrieb),
    vertriebTotal: r2(vertrieb),
    gewinn: r2(gewinn),
  };
}
