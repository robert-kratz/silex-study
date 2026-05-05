import { createRng, rngInt } from "@/lib/random";
import {
  KATEGORIEN,
  KATEGORIE_LABEL,
  type Kategorie,
} from "@/lib/tasks/wertabgrenzung/generate";

export { KATEGORIEN, KATEGORIE_LABEL };
export type { Kategorie };

interface DetailVorfallTemplate {
  id: string;
  /** Renders the prompt; receives the chosen base amount. */
  text: (a: number) => string;
  amountRange: [number, number];
  /**
   * Per-category effect:
   *  - number: factor applied to base amount
   *  - { factor: number; addend?: number }: factor·a + addend
   */
  effects: Partial<Record<Kategorie, number | { factor: number; addend: number }>>;
}

export const DETAIL_VORFAELLE: readonly DetailVorfallTemplate[] = [
  {
    id: "afa-bilanz-kalk",
    text: (a) =>
      `Maschinenabschreibung: bilanziell ${a} €, kalkulatorisch ${a + 200} €.`,
    amountRange: [800, 4000],
    effects: { aufwand: 1, kosten: { factor: 1, addend: 200 } },
  },
  {
    id: "kalk-zinsen",
    text: (a) =>
      `Kalkulatorische Zinsen auf das betriebsnotwendige Kapital: ${a} €. Tatsächliche Fremdkapitalzinsen: ${Math.round(a * 0.4)} €.`,
    amountRange: [500, 3000],
    effects: { aufwand: 0.4, kosten: 1 },
  },
  {
    id: "kalk-unternehmerlohn",
    text: (a) => `Kalkulatorischer Unternehmerlohn ${a} €.`,
    amountRange: [2000, 6000],
    effects: { kosten: 1 },
  },
  {
    id: "rohstoffverbrauch",
    text: (a) => `Rohstoffverbrauch zu Anschaffungskosten ${a} €.`,
    amountRange: [500, 5000],
    effects: { aufwand: 1, kosten: 1 },
  },
  {
    id: "loehne",
    text: (a) => `Auszahlung Fertigungslöhne ${a} €.`,
    amountRange: [1000, 8000],
    effects: { auszahlung: 1, aufwand: 1, kosten: 1 },
  },
  {
    id: "verkauf",
    text: (a) => `Barverkauf eines Produktes für ${a} €.`,
    amountRange: [500, 8000],
    effects: { einzahlung: 1, ertrag: 1, erloes: 1 },
  },
  {
    id: "spende",
    text: (a) => `Geldspende ${a} €.`,
    amountRange: [200, 1500],
    effects: { auszahlung: 1, aufwand: 1 },
  },
  {
    id: "ek-kredit",
    text: (a) => `Aufnahme eines Bankkredits ${a} €.`,
    amountRange: [5000, 30000],
    effects: { einzahlung: 1 },
  },
  {
    id: "wertpapier-gewinn",
    text: (a) =>
      `Verkauf nicht betriebsnotwendiger Wertpapiere zum Buchwert ${a} €, Gewinn ${Math.round(a * 0.1)} €.`,
    amountRange: [1000, 5000],
    effects: { einzahlung: { factor: 1.1, addend: 0 }, ertrag: 0.1 },
  },
  {
    id: "rohstoff-ziel",
    text: (a) => `Kauf Rohstoffe auf Ziel, eingelagert ${a} €.`,
    amountRange: [500, 4000],
    effects: {},
  },
];

export interface WertabgrenzungDetailParams {
  vorfaelle: { id: string; text: string; amount: number }[];
}

export function generateWertabgrenzungDetail(seed: number): WertabgrenzungDetailParams {
  const rng = createRng(seed);
  const idx = Array.from({ length: DETAIL_VORFAELLE.length }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = rngInt(rng, 0, i);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const picked = idx.slice(0, 8).map((i) => DETAIL_VORFAELLE[i]);
  return {
    vorfaelle: picked.map((tpl) => {
      const raw = rngInt(rng, tpl.amountRange[0], tpl.amountRange[1]);
      const amount = Math.round(raw / 50) * 50;
      return { id: tpl.id, text: tpl.text(amount), amount };
    }),
  };
}

export function getDetailEffects(
  id: string,
): Partial<Record<Kategorie, number | { factor: number; addend: number }>> {
  const t = DETAIL_VORFAELLE.find((v) => v.id === id);
  if (!t) throw new Error(`Detail-Vorfall nicht gefunden: ${id}`);
  return t.effects;
}
