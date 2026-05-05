import type { TaskDefinition } from "@/lib/tasks/types";
import { generateKuppelMarktwert, type KuppelMarktwertParams } from "./generate";
import { solveKuppelMarktwert, type KuppelMarktwertSolution } from "./solve";
import { checkKuppelMarktwert, type KuppelMarktwertAnswer } from "./check";
import { KuppelMarktwertComponent, KuppelMarktwertSolutionView } from "./Component";
import { buildKuppelMarktwertPrompt } from "./prompt";
import { validateKuppelMarktwertInput } from "./validate";

export const kuppelMarktwertTask: TaskDefinition<
  KuppelMarktwertParams,
  KuppelMarktwertSolution,
  KuppelMarktwertAnswer
> = {
  kind: "kuppel-marktwert",
  tutorium: "Tutorium 7 · Aufgabe 7.3",
  title: "Kuppelproduktion – Marktwertmethode",
  description:
    "Kuppelkosten im Verhältnis der Markterlöse auf gleichberechtigte Produkte verteilen.",
  schemaVersion: 1,
  generate: generateKuppelMarktwert,
  solve: solveKuppelMarktwert,
  check: checkKuppelMarktwert,
  Component: KuppelMarktwertComponent,
  renderSolution: (params, solution) => (
    <KuppelMarktwertSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildKuppelMarktwertPrompt,
  validateRawInput: validateKuppelMarktwertInput,
};
