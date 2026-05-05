import { createRng, rngFloat, rngInt } from "@/lib/random";

export interface KostenabwParams {
  /** Plan-Gemeinkosten-Zuschlagssatz (z. B. 1.5 = 150%). */
  planSatz: number;
  /** Tatsächliche Einzelkosten der Periode (Bezugsgröße). */
  istEinzelkosten: number;
  /** Tatsächlich angefallene Gemeinkosten der Periode. */
  istGemeinkosten: number;
}

export function generateKostenabweichung(seed: number): KostenabwParams {
  const rng = createRng(seed);
  const planSatz = rngFloat(rng, 0.8, 2.0, 2);
  const istEinzelkosten = rngInt(rng, 50, 200) * 1000; // glatte 1.000er
  const verrechnet = istEinzelkosten * planSatz;
  // Erzeuge eine spürbare Abweichung (ca. ±5–25 %), zufällig nach oben oder unten.
  const richtung = rng() < 0.5 ? -1 : 1;
  const abwPct = rngFloat(rng, 0.05, 0.25, 2);
  let istGemeinkosten = verrechnet * (1 + richtung * abwPct);
  // Auf glatte 1.000er runden, damit die Differenz hübsch ist.
  istGemeinkosten = Math.round(istGemeinkosten / 1000) * 1000;
  return { planSatz, istEinzelkosten, istGemeinkosten };
}
