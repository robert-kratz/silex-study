import type { TaskDefinition } from "@/lib/tasks/types";
import { generateGkvUkv, type GkvUkvParams } from "./generate";
import { solveGkvUkv, type GkvUkvSolution } from "./solve";
import { checkGkvUkv, type GkvUkvAnswer } from "./check";
import { GkvUkvComponent, GkvUkvSolutionView } from "./Component";
import { buildGkvUkvPrompt } from "./prompt";
import { validateGkvUkvInput } from "./validate";

export const gkvUkvTask: TaskDefinition<GkvUkvParams, GkvUkvSolution, GkvUkvAnswer> = {
  kind: "gkv-ukv",
  tutorium: "Tutorium 8 · Aufgabe 8.1",
  title: "GKV vs. UKV",
  description:
    "Periodenerfolg nach Gesamtkosten- und Umsatzkostenverfahren – beide Verfahren liefern denselben Gewinn.",
  schemaVersion: 1,
  generate: generateGkvUkv,
  solve: solveGkvUkv,
  check: checkGkvUkv,
  Component: GkvUkvComponent,
  renderSolution: (params, solution) => (
    <GkvUkvSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildGkvUkvPrompt,
  validateRawInput: validateGkvUkvInput,
};
