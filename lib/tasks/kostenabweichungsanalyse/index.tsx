import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generateKostenabweichung,
  type KostenabwParams,
} from "./generate";
import {
  solveKostenabweichung,
  type KostenabwSolution,
} from "./solve";
import {
  checkKostenabweichung,
  type KostenabwAnswer,
} from "./check";
import {
  KostenabweichungComponent,
  KostenabweichungSolutionView,
} from "./Component";
import { buildKostenabweichungPrompt } from "./prompt";
import { validateKostenabweichungInput } from "./validate";

export const kostenabweichungsanalyseTask: TaskDefinition<
  KostenabwParams,
  KostenabwSolution,
  KostenabwAnswer
> = {
  kind: "kostenabweichungsanalyse",
  tutorium: "Tutorium 5 · Aufgabe 5.5",
  title: "Kostenabweichungsanalyse",
  description:
    "Über-/Unterdeckung von Gemeinkosten bestimmen und Writeoff Approach anwenden.",
  schemaVersion: 1,
  generate: generateKostenabweichung,
  solve: solveKostenabweichung,
  check: checkKostenabweichung,
  Component: KostenabweichungComponent,
  renderSolution: (_params, solution) => (
    <KostenabweichungSolutionView solution={solution} />
  ),
  buildPrompt: buildKostenabweichungPrompt,
  validateRawInput: validateKostenabweichungInput,
};
