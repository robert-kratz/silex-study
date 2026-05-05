import { createRng, rngInt } from "@/lib/random";

export interface BabPrimaerParams {
  /** Kostenarten (z. B. Hilfsstoffe, Hilfslöhne, ...). */
  kostenarten: { name: string; betrag: number }[];
  /** Kostenstellen-Namen. */
  stellen: string[];
  /** schluessel[ka][stelle] (Schlüsselzahlen, jeweils ≥ 0). */
  schluessel: number[][];
}

const KOSTENART_NAMES = [
  "Hilfsstoffe",
  "Hilfslöhne",
  "Kalk. AfA",
  "Kalk. Zinsen",
  "Energie",
  "Versicherung",
];
const STELLEN_NAMES = ["Material", "Fertigung", "Verwaltung", "Vertrieb"];

export function generateBabPrimaer(seed: number): BabPrimaerParams {
  const rng = createRng(seed);
  const numKa = rngInt(rng, 3, 4);
  const kostenarten = KOSTENART_NAMES.slice(0, numKa).map((name) => ({
    name,
    betrag: rngInt(rng, 4, 40) * 1000,
  }));
  const schluessel: number[][] = kostenarten.map(() =>
    STELLEN_NAMES.map(() => rngInt(rng, 1, 10)),
  );
  return { kostenarten, stellen: [...STELLEN_NAMES], schluessel };
}
