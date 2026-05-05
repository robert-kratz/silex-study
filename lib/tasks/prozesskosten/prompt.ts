import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { ProzesskostenParams } from "./generate";

export function buildProzesskostenPrompt(p: ProzesskostenParams): string {
  const prozHead = p.prozesse.map((x) => x.name).join(" | ");
  const lines: string[] = [
    "# Aufgabe: Prozesskostenrechnung",
    "",
    "Prozesse:",
    "",
    "| Prozess | Prozesskosten | Prozessmenge |",
    "| --- | --- | --- |",
    ...p.prozesse.map((x) => `| ${x.name} | ${eur(x.K)} | ${fmt(x.M)} |`),
    "",
    "Inanspruchnahme der Prozesse durch Aufträge:",
    "",
    `| Auftrag | ${prozHead} |`,
    `| --- | ${p.prozesse.map(() => "---").join(" | ")} |`,
    ...p.auftraege.map(
      (a) =>
        `| ${a.name} | ${a.inanspruchnahme.map((m) => fmt(m)).join(" | ")} |`,
    ),
    "",
    "Berechne:",
    "1. Prozesskostensatz PKS_p = K_p / M_p",
    "2. Auftragskosten A = Σ_p PKS_p · m_{p,A}",
  ];
  return lines.join("\n");
}
