import { createRng, rngInt } from "@/lib/random";

export type BilanzKategorie =
  | "av-bn"
  | "uv-bn"
  | "av-nicht-bn"
  | "uv-nicht-bn"
  | "abzugskapital";

interface PostenTemplate {
  name: string;
  kategorie: BilanzKategorie;
  range: [number, number];
}

const POSTEN: readonly PostenTemplate[] = [
  { name: "Maschinen", kategorie: "av-bn", range: [80, 300] },
  { name: "BGA", kategorie: "av-bn", range: [20, 100] },
  { name: "Vorräte", kategorie: "uv-bn", range: [30, 120] },
  { name: "Forderungen aus L&L", kategorie: "uv-bn", range: [20, 80] },
  { name: "Bank (betriebsnotw.)", kategorie: "uv-bn", range: [10, 50] },
  { name: "Spekulative Wertpapiere", kategorie: "av-nicht-bn", range: [10, 60] },
  { name: "Vermietetes Wohngebäude", kategorie: "av-nicht-bn", range: [40, 150] },
  { name: "Privatentnahme-Konto", kategorie: "uv-nicht-bn", range: [5, 30] },
  { name: "Verbindl. aus L&L (zinsfrei)", kategorie: "abzugskapital", range: [20, 80] },
  { name: "Kundenanzahlungen", kategorie: "abzugskapital", range: [10, 40] },
];

export interface KalkZinsenParams {
  /** Posten in TEUR. */
  posten: { name: string; kategorie: BilanzKategorie; betrag: number }[];
  /** WACC als Dezimalzahl, z. B. 0.06. */
  wacc: number;
}

export function generateKalkZinsen(seed: number): KalkZinsenParams {
  const rng = createRng(seed);
  const idx = Array.from({ length: POSTEN.length }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = rngInt(rng, 0, i);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  // Ensure at least one of each kategorie except optionally uv-nicht-bn
  const required: BilanzKategorie[] = [
    "av-bn",
    "uv-bn",
    "av-nicht-bn",
    "abzugskapital",
  ];
  const chosen: PostenTemplate[] = [];
  for (const cat of required) {
    const found = idx
      .map((i) => POSTEN[i])
      .find((t) => t.kategorie === cat && !chosen.includes(t));
    if (found) chosen.push(found);
  }
  // Fill up to 7 unique posten
  for (const i of idx) {
    if (chosen.length >= 7) break;
    if (!chosen.includes(POSTEN[i])) chosen.push(POSTEN[i]);
  }

  const posten = chosen.map((t) => ({
    name: t.name,
    kategorie: t.kategorie,
    betrag: rngInt(rng, t.range[0], t.range[1]) * 1000, // in €
  }));

  const wacc = rngInt(rng, 30, 80) / 1000; // 0.030..0.080
  return { posten, wacc };
}
