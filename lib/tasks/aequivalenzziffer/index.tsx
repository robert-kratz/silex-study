import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generateAequivalenzziffer,
  type AequivalenzzifferParams,
} from "./generate";
import {
  solveAequivalenzziffer,
  type AequivalenzzifferSolution,
} from "./solve";
import {
  checkAequivalenzziffer,
  type AequivalenzzifferAnswer,
} from "./check";
import {
  AequivalenzzifferComponent,
  AequivalenzzifferSolutionView,
} from "./Component";
import { buildAequivalenzzifferPrompt } from "./prompt";
import { validateAequivalenzzifferInput } from "./validate";

export const aequivalenzzifferTask: TaskDefinition<
  AequivalenzzifferParams,
  AequivalenzzifferSolution,
  AequivalenzzifferAnswer
> = {
  kind: "aequivalenzziffer",
  tutorium: "Tutorium 7 · Aufgabe 7.1",
  title: "Äquivalenzziffernrechnung",
  description:
    "Sortenfertigung: Äquivalenzziffer, Schlüsselzahl und Stückkosten je Sorte berechnen.",
  schemaVersion: 1,
  generate: generateAequivalenzziffer,
  solve: solveAequivalenzziffer,
  check: checkAequivalenzziffer,
  Component: AequivalenzzifferComponent,
  renderSolution: (params, solution) => (
    <AequivalenzzifferSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildAequivalenzzifferPrompt,
  validateRawInput: validateAequivalenzzifferInput,
};
