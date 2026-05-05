import type { TaskDefinition } from "@/lib/tasks/types";
import { generateVollTeilkosten, type VollTeilkostenParams } from "./generate";
import { solveVollTeilkosten, type VollTeilkostenSolution } from "./solve";
import { checkVollTeilkosten, type VollTeilkostenAnswer } from "./check";
import { VollTeilkostenComponent, VollTeilkostenSolutionView } from "./Component";
import { buildVollTeilkostenPrompt } from "./prompt";
import { validateVollTeilkostenInput } from "./validate";

export const vollTeilkostenTask: TaskDefinition<
  VollTeilkostenParams,
  VollTeilkostenSolution,
  VollTeilkostenAnswer
> = {
  kind: "voll-teilkosten",
  tutorium: "Tutorium 8 · Aufgabe 8.2",
  title: "Voll- vs. Teilkostenrechnung",
  description:
    "Gewinnvergleich: bei Lageraufbau ergibt die Vollkostenrechnung einen höheren Gewinn als die Teilkostenrechnung.",
  schemaVersion: 1,
  generate: generateVollTeilkosten,
  solve: solveVollTeilkosten,
  check: checkVollTeilkosten,
  Component: VollTeilkostenComponent,
  renderSolution: (_params, solution) => (
    <VollTeilkostenSolutionView solution={solution} />
  ),
  buildPrompt: buildVollTeilkostenPrompt,
  validateRawInput: validateVollTeilkostenInput,
};
