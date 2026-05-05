import type { TarifwahlParams, TarifwahlSolution } from "./generate";

const round2 = (n: number): number => Math.round(n * 100) / 100;

function gesamtkosten(t: { fix: number; vk: number }, x: number): number {
  return t.fix + t.vk * x;
}

export function solveTarifwahl(p: TarifwahlParams): TarifwahlSolution {
  const results = p.mengen.map((x) => {
    const ka = gesamtkosten(p.tarife.A, x);
    const kb = gesamtkosten(p.tarife.B, x);
    const kc = gesamtkosten(p.tarife.C, x);
    const candidates: { tarif: "A" | "B" | "C"; k: number }[] = [
      { tarif: "A", k: ka },
      { tarif: "B", k: kb },
      { tarif: "C", k: kc },
    ];
    candidates.sort((a, b) => a.k - b.k);
    const best = candidates[0];
    return {
      tarif: best.tarif,
      gesamtkosten: round2(best.k),
      stueckkosten: round2(best.k / x),
    };
  });
  return { results };
}
