import { createRng, rngInt } from "@/lib/random";

export type MaterialBuchung =
  | { type: "AB"; menge: number; preis: number }
  | { type: "Z"; menge: number; preis: number }
  | { type: "A"; menge: number };

export interface MaterialbewertungParams {
  buchungen: MaterialBuchung[];
}

export function generateMaterialbewertung(seed: number): MaterialbewertungParams {
  const rng = createRng(seed);
  const buchungen: MaterialBuchung[] = [];
  const ab = { menge: rngInt(rng, 100, 500), preis: rngInt(rng, 200, 600) / 10 };
  buchungen.push({ type: "AB", menge: ab.menge, preis: ab.preis });

  const numZugaenge = rngInt(rng, 3, 4);
  const numAbgaenge = rngInt(rng, 3, 4);
  // Interleave: alternate Z, A, Z, A...
  let stock = ab.menge;
  let lastPrice = ab.preis;
  const events: MaterialBuchung[] = [];
  let zLeft = numZugaenge;
  let aLeft = numAbgaenge;

  while (zLeft > 0 || aLeft > 0) {
    // Decide next op: prefer Z if low stock or if alternating
    const doZ =
      zLeft > 0 &&
      (aLeft === 0 || stock < 80 || (events.length % 2 === 0 && zLeft > 0));
    if (doZ) {
      const drift = (rngInt(rng, -5, 5) / 100) * lastPrice;
      const preis = Math.max(1, Math.round((lastPrice + drift) * 10) / 10);
      const menge = rngInt(rng, 100, 400);
      events.push({ type: "Z", menge, preis });
      stock += menge;
      lastPrice = preis;
      zLeft--;
    } else if (aLeft > 0) {
      const max = Math.max(20, Math.floor(stock * 0.6));
      const menge = rngInt(rng, 50, max);
      events.push({ type: "A", menge });
      stock -= menge;
      aLeft--;
    } else {
      break;
    }
  }
  buchungen.push(...events);
  return { buchungen };
}
