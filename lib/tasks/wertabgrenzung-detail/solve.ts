import {
  KATEGORIEN,
  type Kategorie,
  type WertabgrenzungDetailParams,
  getDetailEffects,
} from "./generate";

export interface WertabgrenzungDetailSolution {
  matrix: Record<Kategorie, number>[];
}

export function solveWertabgrenzungDetail(
  p: WertabgrenzungDetailParams,
): WertabgrenzungDetailSolution {
  const matrix = p.vorfaelle.map((v) => {
    const row: Record<Kategorie, number> = {
      einzahlung: 0,
      auszahlung: 0,
      ertrag: 0,
      aufwand: 0,
      erloes: 0,
      kosten: 0,
    };
    const eff = getDetailEffects(v.id);
    KATEGORIEN.forEach((k) => {
      const f = eff[k];
      if (f === undefined) {
        row[k] = 0;
      } else if (typeof f === "number") {
        row[k] = Math.round(v.amount * f * 100) / 100;
      } else {
        row[k] = Math.round((f.factor * v.amount + f.addend) * 100) / 100;
      }
    });
    return row;
  });
  return { matrix };
}
