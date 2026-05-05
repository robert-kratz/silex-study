import { createRng, rngInt } from "@/lib/random";

export interface Prozess {
  name: string;
  /** Gesamte Prozesskosten (€). */
  K: number;
  /** Gesamte Prozessmenge (Cost-Driver-Einheiten). */
  M: number;
}

export interface Auftrag {
  name: string;
  /** Anzahl Cost-Driver-Einheiten je Prozess (gleiche Reihenfolge wie prozesse). */
  inanspruchnahme: number[];
}

export interface ProzesskostenParams {
  prozesse: Prozess[];
  auftraege: Auftrag[];
}

export function generateProzesskosten(seed: number): ProzesskostenParams {
  const rng = createRng(seed);
  const prozesse: Prozess[] = [
    { name: "Bestellabwicklung", K: rngInt(rng, 30, 90) * 1000, M: rngInt(rng, 200, 800) },
    { name: "Materialprüfung", K: rngInt(rng, 20, 60) * 1000, M: rngInt(rng, 150, 600) },
    { name: "Fertigungssteuerung", K: rngInt(rng, 40, 120) * 1000, M: rngInt(rng, 250, 1000) },
  ];
  const auftraege: Auftrag[] = [
    {
      name: "Auftrag 1",
      inanspruchnahme: [rngInt(rng, 5, 30), rngInt(rng, 3, 20), rngInt(rng, 8, 40)],
    },
    {
      name: "Auftrag 2",
      inanspruchnahme: [rngInt(rng, 10, 50), rngInt(rng, 6, 30), rngInt(rng, 15, 60)],
    },
  ];
  return { prozesse, auftraege };
}
