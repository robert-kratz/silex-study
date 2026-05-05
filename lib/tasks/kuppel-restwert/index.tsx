import type { TaskDefinition } from "@/lib/tasks/types";
import { generateKuppelRestwert, type KuppelRestwertParams } from "./generate";
import { solveKuppelRestwert, type KuppelRestwertSolution } from "./solve";
import { checkKuppelRestwert, type KuppelRestwertAnswer } from "./check";
import { KuppelRestwertComponent, KuppelRestwertSolutionView } from "./Component";
import { buildKuppelRestwertPrompt } from "./prompt";
import { validateKuppelRestwertInput } from "./validate";

export const kuppelRestwertTask: TaskDefinition<
  KuppelRestwertParams,
  KuppelRestwertSolution,
  KuppelRestwertAnswer
> = {
  kind: "kuppel-restwert",
  tutorium: "Tutorium 7 · Aufgabe 7.2",
  title: "Kuppelproduktion – Restwertmethode",
  description:
    "Erlöse der Nebenprodukte reduzieren die Kosten des Hauptprodukts; Stückkosten Hauptprodukt berechnen.",
  schemaVersion: 1,
  generate: generateKuppelRestwert,
  solve: solveKuppelRestwert,
  check: checkKuppelRestwert,
  Component: KuppelRestwertComponent,
  renderSolution: (params, solution) => (
    <KuppelRestwertSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildKuppelRestwertPrompt,
  validateRawInput: validateKuppelRestwertInput,
};
