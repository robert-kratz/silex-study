import {
  KATEGORIEN,
  type Kategorie,
  type WertabgrenzungParams,
  getEffects,
} from "./generate";

export interface WertabgrenzungSolution {
  /** matrix[rowIndex][category] = expected amount (0 if not affected). */
  matrix: Record<Kategorie, number>[];
}

export function solveWertabgrenzung(p: WertabgrenzungParams): WertabgrenzungSolution {
  const matrix = p.vorfaelle.map((v) => {
    const row: Record<Kategorie, number> = {
      einzahlung: 0,
      auszahlung: 0,
      ertrag: 0,
      aufwand: 0,
      erloes: 0,
      kosten: 0,
    };
    const eff = getEffects(v.id);
    KATEGORIEN.forEach((k) => {
      const factor = eff[k] ?? 0;
      row[k] = factor === 0 ? 0 : v.amount * factor;
    });
    return row;
  });
  return { matrix };
}
