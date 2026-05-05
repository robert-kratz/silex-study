import { createRng, rngInt } from "@/lib/random";

export interface DbProdukt {
  id: string;
  name: string;
  preis: number;
  menge: number;
  kVar: number;
  produktFix: number;
}

export interface DbProduktgruppe {
  id: string;
  name: string;
  pgFix: number;
  produkte: DbProdukt[];
}

export interface DbSparte {
  id: string;
  name: string;
  sparteFix: number;
  gruppen: DbProduktgruppe[];
}

export interface DbStufenParams {
  sparten: DbSparte[];
  unternehmenFix: number;
  /** Wahre Antwort für die Sortimentsfrage: id eines Produkts mit DB I < 0, oder "keines". */
  eliminieren: string;
}

export function generateDbStufen(seed: number): DbStufenParams {
  const rng = createRng(seed);
  // 30% chance, dass ein Produkt einen negativen DB I hat
  const negIdx = rng() < 0.3 ? rngInt(rng, 0, 3) : -1;
  const produkte: DbProdukt[] = [];
  for (let i = 0; i < 4; i++) {
    const preis = rngInt(rng, 30, 120);
    const kVar =
      i === negIdx
        ? preis + rngInt(rng, 5, 25) // negativer DB I
        : rngInt(rng, 8, Math.max(9, preis - 5));
    produkte.push({
      id: `P${i + 1}`,
      name: `Produkt ${i + 1}`,
      preis,
      menge: rngInt(rng, 200, 1500),
      kVar,
      produktFix: rngInt(rng, 1, 8) * 1000,
    });
  }
  const sparten: DbSparte[] = [
    {
      id: "S1",
      name: "Sparte 1",
      sparteFix: rngInt(rng, 5, 20) * 1000,
      gruppen: [
        {
          id: "G1",
          name: "Produktgruppe 1",
          pgFix: rngInt(rng, 3, 12) * 1000,
          produkte: [produkte[0], produkte[1]],
        },
      ],
    },
    {
      id: "S2",
      name: "Sparte 2",
      sparteFix: rngInt(rng, 5, 20) * 1000,
      gruppen: [
        {
          id: "G2",
          name: "Produktgruppe 2",
          pgFix: rngInt(rng, 3, 12) * 1000,
          produkte: [produkte[2], produkte[3]],
        },
      ],
    },
  ];
  return {
    sparten,
    unternehmenFix: rngInt(rng, 10, 30) * 1000,
    eliminieren: negIdx >= 0 ? produkte[negIdx].id : "keines",
  };
}
