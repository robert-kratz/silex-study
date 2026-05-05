import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { TarifwahlParams } from "./generate";

export function buildTarifwahlPrompt(p: TarifwahlParams): string {
  const lines = [
    "# Aufgabe: Tarifwahl & Kostenvergleich",
    "",
    "Drei Tarife stehen zur Auswahl:",
    "",
    "| Tarif | Grundgebühr | Variable Kosten / Stück |",
    "| --- | --- | --- |",
    `| A | ${eur(p.tarife.A.fix)} | ${eur(p.tarife.A.vk)} |`,
    `| B | ${eur(p.tarife.B.fix)} | ${eur(p.tarife.B.vk)} |`,
    `| C | ${eur(p.tarife.C.fix)} | ${eur(p.tarife.C.vk)} |`,
    "",
    `Für die Mengen ${p.mengen.map(fmt).join(", ")} Stück:`,
    "1. Wähle den günstigsten Tarif.",
    "2. Berechne die Stückkosten (k = K / x).",
    "",
    "Gib alle Zwischenschritte und Endergebnisse mit zwei Nachkommastellen an.",
  ];
  return lines.join("\n");
}
