import { createRng, rngFloat, rngInt } from "@/lib/random";

export interface ZuschlagProdukt {
  name: string;
  /** Materialeinzelkosten. */
  mek: number;
  /** Fertigungseinzelkosten je Fertigungsstufe (1..n). */
  fek: number[];
  /** Sondereinzelkosten der Fertigung. */
  sekFert: number;
  /** Sondereinzelkosten des Vertriebs. */
  sekVt: number;
}

export interface DiffZuschlagsParams {
  /** Materialgemeinkosten-Zuschlag (z. B. 0.20). */
  mgkSatz: number;
  /** Fertigungsgemeinkosten-Zuschläge je Fertigungsstufe. */
  fgkSatz: number[];
  /** Verwaltungsgemeinkosten-Zuschlag (auf HK). */
  vwgkSatz: number;
  /** Vertriebsgemeinkosten-Zuschlag (auf HK). */
  vtgkSatz: number;
  produkte: ZuschlagProdukt[];
}

export function generateDiffZuschlag(seed: number): DiffZuschlagsParams {
  const rng = createRng(seed);
  const numFert = rngInt(rng, 2, 2); // zwei Fertigungsstufen wie im Skript
  const mgkSatz = rngFloat(rng, 0.1, 0.35, 2);
  const fgkSatz = Array.from({ length: numFert }, (_, i) =>
    i === 0 ? rngFloat(rng, 1.0, 2.0, 2) : rngFloat(rng, 1.2, 1.8, 2),
  );
  const vwgkSatz = rngFloat(rng, 0.1, 0.25, 2);
  const vtgkSatz = rngFloat(rng, 0.05, 0.15, 2);

  const produkte: ZuschlagProdukt[] = [];
  const productCount = rngInt(rng, 2, 3);
  const namen = ["Produkt A", "Produkt B", "Produkt C"];
  for (let i = 0; i < productCount; i++) {
    produkte.push({
      name: namen[i],
      mek: rngInt(rng, 200, 1200) * 10, // glatte 10er
      fek: Array.from({ length: numFert }, () => rngInt(rng, 80, 600) * 10),
      sekFert: rngInt(rng, 0, 5) * 100,
      sekVt: rngInt(rng, 0, 4) * 100,
    });
  }
  return { mgkSatz, fgkSatz, vwgkSatz, vtgkSatz, produkte };
}
