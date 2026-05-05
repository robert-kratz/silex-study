import { createRng, rngInt } from "@/lib/random";

export type Kategorie =
  | "einzahlung"
  | "auszahlung"
  | "ertrag"
  | "aufwand"
  | "erloes"
  | "kosten";

export const KATEGORIEN: readonly Kategorie[] = [
  "einzahlung",
  "auszahlung",
  "ertrag",
  "aufwand",
  "erloes",
  "kosten",
];

export const KATEGORIE_LABEL: Record<Kategorie, string> = {
  einzahlung: "Einzahlung",
  auszahlung: "Auszahlung",
  ertrag: "Ertrag",
  aufwand: "Aufwand",
  erloes: "Erlös",
  kosten: "Kosten",
};

interface VorfallTemplate {
  id: string;
  text: (a: number) => string;
  amountRange: [number, number];
  /** Per-category multiplier of the amount (1 = full amount, 0 = none). */
  effects: Partial<Record<Kategorie, number>>;
}

export const VORFAELLE: readonly VorfallTemplate[] = [
  {
    id: "rohstoff-bar",
    text: (a) => `Barkauf von Rohstoffen für ${a} €, sofortiger Verbrauch.`,
    amountRange: [200, 5000],
    effects: { auszahlung: 1, aufwand: 1, kosten: 1 },
  },
  {
    id: "rohstoff-ziel",
    text: (a) => `Kauf von Rohstoffen auf Ziel für ${a} €, lagernd.`,
    amountRange: [200, 5000],
    effects: {},
  },
  {
    id: "rohstoff-verbrauch",
    text: (a) => `Verbrauch eingelagerter Rohstoffe im Wert von ${a} €.`,
    amountRange: [200, 5000],
    effects: { aufwand: 1, kosten: 1 },
  },
  {
    id: "verkauf-bar",
    text: (a) => `Barverkauf eines Produktes für ${a} €.`,
    amountRange: [500, 10000],
    effects: { einzahlung: 1, ertrag: 1, erloes: 1 },
  },
  {
    id: "verkauf-ziel",
    text: (a) => `Verkauf auf Ziel über ${a} €.`,
    amountRange: [500, 10000],
    effects: { ertrag: 1, erloes: 1 },
  },
  {
    id: "spende",
    text: (a) => `Geldspende an einen Verein in Höhe von ${a} €.`,
    amountRange: [100, 1000],
    effects: { auszahlung: 1, aufwand: 1 },
  },
  {
    id: "kalk-miete",
    text: (a) => `Verrechnung kalkulatorischer Miete in Höhe von ${a} €.`,
    amountRange: [200, 2000],
    effects: { kosten: 1 },
  },
  {
    id: "loehne",
    text: (a) => `Auszahlung von Löhnen ${a} € (Fertigungspersonal).`,
    amountRange: [1000, 8000],
    effects: { auszahlung: 1, aufwand: 1, kosten: 1 },
  },
  {
    id: "miete-zahlung",
    text: (a) => `Überweisung der Geschäftsraummiete ${a} €.`,
    amountRange: [500, 3000],
    effects: { auszahlung: 1, aufwand: 1, kosten: 1 },
  },
  {
    id: "kalk-unternehmerlohn",
    text: (a) => `Verrechnung kalkulatorischer Unternehmerlohn ${a} €.`,
    amountRange: [2000, 6000],
    effects: { kosten: 1 },
  },
  {
    id: "verkauf-altanlage",
    text: (a) => `Barverkauf einer alten Maschine zum Buchwert ${a} €.`,
    amountRange: [500, 5000],
    effects: { einzahlung: 1, ertrag: 1 },
  },
  {
    id: "kreditaufnahme",
    text: (a) => `Aufnahme eines Bankkredits über ${a} €.`,
    amountRange: [5000, 30000],
    effects: { einzahlung: 1 },
  },
];

export interface WertabgrenzungParams {
  vorfaelle: { id: string; text: string; amount: number }[];
}

export function generateWertabgrenzung(seed: number): WertabgrenzungParams {
  const rng = createRng(seed);
  // Pick 6 distinct vorfaelle
  const indices = Array.from({ length: VORFAELLE.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = rngInt(rng, 0, i);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const picked = indices.slice(0, 6).map((i) => VORFAELLE[i]);

  return {
    vorfaelle: picked.map((tpl) => {
      // round amounts to 50
      const raw = rngInt(rng, tpl.amountRange[0], tpl.amountRange[1]);
      const amount = Math.round(raw / 50) * 50;
      return { id: tpl.id, text: tpl.text(amount), amount };
    }),
  };
}

/** Return effects for a given vorfall id. */
export function getEffects(id: string): Partial<Record<Kategorie, number>> {
  const t = VORFAELLE.find((v) => v.id === id);
  if (!t) throw new Error(`Vorfall nicht gefunden: ${id}`);
  return t.effects;
}
