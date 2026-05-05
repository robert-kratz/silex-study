import type { DiffZuschlagsParams } from "./generate";

export interface ProduktSolution {
  name: string;
  mgk: number;
  materialkosten: number;
  fgk: number[];
  fertigungskosten: number;
  herstellkosten: number;
  vwgk: number;
  vtgk: number;
  selbstkosten: number;
}

export interface DiffZuschlagsSolution {
  produkte: ProduktSolution[];
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveDiffZuschlag(p: DiffZuschlagsParams): DiffZuschlagsSolution {
  const produkte: ProduktSolution[] = p.produkte.map((prod) => {
    const mgk = prod.mek * p.mgkSatz;
    const materialkosten = prod.mek + mgk;
    const fgk = prod.fek.map((fek, i) => fek * p.fgkSatz[i]);
    const fertigungskosten =
      prod.fek.reduce((s, v) => s + v, 0) +
      fgk.reduce((s, v) => s + v, 0) +
      prod.sekFert;
    const herstellkosten = materialkosten + fertigungskosten;
    const vwgk = herstellkosten * p.vwgkSatz;
    const vtgk = herstellkosten * p.vtgkSatz;
    const selbstkosten = herstellkosten + vwgk + vtgk + prod.sekVt;
    return {
      name: prod.name,
      mgk: r2(mgk),
      materialkosten: r2(materialkosten),
      fgk: fgk.map(r2),
      fertigungskosten: r2(fertigungskosten),
      herstellkosten: r2(herstellkosten),
      vwgk: r2(vwgk),
      vtgk: r2(vtgk),
      selbstkosten: r2(selbstkosten),
    };
  });
  return { produkte };
}
