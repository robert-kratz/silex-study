import type { DbStufenParams } from "./generate";

export interface DbStufenSolution {
  /** DB I und DB II je Produkt-id. */
  produkt: Record<string, { dbI: number; dbII: number }>;
  /** DB III je Produktgruppen-id. */
  gruppe: Record<string, number>;
  /** DB IV je Sparten-id. */
  sparte: Record<string, number>;
  betriebserfolg: number;
  eliminieren: string;
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveDbStufen(p: DbStufenParams): DbStufenSolution {
  const produkt: Record<string, { dbI: number; dbII: number }> = {};
  const gruppe: Record<string, number> = {};
  const sparte: Record<string, number> = {};
  let be = 0;
  for (const s of p.sparten) {
    let sparteSum = 0;
    for (const g of s.gruppen) {
      let gruppeSum = 0;
      for (const pr of g.produkte) {
        const dbI = (pr.preis - pr.kVar) * pr.menge;
        const dbII = dbI - pr.produktFix;
        produkt[pr.id] = { dbI: r2(dbI), dbII: r2(dbII) };
        gruppeSum += dbII;
      }
      const dbIII = gruppeSum - g.pgFix;
      gruppe[g.id] = r2(dbIII);
      sparteSum += dbIII;
    }
    const dbIV = sparteSum - s.sparteFix;
    sparte[s.id] = r2(dbIV);
    be += dbIV;
  }
  return {
    produkt,
    gruppe,
    sparte,
    betriebserfolg: r2(be - p.unternehmenFix),
    eliminieren: p.eliminieren,
  };
}
